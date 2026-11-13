"use client";

import { useRef } from "react";
import { privateOccasions } from "@/content/categoryStories";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";

/**
 * The occasions as invitation cards. They flip up into place one after
 * another when the grid comes into view; on hover a card lifts and tilts
 * like a card picked up from a table.
 */
export function OccasionCards() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const cards = q<HTMLElement>("[data-invite]");
        gsap.set(cards, { transformPerspective: 900 });
        const tl = gsap.timeline({ paused: true });
        tl.fromTo(cards, { rotateX: -75, y: 60, autoAlpha: 0, transformOrigin: "50% 100%" }, { rotateX: 0, y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.09, ease: "expo.out" });
        return whenVisible(q("[data-invites]")[0], () => tl.play(), "0px 0px -12% 0px");
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="occasions" className="relative scroll-mt-20 bg-cream py-24 md:py-28" aria-labelledby="occasions-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="01">The occasions</SectionLabel>
            <RevealText as="h2" id="occasions-title" className="mt-6 font-serif text-[clamp(2.4rem,4.2vw,4.4rem)] font-light leading-[0.95] text-ink">
              Every reason <em className="text-rose-deep">to celebrate.</em>
            </RevealText>
          </div>
          <p className="max-w-md text-lg leading-relaxed text-stone lg:col-span-4 lg:col-start-9">Small and personal or big and loud, styled to the people being celebrated.</p>
        </div>

        <ul data-invites="" className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {privateOccasions.map((o, i) => (
            <li key={o.title}>
              <article
                data-invite=""
                className="group relative flex h-full min-h-[13.5rem] flex-col justify-between overflow-hidden rounded-[1.4rem] p-5 shadow-[0_30px_60px_-40px_rgb(94_52_64/0.7)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-silk)] hover:-translate-y-2 hover:rotate-[-1.2deg] hover:shadow-[0_40px_80px_-40px_rgb(94_52_64/0.85)] sm:min-h-[16rem] sm:p-7 lg:min-h-[19rem] lg:p-9"
                style={{ background: o.hue }}
              >
                {/* inner deckle border, like a printed invitation */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-2.5 rounded-[1rem] border border-dashed border-ink/20 sm:inset-3.5" />
                <span className="relative font-serif text-sm italic text-ink/60">{String(i + 1).padStart(2, "0")}</span>
                <div className="relative">
                  <p className="font-script text-[1.7rem] leading-none text-rose-deep transition-transform duration-500 group-hover:-rotate-3 sm:text-4xl lg:text-5xl">{o.script}</p>
                  <h3 className="mt-2 font-serif text-[1.3rem] leading-tight text-ink sm:text-3xl">{o.title}</h3>
                  <p className="mt-2 text-[0.82rem] leading-snug text-ink/70 sm:text-[0.95rem] sm:leading-relaxed">{o.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
