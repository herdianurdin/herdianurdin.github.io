#!/usr/bin/env node
import assert from "node:assert/strict";
import { getRelatedArticles, RELATED_ARTICLES_LIMIT } from "../src/utils/related-articles.mjs";

const makePost = (id, title, date, tags = []) => ({
  id,
  data: {
    title,
    description: `${title} description`,
    pubDate: new Date(date),
    tags,
  },
});

assert.equal(RELATED_ARTICLES_LIMIT, 3);

const current = makePost("current", "Current", "2026-11-28", ["Python", "Pemula", " Python "]);
const posts = [
  current,
  makePost("one-tag-new", "One tag, new", "2026-11-20", ["python"]),
  makePost("two-tags-old", "Two tags, old", "2026-10-01", ["PYTHON", "pemula"]),
  makePost("same-score-a", "Alpha", "2026-11-01", ["Python"]),
  makePost("same-score-b", "Beta", "2026-11-01", ["Python"]),
  makePost("unrelated", "Unrelated", "2026-11-27", ["Astro"]),
];

const results = getRelatedArticles(current, posts);
assert.deepEqual(results.map((post) => post.id), ["two-tags-old", "one-tag-new", "same-score-a"]);
assert.deepEqual(
  getRelatedArticles(current, posts, 4).map((post) => post.id),
  ["two-tags-old", "one-tag-new", "same-score-a"],
);
assert.equal(getRelatedArticles(current, posts, 99).length, 3);
assert.equal(getRelatedArticles(current, posts, 2).length, 2);
assert.equal(getRelatedArticles(current, [current, posts[5]]).length, 0);
assert.equal(getRelatedArticles(makePost("no-tags", "No tags", "2026-11-28"), posts).length, 0);
assert.equal(getRelatedArticles(current, posts, 0).length, 0);

console.log("Related article selection check passed: tag relevance, deduplication, deterministic ordering, and the hard three-article maximum are valid.");
