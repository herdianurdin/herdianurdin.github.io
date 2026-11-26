#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const distDir = path.resolve(process.env.DIST_DIR ?? "dist");
const siteUrl = new URL(process.env.SITE_URL ?? "https://herdianurdin.my.id");
const errors = [];
const seenTitles = new Map();
const seenDescriptions = new Map();
let checkedPages = 0;

function fail(message) {
  errors.push(message);
}

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function normalizeText(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function parseAttributes(tag) {
  const attributes = {};
  const pattern = /([:\w-]+)\s*=\s*(["'])(.*?)\2/g;
  for (const match of tag.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = decodeHtml(match[3]);
  }
  return attributes;
}

function resolveOutputPath(value) {
  const url = new URL(value);
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

function registerUnique(map, value, label, url) {
  const key = value.toLocaleLowerCase();
  const previous = map.get(key);
  if (previous) {
    fail(`${url}: duplicate ${label}; already used by ${previous}`);
  } else {
    map.set(key, url);
  }
}

async function main() {
  const sitemapPath = path.join(distDir, "sitemap.xml");
  const sitemap = await readFile(sitemapPath, "utf8");
  const locations = [...sitemap.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)]
    .map((match) => decodeHtml(match[1].trim()));

  if (locations.length === 0) {
    fail("Sitemap contains no page URLs");
  }

  for (const location of locations) {
    let outputPath;
    try {
      outputPath = resolveOutputPath(location);
      await access(outputPath);
    } catch (error) {
      fail(`${location}: cannot resolve built page (${error.message})`);
      continue;
    }

    const html = await readFile(outputPath, "utf8");
    const titleTags = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
    const descriptionTags = [...html.matchAll(/<meta\b[^>]*>/gi)]
      .map((match) => ({ tag: match[0], attributes: parseAttributes(match[0]) }))
      .filter(({ attributes }) => attributes.name?.toLowerCase() === "description");

    if (titleTags.length !== 1) {
      fail(`${location}: expected exactly one title element, found ${titleTags.length}`);
    } else {
      const title = normalizeText(titleTags[0][1]);
      if (!title) {
        fail(`${location}: title element is empty`);
      } else {
        registerUnique(seenTitles, title, "title", location);
      }
    }

    if (descriptionTags.length !== 1) {
      fail(`${location}: expected exactly one meta description, found ${descriptionTags.length}`);
    } else {
      const description = normalizeText(descriptionTags[0].attributes.content ?? "");
      if (!description) {
        fail(`${location}: meta description is empty`);
      } else {
        registerUnique(seenDescriptions, description, "meta description", location);
      }
    }

    checkedPages += 1;
  }

  if (errors.length > 0) {
    console.error(`Page metadata validation failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `Page metadata validation passed: ${checkedPages} sitemap pages have unique, non-empty title and meta description elements.`,
  );
}

main().catch((error) => {
  console.error(`Page metadata validation could not complete: ${error.message}`);
  process.exitCode = 1;
});
