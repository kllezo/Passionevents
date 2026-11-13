"use client";

import { useRef } from "react";
import { stock } from "@/content/media";
import { Pic } from "@/components/shared/Pic";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { SprigGroup } from "./botanical/Sprig";
import { buildSprig } from "./botanical/geometry";
import { EventsButton } from "./Button";

const sprig = buildSprig({ p0: { x: 20, y: 380 }, p1: { x: 120, y: 300 }, p2: { x: 60, y: 140 }, p3: { x: 190, y: 20 }, seed: 11, leafCount: 12, bloomCount: 5 });

/**
 * About hero: copy on the left, a layered "image card" on the right — a tall
 * main photograph over a tilted rose frame, a smaller print-style card that
 * drops in and settles at an angle, and a botanical sprig drawing itself
 * alongside. On scroll the layers drift apart slightly. Stacks under the copy
 * on phones. Content is visible without scripts; motion only enhances it.
 */
export function AboutHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.15 });
        tl.fromTo(q("[data-a-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.1 }, 0)
          .fromTo(q("[data-a-fade]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.35)
          .fromTo(q("[data-a-back]"), { rotate: 0, autoAlpha: 0, scale: 0.92 }, { rotate: -6, autoAlpha: 1, scale: 1, duration: 1.4 }, 0.1)
          .fromTo(q("[data-a-main]"), { clipPath: "inset(100% 0% 0% 0% round 2rem)" }, { clipPath: "inset(0% 0% 0% 0% round 2rem)", duration: 1.5, ease: "expo.inOut" }, 0.15)
          .fromTo(q("[data-a-main-img]"), { scale: 1.25 }, { scale: 1, duration: 2 }, 0.3)
          .fromTo(q("[data-a-print]"), { y: -60, rotate: -18, autoAlpha: 0 }, { y: 0, rotate: 6, autoAlpha: 1, duration: 1.3, ease: "back.out(1.4)" }, 0.9)
          .fromTo(q("[data-a-pill]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 1.2)
          .from(q(".bt-stem, .bt-twig"), { drawSVG: "0%", duration: 1.6, stagger: 0.05, ease: "power2.inOut" }, 0.6)
          .from(q(".bt-leaf"), { scale: 0, transformOrigin: "0% 50%", duration: 0.6, stagger: 0.04, ease: "back.out(2)" }, 1.1)
          .from(q(".bt-bloom"), { scale: 0, rotate: -90, transformOrigin: "50% 50%", duration: 0.7, stagger: 0.08, ease: "back.out(2)" }, 1.4);

        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(q("[data-a-print]"), { yPercent: -18, ease: "none", scrollTrigger: st });
        gsap.to(q("[data-a-back]"), { yPercent: 6, ease: "none", scrollTrigger: st });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="paper-grain relative overflow-hidden bg-ivory pb-20 pt-32 md:pb-24 md:pt-40" aria-labelledby="about-title">
      <div className="pointer-events-none absolute -left-40 top-10 size-[620px] rounded-full bg-blush/30 blur-[140px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 size-[520px] rounded-full bg-mint/20 blur-[130px]" />
      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <p data-a-fade="" className="eyebrow flex items-center gap-3 text-rose-deep">
            <span className="h-px w-10 bg-rose" aria-hidden="true" /> About us
          </p>
          <h1 id="about-title" className="mt-6 font-serif text-[clamp(2.9rem,5.6vw,6rem)] font-light leading-[0.95] tracking-[-0.02em] text-ink">
            <span className="block overflow-hidden pb-1">
              <span data-a-line="" className="block">Every event,</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <em data-a-line="" className="block text-rose-deep">made personal.</em>
            </span>
          </h1>
          <p data-a-fade="" className="mt-7 max-w-xl text-lg leading-relaxed text-stone md:text-xl">
            Passion Events plans, designs and manages celebrations of every size, from Hyderabad, for clients across India.
          </p>
          <dl data-a-fade="" className="mt-9 grid max-w-md grid-cols-2 gap-6 border-t border-ink/10 pt-6">
            <div>
              <dt className="eyebrow text-stone">Founded by</dt>
              <dd className="mt-2 font-serif text-xl text-ink">Ramya &amp; Tanush</dd>
            </div>
            <div>
              <dt className="eyebrow text-stone">Based in</dt>
              <dd className="mt-2 font-serif text-xl text-ink">Hyderabad</dd>
            </div>
          </dl>
          <div data-a-fade="" className="mt-9 flex flex-wrap items-center gap-4">
            <EventsButton href="/contact#enquire">Plan your event</EventsButton>
            <EventsButton href="/founders" variant="outline">
              Meet the founders
            </EventsButton>
          </div>
        </div>

        {/* The image card */}
        <div className="relative mx-auto w-full max-w-[34rem] lg:col-span-5 lg:col-start-8 lg:max-w-none">
          <div className="relative aspect-[4/5] w-[82%] max-sm:w-[86%]">
            <div data-a-back="" aria-hidden="true" className="absolute inset-0 -rotate-6 rounded-[2rem] border border-rose/50 bg-cream" />
            <div data-a-main="" className="absolute inset-0 overflow-hidden rounded-[2rem] bg-blush/40 shadow-[0_50px_100px_-50px_rgb(94_52_64/0.8)]">
              <div data-a-main-img="" className="absolute inset-0">
                <Pic image={stock.celebrationStage} sizes="(max-width: 1024px) 80vw, 36vw" priority />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
              <span data-a-pill="" className="absolute bottom-5 left-5 rounded-full bg-ivory/90 px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ink backdrop-blur-md">
                Weddings · Corporate · Private · Live
              </span>
            </div>
          </div>
          <div data-a-print="" className="absolute -bottom-6 right-0 w-[44%] rotate-6 rounded-[1.1rem] bg-ivory p-2.5 pb-9 shadow-[0_40px_80px_-40px_rgb(94_52_64/0.8)] ring-1 ring-ink/5 sm:p-3 sm:pb-11">
            <div className="relative aspect-square overflow-hidden rounded-[0.8rem] bg-cream">
              <Pic image={stock.florals} sizes="(max-width: 1024px) 40vw, 18vw" />
            </div>
            <span className="absolute bottom-2.5 left-0 right-0 text-center font-script text-2xl text-rose-deep sm:bottom-3 sm:text-3xl">every detail</span>
          </div>
          <svg viewBox="0 0 220 400" className="pointer-events-none absolute -right-4 -top-10 h-[46%] w-auto sm:-right-8" aria-hidden="true">
            <SprigGroup g={sprig} strokeWidth={1.6} />
          </svg>
          <p className="mt-12 text-right text-[0.65rem] uppercase tracking-[0.2em] text-stone/70">Illustrative imagery</p>
        </div>
      </div>
    </section>
  );
}
