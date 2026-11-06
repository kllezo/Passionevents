"use client";

/**
 * Tiny coordination point between the opening sequence and the hero: the
 * hero waits for `intro:done` when the intro is playing, otherwise it starts
 * immediately.
 */
const EVENT = "pe:intro-done";

export function introPending() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("intro-pending");
}

export function markIntroDone() {
  document.documentElement.classList.remove("intro-pending");
  try {
    sessionStorage.setItem("pe-intro-seen", "1");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function onIntroDone(cb: () => void) {
  if (!introPending()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(EVENT, handler, { once: true });
  return () => window.removeEventListener(EVENT, handler);
}
