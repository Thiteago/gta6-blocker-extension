export const DEFAULT_TERMS = [
  "GTA VI",
  "GTA 6",
  "GTA6",
  "GTAVI",
  "Grand Theft Auto VI",
  "Grand Theft Auto 6"
];

export const DEFAULT_SITES = {
  youtube: true,
  x: true,
  reddit: true
};

const DEFAULTS = {
  enabled: true,
  terms: DEFAULT_TERMS,
  sites: DEFAULT_SITES
};

export async function getSettings() {
  const stored = await chrome.storage.sync.get(DEFAULTS);
  return stored;
}

export async function setSettings(partial) {
  await chrome.storage.sync.set(partial);
}

export function onSettingsChanged(callback) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") callback(changes);
  });
}

export async function resetSettings() {
  await chrome.storage.sync.set(DEFAULTS);
}
