"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);
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

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP };
