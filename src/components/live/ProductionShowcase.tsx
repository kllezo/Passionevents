"use client";

import { useRef } from "react";
import { stock, type SiteImage } from "@/content/media";
import { Pic } from "@/components/shared/Pic";
import { gsap, useGSAP, media } from "@/motion/gsap";

const steps: { k: string; title: string; text: string; image: SiteImage; color: string }[] = [
  { k: "01", title: "Stage", text: "Stage and truss designed around the artist, the venue and the sightlines.", image: stock.liveHaze, color: "#ff5a1f" },
  { k: "02", title: "Lighting", text: "Moving heads, beams and haze, programmed so every song gets its own look.", image: stock.liveLaser, color: "#8b5cff" },
  { k: "03", title: "Sound", text: "System design and engineers so the back row hears what the front row hears.", image: stock.liveDrumLight, color: "#2ec5ff" },
  { k: "04", title: "LED & visuals", text: "Screens and content that carry the show to the whole crowd.", image: stock.liveConcert, color: "#ff2e88" },
  { k: "05", title: "Artists", text: "Riders, rehearsals, soundcheck and hospitality — handled before doors open.", image: stock.liveSinger, color: "#ff5a1f" },
  { k: "06", title: "Crew & venue", text: "Load-in, crowd flow and show-day calls run by one coordinated team.", image: stock.liveField, color: "#c6ff3d" },
];

/**
 * How a Passion Live show is built. Desktop: pinned horizontal track with a
 * progress rail; each panel's photo pushes in as it reaches centre.
 * Mobile: vertical cards.
 */
export function ProductionShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.desktop, () => {
        const track = q("[data-track]")[0] as HTMLElement;
        const dist = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
        });
        gsap.to(q("[data-rail]"), { scaleX: 1, ease: "none", scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: () => `+=${dist()}`, scrub: true } });
        q<HTMLElement>("[data-panel]").forEach((p) => {
          gsap.fromTo(p.querySelector("[data-img]"), { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: p, containerAnimation: tween, start: "left right", end: "center center", scrub: true } });
          gsap.from(p.querySelector("[data-title]"), { yPercent: 100, ease: "power3.out", scrollTrigger: { trigger: p, containerAnimation: tween, start: "left 80%", end: "left 40%", scrub: true } });
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-char" aria-labelledby="production-title">
      <div data-pin="" className="relative overflow-hidden lg:h-[100svh]">
        <div data-track="" className="flex flex-col gap-8 px-5 py-24 md:px-10 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-6 lg:py-0 lg:pr-[8vw]">
          <div className="shrink-0 lg:w-[30vw]">
            <p className="font-grotesk text-[0.72rem] uppercase tracking-[0.4em] text-laser">How a show is built</p>
            <h2 id="production-title" className="mt-6 font-display text-[clamp(3rem,6.5vw,7rem)] uppercase leading-[0.88] text-white">
              We produce the <span className="text-laser">whole night.</span>
            </h2>
            <p className="mt-6 max-w-md text-fog">
              Not just tickets and posters. Passion Live plans and runs the production behind every show — the stage, the light, the sound and the people who make it happen.
            </p>
          </div>
          {steps.map((s) => (
            <article key={s.k} data-panel="" className="relative shrink-0 overflow-hidden border border-white/10 bg-void lg:h-[72vh] lg:w-[34vw] xl:w-[30vw]">
              <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-[58%]">
                <div data-img="" className="absolute inset-0">
                  <Pic image={s.image} sizes="(max-width: 1024px) 92vw, 34vw" tone="dark" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
                <span className="absolute left-5 top-5 font-grotesk text-xs tracking-[0.3em]" style={{ color: s.color }}>
                  {s.k} / 06
                </span>
              </div>
              <div className="p-6 md:p-8">
                <div className="overflow-hidden">
                  <h3 data-title="" className="font-display text-[clamp(2.6rem,4vw,4.4rem)] uppercase leading-none text-white">
                    {s.title}
                  </h3>
                </div>
                <span className="mt-4 block h-[2px] w-16" style={{ background: s.color, boxShadow: `0 0 18px ${s.color}` }} />
                <p className="mt-4 max-w-sm text-fog">{s.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="absolute inset-x-10 bottom-8 hidden h-px bg-white/10 lg:block">
          <div data-rail="" className="h-full origin-left scale-x-0 bg-gradient-to-r from-volt via-hot to-laser" />
        </div>
      </div>
      <p className="px-5 pb-10 text-xs uppercase tracking-[0.25em] text-white/30 md:px-10 lg:sr-only">Illustrative imagery</p>
    </section>
  );
}
