"use client";

import { useRef } from "react";
import { gsap, useGSAP, media } from "@/motion/gsap";

export type MotifKind = "petals" | "beams" | "confetti" | "lanterns" | "spotlights";

/**
 * A light, page-specific ambient layer over each category hero: falling rose
 * petals (weddings), a scanning light line (corporate), drifting confetti
 * (private), rising lanterns (destination), sweeping spotlights (production).
 * Transforms and opacity only; a dozen-odd elements; none for reduced motion.
 */
export function HeroMotif({ kind }: { kind: MotifKind }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const rand = gsap.utils.random;
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const items = q<HTMLElement>("[data-m]");
        const h = window.innerHeight;
        const w = window.innerWidth;
        gsap.set(root.current, { autoAlpha: 1 });
        // repeatRefresh re-rolls every random value on each loop, so nothing repeats visibly
        // and every tween stays inside this context (cleaned up on unmount).
        if (kind === "petals" || kind === "confetti") {
          gsap.fromTo(
            items,
            { x: () => rand(0, w), y: -60, rotate: () => rand(0, 360), autoAlpha: 0 },
            {
              x: () => `+=${rand(-160, 160)}`,
              y: h + 60,
              rotate: () => `+=${rand(180, 540)}`,
              autoAlpha: 1,
              duration: () => rand(7, 12),
              ease: "none",
              delay: () => rand(0, 6),
              repeat: -1,
              repeatRefresh: true,
            }
          );
        } else if (kind === "lanterns") {
          gsap.fromTo(
            items,
            { x: () => rand(0, w), y: h + 40, scale: () => rand(0.6, 1.2), autoAlpha: 0 },
            { x: () => `+=${rand(-80, 80)}`, y: -80, autoAlpha: 1, duration: () => rand(12, 18), ease: "none", delay: () => rand(0, 8), repeat: -1, repeatRefresh: true }
          );
        } else if (kind === "beams" || kind === "spotlights") {
          gsap.fromTo(items, { rotate: (i) => (i % 2 ? 22 : -22) }, { rotate: (i) => (i % 2 ? -22 : 22), duration: () => rand(4, 6), ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.5 });
          if (kind === "beams") gsap.fromTo(q("[data-scan]"), { yPercent: -10 }, { yPercent: 1100, duration: 6, ease: "power1.inOut", repeat: -1, repeatDelay: 1 });
        }
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none invisible absolute inset-0 z-[1] overflow-hidden opacity-0">
      {kind === "petals" &&
        Array.from({ length: 16 }, (_, i) => (
          <svg key={i} data-m="" viewBox="0 0 20 28" className="absolute left-0 top-0 h-7 w-5">
            <path d="M10 0 C20 8 18 22 10 28 C2 22 0 8 10 0Z" fill={i % 3 ? "#ebc3c8" : "#f29c8f"} opacity="0.9" />
          </svg>
        ))}
      {kind === "confetti" &&
        Array.from({ length: 22 }, (_, i) => (
          <span
            key={i}
            data-m=""
            className={`absolute left-0 top-0 block ${i % 3 === 0 ? "size-2.5 rounded-full" : "h-3.5 w-2 rounded-[2px]"}`}
            style={{ backgroundColor: ["#f29c8f", "#f2d6a2", "#bfe3d4", "#d7c7ef", "#ebc3c8"][i % 5] }}
          />
        ))}
      {kind === "lanterns" &&
        Array.from({ length: 12 }, (_, i) => (
          <span key={i} data-m="" className="absolute left-0 top-0 block h-7 w-5 rounded-[40%_40%_30%_30%] bg-gradient-to-b from-[#ffd59a] to-[#f29c38] shadow-[0_0_24px_8px_rgb(255_190_110/0.45)]" />
        ))}
      {(kind === "beams" || kind === "spotlights") &&
        [12, 36, 64, 88].map((x, i) => (
          <span
            key={x}
            data-m=""
            className="absolute -top-16 h-[130%] w-[30vw] origin-top -translate-x-1/2"
            style={{
              left: `${x}%`,
              background:
                kind === "spotlights"
                  ? `conic-gradient(from 170deg at 50% 0%, transparent 0deg, rgb(255 232 214 / ${i % 2 ? 0.16 : 0.22}) 10deg, transparent 20deg)`
                  : "conic-gradient(from 174deg at 50% 0%, transparent 0deg, rgb(191 220 255 / 0.12) 6deg, transparent 12deg)",
            }}
          />
        ))}
      {kind === "beams" && <span data-scan="" className="absolute inset-x-0 top-0 block h-[9%] bg-gradient-to-b from-transparent via-white/10 to-transparent" />}
    </div>
  );
}
