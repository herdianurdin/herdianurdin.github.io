import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const distDir = path.resolve(process.argv[2] ?? "dist");
const siteOrigin = "https://herdianurdin.my.id";
const sitemapPath = path.join(distDir, "sitemap.xml");
const errors = [];
let pagesChecked = 0;
let articlesChecked = 0;

function readAttributes(tag) {
  const attributes = {};
  const pattern = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match;

  while ((match = pattern.exec(tag)) !== null) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? "";
  }

  return attributes;
}

function collectMeta(html) {
  const values = new Map();
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of tags) {
    const attributes = readAttributes(tag);
    const key = attributes.property ?? attributes.name;
    if (!key) continue;
    const normalizedKey = key.toLowerCase();
    const list = values.get(normalizedKey) ?? [];
    list.push(attributes.content ?? "");
    values.set(normalizedKey, list);
  }

  return values;
}

function one(meta, key, label) {
  const values = meta.get(key) ?? [];
  if (values.length !== 1 || !values[0].trim()) {
    errors.push(`${label}: expected exactly one non-empty ${key}; found ${values.length}`);
    return "";
  }
  return values[0].trim();
}

function compare(meta, first, second, label) {
  const firstValue = one(meta, first, label);
  const secondValue = one(meta, second, label);
  if (firstValue && secondValue && firstValue !== secondValue) {
    errors.push(`${label}: ${first} does not match ${second}`);
  }
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

async function getSitemapUrls() {
  let xml;
  try {
    xml = await fs.readFile(sitemapPath, "utf8");
  } catch {
    throw new Error(`sitemap.xml not found in ${distDir}; build the site before running this validator.`);
  }

  if (/<sitemapindex\b/i.test(xml)) {
    throw new Error("Expected Astro's sitemap.xml URL set, but received a sitemap index.");
  }

  const urls = [...xml.matchAll(/<loc\b[^>]*>\s*([\s\S]*?)\s*<\/loc>/gi)]
    .map((match) => decodeXml(match[1].trim()))
    .filter(Boolean);

  if (urls.length === 0) {
    throw new Error("No <loc> entries found in sitemap.xml.");
  }

  const seen = new Set();
  for (const url of urls) {
    if (seen.has(url)) errors.push(`sitemap.xml: duplicate URL entry ${url}`);
    seen.add(url);
  }

  return urls;
}

async function resolvePageFile(pageUrl) {
  let url;
  try {
    url = new URL(pageUrl);
  } catch {
    throw new Error(`Invalid URL in sitemap.xml: ${pageUrl}`);
  }

  if (url.origin !== siteOrigin) {
    throw new Error(`Unexpected sitemap origin for ${pageUrl}; expected ${siteOrigin}.`);
  }

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(url.pathname);
  } catch {
    throw new Error(`Invalid encoded path in sitemap URL: ${pageUrl}`);
  }

  const relativePath = decodedPath.replace(/^\/+/, "");
  const candidates = decodedPath.endsWith("/") || relativePath === ""
    ? [path.resolve(distDir, relativePath, "index.html")]
    : [
        path.resolve(distDir, relativePath, "index.html"),
        path.resolve(distDir, `${relativePath}.html`),
        path.resolve(distDir, relativePath),
      ];

  for (const candidate of candidates) {
    if (candidate !== distDir && !candidate.startsWith(`${distDir}${path.sep}`)) continue;
    try {
      const stat = await fs.stat(candidate);
      if (stat.isFile()) return candidate;
    } catch {
      // Try the next static-output convention.
    }
  }

  throw new Error(`No built HTML file found for sitemap URL ${pageUrl}.`);
}

async function checkImage(imageValue, label) {
  let imageUrl;
  try {
    imageUrl = new URL(imageValue);
  } catch {
    errors.push(`${label}: og:image is not an absolute URL (${imageValue})`);
    return;
  }

  if (imageUrl.protocol !== "https:") {
    errors.push(`${label}: og:image must use HTTPS (${imageUrl.href})`);
    return;
  }

  if (imageUrl.origin !== siteOrigin) return;

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(imageUrl.pathname);
  } catch {
    errors.push(`${label}: og:image contains an invalid encoded path`);
    return;
  }

  const imagePath = path.resolve(distDir, `.${decodedPath}`);
  if (!imagePath.startsWith(`${distDir}${path.sep}`)) {
    errors.push(`${label}: og:image path escapes the dist directory`);
    return;
  }

  try {
    const stat = await fs.stat(imagePath);
    if (!stat.isFile()) errors.push(`${label}: og:image is not a file (${decodedPath})`);
  } catch {
    errors.push(`${label}: local og:image file is missing (${decodedPath})`);
  }
}

try {
  const sitemapUrls = await getSitemapUrls();

  for (const pageUrl of sitemapUrls) {
    const file = await resolvePageFile(pageUrl);
    const label = path.relative(distDir, file);
    const html = await fs.readFile(file, "utf8");
    const meta = collectMeta(html);

    const ogType = one(meta, "og:type", label);
    const ogUrl = one(meta, "og:url", label);
    one(meta, "og:title", label);
    one(meta, "og:description", label);
    const ogImage = one(meta, "og:image", label);
    one(meta, "og:image:alt", label);
    one(meta, "og:site_name", label);
    const locale = one(meta, "og:locale", label);

    const twitterCard = one(meta, "twitter:card", label);
    compare(meta, "og:url", "twitter:url", label);
    compare(meta, "og:title", "twitter:title", label);
    compare(meta, "og:description", "twitter:description", label);
    compare(meta, "og:image", "twitter:image", label);

    if (twitterCard !== "summary_large_image") {
      errors.push(`${label}: expected twitter:card=summary_large_image, found ${twitterCard || "(empty)"}`);
    }

    const htmlLanguage = html.match(/<html\b[^>]*\blang=["'](id|en)["']/i)?.[1]?.toLowerCase();
    const expectedLocale = htmlLanguage === "id" ? "id_ID" : htmlLanguage === "en" ? "en_US" : null;
    if (expectedLocale && locale !== expectedLocale) {
      errors.push(`${label}: og:locale=${locale || "(empty)"}, expected ${expectedLocale} from html lang`);
    } else if (!expectedLocale) {
      errors.push(`${label}: html lang must be id or en for social locale validation`);
    }

    if (ogUrl) {
      const canonicalTag = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0];
      const canonicalUrl = canonicalTag ? readAttributes(canonicalTag).href : "";
      if (!canonicalUrl) {
        errors.push(`${label}: canonical link is missing`);
      } else if (canonicalUrl !== ogUrl) {
        errors.push(`${label}: og:url does not match canonical URL`);
      }
    }

    if (ogImage) await checkImage(ogImage, label);

    if (ogType === "article") {
      articlesChecked += 1;
      one(meta, "article:published_time", label);
      one(meta, "article:author", label);
    }

    pagesChecked += 1;
  }
} catch (error) {
  console.error(`Social metadata validation could not run: ${error.message}`);
  process.exit(2);
}

if (errors.length > 0) {
  console.error(`Social metadata validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Social metadata validation passed: ${pagesChecked} sitemap pages checked, including ${articlesChecked} article pages.`,
);
