"use client";

import { useRef } from "react";
import { privateOccasions } from "@/content/categoryStories";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { SectionLabel } from "../SectionLabel";

const CONFETTI = ["#f29c8f", "#ebc3c8", "#f2d6a2", "#bfe3d4", "#d7c7ef", "#e9822a"];

/**
 * Private celebrations signature: the occasion cards are tossed onto the page
 * like party invitations — scattered and spinning — and land neatly in a grid
 * as the reader scrolls; once they land, confetti bursts from the centre and
 * balloons drift up behind them.
 */
export function PrivateOccasions() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const cards = q<HTMLElement>("[data-occ]");
        const desktop = window.innerWidth >= 1024;
        const rand = gsap.utils.random;
        const bits = q<HTMLElement>("[data-confetti]");
        const burst = gsap.timeline({ paused: true });
        burst.fromTo(
          bits,
          { x: 0, y: 0, scale: 0, rotate: 0, autoAlpha: 1 },
          {
            x: () => rand(-520, 520),
            y: () => rand(-380, 260),
            rotate: () => rand(-540, 540),
            scale: () => rand(0.6, 1.4),
            duration: 1.6,
            ease: "expo.out",
          }
        ).to(bits, { y: "+=220", autoAlpha: 0, duration: 1.8, ease: "power1.in", stagger: 0.01 }, 0.9);

        let burstPlayed = false;
        const landing = gsap.timeline({
          scrollTrigger: { trigger: q("[data-grid]")[0], start: "top 95%", end: desktop ? "top 30%" : "top 55%", scrub: 1 },
          // Confetti once the cards have landed (scrub-smoothed playhead reaches the end).
          onUpdate: () => {
            if (!burstPlayed && landing.progress() > 0.97) {
              burstPlayed = true;
              burst.play();
            }
          },
        });
        landing.from(cards, {
          x: () => rand(-260, 260) * (desktop ? 1 : 0.4),
          y: () => rand(160, 420),
          rotate: () => rand(-38, 38),
          scale: 0.7,
          autoAlpha: 0,
          ease: "power3.out",
          stagger: { each: 0.08, from: "random" },
        });

        gsap.to(q("[data-balloon]"), { y: () => rand(-60, -120), x: () => rand(-20, 20), rotate: () => rand(-6, 6), duration: () => rand(3.5, 5.5), ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-[#fbf1ee] py-28 md:py-40" aria-labelledby="occasions-title">
      {/* balloons */}
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full opacity-70" aria-hidden="true">
        {[
          [120, 300, "#f29c8f"],
          [240, 520, "#d7c7ef"],
          [1380, 260, "#bfe3d4"],
          [1500, 480, "#f2d6a2"],
          [1290, 640, "#ebc3c8"],
        ].map(([x, y, c], i) => (
          <g key={i} data-balloon="">
            <path d={`M${x} ${Number(y) + 62} q 14 60 -6 140`} stroke="#c9a9ae" strokeWidth="1.4" fill="none" />
            <ellipse cx={x} cy={y} rx="46" ry="58" fill={String(c)} />
            <ellipse cx={Number(x) - 16} cy={Number(y) - 22} rx="9" ry="14" fill="#fff" opacity="0.45" />
          </g>
        ))}
      </svg>

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="text-center">
          <SectionLabel className="justify-center">Every reason to celebrate</SectionLabel>
          <h2 id="occasions-title" className="mx-auto mt-6 max-w-3xl font-serif text-[clamp(2.6rem,5vw,5.2rem)] font-light leading-[0.95] text-ink">
            Close to the heart, <em className="text-coral-deep">styled with care.</em>
          </h2>
        </div>

        <div data-grid="" className="relative mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <span data-burst="" className="pointer-events-none absolute left-1/2 top-1/2 z-20 size-0" aria-hidden="true">
            {Array.from({ length: 46 }, (_, i) => (
              <span
                key={i}
                data-confetti=""
                className={`absolute left-0 top-0 block opacity-0 ${i % 3 === 0 ? "size-2.5 rounded-full" : "h-3.5 w-2 rounded-[2px]"}`}
                style={{ backgroundColor: CONFETTI[i % CONFETTI.length] }}
              />
            ))}
          </span>
          {privateOccasions.map((o, i) => (
            <article
              key={o.title}
              data-occ=""
              className="group relative min-h-[260px] overflow-hidden rounded-[1.75rem] p-8 shadow-[0_30px_60px_-40px_rgb(94_52_64/0.6)] transition-transform duration-700 ease-[var(--ease-silk)] hover:-translate-y-2 hover:rotate-[-1deg]"
              style={{ backgroundColor: o.hue }}
            >
              <span className="absolute -right-6 -top-10 font-serif text-[9rem] font-light italic leading-none text-white/35" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="relative font-script text-5xl text-ink/80 transition-transform duration-700 ease-[var(--ease-silk)] group-hover:-rotate-3 group-hover:scale-105">{o.script}</p>
              <h3 className="relative mt-10 font-serif text-3xl text-ink">{o.title}</h3>
              <p className="relative mt-2 text-ink/70">{o.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
