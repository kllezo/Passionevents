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

/**
 * Full-screen photographic sequence. Desktop: pinned; each scene opens out of
 * the previous one through an expanding window while the headline word
 * slides through a mask. Mobile: stacked full-bleed panels (no pinning).
 */
export function CinematicShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.desktop, () => {
        const layers = q<HTMLElement>("[data-scene]");
        const words = q<HTMLElement>("[data-word]");
        const lines = q<HTMLElement>("[data-line]");
        gsap.set(layers.slice(1), { clipPath: "inset(50% 50% 50% 50% round 24px)" });
        gsap.set(words.slice(1), { yPercent: 110 });
        gsap.set(lines.slice(1), { autoAlpha: 0, y: 20 });
        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: `+=${layers.length * 90}%`, pin: true, scrub: 0.9, anticipatePin: 1 },
        });
        layers.forEach((layer, i) => {
          if (i === 0) return;
          const at = i - 0.6;
          // fromTo with explicit strings: the browser normalises inset() shorthands when
          // read back, which would make GSAP interpolate mismatched values.
          tl.fromTo(layer, { clipPath: "inset(50% 50% 50% 50% round 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1 }, at)
            .fromTo(layer.querySelector("[data-img]"), { scale: 1.35 }, { scale: 1, duration: 1 }, at)
            .to(layers[i - 1].querySelector("[data-img]"), { scale: 0.92, duration: 1 }, at)
            .to(words[i - 1], { yPercent: -110, duration: 0.5 }, at + 0.25)
            .to(words[i], { yPercent: 0, duration: 0.5 }, at + 0.45)
            .to(lines[i - 1], { autoAlpha: 0, y: -20, duration: 0.3 }, at + 0.25)
            .to(lines[i], { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.55)
            .to(q("[data-bar]")[0], { scaleX: (i + 1) / layers.length, duration: 1 }, at);
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

      {/* Desktop: pinned stack */}
      <div data-pin="" className="relative hidden h-[100svh] overflow-hidden lg:block">
        {scenes.map((s, i) => (
          <div key={s.word} data-scene="" className="absolute inset-0" style={{ zIndex: i }}>
            <div data-img="" className="absolute inset-0">
              <Pic image={s.image} sizes="100vw" tone="dark" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end px-10 pb-16">
          <p className="eyebrow text-blush">What we create</p>
          <div className="relative mt-4 h-[clamp(5rem,11vw,11.5rem)] overflow-hidden">
            {scenes.map((s) => (
              <p key={s.word} data-word="" className="absolute inset-0 whitespace-nowrap font-serif text-[clamp(4.6rem,10vw,10.5rem)] font-light italic leading-[1.05]">
                {s.word}
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
      </div>

      {/* Mobile / tablet: stacked panels */}
      <div className="lg:hidden">
        {scenes.map((s) => (
          <Link key={s.word} href={s.href} data-m-scene="" className="relative flex min-h-[82svh] items-end overflow-hidden px-5 pb-12">
            <span data-m-frame="" className="absolute inset-0 overflow-hidden">
              <span data-m-img="" className="absolute inset-0 block will-change-transform">
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
