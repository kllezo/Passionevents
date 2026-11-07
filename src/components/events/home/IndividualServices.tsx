"use client";

import { useState } from "react";
import { serviceGroups } from "@/content/events";
import { Pic } from "@/components/shared/Pic";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";
import { EventsButton } from "../Button";

/**
 * Capability index. Hovering, focusing or tapping a row swaps the large
 * photograph in the sticky panel; nothing follows the pointer.
 */
export function IndividualServices({ showIntro = true, index = "04" }: { showIntro?: boolean; index?: string }) {
  const [active, setActive] = useState(0);
  const current = serviceGroups[active];

  return (
    <section className="relative bg-ivory py-28 md:py-40" aria-labelledby="services-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        {showIntro && (
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SectionLabel index={index}>Our capabilities</SectionLabel>
              <RevealText as="h2" id="services-title" className="mt-8 font-serif text-[clamp(2.8rem,6.6vw,7rem)] font-light leading-[0.92] tracking-[-0.02em] text-ink">
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

        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          <ul className="border-t border-ink/15 lg:col-span-7" aria-label="Services you can book">
            {serviceGroups.map((g, i) => {
              const on = i === active;
              return (
                <li key={g.title} className="border-b border-ink/15">
                  <button
                    type="button"
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className="group grid w-full grid-cols-[2.5rem_1fr] items-baseline gap-x-4 py-6 text-left md:py-7"
                  >
                    <span className={`font-serif text-lg italic transition-colors ${on ? "text-coral-deep" : "text-rose-deep"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      <span
                        className={`block font-serif text-[clamp(1.7rem,3vw,2.9rem)] leading-tight transition-all duration-700 ease-[var(--ease-silk)] ${
                          on ? "translate-x-2 italic text-rose-deep" : "text-ink group-hover:translate-x-1"
                        }`}
                      >
                        {g.title}
                      </span>
                      <span className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease-silk)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                        <span className="overflow-hidden">
                          <span className="mt-3 flex flex-wrap gap-2 pb-1">
                            {g.items.map((it) => (
                              <span key={it} className="rounded-full border border-ink/15 px-3 py-1 text-[0.82rem] text-ink/80">
                                {it}
                              </span>
                            ))}
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-cream shadow-[0_40px_90px_-50px_rgb(148_96_108/0.6)] max-lg:hidden">
                {serviceGroups.map((g, i) => (
                  <div
                    key={g.title}
                    className={`absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[var(--ease-silk)] ${i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"}`}
                    aria-hidden={i !== active}
                  >
                    <Pic image={g.image} sizes="(max-width: 1024px) 0px, 40vw" />
                  </div>
                ))}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-7 pt-24">
                  <p className="eyebrow text-blush">Now viewing</p>
                  <p className="mt-2 font-serif text-3xl text-ivory">{current.title}</p>
                </div>
              </div>
              <p className="mt-6 text-stone">
                Also available: guest management, car rentals, anchors and anything else your event needs — just ask.
              </p>
              <div className="mt-6">
                <EventsButton href="/services" variant="outline">
                  All services
                </EventsButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
