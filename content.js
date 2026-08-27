(async () => {
  const { getSettings, onSettingsChanged } = await import(chrome.runtime.getURL("storage.js"));
  const { buildTermRegex, findMatchingTextNodes } = await import(
    chrome.runtime.getURL("content/matcher.js")
  );
  const { getAdapterForHostname, findContainer } = await import(
    chrome.runtime.getURL("content/site-adapters.js")
  );
  const { blurElement, isBlurred, isRevealed, revealAll } = await import(
    chrome.runtime.getURL("content/blur.js")
  );
  const { watchForChanges } = await import(chrome.runtime.getURL("content/observer.js"));

  const adapter = getAdapterForHostname(location.hostname);

  let enabled = true;
  let regex = null;
  let hiddenCount = 0;
  let lastHref = location.href;

  function siteIsEnabled(sites) {
    if (!adapter) return true;
    return sites[adapter.id] !== false;
  }

  function scan(root) {
    if (!enabled || !regex) return;

    const textNodes = findMatchingTextNodes(root, regex);
    for (const textNode of textNodes) {
      const container = findContainer(textNode.parentElement, adapter);
      if (!container || isBlurred(container) || isRevealed(container)) continue;
      blurElement(container);
      hiddenCount += 1;
    }
  }

  function handleChange() {
    if (location.href !== lastHref) {
      lastHref = location.href;
      revealAll();
      hiddenCount = 0;
    }
    scan(document.body);
  }

  async function init() {
    const settings = await getSettings();
    enabled = settings.enabled && siteIsEnabled(settings.sites);
    regex = buildTermRegex(settings.terms);

    if (!enabled) return;

    scan(document.body);
    watchForChanges(handleChange);
  }

  onSettingsChanged(async () => {
    const settings = await getSettings();
    enabled = settings.enabled && siteIsEnabled(settings.sites);
    regex = buildTermRegex(settings.terms);
    if (enabled) scan(document.body);
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "gta6-blocker/get-count") {
      sendResponse({ hiddenCount, enabled });
    }
  });

  init();
})();
