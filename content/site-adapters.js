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
      "yt-lockup-view-model",
      "ytd-grid-video-renderer",
      "ytd-playlist-video-renderer",
      "ytd-comment-view-model",
      "ytd-notification-renderer"
    ],
    // The player subtree only ever holds YouTube's own overlays (pause suggestions,
    // endscreen wall, cards). Matching there blurs the video being watched, never
    // the recommendation that actually mentions the term.
    skipSelectors: ["ytd-player", "#movie_player", ".html5-video-player"]
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
const MAX_VIEWPORT_RATIO = 0.4;
const MAX_CLIMB_STEPS = 5;

const NEVER_BLUR_SELECTOR = [
  "html",
  "body",
  "main",
  "[role=\"main\"]",
  "ytd-app",
  "#page-manager",
  "#columns",
  "#primary",
  "#primary-inner",
  "#secondary",
  "#secondary-inner",
  "ytd-player",
  "#movie_player",
  ".html5-video-player"
].join(", ");

const PLAYER_SELECTOR = "ytd-player, #movie_player, .html5-video-player";

export function getAdapterForHostname(hostname) {
  return SITE_ADAPTERS.find((adapter) => adapter.hostnames.includes(hostname)) ?? null;
}

export function getSkipSelector(adapter) {
  const selectors = adapter?.skipSelectors ?? [];
  return selectors.length > 0 ? selectors.join(", ") : null;
}

export function findContainer(node, adapter) {
  const selectors = adapter?.containerSelectors ?? [];
  for (const selector of selectors) {
    const match = closestAcrossShadow(node, selector);
    if (match) return match;
  }
  return findGenericContainer(node);
}

function isBlurrableContainer(element) {
  if (element.matches(NEVER_BLUR_SELECTOR)) return false;
  // Never swallow the video the user is watching just because some overlay near it matched.
  if (element.querySelector(PLAYER_SELECTOR)) return false;
  return true;
}

function exceedsAreaBudget(area) {
  const viewportArea = window.innerWidth * window.innerHeight;
  if (viewportArea === 0) return false;
  return area > viewportArea * MAX_VIEWPORT_RATIO;
}

function findGenericContainer(node) {
  let current = closestAcrossShadow(node, GENERIC_CONTAINER_SELECTOR);
  let steps = 0;

  while (current && steps < MAX_CLIMB_STEPS) {
    const { width, height } = current.getBoundingClientRect();
    const area = width * height;
    // Ancestors only grow, so an oversized candidate ends the climb instead of widening it.
    if (exceedsAreaBudget(area)) return null;
    if (area >= MIN_CONTAINER_AREA && isBlurrableContainer(current)) return current;

    steps += 1;
    const parentNode = current.parentNode;
    const parentHost = parentNode instanceof ShadowRoot ? parentNode.host : current.parentElement;
    const next = parentHost ? closestAcrossShadow(parentHost, GENERIC_CONTAINER_SELECTOR) : null;
    if (!next || next === current) break;
    current = next;
  }
  return null;
}
