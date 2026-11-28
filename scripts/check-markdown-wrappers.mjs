#!/usr/bin/env node
import assert from "node:assert/strict";
import rehypeContentWrappers from "./rehype-content-wrappers.mjs";

const table = () => ({
  type: "element",
  tagName: "table",
  properties: {},
  children: [{ type: "element", tagName: "tbody", properties: {}, children: [] }],
});

const originalTable = table();
const preWrappedTable = table();
const tree = {
  type: "root",
  children: [
    { type: "element", tagName: "p", properties: {}, children: [{ type: "text", value: "Before" }] },
    originalTable,
    {
      type: "element",
      tagName: "div",
      properties: { className: ["table-scroll"] },
      children: [preWrappedTable],
    },
    { type: "element", tagName: "p", properties: {}, children: [{ type: "text", value: "After" }] },
  ],
};

rehypeContentWrappers()(tree);

assert.equal(tree.children.length, 4, "The transform must preserve sibling count/order.");
assert.equal(tree.children[0].tagName, "p");
assert.equal(tree.children[1].tagName, "div");
assert.deepEqual(tree.children[1].properties.className, ["table-scroll"]);
assert.equal(tree.children[1].children[0], originalTable, "The native table node must be preserved.");
assert.equal(tree.children[2].tagName, "div");
assert.equal(tree.children[2].children.length, 1, "Existing scroll wrappers must not be duplicated.");
assert.equal(tree.children[2].children[0], preWrappedTable);
assert.equal(tree.children[3].tagName, "p");

console.log("Markdown table wrapper check passed: native table nodes, document order, and existing wrappers are preserved.");
