"use client";

import { useRef } from "react";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { ReelRail } from "@/components/shared/Reels";
import { EventsButton } from "./Button";
import { SprigGroup, Bloom } from "./botanical/Sprig";
import { buildSprig } from "./botanical/geometry";

const sprigL = buildSprig({ p0: { x: 20, y: 380 }, p1: { x: 110, y: 290 }, p2: { x: 40, y: 150 }, p3: { x: 160, y: 20 }, seed: 31, leafCount: 11, bloomCount: 4 });
const sprigR = buildSprig({ p0: { x: 180, y: 20 }, p1: { x: 80, y: 120 }, p2: { x: 170, y: 250 }, p3: { x: 40, y: 380 }, seed: 47, leafCount: 11, bloomCount: 4 });

/**
 * "Two founders, one promise." as a framed feature: a soft card with a faint
 * script watermark that drifts as you scroll, botanical sprigs that draw
 * themselves in on both sides, floating blooms, and the behind-the-scenes
 * reel tilted inside a slowly turning ring.
 */
export function PromiseBlock({ detailed }: { detailed: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const tl = gsap.timeline({ paused: true });
        tl.from(q(".bt-stem, .bt-twig"), { drawSVG: "0%", duration: 1.8, stagger: 0.04, ease: "power2.inOut" }, 0)
          .from(q(".bt-leaf"), { scale: 0, transformOrigin: "0% 50%", duration: 0.7, stagger: 0.03, ease: "back.out(2)" }, 0.5)
          .from(q(".bt-bloom"), { scale: 0, rotate: -90, transformOrigin: "50% 50%", duration: 0.8, stagger: 0.06, ease: "back.out(2.2)" }, 0.8)
          .fromTo(q("[data-reel]"), { rotate: -14, y: 60, autoAlpha: 0 }, { rotate: 4, y: 0, autoAlpha: 1, duration: 1.4, ease: "back.out(1.4)" }, 0.3)
          .fromTo(q("[data-p-fade]"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "expo.out" }, 0.5);
        const stop = whenVisible(root.current!, () => tl.play(), "0px 0px -15% 0px");
        gsap.fromTo(q("[data-watermark]"), { xPercent: 8 }, { xPercent: -8, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        return () => stop();
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative mt-20 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-cream via-ivory to-blush/30 px-6 py-14 ring-1 ring-rose/15 md:mt-24 md:px-14 md:py-20">
      <span data-watermark="" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-script text-[clamp(6rem,16vw,15rem)] leading-none text-rose/10">
        Ramya &amp; Tanush
      </span>
      <svg viewBox="0 0 200 400" className="pointer-events-none absolute -left-4 bottom-0 hidden h-[62%] w-auto opacity-90 lg:block" aria-hidden="true">
        <SprigGroup g={sprigL} strokeWidth={1.5} />
      </svg>
      <svg viewBox="0 0 200 400" className="pointer-events-none absolute -right-6 top-0 hidden h-[62%] w-auto opacity-90 lg:block" aria-hidden="true">
        <SprigGroup g={sprigR} strokeWidth={1.5} />
      </svg>
      {[["right-[6%] bottom-[10%]", 0], ["right-[38%] bottom-[8%]", 2.5], ["left-[52%] top-[10%]", 4]].map(([pos, d]) => (
        <svg key={String(pos)} viewBox="-20 -20 40 40" className={`pointer-events-none absolute hidden size-7 animate-float lg:block ${pos}`} style={{ animationDelay: `${d}s` }} aria-hidden="true">
          <Bloom r={14} tone={Number(d) > 2 ? "blush" : "coral"} />
        </svg>
      ))}

      <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="relative z-10 text-center lg:col-span-7 lg:pl-20 lg:text-left">
          <RevealText as="p" className="font-serif text-[clamp(2.2rem,4.2vw,4.2rem)] font-light italic leading-[1.05] text-ink">
            Two founders, <span className="text-rose-deep">one promise.</span>
          </RevealText>
          <p data-p-fade="" className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-stone lg:mx-0">
            The words written into our logo are the promise both founders keep. Whichever of them you meet first, you get one plan, one team and the same care from the first call to the last guest leaving.
          </p>
          {!detailed && (
            <div data-p-fade="" className="mt-9">
              <EventsButton href="/founders" variant="outline">
                Meet the founders
              </EventsButton>
            </div>
          )}
        </div>
        <div className="relative mx-auto grid place-items-center lg:col-span-4 lg:col-start-9">
          <svg viewBox="0 0 200 200" className="pointer-events-none absolute size-[min(78vw,330px)] animate-spin-slow" aria-hidden="true">
            <circle cx="100" cy="100" r="96" fill="none" stroke="var(--color-rose)" strokeOpacity="0.45" strokeWidth="0.6" strokeDasharray="2 6" />
          </svg>
          <div data-reel="" className="relative w-[min(56vw,210px)] rotate-[4deg] text-left">
            <ReelRail ids={["DXmBXWMkzwd"]} compact label="Founder behind-the-scenes reel" />
          </div>
        </div>
      </div>
    </div>
  );
}
