"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, media } from "./gsap";

type Flavor = "events" | "live";
type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  split?: "lines" | "words" | "chars";
  trigger?: "scroll" | "mount";
  delay?: number;
  stagger?: number;
  flavor?: Flavor;
  start?: string;
  id?: string;
};

/**
 * Typography reveal through line masks.
 *  events → lines rise slowly from behind a mask with a slight tilt (editorial)
 *  live   → characters punch in from below with skew (kinetic)
 */
export function RevealText({
  as: Tag = "div",
  children,
  className,
  split = "lines",
  trigger = "scroll",
  delay = 0,
  stagger,
  flavor = "events",
  start = "top 85%",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const type = split === "chars" ? "lines,words,chars" : split === "words" ? "lines,words" : "lines";
        const instance = SplitText.create(el, {
          type,
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            const targets = split === "chars" ? self.chars : split === "words" ? self.words : self.lines;
            const vars: gsap.TweenVars =
              flavor === "live"
                ? { yPercent: 120, skewY: 8, duration: 0.9, ease: "expo.out", stagger: stagger ?? 0.022 }
                : { yPercent: 108, rotate: 2.5, transformOrigin: "0% 0%", duration: 1.35, ease: "expo.out", stagger: stagger ?? 0.11 };
            return gsap.from(targets, {
              ...vars,
              delay,
              scrollTrigger: trigger === "scroll" ? { trigger: el, start, once: true } : undefined,
            });
          },
        });
        return () => instance.revert();
      });
      mm.add(media.reduced, () => {
        gsap.set(el, { visibility: "visible" });
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} id={id} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
