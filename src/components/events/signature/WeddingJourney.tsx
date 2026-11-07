"use client";

import { useRef, useState } from "react";
import { useCoverflow } from "@/motion/useCoverflow";
import { weddingJourney } from "@/content/categoryStories";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";
import { SectionLabel } from "../SectionLabel";

/** One colour world per ritual: background, text. */
const palette = [
  ["#f6e4e2", "#2a2024"], // roka — blush
  ["#f3c44f", "#2a2024"], // haldi — turmeric
  ["#6f8f4e", "#fef9ee"], // mehendi — henna
  ["#45264f", "#fef9ee"], // sangeet — plum night
  ["#9e2b37", "#fef9ee"], // wedding — vermilion
  ["#efe2c4", "#2a2024"], // reception — champagne
];

function Marigold({ r = 40 }: { r?: number }) {
  return (
    <g>
      {Array.from({ length: 18 }, (_, i) => (
        <ellipse key={i} cx="0" cy={-r * 0.55} rx={r * 0.2} ry={r * 0.48} fill={i % 2 ? "#f29c38" : "#f7b84a"} transform={`rotate(${i * 20})`} />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={`b${i}`} cx="0" cy={-r * 0.3} rx={r * 0.15} ry={r * 0.32} fill="#e9822a" transform={`rotate(${i * 30 + 15})`} />
      ))}
      <circle r={r * 0.16} fill="#c4561f" />
    </g>
  );
}

/**
 * Weddings signature: the celebration ritual by ritual. A marigold garland
 * hangs across the top; scrolling travels sideways through each ritual while
 * the whole section changes colour — turmeric for haldi, henna for mehendi,
 * plum for sangeet, vermilion for the wedding.
 */
export function WeddingJourney() {
  const root = useRef<HTMLElement>(null);
  const n = weddingJourney.length;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.desktop, () => {
        const pin = q("[data-pin]")[0] as HTMLElement;
        const track = q("[data-track]")[0] as HTMLElement;
        const flowers = q<SVGSVGElement>("[data-flower]");
        gsap.set(pin, { backgroundColor: palette[0][0], color: palette[0][1] });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: pin, start: "top top", end: `+=${(n - 1) * 90}%`, pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true },
        });
        tl.to(track, { x: () => -(track.scrollWidth - window.innerWidth), duration: n - 1 }, 0);
        for (let i = 1; i < n; i++) {
          tl.to(pin, { backgroundColor: palette[i][0], color: palette[i][1], duration: 0.5, ease: "power1.inOut" }, i - 0.75);
        }
        tl.to(flowers, { rotate: 360 * 1.5, duration: n - 1 }, 0).to(q("[data-thread]"), { scaleX: 1, duration: n - 1 }, 0);

        // The garland sways gently on its own.
        gsap.to(q("[data-garland] [data-bead]"), { y: 6, rotate: 8, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: { each: 0.08, from: "center" } });
      });
      mm.add(media.mobile, () => {
        const cards = q<HTMLElement>("[data-cf] > div");
        const t = gsap.fromTo(cards, { x: 140, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.3, stagger: 0.08, ease: "expo.out", paused: true });
        gsap.to(q("[data-m-garland] [data-bead]"), { y: 5, rotate: 8, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: { each: 0.1, from: "center" } });
        return whenVisible(cards[0], () => t.play(), "0px 0px -15% 0px");
      });
    },
    { scope: root, dependencies: [n] }
  );

  return (
    <section ref={root} aria-labelledby="journey-title" className="relative">
      {/* Desktop */}
      <div data-pin="" className="relative hidden h-[100svh] overflow-hidden lg:block" style={{ backgroundColor: palette[0][0], color: palette[0][1] }}>
        {/* Garland */}
        <svg data-garland="" viewBox="0 0 1600 120" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 h-[110px] w-full" aria-hidden="true">
          {Array.from({ length: 41 }, (_, i) => {
            const x = (i / 40) * 1600;
            // rounded: server and browser trig can differ in the last digit (hydration mismatch)
            const y = Math.round((14 + Math.sin((i / 40) * Math.PI) * 80 + Math.sin((i / 40) * Math.PI * 4) * 8) * 100) / 100;
            return (
              <g key={i} data-bead="" transform={`translate(${x} ${y})`} style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}>
                <circle r="11" fill={i % 3 === 0 ? "#e9822a" : "#f7b84a"} />
                <circle r="4" fill="#c4561f" />
              </g>
            );
          })}
        </svg>

        <div className="absolute left-10 top-32 z-10">
          <SectionLabel>The wedding, ritual by ritual</SectionLabel>
          <h2 id="journey-title" className="mt-4 max-w-md font-serif text-4xl font-light leading-tight">
            Every ceremony, <em>its own world.</em>
          </h2>
        </div>

        <div data-track="" className="flex h-full w-max">
          {weddingJourney.map((s, i) => (
            <article key={s.title} className="relative flex h-full w-screen shrink-0 items-center px-[8vw] pt-24">
              <svg data-flower="" viewBox="-60 -60 120 120" className="pointer-events-none absolute right-[8vw] top-1/2 size-[42vh] -translate-y-1/2 opacity-90 drop-shadow-[0_30px_40px_rgb(0_0_0/0.25)]" aria-hidden="true">
                <Marigold r={56} />
              </svg>
              <div className="relative max-w-[46vw]">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
                  {String(i + 1).padStart(2, "0")} · {s.tag}
                </p>
                <h3 className="mt-5 font-serif text-[clamp(3.6rem,8vw,8.5rem)] font-light italic leading-[0.9]">{s.title}</h3>
                <p className="mt-8 max-w-lg text-xl leading-relaxed opacity-85">{s.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="absolute inset-x-10 bottom-10 h-px">
          <span className="absolute inset-0 bg-current opacity-20" />
          <span data-thread="" className="absolute inset-0 origin-left scale-x-0 bg-current" />
        </div>
        <p className="absolute bottom-14 right-10 text-[0.65rem] uppercase tracking-[0.3em] opacity-60">Haldi · Mehendi · Sangeet · Wedding · Reception</p>
      </div>

      {/* Tablet / mobile: swipe through the rituals; the whole section takes each one's colour */}
      <MobileRituals />
    </section>
  );
}

function MobileRituals() {
  const strip = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useCoverflow(strip, { rotate: 12, scale: 0.1, dim: 0.35, onActive: setActive });
  const [bg, fg] = palette[active];

  return (
    <div className="relative overflow-hidden pb-16 pt-28 transition-colors duration-700 lg:hidden" style={{ backgroundColor: bg, color: fg }}>
      <svg data-m-garland="" viewBox="0 0 400 80" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 h-20 w-full" aria-hidden="true">
        {Array.from({ length: 17 }, (_, i) => {
          const x = (i / 16) * 400;
          const y = Math.round((10 + Math.sin((i / 16) * Math.PI) * 48) * 100) / 100;
          return (
            <g key={i} data-bead="" transform={`translate(${x} ${y})`}>
              <circle r="8" fill={i % 3 === 0 ? "#e9822a" : "#f7b84a"} />
              <circle r="3" fill="#c4561f" />
            </g>
          );
        })}
      </svg>
      <div className="px-5 md:px-10">
        <SectionLabel>The wedding, ritual by ritual</SectionLabel>
        <h2 className="mt-4 font-serif text-4xl font-light leading-tight">
          Every ceremony, <em>its own world.</em>
        </h2>
      </div>

      <div ref={strip} className="mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[10vw] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {weddingJourney.map((s, i) => (
          <article key={s.title} data-cf="" className="w-[80vw] max-w-[400px] shrink-0 snap-center will-change-transform">
            <div className="relative flex min-h-[25rem] flex-col justify-end overflow-hidden rounded-[1.75rem] p-7 shadow-[0_40px_70px_-40px_rgb(0_0_0/0.55)]" style={{ backgroundColor: palette[i][0], color: palette[i][1] }}>
              <span className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-gradient-to-b from-white/20 via-transparent to-black/15 ring-1 ring-inset ring-white/25" aria-hidden="true" />
              <svg viewBox="-60 -60 120 120" className={`absolute -right-10 -top-10 size-52 transition-transform duration-[1.4s] ease-[var(--ease-silk)] ${i === active ? "rotate-[200deg]" : "rotate-0"}`} aria-hidden="true">
                <Marigold r={56} />
              </svg>
              <p className="relative text-xs font-semibold uppercase tracking-[0.3em] opacity-70">
                {String(i + 1).padStart(2, "0")} · {s.tag}
              </p>
              <h3 className="relative mt-3 font-serif text-5xl font-light italic leading-[0.95]">{s.title}</h3>
              <p className="relative mt-4 opacity-85">{s.text}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between px-5 md:px-10" aria-hidden="true">
        <span className="flex gap-1.5">
          {weddingJourney.map((s, i) => (
            <span key={s.title} className={`h-1 rounded-full bg-current transition-all duration-500 ${i === active ? "w-7 opacity-90" : "w-2 opacity-25"}`} />
          ))}
        </span>
        <span className="text-[0.6rem] uppercase tracking-[0.28em] opacity-60">Swipe →</span>
      </div>
    </div>
  );
}
