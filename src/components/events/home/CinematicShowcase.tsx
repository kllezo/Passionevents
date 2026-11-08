"use client";

import Link from "next/link";
import { useRef } from "react";
import { stock, type SiteImage } from "@/content/media";
import { Pic } from "@/components/shared/Pic";
import { gsap, useGSAP, media } from "@/motion/gsap";

const scenes: { image: SiteImage; word: string; line: string; href: string }[] = [
  { image: stock.weddingRitual, word: "Weddings", line: "Rituals, receptions and every moment between.", href: "/weddings" },
  { image: stock.corporateGala, word: "Corporate", line: "Conferences, launches and award nights, run to the minute.", href: "/corporate-events" },
  { image: stock.liveCrowd, word: "Concerts", line: "Artists, stages and crowds — produced by Passion Live.", href: "/concerts" },
  { image: stock.destinationPalace, word: "Celebrations", line: "Private parties and destination events, styled end to end.", href: "/private-events" },
];

const SLICES = 6;

/**
 * Full-screen photographic sequence. Desktop: pinned; each new scene drops in
 * as vertical shutters from alternating directions while the previous one
 * sinks back, the headline flips in letter by letter, and an index of the
 * four scenes lights up the current one. Mobile: framed panels opening to
 * full bleed (no pinning).
 */
export function CinematicShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.desktop, () => {
        const scenesEl = q<HTMLElement>("[data-scene]");
        const words = q<HTMLElement>("[data-word]");
        const lines = q<HTMLElement>("[data-line]");
        const items = q<HTMLElement>("[data-index-item]");
        const n = scenesEl.length;
        let active = -1;
        const setActive = (i: number) => {
          if (i === active) return;
          active = i;
          items.forEach((it, j) => (it.dataset.state = j === i ? "on" : "off"));
        };
        setActive(0);

        // Later scenes wait off-frame as shutters; later words wait folded back.
        scenesEl.slice(1).forEach((sc) => gsap.set(sc.querySelectorAll("[data-slice]"), { yPercent: (j) => (j % 2 ? 101 : -101) }));
        words.slice(1).forEach((w) => gsap.set(w.querySelectorAll("[data-ch]"), { rotateX: -95, yPercent: 40, opacity: 0 }));
        gsap.set(lines.slice(1), { autoAlpha: 0, y: 20 });

        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: `+=${n * 90}%`,
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            // timeline: scene i lands at time i - 0.6 + ~0.8, total length n - 0.6 + 0.4
            onUpdate: (self) => setActive(Math.max(0, Math.min(n - 1, Math.floor(self.progress * n + 0.15)))),
          },
        });
        scenesEl.forEach((sc, i) => {
          if (i === 0) return;
          const at = i - 0.6;
          const prev = scenesEl[i - 1];
          // the new photograph drops in as shutters from alternating directions
          tl.to(sc.querySelectorAll("[data-slice]"), { yPercent: 0, duration: 0.8, stagger: { each: 0.06, from: "center" } }, at)
            .fromTo(sc.querySelectorAll("[data-img]"), { scale: 1.25 }, { scale: 1, duration: 1.1 }, at)
            .to(prev.querySelectorAll("[data-img]"), { scale: 1.12, duration: 1 }, at)
            .to(prev.querySelector("[data-shade]"), { opacity: 0.7, duration: 0.8 }, at)
            // the headline flips letter by letter
            .to(words[i - 1].querySelectorAll("[data-ch]"), { rotateX: 95, yPercent: -40, opacity: 0, duration: 0.35, stagger: 0.015, ease: "power2.in" }, at + 0.1)
            .to(words[i].querySelectorAll("[data-ch]"), { rotateX: 0, yPercent: 0, opacity: 1, duration: 0.45, stagger: 0.02, ease: "power3.out" }, at + 0.4)
            .to(lines[i - 1], { autoAlpha: 0, y: -20, duration: 0.3 }, at + 0.15)
            .to(lines[i], { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.55)
            .to(q("[data-bar]")[0], { scaleX: (i + 1) / n, duration: 1 }, at);
        });
        tl.to({}, { duration: 0.4 });
      });

      // Phones: each scene opens from a framed card to full bleed as it scrolls in,
      // its photograph settling and its word rising out of a mask.
      mm.add(media.mobile, () => {
        q<HTMLElement>("[data-m-scene]").forEach((scene) => {
          const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: scene, start: "top 95%", end: "top 15%", scrub: 0.6 } });
          tl.fromTo(scene.querySelector("[data-m-frame]"), { clipPath: "inset(10% 7% 10% 7% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)" }, 0)
            .fromTo(scene.querySelector("[data-m-img]"), { scale: 1.3 }, { scale: 1 }, 0)
            .fromTo(scene.querySelector("[data-m-word]"), { yPercent: 105 }, { yPercent: 0, ease: "power2.out" }, 0.35)
            .fromTo(scene.querySelector("[data-m-line]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0 }, 0.55);
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-ink text-ivory" aria-labelledby="showcase-title">
      <h2 id="showcase-title" className="sr-only">
        The events we create
      </h2>

      {/* Desktop: pinned shutter sequence */}
      <div data-pin="" className="relative hidden h-[100svh] overflow-hidden lg:block">
        {scenes.map((s, i) => (
          <div key={s.word} data-scene="" className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
            {Array.from({ length: SLICES }, (_, j) => {
              const l = (j / SLICES) * 100;
              const r = 100 - ((j + 1) / SLICES) * 100;
              return (
                <div
                  key={j}
                  data-slice=""
                  className="absolute inset-0"
                  // a hairline of overlap hides sub-pixel seams between shutters
                  style={{ clipPath: `inset(0 ${Math.max(0, r - 0.1)}% 0 ${Math.max(0, l - 0.1)}%)` }}
                >
                  <div data-img="" className="absolute inset-0">
                    <Pic image={s.image} alt={j === 0 ? s.image.alt : ""} sizes="100vw" tone="dark" />
                  </div>
                </div>
              );
            })}
            <div data-shade="" className="absolute inset-0 bg-ink opacity-0" />
          </div>
        ))}
        {/* one scrim above every scene (per-scene scrims would stack over the first photo) */}
        <div className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-t from-ink/85 via-ink/20 to-ink/35" />

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end px-10 pb-16">
          <p className="eyebrow text-blush">What we create</p>
          <div className="relative mt-4 h-[clamp(5rem,11vw,11.5rem)] [perspective:900px]">
            {scenes.map((s) => (
              <p key={s.word} data-word="" aria-label={s.word} className="absolute inset-0 whitespace-nowrap font-serif text-[clamp(4.6rem,10vw,10.5rem)] font-light italic leading-[1.05]">
                {Array.from(s.word).map((ch, k) => (
                  <span key={k} data-ch="" aria-hidden="true" className="inline-block origin-[50%_80%] will-change-transform">
                    {ch}
                  </span>
                ))}
              </p>
            ))}
          </div>
          <div className="relative mt-4 h-8 max-w-xl">
            {scenes.map((s) => (
              <p key={s.word} data-line="" className="absolute inset-0 text-lg text-ivory/85">
                {s.line}
              </p>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-6">
            <span className="relative block h-px w-56 bg-ivory/25">
              <span data-bar="" className="absolute inset-0 origin-left bg-blush" style={{ transform: `scaleX(${1 / scenes.length})` }} />
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-ivory/60">Illustrative imagery</span>
          </div>
        </div>

        {/* Scene index */}
        <ol className="absolute right-10 top-1/2 z-10 -translate-y-1/2 space-y-3 rounded-2xl bg-ink/30 py-5 pl-6 pr-5 text-right backdrop-blur-md">
          {scenes.map((s, i) => (
            <li key={s.word}>
              <Link
                href={s.href}
                data-index-item=""
                data-state={i === 0 ? "on" : "off"}
                className="group inline-flex items-center gap-4 text-ivory/45 transition-colors duration-500 hover:text-ivory data-[state=on]:text-ivory"
              >
                <span className="font-serif text-2xl italic transition-transform duration-500 group-data-[state=on]:-translate-x-2">{s.word}</span>
                <span className="font-sans text-[0.65rem] tracking-[0.25em]">{String(i + 1).padStart(2, "0")}</span>
                <span className="block h-px w-6 bg-current transition-[width] duration-500 group-data-[state=on]:w-14" />
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile / tablet: stacked panels */}
      <div className="lg:hidden">
        {scenes.map((s) => (
          <Link key={s.word} href={s.href} data-m-scene="" className="relative flex min-h-[82svh] items-end overflow-hidden px-5 pb-12">
            <span data-m-frame="" className="absolute inset-0 overflow-hidden">
              <span data-m-img="" className="absolute inset-0 block">
                <Pic image={s.image} sizes="100vw" tone="dark" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
            </span>
            <span className="relative">
              <span className="block overflow-hidden pb-2">
                <span data-m-word="" className="block font-serif text-6xl font-light italic">
                  {s.word}
                </span>
              </span>
              <span data-m-line="" className="mt-2 block max-w-sm text-ivory/85">
                {s.line}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
