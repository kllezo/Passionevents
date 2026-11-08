"use client";

import { Pic } from "@/components/shared/Pic";
import { useRef } from "react";
import { stock } from "@/content/media";
import { gsap, SplitText, useGSAP, media } from "@/motion/gsap";
import { StageCanvas } from "./StageCanvas";
import { Waveform } from "./Waveform";
import { LiveButton } from "./LiveButton";
import { HeroStickers } from "./HeroStickers";

/**
 * Concert intro: darkness → a low waveform wakes → neon lines switch on →
 * lasers sweep → identity glitches in → the headline slams in from both
 * sides → concert photography cuts in → CTAs → lights keep moving.
 */
export function LiveHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const l1 = SplitText.create(q("[data-l1]")[0], { type: "chars" });
        const l2 = SplitText.create(q("[data-l2]")[0], { type: "chars" });
        gsap.set(q("[data-hl]"), { visibility: "visible" });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(q("[data-wave]"), { autoAlpha: 0, scaleY: 0.1, duration: 1.2, ease: "power2.out" }, 0.1)
          .from(q("[data-neon]"), { drawSVG: "0%", duration: 0.9, stagger: 0.12, ease: "power3.inOut" }, 0.45)
          .from(q("[data-stage]"), { autoAlpha: 0, duration: 1.4 }, 0.6)
          .fromTo(q("[data-laser]"), { rotate: -38, autoAlpha: 0 }, { rotate: 38, autoAlpha: 1, duration: 1.1, stagger: 0.12, ease: "power2.inOut" }, 0.7)
          .to(q("[data-laser]"), { autoAlpha: 0, duration: 0.4 }, 1.7)
          .from(q("[data-id]"), { autoAlpha: 0, y: 10, duration: 0.5 }, 1.0)
          .add(() => q("[data-id]")[0]?.classList.add("is-glitching"), 1.0)
          .add(() => q("[data-id]")[0]?.classList.remove("is-glitching"), 1.8)
          .from(l1.chars, { x: () => -window.innerWidth * 0.6, skewX: -30, autoAlpha: 0, duration: 1.1, stagger: { each: 0.03, from: "end" } }, 1.15)
          .from(l2.chars, { x: () => window.innerWidth * 0.6, skewX: 30, autoAlpha: 0, duration: 1.1, stagger: { each: 0.025, from: "start" } }, 1.25)
          .fromTo(q("[data-photo]"), { clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)" }, { clipPath: "polygon(12% 0, 100% 0, 88% 100%, 0 100%)", duration: 1.2, ease: "expo.inOut" }, 1.5)
          .from(q("[data-photo-img]"), { scale: 1.4, duration: 2 }, 1.5)
          .from(q("[data-sub]"), { autoAlpha: 0, y: 20, duration: 0.8 }, 2.0)
          .from(q("[data-cta] > *"), { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.08 }, 2.1)
          .from(q("[data-ticker]"), { autoAlpha: 0, duration: 0.8 }, 2.3);

        // Scroll exit: headline stretches away, photo pushes in.
        gsap.to(q("[data-l1]"), { xPercent: -12, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(q("[data-l2]"), { xPercent: 10, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(q("[data-photo-img]"), { scale: 1.18, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });

        return () => {
          l1.revert();
          l2.revert();
        };
      });
      mm.add(media.reduced, () => gsap.set(q("[data-hl]"), { visibility: "visible" }));
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void pt-24" aria-labelledby="live-title">
      <div data-stage="" className="absolute inset-0">
        <StageCanvas className="absolute inset-0 h-full w-full" />
      </div>
      <div className="live-grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" />

      {/* neon lines */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
        <line data-neon="" x1="0" y1="180" x2="1000" y2="140" stroke="#8b5cff" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.5" />
        <line data-neon="" x1="1000" y1="820" x2="0" y2="880" stroke="#ff5a1f" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.5" />
        <line data-neon="" x1="140" y1="0" x2="80" y2="1000" stroke="#2ec5ff" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.3" />
      </svg>
      {/* lasers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {["#ff2e88", "#2ec5ff", "#c6ff3d"].map((c, i) => (
          <span
            key={c}
            data-laser=""
            className="absolute left-1/2 top-[-10%] h-[140%] w-[2px] origin-top opacity-0"
            style={{ background: `linear-gradient(${c}, transparent 85%)`, boxShadow: `0 0 18px ${c}`, marginLeft: `${(i - 1) * 18}vw` }}
          />
        ))}
      </div>

      {/* concert photograph slab */}
      <div data-photo="" className="absolute right-[4%] top-[10%] h-[22%] w-[44%] overflow-hidden md:right-[6%] md:top-[16%] md:h-[58%] md:w-[38%]" style={{ clipPath: "polygon(12% 0, 100% 0, 88% 100%, 0 100%)" }}>
        <div data-photo-img="" className="absolute inset-0">
          <Pic image={stock.liveHero} preload sizes="(max-width: 768px) 50vw, 40vw" className="" quality={85} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-violet/50 via-transparent to-volt/30 mix-blend-color" />
        <div className="scanlines absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1700px] flex-1 flex-col justify-end px-5 pb-10 md:px-10 md:pb-14">
        <p data-id="" className="glitch mb-6 font-grotesk text-[0.66rem] uppercase tracking-[0.22em] text-volt md:text-[0.72rem] md:tracking-[0.4em]" data-text="Passion Live — a Passion Events experience">
          Passion Live — a Passion Events experience
        </p>
        <h1 id="live-title" data-hl="" data-reveal="" className="font-display uppercase leading-[0.84] tracking-[-0.01em] text-white">
          <span data-l1="" className="block text-[clamp(3.6rem,13.5vw,15rem)]">
            Turn the night
          </span>
          <span data-l2="" className="block text-right text-[clamp(3.6rem,13.5vw,15rem)]">
            <span className="text-outline-volt">into a</span> <span className="text-volt neon-text-volt">movement.</span>
          </span>
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
          <p data-sub="" className="max-w-xl font-grotesk text-base leading-relaxed text-fog md:col-span-6 md:text-lg">
            From intimate live performances to electrifying concert experiences, Passion Live brings artists, audiences and unforgettable moments together.
          </p>
          <div data-cta="" className="flex flex-wrap gap-4 md:col-span-6 md:justify-end">
            <LiveButton href="/concerts/events">
              Explore upcoming shows
            </LiveButton>
            <LiveButton href="/concerts/partners" variant="outline">
              Partner with us
            </LiveButton>
          </div>
        </div>
      </div>

      <div data-wave="" className="pointer-events-none absolute inset-x-0 top-[44%] h-40 opacity-70 md:h-56">
        <Waveform variant="line" className="h-full w-full" />
      </div>

      <HeroStickers />

      <div data-ticker="" className="relative z-10 overflow-hidden border-t border-white/10 bg-void/60 py-3 backdrop-blur" aria-hidden="true">
        <div className="flex w-max animate-marquee font-grotesk text-xs uppercase tracking-[0.35em] text-white/60" style={{ ["--marquee-duration" as string]: "30s" }}>
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 gap-10 pr-10">
              {["Live", "Loud", "Together", "Artists", "Audiences", "Moments", "Stage", "Sound", "Light"].map((w) => (
                <span key={w + k} className="flex items-center gap-10">
                  {w} <span className="text-volt">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
