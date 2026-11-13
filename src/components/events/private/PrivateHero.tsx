"use client";

import { useRef } from "react";
import { stock, type SiteImage } from "@/content/media";
import { Pic } from "@/components/shared/Pic";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { EventsButton } from "../Button";

const CONFETTI = ["#f29c8f", "#ebc3c8", "#f2d6a2", "#bfe3d4", "#d7c7ef", "#f18a68"];

const prints: { image: SiteImage; cls: string; rot: number; caption: string }[] = [
  { image: stock.privateBalloons, cls: "left-[4%] top-[6%] w-[58%]", rot: -6, caption: "make a wish" },
  { image: stock.privateTable, cls: "right-[2%] top-[22%] w-[46%]", rot: 7, caption: "just us" },
  { image: stock.privateSparklers, cls: "left-[24%] bottom-[2%] w-[44%]", rot: -2, caption: "surprise!" },
];

/**
 * Private celebrations hero: a pile of party prints tossed onto the page and
 * settling at playful angles, a little burst of confetti, then a slow drift
 * as you scroll. Copy on the left. Everything is visible without scripts.
 */
export function PrivateHero({ title, description }: { title: string; description: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const cards = q<HTMLElement>("[data-print]");
        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 });
        tl.fromTo(q("[data-p-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.1 }, 0)
          .fromTo(q("[data-p-fade]"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.35)
          .fromTo(q("[data-p-script]"), { autoAlpha: 0, rotate: -14, scale: 0.6 }, { autoAlpha: 1, rotate: -6, scale: 1, duration: 1.2, ease: "back.out(1.8)" }, 0.6);
        cards.forEach((c, i) => {
          const rot = Number(c.dataset.rot);
          tl.fromTo(c, { y: -260, x: (i - 1) * 120, rotate: rot * 4, autoAlpha: 0 }, { y: 0, x: 0, rotate: rot, autoAlpha: 1, duration: 1.3, ease: "back.out(1.3)" }, 0.25 + i * 0.16);
        });
        // confetti burst once the last print lands
        const bits = q<HTMLElement>("[data-confetti]");
        tl.fromTo(
          bits,
          { x: 0, y: 0, rotate: 0, autoAlpha: 1, scale: 1 },
          {
            x: () => gsap.utils.random(-260, 260),
            y: () => gsap.utils.random(-240, 120),
            rotate: () => gsap.utils.random(-540, 540),
            scale: () => gsap.utils.random(0.6, 1.2),
            autoAlpha: 0,
            duration: 2.2,
            ease: "power3.out",
            stagger: 0.008,
          },
          1.05
        );
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        cards.forEach((c, i) => gsap.to(c, { yPercent: -8 - i * 7, ease: "none", scrollTrigger: st }));
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="paper-grain relative overflow-hidden bg-ivory pb-16 pt-32 md:pb-24 md:pt-40" aria-labelledby="private-title">
      <div className="pointer-events-none absolute -left-32 top-16 size-[560px] rounded-full bg-blush/35 blur-[130px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-[520px] rounded-full bg-[#f2d6a2]/35 blur-[130px]" />
      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <p data-p-fade="" className="eyebrow flex items-center gap-3 text-rose-deep">
            <span className="h-px w-10 bg-rose" aria-hidden="true" /> {title}
          </p>
          <h1 id="private-title" className="relative mt-6 font-serif text-[clamp(2.9rem,5.8vw,6.2rem)] font-light leading-[0.95] tracking-[-0.02em] text-ink">
            <span className="block overflow-hidden pb-1">
              <span data-p-line="" className="block">The moments</span>
            </span>
            <span className="block overflow-hidden pb-1">
              <span data-p-line="" className="block">closest to</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <em data-p-line="" className="block text-rose-deep">the heart.</em>
            </span>
            <span data-p-script="" aria-hidden="true" className="absolute -top-6 right-[6%] -rotate-6 font-script text-[clamp(2.6rem,4vw,4.4rem)] text-coral max-sm:right-0">
              joyful
            </span>
          </h1>
          <p data-p-fade="" className="mt-7 max-w-xl text-lg leading-relaxed text-stone md:text-xl">
            {description}
          </p>
          <div data-p-fade="" className="mt-9 flex flex-wrap items-center gap-4">
            <EventsButton href="#enquire">Plan a celebration</EventsButton>
            <EventsButton href="#occasions" variant="outline">
              See the occasions
            </EventsButton>
          </div>
        </div>

        <div className="relative mx-auto aspect-[1/1] w-full max-w-[36rem] lg:col-span-6 lg:max-w-none">
          {prints.map((p) => (
            <figure key={p.caption} data-print="" data-rot={p.rot} className={`absolute ${p.cls} rounded-[0.9rem] bg-ivory p-2 pb-8 shadow-[0_40px_70px_-36px_rgb(94_52_64/0.75)] ring-1 ring-ink/5 sm:p-2.5 sm:pb-10`} style={{ transform: `rotate(${p.rot}deg)` }}>
              <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg] bg-[#f2d6a2]/80 shadow-sm" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[0.6rem] bg-cream">
                <Pic image={p.image} alt="" sizes="(max-width: 1024px) 50vw, 26vw" />
              </div>
              <figcaption className="absolute bottom-2 left-0 right-0 text-center font-script text-xl text-rose-deep sm:bottom-2.5 sm:text-2xl">{p.caption}</figcaption>
            </figure>
          ))}
          <div className="pointer-events-none absolute left-1/2 top-1/2" aria-hidden="true">
            {Array.from({ length: 36 }, (_, i) => (
              <span
                key={i}
                data-confetti=""
                className="absolute block opacity-0"
                style={{ width: i % 3 ? 8 : 6, height: i % 3 ? 4 : 10, borderRadius: i % 4 === 0 ? 999 : 2, background: CONFETTI[i % CONFETTI.length] }}
              />
            ))}
          </div>
          <p className="absolute -bottom-6 right-0 text-[0.62rem] uppercase tracking-[0.2em] text-stone/70">Illustrative imagery</p>
        </div>
      </div>
    </section>
  );
}
