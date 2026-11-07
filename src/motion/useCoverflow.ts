"use client";

import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "./gsap";

/**
 * Coverflow for native horizontal swipe strips (phones/tablets). Each
 * `[data-cf]` child tilts, scales and dims by its distance from the strip's
 * centre as the user swipes; `onActive` reports the centred index. Scrolling
 * stays fully native (scroll-snap), we only write transforms in rAF.
 */
export function useCoverflow(
  ref: RefObject<HTMLElement | null>,
  { rotate = 10, scale = 0.12, dim = 0.45, onActive }: { rotate?: number; scale?: number; dim?: number; onActive?: (i: number) => void } = {}
) {
  useEffect(() => {
    const strip = ref.current;
    if (!strip) return;
    const items = Array.from(strip.querySelectorAll<HTMLElement>("[data-cf]"));
    if (!items.length) return;
    const still = prefersReducedMotion();
    let raf = 0;
    let last = -1;

    const update = () => {
      raf = 0;
      const box = strip.getBoundingClientRect();
      if (box.width === 0) return; // hidden (desktop layout)
      const centre = box.left + box.width / 2;
      let best = 0;
      let bestD = Infinity;
      items.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = (r.left + r.width / 2 - centre) / r.width;
        const a = Math.min(Math.abs(d), 1.5);
        if (Math.abs(d) < bestD) {
          bestD = Math.abs(d);
          best = i;
        }
        if (!still) {
          el.style.transform = `perspective(1000px) rotateY(${(-Math.max(-1.5, Math.min(1.5, d)) * rotate).toFixed(2)}deg) scale(${(1 - a * scale).toFixed(3)})`;
          el.style.opacity = String(1 - Math.min(a, 1) * dim);
        }
      });
      if (best !== last) {
        last = best;
        onActive?.(best);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    strip.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      strip.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // onActive is intentionally read at mount; callers pass a stable setter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, rotate, scale, dim]);
}
