"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, media, whenVisible } from "./gsap";

/**
 * A list whose rows rise in one after another while their divider lines draw
 * across. Children should be <li> elements; each row's border is animated via
 * a pseudo-free scaleX on [data-rule] if present.
 */
export function StaggerList({ className, children, mobileOnly = false }: { className?: string; children: ReactNode; mobileOnly?: boolean }) {
  const ref = useRef<HTMLUListElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(mobileOnly ? media.mobile : media.ok, () => {
        const rows = Array.from(el.children) as HTMLElement[];
        const tl = gsap.timeline({ paused: true });
        tl.fromTo(rows, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" }, 0).fromTo(
          el.querySelectorAll("[data-rule]"),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, stagger: 0.08, ease: "power3.inOut" },
          0
        );
        return whenVisible(el, () => tl.play());
      });
    },
    { scope: ref, dependencies: [mobileOnly] }
  );
  return (
    <ul ref={ref} className={className}>
      {children}
    </ul>
  );
}
