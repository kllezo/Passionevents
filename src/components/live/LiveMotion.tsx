"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";

/**
 * A list whose items are slapped onto the page like stickers when it comes
 * into view: they drop in oversized and tilted, then snap flat. Plays once.
 */
export function SlapIn({ as: Tag = "ul", className, children, ...rest }: { as?: ElementType; className?: string; children: ReactNode } & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const items = Array.from(el.children) as HTMLElement[];
        const rand = gsap.utils.random;
        const tween = gsap.fromTo(
          items,
          { scale: 1.35, rotate: () => rand(-12, 12), y: -40, autoAlpha: 0 },
          { scale: 1, rotate: 0, y: 0, autoAlpha: 1, duration: 0.7, ease: "back.out(2.2)", stagger: { each: 0.07, from: "random" }, paused: true, clearProps: "transform" }
        );
        return whenVisible(el, () => tween.play(), "0px 0px -15% 0px");
      });
    },
    { scope: ref }
  );
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/** A small label that decodes itself from random glyphs when it scrolls into view. */
export function ScrambleLabel({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const text = el.textContent ?? "";
        const tween = gsap.to(el, { duration: 1.1, scrambleText: { text, chars: "!<>-_\\/[]{}—=+*^?#01", speed: 0.6, revealDelay: 0.15 }, paused: true, ease: "none" });
        return whenVisible(el, () => tween.play());
      });
    },
    { scope: ref }
  );
  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
