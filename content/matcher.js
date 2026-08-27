function escapeRegExp(term) {
  return term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildTermRegex(terms) {
  const pattern = terms.map(escapeRegExp).join("|");
  return new RegExp(`\\b(?:${pattern})\\b`, "i");
}

export function findMatchingTextNodes(root, regex) {
  const matches = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(textNode) {
      const parentTag = textNode.parentElement?.tagName;
      if (parentTag === "SCRIPT" || parentTag === "STYLE") return NodeFilter.FILTER_REJECT;
      return regex.test(textNode.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });

  let node;
  while ((node = walker.nextNode())) matches.push(node);
  return matches;
}
