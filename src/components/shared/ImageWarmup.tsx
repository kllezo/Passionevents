"use client";

import { useEffect } from "react";

type Conn = { saveData?: boolean; effectiveType?: string };

/**
 * Photos are lazy-loaded, so normally each one only starts downloading when
 * you scroll right up to it — and photos inside sideways-moving strips start
 * even later. Once the page itself has finished loading, this quietly fetches
 * the rest of the page's photos in the background (nearest first, a few at a
 * time, at low priority), so they are already there when you reach them.
 *
 * Skipped when the visitor has asked to save data or is on a very slow
 * connection. Hidden images (e.g. the desktop layout on a phone) are ignored.
 */
export function ImageWarmup() {
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: Conn }).connection;
    if (conn?.saveData || /2g$/.test(conn?.effectiveType ?? "")) return;
    const max = conn?.effectiveType === "3g" ? 2 : 4;

    const claimed = new WeakSet<HTMLImageElement>();
    let queue: HTMLImageElement[] = [];
    let active = 0;
    let stopped = false;
    let scanTimer = 0;

    const pump = () => {
      while (!stopped && active < max && queue.length) {
        const img = queue.shift()!;
        if (!img.isConnected || img.complete) continue;
        active++;
        let finished = false;
        // Fetch the same file the photo will ask for (same srcset and sizes,
        // so the browser picks the same width) into the cache. The page's own
        // <img> is never touched, so React's markup stays exactly as rendered.
        const pre = new Image();
        const done = () => {
          if (finished) return;
          finished = true;
          active--;
          pre.onload = pre.onerror = null;
          pump();
        };
        pre.onload = pre.onerror = done;
        window.setTimeout(done, 12000);
        pre.fetchPriority = "low";
        pre.decoding = "async";
        if (img.sizes) pre.sizes = img.sizes;
        if (img.srcset) pre.srcset = img.srcset;
        pre.src = img.currentSrc || img.src;
      }
    };

    const visible = (img: HTMLImageElement) =>
      typeof img.checkVisibility === "function" ? img.checkVisibility() : img.getClientRects().length > 0;

    const scan = () => {
      if (stopped) return;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const fresh = Array.from(document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]')).filter(
        (img) => !claimed.has(img) && !img.complete && visible(img)
      );
      if (!fresh.length) return;
      fresh.forEach((img) => claimed.add(img));
      // Nearest first; photos further down the page beat ones already scrolled past.
      const dist = (img: HTMLImageElement) => {
        const r = img.getBoundingClientRect();
        const y = r.top > vh ? r.top - vh : r.bottom < 0 ? -r.bottom * 2 : 0;
        const x = r.left > vw ? r.left - vw : r.right < 0 ? -r.right : 0;
        return y + x;
      };
      queue = [...queue, ...fresh].sort((a, b) => dist(a) - dist(b));
      pump();
    };

    // New pages (client navigation) and late-mounted sections bring new photos.
    const rescan = () => {
      window.clearTimeout(scanTimer);
      scanTimer = window.setTimeout(scan, 2500);
    };
    const mo = new MutationObserver(rescan);

    let idle = 0;
    const start = () => {
      const kick = () => {
        scan();
        mo.observe(document.body, { childList: true, subtree: true });
      };
      // Well after load, when the browser is idle, so it never competes
      // with the first screen or the opening animation.
      const later = () => {
        if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(kick, { timeout: 4000 });
        else idle = setTimeout(kick, 600) as unknown as number;
      };
      idle = setTimeout(later, 3500) as unknown as number;
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      stopped = true;
      mo.disconnect();
      window.removeEventListener("load", start);
      window.clearTimeout(scanTimer);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      clearTimeout(idle);
    };
  }, []);

  return null;
}
