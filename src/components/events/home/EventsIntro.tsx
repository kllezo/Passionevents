"use client";

import Image from "next/image";
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
      document.documentElement.style.overflow = "hidden";

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          document.documentElement.style.overflow = "";
          gsap.set(el, { display: "none" });
        },
      });
      tlRef.current = tl;

      gsap.set(q(".bt-leaf"), { scale: 0, transformOrigin: "0% 50%" });
      gsap.set(q(".bt-bloom"), { scale: 0, rotate: -40 });
      gsap.set(q("[data-logo]"), { autoAlpha: 0, scale: 1.04, clipPath: "circle(0% at 50% 52%)" });

      tl.from(q(".bt-stem"), { drawSVG: "0%", duration: 1.3, ease: "power2.inOut", stagger: 0.15 }, 0.15)
        .from(q(".bt-twig"), { drawSVG: "0%", duration: 0.6, stagger: 0.04 }, 0.7)
        .to(q(".bt-leaf"), { scale: 1, duration: 0.7, stagger: { each: 0.018, from: "start" }, ease: "back.out(2.2)" }, 0.55)
        .to(q(".bt-bloom"), { scale: 1, rotate: 0, duration: 0.8, stagger: 0.05, ease: "back.out(2.4)" }, 1.0)
        .from(q("[data-ring-a]"), { drawSVG: "50% 50%", duration: 1.3, ease: "power3.inOut" }, 0.9)
        .from(q("[data-ring-b]"), { drawSVG: "0%", duration: 1.4, ease: "power3.inOut" }, 1.0)
        .to(q("[data-logo]"), { autoAlpha: 1, scale: 1, clipPath: "circle(75% at 50% 52%)", duration: 1.1, ease: "power3.inOut" }, 2.0)
        .to(q("[data-sketch]"), { autoAlpha: 0, duration: 0.6 }, 2.45)
        .from(q("[data-intro-caption]"), { autoAlpha: 0, y: 14, duration: 0.6 }, 2.2)
        .addLabel("lift", 3.05)
        .add(() => markIntroDone(), "lift")
        .to(q("[data-stage]"), { scale: 0.86, autoAlpha: 0, duration: 0.8, ease: "power3.in" }, "lift")
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.0, ease: "power4.inOut" }, "lift+=0.2");

      return () => {
        document.documentElement.style.overflow = "";
      };
    },
    { scope: root }
  );

  const skip = () => {
    const tl = tlRef.current;
    if (!tl) return;
    tl.seek("lift");
    tl.timeScale(2);
    lenis?.start();
  };

  return (
    <div
      ref={root}
      className="pe-intro paper-grain fixed inset-0 z-[120] items-center justify-center bg-ivory"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div data-stage="" className="relative aspect-[1993/2000] w-[min(78vw,64vh)]">
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
          <Image src={brand.logo.src} alt="" fill sizes="(max-width: 768px) 78vw, 64vh" className="object-contain" preload />
        </div>
      </div>
      <p data-intro-caption="" className="eyebrow absolute bottom-10 left-1/2 -translate-x-1/2 text-rose-deep">
        Weddings · Celebrations · Live
      </p>
      <button
        type="button"
        onClick={skip}
        className="eyebrow absolute right-6 top-6 rounded-full border border-ink/15 px-5 py-2.5 text-ink/70 transition-colors hover:border-ink hover:text-ink"
      >
        Skip intro
      </button>
    </div>
  );
}
