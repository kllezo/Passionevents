"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, media } from "@/motion/gsap";
import { LiveButton } from "./LiveButton";

/**
 * Finale: as you scroll, the room goes dark, beams converge, a light burst
 * blooms behind the headline and it slams into place.
 */
export function FinalCTA() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const split = SplitText.create(q("[data-final]")[0], { type: "words,chars" });
        gsap.set(q("[data-final]"), { visibility: "visible" });
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", end: "center 45%", scrub: 1 } });
        tl.from(q("[data-beam]"), { rotate: (i) => (i % 2 ? 50 : -50), autoAlpha: 0, stagger: 0.05 }, 0)
          .from(q("[data-burst]"), { scale: 0.2, autoAlpha: 0 }, 0.2)
          .from(split.chars, { yPercent: 110, scaleY: 1.8, autoAlpha: 0, stagger: { each: 0.015, from: "center" }, ease: "power4.out" }, 0.1)
          .from(q("[data-final-cta]"), { autoAlpha: 0, y: 30 }, 0.6);
        return () => split.revert();
      });
      mm.add(media.reduced, () => gsap.set(q("[data-final]"), { visibility: "visible" }));
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative flex min-h-[110svh] items-center overflow-hidden bg-void py-32" aria-labelledby="final-title">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {["#ff5a1f", "#8b5cff", "#2ec5ff", "#ff2e88", "#ff5a1f", "#8b5cff"].map((c, i) => (
          <span
            key={i}
            data-beam=""
            className="absolute bottom-[-20%] left-1/2 h-[140%] w-[3px] origin-bottom"
            style={{ background: `linear-gradient(to top, ${c}, transparent 80%)`, transform: `rotate(${(i - 2.5) * 14}deg)`, boxShadow: `0 0 30px ${c}` }}
          />
        ))}
        <div data-burst="" className="absolute left-1/2 top-1/2 size-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_90_31/0.55),rgb(139_92_255/0.25)_35%,transparent_65%)] blur-2xl" />
      </div>
      <div className="relative mx-auto w-full max-w-[1700px] px-5 text-center md:px-10">
        <h2 id="final-title" data-final="" data-reveal="" className="font-display text-[clamp(3rem,7.4vw,9.5rem)] uppercase leading-[0.86] text-white">
          The next great night
          <br />
          <span className="text-volt neon-text-volt">starts with us.</span>
        </h2>
        <div data-final-cta="" className="mt-12 flex flex-wrap justify-center gap-4">
          <LiveButton href="/concerts/partners#partner-form">
            Let&apos;s create a show
          </LiveButton>
          <LiveButton href="/concerts/events" variant="outline">
            Upcoming shows
          </LiveButton>
        </div>
      </div>
    </section>
  );
}
