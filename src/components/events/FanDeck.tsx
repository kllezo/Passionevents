"use client";

import { useRef } from "react";
import type { SiteImage } from "@/content/media";
import { Pic } from "@/components/shared/Pic";
import { gsap, useGSAP, media } from "@/motion/gsap";

/**
 * Pinned "deck of photographs": cards begin stacked like a hand of cards,
 * fan out into an arc, then settle into an editorial spread while the
 * category word glides behind them. Desktop only; phones get a swipeable strip.
 */
export function FanDeck({ images, word, script }: { images: SiteImage[]; word: string; script: string }) {
  const root = useRef<HTMLElement>(null);
  const n = images.length;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.desktop, () => {
        const cards = q<HTMLElement>("[data-deck-card]");
        const mid = (n - 1) / 2;
        const vw = window.innerWidth;
        const spread = Math.min(vw * 0.17, 280);

        gsap.set(cards, {
          xPercent: -50,
          yPercent: -50,
          x: (i) => (i - mid) * 6,
          y: (i) => -i * 4,
          rotate: (i) => (i - mid) * 3,
          scale: 0.86,
        });
        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: "+=200%", pin: true, scrub: 1, anticipatePin: 1 },
        });
        // 1. fan into an arc
        tl.to(cards, {
          x: (i) => (i - mid) * spread * 0.55,
          y: (i) => Math.abs(i - mid) * 34,
          rotate: (i) => (i - mid) * 11,
          scale: 0.92,
          duration: 1,
          stagger: 0.04,
        })
          // 2. settle into a straight editorial spread
          .to(cards, {
            x: (i) => (i - mid) * spread * 1.08,
            y: (i) => (i % 2 ? 46 : -34),
            rotate: (i) => (i % 2 ? 2.5 : -2.5),
            scale: 1,
            duration: 1,
            stagger: 0.04,
          })
          .fromTo(q("[data-deck-word]"), { xPercent: 18 }, { xPercent: -18, ease: "none", duration: 2 }, 0)
          .from(q("[data-deck-script]"), { autoAlpha: 0, y: 40, duration: 0.6 }, 0.9);
      });
    },
    { scope: root, dependencies: [n] }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-ink text-ivory" aria-label={`${word} moodboard`}>
      <div data-pin="" className="relative hidden h-[100svh] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_50%_50%,rgb(191_133_146/0.28),transparent_70%)]" />
        <p
          data-deck-word=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-[22vw] font-light italic leading-none text-ivory/[0.06]"
        >
          {word}
        </p>
        {images.map((img, i) => (
          <figure
            key={img.src}
            data-deck-card=""
            className="absolute left-1/2 top-1/2 aspect-[3/4] w-[clamp(220px,19vw,320px)] overflow-hidden rounded-[1.25rem] border-[6px] border-ivory/95 bg-cream shadow-[0_50px_90px_-40px_rgb(0_0_0/0.9)] will-change-transform"
            style={{ zIndex: i < (n - 1) / 2 ? i : n - i }}
          >
            <Pic image={img} sizes="320px" />
          </figure>
        ))}
        <p data-deck-script="" className="absolute bottom-12 left-1/2 -translate-x-1/2 font-script text-6xl text-blush">
          {script}
        </p>
        <p className="absolute bottom-6 right-10 text-[0.65rem] uppercase tracking-[0.3em] text-ivory/40">Inspiration imagery — our own work lives in the portfolio</p>
      </div>

      {/* Phones and tablets: swipeable strip */}
      <div className="lg:hidden">
        <p className="px-5 pt-16 font-serif text-4xl italic text-blush">{script}</p>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-16 pt-8 [scrollbar-width:none]">
          {images.map((img, i) => (
            <figure
              key={img.src}
              className="relative aspect-[3/4] w-[72vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-[1.25rem] border-4 border-ivory/90"
              style={{ transform: `rotate(${i % 2 ? 2 : -2}deg)` }}
            >
              <Pic image={img} sizes="72vw" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
