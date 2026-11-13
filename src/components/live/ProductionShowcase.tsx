"use client";

import { useRef } from "react";
import { stock, type SiteImage } from "@/content/media";
import { Pic } from "@/components/shared/Pic";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";

type Cap = { k: string; title: string; text: string; image: SiteImage; color: string; area: string; sizes: string };

/**
 * How a Passion Live show is built, as a production portfolio: one dominant
 * stage photograph and five supporting frames of different sizes. Photos
 * wipe open as the grid enters; a light sweep crosses each frame on hover.
 * Descriptions show on hover (desktop) and are always visible on touch.
 */
const caps: Cap[] = [
  { k: "01", title: "Stage", text: "Stage and truss designed around the artist, the venue and the sightlines.", image: stock.liveHaze, color: "#ff5a1f", area: "lg:col-span-7 lg:row-span-2", sizes: "(max-width: 1024px) 92vw, 56vw" },
  { k: "02", title: "Lighting", text: "Moving heads, beams and haze, programmed so every song gets its own look.", image: stock.liveLaser, color: "#8b5cff", area: "lg:col-span-5", sizes: "(max-width: 1024px) 92vw, 40vw" },
  { k: "03", title: "Sound", text: "System design and engineers so the back row hears what the front row hears.", image: stock.liveDrumLight, color: "#2ec5ff", area: "lg:col-span-5", sizes: "(max-width: 1024px) 92vw, 40vw" },
  { k: "04", title: "LED & visuals", text: "Screens and content that carry the show to the whole crowd.", image: stock.liveConcert, color: "#ff2e88", area: "lg:col-span-4", sizes: "(max-width: 1024px) 92vw, 32vw" },
  { k: "05", title: "Artist coordination", text: "Riders, rehearsals, soundcheck and hospitality, handled before doors open.", image: stock.liveSinger, color: "#ff5a1f", area: "lg:col-span-4", sizes: "(max-width: 1024px) 92vw, 32vw" },
  { k: "06", title: "Show-day execution", text: "Load-in, crowd flow and show calls run by one coordinated crew.", image: stock.liveField, color: "#c6ff3d", area: "lg:col-span-4", sizes: "(max-width: 1024px) 92vw, 32vw" },
];

export function ProductionShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const tiles = q<HTMLElement>("[data-tile]");
        const stops = tiles.map((t, i) => {
          const tl = gsap.timeline({ paused: true });
          tl.fromTo(t.querySelector("[data-wipe]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut", delay: (i % 3) * 0.08 }, 0)
            .fromTo(t.querySelector("[data-img]"), { scale: 1.25 }, { scale: 1, duration: 1.6, ease: "expo.out" }, 0.1)
            .fromTo(t.querySelector("[data-title]"), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.out" }, 0.45);
          return whenVisible(t, () => tl.play(), "0px 0px -12% 0px");
        });
        return () => stops.forEach((s) => s());
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-char py-24 md:py-28" aria-labelledby="production-title">
      <div className="pointer-events-none absolute -left-40 top-0 size-[620px] rounded-full bg-violet/20 blur-[160px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-grotesk text-[0.72rem] uppercase tracking-[0.4em] text-laser">(02) Production capabilities</p>
            <h2 id="production-title" className="mt-5 font-display text-[clamp(2.8rem,4.6vw,5.2rem)] uppercase leading-[0.88] text-white">
              We produce the <span className="text-laser">whole night.</span>
            </h2>
          </div>
          <p className="max-w-md text-fog lg:col-span-4 lg:col-start-9">
            Not just tickets and posters. Passion Live plans and runs the production behind every show: the stage, the light, the sound and the people who make it happen.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-14 lg:auto-rows-[minmax(15rem,34vh)] lg:grid-cols-12 lg:gap-4">
          {caps.map((c, i) => (
            <li key={c.k} data-tile="" className={`group relative isolate overflow-hidden rounded-[1.25rem] bg-void ${i === 0 ? "aspect-[4/5] sm:col-span-2 sm:aspect-[16/10] lg:aspect-auto" : "aspect-[4/3] lg:aspect-auto"} ${c.area}`}>
              <div data-wipe="" className="absolute inset-0">
                <div data-img="" className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]">
                  <Pic image={c.image} alt="" sizes={c.sizes} tone="dark" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5" />
              {/* light sweep */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-[left,opacity] duration-1000 ease-out group-hover:left-[120%] group-hover:opacity-100" />
              <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-7">
                <span className="font-grotesk text-xs tracking-[0.3em]" style={{ color: c.color }}>
                  {c.k} / 06
                </span>
                <div>
                  <div className="overflow-hidden">
                    <h3 data-title="" className={`font-display uppercase leading-[0.9] text-white ${i === 0 ? "text-[clamp(2.6rem,5vw,5.6rem)]" : "text-[clamp(1.9rem,2.6vw,3rem)]"}`}>
                      {c.title}
                    </h3>
                  </div>
                  <span className="mt-3 block h-[2px] w-14 transition-[width] duration-700 group-hover:w-24" style={{ background: c.color, boxShadow: `0 0 18px ${c.color}` }} />
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-fog transition-[opacity,transform] duration-500 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
                    {c.text}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-white/35">
          Illustrative photography.{" "}
          <a href="#reels" className="text-white/60 underline-offset-4 hover:text-white hover:underline">
            Our own concert footage is in the reels below
          </a>
          .
        </p>
      </div>
    </section>
  );
}
