"use client";

import { useRef } from "react";
import { approach, whyUs } from "@/content/events";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";
import { Bloom } from "../botanical/Sprig";

/**
 * Capabilities & execution: the five stages every event goes through
 * (conceptualise → plan → design → produce → execute) on one line, then the
 * seven things clients can count on, as a single horizontal sequence.
 * No pinning — it reads in one or two screens.
 */
export function Approach({ index = "04" }: { index?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        // When the stages come into view the stem draws all the way across
        // once and each bloom opens as the line reaches it, then the stage
        // names rise. Plays to the end, so it can never stop half-drawn.
        const nodes = q<SVGGElement>("[data-node]");
        const tl = gsap.timeline({ paused: true });
        tl.fromTo(q("[data-stem]"), { drawSVG: "0%" }, { drawSVG: "100%", ease: "power2.inOut", duration: 1.8 }, 0);
        nodes.forEach((n, i) => {
          tl.fromTo(n, { scale: 0, rotate: -90, transformOrigin: "50% 50%" }, { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(2.2)" }, 0.15 + (i / Math.max(1, nodes.length - 1)) * 1.45);
        });
        tl.fromTo(q("[data-stage]"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "expo.out" }, 0.2);
        const stopStages = whenVisible(q("[data-stages]")[0], () => tl.play(), "0px 0px -15% 0px");
        // The seven promises arrive once, left to right.
        const items = q<HTMLElement>("[data-promise]");
        gsap.set(items, { autoAlpha: 0, y: 18 });
        const stop = whenVisible(q("[data-promises]")[0], () => gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "expo.out" }), "0px 0px -15% 0px");
        return () => {
          stop();
          stopStages();
        };
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="paper-grain relative overflow-hidden bg-cream py-24 md:py-28" aria-labelledby="approach-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index={index}>How we work</SectionLabel>
            <RevealText as="h2" id="approach-title" className="mt-6 font-serif text-[clamp(2.3rem,3.8vw,3.9rem)] font-light leading-[1.02] text-ink">
              From first idea <em className="text-rose-deep">to the final applause.</em>
            </RevealText>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-stone lg:col-span-4 lg:col-start-9">
            Every event moves through the same five stages, whether it is a dinner for twelve or a concert for thousands.
          </p>
        </div>

        {/* Five stages on one botanical line */}
        <div data-stages="" className="relative mt-14 md:mt-16">
          <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="absolute left-0 right-0 top-[18px] hidden h-10 w-full overflow-visible md:block" aria-hidden="true">
            <path data-stem="" d="M0 20 C 120 4, 220 36, 330 20 S 560 4, 670 20 S 880 36, 1000 20" fill="none" stroke="var(--color-mint-deep)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          </svg>
          <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-5 md:gap-6">
            {approach.map((a) => (
              <li key={a.step} data-stage="" className="relative max-md:border-l max-md:border-ink/10 max-md:pl-6">
                <svg viewBox="-14 -14 28 28" className="mb-5 size-9 max-md:absolute max-md:-left-[1.15rem] max-md:top-0 max-md:size-8 max-md:bg-cream" aria-hidden="true">
                  <g data-node="">
                    <Bloom r={11} />
                  </g>
                </svg>
                <p className="font-serif text-sm italic text-rose-deep">{a.index}</p>
                <h3 className="mt-1 font-serif text-[1.65rem] uppercase leading-tight tracking-[0.03em] text-ink lg:text-[1.85rem]">{a.step}</h3>
                <p className="mt-3 max-w-[18rem] text-[0.95rem] leading-relaxed text-stone">{a.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Seven things you can count on: one horizontal sequence */}
        <div className="mt-16 border-t border-ink/10 pt-10 md:mt-20">
          <p className="eyebrow text-rose-deep">What you can count on</p>
          <ol
            data-promises=""
            className="-mx-5 mt-6 flex snap-x snap-mandatory gap-0 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
            aria-label="What you can count on"
          >
            {whyUs.map((w, i) => (
              <li
                key={w.title}
                data-promise=""
                className="w-[min(68vw,15rem)] shrink-0 snap-start border-l border-ink/12 px-5 first:border-l-0 first:pl-0 lg:w-auto lg:px-4 xl:px-5"
              >
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
