#!/usr/bin/env node

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const contentRoot = path.join(projectRoot, "src", "content");
const writeChanges = process.argv.includes("--write");
const staticRoutes = [
  "/about",
  "/privacy-policy",
  "/disclaimer",
  "/terms-of-service",
  "/python-playground",
  "/en",
  "/en/about",
  "/en/privacy-policy",
  "/en/disclaimer",
  "/en/terms-of-service",
  "/blog",
  "/en/blog",
];

async function collectMarkdownFiles(directory) {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectMarkdownFiles(fullPath));
    } else if (entry.isFile() && /\.(?:md|mdx)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function isDraft(source) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? "";
  return /^isDraft\s*:\s*true\s*(?:#.*)?$/m.test(frontmatter);
}

function maskInlineCode(line) {
  return line.replace(/(`+).*?\1/g, (value) => " ".repeat(value.length));
}

function normalizeMarkdownLine(line, routeSet) {
  const visibleLine = maskInlineCode(line);
  const matches = [...visibleLine.matchAll(/(?<!!)\[[^\]\r\n]+\]\(\s*(<[^>\r\n]+>|[^\s)]+)(\s+(?:"[^"]*"|'[^']*'))?\s*\)/g)];
  if (matches.length === 0) return { line, changed: false };

  let output = line;
  let changed = false;
  for (const match of matches.reverse()) {
    const rawTarget = match[1].replace(/^<|>$/g, "");
    if (!rawTarget.startsWith("/") || rawTarget.startsWith("//")) continue;

    const suffixIndex = rawTarget.search(/[?#]/);
    const pathname = suffixIndex === -1 ? rawTarget : rawTarget.slice(0, suffixIndex);
    const suffix = suffixIndex === -1 ? "" : rawTarget.slice(suffixIndex);
    if (pathname === "/" || pathname.endsWith("/") || !routeSet.has(pathname)) continue;

    const replacementTarget = `${pathname}/${suffix}`;
    const targetStart = match.index + match[0].indexOf(match[1]);
    const targetEnd = targetStart + match[1].length;
    output = output.slice(0, targetStart) + match[1].replace(rawTarget, replacementTarget) + output.slice(targetEnd);
    changed = true;
  }
  return { line: output, changed };
}

async function main() {
  const allFiles = [];
  for (const language of ["id", "en"]) {
    const languageRoot = path.join(contentRoot, language);
    allFiles.push(...await collectMarkdownFiles(languageRoot));
  }

  const routes = new Set(staticRoutes);
  for (const language of ["id", "en"]) {
    const languageRoot = path.join(contentRoot, language);
    const files = await collectMarkdownFiles(languageRoot);
    for (const filePath of files) {
      const source = await readFile(filePath, "utf8");
      if (isDraft(source)) continue;
      const relative = path.relative(languageRoot, filePath)
        .split(path.sep).join("/")
        .replace(/\.(?:md|mdx)$/i, "");
      routes.add(`${language === "en" ? "/en/blog/" : "/blog/"}${relative}`);
    }
  }

  let changedFiles = 0;
  let changedLinks = 0;
  for (const filePath of allFiles) {
    const source = await readFile(filePath, "utf8");
    if (isDraft(source)) continue;
    const newline = source.includes("\r\n") ? "\r\n" : "\n";
    const lines = source.split(/\r?\n/);
    let inFence = false;
    let fenceChar = "";
    let fenceLength = 0;
    let fileChanged = false;
    const output = lines.map((line) => {
      const fence = line.match(/^\s*(`{3,}|~{3,})/);
      if (fence) {
        const char = fence[1][0];
        if (!inFence) {
          inFence = true;
          fenceChar = char;
          fenceLength = fence[1].length;
        } else if (char === fenceChar && fence[1].length >= fenceLength) {
          inFence = false;
        }
        return line;
      }
      if (inFence) return line;

      const result = normalizeMarkdownLine(line, routes);
      if (result.changed) {
        fileChanged = true;
        changedLinks += 1;
      }
      return result.line;
    }).join(newline);

    if (!fileChanged) continue;
    changedFiles += 1;
    const relative = path.relative(projectRoot, filePath).split(path.sep).join("/");
    console.log(`${writeChanges ? "UPDATED" : "WOULD UPDATE"} ${relative}`);
    if (writeChanges) await writeFile(filePath, output, "utf8");
  }

  console.log(`${writeChanges ? "Updated" : "Dry run:"} ${changedLinks} link line(s) in ${changedFiles} file(s).`);
  if (!writeChanges) console.log("No files were changed. Re-run with --write to apply the changes.");
}

main().catch((error) => {
  console.error(`Internal route link normalization failed: ${error.message}`);
  process.exitCode = 1;
});
