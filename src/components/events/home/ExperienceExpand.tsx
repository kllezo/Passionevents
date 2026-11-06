"use client";

import Image from "next/image";
import { useRef } from "react";
import { stock } from "@/content/media";
import { site } from "@/lib/site";
import { gsap, useGSAP, media } from "@/motion/gsap";

/**
 * Cinematic section transition: a framed photograph expands from a small
 * arch to the full viewport while the "50+ events executed" figure rises.
 */
export function ExperienceExpand() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top top", end: "+=140%", scrub: 0.8, pin: q("[data-pin]")[0], anticipatePin: 1 },
        });
        tl.fromTo(
          q("[data-frame]"),
          { clipPath: "inset(22% 34% 22% 34% round 999px 999px 24px 24px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", ease: "power2.inOut", duration: 1 }
        )
          .fromTo(q("[data-frame-img]"), { scale: 1.3 }, { scale: 1, ease: "none", duration: 1 }, 0)
          .fromTo(q("[data-veil]"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.45)
          .from(q("[data-figure]"), { yPercent: 40, autoAlpha: 0, duration: 0.5, ease: "power3.out" }, 0.55)
          .from(q("[data-side]"), { autoAlpha: 0, y: 30, duration: 0.4, stagger: 0.08 }, 0.7)
          .to(q("[data-ghost]"), { xPercent: -30, ease: "none", duration: 1 }, 0);
        // The figure counts up with the scroll itself.
        const counter = q("[data-count]")[0] as HTMLElement;
        const n = { v: 0 };
        tl.fromTo(
          n,
          { v: 0 },
          {
            v: site.eventsExecuted,
            duration: 0.4,
            ease: "power1.out",
            onUpdate: () => {
              counter.textContent = `${Math.round(n.v)}+`;
            },
          },
          0.55
        );
        return () => {
          counter.textContent = `${site.eventsExecuted}+`;
        };
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-ivory" aria-labelledby="experience-title">
      <div data-pin="" className="relative h-[100svh] overflow-hidden">
        <p data-ghost="" aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-[22vw] italic leading-none text-blush/40">
          celebrations · celebrations
        </p>
        <div data-frame="" className="absolute inset-0 overflow-hidden" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
          <div data-frame-img="" className="absolute inset-0">
            <Image src={stock.longTable.src} alt={stock.longTable.alt} fill sizes="100vw" className="object-cover" />
          </div>
          <div data-veil="" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-ink/10" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-24">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div data-figure="" className="lg:col-span-7">
              <p className="eyebrow mb-4 text-ivory/80">(02) Experience</p>
              <h2 id="experience-title" className="font-serif font-light leading-[0.85] text-ivory">
                <span data-count="" className="block text-[clamp(7rem,22vw,20rem)] tracking-[-0.04em]">
                  {site.eventsExecuted}+
                </span>
                <span className="mt-2 block text-[clamp(1.6rem,3.4vw,3.2rem)] italic">events executed</span>
              </h2>
            </div>
            <div className="space-y-6 text-ivory/85 lg:col-span-5 lg:pb-6">
              <p data-side="" className="text-lg leading-relaxed md:text-xl">
                Each one planned with the same promise that is written into our logo — big or small, we make it special.
              </p>
              <p data-side="" className="eyebrow text-blush">Weddings · Corporate · Private · Destination · Live</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
