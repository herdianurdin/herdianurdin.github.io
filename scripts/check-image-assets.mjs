import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { readImageDimensions } from "./rehype-local-image-attributes.mjs";

const distDir = path.resolve(process.env.DIST_DIR ?? "dist");
const siteUrl = new URL(process.env.SITE_URL ?? "https://herdianurdin.my.id");
const errors = [];
const warnings = [];
const checkedAssets = new Map();
let imageOccurrences = 0;
let responsiveCandidates = 0;
let externalImages = 0;
let pagesChecked = 0;

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function parseAttributes(tag) {
  const attributes = {};
  const pattern = /([:\w-]+)\s*=\s*(["'])(.*?)\2/g;
  for (const match of tag.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = match[3];
  }
  return attributes;
}

function decodeXml(value) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");
}

function pageOutputPath(value) {
  const url = new URL(value);
  if (url.origin !== siteUrl.origin) throw new Error(`Sitemap URL has unexpected origin: ${url.href}`);

  const relative = decodeURIComponent(url.pathname).replace(/^\/+/, "").replace(/\/+$/, "");
  const filePath = relative && /\.[a-z\d]+$/i.test(relative)
    ? path.resolve(distDir, relative)
    : path.resolve(distDir, relative, "index.html");

  if (filePath !== distDir && !filePath.startsWith(`${distDir}${path.sep}`)) {
    throw new Error(`Page URL resolves outside dist/: ${url.href}`);
  }
  return filePath;
}

function assetOutputPath(src, pageUrl) {
  let url;
  try {
    url = new URL(src, pageUrl);
  } catch {
    throw new Error(`Invalid image URL: ${src}`);
  }

  if (url.origin !== siteUrl.origin) return { external: true, url };

  const pathname = decodeURIComponent(url.pathname);
  const filePath = path.resolve(distDir, `.${pathname}`);
  if (filePath !== distDir && !filePath.startsWith(`${distDir}${path.sep}`)) {
    throw new Error(`Image URL resolves outside dist/: ${url.href}`);
  }
  return { external: false, url, filePath };
}

function expectedFormat(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ({
    ".webp": "webp",
    ".png": "png",
    ".jpg": "jpeg",
    ".jpeg": "jpeg",
    ".gif": "gif",
    ".svg": "svg",
    ".avif": "avif",
  })[ext] ?? null;
}

async function readSitemap() {
  const robots = await readFile(path.join(distDir, "robots.txt"), "utf8");
  const sitemapLine = robots.split(/\r?\n/).find((line) => /^\s*sitemap\s*:/i.test(line));
  if (!sitemapLine) throw new Error("dist/robots.txt does not declare a Sitemap URL");

  const sitemapUrl = new URL(sitemapLine.replace(/^\s*sitemap\s*:\s*/i, "").trim());
  if (sitemapUrl.origin !== siteUrl.origin) throw new Error(`Unexpected sitemap origin: ${sitemapUrl.origin}`);

  const sitemapPath = path.resolve(distDir, decodeURIComponent(sitemapUrl.pathname).replace(/^\/+/, ""));
  if (!sitemapPath.startsWith(`${distDir}${path.sep}`)) throw new Error("Sitemap path resolves outside dist/");

  const xml = await readFile(sitemapPath, "utf8");
  if (!/<urlset\b/i.test(xml) || !/<\/urlset>/i.test(xml)) {
    throw new Error("Expected a sitemap urlset. Sitemap index files are not supported by this checker yet.");
  }

  return [...xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)]
    .map((match) => decodeXml(match[1].trim()));
}

async function checkAssetUrl(src, pageUrl, label, { requireDimensions = true } = {}) {
  let resolved;
  try {
    resolved = assetOutputPath(src, pageUrl);
  } catch (error) {
    fail(`${label}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }

  if (resolved.external) {
    externalImages += 1;
    return null;
  }

  const key = resolved.url.href;
  let asset = checkedAssets.get(key);
  if (!asset) {
    try {
      await access(resolved.filePath);
      const fileStat = await stat(resolved.filePath);
      const dimensions = readImageDimensions(resolved.filePath);
      asset = {
        size: fileStat.size,
        dimensions,
        format: expectedFormat(resolved.filePath),
      };
      checkedAssets.set(key, asset);

      if (fileStat.size > 400 * 1024) {
        warn(`${resolved.url.pathname}: ${(fileStat.size / 1024).toFixed(1)} KiB; consider compression or a smaller responsive variant`);
      }
    } catch {
      fail(`${label}: image file does not exist in dist/: ${resolved.url.pathname}`);
      return null;
    }
  }

  if (requireDimensions) {
    if (!asset.dimensions || !(asset.dimensions.width > 0) || !(asset.dimensions.height > 0)) {
      fail(`${label}: cannot read intrinsic image dimensions for ${resolved.url.pathname}`);
    } else if (asset.format && asset.dimensions.format !== asset.format) {
      fail(`${label}: file extension indicates ${asset.format}, but file content is ${asset.dimensions.format}: ${resolved.url.pathname}`);
    }
  } else if (asset.format === "avif") {
    try {
      const header = await readFile(resolved.filePath);
      const isAvif = header.toString("ascii", 4, 8) === "ftyp" && /avif|avis/.test(header.toString("ascii", 8, 24));
      if (!isAvif) fail(`${label}: .avif extension does not contain an AVIF file: ${resolved.url.pathname}`);
    } catch {
      fail(`${label}: could not read AVIF candidate: ${resolved.url.pathname}`);
    }
  } else if (asset.dimensions && asset.format && asset.dimensions.format !== asset.format) {
    fail(`${label}: file extension indicates ${asset.format}, but file content is ${asset.dimensions.format}: ${resolved.url.pathname}`);
  }

  return resolved;
}

function parseSrcset(value) {
  return value
    .split(",")
    .map((candidate) => candidate.trim().split(/\s+/))
    .filter((parts) => parts[0])
    .map(([url, descriptor]) => ({ url, descriptor: descriptor ?? "" }));
}

async function checkResponsiveSrcset(attrs, pageUrl, label) {
  if (!attrs.srcset?.trim()) return;
  const candidates = parseSrcset(attrs.srcset);
  if (candidates.length === 0) {
    fail(`${label}: srcset is present but contains no valid candidates`);
    return;
  }
  if (candidates.some((candidate) => /\d+w$/.test(candidate.descriptor)) && !attrs.sizes?.trim()) {
    fail(`${label}: width-descriptor srcset is missing a sizes attribute`);
  }
  for (const candidate of candidates) {
    responsiveCandidates += 1;
    await checkAssetUrl(candidate.url, pageUrl, `${label} srcset candidate`, { requireDimensions: false });
  }
}

function isInsideHiddenDecorativeAnchor(html, tagIndex) {
  const before = html.slice(0, tagIndex);
  const anchorOpenIndex = before.lastIndexOf("<a");
  const anchorCloseIndex = before.lastIndexOf("</a>");
  if (anchorOpenIndex < 0 || anchorCloseIndex > anchorOpenIndex) return false;

  const anchorTag = before.slice(anchorOpenIndex).match(/^<a\b[^>]*>/i)?.[0];
  if (!anchorTag) return false;
  const anchorAttrs = parseAttributes(anchorTag);
  return anchorAttrs["aria-hidden"] === "true" && anchorAttrs.tabindex === "-1";
}

async function checkImage(tag, pageUrl, pageFile, html, tagIndex) {
  imageOccurrences += 1;
  const attrs = parseAttributes(tag);
  const label = `${pageFile} (${pageUrl.pathname})`;
  const decorativeHidden = isInsideHiddenDecorativeAnchor(html, tagIndex);

  // HTML minification can remove alt="". Allow that only for the article-card
  // thumbnail link that is itself removed from the accessibility tree.
  if (!Object.hasOwn(attrs, "alt") && !decorativeHidden) {
    fail(`${label}: img is missing the alt attribute: ${tag.slice(0, 180)}`);
  }

  if (!attrs.src?.trim()) {
    fail(`${label}: img is missing a non-empty src attribute: ${tag.slice(0, 180)}`);
  } else {
    const resolved = await checkAssetUrl(attrs.src, pageUrl, label);
    if (resolved) {
      const width = Number(attrs.width);
      const height = Number(attrs.height);
      if (!(width > 0) || !(height > 0)) {
        fail(`${label}: local image is missing positive width and height attributes: ${resolved.url.pathname}`);
      }
      if (!attrs.loading) warn(`${label}: image has no loading attribute: ${resolved.url.pathname}`);
      if (!attrs.decoding) warn(`${label}: image has no decoding attribute: ${resolved.url.pathname}`);
    }
  }

  await checkResponsiveSrcset(attrs, pageUrl, `${label} <img>`);
}

async function checkSocialImages(html, pageUrl, pageFile) {
  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  const socialImages = metaTags
    .map(parseAttributes)
    .filter((attrs) => ["og:image", "twitter:image"].includes((attrs.property ?? attrs.name ?? "").toLowerCase()));

  if (socialImages.length === 0) {
    fail(`${pageFile} (${pageUrl.pathname}): no Open Graph or Twitter image metadata found`);
  }

  for (const attrs of socialImages) {
    const value = attrs.content?.trim();
    if (!value) {
      fail(`${pageFile} (${pageUrl.pathname}): social image metadata has empty content`);
      continue;
    }
    await checkAssetUrl(value, pageUrl, `${pageFile} (${pageUrl.pathname}) social preview`);
  }
}

async function main() {
  await access(distDir);
  const locations = await readSitemap();
  if (locations.length === 0) throw new Error("Sitemap contains no URL entries");

  for (const location of locations) {
    let pageUrl;
    let pageFile;
    try {
      pageUrl = new URL(location);
      pageFile = pageOutputPath(location);
      const html = await readFile(pageFile, "utf8");
      pagesChecked += 1;

      const tags = [...html.matchAll(/<img\b[^>]*>/gi)];
      for (const match of tags) await checkImage(match[0], pageUrl, pageFile, html, match.index ?? 0);
      const sourceTags = [...html.matchAll(/<source\b[^>]*>/gi)].map((match) => match[0]);
      for (const tag of sourceTags) {
        const attrs = parseAttributes(tag);
        if (!attrs.srcset) continue;
        const label = `${pageFile} (${pageUrl.pathname}) <source>`;
        const candidates = parseSrcset(attrs.srcset);
        if (attrs.type === "image/avif" && candidates.some((item) => !item.url.toLowerCase().endsWith(".avif"))) {
          fail(`${label}: AVIF source contains a non-AVIF srcset URL`);
        }
        await checkResponsiveSrcset(attrs, pageUrl, label);
      }
      await checkSocialImages(html, pageUrl, pageFile);
    } catch (error) {
      fail(`${location}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (errors.length > 0) {
    console.error(`Image asset validation failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    if (warnings.length > 0) {
      console.warn(`\nAdditional image warnings (${warnings.length}):`);
      for (const warning of warnings) console.warn(`- ${warning}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `Image asset validation passed: ${imageOccurrences} HTML image occurrence(s), ${responsiveCandidates} responsive srcset candidate(s), social preview metadata on ${pagesChecked} sitemap page(s), ${checkedAssets.size} unique local asset(s) checked.`,
  );
  console.log(`External images not checked: ${externalImages}.`);
  console.log(`Image warnings: ${warnings.length}.`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
