#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lockPath = path.join(root, "package-lock.json");
const errors = [];

try {
  const lock = JSON.parse(await readFile(lockPath, "utf8"));
  const astro = lock.packages?.["node_modules/astro"];
  const sharp = lock.packages?.["node_modules/sharp"];
  const sharpRange = astro?.optionalDependencies?.sharp;

  if (!sharpRange) errors.push("Astro does not declare Sharp as an optional image service in package-lock.json.");
  if (!sharp?.version || sharp.optional !== true) {
    errors.push("The optional Sharp package is missing from package-lock.json.");
  }

  const requiredPlatforms = ["node_modules/@img/sharp-linux-x64", "node_modules/@img/sharp-win32-x64"];
  for (const key of requiredPlatforms) {
    const platformPackage = lock.packages?.[key];
    if (!platformPackage?.version) errors.push(`Platform binary is missing from package-lock.json: ${key}`);
    else if (sharp?.version && platformPackage.version !== sharp.version) {
      errors.push(`${key} version ${platformPackage.version} does not match Sharp ${sharp.version}.`);
    }
  }

  const workflow = await readFile(path.join(root, ".github/workflows/deploy.yml"), "utf8");
  if (!/node-version:\s*["']?24["']?/.test(workflow)) {
    errors.push("GitHub Pages workflow must use Node.js 24 for the locked Astro toolchain.");
  }
  if (!/npm ci/.test(workflow) || !/npm run build/.test(workflow)) {
    errors.push("GitHub Pages workflow must install from package-lock.json and run the full build.");
  }

  if (errors.length) {
    console.error(`Image service lockfile validation failed (${errors.length} issue(s)):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(
      `Image service validation passed: Astro ${astro.version} locks optional Sharp ${sharp.version}; Windows x64 and Linux x64 binaries are present, and GitHub Pages Actions uses Node.js 24 + npm ci + npm run build.`,
    );
  }
} catch (error) {
  console.error(`Image service lockfile validation could not complete: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
