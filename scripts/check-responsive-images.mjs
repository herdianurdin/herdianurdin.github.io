#!/usr/bin/env node
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(root, "src/content");
const errors = [];
let markdownImages = 0;
let coverImages = 0;
const uniqueAssets = new Set();

async function walk(directory) {
  const { readdir } = await import("node:fs/promises");
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (/\.(md|mdx)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

function resolveAsset(contentFile, relativePath, label) {
  if (/^(?:https?:)?\/\//i.test(relativePath) || /^[a-z][a-z\d+.-]*:/i.test(relativePath)) return null;
  const file = path.resolve(path.dirname(contentFile), relativePath);
  const assetsRoot = path.resolve(root, "src/assets");
  if (file !== assetsRoot && !file.startsWith(`${assetsRoot}${path.sep}`)) {
    errors.push(`${label}: local content image must resolve inside src/assets (${relativePath})`);
    return null;
  }
  uniqueAssets.add(path.relative(root, file).replaceAll("\\", "/"));
  return file;
}

for (const file of await walk(contentRoot)) {
  const source = await readFile(file, "utf8");
  const frontmatter = source.match(/^---\s*\n([\s\S]*?)\n---/);
  if (frontmatter) {
    const cover = frontmatter[1].match(/^coverImage:\s*["']([^"']+)["']\s*$/m)?.[1];
    if (cover && !/^(?:https?:)?\/\//i.test(cover)) {
      coverImages += 1;
      const resolved = resolveAsset(file, cover, path.relative(root, file));
      if (resolved) {
        try { await access(resolved); }
        catch { errors.push(`${path.relative(root, file)}: cover image file does not exist (${cover})`); }
      }
    }
  }

  for (const match of source.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    const src = match[1].trim().split(/\s+/)[0];
    if (/^(?:https?:)?\/\//i.test(src) || /^[a-z][a-z\d+.-]*:/i.test(src)) continue;
    // Markdown examples inside fenced code are ignored by using a lightweight fence-state scan.
    const prefix = source.slice(0, match.index);
    const fenceCount = (prefix.match(/^\s*```/gm) ?? []).length;
    if (fenceCount % 2 === 1) continue;
    markdownImages += 1;
    const resolved = resolveAsset(file, src, path.relative(root, file));
    if (resolved) {
      try { await access(resolved); }
      catch { errors.push(`${path.relative(root, file)}: Markdown image file does not exist (${src})`); }
    }
  }
}

for (const asset of ["profile.webp", "og-default.webp"]) {
  const file = path.join(root, "src/assets/images", asset);
  try {
    await access(file);
    uniqueAssets.add(path.relative(root, file).replaceAll("\\", "/"));
  } catch {
    errors.push(`Required shared image asset is missing: src/assets/images/${asset}`);
  }
}

const config = await readFile(path.join(root, "astro.config.mjs"), "utf8");
if (!/layout:\s*["']constrained["']/.test(config) || !/responsiveStyles:\s*true/.test(config)) {
  errors.push("astro.config.mjs: responsive Markdown image layout or styles are missing");
}
const breakpointMatch = config.match(/breakpoints:\s*\[([^\]]+)\]/);
const breakpoints = breakpointMatch?.[1].split(",").map((value) => Number(value.trim())).filter(Number.isFinite) ?? [];
if (breakpoints.length !== 3 || breakpoints.some((value, index) => value !== [480, 800, 1440][index])) {
  errors.push("astro.config.mjs: Markdown image breakpoints must remain [480, 800, 1440] to control generated variants");
}
const contentSchema = await readFile(path.join(root, "src/content.config.ts"), "utf8");
if (!/image\(\)/.test(contentSchema) || !/SchemaContext/.test(contentSchema)) {
  errors.push("src/content.config.ts: local cover images must use the Content Collections image() helper");
}
if (/z\.string\(\)\.url\(\)/.test(contentSchema)) {
  errors.push("src/content.config.ts: use Zod 4 z.url() instead of deprecated z.string().url()");
}
const seoHead = await readFile(path.join(root, "src/components/SeoHead.astro"), "utf8");
if (!/getImage\(/.test(seoHead) || !/defaultOgImage/.test(seoHead)) {
  errors.push("SeoHead.astro: local social preview images must be generated from Astro image assets");
}

const coverFiles = ["src/layouts/BlogLayout.astro", "src/components/ui/ArticleCard.astro"];
let sharedCoverWidths = null;
for (const file of coverFiles) {
  const source = await readFile(path.join(root, file), "utf8");
  if (!source.includes("<Image")) errors.push(`${file}: expected Astro Image for local cover assets`);
  if (!source.includes('format="webp"')) errors.push(`${file}: cover image output must use a single WebP format`);
  const widths = source.match(/widths=\{\[([^\]]+)\]\}/)?.[1]?.replace(/\s+/g, "") ?? null;
  if (widths !== "480,800,1200") errors.push(`${file}: cover candidates must be [480, 800, 1200]`);
  const quality = source.match(/quality=\{(\d+)\}/)?.[1] ?? null;
  if (quality !== "80") errors.push(`${file}: cover quality must be 80 to allow transform reuse`);
  if (sharedCoverWidths === null) sharedCoverWidths = widths;
  else if (widths !== sharedCoverWidths) errors.push("ArticleCard and BlogLayout must share the same cover widths");
  if (source.includes("<Picture") || source.includes('formats={["avif"]}')) {
    errors.push(`${file}: duplicate AVIF/WebP cover generation is not allowed in the optimized strategy`);
  }
}

const profileGroups = [
  { file: "src/components/home/HeroProfile.astro", widths: "128,256,384,512" },
  { file: "src/components/author/AuthorIdentityCard.astro", widths: "128,256,384,512" },
  { file: "src/components/article/AuthorBox.astro", widths: "128,256" },
];
for (const { file, widths } of profileGroups) {
  const source = await readFile(path.join(root, file), "utf8");
  if (!source.includes("<Image")) errors.push(`${file}: expected Astro Image for profile assets`);
  if (!source.includes('format="webp"')) errors.push(`${file}: profile image output must use WebP only`);
  const actualWidths = source.match(/widths=\{\[([^\]]+)\]\}/)?.[1]?.replace(/\s+/g, "") ?? null;
  if (actualWidths !== widths) errors.push(`${file}: expected profile widths [${widths}]`);
  if (source.includes("<Picture") || source.includes('formats={["avif"]}')) {
    errors.push(`${file}: profile images must not generate duplicate AVIF variants`);
  }
}

if (errors.length) {
  console.error(`Responsive image source validation failed (${errors.length} issue(s)):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Responsive image source validation passed: ${markdownImages} local Markdown image(s), ${coverImages} local cover(s), ${uniqueAssets.size} unique source asset(s), three Markdown breakpoints, shared three-width WebP covers, and three tailored WebP profile groups verified.`);
}
