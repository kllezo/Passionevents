"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, media } from "@/motion/gsap";

/** Oversized kinetic text that slides with scroll and skews with scroll velocity. */
export function VelocityMarquee({ words, className }: { words: string[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const rows = q<HTMLElement>("[data-row]");
        rows.forEach((r, i) =>
          gsap.fromTo(r, { xPercent: i % 2 ? -30 : 0 }, { xPercent: i % 2 ? 0 : -30, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } })
        );
        const skewTo = gsap.quickTo(rows, "skewX", { duration: 0.5, ease: "power3" });
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => skewTo(gsap.utils.clamp(-14, 14, self.getVelocity() / -260)),
          onLeave: () => skewTo(0),
          onLeaveBack: () => skewTo(0),
        });
        return () => st.kill();
      });
    },
    { scope: root }
  );
  const line = [...words, ...words, ...words];
  return (
    <div ref={root} className={`overflow-hidden py-10 ${className ?? ""}`} aria-hidden="true">
      {[0, 1].map((r) => (
        <div key={r} data-row="" className="flex w-max gap-10 whitespace-nowrap font-display text-[clamp(4rem,12vw,12rem)] uppercase leading-[0.95]">
          {line.map((w, i) => (
            <span key={i} className={(i + r) % 2 ? "text-outline text-white/70" : "text-white"}>
              {w}
              <span className="ml-10 text-volt">✦</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
