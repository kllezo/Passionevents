"use client";

import { useRef } from "react";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { Bloom } from "./botanical/Sprig";

/**
 * The thread between the two founders: a line draws down the gutter as the
 * section scrolls, a bloom opens at its centre and the script "&" settles in.
 */
export function FoundersJoin({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 45%", scrub: 1 } });
        tl.from(q("[data-thread]"), { drawSVG: "0%", duration: 1, ease: "none" }, 0)
          .from(q("[data-join-bloom]"), { scale: 0, rotate: -160, duration: 0.35, ease: "back.out(2)" }, 0.3)
          .from(q("[data-amp]"), { autoAlpha: 0, scale: 0.6, y: 30, duration: 0.35, ease: "power3.out" }, 0.4);
      });
    },
    { scope: root }
  );
  return (
    <div ref={root} aria-hidden="true" className={`relative flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 40 1000" preserveAspectRatio="none" className="absolute inset-y-[6%] left-1/2 h-[88%] w-10 -translate-x-1/2 overflow-visible">
        <path data-thread="" d="M20 0 C 2 160, 38 330, 20 500 S 2 840, 20 1000" fill="none" stroke="var(--color-rose)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="relative grid place-items-center">
        <svg data-join-bloom="" viewBox="-30 -30 60 60" className="size-28">
          <Bloom r={24} />
        </svg>
        <span data-amp="" className="absolute font-script text-[6.5rem] leading-none text-coral drop-shadow-[0_6px_18px_rgb(255_255_255/0.9)]">
          &amp;
        </span>
      </div>
    </div>
  );
}
