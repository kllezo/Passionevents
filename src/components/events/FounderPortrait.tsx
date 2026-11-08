"use client";

import { useRef } from "react";
import type { SiteImage } from "@/content/media";
import { Pic } from "@/components/shared/Pic";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { Bloom } from "./botanical/Sprig";

const SLATS = 7;

/**
 * Founder portrait assembled from vertical slats. As the section scrolls in,
 * the slats glide in from alternate directions and lock together inside the
 * arch, the rose frame draws itself around them, blooms open on the corners
 * and a light sweep crosses the finished photograph. Scroll-scrubbed, so it
 * moves exactly with the reader and never jumps.
 */
export function FounderPortrait({ image }: { image: SiteImage }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const slats = q<HTMLElement>("[data-slat]");
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 55%", scrub: 1 },
        });
        tl.fromTo(slats, { y: 0, yPercent: (i) => (i % 2 ? 105 : -105), scale: 1.15 }, { y: 0, yPercent: 0, scale: 1, duration: 1, stagger: 0.06 }, 0)
          .from(q("[data-frame]"), { drawSVG: "50% 50%", duration: 1.1, ease: "power2.inOut" }, 0.1)
          .from(q("[data-frame-2]"), { drawSVG: "0%", duration: 1.1, ease: "power2.inOut" }, 0.25)
          .from(q("[data-corner]"), { scale: 0, rotate: -120, duration: 0.6, stagger: 0.1, ease: "back.out(2)" }, 0.8)
          .fromTo(q("[data-sheen]"), { xPercent: -120, opacity: 1 }, { xPercent: 320, duration: 0.7, ease: "power1.inOut" }, 1.05)
          .from(q("[data-caption]"), { autoAlpha: 0, y: 20, duration: 0.5 }, 1.1);

        // After it has assembled, the portrait drifts slowly against the page.
        gsap.fromTo(q("[data-portrait-inner]"), { yPercent: -3 }, { yPercent: 3, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative max-sm:px-4">
      <div className="relative aspect-[3/4] w-full">
        <div className="arch absolute inset-0 overflow-hidden rounded-t-full bg-cream">
          <div data-portrait-inner="" className="absolute inset-[-4%_0]">
            {Array.from({ length: SLATS }, (_, i) => {
              const l = (i / SLATS) * 100;
              const r = 100 - ((i + 1) / SLATS) * 100;
              return (
                <div
                  key={i}
                  data-slat=""
                  aria-hidden={i > 0 || undefined}
                  className="absolute inset-0"
                  // a hairline of overlap hides sub-pixel seams between slats
                  style={{ clipPath: `inset(0 ${Math.max(0, r - 0.15)}% 0 ${Math.max(0, l - 0.15)}%)` }}
                >
                  <Pic image={image} alt={i === 0 ? image.alt : ""} sizes="(max-width: 1024px) 92vw, 40vw" className="object-top" />
                </div>
              );
            })}
          </div>
          <div data-sheen="" aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0" />
        </div>

        <svg viewBox="0 0 300 400" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <path data-frame="" d="M-12 412 V150 A162 162 0 0 1 312 150 V412 Z" fill="none" stroke="var(--color-rose)" strokeWidth="1.1" />
          <path data-frame-2="" d="M-24 400 V150 A174 174 0 0 1 324 150 V400" fill="none" stroke="var(--color-blush)" strokeWidth="0.8" strokeDasharray="2 5" />
        </svg>

        <svg data-corner="" viewBox="-24 -24 48 48" className="absolute -right-6 top-[14%] size-16 md:-right-10" aria-hidden="true">
          <Bloom r={18} />
        </svg>
        <svg data-corner="" viewBox="-24 -24 48 48" className="absolute -left-5 bottom-[12%] size-12" aria-hidden="true">
          <Bloom r={16} />
        </svg>
      </div>
      <p data-caption="" className="mt-6 text-xs text-stone-light">
        {image.credit}
      </p>
    </div>
  );
}
