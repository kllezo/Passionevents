"use client";

import { useRef } from "react";
import { stock, type SiteImage } from "@/content/media";
import { site } from "@/lib/site";
import { Pic } from "@/components/shared/Pic";
import { gsap, useGSAP, media } from "@/motion/gsap";

/** Photographs placed in 3D space around the reader's path (x/y in vw/vh). */
const cards: { image: SiteImage; x: number; y: number; w: number; label: string }[] = [
  { image: stock.weddingArch, x: -30, y: -18, w: 22, label: "Weddings" },
  { image: stock.liveCrowd, x: 28, y: 14, w: 24, label: "Concerts" },
  { image: stock.corporateGala, x: -26, y: 22, w: 21, label: "Corporate" },
  { image: stock.privateBalloons, x: 30, y: -24, w: 18, label: "Birthdays" },
  { image: stock.destinationPalace, x: -34, y: -2, w: 24, label: "Destinations" },
  { image: stock.liveBand, x: 32, y: -4, w: 20, label: "Live bands" },
  { image: stock.decorArch, x: -14, y: -30, w: 18, label: "Décor" },
  { image: stock.weddingOutdoor, x: 16, y: 28, w: 22, label: "Ceremonies" },
  { image: stock.celebrationStage, x: -30, y: 26, w: 18, label: "Stages" },
  { image: stock.liveSinger, x: 26, y: -28, w: 18, label: "Artists" },
  { image: stock.ceremonyStage, x: 34, y: 24, w: 20, label: "Mandaps" },
  { image: stock.liveGuitarist, x: -32, y: -26, w: 19, label: "Live music" },
  { image: stock.tableFloral, x: 12, y: -32, w: 17, label: "Tablescapes" },
  { image: stock.corporateKeynote, x: -18, y: 30, w: 21, label: "Conferences" },
  { image: stock.weddingHands, x: 36, y: 6, w: 19, label: "Traditions" },
  { image: stock.liveHands, x: -38, y: 14, w: 20, label: "Crowds" },
];

const GAP = 620; // depth between photographs (px)
const START = 600; // first photograph's distance from the camera

const lines = [
  { top: "Big or small.", bottom: "Every kind of event." },
  { top: "Weddings to", bottom: "sold-out concerts." },
  { top: `${site.eventsExecuted}+ events`, bottom: "executed. One team." },
];

/**
 * Signature moment: a pinned 3D fly-through. Scrolling moves the camera
 * forward through a corridor of event photographs; each fades in out of the
 * fog, grows past you and disappears, while the headline changes three times.
 * Transforms only (GPU friendly). Reduced motion gets a static collage.
 */
export function FlyThrough() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const els = q<HTMLElement>("[data-card]");
        const texts = q<HTMLElement>("[data-line]");
        const mobile = window.innerWidth < 768;
        const depth = START + GAP * (els.length - 1) + 700;
        const cam = { z: 0 };

        const render = () => {
          els.forEach((el, i) => {
            const z = cam.z - (START + i * GAP); // < 0 in front of camera, > 0 behind
            const fog = gsap.utils.clamp(0, 1, 1 - -z / 4600);
            const passed = gsap.utils.clamp(0, 1, 1 - z / 260);
            el.style.transform = `translate3d(-50%, -50%, ${z}px)`;
            el.style.opacity = String(fog * passed);
          });
        };
        render();
        gsap.set(texts.slice(1), { autoAlpha: 0, yPercent: 30 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: `+=${mobile ? 260 : 340}%`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });
        tl.to(cam, { z: depth, duration: 1, onUpdate: render }, 0)
          .to(q("[data-ring]"), { rotate: 180, scale: 1.6, duration: 1 }, 0)
          .to(texts[0], { autoAlpha: 0, yPercent: -30, duration: 0.08, ease: "power2.in" }, 0.3)
          .to(texts[1], { autoAlpha: 1, yPercent: 0, duration: 0.1, ease: "power2.out" }, 0.36)
          .to(texts[1], { autoAlpha: 0, yPercent: -30, duration: 0.08, ease: "power2.in" }, 0.64)
          .to(texts[2], { autoAlpha: 1, yPercent: 0, duration: 0.1, ease: "power2.out" }, 0.7)
          .to(q("[data-progress]"), { scaleX: 1, duration: 1 }, 0);
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-ink text-ivory" aria-labelledby="fly-title">
      <h2 id="fly-title" className="sr-only">
        Big or small, every kind of event — {site.eventsExecuted}+ events executed
      </h2>

      {/* Animated stage */}
      <div data-pin="" className="relative h-[100svh] overflow-hidden motion-reduce:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgb(191_133_146/0.25),transparent_70%)]" />
        <svg data-ring="" viewBox="0 0 200 200" className="absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 opacity-40" aria-hidden="true">
          <circle cx="100" cy="100" r="92" fill="none" stroke="#ebc3c8" strokeWidth="0.4" />
          <circle cx="101" cy="100" r="88" fill="none" stroke="#bf8592" strokeWidth="0.3" strokeDasharray="1 3" />
        </svg>

        <div className="absolute inset-0 [perspective:900px] [perspective-origin:50%_50%]">
          <div className="absolute inset-0 [transform-style:preserve-3d]">
            {cards.map((c) => (
              <figure
                key={c.label}
                data-card=""
                className="absolute aspect-[4/5] overflow-hidden rounded-[1.25rem] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] will-change-transform"
                style={{ left: `calc(50% + ${c.x}vw)`, top: `calc(50% + ${c.y}vh)`, width: `clamp(150px, ${c.w}vw, 380px)`, opacity: 0 }}
              >
                <Pic image={c.image} sizes="380px" tone="dark" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-4 pb-3 pt-10 font-serif text-xl italic">
                  {c.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center">
          <div className="relative h-[clamp(9rem,20vw,19rem)] w-full max-w-5xl">
            {lines.map((l) => (
              <p key={l.top} data-line="" className="absolute inset-0 flex flex-col items-center justify-center font-serif font-light leading-[0.95] [text-shadow:0_10px_40px_rgb(0_0_0/0.6)]">
                <span className="text-[clamp(3rem,8vw,8rem)]">{l.top}</span>
                <span className="text-[clamp(2.4rem,6vw,6rem)] italic text-blush">{l.bottom}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-6 bottom-8 flex items-center gap-5 md:inset-x-10">
          <span className="relative block h-px flex-1 bg-ivory/20">
            <span data-progress="" className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-blush via-coral to-mint" />
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-ivory/50">Illustrative imagery</span>
        </div>
      </div>

      {/* Reduced-motion fallback: a still collage */}
      <div className="hidden px-5 py-24 motion-reduce:block md:px-10">
        <p className="text-center font-serif text-5xl font-light">
          Big or small. <em className="text-blush">Every kind of event.</em>
        </p>
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-5">
          {cards.map((c) => (
            <figure key={c.label} className="relative aspect-[4/5] overflow-hidden rounded-xl">
              <Pic image={c.image} sizes="240px" tone="dark" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
