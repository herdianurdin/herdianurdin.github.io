#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(process.argv[2] ?? process.cwd());
const contentRoot = path.join(projectRoot, "src", "content");
const siteOrigin = "https://herdianurdin.my.id";
const articleRoutePrefixes = [
  { prefix: "/blog/", language: "id" },
  { prefix: "/en/blog/", language: "en" },
];

async function collectMarkdownFiles(directory) {
  const collected = [];

  async function visit(current) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await visit(fullPath);
      } else if (entry.isFile() && /\.(?:md|mdx)$/i.test(entry.name)) {
        collected.push(fullPath);
      }
    }
  }

  await visit(directory);
  return collected.sort();
}

function readFrontmatter(source, filePath, errors) {
  const normalized = source.replace(/^\uFEFF/, "");
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    errors.push(`${filePath}: cannot inspect links because YAML frontmatter is missing or malformed.`);
    return null;
  }
  return match[1];
}

function isDraft(frontmatter) {
  return /^isDraft\s*:\s*true\s*(?:#.*)?$/m.test(frontmatter);
}

function removeCode(source) {
  const lines = source.split(/\r?\n/);
  let fence = null;
  let fenceLength = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (fence) {
      const closing = new RegExp(`^\\s*${fence}{${fenceLength},}\\s*$`);
      if (closing.test(line)) fence = null;
      lines[i] = "";
      continue;
    }

    const opening = line.match(/^\s*(`{3,}|~{3,})/);
    if (opening) {
      fence = opening[1][0];
      fenceLength = opening[1].length;
      lines[i] = "";
    }
  }

  return lines.join("\n").replace(/`[^`\r\n]*`/g, "");
}

function extractArticleLinkTargets(markdown, lineOffset = 0) {
  const links = [];
  const pattern = /(?<!!)\[[^\]\r\n]+\]\(\s*(<[^>\r\n]+>|[^\s)]+)(?:\s+["'][^)]*["'])?\s*\)/g;
  let match;

  while ((match = pattern.exec(markdown)) !== null) {
    const rawHref = match[1].replace(/^<|>$/g, "");
    let url;
    try {
      url = new URL(rawHref, siteOrigin);
    } catch {
      continue;
    }

    if (url.hostname !== new URL(siteOrigin).hostname) continue;

    const route = articleRoutePrefixes.find(({ prefix }) => url.pathname.startsWith(prefix));
    if (!route) continue;

    let contentId;
    try {
      contentId = decodeURIComponent(url.pathname.slice(route.prefix.length)).replace(/\/+$/, "");
    } catch {
      contentId = "";
    }
    if (!contentId) continue;

    const line = lineOffset + markdown.slice(0, match.index).split("\n").length;
    links.push({ language: route.language, contentId, href: rawHref, line });
  }

  return links;
}

async function main() {
  const errors = [];
  const publishedIds = { id: new Set(), en: new Set() };
  const filesByLanguage = { id: [], en: [] };

  for (const language of ["id", "en"]) {
    const directory = path.join(contentRoot, language);
    try {
      filesByLanguage[language] = await collectMarkdownFiles(directory);
    } catch (error) {
      errors.push(`Cannot read src/content/${language}: ${error.message}`);
      continue;
    }

    for (const filePath of filesByLanguage[language]) {
      let source;
      try {
        source = await readFile(filePath, "utf8");
      } catch (error) {
        errors.push(`${filePath}: cannot read file (${error.message}).`);
        continue;
      }

      const frontmatter = readFrontmatter(source, filePath, errors);
      if (frontmatter === null || isDraft(frontmatter)) continue;

      const contentId = path
        .relative(directory, filePath)
        .split(path.sep)
        .join("/")
        .replace(/\.(?:md|mdx)$/i, "");
      publishedIds[language].add(contentId);
    }
  }

  let checkedLinks = 0;
  for (const language of ["id", "en"]) {
    for (const filePath of filesByLanguage[language]) {
      let source;
      try {
        source = await readFile(filePath, "utf8");
      } catch {
        continue;
      }

      const frontmatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
      if (!frontmatterMatch || isDraft(frontmatterMatch[1])) continue;
      const frontmatterLines = frontmatterMatch[0].split(/\r?\n/).length - 1;
      const markdown = removeCode(source.slice(frontmatterMatch[0].length));
      for (const link of extractArticleLinkTargets(markdown, frontmatterLines)) {
        checkedLinks += 1;
        if (!publishedIds[link.language].has(link.contentId)) {
          const relativeFile = path.relative(projectRoot, filePath).split(path.sep).join("/");
          errors.push(
            `${relativeFile}:${link.line}: ${link.href} does not match a published ${link.language.toUpperCase()} article.`,
          );
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error(`Internal article link validation failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  const contentCount = filesByLanguage.id.length + filesByLanguage.en.length;
  console.log(
    `Internal article link validation passed: ${checkedLinks} article links checked across ${contentCount} content files.`,
  );
}

main().catch((error) => {
  console.error(`Internal article link validation could not complete: ${error.message}`);
  process.exitCode = 1;
});
