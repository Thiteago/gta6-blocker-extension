# No GTA VI Spoilers

A Chrome extension that blurs posts, videos, and cards mentioning GTA VI, so you can keep browsing without spoilers or hype until the game is out on PC.

## Features

- Blurs any card/post/video that mentions "GTA VI", "Grand Theft Auto VI" and common variants, instead of just hiding text
- Click-to-reveal on a blurred item if you change your mind — resets on page reload
- Works on dynamically loaded feeds (infinite scroll) via a `MutationObserver`
- Per-site toggle — enable or disable the blur independently for each supported site (e.g. keep it off on X/Twitter but on everywhere else)
- Fully customizable term list from the options page — add or remove terms without touching code
- Zero dependencies, zero build step — plain JavaScript, loaded straight from source

## Supported sites

- YouTube
- X / Twitter
- Reddit

Want another site supported? See [CONTRIBUTING.md](CONTRIBUTING.md) — it's a two-file change.

## Installation

1. Clone this repository:
   ```
   git clone <this-repo-url>
   ```
2. Open `chrome://extensions` in Chrome
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" and select the `gta6-blocker-extension` folder

## How it works

- `content.js` is injected into the supported sites and orchestrates the pipeline. It's a classic script that loads its dependencies via dynamic `import()`, since Chrome doesn't support ES module content scripts declared in the manifest
- `content/dom-utils.js` walks text nodes and finds ancestors *across Shadow DOM boundaries* — required because YouTube and Reddit render their feeds inside web components with shadow roots
- `content/matcher.js` builds a case-insensitive regex from the configured terms and scans text nodes
- `content/site-adapters.js` maps each match to the right "card" container per site (falling back to a generic heuristic elsewhere)
- `content/blur.js` applies the blur (via inline styles, so it also works on elements rendered inside a shadow root) and handles click-to-reveal
- `content/observer.js` watches the page for newly loaded content and re-scans it
- `storage.js` persists settings (enabled state, terms, per-site toggles) via `chrome.storage.sync`
- `popup.html`/`popup.js` show a quick on/off toggle and how many items were hidden on the current tab
- `options.html`/`options.js` let you manage the term list and per-site toggles

## Permissions

| Permission | Why it's needed |
|---|---|
| `storage` | Persist your settings (enabled state, terms, per-site toggles) across sessions |

No `<all_urls>` or broad host permission is requested — the content script only runs on the sites listed in `manifest.json`.

## License

MIT — see [LICENSE](LICENSE).
