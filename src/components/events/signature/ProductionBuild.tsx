"use client";

import { useRef } from "react";
import { productionBuild } from "@/content/categoryStories";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { SectionLabel } from "../SectionLabel";

/** The stage build, step by step: one timeline unit per build step. */
function addBuild(tl: gsap.core.Timeline, q: (s: string) => Element[]) {
  // 1 ground plan
  tl.from(q("[data-grid] line"), { drawSVG: "0%", stagger: 0.02 }, 0)
    // 2 deck
    .from(q("[data-deck]"), { scaleY: 0, transformOrigin: "50% 100%" }, 1)
    // 3 truss
    .from(q("[data-truss] line, [data-truss] path"), { drawSVG: "0%", stagger: 0.03 }, 2)
    // 4 lights
    .from(q("[data-fixture]"), { scale: 0, transformOrigin: "50% 50%", stagger: 0.06, ease: "back.out(2)" }, 3)
    .from(q("[data-wash]"), { opacity: 0 }, 3.4)
    // 5 LED wall
    .from(q("[data-led]"), { scaleX: 0, transformOrigin: "50% 50%" }, 4)
    .from(q("[data-led-glow]"), { opacity: 0 }, 4.5)
    // 6 sound
    .from(q("[data-pa-l]"), { x: -200, opacity: 0 }, 5)
    .from(q("[data-pa-r]"), { x: 200, opacity: 0 }, 5)
    // 7 showtime
    .from(q("[data-crowd]"), { y: 80, opacity: 0 }, 6)
    .from(q("[data-beam]"), { opacity: 0, stagger: 0.05 }, 6)
    .to(q("[data-house]"), { opacity: 0.85 }, 6);
}

/**
 * Production signature: a stage builds itself as the reader scrolls — ground
 * plan, deck, truss, lights, LED wall, sound — until the show goes live with
 * sweeping beams and the crowd rising in front. Each step lights up in the
 * build list beside it.
 */
export function ProductionBuild() {
  const root = useRef<HTMLElement>(null);
  const n = productionBuild.length;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.desktop, () => {
        const steps = q<HTMLElement>("[data-build-step]");
        let active = -1;
        const setActive = (i: number) => {
          if (i === active) return;
          active = i;
          steps.forEach((s, j) => (s.dataset.state = j < i ? "done" : j === i ? "live" : "next"));
        };
        setActive(0);

        const tl = gsap.timeline({
          defaults: { ease: "power2.out", duration: 1 },
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: `+=${n * 50}%`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
          },
        });
        addBuild(tl, q);

        gsap.to(q("[data-beam]"), { rotate: (i) => (i % 2 ? 18 : -18), transformOrigin: "50% 0%", duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.3 });
        gsap.to(q("[data-led-glow]"), { attr: { x: 630 }, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
      // Phones: the stage stays docked at the top while the build list scrolls
      // beneath it; each step builds that part of the stage.
      mm.add(media.mobile, () => {
        const steps = q<HTMLElement>("[data-build-step]");
        const setActive = (i: number) => steps.forEach((s, j) => (s.dataset.state = j < i ? "done" : j === i ? "live" : "next"));
        setActive(0);
        const tl = gsap.timeline({
          defaults: { ease: "power2.out", duration: 1 },
          scrollTrigger: {
            trigger: q("[data-steps]")[0],
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.8,
            onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n))),
          },
        });
        addBuild(tl, q);
        gsap.to(q("[data-beam]"), { rotate: (i) => (i % 2 ? 18 : -18), transformOrigin: "50% 0%", duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.3 });
      });
    },
    { scope: root, dependencies: [n] }
  );

  const fixtures = [140, 230, 320, 410, 590, 680, 770, 860];

  return (
    <section ref={root} className="relative bg-[#0d0b10] text-ivory" aria-labelledby="build-title">
      <div data-pin="" className="relative overflow-clip lg:h-[100svh] lg:overflow-hidden">
        <div className="relative mx-auto grid h-full max-w-[1600px] gap-12 px-5 py-24 max-lg:flex max-lg:flex-col max-lg:gap-8 md:px-10 lg:grid-cols-12 lg:items-center lg:py-0">
          <div className="lg:col-span-4">
            <SectionLabel tone="ivory">From empty floor to showtime</SectionLabel>
            <h2 id="build-title" className="mt-6 font-serif text-[clamp(2.6rem,3.5vw,4rem)] font-light leading-[0.95]">
              We build the <em className="text-blush">whole show.</em>
            </h2>
            <ol data-steps="" className="mt-10 space-y-1 max-lg:space-y-8 max-lg:pb-[24svh]">
              {productionBuild.map((s) => (
                <li
                  key={s.title}
                  data-build-step=""
                  data-state="next"
                  className="group grid grid-cols-[2.5rem_1fr] gap-x-3 rounded-xl px-4 py-2.5 transition-[background-color,opacity] duration-500 data-[state=done]:opacity-50 data-[state=live]:bg-ivory/[0.07] data-[state=next]:opacity-35"
                >
                  <span className="font-serif text-lg italic text-blush">{s.tag}</span>
                  <span>
                    <span className="block font-serif text-xl">{s.title}</span>
                    <span className="block max-h-0 overflow-hidden text-sm text-ivory/60 transition-[max-height] duration-500 group-data-[state=live]:max-h-20">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* The stage */}
          <div className="relative max-lg:sticky max-lg:top-2 max-lg:z-10 max-lg:order-first max-lg:-mx-3 max-lg:rounded-2xl max-lg:bg-[#0d0b10]/95 max-lg:p-3 max-lg:backdrop-blur-md lg:col-span-8" aria-hidden="true">
            <svg viewBox="0 0 1000 640" className="w-full overflow-visible">
              <defs>
                <linearGradient id="ledFill" x1="0" x2="1">
                  <stop offset="0" stopColor="#3b1d4a" />
                  <stop offset="0.5" stopColor="#bf8592" />
                  <stop offset="1" stopColor="#2c4a5a" />
                </linearGradient>
                <linearGradient id="beamFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffe8d6" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#ffe8d6" stopOpacity="0" />
                </linearGradient>
                <clipPath id="ledClip">
                  <rect x="250" y="150" width="500" height="250" rx="4" />
                </clipPath>
                <radialGradient id="washFill" cx="0.5" cy="0.2" r="0.7">
                  <stop offset="0" stopColor="#f29c8f" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#f29c8f" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect data-house="" x="-10" y="20" width="1020" height="620" rx="28" fill="#1c1420" opacity="0" />

              {/* ground grid */}
              <g data-grid="" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="1">
                {Array.from({ length: 11 }, (_, i) => (
                  <line key={`v${i}`} x1={i * 100} y1="470" x2={500 + (i * 100 - 500) * 1.6} y2="640" />
                ))}
                {[470, 510, 560, 620].map((y) => (
                  <line key={`h${y}`} x1="-100" y1={y} x2="1100" y2={y} />
                ))}
              </g>

              <rect data-wash="" x="60" y="60" width="880" height="420" fill="url(#washFill)" />

              {/* LED wall */}
              <g data-led="">
                <rect x="250" y="150" width="500" height="250" rx="4" fill="url(#ledFill)" />
                <rect data-led-glow="" x="250" y="150" width="120" height="250" fill="#fff" opacity="0.18" clipPath="url(#ledClip)" />
                <g stroke="#000" strokeOpacity="0.25">
                  {Array.from({ length: 9 }, (_, i) => (
                    <line key={i} x1={250 + (i + 1) * 50} y1="150" x2={250 + (i + 1) * 50} y2="400" />
                  ))}
                  {Array.from({ length: 4 }, (_, i) => (
                    <line key={`r${i}`} x1="250" y1={150 + (i + 1) * 50} x2="750" y2={150 + (i + 1) * 50} />
                  ))}
                </g>
              </g>

              {/* deck */}
              <g data-deck="">
                <rect x="120" y="400" width="760" height="70" fill="#2a2024" stroke="#bf8592" strokeOpacity="0.6" />
                <rect x="120" y="400" width="760" height="6" fill="#bf8592" opacity="0.8" />
              </g>

              {/* truss */}
              <g data-truss="" stroke="#d9d4d6" strokeWidth="2" fill="none">
                <line x1="100" y1="470" x2="100" y2="80" />
                <line x1="900" y1="470" x2="900" y2="80" />
                <line x1="100" y1="80" x2="900" y2="80" />
                <line x1="100" y1="100" x2="900" y2="100" />
                <path d={Array.from({ length: 16 }, (_, i) => `M${100 + i * 50} 80 L${125 + i * 50} 100`).join(" ")} strokeWidth="1" />
              </g>

              {/* beams + fixtures */}
              {fixtures.map((x, i) => (
                <g key={x}>
                  <polygon data-beam="" points={`${x - 6},104 ${x + 6},104 ${x + 90},470 ${x - 90},470`} fill="url(#beamFill)" opacity={i % 2 ? 0.7 : 1} />
                  <g data-fixture="">
                    <rect x={x - 12} y="96" width="24" height="20" rx="4" fill="#3a3238" stroke="#d9d4d6" />
                    <circle cx={x} cy="116" r="6" fill="#ffe8d6" />
                  </g>
                </g>
              ))}

              {/* PA */}
              <g data-pa-l="">
                {[0, 1, 2].map((k) => (
                  <rect key={k} x="20" y={250 + k * 72} width="70" height="66" rx="6" fill="#1a1a1d" stroke="#57505a" />
                ))}
              </g>
              <g data-pa-r="">
                {[0, 1, 2].map((k) => (
                  <rect key={k} x="910" y={250 + k * 72} width="70" height="66" rx="6" fill="#1a1a1d" stroke="#57505a" />
                ))}
              </g>

              {/* crowd */}
              <g data-crowd="" fill="#000">
                {Array.from({ length: 22 }, (_, i) => {
                  const x = 10 + i * 46 + (i % 2) * 10;
                  const h = 40 + ((i * 37) % 30);
                  return (
                    <g key={i}>
                      <circle cx={x} cy={640 - h - 22} r="18" />
                      <rect x={x - 26} y={640 - h} width="52" height={h + 10} rx="20" />
                      {i % 5 === 2 && <rect x={x + 8} y={640 - h - 80} width="9" height="70" rx="4" transform={`rotate(14 ${x + 12} ${640 - h})`} />}
                    </g>
                  );
                })}
              </g>
            </svg>
            <p className="mt-4 text-right text-[0.65rem] uppercase tracking-[0.3em] text-ivory/40">Illustration</p>
          </div>
        </div>
      </div>
    </section>
  );
}
