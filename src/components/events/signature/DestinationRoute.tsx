"use client";

import { useRef } from "react";
import { destinationJourney } from "@/content/categoryStories";
import { gsap, ScrollTrigger, useGSAP, media } from "@/motion/gsap";
import { SectionLabel } from "../SectionLabel";

const W = 1200;
const H = 460;
const stops = [
  { x: 90, y: 360 },
  { x: 300, y: 150 },
  { x: 510, y: 320 },
  { x: 710, y: 120 },
  { x: 910, y: 300 },
  { x: 1110, y: 140 },
];

/** Smooth Catmull-Rom curve through the stops, as an SVG cubic path. */
const routePath = (() => {
  const p = [stops[0], ...stops, stops[stops.length - 1]];
  let d = `M${stops[0].x} ${stops[0].y}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [a, b, c, e] = [p[i - 1], p[i], p[i + 1], p[i + 2]];
    d += ` C${b.x + (c.x - a.x) / 6} ${b.y + (c.y - a.y) / 6} ${c.x - (e.x - b.x) / 6} ${c.y - (e.y - b.y) / 6} ${c.x} ${c.y}`;
  }
  return d;
})();

/**
 * Destination signature: a travel map. Scrolling flies a little plane along
 * a dotted route that draws itself behind it; each stop lights up as the
 * plane reaches it and its part of the journey takes the stage below.
 */
export function DestinationRoute() {
  const root = useRef<HTMLElement>(null);
  const n = destinationJourney.length;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.desktop, () => {
        const details = q<HTMLElement>("[data-leg]");
        const pins = q<SVGGElement>("[data-stop]");
        let active = -1;
        gsap.set(details, { autoAlpha: 0 });
        const show = (i: number) => {
          if (i === active) return;
          const first = active === -1;
          active = i;
          // hide every other leg (state-based: fast jumps can't leave two visible)
          details.forEach((d, j) => j !== i && gsap.to(d, { autoAlpha: 0, y: -20, duration: 0.35, overwrite: true }));
          gsap.fromTo(details[i], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out", overwrite: true, delay: first ? 0 : 0.15 });
          pins.forEach((p, j) => p.classList.toggle("is-on", j <= i));
        };
        show(0);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: `+=${n * 55}%`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => show(Math.min(n - 1, Math.round(self.progress * (n - 1)))),
          },
        });
        const route = q<SVGPathElement>("[data-route]")[0];
        tl.fromTo(q("[data-route-drawn]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1 }, 0).to(
          q("[data-plane]"),
          { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.5], autoRotate: true }, duration: 1 },
          0
        );
        gsap.to(q("[data-cloud]"), { x: (i) => (i % 2 ? -60 : 60), duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
      mm.add(media.mobile, () => {
        const wrap = q<HTMLElement>("[data-m-route]")[0];
        const st = { trigger: wrap, start: "top 65%", end: "bottom 65%", scrub: 0.6, invalidateOnRefresh: true };
        gsap.fromTo(q("[data-m-line]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: st });
        gsap.fromTo(q("[data-m-plane]"), { y: 0 }, { y: () => wrap.offsetHeight - 32, ease: "none", scrollTrigger: { ...st } });
        q<HTMLElement>("[data-m-leg]").forEach((el) => {
          ScrollTrigger.create({ trigger: el, start: "top 65%", onToggle: (self) => (el.dataset.on = String(self.isActive || self.progress === 1)), end: "max" });
          gsap.fromTo(el, { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        });
      });
    },
    { scope: root, dependencies: [n], eager: true }
  );

  return (
    <section ref={root} className="relative bg-[#eaf2f0] text-ink" aria-labelledby="route-title">
      <div data-pin="" className="relative overflow-hidden lg:h-[100svh]">
        {/* contour-map texture */}
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full opacity-50" aria-hidden="true">
          {Array.from({ length: 9 }, (_, i) => (
            <ellipse key={i} cx={1250} cy={700} rx={120 + i * 90} ry={70 + i * 55} fill="none" stroke="#9cc5b8" strokeWidth="1" transform="rotate(-12 1250 700)" />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse key={`b${i}`} cx={260} cy={180} rx={80 + i * 70} ry={50 + i * 40} fill="none" stroke="#c7ddd5" strokeWidth="1" />
          ))}
        </svg>

        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col px-5 py-24 md:px-10 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel>Door to door</SectionLabel>
              <h2 id="route-title" className="mt-5 font-serif text-[clamp(2.6rem,3.8vw,4.3rem)] font-light leading-[0.95]">
                Wherever it takes you, <em className="text-rose-deep">we&apos;re there first.</em>
              </h2>
            </div>
            <p className="max-w-xs text-stone">Travel, stays and logistics handled — so your guests arrive somewhere beautiful and simply enjoy it.</p>
          </div>

          {/* Desktop map */}
          <div className="relative mt-8 hidden flex-1 lg:block">
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              <g data-cloud="" opacity="0.7">
                <ellipse cx="420" cy="60" rx="70" ry="18" fill="#fff" />
                <ellipse cx="450" cy="48" rx="40" ry="16" fill="#fff" />
              </g>
              <g data-cloud="" opacity="0.6">
                <ellipse cx="980" cy="420" rx="80" ry="20" fill="#fff" />
                <ellipse cx="1010" cy="406" rx="44" ry="17" fill="#fff" />
              </g>
              <path data-route="" d={routePath} fill="none" stroke="#6fa595" strokeWidth="2.2" strokeDasharray="2 8" strokeLinecap="round" />
              <path data-route-drawn="" d={routePath} fill="none" stroke="var(--color-coral)" strokeWidth="2.4" strokeLinecap="round" />
              {stops.map((s, i) => (
                <g key={i} data-stop="" transform={`translate(${s.x} ${s.y})`} className="[&.is-on_circle.core]:fill-[var(--color-coral)] [&.is-on_circle.halo]:opacity-100">
                  <circle className="halo opacity-0 transition-opacity duration-500" r="20" fill="rgb(242 156 143 / 0.25)" />
                  <circle className="core transition-[fill] duration-500" r="8" fill="#fff" stroke="var(--color-coral)" strokeWidth="2" />
                  <text y={i % 2 ? -32 : 44} textAnchor="middle" className="fill-ink font-serif text-[22px] italic">
                    {destinationJourney[i].title}
                  </text>
                </g>
              ))}
              <g data-plane="">
                <path d="M-18 0 L14 -4 L22 0 L14 4 Z M-2 -3 L-10 -16 L-4 -16 L8 -3 Z M-2 3 L-10 16 L-4 16 L8 3 Z M-16 -2 L-22 -9 L-18 -9 L-12 -2 Z M-16 2 L-22 9 L-18 9 L-12 2 Z" fill="var(--color-ink)" />
              </g>
            </svg>
          </div>

          <div className="relative hidden h-28 lg:block">
            {destinationJourney.map((s) => (
              <div key={s.title} data-leg="" className="absolute inset-0 flex items-start gap-8">
                <span className="font-serif text-6xl font-light italic text-coral-deep">{s.tag}</span>
                <div>
                  <h3 className="font-serif text-3xl">{s.title}</h3>
                  <p className="mt-2 max-w-xl text-stone">{s.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile route: the line draws itself down the journey and the plane flies along it */}
          <div data-m-route="" className="relative mt-12 lg:hidden">
            <span className="absolute bottom-2 left-[7px] top-2 w-0 border-l-2 border-dashed border-[#9cc5b8]" aria-hidden="true" />
            <span data-m-line="" className="absolute bottom-2 left-[7px] top-2 w-[2px] origin-top bg-coral" aria-hidden="true" />
            <svg data-m-plane="" viewBox="-24 -20 48 40" className="absolute -left-[9px] top-0 z-10 size-8 rotate-90 text-ink" aria-hidden="true">
              <path d="M-18 0 L14 -4 L22 0 L14 4 Z M-2 -3 L-10 -16 L-4 -16 L8 -3 Z M-2 3 L-10 16 L-4 16 L8 3 Z M-16 -2 L-22 -9 L-18 -9 L-12 -2 Z M-16 2 L-22 9 L-18 9 L-12 2 Z" fill="currentColor" />
            </svg>
            <ol className="space-y-10 pl-10">
              {destinationJourney.map((s) => (
                <li key={s.title} data-m-leg="" className="group relative">
                  <span data-m-dot="" className="absolute -left-[2.45rem] top-1 size-4 rounded-full border-2 border-coral bg-ivory transition-colors duration-500 group-data-[on=true]:bg-coral" />
                  <p className="font-serif text-lg italic text-coral-deep">{s.tag}</p>
                  <h3 className="font-serif text-3xl">{s.title}</h3>
                  <p className="mt-1 text-stone">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
