"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, media, whenVisible } from "./gsap";

/**
 * Letters fly in from scattered positions and settle into the word — used
 * for names and signatures. Visibility-triggered, plays once.
 */
export function ScatterText({ as: Tag = "span", className, children }: { as?: ElementType; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const split = SplitText.create(el, { type: "chars,words", charsClass: "inline-block" });
        const rand = gsap.utils.random;
        const tween = gsap.from(split.chars, {
          x: () => rand(-160, 160),
          y: () => rand(-120, 120),
          rotate: () => rand(-90, 90),
          scale: () => rand(0.3, 1.6),
          autoAlpha: 0,
          filter: "blur(8px)",
          duration: 1.6,
          ease: "expo.out",
          stagger: { each: 0.035, from: "random" },
          paused: true,
          onComplete: () => gsap.set(split.chars, { clearProps: "filter" }),
        });
        const stop = whenVisible(el, () => tween.play());
        return () => {
          stop();
          split.revert();
        };
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
