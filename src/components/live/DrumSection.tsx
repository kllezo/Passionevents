"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { useLiveSound } from "./LiveSound";
import { Waveform } from "./Waveform";

type Pad = { id: "crash" | "tom" | "snare" | "kick" | "hat"; label: string; key: string; color: string; cx: number; cy: number; r: number };

const PADS: Pad[] = [
  { id: "crash", label: "Crash", key: "A", color: "#c6ff3d", cx: 170, cy: 150, r: 92 },
  { id: "tom", label: "Tom", key: "S", color: "#2ec5ff", cx: 380, cy: 120, r: 78 },
  { id: "kick", label: "Kick", key: "D", color: "#ff5a1f", cx: 500, cy: 340, r: 150 },
  { id: "snare", label: "Snare", key: "F", color: "#ff2e88", cx: 640, cy: 130, r: 84 },
  { id: "hat", label: "Hi-hat", key: "G", color: "#8b5cff", cx: 840, cy: 160, r: 80 },
];

// 16-step demo groove (visual only unless sound is switched on)
const PATTERN: Record<Pad["id"], number[]> = {
  kick: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  hat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  tom: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  crash: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

/**
 * Futuristic drum kit: tap/click/keys (A S D F G) to hit. Each hit squashes
 * the skin, throws ripple rings and radial pulses, and kicks the equaliser.
 * A visual demo groove plays while the section is in view until you take over.
 */
export function DrumSection() {
  const root = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const energy = useRef(0);
  const [demo, setDemo] = useState(true);
  const { drum, enabled } = useLiveSound();
  const soundRef = useRef({ drum, enabled });
  useEffect(() => {
    soundRef.current = { drum, enabled };
  }, [drum, enabled]);

  const hit = useCallback((id: Pad["id"], fromUser = true) => {
    const pad = PADS.find((p) => p.id === id)!;
    const s = svg.current;
    if (!s) return;
    if (fromUser) soundRef.current.drum(id); // the demo groove is always silent
    energy.current = Math.min(1.4, energy.current + (id === "kick" ? 0.9 : 0.45));

    const skin = s.querySelector(`[data-skin="${id}"]`);
    gsap.fromTo(skin, { scale: 0.9, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.5, ease: "elastic.out(1.2, 0.35)" });
    const glow = s.querySelector(`[data-glow="${id}"]`);
    gsap.fromTo(glow, { opacity: 0.9 }, { opacity: 0, duration: 0.6, ease: "power2.out" });

    if (window.matchMedia(media.reduced).matches) return;
    // ripple rings
    const layer = s.querySelector("[data-fx]")!;
    for (let k = 0; k < 2; k++) {
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", String(pad.cx));
      c.setAttribute("cy", String(pad.cy));
      c.setAttribute("r", String(pad.r));
      c.setAttribute("fill", "none");
      c.setAttribute("stroke", pad.color);
      c.setAttribute("stroke-width", "2");
      layer.appendChild(c);
      gsap.fromTo(c, { attr: { r: pad.r * 0.9 }, opacity: 0.9 }, { attr: { r: pad.r * (1.8 + k * 0.6) }, opacity: 0, duration: 0.9 + k * 0.3, delay: k * 0.08, ease: "power2.out", onComplete: () => c.remove() });
    }
    // radial pulse lines
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    layer.appendChild(g);
    for (let a = 0; a < 12; a++) {
      const ang = (a / 12) * Math.PI * 2;
      const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      const r0 = pad.r * 1.05;
      l.setAttribute("x1", String(pad.cx + Math.cos(ang) * r0));
      l.setAttribute("y1", String(pad.cy + Math.sin(ang) * r0));
      l.setAttribute("x2", String(pad.cx + Math.cos(ang) * (r0 + 14)));
      l.setAttribute("y2", String(pad.cy + Math.sin(ang) * (r0 + 14)));
      l.setAttribute("stroke", pad.color);
      l.setAttribute("stroke-width", "2");
      l.setAttribute("stroke-linecap", "round");
      g.appendChild(l);
    }
    gsap.fromTo(g, { scale: 0.85, transformOrigin: `${pad.cx}px ${pad.cy}px`, opacity: 1 }, { scale: 1.5, opacity: 0, duration: 0.55, ease: "expo.out", onComplete: () => g.remove() });
    // room flash
    gsap.fromTo(root.current!.querySelector("[data-flash]"), { opacity: id === "kick" ? 0.22 : 0.1, background: `radial-gradient(60% 60% at 50% 60%, ${pad.color}, transparent 70%)` }, { opacity: 0, duration: 0.5 });
  }, []);

  // keyboard
  useEffect(() => {
    const el = root.current!;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select")) return;
      const pad = PADS.find((p) => p.key === e.key.toUpperCase());
      if (!pad) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      setDemo(false);
      hit(pad.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hit]);

  // demo groove while in view
  useEffect(() => {
    if (!demo || window.matchMedia(media.reduced).matches) return;
    let step = 0;
    let timer = 0;
    let inView = false;
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting), { threshold: 0.4 });
    io.observe(root.current!);
    timer = window.setInterval(() => {
      if (!inView || document.hidden) return;
      (Object.keys(PATTERN) as Pad["id"][]).forEach((id) => PATTERN[id][step % 16] && hit(id, false));
      step++;
    }, 60000 / 112 / 4);
    return () => {
      clearInterval(timer);
      io.disconnect();
    };
  }, [demo, hit]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        gsap.from(q("[data-pad]"), {
          scale: 0,
          transformOrigin: "50% 50%",
          stagger: 0.08,
          duration: 0.9,
          ease: "back.out(1.8)",
          scrollTrigger: { trigger: q("[data-kit]")[0], start: "top 80%", once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-char py-28 md:py-32" aria-labelledby="drum-title">
      <div data-flash="" className="pointer-events-none absolute inset-0 opacity-0" />
      <div className="relative mx-auto max-w-[1700px] px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="font-grotesk text-[0.72rem] uppercase tracking-[0.4em] text-hot">The pulse — hit it</p>
            <RevealText as="h2" id="drum-title" flavor="live" split="chars" className="mt-6 font-display text-[clamp(3.2rem,7.2vw,7.7rem)] uppercase leading-[0.86] text-white">
              Feel the <span className="text-hot">beat.</span>
            </RevealText>
          </div>
          <div className="space-y-4 md:col-span-5">
            <p className="max-w-md text-fog">Hit the pads — click, tap or use the keys A S D F G. The room answers every beat.</p>
            {!demo && (
              <button type="button" onClick={() => setDemo(true)} className="font-grotesk text-xs uppercase tracking-[0.3em] text-volt underline underline-offset-4">
                Play the demo groove
              </button>
            )}
            {!enabled && <p className="font-grotesk text-xs uppercase tracking-[0.25em] text-white/40">Sound is off — switch it on in the menu bar</p>}
          </div>
        </div>

        <div data-kit="" className="relative mx-auto mt-14 max-w-5xl">
          <svg ref={svg} viewBox="0 0 1010 520" className="w-full touch-manipulation overflow-visible" aria-hidden="true">
            <defs>
              <radialGradient id="skin" cx="50%" cy="40%" r="60%">
                <stop offset="0" stopColor="#2a2a3a" />
                <stop offset="1" stopColor="#0c0c14" />
              </radialGradient>
            </defs>
            <g data-fx="" />
            {PADS.map((p) => (
              <g key={p.id} data-pad="">
                <circle cx={p.cx} cy={p.cy} r={p.r + 8} fill="none" stroke={p.color} strokeOpacity={0.35} strokeWidth={1} strokeDasharray="3 6" />
                <g data-skin={p.id}>
                  <circle cx={p.cx} cy={p.cy} r={p.r} fill="url(#skin)" stroke={p.color} strokeWidth={2.5} />
                  <circle data-glow={p.id} cx={p.cx} cy={p.cy} r={p.r} fill={p.color} opacity={0} />
                  {[0.72, 0.45].map((k) => (
                    <circle key={k} cx={p.cx} cy={p.cy} r={p.r * k} fill="none" stroke={p.color} strokeOpacity={0.3} />
                  ))}
                  <text x={p.cx} y={p.cy + 6} textAnchor="middle" className="fill-white font-display text-[22px] uppercase tracking-wider">
                    {p.label}
                  </text>
                  <text x={p.cx} y={p.cy + 30} textAnchor="middle" className="fill-white/40 font-grotesk text-[12px]">
                    [{p.key}]
                  </text>
                </g>
              </g>
            ))}
          </svg>
          {/* Accessible hit targets laid over the SVG pads */}
          <div className="absolute inset-0">
            {PADS.map((p) => (
              <button
                key={p.id}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  setDemo(false);
                  hit(p.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setDemo(false);
                    hit(p.id);
                  }
                }}
                aria-label={`Hit ${p.label} (key ${p.key})`}
                className="absolute rounded-full focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  left: `${((p.cx - p.r) / 1010) * 100}%`,
                  top: `${((p.cy - p.r) / 520) * 100}%`,
                  width: `${((p.r * 2) / 1010) * 100}%`,
                  height: `${((p.r * 2) / 520) * 100}%`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 h-24 max-w-5xl md:h-32">
          <Waveform variant="bars" energyRef={energy} colors={["#ff2e88", "#ff5a1f"]} className="h-full w-full" />
        </div>
      </div>
    </section>
  );
}
