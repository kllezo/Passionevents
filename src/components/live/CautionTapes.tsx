"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, media } from "@/motion/gsap";

const WORDS = ["Passion Live", "Live", "Loud", "Together", "No skips", "Front row energy", "Turn it up"];

function Tape({ tone, dir }: { tone: "volt" | "black"; dir: 1 | -1 }) {
  const items = [...WORDS, ...WORDS, ...WORDS];
  return (
    <div
      className={`flex w-max whitespace-nowrap py-3 font-display text-[clamp(1.4rem,2.6vw,2.4rem)] uppercase leading-none md:py-4 ${
        tone === "volt" ? "bg-volt text-black" : "border-y border-white/15 bg-black text-white"
      }`}
    >
      <div data-tape-row="" data-dir={dir} className="flex shrink-0 items-center gap-8 pr-8">
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            {w}
            <span className={tone === "volt" ? "text-black/70" : "text-volt"}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Two "caution tape" banners crossing at an angle — they run in opposite
 * directions on their own and speed up / skew with scroll velocity.
 */
export function CautionTapes() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const rows = q<HTMLElement>("[data-tape-row]");
        const loops = rows.map((r) => {
          const dir = Number(r.dataset.dir);
          return gsap.fromTo(r, { xPercent: dir > 0 ? 0 : -33.333 }, { xPercent: dir > 0 ? -33.333 : 0, duration: 22, ease: "none", repeat: -1 });
        });
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => loops.forEach((l) => (self.isActive ? l.play() : l.pause())),
          onUpdate: (self) => {
            const v = gsap.utils.clamp(0, 6, Math.abs(self.getVelocity()) / 400);
            loops.forEach((l) => gsap.to(l, { timeScale: 1 + v, duration: 0.3, overwrite: true }));
          },
        });
        loops.forEach((l) => l.pause());
        return () => st.kill();
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative h-[clamp(9rem,16vw,15rem)] overflow-hidden bg-void" aria-hidden="true">
      <div className="absolute left-[-5%] top-1/2 w-[110%] -translate-y-1/2 rotate-[-4deg] shadow-[0_20px_60px_-20px_rgb(255_90_31/0.6)]">
        <Tape tone="volt" dir={1} />
      </div>
      <div className="absolute left-[-5%] top-1/2 w-[110%] -translate-y-1/2 rotate-[3deg]">
        <Tape tone="black" dir={-1} />
      </div>
    </div>
  );
}
