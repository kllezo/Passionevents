"use client";

import { Pic } from "@/components/shared/Pic";
import Link from "next/link";
import { useRef, useState } from "react";
import { useCoverflow } from "@/motion/useCoverflow";
import { ArrowUpRight } from "lucide-react";
import { services as categories } from "@/content/services";
import { UniverseLink } from "@/components/shared/UniverseTransition";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";

const STEP = 24; // degrees between cards on the wheel

/**
 * "Wheel of worlds": on desktop the eight services ride a giant rotating
 * wheel. Scrolling turns it; the card at the top grows into focus while its
 * title, story and services roll in beneath. Transforms only, so it stays
 * smooth. Tablet/mobile get an editorial column with reveal-on-scroll cards.
 */
export function WhatWeDo() {
  const root = useRef<HTMLElement>(null);
  const n = categories.length;

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(media.desktop, () => {
        const wheel = q<HTMLElement>("[data-wheel]")[0];
        const spokes = q<HTMLElement>("[data-spoke]");
        const cards = q<HTMLElement>("[data-wheel-card]");
        const details = q<HTMLElement>("[data-detail]");
        const digits = q<HTMLElement>("[data-digit-track]")[0];
        let active = -1;

        const layout = () => {
          const radius = window.innerHeight * 1.25;
          gsap.set(wheel, { y: radius });
          spokes.forEach((s, i) => gsap.set(s, { rotate: i * STEP, y: 0, transformOrigin: "50% 50%" }));
          cards.forEach((c) => gsap.set(c, { y: -radius }));
        };
        layout();

        // State-based: every call hides all other worlds' details, so fast jumps,
        // reverse scrolling or a re-measure can never leave two showing.
        // One "active" marker; CSS rolls the lines in and out. Exactly one
        // world's details can show at a time, whatever the scroll speed.
        const show = (i: number) => {
          if (i === active) return;
          active = i;
          details.forEach((d, j) => d.toggleAttribute("data-on", j === i));
          gsap.to(digits, { yPercent: (-100 / n) * i, duration: 0.8, ease: "expo.inOut", overwrite: true });
        };

        const render = (p: number) => {
          const pos = p * (n - 1);
          gsap.set(wheel, { rotate: -pos * STEP });
          cards.forEach((c, i) => {
            const d = Math.abs(i - pos);
            gsap.set(c, {
              scale: 1 - Math.min(d, 2) * 0.16,
              opacity: 1 - gsap.utils.clamp(0, 1, (d - 1) / 0.4),
              "--dim": Math.min(d, 1.5) * 0.4,
            });
            // spokes are separate stacking contexts, so depth order is set on them
            spokes[i].style.zIndex = String(100 - Math.round(d * 10));
          });
          show(Math.round(pos));
        };
        render(0);

        gsap.to(q("[data-progress]"), {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: `+=${(n - 1) * 32}%`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              layout();
              render(self.progress);
            },
            onUpdate: (self) => render(self.progress),
          },
        });
        // Entrance: the wheel rises and spins into place the first time it is seen.
        const intro = gsap.fromTo(q("[data-wheel-rise]"), { yPercent: 40, rotate: 30, autoAlpha: 0 }, { yPercent: 0, rotate: 0, autoAlpha: 1, duration: 1.8, ease: "expo.out", paused: true });
        const stop = whenVisible(q("[data-pin]")[0], () => intro.play(), "0px 0px -20% 0px");
        return () => {
          stop();
          details.forEach((d, j) => d.toggleAttribute("data-on", j === 0));
        };
      });

      mm.add(media.mobile, () => {
        // The strip arrives from the right the first time it is seen.
        const cards = q<HTMLElement>("[data-cf] > a");
        const t = gsap.fromTo(cards, { x: 160, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.3, stagger: 0.08, ease: "expo.out", paused: true });
        return whenVisible(cards[0], () => t.play(), "0px 0px -15% 0px");
      });
    },
    { scope: root, dependencies: [n], eager: true }
  );

  return (
    <section ref={root} className="relative bg-cream" aria-labelledby="what-title" id="what-we-do">
      {/* Desktop: wheel of worlds */}
      <div data-pin="" className="relative hidden h-[100svh] overflow-hidden lg:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_50%_45%,rgb(235_195_200/0.55),transparent_70%)]" />
        <div className="absolute left-10 top-1/2 z-[200] max-w-[22vw] -translate-y-1/2">
          <SectionLabel index="02">What we do</SectionLabel>
          <h2 id="what-title" className="mt-6 font-serif text-[clamp(2.6rem,3.5vw,4.1rem)] font-light leading-[0.95] tracking-[-0.02em] text-ink">
            Eight worlds. <em className="text-rose-deep">One team.</em>
          </h2>
          <p className="mt-5 max-w-sm text-[0.97rem] leading-relaxed text-stone">
            Not only a wedding planner — from boardrooms to ballrooms to concert stages, we plan, design and run every category.
          </p>
        </div>

        {/* Counter */}
        <div className="absolute right-10 top-28 z-[200] flex items-start gap-3 font-serif text-ink xl:top-32" aria-hidden="true">
          <span className="block h-[1em] overflow-hidden text-[clamp(3rem,4vw,4.7rem)] font-light leading-none">
            <span data-digit-track="" className="block">
              {categories.map((c) => (
                <span key={c.key} className="block h-[1em]">
                  {c.index}
                </span>
              ))}
            </span>
          </span>
          <span className="mt-2 text-lg italic text-stone">/ {String(n).padStart(2, "0")}</span>
        </div>

        {/* The wheel */}
        <div data-wheel-rise="" className="absolute inset-0">
          <div data-wheel="" className="absolute left-[62%] top-[42%] size-0">
            {/* rims of the wheel (radius = 125vh, matching the JS layout) */}
            <span className="pointer-events-none absolute left-0 top-0 size-[250vh] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-rose/45" />
            <span className="pointer-events-none absolute left-0 top-0 size-[calc(250vh-62svh)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blush/70" />
            {categories.map((c) => (
              <div key={c.key} data-spoke="" className="absolute left-0 top-0 size-0">
                <div data-wheel-card="" className="absolute left-0 top-0 size-0">
                  <div className="absolute aspect-[3/4] h-[46svh] -translate-x-1/2 -translate-y-1/2">
                    <CardLink live={Boolean(c.live)} href={c.href} label={`${c.title} — discover more`} tabIndex={-1}>
                      <div className="group relative h-full w-full overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] border-[5px] border-ivory bg-blush shadow-[0_50px_90px_-40px_rgb(94_52_64/0.7)]">
                        <Pic image={c.image} sizes="(max-width: 1600px) 30vw, 420px" className="transition-transform duration-[1.6s] ease-[var(--ease-silk)] group-hover:scale-[1.06]" />
                        <div className={`absolute inset-0 ${Boolean(c.live) ? "bg-gradient-to-t from-void/80 via-violet/20 to-transparent" : "bg-gradient-to-t from-ink/55 via-transparent to-transparent"}`} />
                        <div className="absolute inset-0 bg-ivory [opacity:var(--dim,0)]" />
                        <span aria-hidden="true" className="absolute bottom-4 right-5 font-script text-5xl text-ivory/95">{c.script}</span>
                      </div>
                    </CardLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active category details */}
        <div className="absolute bottom-[7%] left-[62%] z-[200] h-[25svh] w-[min(42rem,56vw)] -translate-x-1/2 px-6 text-center">
          {categories.map((c) => (
            <div key={c.key} data-detail="" data-on={c.key === categories[0].key ? "" : undefined} className="wheel-detail absolute inset-0 flex flex-col items-center">
              <span className="block overflow-hidden pb-1">
                <h3 data-roll="" className="whitespace-nowrap font-serif text-[clamp(2rem,3vw,3.4rem)] leading-none text-ink">
                  {c.title}
                </h3>
              </span>
              <span className="mt-3 block overflow-hidden">
                <p data-roll="" className="max-w-xl text-[0.97rem] leading-relaxed text-stone">
                  {c.short}
                </p>
              </span>
              <span className="mt-4 block overflow-hidden pb-1">
                <ul data-roll="" className="flex flex-wrap justify-center gap-2">
                  {c.handles.slice(0, 4).map((s) => (
                    <li key={s} className="rounded-full border border-ink/15 bg-ivory/60 px-3 py-1 text-xs text-ink/75">
                      {s}
                    </li>
                  ))}
                </ul>
              </span>
              <span className="mt-4 block overflow-hidden pb-1">
                <span data-roll="" className="block">
                  <CardLink live={Boolean(c.live)} href={c.href} label={`${c.title} — discover more`} className="link-underline inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink">
                    {Boolean(c.live) ? "Enter Passion Live" : "Discover more"} <ArrowUpRight className="size-4" />
                  </CardLink>
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-10 bottom-6 z-[200] h-px bg-ink/10">
          <div data-progress="" className="h-full origin-left scale-x-0 bg-gradient-to-r from-rose via-coral to-mint" />
        </div>
      </div>

      {/* Tablet / mobile: swipeable coverflow of worlds */}
      <MobileWorlds />
    </section>
  );
}

function MobileWorlds() {
  const strip = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useCoverflow(strip, { rotate: 14, scale: 0.12, dim: 0.5, onActive: setActive });

  return (
    <div className="relative overflow-hidden py-24 lg:hidden">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-[60%] bg-[radial-gradient(60%_50%_at_50%_40%,rgb(235_195_200/0.6),transparent_70%)]" />
      <div className="relative px-5 md:px-10">
        <SectionLabel index="02">What we do</SectionLabel>
        <RevealText as="h2" className="mt-6 font-serif text-[clamp(2.9rem,9vw,4.4rem)] font-light leading-[0.92] tracking-[-0.02em] text-ink">
          Eight worlds. <em className="text-rose-deep">One team.</em>
        </RevealText>
        <p className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-stone">
          Not only a wedding planner — from boardrooms to ballrooms to concert stages, we plan, design and run every category.
        </p>
      </div>

      <div className="relative mt-10 flex items-end justify-between px-5 md:px-10" aria-hidden="true">
        <span className="font-serif text-5xl font-light italic text-ink">{categories[active].index}</span>
        <span className="mb-2 flex gap-1.5">
          {categories.map((c, i) => (
            <span key={c.key} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-7 bg-rose-deep" : "w-2 bg-ink/15"}`} />
          ))}
        </span>
      </div>

      <div ref={strip} className="relative mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[12vw] pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => {
          const live = Boolean(c.live);
          return (
            <article key={c.key} data-cf="" className="w-[76vw] max-w-[380px] shrink-0 snap-center will-change-transform">
              <CardLink live={live} href={c.href} className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] border-[5px] border-ivory shadow-[0_40px_70px_-40px_rgb(94_52_64/0.7)]">
                  <Pic image={c.image} sizes="76vw" />
                  <div className={`absolute inset-0 ${live ? "bg-gradient-to-t from-void/85 via-violet/20 to-transparent" : "bg-gradient-to-t from-ink/85 via-ink/30 via-45% to-transparent"}`} />
                  <span aria-hidden="true" className="absolute right-5 top-[20%] font-script text-4xl text-ivory/95">{c.script}</span>
                  <span className="absolute inset-x-5 bottom-5">
                    <span className="block font-serif text-3xl leading-tight text-ivory">{c.title}</span>
                    <span className="mt-1 block text-sm text-ivory/80">{c.short}</span>
                  </span>
                </div>
              </CardLink>
            </article>
          );
        })}
      </div>

      {/* Details of the centred world */}
      <div className="relative mt-6 min-h-[10rem] px-5 md:px-10" aria-live="polite">
        {categories.map((c, i) => (
          <div key={c.key} className={`absolute inset-x-5 top-0 transition-[opacity,transform] duration-500 md:inset-x-10 ${i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`} aria-hidden={i !== active}>
            <ul className="flex flex-wrap gap-2">
              {c.handles.slice(0, 4).map((s) => (
                <li key={s} className="rounded-full border border-ink/12 bg-ivory/70 px-3 py-1 text-xs text-ink/75">
                  {s}
                </li>
              ))}
            </ul>
            <CardLink live={Boolean(c.live)} href={c.href} label={`${c.title} — discover more`} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink" tabIndex={i === active ? undefined : -1}>
              {Boolean(c.live) ? "Enter Passion Live" : "Discover more"} <ArrowUpRight className="size-4" />
            </CardLink>
          </div>
        ))}
      </div>
      <p className="relative mt-2 px-5 text-[0.65rem] uppercase tracking-[0.3em] text-stone md:px-10">Swipe to explore →</p>
    </div>
  );
}

function CardLink({
  live,
  href,
  label,
  className = "block h-full w-full",
  tabIndex,
  children,
}: {
  live: boolean;
  href: string;
  label?: string;
  className?: string;
  tabIndex?: number;
  children: React.ReactNode;
}) {
  return live ? (
    <UniverseLink href="/concerts" to="live" className={className} aria-label={label} tabIndex={tabIndex}>
      {children}
    </UniverseLink>
  ) : (
    <Link href={href} className={className} aria-label={label} tabIndex={tabIndex}>
      {children}
    </Link>
  );
}
