"use client";

import { useEffect } from "react";

/**
 * Pauses infinite CSS animations (marquees, slow spins, floats, balloons,
 * equaliser bars) while their element is off screen, and resumes them before
 * it scrolls back in. Nothing changes visually; the browser just stops
 * animating what no one can see. New elements (client-side navigation) are
 * picked up by a cheap periodic scan.
 */
const SELECTOR = '[class*="animate-marquee"], [class*="animate-spin-slow"], [class*="animate-float"], [class*="_infinite"], .balloon, .neon-border';

export function OffscreenPause() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.toggleAttribute("data-offscreen", !e.isIntersecting);
      },
      { rootMargin: "200px 0px" }
    );
    const scan = () =>
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    const first = window.setTimeout(scan, 800);
    const every = window.setInterval(scan, 4000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(every);
      io.disconnect();
    };
  }, []);
  return null;
}
