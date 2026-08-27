import { closestAcrossShadow } from "./dom-utils.js";

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
    const match = closestAcrossShadow(node, selector);
    if (match) return match;
  }
  return findGenericContainer(node);
}

function findGenericContainer(node) {
  let current = closestAcrossShadow(node, GENERIC_CONTAINER_SELECTOR);
  while (current) {
    const { width, height } = current.getBoundingClientRect();
    if (width * height >= MIN_CONTAINER_AREA) return current;

    const parentNode = current.parentNode;
    const parentHost = parentNode instanceof ShadowRoot ? parentNode.host : current.parentElement;
    const next = parentHost ? closestAcrossShadow(parentHost, GENERIC_CONTAINER_SELECTOR) : null;
    if (!next || next === current) break;
    current = next;
  }
  return current ?? node;
}
