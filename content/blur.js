const BLURRED_ATTR = "data-gta6-blurred";
const OVERLAY_ATTR = "data-gta6-overlay";

export function blurElement(container) {
  if (isBlurred(container)) return;

  const wrapper = document.createElement("div");
  const displayType = getComputedStyle(container).display;
  wrapper.style.position = "relative";
  wrapper.style.display = displayType === "inline" ? "inline-block" : displayType;

  container.replaceWith(wrapper);
  wrapper.appendChild(container);

  container.setAttribute(BLURRED_ATTR, "true");
  container.style.setProperty("filter", "blur(16px)", "important");
  container.style.setProperty("pointer-events", "none", "important");
  container.style.setProperty("user-select", "none", "important");

  const overlay = document.createElement("div");
  overlay.setAttribute(OVERLAY_ATTR, "true");
  overlay.textContent = "Hidden — possible GTA VI content (click to reveal)";
  Object.assign(overlay.style, {
    position: "absolute",
    inset: "0",
    zIndex: "2147483647",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.55)",
    color: "#fff",
    font: "600 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    textAlign: "center",
    cursor: "pointer",
    borderRadius: "8px",
    padding: "8px"
  });
  overlay.addEventListener("click", () => revealElement(container));

  wrapper.appendChild(overlay);
}

export function revealElement(container) {
  container.removeAttribute(BLURRED_ATTR);
  container.style.removeProperty("filter");
  container.style.removeProperty("pointer-events");
  container.style.removeProperty("user-select");
  container.parentElement?.querySelector(`[${OVERLAY_ATTR}]`)?.remove();
}

export function isBlurred(element) {
  return element.hasAttribute(BLURRED_ATTR);
}
