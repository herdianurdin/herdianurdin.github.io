#!/usr/bin/env node

import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(process.argv[2] ?? process.cwd());
const distDir = path.resolve(projectRoot, process.env.DIST_DIR ?? "dist");
const siteUrl = new URL(
  process.env.SITE_URL ?? "https://herdianurdin.my.id",
);
const issues = new Map();

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
  const relativePath = decodeURIComponent(url.pathname)
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  const outputPath = relativePath && /\.[a-z0-9]+$/i.test(relativePath)
    ? path.resolve(distDir, relativePath)
    : path.resolve(distDir, relativePath, "index.html");

  if (outputPath !== distDir && !outputPath.startsWith(`${distDir}${path.sep}`)) {
    return null;
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

async function main() {
  if (!(await fileExists(distDir))) {
    throw new Error(`Build directory not found: ${distDir}`);
  }

  const htmlFiles = await collectHtmlFiles(distDir);
  let flaggedLinks = 0;

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
      const pathname = targetUrl.pathname;
      if (pathname === "/" || pathname.endsWith("/") || /\.[a-z0-9]+$/i.test(pathname)) {
        continue;
      }

      const outputPath = outputPathForRoute(targetUrl);
      if (!outputPath || !(await fileExists(outputPath))) continue;

      flaggedLinks += 1;
      const issue = issues.get(pathname) ?? { href, count: 0, examples: [] };
      issue.count += 1;
      if (issue.examples.length < 3 && !issue.examples.includes(relativeFile)) {
        issue.examples.push(relativeFile);
      }
      issues.set(pathname, issue);
    }
  }

  if (issues.size > 0) {
    console.error(`Internal route link validation failed: ${flaggedLinks} non-canonical link(s) across ${issues.size} route(s) and ${htmlFiles.length} HTML files.`);
    for (const [pathname, issue] of [...issues].sort(([a], [b]) => a.localeCompare(b))) {
      console.error(`- ${pathname} (${issue.count} rendered link(s)); examples: ${issue.examples.join(", ")}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Internal route link validation passed: ${htmlFiles.length} HTML files scanned; no links to non-canonical route URLs found.`);
}

main().catch((error) => {
  console.error(`Internal route link validation could not complete: ${error.message}`);
  process.exitCode = 1;
});
