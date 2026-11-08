"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, media } from "@/motion/gsap";
import { mulberry32 } from "@/components/events/botanical/geometry";
import { LiveButton } from "./LiveButton";

const PEOPLE = 26;
const crowd = (() => {
  const rand = mulberry32(42);
  return Array.from({ length: PEOPLE }, (_, i) => ({
    x: 18 + i * (964 / (PEOPLE - 1)) + (rand() - 0.5) * 14,
    h: 70 + rand() * 50,
    s: 0.85 + rand() * 0.35,
    phase: rand() * Math.PI * 2,
    speed: 7 + rand() * 5,
    phone: rand() > 0.45,
  }));
})();

const stages = [
  { at: 0, label: "Warming up" },
  { at: 20, label: "Getting loud" },
  { at: 50, label: "Unhinged" },
  { at: 80, label: "Almost there…" },
  { at: 100, label: "Encore!" },
];

const CONFETTI = ["#ff5a1f", "#ff2e88", "#8b5cff", "#2ec5ff", "#c6ff3d"];

/** Haptic tick on phones — only after a real tap (browsers block it otherwise). */
const buzz = (pattern: number | number[]) => {
  const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
  if (ua?.hasBeenActive && typeof navigator.vibrate === "function") navigator.vibrate(pattern);
};

/**
 * "Make some noise": press and hold (mouse, touch, or Space/Enter) to build
 * the crowd's hype. The crowd bounces harder, phone lights come up, the stage
 * glows — and at 100% confetti bursts and the call to action drops in.
 * Releasing lets the hype cool down. Animates only while in view and active.
 */
export function HypeMeter() {
  const root = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const hype = useRef(0);
  const holding = useRef(false);
  const raf = useRef(0);
  const last = useRef(0);
  const visible = useRef(false);
  const blown = useRef(false);
  const [pct, setPct] = useState(0);
  const [maxed, setMaxed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(media.reduced).matches;
    const people = Array.from(svg.current?.querySelectorAll<SVGGElement>("[data-person]") ?? []);
    const arms = people.map((p) => Array.from(p.querySelectorAll<SVGGElement>("[data-arms]")));
    const lights = Array.from(svg.current?.querySelectorAll<SVGCircleElement>("[data-light]") ?? []);
    const C = 2 * Math.PI * 46;

    const paint = (t: number) => {
      const v = hype.current / 100;
      people.forEach((p, i) => {
        const c = crowd[i];
        const jump = reduced ? 0 : Math.max(0, Math.sin(t * c.speed * (0.5 + v) + c.phase)) * 34 * v;
        p.setAttribute("transform", `translate(${c.x} ${200 - jump}) scale(${c.s})`);
        const raise = `rotate(${(-150 * Math.min(1, v * 1.6) + Math.sin(t * c.speed + c.phase) * 10 * v).toFixed(1)})`;
        arms[i].forEach((a) => a.setAttribute("transform", raise));
      });
      lights.forEach((l, i) => l.setAttribute("opacity", String(Math.max(0, Math.min(1, (v - 0.3) * 2.5)) * (0.6 + 0.4 * Math.sin(t * 6 + i)))));
      if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - v));
      if (glow.current) glow.current.style.opacity = String(0.15 + v * 0.85);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last.current) / 1000);
      last.current = now;
      hype.current = Math.max(0, Math.min(100, hype.current + (holding.current ? 34 : -20) * dt));
      const rounded = Math.round(hype.current);
      setPct((p) => (p === rounded ? p : rounded));
      if (hype.current >= 100 && !blown.current) {
        blown.current = true;
        setMaxed(true);
        buzz([30, 40, 60]);
        burst();
      }
      if (hype.current < 60 && blown.current) blown.current = false;
      paint(now / 1000);
      if (visible.current && (holding.current || hype.current > 0)) raf.current = requestAnimationFrame(tick);
      else raf.current = 0;
    };
    const kick = () => {
      if (!raf.current && visible.current) {
        last.current = performance.now();
        raf.current = requestAnimationFrame(tick);
      }
    };

    const burst = () => {
      if (reduced || !root.current) return;
      const bits = root.current.querySelectorAll<HTMLElement>("[data-bit]");
      gsap.fromTo(
        bits,
        { x: 0, y: 0, scale: 0, rotate: 0, autoAlpha: 1 },
        {
          x: () => gsap.utils.random(-560, 560),
          y: () => gsap.utils.random(-420, 120),
          rotate: () => gsap.utils.random(-720, 720),
          scale: () => gsap.utils.random(0.6, 1.5),
          duration: 1.4,
          ease: "expo.out",
          overwrite: true,
        }
      );
      gsap.to(bits, { y: "+=260", autoAlpha: 0, duration: 1.6, delay: 0.9, ease: "power1.in", stagger: 0.008 });
    };

    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (visible.current) kick();
    });
    if (root.current) io.observe(root.current);
    paint(0);

    const btn = root.current?.querySelector<HTMLButtonElement>("[data-hype-btn]");
    const down = (e: PointerEvent) => {
      e.preventDefault();
      btn?.setPointerCapture(e.pointerId);
      holding.current = true;
      buzz(12);
      kick();
    };
    const up = () => {
      holding.current = false;
    };
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!holding.current) {
          holding.current = true;
          kick();
        }
      }
    };
    const keyUp = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") holding.current = false;
    };
    btn?.addEventListener("pointerdown", down);
    btn?.addEventListener("pointerup", up);
    btn?.addEventListener("pointercancel", up);
    btn?.addEventListener("lostpointercapture", up);
    btn?.addEventListener("keydown", keyDown);
    btn?.addEventListener("keyup", keyUp);
    btn?.addEventListener("blur", up);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
      btn?.removeEventListener("pointerdown", down);
      btn?.removeEventListener("pointerup", up);
      btn?.removeEventListener("pointercancel", up);
      btn?.removeEventListener("lostpointercapture", up);
      btn?.removeEventListener("keydown", keyDown);
      btn?.removeEventListener("keyup", keyUp);
      btn?.removeEventListener("blur", up);
    };
  }, []);

  const stage = [...stages].reverse().find((s) => pct >= s.at) ?? stages[0];

  return (
    <section ref={root} className="relative overflow-hidden bg-void pb-0 pt-28 md:pt-36" aria-labelledby="hype-title">
      <div ref={glow} className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_100%,rgb(255_90_31/0.55),rgb(139_92_255/0.25)_45%,transparent_75%)] opacity-15" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1700px] px-5 text-center md:px-10">
        <p className="font-grotesk text-[0.72rem] uppercase tracking-[0.4em] text-hot">Crowd check</p>
        <h2 id="hype-title" className="mt-5 font-display text-[clamp(3rem,8vw,8rem)] uppercase leading-[0.86] text-white">
          Make some <span className="text-hot [text-shadow:0_0_30px_rgb(255_46_136/0.6)]">noise.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-fog">Press and hold to hype the crowd. Let go and they cool off — get them to 100%.</p>

        <div className="relative mx-auto mt-10 grid size-48 place-items-center md:size-56">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="3" />
            <circle
              ref={ring}
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="url(#hypeGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 46}
              style={{ strokeDashoffset: 2 * Math.PI * 46 }}
            />
            <defs>
              <linearGradient id="hypeGrad" x1="0" x2="1">
                <stop offset="0" stopColor="#c6ff3d" />
                <stop offset="0.5" stopColor="#ff5a1f" />
                <stop offset="1" stopColor="#ff2e88" />
              </linearGradient>
            </defs>
          </svg>
          <button
            type="button"
            data-hype-btn=""
            aria-label={`Hold to hype the crowd — ${pct}%`}
            className="relative grid size-[78%] touch-none select-none place-items-center rounded-full bg-gradient-to-br from-volt via-hot to-violet text-black shadow-[0_0_60px_-10px_rgb(255_90_31/0.8)] transition-transform duration-200 active:scale-95"
          >
            <span>
              <span className="block font-display text-5xl leading-none md:text-6xl">{pct}%</span>
              <span className="mt-1 block font-grotesk text-[0.6rem] font-bold uppercase tracking-[0.25em]">Hold to hype</span>
            </span>
          </button>
          <span className="pointer-events-none absolute left-1/2 top-1/2 size-0" aria-hidden="true">
            {Array.from({ length: 40 }, (_, i) => (
              <span key={i} data-bit="" className={`absolute block opacity-0 ${i % 3 ? "h-3 w-2 rounded-[2px]" : "size-2.5 rounded-full"}`} style={{ backgroundColor: CONFETTI[i % CONFETTI.length] }} />
            ))}
          </span>
        </div>

        <p className="mt-6 font-display text-3xl uppercase tracking-wide text-white md:text-4xl" aria-live="polite">
          {stage.label}
        </p>
        <div className={`mt-6 flex justify-center transition-all duration-700 ${maxed ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
          <LiveButton href="/concerts/partners#partner-form">The crowd is ready — let&apos;s create a show</LiveButton>
        </div>
      </div>

      {/* the crowd */}
      <svg ref={svg} viewBox="0 0 1000 220" preserveAspectRatio="xMidYMax slice" className="relative mt-10 block h-[clamp(8rem,18vw,14rem)] w-full" aria-hidden="true">
        {crowd.map((c, i) => (
          <g key={i} data-person="" transform={`translate(${c.x.toFixed(1)} 200) scale(${c.s.toFixed(3)})`}>
            {c.phone && <circle data-light="" cx={i % 2 ? 20 : -20} cy={-c.h - 58} r="5" fill="#fff8e7" opacity="0" style={{ filter: "drop-shadow(0 0 6px #fff3c4)" }} />}
            <g transform={`translate(0 ${(-c.h + 16).toFixed(1)})`}>
              <g data-arms="">
                <rect x="-3" y="0" width="6" height="40" rx="3" fill="#000" />
              </g>
            </g>
            <g transform={`translate(0 ${(-c.h + 16).toFixed(1)}) scale(-1 1)`}>
              <g data-arms="">
                <rect x="-3" y="0" width="6" height="40" rx="3" fill="#000" />
              </g>
            </g>
            <circle cx="0" cy={(-c.h - 6).toFixed(1)} r="14" fill="#000" />
            <rect x="-17" y={(-c.h + 8).toFixed(1)} width="34" height={(c.h + 30).toFixed(1)} rx="14" fill="#000" />
          </g>
        ))}
      </svg>
    </section>
  );
}
