#!/usr/bin/env node

import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(process.argv[2] ?? process.cwd());
const distDir = path.resolve(projectRoot, process.env.DIST_DIR ?? "dist");
const siteUrl = new URL(
  process.env.SITE_URL ?? "https://herdianurdin.my.id",
);
const missingLinks = [];
const nonCanonicalLinks = new Map();

// Separately deployed applications mounted under this origin are not part of
// this Astro project's dist/ output and must not be reported as missing pages.
const externalAppPrefixes = ["/python-quest/"];

function parseAttributes(tag) {
  const attributes = {};
  const pattern = /([:\w-]+)\s*=\s*(["'])(.*?)\2/g;
  for (const match of tag.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = match[3];
  }
  return attributes;
}

async function collectHtmlFiles(directory) {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

function pageUrlForFile(filePath) {
  const relativePath = path.relative(distDir, filePath).split(path.sep).join("/");
  if (relativePath === "index.html") return new URL("/", siteUrl);
  if (relativePath.endsWith("/index.html")) {
    return new URL(`/${relativePath.slice(0, -"index.html".length)}`, siteUrl);
  }
  return new URL(relativePath, siteUrl);
}

function outputPathForRoute(url) {
  if (url.origin !== siteUrl.origin) return null;

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(url.pathname);
  } catch {
    return null;
  }

  const hasTrailingSlash = url.pathname.endsWith("/");
  const relativePath = decodedPath.replace(/^\/+|\/+$/g, "");
  const isFilePath = !hasTrailingSlash && relativePath !== "" && /\.[a-z0-9]+$/i.test(relativePath);
  const outputPath = isFilePath
    ? path.resolve(distDir, relativePath)
    : path.resolve(distDir, relativePath, "index.html");

  if (outputPath !== distDir && !outputPath.startsWith(`${distDir}${path.sep}`)) {
    return null;
  }
  return outputPath;
}

function isExternalAppRoute(pathname) {
  return externalAppPrefixes.some((prefix) => {
    const normalizedPrefix = prefix.endsWith("/") ? prefix : `${prefix}/`;
    return pathname === normalizedPrefix.slice(0, -1) || pathname.startsWith(normalizedPrefix);
  });
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await fileExists(distDir))) {
    throw new Error(`Build directory not found: ${distDir}`);
  }

  const htmlFiles = await collectHtmlFiles(distDir);
  let checkedInternalLinks = 0;
  let checkedExternalAppLinks = 0;

  for (const filePath of htmlFiles) {
    const html = await readFile(filePath, "utf8");
    const sourceUrl = pageUrlForFile(filePath);
    const relativeFile = path.relative(projectRoot, filePath).split(path.sep).join("/");

    for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
      const attributes = parseAttributes(match[0]);
      const href = attributes.href;
      if (!href) continue;

      let targetUrl;
      try {
        targetUrl = new URL(href, sourceUrl);
      } catch {
        continue;
      }

      if (targetUrl.origin !== siteUrl.origin) continue;

      if (isExternalAppRoute(targetUrl.pathname)) {
        checkedExternalAppLinks += 1;
        continue;
      }

      checkedInternalLinks += 1;

      const outputPath = outputPathForRoute(targetUrl);
      if (!outputPath) {
        missingLinks.push(`${relativeFile}: ${href} cannot be resolved to a safe local path.`);
        continue;
      }

      if (!(await fileExists(outputPath))) {
        const expectedFile = path.relative(distDir, outputPath).split(path.sep).join("/");
        missingLinks.push(`${relativeFile}: ${href} points to missing dist/${expectedFile}.`);
        continue;
      }

      const routePath = targetUrl.pathname.replace(/\/+$/, "");
      const isFileUrl = /\.[a-z0-9]+$/i.test(routePath);
      if (routePath && !isFileUrl && !targetUrl.pathname.endsWith("/")) {
        const issue = nonCanonicalLinks.get(targetUrl.pathname) ?? {
          href,
          count: 0,
          examples: [],
        };
        issue.count += 1;
        if (issue.examples.length < 3 && !issue.examples.includes(relativeFile)) {
          issue.examples.push(relativeFile);
        }
        nonCanonicalLinks.set(targetUrl.pathname, issue);
      }
    }
  }

  if (missingLinks.length > 0 || nonCanonicalLinks.size > 0) {
    if (missingLinks.length > 0) {
      console.error(`Internal link validation found ${missingLinks.length} missing or unsafe target(s):`);
      for (const issue of missingLinks) console.error(`- ${issue}`);
    }

    if (nonCanonicalLinks.size > 0) {
      const count = [...nonCanonicalLinks.values()].reduce((total, issue) => total + issue.count, 0);
      console.error(`Internal route link validation found ${count} non-canonical link(s) across ${nonCanonicalLinks.size} route(s):`);
      for (const [pathname, issue] of [...nonCanonicalLinks].sort(([a], [b]) => a.localeCompare(b))) {
        console.error(`- ${pathname} (${issue.count} rendered link(s)); examples: ${issue.examples.join(", ")}`);
      }
    }

    process.exitCode = 1;
    return;
  }

  console.log(`Internal link validation passed: ${checkedInternalLinks} local links and ${checkedExternalAppLinks} separately deployed app links checked across ${htmlFiles.length} HTML files.`);
}

main().catch((error) => {
  console.error(`Internal route link validation could not complete: ${error.message}`);
  process.exitCode = 1;
});
