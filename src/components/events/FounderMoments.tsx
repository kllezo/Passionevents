"use client";

import { useRef } from "react";
import { Pic } from "@/components/shared/Pic";
import { gsap, useGSAP, media, blurFrom, blurTo } from "@/motion/gsap";
import type { SiteImage } from "@/content/media";
import { SectionLabel } from "./SectionLabel";
import { Bloom } from "./botanical/Sprig";

const presentation: SiteImage = { src: "/media/sized/frame-presentation.webp", alt: "P. Sai Tanush and a guest holding a gold-framed Passion Events logo", focus: "50% 40%" };
const tanush: SiteImage = { src: "/media/sized/frame-tanush.webp", alt: "P. Sai Tanush smiling with the framed Passion Events logo", focus: "60% 40%" };

/**
 * Founders page: the framed-logo moment. The large photograph sits in a gold
 * frame that draws itself around it; the second photograph overlaps it at an
 * angle like a print. Both wipe open from soft focus and drift apart as you
 * scroll. Captions describe only what the photographs show.
 */
export function FounderMoments() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-stage]")[0], start: "top 75%", once: true } });
        tl.fromTo(q("[data-m1]"), { clipPath: "inset(0% 100% 0% 0% round 1.25rem)" }, { clipPath: "inset(0% 0% 0% 0% round 1.25rem)", duration: 1.5, ease: "expo.inOut" }, 0)
          .fromTo(q("[data-m1-img]"), { scale: 1.2, ...blurFrom(12) }, { scale: 1, ...blurTo(), duration: 1.8, ease: "expo.out", clearProps: "filter" }, 0.2)
          .from(q("[data-gold]"), { drawSVG: "0%", duration: 1.8, ease: "power2.inOut" }, 0.3)
          .fromTo(q("[data-m2]"), { y: 120, rotate: 14, autoAlpha: 0 }, { y: 0, rotate: 4, autoAlpha: 1, duration: 1.4, ease: "back.out(1.4)" }, 0.8)
          .fromTo(q("[data-m-cap]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "expo.out" }, 1.1)
          .fromTo(q("[data-m-bloom]"), { scale: 0, rotate: -120 }, { scale: 1, rotate: 0, duration: 0.9, stagger: 0.1, ease: "back.out(2.2)" }, 1.2);
        const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo(q("[data-m2]"), { yPercent: 10 }, { yPercent: -12, ease: "none", scrollTrigger: st });
        gsap.fromTo(q("[data-m1-img]"), { yPercent: -3 }, { yPercent: 3, ease: "none", scrollTrigger: st });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-cream py-24 md:py-28" aria-labelledby="moments-title">
      <div className="pointer-events-none absolute -right-40 top-10 size-[640px] rounded-full bg-blush/30 blur-[150px]" />
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel>Moments</SectionLabel>
            <h2 id="moments-title" className="mt-6 font-serif text-[clamp(2.3rem,4vw,4.2rem)] font-light leading-[0.98] text-ink">
              The signature, <em className="text-rose-deep">framed.</em>
            </h2>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-stone lg:col-span-4 lg:col-start-9">Our logo, with the words &ldquo;Big or small, we make it special,&rdquo; in a gold frame.</p>
        </div>

        <div data-stage="" className="relative mt-14 pb-24 sm:pb-32 lg:mt-16 lg:pb-16">
          <figure className="relative w-full lg:w-[72%]">
            <div className="relative">
              <div data-m1="" className="relative aspect-[3/2] overflow-hidden rounded-[1.25rem] bg-blush/40 shadow-[0_60px_120px_-60px_rgb(94_52_64/0.85)]">
                <div data-m1-img="" className="absolute inset-[-3%_0]">
                  <Pic image={presentation} sizes="(max-width: 1024px) 92vw, 62vw" />
                </div>
              </div>
              <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="pointer-events-none absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] overflow-visible sm:-inset-4 sm:h-[calc(100%+2rem)] sm:w-[calc(100%+2rem)]" aria-hidden="true">
                <rect data-gold="" x="1" y="1" width="298" height="198" rx="8" fill="none" stroke="#c9a24a" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <figcaption data-m-cap="" className="mt-6 max-w-md text-sm text-stone">P. Sai Tanush (right) with the framed Passion Events logo.</figcaption>
          </figure>

          <figure data-m2="" className="absolute bottom-0 right-0 w-[56%] rotate-[4deg] rounded-[1rem] bg-ivory p-2.5 pb-10 shadow-[0_50px_90px_-40px_rgb(94_52_64/0.85)] ring-1 ring-ink/5 sm:w-[46%] sm:p-3 sm:pb-12 lg:bottom-[-2rem] lg:w-[40%]">
            <div className="relative aspect-[3/2] overflow-hidden rounded-[0.7rem] bg-cream">
              <Pic image={tanush} sizes="(max-width: 1024px) 56vw, 34vw" />
            </div>
            <figcaption className="absolute bottom-2.5 left-0 right-0 text-center font-script text-2xl text-rose-deep sm:bottom-3 sm:text-3xl">by Ramya &amp; Tanush</figcaption>
          </figure>

          <svg data-m-bloom="" viewBox="-20 -20 40 40" className="absolute -top-5 left-[68%] size-10 lg:left-[69%]" aria-hidden="true">
            <Bloom r={15} />
          </svg>
          <svg data-m-bloom="" viewBox="-20 -20 40 40" className="absolute bottom-[38%] right-[42%] hidden size-8 lg:block" aria-hidden="true">
            <Bloom r={13} tone="blush" />
          </svg>
        </div>
      </div>
    </section>
  );
}
