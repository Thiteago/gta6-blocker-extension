# Contributing

## Adding support for a new site

Adding a site is a two-step change:

1. **`manifest.json`** — add the site's URL pattern to `content_scripts[0].matches`, e.g.:
   ```json
   "https://www.instagram.com/*"
   ```

2. **`content/site-adapters.js`** — add an adapter entry to `SITE_ADAPTERS` describing how to find the "card" container to blur on that site:
   ```js
   {
     id: "instagram",
     label: "Instagram",
     hostnames: ["www.instagram.com"],
     containerSelectors: ["article"]
   }
   ```
   - `id` is the key used in the per-site toggle stored via `chrome.storage`
   - `label` is what shows up in the options page
   - `hostnames` must match `location.hostname` on the target site
   - `containerSelectors` is an ordered list of CSS selectors tried via `element.closest(...)`; the first match wins. If none match, a generic fallback picks the nearest reasonably-sized block ancestor

No adapter selectors are required to be perfect on day one — the generic fallback in `content/site-adapters.js` keeps things working while selectors get refined.

## Testing locally

1. Load the extension unpacked (`chrome://extensions` → Developer mode → Load unpacked)
2. Visit the site you're adding support for and navigate to a page/feed containing a GTA VI mention
3. After editing `manifest.json` or any file under `content/`, click the reload icon on the extension card in `chrome://extensions` and refresh the target page

## Code style

- Plain JavaScript with native ES modules — no build step, no TypeScript, no dependencies
- No code comments — keep names and structure self-explanatory instead
