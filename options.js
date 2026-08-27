import { getSettings, setSettings, resetSettings } from "./storage.js";
import { SITE_ADAPTERS } from "./content/site-adapters.js";

const sitesEl = document.getElementById("sites");
const termsEl = document.getElementById("terms");
const statusEl = document.getElementById("status");
const addTermForm = document.getElementById("add-term-form");
const newTermInput = document.getElementById("new-term");
const resetButton = document.getElementById("reset");

function showStatus(message) {
  statusEl.textContent = message;
  setTimeout(() => {
    statusEl.textContent = "";
  }, 1500);
}

function renderSites(sites) {
  sitesEl.innerHTML = "";
  for (const adapter of SITE_ADAPTERS) {
    const row = document.createElement("label");
    row.className = "site-row";

    const text = document.createElement("span");
    text.textContent = adapter.label;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = sites[adapter.id] !== false;
    checkbox.addEventListener("change", async () => {
      const settings = await getSettings();
      settings.sites[adapter.id] = checkbox.checked;
      await setSettings({ sites: settings.sites });
      showStatus("Saved");
    });

    row.append(text, checkbox);
    sitesEl.appendChild(row);
  }
}

function renderTerms(terms) {
  termsEl.innerHTML = "";
  for (const term of terms) {
    const row = document.createElement("div");
    row.className = "term-row";

    const label = document.createElement("span");
    label.textContent = term;

    const removeButton = document.createElement("button");
    removeButton.className = "btn-danger";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", async () => {
      const settings = await getSettings();
      const updatedTerms = settings.terms.filter((existing) => existing !== term);
      await setSettings({ terms: updatedTerms });
      renderTerms(updatedTerms);
      showStatus("Saved");
    });

    row.append(label, removeButton);
    termsEl.appendChild(row);
  }
}

addTermForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const term = newTermInput.value.trim();
  if (!term) return;

  const settings = await getSettings();
  if (settings.terms.includes(term)) {
    showStatus("Already in the list");
    return;
  }

  const updatedTerms = [...settings.terms, term];
  await setSettings({ terms: updatedTerms });
  renderTerms(updatedTerms);
  newTermInput.value = "";
  showStatus("Saved");
});

resetButton.addEventListener("click", async () => {
  await resetSettings();
  const settings = await getSettings();
  renderSites(settings.sites);
  renderTerms(settings.terms);
  showStatus("Reset to defaults");
});

async function init() {
  const settings = await getSettings();
  renderSites(settings.sites);
  renderTerms(settings.terms);
}

init();
