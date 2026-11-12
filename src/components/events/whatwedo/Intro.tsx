"use client";

import { useEffect, useRef, useState } from "react";
import { services } from "@/content/services";
import { Pic } from "@/components/shared/Pic";
import { useLenis } from "@/motion/SmoothScroll";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { Bloom } from "../botanical/Sprig";

const chip: Record<string, string> = {
  weddings: "Weddings",
  corporate: "Corporate",
  concerts: "Concerts",
  college: "College fests",
  private: "Private",
  destination: "Destination",
  artists: "Artists",
  production: "Production",
  complete: "Full management",
};

const go = (lenis: ReturnType<typeof useLenis>, id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -20, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", `#${id}`);
};

/** Page opener: the title, and the nine services as an index you can jump from. */
export function WhatWeDoIntro() {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [hover, setHover] = useState(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        gsap
          .timeline({ delay: 0.2 })
          .from(q("[data-hero-line]"), { yPercent: 110, duration: 1.3, stagger: 0.1, ease: "expo.out" })
          .from(q("[data-hero-fade]"), { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.4)
          .from(q("[data-index-row]"), { autoAlpha: 0, y: 30, duration: 0.9, stagger: 0.05, ease: "expo.out" }, 0.55)
          .from(q("[data-hero-bloom]"), { scale: 0, rotate: -120, duration: 1.4, stagger: 0.15, ease: "back.out(1.8)" }, 0.5);
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-ivory pb-24 pt-36 md:pb-32 md:pt-44" aria-labelledby="wwd-title">
      <div className="pointer-events-none absolute -right-40 top-20 size-[700px] rounded-full bg-blush/30 blur-[140px]" />
      <svg data-hero-bloom="" viewBox="-30 -30 60 60" aria-hidden="true" className="pointer-events-none absolute right-[8%] top-32 size-16 md:size-24">
        <Bloom r={24} />
      </svg>
      <svg data-hero-bloom="" viewBox="-30 -30 60 60" aria-hidden="true" className="pointer-events-none absolute right-[22%] top-56 size-8 md:size-12">
        <Bloom r={24} tone="blush" />
      </svg>
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <p data-hero-fade="" className="eyebrow text-rose-deep">
          What we do · nine services, one team
        </p>
        <h1 id="wwd-title" className="mt-8 font-serif text-[clamp(3.6rem,11vw,12rem)] font-light leading-[0.86] tracking-[-0.03em] text-ink">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-hero-line="" className="block">
              Every kind of
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-hero-line="" className="block italic text-rose-deep">
              celebration.
            </span>
          </span>
        </h1>
        <p data-hero-fade="" className="mt-8 max-w-2xl text-xl leading-relaxed text-ink/75">
          Weddings to concerts, boardrooms to campus stages — A to Z event services from Hyderabad, across Andhra Pradesh, Telangana and beyond. Pick a world, or scroll through all nine.
        </p>

        <div className="mt-16 grid gap-10 grid-cols-1 lg:grid-cols-12 lg:items-center">
          <ol className="lg:col-span-7" aria-label="The nine services">
            {services.map((s, i) => (
              <li key={s.key} data-index-row="">
                <a
                  href={`#${s.key}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(lenis, s.key);
                  }}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  className="group flex items-baseline gap-5 border-b border-ink/10 py-3.5"
                >
                  <span className="font-serif text-sm italic text-rose">{s.index}</span>
                  <span className={`font-serif text-[clamp(1.6rem,2.8vw,2.6rem)] font-light leading-none transition-[color,transform] duration-500 group-hover:translate-x-2 ${hover === i ? "text-ink" : "text-ink/55"}`}>{s.title}</span>
                  <span className="ml-auto hidden font-script text-3xl text-coral opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block">{s.script}</span>
                </a>
              </li>
            ))}
          </ol>
          <div data-hero-fade="" className="relative hidden aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] lg:col-span-4 lg:col-start-9 lg:block">
            {services.map((s, i) => (
              <div key={s.key} className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-silk)] ${hover === i ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}>
                <Pic image={s.image} sizes="32vw" preload={i === 0} />
              </div>
            ))}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-6 pt-20">
              <p className="font-serif text-3xl text-ivory">{services[hover].title}</p>
              <p className="mt-1 text-sm text-ivory/80">{services[hover].short}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Where-am-I index for the nine sections: a slim vertical rail on desktop,
 * a sticky chip bar on phones. Follows the section in view.
 */
export function SectionIndex() {
  const lenis = useLenis();
  const [active, setActive] = useState<string | null>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = services.map((s) => document.getElementById(s.key)).filter((e): e is HTMLElement => Boolean(e));
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (seen) setActive(seen.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.01] }
    );
    els.forEach((e) => io.observe(e));
    // hide the index again above the first section / below the last
    const first = els[0];
    const last = els[els.length - 1];
    const onScroll = () => {
      if (!first || !last) return;
      const y = window.innerHeight / 2;
      if (first.getBoundingClientRect().top > y || last.getBoundingClientRect().bottom < y) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // keep the active chip visible on phones
  useEffect(() => {
    if (!active || !bar.current) return;
    const chip = bar.current.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (chip) bar.current.scrollTo({ left: chip.offsetLeft - 20, behavior: "smooth" });
  }, [active]);

  const visible = active !== null;

  return (
    <>
      <nav aria-label="What we do sections" className={`fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 transition-[opacity,transform] duration-500 min-[1760px]:block ${visible ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-4 opacity-0"}`}>
        <ol className="flex flex-col gap-1.5 rounded-full bg-ivory/80 p-2 shadow-[0_20px_50px_-25px_rgb(23_19_17/0.4)] ring-1 ring-ink/5 backdrop-blur-md">
          {services.map((s) => {
            const on = active === s.key;
            return (
              <li key={s.key}>
                <a
                  href={`#${s.key}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(lenis, s.key);
                  }}
                  aria-current={on ? "true" : undefined}
                  className="group relative grid size-9 place-items-center rounded-full"
                >
                  <span className={`font-serif text-xs italic transition-colors ${on ? "text-ivory" : "text-ink/60 group-hover:text-ink"}`}>{s.index}</span>
                  <span className={`absolute inset-0 -z-10 rounded-full bg-ink transition-transform duration-500 ${on ? "scale-100" : "scale-0"}`} />
                  <span className="pointer-events-none absolute left-12 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{s.title}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className={`sticky top-0 z-40 -mb-[52px] transition-opacity duration-300 min-[1760px]:hidden ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!visible}>
        <div ref={bar} className="flex gap-2 overflow-x-auto bg-ivory/85 px-4 py-2.5 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {services.map((s) => (
            <a
              key={s.key}
              data-chip={s.key}
              href={`#${s.key}`}
              tabIndex={visible ? undefined : -1}
              onClick={(e) => {
                e.preventDefault();
                go(lenis, s.key);
              }}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-colors ${active === s.key ? "bg-ink text-ivory" : "bg-cream text-ink/70"}`}
            >
              {s.index} {chip[s.key]}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
