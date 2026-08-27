const MUTATION_DEBOUNCE_MS = 200;
const RESCAN_INTERVAL_MS = 2000;

export function watchForChanges(callback) {
  let debounceId = null;

  const mutationObserver = new MutationObserver(() => {
    if (debounceId !== null) clearTimeout(debounceId);
    debounceId = setTimeout(callback, MUTATION_DEBOUNCE_MS);
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  const intervalId = setInterval(() => {
    if (document.visibilityState === "visible") callback();
  }, RESCAN_INTERVAL_MS);

  return () => {
    mutationObserver.disconnect();
    clearInterval(intervalId);
    if (debounceId !== null) clearTimeout(debounceId);
  };
}
