"use client";

import { Pic } from "@/components/shared/Pic";
import { useRef } from "react";
import { stock } from "@/content/media";
import { gsap, SplitText, useGSAP, media } from "@/motion/gsap";
import { onIntroDone } from "@/motion/introGate";
import { EventsButton } from "../Button";
import { SprigGroup } from "../botanical/Sprig";
import { buildSprig } from "../botanical/geometry";

const sprigA = buildSprig({
  p0: { x: 30, y: 520 },
  p1: { x: 80, y: 330 },
  p2: { x: 260, y: 300 },
  p3: { x: 330, y: 60 },
  seed: 21,
  leafCount: 15,
  bloomCount: 7,
  scale: 1.05,
});
const sprigB = buildSprig({
  p0: { x: 330, y: 20 },
  p1: { x: 220, y: 120 },
  p2: { x: 120, y: 120 },
  p3: { x: 20, y: 240 },
  seed: 8,
  leafCount: 9,
  bloomCount: 5,
  scale: 0.85,
});

/**
 * Hero — editorial headline on the left, arched photograph wrapped by the
 * rose ring and living sprigs on the right. Waits for the opening sequence.
 */
export function EventsHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(media.ok, () => {
        let split: SplitText | null = null;
        const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });

        gsap.set(q("[data-hero-hidden]"), { opacity: 1 });
        split = SplitText.create(q("[data-headline]")[0], { type: "lines", mask: "lines", linesClass: "split-line" });
        gsap.set(q("[data-headline]"), { visibility: "visible" });

        tl.from(q("[data-eyebrow]"), { autoAlpha: 0, y: 16, duration: 1 }, 0)
          .from(split.lines, { yPercent: 115, rotate: 3, transformOrigin: "0 0", duration: 1.5, stagger: 0.12 }, 0.05)
          .from(q("[data-script]"), { clipPath: "inset(0% 100% 0% 0%)", duration: 1.6, ease: "power3.inOut" }, 0.6)
          .from(q("[data-sub]"), { autoAlpha: 0, y: 24, duration: 1.1 }, 0.7)
          .from(q("[data-cta] > *"), { autoAlpha: 0, y: 24, duration: 1, stagger: 0.1 }, 0.85)
          .fromTo(q("[data-arch]"), { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)" }, { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)", duration: 1.8, ease: "expo.inOut" }, 0)
          .from(q("[data-arch-img]"), { scale: 1.4, duration: 2.4 }, 0.1)
          .from(q("[data-ring]"), { drawSVG: "0%", duration: 2, ease: "power3.inOut" }, 0.4)
          .from(q(".bt-stem, .bt-twig"), { drawSVG: "0%", duration: 1.6, stagger: 0.05, ease: "power2.inOut" }, 0.6)
          .from(q(".bt-leaf"), { scale: 0, transformOrigin: "0% 50%", duration: 0.8, stagger: 0.02, ease: "back.out(2)" }, 1.0)
          .from(q(".bt-bloom"), { scale: 0, rotate: -45, duration: 0.9, stagger: 0.05, ease: "back.out(2.4)" }, 1.3)
          .from(q("[data-orb]"), { scale: 0, autoAlpha: 0, duration: 1.2, ease: "back.out(1.4)" }, 1.1)
          .from(q("[data-badge]"), { autoAlpha: 0, rotate: -90, duration: 1.4 }, 1.2)
          .from(q("[data-scroll]"), { autoAlpha: 0, y: -10, duration: 0.8 }, 1.5);

        const off = onIntroDone(() => tl.play());

        // Scroll: the composition drifts apart as the hero leaves.
        gsap.to(q("[data-arch-img]"), { yPercent: 12, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(q("[data-copy]"), { yPercent: -18, autoAlpha: 0.2, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(q("[data-orb]"), { yPercent: -60, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });

        return () => {
          off();
          split?.revert();
        };
      });

      // Botanicals lean subtly toward the cursor (desktop only).
      mm.add(`${media.desktop} and ${media.finePointer}`, () => {
        const layers = q<HTMLElement>("[data-depth]");
        const setters = layers.map((l) => ({
          x: gsap.quickTo(l, "x", { duration: 1.6, ease: "power3" }),
          y: gsap.quickTo(l, "y", { duration: 1.6, ease: "power3" }),
          d: Number(l.dataset.depth),
        }));
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          setters.forEach((s) => {
            s.x(nx * s.d);
            s.y(ny * s.d);
          });
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="paper-grain relative min-h-[100svh] overflow-hidden bg-ivory pt-28 md:pt-32" aria-labelledby="hero-title">
      {/* soft light */}
      <div className="pointer-events-none absolute -left-40 top-20 size-[620px] rounded-full bg-blush/35 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 size-[520px] rounded-full bg-mint/25 blur-[120px]" />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 pb-20 md:px-10 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-12 lg:items-center lg:gap-6">
        <div data-copy="" className="relative z-10 lg:col-span-7">
          <p data-eyebrow="" data-hero-hidden="" className="eyebrow mb-8 flex items-center gap-3 text-rose-deep">
            <span className="h-px w-10 bg-rose" /> Passion Events · Hyderabad · Across India
          </p>
          <h1 id="hero-title" className="relative font-serif text-[clamp(3.4rem,9.4vw,9.6rem)] font-light leading-[0.88] tracking-[-0.02em] text-ink">
            <span data-headline="" data-reveal="" className="block">
              <span className="block">Big or small.</span>
              <span className="block italic text-rose-deep">We make it</span>
            </span>
            <span
              data-script=""
              data-hero-hidden=""
              className="relative -mt-[0.1em] block pl-[0.6em] font-script text-[1.18em] leading-[1.05] text-coral [text-shadow:0_1px_0_rgb(255_255_255/0.4)]"
            >
              special.
            </span>
          </h1>
          <p data-sub="" data-hero-hidden="" className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-stone md:text-xl">
            From intimate celebrations to extraordinary productions, we bring every detail together to create experiences worth remembering.
          </p>
          <div data-cta="" className="mt-10 flex flex-wrap items-center gap-4">
            <span data-hero-hidden="">
              <EventsButton href="/contact#enquire" cursor="Begin">
                Plan your event
              </EventsButton>
            </span>
            <span data-hero-hidden="">
              <EventsButton href="/portfolio" variant="outline" cursor="Explore">
                Explore our work
              </EventsButton>
            </span>
          </div>
        </div>

        {/* Composition */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] lg:col-span-5 lg:max-w-none">
          <div data-arch="" data-hero-hidden="" className="absolute inset-[6%_10%_0_8%] overflow-hidden rounded-t-full shadow-[0_40px_90px_-40px_rgb(148_96_108/0.55)]" style={{ clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)" }}>
            <div data-arch-img="" className="absolute inset-[-8%_0] will-change-transform">
              <Pic image={stock.heroCanopy} preload sizes="(max-width: 1024px) 90vw, 40vw" className="" quality={85} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />
          </div>

          <svg data-depth="14" viewBox="0 0 500 620" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <ellipse data-ring="" cx="262" cy="330" rx="250" ry="300" fill="none" stroke="var(--color-rose)" strokeWidth="1.6" transform="rotate(-8 262 330)" />
            <ellipse data-ring="" cx="250" cy="325" rx="238" ry="292" fill="none" stroke="var(--color-blush)" strokeWidth="1.1" transform="rotate(-4 250 325)" />
          </svg>
          <svg data-depth="26" viewBox="0 0 360 560" className="pointer-events-none absolute -left-[12%] bottom-[2%] h-[78%] w-auto overflow-visible" aria-hidden="true">
            <SprigGroup g={sprigA} strokeWidth={1.6} />
          </svg>
          <svg data-depth="-20" viewBox="0 0 350 260" className="pointer-events-none absolute -right-[6%] top-0 w-[58%] overflow-visible" aria-hidden="true">
            <SprigGroup g={sprigB} strokeWidth={1.4} />
          </svg>

          <div data-orb="" data-depth="-34" className="absolute -left-[4%] top-[18%] size-[34%] overflow-hidden rounded-full border-[6px] border-ivory shadow-xl">
            <Pic image={stock.tableFloral} sizes="200px" className="" />
          </div>

          <div data-badge="" className="absolute -bottom-6 -right-2 grid size-28 place-items-center rounded-full bg-ivory/95 shadow-[0_20px_50px_-25px_rgb(148_96_108/0.6)] md:-right-6 md:size-36">
            <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow" aria-hidden="true">
              <defs>
                <path id="badgeCircle" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
              </defs>
              <text className="fill-ink font-sans text-[13px] font-semibold uppercase tracking-[0.32em]">
                <textPath href="#badgeCircle">By Ramya & Tanush · Passion Events ·</textPath>
              </text>
            </svg>
            <span className="grid size-12 place-items-center rounded-full bg-coral text-ivory md:size-14">
              <svg viewBox="-12 -12 24 24" className="size-6" aria-hidden="true">
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse key={a} cx="0" cy="-5" rx="3.6" ry="5.4" fill="currentColor" transform={`rotate(${a})`} />
                ))}
                <circle r="2.6" fill="var(--color-magenta)" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <div data-scroll="" data-hero-hidden="" className="absolute bottom-8 left-5 hidden items-center gap-4 md:left-10 md:flex">
        <span className="relative block h-14 w-px overflow-hidden bg-ink/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.4s_var(--ease-silk)_infinite] bg-rose" />
        </span>
        <span className="eyebrow text-stone">Scroll to discover</span>
      </div>
    </section>
  );
}
