"use client";

import { useRef } from "react";
import { approach, whyUs } from "@/content/events";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";
import { Bloom } from "../botanical/Sprig";
import { leafPath } from "../botanical/geometry";

const H = 560; // stem height in the SVG
const nodesY = approach.map((_, i) => Math.round(28 + (i * (H - 56)) / Math.max(1, approach.length - 1)));

/**
 * CONCEPTUALISE → PLAN → DESIGN → PRODUCE → EXECUTE, vertically.
 * Desktop: the section pins; a botanical stem grows down the stages as you
 * scroll, each stage blooms as the stem reaches it, and its word rolls onto
 * the stage on the left. Phones: a stem grows down the list and every stage
 * spins its bloom open and slides in. Then the seven things you can count on,
 * as one horizontal row.
 */
export function Approach({ index = "04" }: { index?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(media.desktop, () => {
        const words = q<HTMLElement>("[data-word]");
        const steps = q<HTMLElement>("[data-step]");
        const blooms = q<SVGGElement>("[data-node]");
        gsap.set(words.slice(1), { yPercent: 100, autoAlpha: 0 });
        gsap.set(steps.slice(1), { opacity: 0.4 });
        gsap.set(blooms, { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(blooms[0], { scale: 1 });

        const n = words.length;
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: `+=${(n - 1) * 55}%`, pin: true, scrub: 0.8, anticipatePin: 1 },
        });
        tl.fromTo(q("[data-stem]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: n - 1, ease: "none" }, 0);
        tl.from(q("[data-leaf]"), { scale: 0, transformOrigin: "0% 50%", stagger: (n - 1) / 8, duration: 0.3 }, 0);
        tl.fromTo(q("[data-glow]"), { y: nodesY[0] }, { y: nodesY[n - 1], duration: n - 1, ease: "none" }, 0);
        for (let i = 1; i < n; i++) {
          const at = i - 0.15;
          tl.to(words[i - 1], { yPercent: -100, autoAlpha: 0, duration: 0.5 }, at)
            .to(words[i], { yPercent: 0, autoAlpha: 1, duration: 0.5 }, at)
            .to(steps[i - 1], { opacity: 0.4, duration: 0.4 }, at)
            .to(steps[i], { opacity: 1, duration: 0.4 }, at)
            .to(blooms[i], { scale: 1, rotate: 144, duration: 0.5, ease: "back.out(2.4)" }, at);
        }
      });

      mm.add(media.mobile, () => {
        gsap.fromTo(q("[data-m-stem]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: q("[data-m-list]")[0], start: "top 70%", end: "bottom 60%", scrub: 0.6 } });
        q<HTMLElement>("[data-step]").forEach((li) => {
          const bloom = li.querySelector("[data-m-bloom]");
          gsap
            .timeline({ scrollTrigger: { trigger: li, start: "top 78%", toggleActions: "play none none reverse" } })
            .fromTo(bloom, { scale: 0, rotate: -180 }, { scale: 1, rotate: 0, duration: 0.9, ease: "back.out(2.4)" }, 0)
            .fromTo(li.querySelectorAll("h3, p"), { x: 30, autoAlpha: 0.1, filter: "blur(6px)" }, { x: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.9, stagger: 0.08, ease: "expo.out" }, 0.05);
        });
      });

      mm.add(media.ok, () => {
        const items = q<HTMLElement>("[data-promise]");
        gsap.set(items, { autoAlpha: 0, y: 18 });
        return whenVisible(q("[data-promises]")[0], () => gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "expo.out" }), "0px 0px -15% 0px");
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-cream" aria-labelledby="approach-title">
      <div data-pin="" className="paper-grain relative overflow-hidden lg:h-[100svh]">
        <div className="mx-auto grid h-full max-w-[1600px] grid-cols-1 gap-12 px-5 py-24 md:px-10 lg:grid-cols-12 lg:items-center lg:py-0">
          <div className="lg:col-span-6">
            <SectionLabel index={index}>How we work</SectionLabel>
            <RevealText as="h2" id="approach-title" className="mt-6 max-w-xl font-serif text-[clamp(2.3rem,3.8vw,3.9rem)] font-light leading-[1.02] text-ink">
              From first idea <em className="text-rose-deep">to the final applause.</em>
            </RevealText>
            <div className="relative mt-12 hidden h-[clamp(4rem,5.6vw,6.6rem)] overflow-hidden lg:block" aria-hidden="true">
              {approach.map((a) => (
                <span key={a.step} data-word="" className="absolute inset-0 whitespace-nowrap font-serif text-[clamp(3.2rem,4.8vw,5.8rem)] font-light uppercase leading-[1.1] tracking-[-0.02em] text-ink">
                  {a.step}
                </span>
              ))}
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <svg viewBox={`0 0 80 ${H}`} className="absolute -left-2 top-0 hidden h-[560px] w-20 overflow-visible lg:block" aria-hidden="true">
              <path data-stem="" d={`M40 0 C 20 120, 60 180, 40 280 S 20 440, 40 ${H}`} fill="none" stroke="var(--color-mint-deep)" strokeWidth="1.6" strokeLinecap="round" />
              <circle data-glow="" cx="40" cy="0" r="14" fill="var(--color-coral)" opacity="0.18" />
              {[90, 210, 330, 450].map((y, i) => (
                <g key={y} transform={`translate(${i % 2 ? 44 : 36} ${y}) rotate(${i % 2 ? -30 : 210})`}>
                  <path data-leaf="" d={leafPath(26, 10)} fill="var(--color-mint)" />
                </g>
              ))}
              {nodesY.map((y) => (
                <g key={y} transform={`translate(40 ${y})`}>
                  <g data-node="">
                    <Bloom r={11} />
                  </g>
                </g>
              ))}
            </svg>
            <ol data-m-list="" className="relative flex flex-col justify-between gap-10 max-lg:pl-10 lg:h-[560px] lg:gap-0 lg:pl-24">
              <span className="absolute bottom-2 left-3 top-2 w-px bg-ink/10 lg:hidden" aria-hidden="true">
                <span data-m-stem="" className="absolute inset-0 origin-top bg-gradient-to-b from-mint-deep via-rose to-coral" />
              </span>
              {approach.map((a) => (
                <li key={a.step} data-step="" className="relative grid grid-cols-[auto_1fr] gap-5">
                  <svg data-m-bloom="" viewBox="-14 -14 28 28" className="absolute -left-[2.35rem] top-1 size-6 lg:hidden" aria-hidden="true">
                    <Bloom r={11} />
                  </svg>
                  <span className="font-serif text-xl italic text-rose">{a.index}</span>
                  <div>
                    <h3 className="font-serif text-2xl uppercase tracking-[0.04em] text-ink md:text-3xl">{a.step}</h3>
                    <p className="mt-2 max-w-md leading-relaxed text-stone">{a.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Seven things you can count on: one horizontal row */}
      <div className="mx-auto max-w-[1600px] px-5 pb-24 md:px-10 md:pb-28">
        <div className="border-t border-ink/10 pt-10">
          <p className="eyebrow text-rose-deep">What you can count on</p>
          <ol
            data-promises=""
            className="-mx-5 mt-6 flex snap-x snap-mandatory overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
            aria-label="What you can count on"
          >
            {whyUs.map((w, i) => (
              <li key={w.title} data-promise="" className="w-[min(68vw,15rem)] shrink-0 snap-start border-l border-ink/12 px-5 first:border-l-0 first:pl-0 lg:w-auto lg:px-4 xl:px-5">
                <span className="font-serif text-sm italic text-rose-deep">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-serif text-[1.3rem] leading-tight text-ink xl:text-[1.45rem]">{w.title}</h3>
                <p className="mt-2 text-[0.9rem] leading-snug text-stone">{w.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
