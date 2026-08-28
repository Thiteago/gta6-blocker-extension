export const EXTENSION_UI_ATTR = "data-gta6-extension-ui";

export function collectTextNodes(root, skipSelector) {
  const textNodes = [];
  walk(root);
  return textNodes;

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    if (node.tagName === "SCRIPT" || node.tagName === "STYLE") return;
    if (node.hasAttribute?.(EXTENSION_UI_ATTR)) return;
    if (skipSelector && node.matches?.(skipSelector)) return;
    if (node.shadowRoot) walk(node.shadowRoot);
    for (const child of node.childNodes) walk(child);
  }
}

export function closestAcrossShadow(node, selector) {
  let current = node;
  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE && current.matches(selector)) return current;
    const parent = current.parentNode;
    current = parent instanceof ShadowRoot ? parent.host : parent;
  }
  return null;
}
