"use client";

import { useRef } from "react";
import { serviceGroups } from "@/content/events";
import { Pic } from "@/components/shared/Pic";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";
import { EventsButton } from "../Button";

const themes = [
  { card: "bg-cream text-ink", chip: "border-ink/15 text-ink/80", num: "text-rose-deep", sub: "text-stone" },
  { card: "bg-[#f6e4e2] text-ink", chip: "border-ink/15 text-ink/80", num: "text-coral-deep", sub: "text-stone" },
  { card: "bg-ink text-ivory", chip: "border-ivory/25 text-ivory/85", num: "text-blush", sub: "text-ivory/65" },
  { card: "bg-[#e8f1ea] text-ink", chip: "border-ink/15 text-ink/80", num: "text-rose-deep", sub: "text-stone" },
];

/**
 * Capabilities as a deck of stacking cards: each service group slides up and
 * settles over the previous one, which sinks back and dims beneath it. The
 * photograph inside zooms into place and the services pop in one by one.
 * Built on CSS sticky (no pinning), so it stays smooth on every device.
 */
export function IndividualServices({ showIntro = true, index = "04" }: { showIntro?: boolean; index?: string }) {
  const root = useRef<HTMLElement>(null);
  const n = serviceGroups.length;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const cards = q<HTMLElement>("[data-cap-card]");
        const stops: (() => void)[] = [];
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (next) {
            // The card underneath sinks back as the next one covers it.
            // Sinking scale on desktop only: on phones the address bar
            // resizes the viewport mid-scroll and scrubbed scaling jitters.
            if (window.matchMedia("(min-width: 1024px)").matches) gsap.to(card.querySelector("[data-cap-inner]"), {
              scale: 0.9 + i * 0.008,
              ease: "none",
              scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
            });
            gsap.to(card.querySelector("[data-cap-shade]"), {
              opacity: 0.55,
              ease: "none",
              scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
            });
          }
          if (window.matchMedia("(min-width: 1024px)").matches) gsap.fromTo(card.querySelector("[data-cap-img]"), { scale: 1.35 }, { scale: 1, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top 25%", scrub: true } });
          else gsap.fromTo(card.querySelector("[data-cap-img]"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut", scrollTrigger: { trigger: card, start: "top 80%", once: true } });
          const chips = card.querySelectorAll("[data-cap-chip]");
          const head = card.querySelectorAll("[data-cap-head]");
          const tl = gsap
            .timeline({ paused: true })
            .fromTo(head, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.08, ease: "expo.out" }, 0)
            .fromTo(chips, { autoAlpha: 0, y: 18, scale: 0.85 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.07, ease: "back.out(2)" }, 0.25);
          stops.push(whenVisible(card, () => tl.play(), "0px 0px -30% 0px"));
        });
        return () => stops.forEach((s) => s());
      });
    },
    { scope: root, dependencies: [n] }
  );

  return (
    <section ref={root} className="relative bg-ivory py-28 [--cap-step:0.55rem] [--cap-top:4.5rem] md:py-32 md:[--cap-step:0.9rem] md:[--cap-top:6.5rem]" aria-labelledby="services-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        {showIntro && (
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SectionLabel index={index}>Our capabilities</SectionLabel>
              <RevealText as="h2" id="services-title" className="mt-8 font-serif text-[clamp(2.8rem,5.3vw,6rem)] font-light leading-[0.92] tracking-[-0.02em] text-ink">
                One team. <em className="text-rose-deep">Every detail.</em> Every experience.
              </RevealText>
            </div>
            <div className="grid gap-8 self-end sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
              <div className="border-t border-ink/15 pt-5">
                <p className="font-serif text-2xl italic text-ink">Book a single service</p>
                <p className="mt-2 text-stone">Only need décor, a photographer, a band or transport? Book exactly what you need.</p>
              </div>
              <div className="border-t border-ink/15 pt-5">
                <p className="font-serif text-2xl italic text-ink">Or hand us everything</p>
                <p className="mt-2 text-stone">Concept to close — every vendor, every guest, every cue managed by one team.</p>
              </div>
            </div>
          </div>
        )}
        {!showIntro && (
          <h2 id="services-title" className="sr-only">
            Services you can book
          </h2>
        )}

        <ol className="mt-14 md:mt-20" aria-label="Services you can book">
          {serviceGroups.map((g, i) => {
            const t = themes[i % themes.length];
            return (
              <li
                key={g.title}
                data-cap-card=""
                className="sticky h-[68svh] min-h-[440px] pb-[3svh] md:h-[62svh] md:min-h-[420px] md:pb-[5svh]"
                style={{ top: `calc(var(--cap-top) + ${i} * var(--cap-step))`, zIndex: i + 1 }}
              >
                <div
                  data-cap-inner=""
                  className={`relative grid h-full origin-top grid-rows-[auto_1fr] overflow-hidden rounded-[1.75rem] shadow-[0_-30px_80px_-50px_rgb(94_52_64/0.55)] md:grid-rows-1 md:grid-cols-12 md:rounded-[2rem] ${t.card}`}
                >
                  <div className="relative flex flex-col justify-between gap-5 p-6 md:col-span-6 md:gap-10 md:p-12 xl:p-16">
                    <div className="flex items-start justify-between gap-6">
                      <span className="block overflow-hidden">
                        <span data-cap-head="" className={`block font-serif text-[clamp(3.2rem,7.2vw,7.7rem)] font-light italic leading-[0.85] ${t.num}`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </span>
                      <span className={`mt-3 text-xs uppercase tracking-[0.28em] ${t.sub}`}>
                        {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <span className="block overflow-hidden pb-2">
                        <h3 data-cap-head="" className="font-serif text-[clamp(2rem,4.4vw,4.4rem)] leading-[0.98]">
                          {g.title}
                        </h3>
                      </span>
                      <ul className="mt-4 flex flex-wrap gap-2 md:mt-6">
                        {g.items.map((it) => (
                          <li key={it} data-cap-chip="" className={`rounded-full border px-3 py-1 text-xs md:px-4 md:py-1.5 md:text-sm ${t.chip}`}>
                            {it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="relative m-3 mt-0 min-h-0 overflow-hidden rounded-[1.25rem] md:col-span-6 md:m-4 md:ml-0 md:rounded-[1.5rem]">
                    <div data-cap-img="" className="absolute inset-0">
                      <Pic image={g.image} sizes="(max-width: 768px) 92vw, 46vw" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-ink/30 via-transparent to-transparent" />
                  </div>
                  <div data-cap-shade="" aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink opacity-0" />
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-16 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-stone">Also available: guest management, car rentals, anchors and anything else your event needs — just ask.</p>
          <EventsButton href="/services" variant="outline">
            All services
          </EventsButton>
        </div>
      </div>
    </section>
  );
}
