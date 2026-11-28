#!/usr/bin/env node
/**
 * Report generated HTML/CSS size and compression estimates for one or more
 * Astro dist folders. This script is read-only and does not alter build output.
 *
 * Usage:
 *   node scripts/report-build-size.mjs dist
 *   node scripts/report-build-size.mjs dist-inline-always dist-auto
 */
import fs from "node:fs";
import path from "node:path";
import { gzipSync, brotliCompressSync } from "node:zlib";

const inputDirs = process.argv.slice(2);
const dirs = inputDirs.length ? inputDirs : ["dist"];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    else if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

function bytes(buffer) {
  return buffer.length;
}

function format(value) {
  return `${(value / 1024).toFixed(1)} KiB`;
}

function readReport(inputDir) {
  const root = path.resolve(inputDir);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    throw new Error(`Build directory not found: ${root}`);
  }

  const files = walk(root);
  const htmlFiles = files.filter((file) => file.toLowerCase().endsWith(".html"));
  const cssFiles = files.filter((file) => file.toLowerCase().endsWith(".css"));
  const imageExtensions = /\.(?:avif|webp|png|jpe?g|gif|svg)$/i;
  const generatedImageFiles = files.filter((file) =>
    file.includes(`${path.sep}_astro${path.sep}`) && imageExtensions.test(file),
  );
  const legacyPublicImageFiles = files.filter((file) =>
    file.includes(`${path.sep}images${path.sep}`) && imageExtensions.test(file),
  );

  let htmlRaw = 0;
  let htmlGzip = 0;
  let htmlBrotli = 0;
  let inlineStyleRaw = 0;
  let inlineStyleGzip = 0;
  let inlineStyleBrotli = 0;
  let inlineStyleBlocks = 0;
  let htmlWithStylesheetLink = 0;
  let stylesheetReferenceCount = 0;
  let externalStylesheetReferenceCount = 0;
  const referencedCss = new Set();

  for (const htmlPath of htmlFiles) {
    const content = fs.readFileSync(htmlPath);
    const source = content.toString("utf8");
    htmlRaw += bytes(content);
    htmlGzip += bytes(gzipSync(content));
    htmlBrotli += bytes(brotliCompressSync(content));

    for (const match of source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
      inlineStyleBlocks += 1;
      const styleBuffer = Buffer.from(match[1], "utf8");
      inlineStyleRaw += bytes(styleBuffer);
      inlineStyleGzip += bytes(gzipSync(styleBuffer));
      inlineStyleBrotli += bytes(brotliCompressSync(styleBuffer));
    }

    const linkTags = source.match(/<link\b[^>]*>/gi) ?? [];
    const stylesheetTags = linkTags.filter((tag) => {
      const rel = tag.match(/\brel=["']([^"']+)["']/i)?.[1] ?? "";
      return rel.toLowerCase().split(/\s+/).includes("stylesheet");
    });
    if (stylesheetTags.length) htmlWithStylesheetLink += 1;

    for (const tag of stylesheetTags) {
      const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
      if (!href) continue;
      stylesheetReferenceCount += 1;
      try {
        const url = new URL(href, "https://astro-build-report.invalid/");
        if (url.origin !== "https://astro-build-report.invalid") {
          externalStylesheetReferenceCount += 1;
          continue;
        }
        const pathname = decodeURIComponent(url.pathname).replace(/^\/+/, "");
        const cssPath = path.resolve(root, pathname);
        if (cssPath.startsWith(`${root}${path.sep}`) && fs.existsSync(cssPath) && fs.statSync(cssPath).isFile()) {
          referencedCss.add(cssPath);
        }
      } catch {
        // Ignore non-local or malformed references; report local files separately.
      }
    }
  }

  let cssRaw = 0;
  let cssGzip = 0;
  let cssBrotli = 0;
  for (const cssPath of referencedCss) {
    const content = fs.readFileSync(cssPath);
    cssRaw += bytes(content);
    cssGzip += bytes(gzipSync(content));
    cssBrotli += bytes(brotliCompressSync(content));
  }

  const allCssRaw = cssFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  const generatedImageRaw = generatedImageFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  const legacyPublicImageRaw = legacyPublicImageFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);
  const imageFormats = Object.fromEntries(["avif", "webp", "png", "jpg", "jpeg", "gif", "svg"].map((extension) => [
    extension,
    generatedImageFiles.filter((file) => path.extname(file).toLowerCase() === `.${extension}`).length,
  ]));
  const totalRaw = htmlRaw + cssRaw;
  const totalGzip = htmlGzip + cssGzip;
  const totalBrotli = htmlBrotli + cssBrotli;

  return {
    label: inputDir,
    htmlCount: htmlFiles.length,
    cssFileCount: cssFiles.length,
    htmlRaw,
    htmlGzip,
    htmlBrotli,
    inlineStyleBlocks,
    inlineStyleRaw,
    inlineStyleGzip,
    inlineStyleBrotli,
    htmlWithStylesheetLink,
    stylesheetReferenceCount,
    externalStylesheetReferenceCount,
    referencedCssCount: referencedCss.size,
    cssRaw,
    cssGzip,
    cssBrotli,
    allCssRaw,
    generatedImageCount: generatedImageFiles.length,
    generatedImageRaw,
    legacyPublicImageCount: legacyPublicImageFiles.length,
    legacyPublicImageRaw,
    imageFormats,
    totalRaw,
    totalGzip,
    totalBrotli,
  };
}

const reports = dirs.map(readReport);
for (const report of reports) {
  console.log(`\n[${report.label}]`);
  console.log(`HTML files:                  ${report.htmlCount}`);
  console.log(`Generated CSS files:         ${report.cssFileCount}`);
  console.log(`HTML total:                  ${format(report.htmlRaw)} raw | ${format(report.htmlGzip)} gzip | ${format(report.htmlBrotli)} brotli`);
  console.log(`Inline CSS:                  ${report.inlineStyleBlocks} block(s), ${format(report.inlineStyleRaw)} raw | ${format(report.inlineStyleGzip)} gzip* | ${format(report.inlineStyleBrotli)} brotli*`);
  console.log(`HTML with stylesheet link:   ${report.htmlWithStylesheetLink}`);
  console.log(`* CSS blocks compressed separately; indicative only.`);
  console.log(`Stylesheet references:       ${report.stylesheetReferenceCount} total (${report.externalStylesheetReferenceCount} external)`);
  console.log(`Unique referenced CSS:       ${report.referencedCssCount} file(s), ${format(report.cssRaw)} raw | ${format(report.cssGzip)} gzip | ${format(report.cssBrotli)} brotli`);
  console.log(`All CSS emitted:             ${format(report.allCssRaw)} raw`);
  console.log(`Generated optimized images:  ${report.generatedImageCount} file(s), ${format(report.generatedImageRaw)} raw (${Object.entries(report.imageFormats).filter(([, count]) => count).map(([format, count]) => `${format.toUpperCase()} ${count}`).join(", ") || "none"})`);
  console.log(`Legacy public images:        ${report.legacyPublicImageCount} file(s), ${format(report.legacyPublicImageRaw)} raw (retained for direct-URL compatibility)`);
  console.log(`HTML + unique CSS estimate:  ${format(report.totalRaw)} raw | ${format(report.totalGzip)} gzip | ${format(report.totalBrotli)} brotli`);
}

if (reports.length > 1) {
  const baseline = reports[0];
  console.log(`\nComparison (first: ${baseline.label})`);
  for (const current of reports.slice(1)) {
    console.log(`\n${current.label}`);
    for (const key of ["htmlRaw", "htmlGzip", "htmlBrotli", "totalRaw", "totalGzip", "totalBrotli"]) {
      const delta = current[key] - baseline[key];
      const percent = baseline[key] === 0 ? "n/a" : `${((delta / baseline[key]) * 100).toFixed(1)}%`;
      const direction = delta < 0 ? "reduced" : delta > 0 ? "increased" : "unchanged";
      console.log(`  ${key}: ${direction} by ${format(Math.abs(delta))} (${percent})`);
    }
  }
}
