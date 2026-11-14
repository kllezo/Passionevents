"use client";

import { useRef } from "react";
import { stock, type SiteImage } from "@/content/media";
import { Pic } from "@/components/shared/Pic";
import { gsap, SplitText, useGSAP, media } from "@/motion/gsap";
import { EventsButton } from "../Button";

const CONFETTI = ["#f29c8f", "#ebc3c8", "#f2d6a2", "#bfe3d4", "#d7c7ef", "#f18a68", "#c98d99"];
const BALLOONS = [
  { c: "#f4b8a8", x: 6, s: 1, d: 14, delay: 0 },
  { c: "#d7c7ef", x: 22, s: 0.8, d: 17, delay: 3 },
  { c: "#f2d6a2", x: 40, s: 1.15, d: 15, delay: 6 },
  { c: "#bfe3d4", x: 58, s: 0.9, d: 18, delay: 1.5 },
  { c: "#ebc3c8", x: 74, s: 1.05, d: 16, delay: 8 },
  { c: "#f18a68", x: 90, s: 0.75, d: 19, delay: 4.5 },
];

const prints: { image: SiteImage; cls: string; rot: number; caption: string }[] = [
  { image: stock.privateBalloons, cls: "left-[4%] top-[6%] w-[58%]", rot: -6, caption: "make a wish" },
  { image: stock.privateTable, cls: "right-[2%] top-[22%] w-[46%]", rot: 7, caption: "just us" },
  { image: stock.privateSparklers, cls: "left-[24%] bottom-[2%] w-[44%]", rot: -2, caption: "surprise!" },
];

/**
 * Private celebrations hero, built to make you smile:
 *  - the headline drops in letter by letter with an elastic bounce, then
 *    "the heart." beats;
 *  - three party prints spin in from deep in 3D space and land in a pile,
 *    then fan out as you scroll;
 *  - two confetti cannons fire from the bottom corners;
 *  - pastel balloons drift up behind everything.
 * All content is visible without scripts; reduced-motion skips the show.
 */
export function PrivateHero({ title, description }: { title: string; description: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const split = SplitText.create(q("[data-p-title]")[0], { type: "chars,words", aria: "auto" });
        const tl = gsap.timeline({ delay: 0.15 });
        tl.fromTo(split.chars, { yPercent: -160, rotate: () => gsap.utils.random(-40, 40), autoAlpha: 0 }, { yPercent: 0, rotate: 0, autoAlpha: 1, duration: 1.1, ease: "back.out(3)", stagger: { each: 0.035, from: "start" } }, 0)
          .fromTo(q("[data-p-fade]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.55)
          .fromTo(q("[data-p-script]"), { autoAlpha: 0, rotate: -40, scale: 0.2 }, { autoAlpha: 1, rotate: -6, scale: 1, duration: 1.3, ease: "elastic.out(1, 0.45)" }, 0.9);

        // prints: spin in from depth, land with a bounce
        q<HTMLElement>("[data-print]").forEach((c, i) => {
          const rot = Number(c.dataset.rot);
          tl.fromTo(
            c,
            { z: -900, rotateY: i % 2 ? -120 : 120, rotateZ: rot * 6, y: -120, autoAlpha: 0 },
            { z: 0, rotateY: 0, rotateZ: rot, y: 0, autoAlpha: 1, duration: 1.6, ease: "expo.out" },
            0.3 + i * 0.18
          );
        });

        // confetti cannons from both bottom corners
        const fire = (sel: string, dir: 1 | -1, at: number) => {
          q<HTMLElement>(sel).forEach((b) => {
            const vx = gsap.utils.random(120, 520) * dir;
            const up = gsap.utils.random(260, 560);
            const t = gsap.utils.random(1.6, 2.6);
            tl.fromTo(b, { x: 0, y: 0, rotate: 0, autoAlpha: 1 }, {
              keyframes: [
                { x: vx * 0.55, y: -up, rotate: gsap.utils.random(-360, 360), duration: t * 0.42, ease: "power2.out" },
                { x: vx, y: gsap.utils.random(40, 220), rotate: gsap.utils.random(-720, 720), autoAlpha: 0, duration: t * 0.58, ease: "power1.in" },
              ],
            }, at + gsap.utils.random(0, 0.15));
          });
        };
        fire("[data-cl]", 1, 1.2);
        fire("[data-cr]", -1, 1.35);

        // the heart beats
        tl.to(q("[data-heart]"), { scale: 1.08, duration: 0.18, yoyo: true, repeat: 3, ease: "power2.inOut", transformOrigin: "0% 60%" }, 1.8);

        // scroll: the pile fans out and lifts
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 };
        q<HTMLElement>("[data-print]").forEach((c, i) => {
          gsap.to(c, { yPercent: -10 - i * 12, rotateZ: `+=${(i - 1) * 9}`, xPercent: (i - 1) * 10, ease: "none", scrollTrigger: st });
        });
        return () => split.revert();
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="paper-grain relative overflow-hidden bg-ivory pb-16 pt-32 md:pb-24 md:pt-40" aria-labelledby="private-title">
      <div className="pointer-events-none absolute -left-32 top-16 size-[560px] rounded-full bg-blush/35 blur-[130px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-[520px] rounded-full bg-[#f2d6a2]/35 blur-[130px]" />

      {/* balloons drifting up */}
      <div className="pointer-events-none absolute inset-0 motion-reduce:hidden" aria-hidden="true">
        {BALLOONS.map((b, i) => (
          <svg
            key={i}
            viewBox="0 0 60 130"
            className="balloon absolute bottom-0 w-12 md:w-16"
            style={{ left: `${b.x}%`, ["--s" as string]: b.s, animationDuration: `${b.d}s`, animationDelay: `-${b.delay}s` }}
          >
            <path d="M30 4 C 50 4 58 22 58 38 C 58 58 42 74 30 76 C 18 74 2 58 2 38 C 2 22 10 4 30 4 Z" fill={b.c} opacity="0.85" />
            <path d="M20 16 C 14 22 12 30 13 36" stroke="#fff" strokeOpacity="0.6" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M27 76 L33 76 L30 82 Z" fill={b.c} />
            <path d="M30 82 C 24 96 36 106 28 128" stroke="#c98d99" strokeOpacity="0.55" strokeWidth="1" fill="none" />
          </svg>
        ))}
      </div>

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <p data-p-fade="" className="eyebrow flex items-center gap-3 text-rose-deep">
            <span className="h-px w-10 bg-rose" aria-hidden="true" /> {title}
          </p>
          <h1 id="private-title" className="relative mt-6 font-serif text-[clamp(2.9rem,5.8vw,6.2rem)] font-light leading-[0.98] tracking-[-0.02em] text-ink">
            <span data-p-title="" className="block">
              The moments closest to <em data-heart="" className="inline-block text-rose-deep">the heart.</em>
            </span>
            <span data-p-script="" aria-hidden="true" className="absolute -top-14 right-[2%] -rotate-6 font-script text-[clamp(2.6rem,4vw,4.4rem)] text-coral max-sm:right-0">
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

        <div className="relative mx-auto aspect-[1/1] w-full max-w-[36rem] [perspective:1400px] lg:col-span-6 lg:max-w-none">
          {prints.map((p) => (
            <figure key={p.caption} data-print="" data-rot={p.rot} className={`absolute ${p.cls} rounded-[0.9rem] bg-ivory p-2 pb-8 shadow-[0_40px_70px_-36px_rgb(94_52_64/0.75)] ring-1 ring-ink/5 [transform-style:preserve-3d] sm:p-2.5 sm:pb-10`} style={{ transform: `rotate(${p.rot}deg)` }}>
              <span aria-hidden="true" className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg] bg-[#f2d6a2]/80 shadow-sm" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[0.6rem] bg-cream">
                <Pic image={p.image} alt="" sizes="(max-width: 1024px) 50vw, 26vw" />
              </div>
              <figcaption className="absolute bottom-2 left-0 right-0 text-center font-script text-xl text-rose-deep sm:bottom-2.5 sm:text-2xl">{p.caption}</figcaption>
            </figure>
          ))}
          <p className="absolute -bottom-6 right-0 text-[0.62rem] uppercase tracking-[0.2em] text-stone/70">Illustrative imagery</p>
        </div>
      </div>

      {/* confetti cannons */}
      <div className="pointer-events-none absolute bottom-6 left-4" aria-hidden="true">
        {Array.from({ length: 34 }, (_, i) => (
          <span key={i} data-cl="" className="absolute block opacity-0" style={{ width: i % 3 ? 9 : 6, height: i % 3 ? 5 : 12, borderRadius: i % 4 === 0 ? 999 : 2, background: CONFETTI[i % CONFETTI.length] }} />
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-6 right-4" aria-hidden="true">
        {Array.from({ length: 34 }, (_, i) => (
          <span key={i} data-cr="" className="absolute block opacity-0" style={{ width: i % 3 ? 9 : 6, height: i % 3 ? 5 : 12, borderRadius: i % 4 === 0 ? 999 : 2, background: CONFETTI[(i + 3) % CONFETTI.length] }} />
        ))}
      </div>
    </section>
  );
}
