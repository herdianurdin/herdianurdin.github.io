/**
 * Wrap Markdown/MDX tables in a scroll container while preserving native table
 * semantics. This is performed during content compilation, not after page load.
 */
function hasScrollWrapperClass(node) {
  const classNames = node?.properties?.className;
  return (
    node?.type === "element" &&
    node.tagName === "div" &&
    Array.isArray(classNames) &&
    classNames.includes("table-scroll")
  );
}

function wrapTables(parent, insideScrollWrapper = false) {
  if (!Array.isArray(parent?.children)) return;

  const nextChildren = [];
  for (const child of parent.children) {
    const isTable = child?.type === "element" && child.tagName === "table";

    if (isTable && !insideScrollWrapper) {
      nextChildren.push({
        type: "element",
        tagName: "div",
        properties: { className: ["table-scroll"] },
        children: [child],
      });
      continue;
    }

    wrapTables(child, insideScrollWrapper || hasScrollWrapperClass(child));
    nextChildren.push(child);
  }

  parent.children = nextChildren;
}

export default function rehypeContentWrappers() {
  return (tree) => wrapTables(tree);
}
