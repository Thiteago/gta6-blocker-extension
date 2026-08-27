import { collectTextNodes } from "./dom-utils.js";

function escapeRegExp(term) {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildTermRegex(terms) {
  const pattern = terms.map(escapeRegExp).join("|");
  return new RegExp(`\\b(?:${pattern})\\b`, "i");
}

export function findMatchingTextNodes(root, regex) {
  return collectTextNodes(root).filter((node) => regex.test(node.textContent));
}
