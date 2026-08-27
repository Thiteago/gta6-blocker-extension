export const SITE_ADAPTERS = [
  {
    id: "youtube",
    label: "YouTube",
    hostnames: ["www.youtube.com"],
    containerSelectors: [
      "ytd-video-renderer",
      "ytd-rich-item-renderer",
      "ytd-compact-video-renderer",
      "ytd-grid-video-renderer",
      "ytd-playlist-video-renderer"
    ]
  },
  {
    id: "x",
    label: "X / Twitter",
    hostnames: ["x.com", "twitter.com"],
    containerSelectors: ["article[data-testid=\"tweet\"]"]
  },
  {
    id: "reddit",
    label: "Reddit",
    hostnames: ["www.reddit.com", "old.reddit.com"],
    containerSelectors: ["shreddit-post", "div.thing", "article"]
  }
];

const GENERIC_CONTAINER_SELECTOR = "article, li, section, div";
const MIN_CONTAINER_AREA = 2000;

export function getAdapterForHostname(hostname) {
  return SITE_ADAPTERS.find((adapter) => adapter.hostnames.includes(hostname)) ?? null;
}

export function findContainer(node, adapter) {
  const selectors = adapter?.containerSelectors ?? [];
  for (const selector of selectors) {
    const match = node.closest(selector);
    if (match) return match;
  }
  return findGenericContainer(node);
}

function findGenericContainer(node) {
  let current = node.closest(GENERIC_CONTAINER_SELECTOR);
  while (current) {
    const { width, height } = current.getBoundingClientRect();
    if (width * height >= MIN_CONTAINER_AREA) return current;
    const parent = current.parentElement?.closest(GENERIC_CONTAINER_SELECTOR);
    if (!parent || parent === current) break;
    current = parent;
  }
  return current ?? node;
}
