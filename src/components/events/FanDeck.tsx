"use client";

import { useRef, useState } from "react";
import { useCoverflow } from "@/motion/useCoverflow";
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

      {/* Phones and tablets: swipeable coverflow over the giant word */}
      <MobileDeck images={images} word={word} script={script} />
    </section>
  );
}

function MobileDeck({ images, word, script }: { images: SiteImage[]; word: string; script: string }) {
  const strip = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useCoverflow(strip, { rotate: 18, scale: 0.16, dim: 0.55, onActive: setActive });

  return (
    <div className="relative overflow-hidden py-16 lg:hidden">
      <div className="absolute inset-0 bg-[radial-gradient(70%_45%_at_50%_55%,rgb(191_133_146/0.3),transparent_70%)]" />
      <p aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-[34vw] font-light italic leading-none text-ivory/[0.06]">
        {word}
      </p>
      <p className="relative px-5 font-script text-5xl text-blush md:px-10">{script}</p>
      <div ref={strip} className="relative mt-6 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-[17vw] pb-6 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((img) => (
          <figure key={img.src} data-cf="" className="relative aspect-[3/4] w-[66vw] max-w-[320px] shrink-0 snap-center overflow-hidden rounded-[1.25rem] border-[5px] border-ivory/95 bg-graphite shadow-[0_40px_70px_-35px_rgb(0_0_0/0.9)] will-change-transform">
            <Pic image={img} sizes="66vw" tone="dark" />
          </figure>
        ))}
      </div>
      <div className="relative mt-2 flex items-center justify-between px-5 md:px-10">
        <span className="flex gap-1.5" aria-hidden="true">
          {images.map((img, i) => (
            <span key={img.src} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-7 bg-blush" : "w-2 bg-ivory/25"}`} />
          ))}
        </span>
        <span className="text-[0.6rem] uppercase tracking-[0.28em] text-ivory/45">Inspiration imagery</span>
      </div>
    </div>
  );
}
