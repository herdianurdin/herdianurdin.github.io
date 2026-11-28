#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { playgroundCatalog } from "../src/config/playgrounds.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const ids = new Set();
const routes = new Set();

if (!Array.isArray(playgroundCatalog) || playgroundCatalog.length === 0) {
  errors.push("Playground catalog must contain at least one registered tool.");
}

for (const item of playgroundCatalog) {
  if (!item || typeof item !== "object") {
    errors.push("Catalog entry must be an object.");
    continue;
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id ?? "")) {
    errors.push(`Invalid playground id: ${String(item.id)}`);
  } else if (ids.has(item.id)) {
    errors.push(`Duplicate playground id: ${item.id}`);
  } else {
    ids.add(item.id);
  }

  if (typeof item.href !== "string" || !item.href.startsWith("/") || !item.href.endsWith("/")) {
    errors.push(`${item.id ?? "unknown"}: href must be an absolute local route ending with a slash.`);
  } else if (routes.has(item.href)) {
    errors.push(`Duplicate playground route: ${item.href}`);
  } else {
    routes.add(item.href);

    const relativeRoute = item.href.replace(/^\/+|\/+$/g, "");
    const candidates = [
      path.join(root, "src/pages", `${relativeRoute}.astro`),
      path.join(root, "src/pages", relativeRoute, "index.astro"),
    ];
    if (!candidates.some((candidate) => fs.existsSync(candidate))) {
      errors.push(`${item.id}: no Astro route file found for ${item.href}.`);
    }
  }

  for (const field of ["title", "description", "category", "interfaceLanguage", "cta"]) {
    if (!item[field] || typeof item[field].id !== "string" || !item[field].id.trim()
      || typeof item[field].en !== "string" || !item[field].en.trim()) {
      errors.push(`${item.id ?? "unknown"}: ${field} must provide non-empty ID and EN values.`);
    }
  }

  if (item.status !== "available") {
    errors.push(`${item.id ?? "unknown"}: only real, available tools may be listed in the public catalog.`);
  }

  if (!Array.isArray(item.technologies) || item.technologies.length === 0
    || item.technologies.some((technology) => typeof technology !== "string" || !technology.trim())) {
    errors.push(`${item.id ?? "unknown"}: technologies must be a non-empty string array.`);
  }
}


const siteConfigSource = fs.readFileSync(path.join(root, "src/config/site.ts"), "utf8");
const localizedDirectoryTitles = [...siteConfigSource.matchAll(/playgroundsTitle:\s*"([^"]+)"/g)]
  .map((match) => match[1]);
if (localizedDirectoryTitles.length !== 2 || localizedDirectoryTitles[0] === localizedDirectoryTitles[1]) {
  errors.push("Indonesian and English playground directory titles must be distinct for localized page metadata.");
}

for (const route of [
  "src/pages/playgrounds/index.astro",
  "src/pages/en/playgrounds/index.astro",
]) {
  if (!fs.existsSync(path.join(root, route))) errors.push(`Localized directory route missing: ${route}`);
}

if (errors.length > 0) {
  console.error(`Playground catalog validation failed (${errors.length} issue(s)):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Playground catalog validation passed: ${playgroundCatalog.length} available tool(s), unique IDs/routes, localized metadata, route files, and bilingual directory routes verified.`);
}
