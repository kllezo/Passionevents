"use client";

import { useEffect, useRef, useState } from "react";
import { Pic } from "@/components/shared/Pic";
import { stock, type SiteImage } from "@/content/media";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { useCoverflow } from "@/motion/useCoverflow";
import { SectionLabel } from "../SectionLabel";
import { EventsButton } from "../Button";
import Link from "next/link";
import { ReelRail } from "@/components/shared/Reels";
import { InstagramIcon } from "@/components/shared/InstagramIcon";
import { reels } from "@/content/reels";
import { instagramUrl } from "@/content/proof";

/** The four things the studio brings together (from the statement itself). */
const pillars: { word: string; line: string; image: SiteImage }[] = [
  { word: "People", line: "Planners, vendors, artists and on-ground teams, coordinated as one.", image: stock.weddingHands },
  { word: "Creativity", line: "Concepts, décor, florals and themes designed around you.", image: stock.florals },
  { word: "Production", line: "Stages, sound, lighting and screens — built and run.", image: stock.stageDesign },
  { word: "Logistics", line: "Venues, travel, schedules and guests, handled end to end.", image: stock.venueHall },
];

/**
 * "The studio". The statement is set large and revealed line by line; below
 * it the four things it brings together — people, creativity, production and
 * logistics — stand as tall photograph panels. One panel is always open; they
 * take turns on their own while the section is in view, and hovering or
 * focusing one opens it. Everything plays once on entering view (no scrub),
 * so nothing can be left half-finished. Phones get a swipeable strip.
 */
export function BrandIntro() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const hovering = useRef(false);

  // Gentle auto-advance while visible and not being interacted with.
  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => {
      if (!hovering.current) setActive((a) => (a + 1) % pillars.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, [inView]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.desktop, () => {
        const panels = q<HTMLElement>("[data-panel]");
        const tl = gsap
          .timeline({ paused: true })
          .fromTo(panels, { clipPath: "inset(100% 0% 0% 0% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.4, stagger: 0.12, ease: "expo.inOut" }, 0)
          .fromTo(q("[data-panel-img]"), { scale: 1.35 }, { scale: 1, duration: 2, stagger: 0.12, ease: "expo.out" }, 0.2)
          .fromTo(q("[data-studio-foot] > *"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "expo.out" }, 0.9);
        return whenVisible(q("[data-panels]")[0], () => tl.play(), "0px 0px -15% 0px");
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-ivory py-28 md:py-40" aria-labelledby="intro-title">
      <div className="pointer-events-none absolute -right-40 top-10 size-[620px] rounded-full bg-blush/30 blur-[130px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 size-[520px] rounded-full bg-mint/20 blur-[130px]" />

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionLabel index="01">The studio</SectionLabel>
          <p className="hidden font-script text-5xl text-coral lg:block" aria-hidden="true">
            every detail
          </p>
        </div>
        <h2 id="intro-title" className="sr-only">
          About Passion Events
        </h2>

        <RevealText as="p" className="mt-10 max-w-[56rem] font-serif text-[clamp(2.2rem,4.2vw,4.4rem)] font-light leading-[1.08] tracking-[-0.01em] text-ink">
          Concept to execution — <em className="text-rose-deep">one team</em> for every memorable experience.
        </RevealText>
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-stone">
          {["Weddings", "Corporate", "Private", "Live concerts"].map((w, i) => (
            <span key={w} className="flex items-center gap-3">
              {i > 0 && <span className="size-1 rotate-45 bg-coral" aria-hidden="true" />}
              {w}
            </span>
          ))}
        </p>

        {/* Desktop: four expanding photograph panels */}
        <div data-panels="" className="mt-16 hidden h-[min(62svh,600px)] gap-3 lg:flex" onMouseLeave={() => (hovering.current = false)}>
          {pillars.map((p, i) => {
            const on = i === active;
            return (
              <button
                key={p.word}
                type="button"
                data-panel=""
                onMouseEnter={() => {
                  hovering.current = true;
                  setActive(i);
                }}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={on}
                aria-label={`${p.word}: ${p.line}`}
                className={`group relative min-w-0 basis-0 overflow-hidden rounded-[1.75rem] text-left text-ivory shadow-[0_40px_80px_-50px_rgb(94_52_64/0.7)] transition-[flex-grow] duration-[900ms] ease-[var(--ease-silk)] ${
                  on ? "grow-[3.2]" : "grow"
                }`}
              >
                <span data-panel-img="" className="absolute inset-0 block">
                  <Pic image={p.image} sizes="(max-width: 1600px) 50vw, 800px" className={`transition-transform duration-[1.6s] ease-[var(--ease-silk)] ${on ? "scale-100" : "scale-110"}`} />
                </span>
                <span className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${on ? "from-ink/80 via-ink/15 to-transparent" : "from-ink/75 via-ink/45 to-ink/30"}`} />
                <span className="absolute left-6 top-6 font-serif text-lg italic text-blush">{String(i + 1).padStart(2, "0")}</span>
                {/* timer hairline on the open panel */}
                <span className="absolute inset-x-6 top-[3.6rem] h-px overflow-hidden bg-ivory/20">
                  {on && <span key={`bar-${active}`} className="absolute inset-y-0 left-0 w-full origin-left animate-[studioBar_3.8s_linear_forwards] bg-blush" />}
                </span>
                <span className="absolute inset-x-6 bottom-6 block">
                  <span className={`block whitespace-nowrap font-serif font-light leading-none transition-[font-size] duration-700 ease-[var(--ease-silk)] ${on ? "text-[clamp(2.4rem,3.2vw,3.6rem)] italic" : "text-[clamp(1.4rem,1.6vw,1.8rem)]"}`}>
                    {p.word}
                  </span>
                  <span
                    className={`mt-3 block max-w-sm text-[0.95rem] leading-relaxed text-ivory/85 transition-[opacity,transform] duration-700 ease-[var(--ease-silk)] ${
                      on ? "translate-y-0 opacity-100 delay-200" : "translate-y-3 opacity-0"
                    }`}
                  >
                    {p.line}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Phones / tablets: swipeable pillars */}
        <MobilePillars />

        {/* Our own reels — real work, straight from Instagram */}
        <div className="mt-24 md:mt-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-rose-deep">Reels · behind the scenes</p>
              <h3 className="mt-4 font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-[1] text-ink">
                Watch us <em className="text-rose-deep">at work.</em>
              </h3>
            </div>
            <div className="flex items-center gap-6">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink">
                <InstagramIcon className="size-4" /> @passionevents.p
              </a>
              <Link href="/reels" className="link-underline text-xs font-semibold uppercase tracking-[0.2em] text-rose-deep">
                All reels →
              </Link>
            </div>
          </div>
          <ReelRail ids={reels.map((r) => r.id)} className="mt-10" label="Passion Events reels" />
        </div>

        <div data-studio-foot="" className="mt-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-lg leading-relaxed text-stone">
            Book one service, or hand us the whole event — from the first call to the last guest leaving.
          </p>
          <EventsButton href="/about" variant="outline">
            Our story
          </EventsButton>
        </div>
      </div>
    </section>
  );
}

function MobilePillars() {
  const strip = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useCoverflow(strip, { rotate: 12, scale: 0.1, dim: 0.4, onActive: setActive });
  return (
    <div className="lg:hidden">
      <div ref={strip} className="-mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[14vw] pb-4 [scrollbar-width:none] md:-mx-10 [&::-webkit-scrollbar]:hidden">
        {pillars.map((p, i) => (
          <article key={p.word} data-cf="" className="relative aspect-[3/4] w-[72vw] max-w-[340px] shrink-0 snap-center overflow-hidden rounded-[1.5rem] text-ivory shadow-[0_30px_60px_-35px_rgb(94_52_64/0.7)] will-change-transform">
            <Pic image={p.image} sizes="72vw" />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
            <span className="absolute left-5 top-5 font-serif text-lg italic text-blush">{String(i + 1).padStart(2, "0")}</span>
            <span className="absolute inset-x-5 bottom-5">
              <span className="block font-serif text-4xl font-light italic">{p.word}</span>
              <span className="mt-2 block text-sm text-ivory/85">{p.line}</span>
            </span>
          </article>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5" aria-hidden="true">
        {pillars.map((p, i) => (
          <span key={p.word} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-7 bg-rose-deep" : "w-2 bg-ink/15"}`} />
        ))}
      </div>
    </div>
  );
}
