"use client";

import { useRef } from "react";
import type { SiteImage } from "@/content/media";
import { Pic } from "@/components/shared/Pic";
import { gsap, useGSAP, media, whenVisible, blurFrom, blurTo } from "@/motion/gsap";
import { Bloom } from "./botanical/Sprig";

/**
 * Founder portrait in a botanical arch. When it scrolls into view the photo
 * eases from soft focus to sharp while the arch opens and the rose frame
 * draws around it. Plays once. The photo is visible in the HTML from the
 * start, so it never stays hidden if scripts or motion are unavailable.
 */
export function FounderPortrait({ image }: { image: SiteImage }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const photo = q("[data-photo]")[0];
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        tl.fromTo(q("[data-arch]"), { clipPath: "inset(18% 10% 0% 10% round 999px 999px 0 0)" }, { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)", duration: 1.4, ease: "expo.out" }, 0)
          .fromTo(photo, { scale: 1.12, ...blurFrom(14), opacity: 0.35 }, { scale: 1, ...blurTo(), opacity: 1, duration: 1.6, clearProps: "filter" }, 0)
          .from(q("[data-frame]"), { drawSVG: "50% 50%", duration: 1.4, ease: "power2.inOut" }, 0.15)
          .from(q("[data-frame-2]"), { drawSVG: "0%", duration: 1.4, ease: "power2.inOut" }, 0.3)
          .from(q("[data-corner]"), { scale: 0, rotate: -90, duration: 0.8, stagger: 0.12, ease: "back.out(1.8)" }, 0.7);
        const stop = whenVisible(root.current!, () => tl.play(), "0px 0px -15% 0px");
        // Gentle drift against the page once it has settled.
        gsap.fromTo(q("[data-drift]"), { yPercent: -2.5 }, { yPercent: 2.5, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        return () => stop();
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative">
      <div className="relative aspect-[4/5] w-full">
        <div data-arch="" className="absolute inset-0 overflow-hidden rounded-t-full bg-cream">
          <div data-drift="" className="absolute inset-[-3%_0]">
            <div data-photo="" className="absolute inset-0 will-change-transform">
              <Pic image={image} alt={image.alt} sizes="(max-width: 768px) 90vw, 38vw" className="object-top" />
            </div>
          </div>
        </div>

        <svg viewBox="0 0 300 375" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <path data-frame="" d="M-12 387 V150 A162 162 0 0 1 312 150 V387 Z" fill="none" stroke="var(--color-rose)" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
          <path data-frame-2="" d="M-24 375 V150 A174 174 0 0 1 324 150 V375" fill="none" stroke="var(--color-blush)" strokeWidth="0.8" strokeDasharray="2 5" vectorEffect="non-scaling-stroke" />
        </svg>

        <svg data-corner="" viewBox="-24 -24 48 48" className="absolute -right-5 top-[14%] size-14 md:-right-8" aria-hidden="true">
          <Bloom r={18} />
        </svg>
        <svg data-corner="" viewBox="-24 -24 48 48" className="absolute -left-4 bottom-[12%] size-11" aria-hidden="true">
          <Bloom r={16} />
        </svg>
      </div>
      {image.credit && <p className="mt-5 text-xs text-stone">{image.credit}</p>}
    </div>
  );
}
