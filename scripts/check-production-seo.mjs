#!/usr/bin/env node

/**
 * Production SEO smoke test for a deployed Astro static site.
 * Run separately from `npm run build`; it intentionally checks the live site.
 *
 * Optional environment variables:
 *   SEO_BASE_URL=https://herdianurdin.my.id
 *   SEO_TIMEOUT_MS=15000
 *   SEO_CONCURRENCY=5
 */

const DEFAULT_BASE_URL = 'https://herdianurdin.my.id';
const BASE_URL = (process.env.SEO_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
const TIMEOUT_MS = Number.parseInt(process.env.SEO_TIMEOUT_MS || '15000', 10);
const CONCURRENCY = Math.max(1, Number.parseInt(process.env.SEO_CONCURRENCY || '5', 10));

const failures = [];
const warnings = [];
const results = {
  sitemapPages: 0,
  pagesChecked: 0,
  articlePages: 0,
  blogPostingPages: 0,
  uniqueOgImages: 0,
  imagesChecked: 0,
};

function fail(message) {
  failures.push(message);
  console.error(`FAIL  ${message}`);
}

function warn(message) {
  warnings.push(message);
  console.warn(`WARN  ${message}`);
}

function pass(message) {
  console.log(`PASS  ${message}`);
}

function normalizeUrl(value, base = BASE_URL) {
  try {
    return new URL(value, base).href;
  } catch {
    return null;
  }
}

function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
}

function readAttributes(tag) {
  const attrs = {};
  const pattern = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match;
  while ((match = pattern.exec(tag)) !== null) {
    attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attrs;
}

function tags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))]
    .map((match) => readAttributes(match[0]));
}

function getMeta(html, key, value) {
  return tags(html, 'meta').find((attrs) => attrs[key] === value)?.content?.trim() || '';
}

function getLink(html, predicate) {
  return tags(html, 'link').find(predicate) || null;
}

function getTitle(html) {
  return html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]
    ?.replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim() || '';
}

function extractJsonLd(html) {
  const scripts = [...html.matchAll(/<script\b([^>]*type\s*=\s*["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi)];
  const parsed = [];
  for (const match of scripts) {
    try {
      parsed.push(JSON.parse(match[2].trim()));
    } catch {
      fail('A JSON-LD script contains invalid JSON.');
    }
  }
  return parsed;
}

function containsType(value, expectedType) {
  if (Array.isArray(value)) return value.some((item) => containsType(item, expectedType));
  if (!value || typeof value !== 'object') return false;

  const type = value['@type'];
  if (type === expectedType || (Array.isArray(type) && type.includes(expectedType))) return true;
  return Object.values(value).some((child) => containsType(child, expectedType));
}

async function request(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { 'user-agent': 'SEO-Production-Verification/1.0' },
  });
  return response;
}

async function getText(url, label) {
  try {
    const response = await request(url);
    if (!response.ok) {
      fail(`${label}: HTTP ${response.status} (${response.url})`);
      return null;
    }
    return { response, text: await response.text() };
  } catch (error) {
    fail(`${label}: ${error.message}`);
    return null;
  }
}

function getSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)]
    .map((match) => decodeXml(match[1].trim()))
    .filter(Boolean);
}

function isArticlePath(pathname) {
  const match = pathname.match(/^\/(?:en\/)?blog\/([^/]+)\/$/);
  return Boolean(match && !/^\d+$/.test(match[1]));
}

async function mapWithConcurrency(items, limit, callback) {
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const current = index++;
      if (current >= items.length) return;
      await callback(items[current], current);
    }
  });
  await Promise.all(workers);
}

async function checkPage(pageUrl) {
  const fetched = await getText(pageUrl, `Page ${pageUrl}`);
  if (!fetched) return null;

  const { response, text: html } = fetched;
  const finalUrl = response.url;
  const parsedPage = new URL(pageUrl);
  const canonical = getLink(html, (attrs) => (attrs.rel || '').toLowerCase().split(/\s+/).includes('canonical'));
  const canonicalUrl = canonical?.href ? normalizeUrl(canonical.href, finalUrl) : null;
  const title = getTitle(html);
  const description = getMeta(html, 'name', 'description');
  const robots = getMeta(html, 'name', 'robots').toLowerCase();
  const ogTitle = getMeta(html, 'property', 'og:title');
  const ogDescription = getMeta(html, 'property', 'og:description');
  const ogType = getMeta(html, 'property', 'og:type');
  const ogUrl = getMeta(html, 'property', 'og:url');
  const ogImage = getMeta(html, 'property', 'og:image');
  const twitterCard = getMeta(html, 'name', 'twitter:card');
  const twitterTitle = getMeta(html, 'name', 'twitter:title');
  const twitterDescription = getMeta(html, 'name', 'twitter:description');
  const twitterImage = getMeta(html, 'name', 'twitter:image');

  if (response.status !== 200) fail(`${pageUrl}: expected HTTP 200, received ${response.status}`);
  if (!title) fail(`${pageUrl}: missing or empty <title>.`);
  if (!description) fail(`${pageUrl}: missing or empty meta description.`);
  if (!canonicalUrl) fail(`${pageUrl}: canonical link is missing or invalid.`);
  else if (canonicalUrl !== pageUrl) fail(`${pageUrl}: canonical mismatch; received ${canonicalUrl}`);
  if (robots.includes('noindex')) fail(`${pageUrl}: sitemap page is marked noindex.`);

  if (!ogTitle || !ogDescription || !ogType || !ogUrl || !ogImage) {
    fail(`${pageUrl}: one or more required Open Graph fields are missing.`);
  }
  if (ogUrl && normalizeUrl(ogUrl, finalUrl) !== pageUrl) {
    fail(`${pageUrl}: og:url does not match sitemap URL (${ogUrl}).`);
  }
  if (!twitterCard || !twitterTitle || !twitterDescription || !twitterImage) {
    fail(`${pageUrl}: one or more required Twitter Card fields are missing.`);
  }
  if (ogImage && twitterImage && normalizeUrl(ogImage, finalUrl) !== normalizeUrl(twitterImage, finalUrl)) {
    warn(`${pageUrl}: Twitter image differs from og:image.`);
  }

  const alternateLinks = tags(html, 'link').filter((attrs) =>
    (attrs.rel || '').toLowerCase().split(/\s+/).includes('alternate') && attrs.hreflang && attrs.href,
  );
  if (alternateLinks.length === 0) warn(`${pageUrl}: no hreflang alternate links found in live HTML.`);
  for (const alternate of alternateLinks) {
    const target = normalizeUrl(alternate.href, finalUrl);
    if (!target || !target.startsWith(`${BASE_URL}/`) && target !== `${BASE_URL}/`) {
      fail(`${pageUrl}: hreflang ${alternate.hreflang} points outside ${BASE_URL}.`);
    }
  }

  const article = isArticlePath(parsedPage.pathname);
  let hasBlogPosting = false;
  if (article) {
    results.articlePages += 1;
    const jsonLd = extractJsonLd(html);
    hasBlogPosting = jsonLd.some((item) => containsType(item, 'BlogPosting'));
    if (!hasBlogPosting) fail(`${pageUrl}: article page has no BlogPosting JSON-LD.`);
    else results.blogPostingPages += 1;
  }

  results.pagesChecked += 1;
  return { pageUrl, ogImage: ogImage ? normalizeUrl(ogImage, finalUrl) : null };
}

async function checkImage(imageUrl) {
  try {
    const response = await request(imageUrl);
    if (!response.ok) {
      fail(`Social preview image ${imageUrl}: HTTP ${response.status}`);
      return;
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().startsWith('image/')) {
      fail(`Social preview URL is not served as an image (${contentType || 'unknown content-type'}): ${imageUrl}`);
      return;
    }
    results.imagesChecked += 1;
  } catch (error) {
    fail(`Social preview image ${imageUrl}: ${error.message}`);
  }
}

async function check404() {
  const probe = `${BASE_URL}/__seo-production-probe-${Date.now()}__/`;
  try {
    const response = await request(probe);
    if (response.status !== 404) {
      warn(`Unknown-route probe returned HTTP ${response.status}, expected 404. Check hosting 404 behavior manually.`);
    } else {
      pass('Unknown URL returns HTTP 404.');
    }
  } catch (error) {
    warn(`Could not verify unknown-route response: ${error.message}`);
  }
}

async function main() {
  console.log(`Production SEO verification: ${BASE_URL}`);
  console.log(`Timeout: ${TIMEOUT_MS} ms | concurrency: ${CONCURRENCY}`);

  const robotsResult = await getText(`${BASE_URL}/robots.txt`, 'robots.txt');
  if (!robotsResult) return finish();
  const sitemapLine = robotsResult.text.match(/^\s*Sitemap:\s*(\S+)\s*$/im)?.[1];
  if (!sitemapLine) {
    fail('robots.txt does not declare a Sitemap URL.');
    return finish();
  }
  const declaredSitemap = normalizeUrl(sitemapLine);
  const expectedSitemap = `${BASE_URL}/sitemap.xml`;
  if (declaredSitemap !== expectedSitemap) fail(`robots.txt sitemap URL mismatch: ${declaredSitemap}`);
  else pass('robots.txt declares the expected sitemap URL.');

  const sitemapResult = await getText(expectedSitemap, 'sitemap.xml');
  if (!sitemapResult) return finish();
  const sitemapUrls = getSitemapUrls(sitemapResult.text);
  if (sitemapUrls.length === 0) {
    fail('sitemap.xml contains no <loc> entries.');
    return finish();
  }

  const uniqueUrls = [...new Set(sitemapUrls)];
  if (uniqueUrls.length !== sitemapUrls.length) warn(`sitemap.xml contains ${sitemapUrls.length - uniqueUrls.length} duplicate URL(s).`);
  for (const url of uniqueUrls) {
    const parsed = normalizeUrl(url);
    if (!parsed || !parsed.startsWith(`${BASE_URL}/`) && parsed !== `${BASE_URL}/`) {
      fail(`Sitemap contains a URL outside the configured site: ${url}`);
    }
    if (parsed && new URL(parsed).pathname !== '/' && !new URL(parsed).pathname.endsWith('/')) {
      fail(`Sitemap URL is missing trailing slash: ${url}`);
    }
  }

  results.sitemapPages = uniqueUrls.length;
  pass(`robots.txt and sitemap.xml reachable; ${uniqueUrls.length} unique sitemap URL(s) found.`);

  const pageResults = [];
  await mapWithConcurrency(uniqueUrls, CONCURRENCY, async (url) => {
    const result = await checkPage(url);
    if (result) pageResults.push(result);
  });

  const ogImages = [...new Set(pageResults.map((item) => item.ogImage).filter(Boolean))];
  results.uniqueOgImages = ogImages.length;
  await mapWithConcurrency(ogImages, CONCURRENCY, checkImage);

  if (results.pagesChecked === results.sitemapPages) {
    pass(`All ${results.pagesChecked} sitemap page(s) returned HTTP 200 and passed the required metadata checks.`);
  } else {
    fail(`Only ${results.pagesChecked}/${results.sitemapPages} sitemap page(s) could be checked.`);
  }
  if (results.articlePages > 0 && results.blogPostingPages === results.articlePages) {
    pass(`BlogPosting structured data found on all ${results.articlePages} detected article page(s).`);
  } else if (results.articlePages > 0) {
    fail(`BlogPosting structured data found on ${results.blogPostingPages}/${results.articlePages} detected article page(s).`);
  }
  if (results.imagesChecked === results.uniqueOgImages && results.uniqueOgImages > 0) {
    pass(`All ${results.imagesChecked} unique social preview image(s) returned an image content type.`);
  } else if (results.uniqueOgImages === 0) {
    fail('No valid og:image URL was found on sitemap pages.');
  }

  await check404();
  finish();
}

function finish() {
  console.log('\nSummary');
  console.log(`  Sitemap pages:       ${results.sitemapPages}`);
  console.log(`  Pages checked:       ${results.pagesChecked}`);
  console.log(`  Article pages:       ${results.articlePages}`);
  console.log(`  BlogPosting pages:   ${results.blogPostingPages}`);
  console.log(`  Unique OG images:    ${results.uniqueOgImages}`);
  console.log(`  Images checked:      ${results.imagesChecked}`);
  console.log(`  Warnings:            ${warnings.length}`);
  console.log(`  Failures:            ${failures.length}`);

  if (failures.length > 0) {
    console.error('\nProduction SEO verification FAILED.');
    process.exitCode = 1;
  } else {
    console.log('\nProduction SEO verification passed.');
  }
}

main().catch((error) => {
  fail(`Unexpected error: ${error.stack || error.message}`);
  finish();
});
