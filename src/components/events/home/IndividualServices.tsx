"use client";

import { useRef } from "react";
import { serviceGroups } from "@/content/events";
import { Pic } from "@/components/shared/Pic";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";
import { EventsButton } from "../Button";

/**
 * Capabilities as a vertical index. Each row: number, name, what it covers,
 * and a photograph (right on desktop, a thumbnail on phones). As a row
 * arrives its rule draws across, the name rises and the photo wipes open.
 * No sticky stacking, so it reads the same on every device.
 */
export function IndividualServices({ showIntro = true, index = "03" }: { showIntro?: boolean; index?: string }) {
  const root = useRef<HTMLElement>(null);
  const n = serviceGroups.length;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const stops = q<HTMLElement>("[data-cap]").map((row) => {
          const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
          tl.fromTo(row.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, 0)
            .fromTo(row.querySelectorAll("[data-rise]"), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.07 }, 0.15)
            .fromTo(row.querySelectorAll("[data-chip]"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.04 }, 0.35)
            .fromTo(row.querySelector("[data-photo]"), { clipPath: "inset(0% 100% 0% 0% round 1.25rem)" }, { clipPath: "inset(0% 0% 0% 0% round 1.25rem)", duration: 1.2, ease: "expo.inOut" }, 0.1)
            .fromTo(row.querySelector("[data-photo-img]"), { scale: 1.25 }, { scale: 1, duration: 1.6 }, 0.2);
          return whenVisible(row, () => tl.play(), "0px 0px -12% 0px");
        });
        return () => stops.forEach((s) => s());
      });
    },
    { scope: root, dependencies: [n] }
  );

  return (
    <section ref={root} className="relative bg-ivory py-24 md:py-28" aria-labelledby="services-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        {showIntro ? (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionLabel index={index}>Our capabilities</SectionLabel>
              <RevealText as="h2" id="services-title" className="mt-6 font-serif text-[clamp(2.4rem,4.2vw,4.4rem)] font-light leading-[0.95] tracking-[-0.02em] text-ink">
                One team. <em className="text-rose-deep">Every detail.</em>
              </RevealText>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-5">
              <div className="border-t border-ink/15 pt-4">
                <p className="font-serif text-xl italic text-ink">Book a single service</p>
                <p className="mt-1.5 text-[0.95rem] text-stone">Only need décor, a photographer, a band or transport? Book exactly what you need.</p>
              </div>
              <div className="border-t border-ink/15 pt-4">
                <p className="font-serif text-xl italic text-ink">Or hand us everything</p>
                <p className="mt-1.5 text-[0.95rem] text-stone">Concept to close: every vendor, every guest, every cue managed by one team.</p>
              </div>
            </div>
          </div>
        ) : (
          <h2 id="services-title" className="sr-only">
            Services you can book
          </h2>
        )}

        <ol className="mt-12 md:mt-16" aria-label="Services you can book">
          {serviceGroups.map((g, i) => (
            <li key={g.title} data-cap="" className="group relative">
              <span data-rule="" aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-ink/15" />
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 sm:gap-6 md:grid-cols-12 md:gap-8 md:py-7">
                <span className="block overflow-hidden md:col-span-1">
                  <span data-rise="" className="block font-serif text-2xl italic text-rose-deep md:text-4xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
                <div className="min-w-0 md:col-span-6 lg:col-span-6">
                  <span className="block overflow-hidden pb-1">
                    <h3 data-rise="" className="font-serif text-[1.45rem] leading-tight text-ink transition-colors duration-500 group-hover:text-rose-deep sm:text-3xl md:text-[clamp(2rem,2.8vw,3rem)]">
                      {g.title}
                    </h3>
                  </span>
                  <ul className="mt-2.5 flex flex-wrap gap-1.5 md:mt-4 md:gap-2">
                    {g.items.map((it) => (
                      <li key={it} data-chip="" className="rounded-full border border-ink/15 px-2.5 py-0.5 text-[0.72rem] text-ink/75 md:px-3.5 md:py-1 md:text-sm">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <div data-photo="" className="relative size-20 shrink-0 overflow-hidden rounded-[1rem] bg-cream sm:size-28 md:col-span-5 md:aspect-[16/7] md:size-auto md:w-full md:rounded-[1.25rem] lg:col-span-4 lg:col-start-9">
                  <div data-photo-img="" className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.07]">
                    <Pic image={g.image} sizes="(max-width: 768px) 112px, 34vw" />
                  </div>
                </div>
              </div>
            </li>
          ))}
          <li aria-hidden="true" className="h-px bg-ink/15" />
        </ol>

        <div className="mt-12 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-stone">Also available: guest management, car rentals, anchors and anything else your event needs. Just ask.</p>
          <EventsButton href="/services" variant="outline">
            All services
          </EventsButton>
        </div>
      </div>
    </section>
  );
}
