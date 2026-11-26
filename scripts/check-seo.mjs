import { readFile, access } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve(process.env.DIST_DIR ?? "dist");
const siteUrl = new URL(
  process.env.SITE_URL ?? "https://herdianurdin.my.id",
);
const errors = [];
let checkedAlternates = 0;

function fail(message) {
  errors.push(message);
}

async function readText(filePath, label) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    fail(`Cannot read ${label}: ${detail}`);
    return "";
  }
}

function parseAttributes(tag) {
  const attributes = {};
  const pattern = /([:\w-]+)\s*=\s*(["'])(.*?)\2/g;
  for (const match of tag.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = match[3];
  }
  return attributes;
}

function getLinkTags(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => {
    const tag = match[0];
    return { tag, attributes: parseAttributes(tag) };
  });
}

function getMetaTags(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => ({
    tag: match[0],
    attributes: parseAttributes(match[0]),
  }));
}

function decodeXml(value) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");
}

function toOutputPath(urlValue) {
  const url = new URL(urlValue);
  if (url.origin !== siteUrl.origin) {
    throw new Error(`URL belongs to a different origin: ${url.href}`);
  }

  const relativePath = decodeURIComponent(url.pathname)
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  const outputPath = relativePath && /\.[a-z0-9]+$/i.test(relativePath)
    ? path.resolve(distDir, relativePath)
    : path.resolve(distDir, relativePath, "index.html");

  if (outputPath !== distDir && !outputPath.startsWith(`${distDir}${path.sep}`)) {
    throw new Error(`URL resolves outside dist/: ${url.href}`);
  }

  return outputPath;
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadPage(urlValue) {
  const filePath = toOutputPath(urlValue);
  if (!(await fileExists(filePath))) {
    throw new Error(`No built HTML/file for ${urlValue} (expected ${filePath})`);
  }

  const html = await readText(filePath, `page ${urlValue}`);
  const canonicalTags = getLinkTags(html).filter(
    ({ attributes }) => attributes.rel?.toLowerCase() === "canonical",
  );

  if (canonicalTags.length !== 1) {
    fail(`${urlValue}: expected exactly one canonical link, found ${canonicalTags.length}`);
  }

  const canonicalValue = canonicalTags[0]?.attributes.href;
  if (!canonicalValue) {
    fail(`${urlValue}: canonical link has no href`);
  }

  const robotsTags = getMetaTags(html).filter(
    ({ attributes }) => attributes.name?.toLowerCase() === "robots",
  );
  const isNoindex = robotsTags.some(({ attributes }) =>
    attributes.content?.toLowerCase().includes("noindex"),
  );

  const language = (html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i) ?? [])[1]
    ?.toLowerCase();

  return {
    url: new URL(urlValue),
    filePath,
    html,
    language,
    canonical: canonicalValue ? new URL(canonicalValue, siteUrl) : null,
    isNoindex,
    links: getLinkTags(html),
  };
}

async function main() {
  const robotsPath = path.join(distDir, "robots.txt");
  const robots = await readText(robotsPath, "dist/robots.txt");
  const sitemapLine = robots
    .split(/\r?\n/)
    .find((line) => /^\s*sitemap\s*:/i.test(line));

  if (!sitemapLine) {
    fail("robots.txt does not declare a Sitemap URL");
  }

  let sitemapUrl;
  if (sitemapLine) {
    const value = sitemapLine.replace(/^\s*sitemap\s*:\s*/i, "").trim();
    try {
      sitemapUrl = new URL(value);
      if (sitemapUrl.origin !== siteUrl.origin) {
        fail(`robots.txt sitemap has an unexpected origin: ${sitemapUrl.origin}`);
      }
    } catch {
      fail(`robots.txt contains an invalid sitemap URL: ${value}`);
    }
  }

  const sitemapFile = sitemapUrl
    ? path.resolve(distDir, decodeURIComponent(sitemapUrl.pathname).replace(/^\/+/, ""))
    : path.join(distDir, "sitemap.xml");

  if (sitemapFile !== distDir && !sitemapFile.startsWith(`${distDir}${path.sep}`)) {
    fail("robots.txt sitemap path resolves outside dist/");
  }

  const sitemap = await readText(sitemapFile, "sitemap referenced by robots.txt");
  if (!/<urlset\b/i.test(sitemap) || !/<\/urlset>/i.test(sitemap)) {
    fail("Sitemap does not contain a complete urlset element");
  }

  const locations = [...sitemap.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)]
    .map((match) => decodeXml(match[1].trim()));

  if (locations.length === 0) {
    fail("Sitemap has no loc entries");
  }

  const duplicates = locations.filter(
    (value, index) => locations.indexOf(value) !== index,
  );
  for (const duplicate of new Set(duplicates)) {
    fail(`Duplicate sitemap URL: ${duplicate}`);
  }

  for (const location of locations) {
    const pathname = new URL(location).pathname;
    if (pathname !== "/" && !pathname.endsWith("/")) {
      fail(`Sitemap URL must end with a trailing slash: ${location}`);
    }
  }

  for (const location of locations) {
    let page;
    try {
      page = await loadPage(location);
    } catch (error) {
      fail(error instanceof Error ? error.message : String(error));
      continue;
    }

    if (page.isNoindex) {
      fail(`${location}: noindex page must not be listed in sitemap`);
    }

    if (!page.canonical) continue;

    if (page.canonical.origin !== siteUrl.origin) {
      fail(`${location}: canonical uses a different origin (${page.canonical.origin})`);
    }

    if (page.canonical.pathname !== "/" && !page.canonical.pathname.endsWith("/")) {
      fail(`${location}: canonical URL must end with a trailing slash (${page.canonical.href})`);
    }

    if (page.canonical.href !== page.url.href) {
      fail(`${location}: sitemap URL does not match canonical (${page.canonical.href})`);
    }

    for (const { attributes } of page.links) {
      if (attributes.rel?.toLowerCase() !== "alternate" || !attributes.hreflang) {
        continue;
      }

      let alternateUrl;
      try {
        alternateUrl = new URL(attributes.href, siteUrl);
      } catch {
        fail(`${location}: invalid hreflang URL (${attributes.href ?? "missing"})`);
        continue;
      }

      if (alternateUrl.origin !== siteUrl.origin) {
        fail(`${location}: hreflang ${attributes.hreflang} points off-site`);
        continue;
      }

      if (alternateUrl.pathname !== "/" && !alternateUrl.pathname.endsWith("/")) {
        fail(`${location}: hreflang ${attributes.hreflang} URL must end with a trailing slash`);
      }

      checkedAlternates += 1;
      let alternatePage;
      try {
        alternatePage = await loadPage(alternateUrl.href);
      } catch (error) {
        fail(`${location}: hreflang ${attributes.hreflang} target is missing: ${error instanceof Error ? error.message : String(error)}`);
        continue;
      }

      if (alternatePage.canonical && alternatePage.canonical.href !== alternateUrl.href) {
        fail(`${location}: hreflang target ${alternateUrl.href} is not its own canonical`);
      }

      if (
        attributes.hreflang !== "x-default" &&
        page.language &&
        !alternatePage.links.some(({ attributes: back }) =>
          back.rel?.toLowerCase() === "alternate" &&
          back.hreflang?.toLowerCase() === page.language &&
          back.href && new URL(back.href, siteUrl).href === page.url.href,
        )
      ) {
        fail(`${location}: hreflang ${attributes.hreflang} target does not link back to ${page.url.href}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error(`SEO validation failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `SEO validation passed: ${locations.length} sitemap URLs and ${checkedAlternates} hreflang links checked.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
