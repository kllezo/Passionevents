"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { useLiveSound } from "./LiveSound";

// Geometry (SVG units)
const BRIDGE_X = 230;
const NUT_X = 1480;
const CENTER_Y = 300;
const STRINGS = [
  { name: "E", color: "#ff5a1f", hz: 7.5, width: 3.2 },
  { name: "A", color: "#ff7a3d", hz: 9, width: 2.8 },
  { name: "D", color: "#ff2e88", hz: 11, width: 2.4 },
  { name: "G", color: "#8b5cff", hz: 13.5, width: 2 },
  { name: "B", color: "#2ec5ff", hz: 16, width: 1.6 },
  { name: "E", color: "#c6ff3d", hz: 19, width: 1.3 },
];
// low E at the bottom, as seen from the audience
const yAtBridge = (i: number) => CENTER_Y + (2.5 - i) * 13;
const yAtNut = (i: number) => CENTER_Y + (2.5 - i) * 9.5;
const yAt = (i: number, x: number) => {
  const u = (x - BRIDGE_X) / (NUT_X - BRIDGE_X);
  return yAtBridge(i) + (yAtNut(i) - yAtBridge(i)) * u;
};
const frets = Array.from({ length: 21 }, (_, n) => NUT_X - (NUT_X - BRIDGE_X) * (1 - Math.pow(2, -(n + 1) / 12))).filter((x) => x > 470);
const inlays = [3, 5, 7, 9, 12, 15, 17, 19];

const BODY =
  "M470 222 C430 140 352 84 262 106 C196 122 170 52 96 74 C14 100 -6 200 18 300 C-6 400 14 500 96 526 C170 548 196 478 262 494 C352 516 430 460 470 378 C492 340 492 260 470 222 Z";
const HEAD = "M1478 262 L1590 236 C1612 232 1626 248 1622 268 L1622 332 C1626 352 1612 368 1590 364 L1478 338 Z";

type Vib = { amp: number; t: number; x: number; phase: number };

/**
 * A stylised electric guitar. Sweep the pointer (or finger) across the strings
 * to pluck them — each string vibrates at its own visual frequency with a
 * damped oscillation. Keyboard users can pluck via the string buttons.
 */
export function GuitarSection() {
  const root = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const glows = useRef<(SVGPathElement | null)[]>([]);
  const vib = useRef<Vib[]>(STRINGS.map(() => ({ amp: 0, t: 0, x: 800, phase: 0 })));
  const raf = useRef(0);
  const running = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const { pluck: sound } = useLiveSound();
  const reduced = useRef(false);

  const render = (i: number, offset: number, x: number) => {
    const yb = yAtBridge(i);
    const yn = yAtNut(i);
    const d = `M${BRIDGE_X} ${yb} Q${x.toFixed(1)} ${(yAt(i, x) + offset * 2).toFixed(2)} ${NUT_X} ${yn}`;
    paths.current[i]?.setAttribute("d", d);
    const g = glows.current[i];
    if (g) {
      g.setAttribute("d", d);
      g.style.opacity = String(Math.min(1, Math.abs(offset) / 6 + (vib.current[i].amp > 0.3 ? 0.35 : 0)));
    }
  };

  const loop = (ts: number) => {
    let active = false;
    const now = ts / 1000;
    vib.current.forEach((v, i) => {
      if (v.amp <= 0.05) {
        if (v.amp !== 0) {
          v.amp = 0;
          render(i, 0, v.x);
        }
        return;
      }
      active = true;
      const el = now - v.t;
      const a = v.amp * Math.exp(-el * 2.6);
      const off = a * Math.sin(2 * Math.PI * STRINGS[i].hz * el + v.phase);
      if (a < 0.05) v.amp = 0;
      render(i, off, v.x);
    });
    if (active) raf.current = requestAnimationFrame(loop);
    else running.current = false;
  };

  const pluck = (i: number, x: number, velocity: number) => {
    const v = vib.current[i];
    v.amp = (reduced.current ? 4 : 8) + velocity * 14;
    v.t = performance.now() / 1000;
    v.x = Math.min(NUT_X - 40, Math.max(BRIDGE_X + 40, x));
    v.phase = 0;
    sound(i, Math.min(1, 0.4 + velocity));
    if (!running.current) {
      running.current = true;
      raf.current = requestAnimationFrame(loop);
    }
    // light pulse on the matching tuning label
    const label = root.current?.querySelector<HTMLElement>(`[data-peg="${i}"]`);
    if (label) gsap.fromTo(label, { boxShadow: `0 0 0px ${STRINGS[i].color}` }, { boxShadow: `0 0 26px ${STRINGS[i].color}`, duration: 0.15, yoyo: true, repeat: 1 });
  };

  useEffect(() => {
    reduced.current = window.matchMedia(media.reduced).matches;
    const s = svg.current!;
    const toLocal = (e: PointerEvent) => {
      const pt = s.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const m = s.getScreenCTM();
      return m ? pt.matrixTransform(m.inverse()) : { x: 0, y: 0 };
    };
    const move = (e: PointerEvent) => {
      const p = toLocal(e);
      const prev = last.current;
      last.current = { x: p.x, y: p.y };
      if (!prev || p.x < BRIDGE_X || p.x > NUT_X) return;
      STRINGS.forEach((_, i) => {
        const y = yAt(i, p.x);
        if ((prev.y - y) * (p.y - y) < 0) pluck(i, p.x, Math.min(1, Math.abs(p.y - prev.y) / 30));
      });
    };
    const down = (e: PointerEvent) => {
      const p = toLocal(e);
      last.current = { x: p.x, y: p.y };
      if (p.x < BRIDGE_X || p.x > NUT_X) return;
      let best = -1;
      let dist = 18;
      STRINGS.forEach((_, i) => {
        const d = Math.abs(yAt(i, p.x) - p.y);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      if (best >= 0) pluck(best, p.x, 0.6);
    };
    const leave = () => (last.current = null);
    s.addEventListener("pointermove", move);
    s.addEventListener("pointerdown", down);
    s.addEventListener("pointerleave", leave);
    return () => {
      s.removeEventListener("pointermove", move);
      s.removeEventListener("pointerdown", down);
      s.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf.current);
    };
    // pluck closes over the latest sound fn through render-time refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sound]);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        gsap.fromTo(
          q("[data-guitar]"),
          { xPercent: 35, rotate: -14, scale: 0.8, autoAlpha: 0.2 },
          { xPercent: 0, rotate: -4, scale: 1, autoAlpha: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", end: "center 55%", scrub: 1 } }
        );
        gsap.from(q("[data-fret]"), { scaleY: 0, transformOrigin: "50% 50%", stagger: 0.03, scrollTrigger: { trigger: el, start: "top 55%", once: true }, duration: 0.4, ease: "back.out(2)" });
        gsap.to(q("[data-bg-word]"), { xPercent: -25, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        // auto strum once when it arrives, so visitors discover it's alive
        const stop = ScrollTriggerOnce(el, () => STRINGS.forEach((_, i) => setTimeout(() => pluck(i, 900, 0.5), i * 70)));
        return () => stop();
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-void py-28 md:py-40" aria-labelledby="guitar-title">
      <p data-bg-word="" aria-hidden="true" className="pointer-events-none absolute left-0 top-10 whitespace-nowrap font-display text-[24vw] uppercase leading-none text-white/[0.035]">
        Strike a chord · Strike a chord
      </p>
      <div className="relative mx-auto max-w-[1700px] px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="font-grotesk text-[0.72rem] uppercase tracking-[0.4em] text-volt">The sound — play it</p>
            <RevealText as="h2" id="guitar-title" flavor="live" split="chars" className="mt-6 font-display text-[clamp(3.2rem,9vw,9rem)] uppercase leading-[0.86] text-white">
              Strike a <span className="text-volt">chord.</span>
            </RevealText>
          </div>
          <p className="max-w-md font-grotesk text-fog md:col-span-5">
            Sweep across the strings. Every night we build starts the same way — with the right artist, the right room and a sound system that does them justice.
          </p>
        </div>
      </div>

      <div className="relative mt-16 md:mt-10">
        <svg
          ref={svg}
          data-guitar=""
          viewBox="-10 40 1650 520"
          className="mx-auto block w-[150%] max-w-none -translate-x-[16%] touch-pan-y select-none md:w-[112%] md:-translate-x-[5%]"
          role="img"
          aria-label="Interactive guitar. Move across the strings to pluck them."
        >
          <defs>
            <linearGradient id="gBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1a1030" />
              <stop offset="0.6" stopColor="#0b0b14" />
              <stop offset="1" stopColor="#2a0f20" />
            </linearGradient>
            <linearGradient id="gNeck" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#141420" />
              <stop offset="1" stopColor="#0a0a10" />
            </linearGradient>
            <filter id="gGlow" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

          {/* body */}
          <path d={BODY} fill="url(#gBody)" stroke="#ff5a1f" strokeWidth="2.5" />
          <path d={BODY} fill="none" stroke="#ff5a1f" strokeWidth="8" opacity="0.25" filter="url(#gGlow)" />
          <path d="M120 170 C200 140 300 160 360 220" fill="none" stroke="#8b5cff" strokeWidth="1.5" opacity="0.7" />
          {/* pickups + bridge */}
          {[300, 380].map((x) => (
            <g key={x}>
              <rect x={x - 16} y={250} width={32} height={100} rx={8} fill="#0a0a12" stroke="#8b5cff" strokeWidth="1.5" />
              {STRINGS.map((_, i) => (
                <circle key={i} cx={x} cy={yAt(i, x)} r={2.4} fill="#8b5cff" opacity="0.8" />
              ))}
            </g>
          ))}
          <rect x={BRIDGE_X - 14} y={258} width={22} height={84} rx={4} fill="#1d1d2a" stroke="#c6ff3d" strokeWidth="1" />
          {[110, 150, 190].map((x, k) => (
            <circle key={x} cx={x} cy={420 - k * 12} r={11} fill="#0d0d16" stroke="#2ec5ff" strokeWidth="1.5" />
          ))}

          {/* neck */}
          <rect x={460} y={266} width={NUT_X - 460} height={68} rx={6} fill="url(#gNeck)" stroke="#ffffff22" />
          {frets.map((x, n) => (
            <line key={x} data-fret="" x1={x} y1={268} x2={x} y2={332} stroke="#9aa0b8" strokeOpacity={0.55} strokeWidth={n === 0 ? 4 : 1.6} />
          ))}
          {inlays.map((n) => {
            const a = NUT_X - (NUT_X - BRIDGE_X) * (1 - Math.pow(2, -n / 12));
            const b = NUT_X - (NUT_X - BRIDGE_X) * (1 - Math.pow(2, -(n - 1) / 12));
            const cx = (a + b) / 2;
            if (cx < 470) return null;
            return n === 12 ? (
              <g key={n}>
                <circle cx={cx} cy={285} r={4} fill="#ff2e88" />
                <circle cx={cx} cy={315} r={4} fill="#ff2e88" />
              </g>
            ) : (
              <circle key={n} cx={cx} cy={300} r={4.5} fill="#ff2e88" opacity="0.85" />
            );
          })}
          <rect x={NUT_X - 4} y={264} width={8} height={72} rx={2} fill="#e8e8f0" />

          {/* headstock */}
          <path d={HEAD} fill="#0f0f18" stroke="#ff5a1f" strokeWidth="2" />
          {STRINGS.map((s, i) => (
            <g key={i}>
              <line x1={NUT_X} y1={yAtNut(i)} x2={1500 + i * 20} y2={i < 3 ? 252 + i * 2 : 348 - (5 - i) * 2} stroke={s.color} strokeOpacity={0.5} strokeWidth={1} />
              <circle cx={1500 + i * 20} cy={i < 3 ? 246 : 354} r={7} fill="#15151f" stroke={s.color} strokeWidth="1.5" />
            </g>
          ))}

          {/* strings */}
          {STRINGS.map((s, i) => (
            <g key={i}>
              <path
                ref={(el) => {
                  glows.current[i] = el;
                }}
                d={`M${BRIDGE_X} ${yAtBridge(i)} Q800 ${yAt(i, 800)} ${NUT_X} ${yAtNut(i)}`}
                fill="none"
                stroke={s.color}
                strokeWidth={s.width * 4}
                filter="url(#gGlow)"
                style={{ opacity: 0 }}
              />
              <path
                ref={(el) => {
                  paths.current[i] = el;
                }}
                d={`M${BRIDGE_X} ${yAtBridge(i)} Q800 ${yAt(i, 800)} ${NUT_X} ${yAtNut(i)}`}
                fill="none"
                stroke={s.color}
                strokeWidth={s.width}
                strokeLinecap="round"
              />
            </g>
          ))}
          {/* generous invisible hit area */}
          <rect x={BRIDGE_X} y={230} width={NUT_X - BRIDGE_X} height={140} fill="transparent" />
        </svg>
      </div>

      <div className="relative mx-auto mt-8 flex max-w-[1700px] flex-wrap items-center justify-between gap-6 px-5 md:px-10">
        <div className="flex gap-2" role="group" aria-label="Pluck a string">
          {STRINGS.map((s, i) => (
            <button
              key={i}
              type="button"
              data-peg={i}
              onClick={() => pluck(i, 860, 0.7)}
              className="grid size-11 place-items-center border border-white/15 font-display text-lg text-white transition-colors hover:border-white/60"
              style={{ color: s.color }}
              aria-label={`Pluck the ${s.name} string`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <p className="font-grotesk text-xs uppercase tracking-[0.3em] text-white/40">Sweep across the strings · tap a note</p>
      </div>
    </section>
  );
}

/** Fires a callback once when the element first reaches mid-screen. */
function ScrollTriggerOnce(el: Element, cb: () => void) {
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        cb();
        io.disconnect();
      }
    },
    { threshold: 0.6 }
  );
  io.observe(el.querySelector("[data-guitar]") ?? el);
  return () => io.disconnect();
}
