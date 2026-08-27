export function observeMutations(root, onMutation) {
  const observedRoots = new WeakSet();

  function attach(node) {
    if (observedRoots.has(node)) return;
    observedRoots.add(node);

    const observer = new MutationObserver((mutations) => {
      const addedNodes = mutations.flatMap((mutation) => Array.from(mutation.addedNodes));
      const relevantNodes = addedNodes.filter((node) => node.nodeType === Node.ELEMENT_NODE);
      for (const added of relevantNodes) attachToSubtree(added);
      if (relevantNodes.length > 0) onMutation(relevantNodes);
    });

    observer.observe(node, { childList: true, subtree: true });
  }

  function attachToSubtree(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.shadowRoot) attach(node.shadowRoot);
    for (const child of node.children) attachToSubtree(child);
  }

  attach(root);
  attachToSubtree(root);
}
