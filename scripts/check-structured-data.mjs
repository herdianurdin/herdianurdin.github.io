#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const distDir = path.resolve(process.env.DIST_DIR ?? "dist");
const siteUrl = new URL(process.env.SITE_URL ?? "https://herdianurdin.my.id");
const errors = [];
let checkedPages = 0;
let checkedArticles = 0;

function fail(message) {
  errors.push(message);
}

function decodeXml(value) {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");
}

function outputPathForUrl(value) {
  const url = new URL(value);
  if (url.origin !== siteUrl.origin) {
    throw new Error(`Unexpected sitemap origin: ${url.origin}`);
  }

  const relativePath = decodeURIComponent(url.pathname).replace(/^\/+/, "").replace(/\/+$/, "");
  const filePath = relativePath && /\.[a-z0-9]+$/i.test(relativePath)
    ? path.resolve(distDir, relativePath)
    : path.resolve(distDir, relativePath, "index.html");

  if (filePath !== distDir && !filePath.startsWith(`${distDir}${path.sep}`)) {
    throw new Error(`Sitemap URL resolves outside dist/: ${url.href}`);
  }
  return filePath;
}

function hasType(schema, type) {
  return schema?.["@type"] === type ||
    (Array.isArray(schema?.["@type"]) && schema["@type"].includes(type));
}

function validDate(value) {
  return typeof value === "string" && value.length > 0 && !Number.isNaN(Date.parse(value));
}

async function main() {
  const sitemapPath = path.join(distDir, "sitemap.xml");
  const sitemap = await readFile(sitemapPath, "utf8");
  const locations = [...sitemap.matchAll(/<loc>\s*([\s\S]*?)\s*<\/loc>/gi)]
    .map((match) => decodeXml(match[1].trim()));

  if (locations.length === 0) {
    fail("Sitemap contains no page URLs");
  }

  for (const location of locations) {
    let filePath;
    try {
      filePath = outputPathForUrl(location);
    } catch (error) {
      fail(`${location}: ${error.message}`);
      continue;
    }

    try {
      await access(filePath);
    } catch {
      fail(`${location}: built HTML file not found (${filePath})`);
      continue;
    }

    const html = await readFile(filePath, "utf8");
    const schemas = [];
    const scripts = [...html.matchAll(/<script\b(?=[^>]*\btype=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi)];

    for (const [index, match] of scripts.entries()) {
      try {
        const parsed = JSON.parse(match[1]);
        schemas.push(...(Array.isArray(parsed) ? parsed : [parsed]));
      } catch (error) {
        fail(`${location}: JSON-LD block ${index + 1} is invalid (${error.message})`);
      }
    }

    const person = schemas.find((schema) => hasType(schema, "Person"));
    if (!person) {
      fail(`${location}: Person structured data is missing`);
    } else {
      if (typeof person["@id"] !== "string" || !person["@id"].startsWith(`${siteUrl.origin}/`)) {
        fail(`${location}: Person @id must be a stable absolute site URL`);
      }
      if (typeof person.url !== "string" || !person.url.startsWith(`${siteUrl.origin}/`)) {
        fail(`${location}: Person url must point to an absolute profile URL on this site`);
      }
    }

    const pathname = new URL(location).pathname;
    const isProfilePage = pathname === "/about/" || pathname === "/en/about/";
    if (isProfilePage) {
      const profile = schemas.find((schema) => hasType(schema, "ProfilePage"));
      if (!profile) {
        fail(`${location}: ProfilePage structured data is missing`);
      } else if (!person || profile.mainEntity?.["@id"] !== person["@id"]) {
        fail(`${location}: ProfilePage mainEntity does not reference the page's Person entity`);
      }
    }

    const isArticle = /^\/(?:en\/)?blog\/(?!\d+\/).+\/$/.test(pathname);
    if (isArticle) {
      checkedArticles += 1;
      const article = schemas.find((schema) => hasType(schema, "BlogPosting"));
      if (!article) {
        fail(`${location}: BlogPosting structured data is missing`);
      } else {
        if (typeof article.headline !== "string" || !article.headline.trim()) {
          fail(`${location}: BlogPosting headline is missing`);
        }
        if (typeof article.image !== "string" || !/^https?:\/\//i.test(article.image)) {
          fail(`${location}: BlogPosting image must be an absolute URL`);
        }
        if (!validDate(article.datePublished)) {
          fail(`${location}: BlogPosting datePublished is missing or invalid`);
        }
        if (article.dateModified !== undefined && !validDate(article.dateModified)) {
          fail(`${location}: BlogPosting dateModified is invalid`);
        }
        if (!person || article.author?.["@id"] !== person["@id"]) {
          fail(`${location}: BlogPosting author does not reference the Person entity`);
        }
        if (article.mainEntityOfPage?.["@id"] !== location) {
          fail(`${location}: BlogPosting mainEntityOfPage does not match the sitemap URL`);
        }
      }
    }

    if (schemas.some((schema) => hasType(schema, "FAQPage"))) {
      fail(`${location}: FAQPage markup is not used in this site schema policy`);
    }
    checkedPages += 1;
  }

  if (errors.length > 0) {
    console.error(`Structured data validation failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Structured data validation passed: ${checkedPages} sitemap pages and ${checkedArticles} BlogPosting entries checked.`);
}

main().catch((error) => {
  console.error(`Structured data validation could not complete: ${error.message}`);
  process.exitCode = 1;
});
