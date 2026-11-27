#!/usr/bin/env node

import { readFile, access } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve(process.env.DIST_DIR ?? "dist");
const siteUrl = new URL(process.env.SITE_URL ?? "https://herdianurdin.my.id");
const errors = [];
const warnings = [];
let checkedPages = 0;
let checkedHeadings = 0;
let checkedAnchors = 0;
let genericAnchors = 0;
let headingLevelSkips = 0;

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function textContent(value) {
  return decodeEntities(
    value
      .replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function parseAttributes(tag) {
  const attrs = {};
  const pattern = /([:\w-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g;
  for (const match of tag.matchAll(pattern)) {
    attrs[match[1].toLowerCase()] = match[3] ?? match[4] ?? match[5] ?? "";
  }
  return attrs;
}

function toOutputPath(urlValue) {
  const url = new URL(urlValue);
  if (url.origin !== siteUrl.origin) {
    throw new Error(`Unexpected sitemap origin: ${url.origin}`);
  }
  const relative = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, "");
  const target = relative && /\.[a-z0-9]+$/i.test(relative)
    ? path.resolve(distDir, relative)
    : path.resolve(distDir, relative, "index.html");
  if (target !== distDir && !target.startsWith(`${distDir}${path.sep}`)) {
    throw new Error(`Sitemap URL resolves outside dist/: ${url.href}`);
  }
  return target;
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

function inspectPage(html, pageUrl) {
  const headings = [...html.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1\s*>/gi)]
    .map((match) => ({ level: Number(match[1]), attrs: parseAttributes(match[2]), text: textContent(match[3]) }));
  checkedHeadings += headings.length;

  const h1Count = headings.filter((heading) => heading.level === 1).length;
  if (h1Count === 0) warn(`${pageUrl}: no H1 found`);
  if (h1Count > 1) warn(`${pageUrl}: ${h1Count} H1 headings found`);

  for (let i = 0; i < headings.length; i += 1) {
    const heading = headings[i];
    if (!heading.text) {
      fail(`${pageUrl}: empty H${heading.level} heading found`);
    }
    if (i > 0 && heading.level > headings[i - 1].level + 1) {
      headingLevelSkips += 1;
      warn(`${pageUrl}: heading level jumps from H${headings[i - 1].level} to H${heading.level} (${heading.text})`);
    }
  }

  const anchors = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi)];
  for (const match of anchors) {
    const attrs = parseAttributes(match[1]);

    // Decorative cover links are intentionally hidden from assistive technology
    // and removed from sequential keyboard navigation. Their adjacent title and
    // read-action links provide the accessible route to the same article.
    // Ignore only this explicit combination; aria-hidden links that remain
    // keyboard-focusable must still be audited.
    const intentionallyHiddenLink =
      attrs["aria-hidden"]?.toLowerCase() === "true" && attrs.tabindex === "-1";
    if (intentionallyHiddenLink) continue;

    const inner = match[2];
    const imageAlts = [...inner.matchAll(/<img\b([^>]*)>/gi)]
      .map((image) => parseAttributes(image[1]).alt ?? "")
      .filter(Boolean);
    const accessibleText = textContent(inner) || attrs["aria-label"] || attrs.title || imageAlts.join(" ");
    checkedAnchors += 1;

    if (attrs.href && !String(accessibleText).trim()) {
      fail(`${pageUrl}: link has no discernible text (href=${attrs.href})`);
      continue;
    }

    const normalized = String(accessibleText).toLowerCase().replace(/[.!?]+$/g, "").trim();
    if (/^(?:click here|here|click|read more|learn more|more|di sini|klik di sini|baca di sini|selengkapnya|tautan)$/.test(normalized)) {
      genericAnchors += 1;
      warn(`${pageUrl}: generic link text "${accessibleText}" (href=${attrs.href ?? "missing"})`);
    }
  }
}

async function main() {
  const sitemapPath = path.join(distDir, "sitemap.xml");
  const sitemap = await readFile(sitemapPath, "utf8");
  const locations = [...sitemap.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)]
    .map((match) => decodeEntities(match[1].trim()));

  if (locations.length === 0) {
    throw new Error(`No URLs found in ${sitemapPath}`);
  }

  for (const url of locations) {
    const filePath = toOutputPath(url);
    try {
      await access(filePath);
    } catch {
      fail(`${url}: built HTML not found (${filePath})`);
      continue;
    }

    const html = await readFile(filePath, "utf8");
    checkedPages += 1;
    inspectPage(html, url);
  }

  if (errors.length) {
    console.error(`On-page validation failed with ${errors.length} error(s):`);
    for (const item of errors) console.error(`- ${item}`);
  }

  console.log(
    `On-page audit: ${checkedPages} sitemap pages, ${checkedHeadings} headings, ${checkedAnchors} links checked.`,
  );
  console.log(
    `Warnings: ${warnings.length} (${genericAnchors} generic anchor text; ${headingLevelSkips} heading-level skips).`,
  );
  for (const item of warnings) console.warn(`- ${item}`);

  if (errors.length) process.exitCode = 1;
  else console.log("On-page validation passed: no empty headings or links without discernible text found.");
}

main().catch((error) => {
  console.error(`On-page validation could not complete: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
