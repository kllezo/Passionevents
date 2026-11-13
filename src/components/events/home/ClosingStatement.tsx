"use client";

import { useRef } from "react";
import { featuredArtists, instagramUrl, ownWords, proofStats } from "@/content/proof";
import { stock } from "@/content/media";
import { Pic } from "@/components/shared/Pic";
import { InstagramIcon } from "@/components/shared/InstagramIcon";
import { Counter, Marquee } from "@/motion/primitives";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";
import { Bloom } from "../botanical/Sprig";

const medallions = [
  { image: stock.weddingArch, cls: "left-[4%] top-[14%] size-[clamp(6rem,13vw,12rem)]", speed: 14 },
  { image: stock.liveCrowd, cls: "right-[6%] top-[8%] size-[clamp(5rem,10vw,9.5rem)]", speed: 22 },
  { image: stock.corporateGala, cls: "right-[12%] bottom-[10%] size-[clamp(6rem,12vw,11rem)]", speed: 10 },
  { image: stock.florals, cls: "left-[10%] bottom-[6%] size-[clamp(4.5rem,8vw,8rem)]", speed: 18 },
];

/**
 * The home page's closing brand statement, just before the enquiry: the
 * verified "50+ events executed" (from the client's brief) set very large
 * inside slowly turning rings, with circular photographs drifting around it.
 * The other verified numbers and the artists ribbon follow beneath.
 */
export function ClosingStatement() {
  const root = useRef<HTMLElement>(null);
  const [events, ...rest] = proofStats;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        gsap.set(q("[data-medal]"), { scale: 0.4, autoAlpha: 0 });
        gsap.set(q("[data-close-line]"), { yPercent: 110 });
        gsap.set(q("[data-close-fade]"), { autoAlpha: 0, y: 30 });
        const tl = gsap
          .timeline({ paused: true })
          .from(q("[data-ring]"), { drawSVG: "0%", duration: 2.2, ease: "power2.inOut", stagger: 0.2 }, 0)
          .to(q("[data-medal]"), { scale: 1, autoAlpha: 1, duration: 1.4, stagger: 0.12, ease: "back.out(1.6)" }, 0.3)
          .to(q("[data-close-line]"), { yPercent: 0, duration: 1.3, stagger: 0.12, ease: "expo.out" }, 0.5)
          .to(q("[data-close-fade]"), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.9);
        const stop = whenVisible(q("[data-stage]")[0], () => tl.play(), "0px 0px -20% 0px");
        q("[data-medal]").forEach((m) =>
          gsap.fromTo(m, { yPercent: Number(m.dataset.speed) }, { yPercent: -Number(m.dataset.speed), ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } })
        );
        return stop;
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="paper-grain relative overflow-hidden bg-cream py-28 md:py-40" aria-labelledby="closing-title">
      <div data-stage="" className="relative mx-auto flex min-h-[min(92svh,900px)] max-w-[1600px] flex-col items-center justify-center px-5 text-center md:px-10">
        {/* turning rings */}
        <svg viewBox="0 0 800 800" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 w-[min(118vw,900px)] -translate-x-1/2 -translate-y-1/2 motion-safe:animate-[spin_90s_linear_infinite]">
          <circle data-ring="" cx="400" cy="400" r="380" fill="none" stroke="var(--color-rose)" strokeOpacity=".45" strokeWidth="1" />
          <circle data-ring="" cx="400" cy="400" r="330" fill="none" stroke="var(--color-blush)" strokeWidth="1" strokeDasharray="2 9" />
          <circle data-ring="" cx="400" cy="400" r="270" fill="none" stroke="var(--color-coral)" strokeOpacity=".35" strokeWidth="1" />
        </svg>
        {medallions.map((m) => (
          <div key={m.image.src} data-medal="" data-speed={m.speed} aria-hidden="true" className={`absolute hidden overflow-hidden rounded-full shadow-[0_30px_60px_-30px_rgb(94_52_64/0.7)] ring-4 ring-ivory sm:block ${m.cls}`}>
            <Pic image={m.image} sizes="200px" />
          </div>
        ))}
        <svg viewBox="-30 -30 60 60" aria-hidden="true" className="absolute left-1/2 top-0 size-12 -translate-x-1/2">
          <Bloom r={22} />
        </svg>

        <h2 id="closing-title" className="relative">
          <span className="block overflow-hidden">
            <span data-close-line="" className="block font-serif text-[clamp(7rem,24vw,22rem)] font-light leading-[0.8] tracking-[-0.05em] text-ink">
              <Counter to={events.value} suffix={events.suffix} duration={2.6} />
            </span>
          </span>
          <span className="mt-4 block overflow-hidden">
            <span data-close-line="" className="block text-[clamp(0.85rem,1.4vw,1.1rem)] font-semibold uppercase tracking-[0.5em] text-rose-deep">
              Events executed
            </span>
          </span>
          <span className="mt-8 block overflow-hidden pb-2">
            <span data-close-line="" className="block font-serif text-[clamp(2.2rem,5.4vw,5.4rem)] font-light italic leading-[1] text-ink">
              One team. <span className="text-rose-deep">Endless possibilities.</span>
            </span>
          </span>
        </h2>

        <div data-close-fade="" className="relative mt-14 flex flex-wrap justify-center gap-x-12 gap-y-6">
          {rest.map((s) => (
            <div key={s.label} className="min-w-[10rem]">
              <Counter to={s.value} suffix={s.suffix} className="block font-serif text-5xl font-light text-ink md:text-6xl" />
              <p className="mx-auto mt-2 max-w-[14rem] text-sm leading-snug text-stone">{s.label}</p>
            </div>
          ))}
        </div>
        <p data-close-fade="" className="relative mt-10 max-w-xl text-lg text-ink/75">
          “{ownWords.line}” {ownWords.scope}
        </p>
        <a data-close-fade="" href={instagramUrl} target="_blank" rel="noopener noreferrer" className="link-underline relative mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-ink">
          <InstagramIcon className="size-4" /> See our work on Instagram
        </a>
      </div>

      <div className="mt-16">
        <p className="eyebrow text-center text-stone">Artists from our shows</p>
        <Marquee duration={32} className="mt-5 border-y border-rose/20 py-5">
          {[...featuredArtists, ...featuredArtists].map((a, i) => (
            <span key={`${a.name}-${i}`} className="flex items-center gap-6 pr-6 font-serif text-3xl italic text-ink md:text-5xl">
              {a.name}
              <svg viewBox="-12 -12 24 24" className="size-4" aria-hidden="true">
                <Bloom r={9} />
              </svg>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
