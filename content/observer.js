export function observeMutations(root, onMutation) {
  const observer = new MutationObserver((mutations) => {
    const addedNodes = mutations.flatMap((mutation) => Array.from(mutation.addedNodes));
    const relevantNodes = addedNodes.filter((node) => node.nodeType === Node.ELEMENT_NODE);
    if (relevantNodes.length > 0) onMutation(relevantNodes);
  });

  observer.observe(root, { childList: true, subtree: true });
  return observer;
}
