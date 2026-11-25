#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const projectRoot = path.resolve(process.argv[2] ?? process.cwd());
const contentRoot = path.join(projectRoot, "src", "content");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;

function reportError(errors, message) {
  errors.push(message);
}

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

function extractFrontmatter(source, filePath, errors) {
  const normalized = source.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---\n") && !normalized.startsWith("---\r\n")) {
    reportError(errors, `${filePath}: missing YAML frontmatter opening delimiter.`);
    return null;
  }

  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    reportError(errors, `${filePath}: missing YAML frontmatter closing delimiter.`);
    return null;
  }
  return match[1];
}

function parseScalar(rawValue, filePath, key, errors) {
  const value = rawValue.trim();
  if (!value) {
    reportError(errors, `${filePath}: ${key} must not be empty.`);
    return undefined;
  }

  if (value.startsWith('"')) {
    const match = value.match(/^("(?:\\.|[^"\\])*")(?:\s+#.*)?$/);
    if (!match) {
      reportError(errors, `${filePath}: ${key} must be a simple quoted or unquoted scalar.`);
      return undefined;
    }
    try {
      return JSON.parse(match[1]);
    } catch {
      reportError(errors, `${filePath}: ${key} contains an invalid quoted string.`);
      return undefined;
    }
  }

  if (value.startsWith("'")) {
    const match = value.match(/^'((?:[^']|'')*)'(?:\s+#.*)?$/);
    if (!match) {
      reportError(errors, `${filePath}: ${key} must be a simple quoted or unquoted scalar.`);
      return undefined;
    }
    return match[1].replaceAll("''", "'");
  }

  return value.replace(/\s+#.*$/, "").trim();
}

function readFrontmatterField(frontmatter, key, filePath, errors) {
  const matches = frontmatter.match(new RegExp(`^${key}[ \\t]*:(.*)$`, "gm")) ?? [];
  if (matches.length > 1) {
    reportError(errors, `${filePath}: duplicate ${key} field.`);
    return undefined;
  }
  if (matches.length === 0) return undefined;
  const raw = matches[0].replace(new RegExp(`^${key}[ \\t]*:`), "");
  return parseScalar(raw, filePath, key, errors);
}

function readDraftFlag(frontmatter, filePath, errors) {
  const raw = readFrontmatterField(frontmatter, "isDraft", filePath, errors);
  if (raw === undefined) return false;
  if (raw === true || raw === "true") return true;
  if (raw === false || raw === "false") return false;
  reportError(errors, `${filePath}: isDraft must be the boolean true or false.`);
  return false;
}

async function loadCollection(language, errors) {
  const directory = path.join(contentRoot, language);
  let files;
  try {
    files = await collectMarkdownFiles(directory);
  } catch (error) {
    reportError(errors, `Cannot read src/content/${language}: ${error.message}`);
    return [];
  }

  const posts = [];
  const seenIds = new Set();

  for (const filePath of files) {
    const relativeId = path
      .relative(directory, filePath)
      .split(path.sep)
      .join("/")
      .replace(/\.(?:md|mdx)$/i, "");

    if (seenIds.has(relativeId)) {
      reportError(errors, `src/content/${language}/${relativeId}: duplicate content ID (possibly .md and .mdx files).`);
      continue;
    }
    seenIds.add(relativeId);

    let source;
    try {
      source = await readFile(filePath, "utf8");
    } catch (error) {
      reportError(errors, `${filePath}: cannot read file (${error.message}).`);
      continue;
    }

    const frontmatter = extractFrontmatter(source, filePath, errors);
    if (frontmatter === null) continue;

    const ownKey = language === "id" ? "enSlug" : "idSlug";
    const foreignKey = language === "id" ? "idSlug" : "enSlug";
    const translationSlug = readFrontmatterField(frontmatter, ownKey, filePath, errors);
    const unexpectedSlug = readFrontmatterField(frontmatter, foreignKey, filePath, errors);

    if (unexpectedSlug !== undefined) {
      reportError(errors, `${filePath}: ${foreignKey} belongs only in the ${language === "id" ? "English" : "Indonesian"} collection.`);
    }

    if (translationSlug !== undefined && (typeof translationSlug !== "string" || !slugPattern.test(translationSlug))) {
      reportError(errors, `${filePath}: ${ownKey} must be a lowercase kebab-case content ID (optional nested segments separated by /).`);
    }

    posts.push({
      id: relativeId,
      language,
      filePath,
      translationSlug: typeof translationSlug === "string" ? translationSlug : undefined,
      isDraft: readDraftFlag(frontmatter, filePath, errors),
    });
  }

  return posts;
}

function validateRelations(idPosts, enPosts, errors) {
  const idBySlug = new Map(idPosts.map((post) => [post.id, post]));
  const enBySlug = new Map(enPosts.map((post) => [post.id, post]));
  const enTargets = new Map();
  const idTargets = new Map();
  const pairs = [];

  for (const post of idPosts) {
    if (!post.translationSlug) continue;
    const target = enBySlug.get(post.translationSlug);
    if (!target) {
      reportError(errors, `${post.filePath}: enSlug "${post.translationSlug}" does not match an English content ID.`);
      continue;
    }

    if (target.translationSlug !== post.id) {
      reportError(errors, `${post.filePath}: enSlug "${post.translationSlug}" is not reciprocal; ${target.filePath} must declare idSlug: "${post.id}".`);
    }
    if (target.isDraft !== post.isDraft) {
      reportError(errors, `${post.filePath}: translation pair has mismatched publication status (isDraft).`);
    }
    if (enTargets.has(target.id)) {
      reportError(errors, `${post.filePath}: English content ID "${target.id}" is already paired with ${enTargets.get(target.id)}.`);
    } else {
      enTargets.set(target.id, post.id);
    }

    if (target.translationSlug === post.id && target.isDraft === post.isDraft) {
      pairs.push({ id: post.id, en: target.id });
    }
  }

  for (const post of enPosts) {
    if (!post.translationSlug) continue;
    const target = idBySlug.get(post.translationSlug);
    if (!target) {
      reportError(errors, `${post.filePath}: idSlug "${post.translationSlug}" does not match an Indonesian content ID.`);
      continue;
    }

    if (target.translationSlug !== post.id) {
      reportError(errors, `${post.filePath}: idSlug "${post.translationSlug}" is not reciprocal; ${target.filePath} must declare enSlug: "${post.id}".`);
    }
    if (target.isDraft !== post.isDraft) {
      reportError(errors, `${post.filePath}: translation pair has mismatched publication status (isDraft).`);
    }
    if (idTargets.has(target.id)) {
      reportError(errors, `${post.filePath}: Indonesian content ID "${target.id}" is already paired with ${idTargets.get(target.id)}.`);
    } else {
      idTargets.set(target.id, post.id);
    }
  }

  return pairs;
}

async function main() {
  const errors = [];
  const idPosts = await loadCollection("id", errors);
  const enPosts = await loadCollection("en", errors);

  if (idPosts.length === 0) reportError(errors, "No Indonesian Markdown/MDX content files were found.");
  if (enPosts.length === 0) reportError(errors, "No English Markdown/MDX content files were found.");

  const pairs = validateRelations(idPosts, enPosts, errors);
  if (errors.length > 0) {
    console.error(`Content relation validation failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  const publishedId = idPosts.filter((post) => !post.isDraft).length;
  const publishedEn = enPosts.filter((post) => !post.isDraft).length;
  console.log(
    `Content relation validation passed: ${idPosts.length + enPosts.length} content files, ${pairs.length} reciprocal translation pair(s).`,
  );
  console.log(
    `Published articles: ${publishedId} ID and ${publishedEn} EN. Unpaired articles are allowed; only declared translation links are required to be reciprocal.`,
  );
}

main().catch((error) => {
  console.error(`Content relation validation could not complete: ${error.message}`);
  process.exitCode = 1;
});
