const BLURRED_ATTR = "data-gta6-blurred";
const OVERLAY_CLASS = "gta6-blocker-overlay";

let styleInjected = false;

function injectStyleOnce() {
  if (styleInjected) return;
  styleInjected = true;
  const style = document.createElement("style");
  style.textContent = `
    [${BLURRED_ATTR}] { position: relative; }
    [${BLURRED_ATTR}] > *:not(.${OVERLAY_CLASS}) { filter: blur(16px); pointer-events: none; user-select: none; }
    .${OVERLAY_CLASS} {
      position: absolute;
      inset: 0;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.55);
      color: #fff;
      font: 600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      text-align: center;
      cursor: pointer;
      border-radius: 8px;
      padding: 8px;
    }
  `;
  document.head.appendChild(style);
}

export function blurElement(element) {
  if (element.hasAttribute(BLURRED_ATTR)) return;
  injectStyleOnce();
  element.setAttribute(BLURRED_ATTR, "true");

  const overlay = document.createElement("div");
  overlay.className = OVERLAY_CLASS;
  overlay.textContent = "Hidden — possible GTA VI content (click to reveal)";
  overlay.addEventListener("click", () => revealElement(element));

  element.appendChild(overlay);
}

export function revealElement(element) {
  element.removeAttribute(BLURRED_ATTR);
  element.querySelector(`.${OVERLAY_CLASS}`)?.remove();
}

export function isBlurred(element) {
  return element.hasAttribute(BLURRED_ATTR);
}
