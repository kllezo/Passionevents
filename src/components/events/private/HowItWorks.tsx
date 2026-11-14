"use client";

import { useRef } from "react";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";
import { Bloom } from "../botanical/Sprig";

const steps = [
  { n: "01", title: "Tell us the occasion", text: "Who it is for, how many guests, the date and the feeling you want." },
  { n: "02", title: "We design the theme", text: "Colours, décor, food, entertainment and favours, planned as one idea." },
  { n: "03", title: "We style and host", text: "Our team sets up, runs the celebration and clears away afterwards." },
];

/** Three steps: a line draws across, big numbers spin up and blooms pop. */
export function HowItWorks() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const tl = gsap.timeline({ paused: true });
        tl.fromTo(q("[data-line]"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0)
          .fromTo(q("[data-bloom]"), { scale: 0, rotate: -180 }, { scale: 1, rotate: 0, duration: 0.9, stagger: 0.25, ease: "back.out(2.6)" }, 0.3)
          .fromTo(q("[data-num]"), { yPercent: 120, rotateX: -90, autoAlpha: 0 }, { yPercent: 0, rotateX: 0, autoAlpha: 1, duration: 1.1, stagger: 0.25, ease: "expo.out", transformPerspective: 600 }, 0.35)
          .fromTo(q("[data-copy]"), { autoAlpha: 0, y: 24, filter: "blur(8px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.25, ease: "expo.out" }, 0.5);
        return whenVisible(q("[data-steps]")[0], () => tl.play(), "0px 0px -15% 0px");
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="bg-ivory py-24 md:py-28" aria-labelledby="how-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <SectionLabel index="02">How it works</SectionLabel>
        <RevealText as="h2" id="how-title" className="mt-6 max-w-3xl font-serif text-[clamp(2.3rem,3.8vw,3.9rem)] font-light leading-[1] text-ink">
          You enjoy the party. <em className="text-rose-deep">We handle the rest.</em>
        </RevealText>
        <div data-steps="" className="relative mt-14">
          <span data-line="" aria-hidden="true" className="absolute left-0 right-0 top-4 hidden h-px origin-left bg-gradient-to-r from-rose via-coral to-mint md:block" />
          <ol className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((s) => (
              <li key={s.n} className="relative">
                <svg data-bloom="" viewBox="-14 -14 28 28" className="relative size-9 bg-ivory" aria-hidden="true">
                  <Bloom r={11} />
                </svg>
                <span className="mt-4 block overflow-hidden">
                  <span data-num="" className="block font-serif text-[clamp(4rem,7vw,7rem)] font-light italic leading-none text-rose-deep/80">{s.n}</span>
                </span>
                <div data-copy="">
                  <h3 className="mt-3 font-serif text-2xl text-ink md:text-3xl">{s.title}</h3>
                  <p className="mt-3 max-w-sm leading-relaxed text-stone">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
