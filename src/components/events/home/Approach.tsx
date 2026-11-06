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
        gsap.set(steps.slice(1), { opacity: 0.22 });
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
            .to(steps[i - 1], { opacity: 0.22, duration: 0.4 }, at)
            .to(steps[i], { opacity: 1, duration: 0.4 }, at)
            .to(blooms[i], { scale: 1, rotate: 72, duration: 0.5, ease: "back.out(2)" }, at);
        }
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
              How a celebration <em className="text-rose-deep">comes to life.</em>
            </RevealText>
            <div className="relative mt-14 hidden h-[clamp(6rem,13vw,13rem)] overflow-hidden lg:block" aria-hidden="true">
              {approach.map((a) => (
                <span key={a.step} data-word="" className="absolute inset-0 font-serif text-[clamp(6rem,13vw,13rem)] font-light uppercase leading-[0.9] tracking-[-0.03em] text-ink">
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
            <ol className="space-y-12 lg:space-y-14 lg:pl-24">
              {approach.map((a) => (
                <li key={a.step} data-step="" className="grid grid-cols-[auto_1fr] gap-6">
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
