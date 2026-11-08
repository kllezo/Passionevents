"use client";

import { Pic } from "@/components/shared/Pic";
import { useRef } from "react";
import { brand } from "@/content/media";
import { gsap, useGSAP } from "@/motion/gsap";
import { introPending, markIntroDone } from "@/motion/introGate";
import { useLenis } from "@/motion/SmoothScroll";
import { SprigGroup } from "../botanical/Sprig";
import { buildRingSprig } from "../botanical/geometry";

// Geometry measured from the supplied logo (1993 × 2000) so the hand-drawn
// sketch lands exactly on the real artwork before it resolves into it.
const RING = { cx: 1002, cy: 1035, r: 640 };
const sprigTop = buildRingSprig({ ...RING, from: 194, to: 280, seed: 3, scale: 2.7, leafCount: 16, bloomCount: 9 });
const sprigBottom = buildRingSprig({ ...RING, from: 16, to: 96, seed: 5, scale: 2.7, leafCount: 16, bloomCount: 9 });

/**
 * Cinematic opening: ivory → a botanical line draws itself → leaves unfurl →
 * coral blooms open → the rose ring is drawn → the sketch resolves into the
 * original Passion Events logo → the curtain lifts onto the hero.
 * Plays once per session; skippable; never shown with reduced motion.
 */
export function EventsIntro() {
  const root = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (!introPending()) return;
      const el = root.current!;
      const q = gsap.utils.selector(el);

      // Hold the page still without hiding the scrollbar (hiding it would make
      // the whole layout jump sideways when it comes back).
      const KEYS = new Set([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"]);
      const block = (e: Event) => {
        if (e instanceof KeyboardEvent && !KEYS.has(e.key)) return;
        e.preventDefault();
        e.stopImmediatePropagation();
      };
      const opts: AddEventListenerOptions = { passive: false, capture: true };
      window.addEventListener("wheel", block, opts);
      window.addEventListener("touchmove", block, opts);
      window.addEventListener("keydown", block, opts);
      const release = () => {
        window.removeEventListener("wheel", block, opts);
        window.removeEventListener("touchmove", block, opts);
        window.removeEventListener("keydown", block, opts);
      };
      window.scrollTo(0, 0);

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          release();
          gsap.set(el, { display: "none" });
        },
      });
      tlRef.current = tl;

      // First frame: everything still undrawn. The stage was hidden by CSS until
      // now so the finished artwork never flashes before the drawing starts.
      gsap.set(q(".bt-leaf"), { scale: 0, transformOrigin: "0% 50%" });
      gsap.set(q(".bt-bloom"), { scale: 0, rotate: -40 });
      gsap.set(q("[data-logo]"), { autoAlpha: 0, scale: 1.04, clipPath: "circle(0% at 50% 52%)" });
      gsap.set(q("[data-stage]"), { opacity: 1 });
      // Pin the curtain on screen ourselves: markIntroDone() removes the class that
      // displays it, which would otherwise make it vanish mid-lift.
      gsap.set(el, { display: "flex" });

      tl.from(q(".bt-stem"), { drawSVG: "0%", duration: 1.3, ease: "power2.inOut", stagger: 0.15 }, 0.15)
        .from(q(".bt-twig"), { drawSVG: "0%", duration: 0.6, stagger: 0.04 }, 0.7)
        .to(q(".bt-leaf"), { scale: 1, duration: 0.7, stagger: { each: 0.018, from: "start" }, ease: "back.out(2.2)" }, 0.55)
        .to(q(".bt-bloom"), { scale: 1, rotate: 0, duration: 0.8, stagger: 0.05, ease: "back.out(2.4)" }, 1.0)
        .from(q("[data-ring-a]"), { drawSVG: "50% 50%", duration: 1.3, ease: "power3.inOut" }, 0.9)
        .from(q("[data-ring-b]"), { drawSVG: "0%", duration: 1.4, ease: "power3.inOut" }, 1.0)
        .to(q("[data-logo]"), { autoAlpha: 1, scale: 1, clipPath: "circle(75% at 50% 52%)", duration: 1.1, ease: "power3.inOut" }, 2.0)
        .to(q("[data-sketch]"), { autoAlpha: 0, duration: 0.6 }, 2.45)
        .addLabel("lift", 3.25)
        // 1) the artwork gently recedes first — nothing is ever sliced by the curtain edge
        .to(q("[data-stage]"), { scale: 0.9, autoAlpha: 0, filter: "blur(6px)", duration: 0.55, ease: "power2.in" }, "lift")
        .to(q("[data-skip]"), { autoAlpha: 0, y: -10, duration: 0.35, ease: "power2.in" }, "lift")
        // 2) the hero starts as the curtain begins to rise
        .add(() => markIntroDone(), "lift+=0.4")
        // 3) the whole ivory curtain lifts away (a transform: smooth, GPU-composited)
        .to(el, { yPercent: -100, borderBottomLeftRadius: "50% 12%", borderBottomRightRadius: "50% 12%", duration: 1.05, ease: "power4.inOut" }, "lift+=0.45");

      return () => {
        release();
        tl.kill();
      };
    },
    { scope: root }
  );

  const skip = () => {
    const tl = tlRef.current;
    if (!tl) return;
    // Show the finished artwork, then play the normal exit a little faster.
    tl.seek("lift", false);
    tl.timeScale(1.6);
    lenis?.start();
  };

  return (
    <div
      ref={root}
      className="pe-intro paper-grain fixed inset-0 z-[120] items-center justify-center bg-ivory shadow-[0_40px_80px_-30px_rgb(94_52_64/0.35)] will-change-transform"
    >
      <div data-stage="" className="relative aspect-[1993/2000] w-[min(78vw,64vh)] opacity-0">
        <svg data-sketch="" aria-hidden="true" viewBox="0 0 1993 2000" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#b47a88" />
              <stop offset="0.5" stopColor="#ebc3c8" />
              <stop offset="1" stopColor="#a96f7e" />
            </linearGradient>
          </defs>
          <circle data-ring-a="" cx={RING.cx} cy={RING.cy} r={RING.r} fill="none" stroke="url(#ringGrad)" strokeWidth={9} />
          <ellipse data-ring-b="" cx={RING.cx + 10} cy={RING.cy + 8} rx={RING.r - 12} ry={RING.r - 4} fill="none" stroke="#bf8592" strokeOpacity={0.75} strokeWidth={6} />
          <SprigGroup g={sprigTop} strokeWidth={5} />
          <SprigGroup g={sprigBottom} strokeWidth={5} />
        </svg>
        <div data-logo="" className="absolute inset-0">
          <Pic image={brand.logo} alt="" sizes="(max-width: 768px) 78vw, 64vh" className="object-contain" preload skeleton={false} />
        </div>
      </div>

      <button
        type="button"
        data-skip=""
        onClick={skip}
        className="eyebrow absolute right-6 top-6 rounded-full border border-ink/15 px-5 py-2.5 text-ink/70 transition-colors hover:border-ink hover:text-ink"
      >
        Skip intro
      </button>
    </div>
  );
}
