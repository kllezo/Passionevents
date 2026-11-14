"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Draggable } from "gsap/Draggable";
import { useGSAP as baseUseGSAP } from "@gsap/react";
import { useEffect, useState, type RefObject } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin, ScrambleTextPlugin, Draggable, baseUseGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
  // Development-only handle for debugging timelines from the console.
  if (process.env.NODE_ENV === "development") (window as unknown as { __pe: unknown }).__pe = { gsap, ScrollTrigger };
}

/** Motion vocabulary shared by both universes. */
export const EASE = {
  silk: "expo.out", // Passion Events — slow settle
  bloom: "back.out(1.6)",
  curtain: "power4.inOut",
  snap: "power3.in", // Passion Live — percussive
  kick: "expo.inOut",
} as const;

export const media = {
  reduced: "(prefers-reduced-motion: reduce)",
  ok: "(prefers-reduced-motion: no-preference)",
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  finePointer: "(pointer: fine) and (hover: hover)",
};

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(media.reduced).matches;
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, Draggable };

/**
 * Setup queue: sections that become ready together are set up one per
 * macrotask (top of the page first), never all inside one long task.
 */
const setupQueue: (() => void)[] = [];
let pumping = false;
function pumpSetup() {
  const fn = setupQueue.shift();
  if (fn) fn();
  if (setupQueue.length) setTimeout(pumpSetup, 0);
  else pumping = false;
}
function scheduleSetup(fn: () => void) {
  setupQueue.push(fn);
  if (!pumping) {
    pumping = true;
    setTimeout(pumpSetup, 0);
  }
}

type GSAPConfig ={ scope?: RefObject<Element | null> | Element | string; dependencies?: unknown[]; revertOnUpdate?: boolean; eager?: boolean };

/**
 * useGSAP, set up just in time. A component's animation setup (timelines,
 * ScrollTriggers, SplitText measuring) runs when its scope element comes
 * within ~1.5 screens of the viewport instead of all at once during page
 * load. The animations themselves are unchanged — they are simply built
 * shortly before they can be seen, which keeps the main thread free while
 * the page loads.
 *
 * Sections that pin (and so change the page height) pass `eager: true` and
 * are built at load, in page order, so the layout never changes later.
 */
export function useGSAP(callback: Parameters<typeof baseUseGSAP>[0], config: GSAPConfig = {}) {
  const { eager, ...rest } = config;
  const scope = rest.scope && typeof rest.scope === "object" && "current" in rest.scope ? (rest.scope as RefObject<Element | null>) : undefined;
  const [near, setNear] = useState(Boolean(eager));

  useEffect(() => {
    if (near) return;
    const el = scope?.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      scheduleSetup(() => setNear(true));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          scheduleSetup(() => setNear(true));
        }
      },
      { rootMargin: "150% 0px 150% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near, scope]);

  return baseUseGSAP(
    (context, contextSafe) => {
      if (!near || typeof callback !== "function") return;
      return callback(context, contextSafe);
    },
    { ...rest, dependencies: [...(rest.dependencies ?? []), near] } as Parameters<typeof baseUseGSAP>[1]
  );
}

/**
 * Runs `cb` once when `el` scrolls into view. Based on real visibility
 * (IntersectionObserver), so layout shifts from pinned sections, late images
 * or route changes can never leave a reveal stuck in its hidden state.
 */
export function whenVisible(el: Element, cb: () => void, rootMargin = "0px 0px -8% 0px") {
  let done = false;
  const io = new IntersectionObserver(
    (entries) => {
      if (done || !entries.some((e) => e.isIntersecting)) return;
      done = true;
      io.disconnect();
      cb();
    },
    { rootMargin }
  );
  io.observe(el);
  return () => io.disconnect();
}
