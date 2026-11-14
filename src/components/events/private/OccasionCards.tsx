"use client";

import { useRef } from "react";
import { privateOccasions } from "@/content/categoryStories";
import { gsap, useGSAP, media, isTouchScreen } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";

const CONFETTI = ["#f29c8f", "#ebc3c8", "#f2d6a2", "#bfe3d4", "#d7c7ef", "#f18a68"];

/**
 * The occasions as invitation cards.
 * Desktop: the section pins and scrolling glides the cards past in a curved
 * 3D row; the card in the centre swings forward, grows, lights up and fires
 * a small confetti burst the first time it arrives.
 * Phones/tablets: each card flips in from the side in 3D, then tilts gently
 * with the scroll.
 */
export function OccasionCards() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();

      mm.add(media.desktop, () => {
        const track = q<HTMLElement>("[data-track]")[0];
        const cards = q<HTMLElement>("[data-invite]");
        const burst = new Set<number>();
        const dist = () => track.scrollWidth - window.innerWidth;
        // Per-frame filters on photo cards stutter on iOS; touch screens skip them.
        const tint = !isTouchScreen();
        const place = () => {
          const mid = window.innerWidth / 2;
          cards.forEach((c, i) => {
            const r = c.getBoundingClientRect();
            const d = gsap.utils.clamp(-1.6, 1.6, (r.left + r.width / 2 - mid) / (window.innerWidth * 0.42));
            const a = Math.abs(d);
            gsap.set(c, { rotateY: d * -38, z: -a * 260, scale: 1 - a * 0.12, ...(tint ? { filter: `saturate(${1 - a * 0.35}) brightness(${1 - a * 0.12})` } : {}) });
            c.style.zIndex = String(100 - Math.round(a * 20));
            if (a < 0.12 && !burst.has(i)) {
              burst.add(i);
              const bits = c.querySelectorAll<HTMLElement>("[data-bit]");
              gsap.fromTo(bits, { x: 0, y: 0, rotate: 0, autoAlpha: 1, scale: 1 }, { x: () => gsap.utils.random(-220, 220), y: () => gsap.utils.random(-260, 60), rotate: () => gsap.utils.random(-540, 540), scale: () => gsap.utils.random(0.5, 1.3), autoAlpha: 0, duration: 1.6, ease: "power3.out", stagger: 0.006 });
              gsap.fromTo(c.querySelector("[data-script]"), { scale: 0.6, rotate: -14 }, { scale: 1, rotate: 0, duration: 1.1, ease: "elastic.out(1, 0.4)" });
            }
          });
        };
        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: () => `+=${dist() * 1.1}`, pin: true, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: place, onRefresh: place },
        });
        place();
        return () => gsap.set(cards, { clearProps: "transform,filter,zIndex" });
      });

      mm.add(media.mobile, () => {
        q<HTMLElement>("[data-invite]").forEach((c, i) => {
          gsap.fromTo(c, { rotateY: i % 2 ? -85 : 85, autoAlpha: 0, transformPerspective: 900 }, { rotateY: 0, autoAlpha: 1, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: c, start: "top 88%", once: true } });
          gsap.fromTo(c, { rotateZ: i % 2 ? 2.5 : -2.5 }, { rotateZ: i % 2 ? -1.5 : 1.5, ease: "none", scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
    },
    { scope: root, eager: true }
  );

  return (
    <section ref={root} id="occasions" className="relative scroll-mt-20 bg-cream" aria-labelledby="occasions-title">
      <div data-pin="" className="relative overflow-hidden py-24 md:py-28 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0">
        <div className="mx-auto w-full max-w-[1600px] px-5 md:px-10">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionLabel index="01">The occasions</SectionLabel>
              <RevealText as="h2" id="occasions-title" className="mt-5 font-serif text-[clamp(2.4rem,4.2vw,4.4rem)] font-light leading-[0.95] text-ink">
                Every reason <em className="text-rose-deep">to celebrate.</em>
              </RevealText>
            </div>
            <p className="max-w-md text-lg leading-relaxed text-stone lg:col-span-4 lg:col-start-9">Small and personal or big and loud, styled to the people being celebrated.</p>
          </div>
        </div>

        <div className="mt-10 [perspective:1600px] lg:mt-12">
          <ul data-track="" className="grid grid-cols-1 gap-4 px-5 sm:grid-cols-2 sm:gap-5 md:px-10 lg:flex lg:w-max lg:gap-8 lg:px-[30vw] lg:[transform-style:preserve-3d]">
            {privateOccasions.map((o, i) => (
              <li key={o.title} className="lg:w-[clamp(18rem,26vw,26rem)]">
                <article
                  data-invite=""
                  className="relative flex min-h-[14rem] flex-col justify-between overflow-visible rounded-[1.6rem] p-6 shadow-[0_40px_80px_-40px_rgb(94_52_64/0.75)] sm:min-h-[17rem] sm:p-8 lg:h-[min(28rem,58svh)] lg:p-10"
                  style={{ background: o.hue }}
                >
                  <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[1.1rem] border border-dashed border-ink/20" />
                  <span className="relative font-serif text-sm italic text-ink/60">{String(i + 1).padStart(2, "0")} / 06</span>
                  <div className="relative">
                    <p data-script="" className="font-script text-4xl leading-none text-rose-deep sm:text-5xl lg:text-6xl">{o.script}</p>
                    <h3 className="mt-3 font-serif text-2xl leading-tight text-ink sm:text-3xl lg:text-4xl">{o.title}</h3>
                    <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed text-ink/70">{o.text}</p>
                  </div>
                  <span className="pointer-events-none absolute left-1/2 top-1/2 hidden lg:block" aria-hidden="true">
                    {Array.from({ length: 22 }, (_, k) => (
                      <span key={k} data-bit="" className="absolute block opacity-0" style={{ width: k % 3 ? 8 : 5, height: k % 3 ? 4 : 10, borderRadius: k % 4 === 0 ? 999 : 2, background: CONFETTI[(k + i) % CONFETTI.length] }} />
                    ))}
                  </span>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
