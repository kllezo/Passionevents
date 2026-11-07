"use client";

import { useRef } from "react";
import { approach } from "@/content/events";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";
import { Bloom } from "../botanical/Sprig";
import { leafPath } from "../botanical/geometry";

/**
 * DISCOVER → PLAN → CREATE → EXECUTE. A botanical stem grows with the scroll;
 * each stage blooms as it is reached and its word takes the stage.
 */
export function Approach({ index = "05" }: { index?: string }) {
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
        gsap.set(steps.slice(1), { opacity: 0.55 });
        gsap.set(blooms, { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(blooms[0], { scale: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: "+=260%", pin: true, scrub: 0.8, anticipatePin: 1 },
        });
        tl.fromTo(q("[data-stem]"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 3, ease: "none" }, 0);
        tl.from(q("[data-leaf]"), { scale: 0, transformOrigin: "0% 50%", stagger: 0.25, duration: 0.3 }, 0);
        for (let i = 1; i < words.length; i++) {
          const at = i - 0.15;
          tl.to(words[i - 1], { yPercent: -100, autoAlpha: 0, duration: 0.5 }, at)
            .to(words[i], { yPercent: 0, autoAlpha: 1, duration: 0.5 }, at)
            .to(steps[i - 1], { opacity: 0.55, duration: 0.4 }, at)
            .to(steps[i], { opacity: 1, duration: 0.4 }, at)
            .to(blooms[i], { scale: 1, rotate: 72, duration: 0.5, ease: "back.out(2)" }, at);
        }
      });

      mm.add(media.mobile, () => {
        gsap.fromTo(q("[data-m-stem]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: q("[data-m-list]")[0], start: "top 70%", end: "bottom 60%", scrub: 0.6 } });
        q<HTMLElement>("[data-step]").forEach((li) => {
          const bloom = li.querySelector("[data-m-bloom]");
          gsap
            .timeline({ scrollTrigger: { trigger: li, start: "top 72%", toggleActions: "play none none reverse" } })
            .fromTo(bloom, { scale: 0, rotate: -120 }, { scale: 1, rotate: 0, duration: 0.8, ease: "back.out(2.2)" }, 0)
            .fromTo(li.querySelectorAll("h3, p"), { x: 24, autoAlpha: 0.15 }, { x: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08, ease: "expo.out" }, 0);
        });
      });
    },
    { scope: root }
  );

  const nodesY = [40, 200, 360, 520];

  return (
    <section ref={root} className="relative bg-cream" aria-labelledby="approach-title">
      <div data-pin="" className="paper-grain relative overflow-hidden lg:h-[100svh]">
        <div className="mx-auto grid h-full max-w-[1600px] gap-12 px-5 py-28 md:px-10 lg:grid-cols-12 lg:items-center lg:py-0">
          <div className="lg:col-span-6">
            <SectionLabel index={index}>Our approach</SectionLabel>
            <RevealText as="h2" id="approach-title" className="mt-8 max-w-xl font-serif text-[clamp(2.4rem,4.4vw,4.4rem)] font-light leading-[1] text-ink">
              How we <em className="text-rose-deep">work.</em>
            </RevealText>
            <div className="relative mt-14 hidden h-[clamp(5rem,7.4vw,8.6rem)] overflow-hidden lg:block" aria-hidden="true">
              {approach.map((a) => (
                <span key={a.step} data-word="" className="absolute inset-0 whitespace-nowrap font-serif text-[clamp(4.2rem,6.6vw,7.6rem)] font-light uppercase leading-[1.08] tracking-[-0.02em] text-ink">
                  {a.step}
                </span>
              ))}
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <svg viewBox="0 0 80 560" className="absolute -left-2 top-0 hidden h-[560px] w-20 overflow-visible lg:block" aria-hidden="true">
              <path data-stem="" d="M40 0 C 20 120, 60 180, 40 280 S 20 440, 40 560" fill="none" stroke="var(--color-mint-deep)" strokeWidth="1.6" strokeLinecap="round" />
              {[90, 230, 330, 470].map((y, i) => (
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
            <ol data-m-list="" className="relative space-y-12 max-lg:pl-10 lg:space-y-14 lg:pl-24">
              {/* Phones: a stem that grows down the steps, a bloom opening at each */}
              <span className="absolute bottom-2 left-3 top-2 w-px bg-ink/10 lg:hidden" aria-hidden="true">
                <span data-m-stem="" className="absolute inset-0 origin-top bg-gradient-to-b from-mint-deep via-rose to-coral" />
              </span>
              {approach.map((a) => (
                <li key={a.step} data-step="" className="relative grid grid-cols-[auto_1fr] gap-6">
                  <svg data-m-bloom="" viewBox="-14 -14 28 28" className="absolute -left-[2.35rem] top-1 size-6 lg:hidden" aria-hidden="true">
                    <Bloom r={11} />
                  </svg>
                  <span className="font-serif text-2xl italic text-rose">{a.index}</span>
                  <div>
                    <h3 className="font-serif text-3xl uppercase tracking-[0.04em] text-ink md:text-4xl">{a.step}</h3>
                    <p className="mt-3 max-w-md leading-relaxed text-stone">{a.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
