const BLURRED_ATTR = "data-gta6-blurred";

const trackedOverlays = new Map();
let rafId = null;

function createOverlay(container) {
  const overlay = document.createElement("div");
  overlay.textContent = "Hidden — possible GTA VI content (click to reveal)";
  Object.assign(overlay.style, {
    position: "absolute",
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
    padding: "8px",
    boxSizing: "border-box"
  });
  overlay.addEventListener("click", () => revealElement(container));
  document.body.appendChild(overlay);
  return overlay;
}

function positionOverlay(overlay, container) {
  const rect = container.getBoundingClientRect();
  overlay.style.top = `${rect.top + window.scrollY}px`;
  overlay.style.left = `${rect.left + window.scrollX}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
}

function stopTracking(container) {
  const overlay = trackedOverlays.get(container);
  if (!overlay) return;
  overlay.remove();
  trackedOverlays.delete(container);
  if (trackedOverlays.size === 0 && rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function tick() {
  for (const [container, overlay] of trackedOverlays) {
    if (!container.isConnected) {
      stopTracking(container);
      continue;
    }
    positionOverlay(overlay, container);
  }
  rafId = trackedOverlays.size > 0 ? requestAnimationFrame(tick) : null;
}

export function blurElement(container) {
  if (isBlurred(container)) return;

  container.setAttribute(BLURRED_ATTR, "true");
  container.style.setProperty("filter", "blur(16px)", "important");
  container.style.setProperty("pointer-events", "none", "important");
  container.style.setProperty("user-select", "none", "important");

  const overlay = createOverlay(container);
  positionOverlay(overlay, container);
  trackedOverlays.set(container, overlay);

  if (rafId === null) rafId = requestAnimationFrame(tick);
}

export function revealElement(container) {
  container.removeAttribute(BLURRED_ATTR);
  container.style.removeProperty("filter");
  container.style.removeProperty("pointer-events");
  container.style.removeProperty("user-select");
  stopTracking(container);
}

export function isBlurred(element) {
  return element.hasAttribute(BLURRED_ATTR);
}
