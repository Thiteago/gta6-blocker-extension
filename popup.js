import { getSettings, setSettings } from "./storage.js";

const enabledToggle = document.getElementById("enabled-toggle");
const countValue = document.getElementById("count-value");
const openOptionsButton = document.getElementById("open-options");

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function refreshCount() {
  const tab = await getActiveTab();
  if (!tab?.id) return;

  chrome.tabs.sendMessage(tab.id, { type: "gta6-blocker/get-count" }, (response) => {
    if (chrome.runtime.lastError) return;
    countValue.textContent = response?.hiddenCount ?? 0;
  });
}

enabledToggle.addEventListener("change", async () => {
  await setSettings({ enabled: enabledToggle.checked });
});

openOptionsButton.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

async function init() {
  const settings = await getSettings();
  enabledToggle.checked = settings.enabled;
  refreshCount();
}

init();
