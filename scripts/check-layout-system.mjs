#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

// All editorial pages share the same outer container. The full-screen Playground
// application and standalone 404 screen are intentional layout exceptions.
const sharedMainFiles = [
  "src/pages/index.astro",
  "src/pages/en/index.astro",
  "src/pages/about.astro",
  "src/pages/en/about.astro",
  "src/pages/privacy-policy.astro",
  "src/pages/en/privacy-policy.astro",
  "src/pages/disclaimer.astro",
  "src/pages/en/disclaimer.astro",
  "src/pages/terms-of-service.astro",
  "src/pages/en/terms-of-service.astro",
  "src/components/playgrounds/PlaygroundsDirectory.astro",
  "src/components/archive/ArchivePage.astro",
  "src/layouts/BlogLayout.astro",
  "src/components/EditorialPolicyContent.astro",
];

for (const relativePath of sharedMainFiles) {
  const source = read(relativePath);
  const main = source.match(/<main\b[^>]*>/s)?.[0] ?? "";
  if (!main) {
    failures.push(`${relativePath}: main landmark not found`);
  } else if (!/\bclass="[^"]*\bsite-container\b/.test(main)) {
    failures.push(`${relativePath}: main landmark must use the shared .site-container`);
  }
}

for (const relativePath of [
  "src/pages/playgrounds/index.astro",
  "src/pages/en/playgrounds/index.astro",
]) {
  if (!/PlaygroundsDirectory language=/.test(read(relativePath))) {
    failures.push(`${relativePath}: route must use the shared PlaygroundsDirectory component`);
  }
}

const css = read("src/styles/global.css");
for (const [pattern, label] of [
  [/--site-container-max:\s*72rem/, "72rem site container token"],
  [/--site-container-gutter:\s*clamp\(/, "responsive shared page gutter token"],
  [/--site-reading-measure:\s*45rem/, "45rem fixed reading measure token"],
  [/\.site-container\s*\{[\s\S]*?max-width:\s*var\(--site-container-max\)/, ".site-container rule"],
  [/\.site-reading\s*\{[\s\S]*?max-width:\s*var\(--site-reading-measure\)/, ".site-reading rule"],
]) {
  if (!pattern.test(css)) failures.push(`global.css: missing ${label}`);
}

for (const [relativePath, label] of [
  ["src/components/Header.astro", "Header"],
  ["src/components/Footer.astro", "Footer"],
]) {
  if (!/class="site-container\b/.test(read(relativePath))) {
    failures.push(`${label}: inner content must align with the shared site container`);
  }
}

for (const relativePath of [
  "src/layouts/BlogLayout.astro",
  "src/pages/about.astro",
  "src/pages/en/about.astro",
  "src/pages/privacy-policy.astro",
  "src/pages/en/privacy-policy.astro",
  "src/pages/disclaimer.astro",
  "src/pages/en/disclaimer.astro",
  "src/pages/terms-of-service.astro",
  "src/pages/en/terms-of-service.astro",
  "src/components/EditorialPolicyContent.astro",
]) {
  if (!/\bsite-reading\b/.test(read(relativePath))) {
    failures.push(`${relativePath}: long-form content must use the shared .site-reading measure`);
  }
}

const articleLayout = read("src/layouts/BlogLayout.astro");
if (!/<div class="site-reading">[\s\S]*?<header class="mb-9">[\s\S]*?<TableOfContents[\s\S]*?<div class="prose prose-invert prose-lg max-w-none/.test(articleLayout)) {
  failures.push("BlogLayout: title, table of contents, and article body must share one fixed-width reading wrapper.");
}

for (const relativePath of [
  "src/pages/privacy-policy.astro",
  "src/pages/en/privacy-policy.astro",
  "src/pages/disclaimer.astro",
  "src/pages/en/disclaimer.astro",
  "src/pages/terms-of-service.astro",
  "src/pages/en/terms-of-service.astro",
]) {
  const source = read(relativePath);
  if (!/<div class="site-reading">[\s\S]*?<h1[\s\S]*?<div[\s\S]*?class="prose prose-invert prose-lg max-w-none/.test(source)) {
    failures.push(`${relativePath}: document heading and prose must align within the same reading wrapper.`);
  }
}

const intentionalExceptions = [
  ["src/pages/404.astro", "compact standalone error screen"],
  ["src/layouts/PlaygroundLayout.astro", "full-viewport interactive application"],
];
for (const [relativePath, reason] of intentionalExceptions) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    failures.push(`Documented layout exception missing: ${relativePath} (${reason})`);
  }
}

if (failures.length > 0) {
  console.error(`Layout system validation failed (${failures.length} issue(s)):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Layout system validation passed: ${sharedMainFiles.length} editorial page templates use the shared 72rem container; long-form pages use the fixed 45rem reading measure; Header/Footer align to the same container.`,
  );
  console.log("Intentional exceptions: compact 404 screen and full-viewport Playground application.");
}
