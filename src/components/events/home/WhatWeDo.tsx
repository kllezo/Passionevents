"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Pic } from "@/components/shared/Pic";
import { services, type Service } from "@/content/services";
import { UniverseLink } from "@/components/shared/UniverseTransition";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";

/**
 * "Nine worlds. One team." — all nine services at once, every name always
 * visible. Desktop: three staggered columns (arches and frames alternating)
 * that drift gently against each other as the page scrolls. Phones and
 * tablets: a two-column grid. Each frame wipes open once, then the name rises.
 * Every tile opens its own service page (Concerts opens Passion Live).
 */
export function WhatWeDo() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const stops = q<HTMLElement>("[data-world]").map((tile) => {
          const delay = Number(tile.dataset.col ?? 0) * 0.12;
          const tl = gsap.timeline({ paused: true, delay });
          tl.fromTo(tile.querySelector("[data-frame]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" }, 0)
            .fromTo(tile.querySelector("[data-img]"), { scale: 1.22 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.15)
            .fromTo(tile.querySelectorAll("[data-rise]"), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.55);
          return whenVisible(tile, () => tl.play(), "0px 0px -10% 0px");
        });
        return () => stops.forEach((s) => s());
      });
      // Desktop only: the outer columns drift against the middle one.
      mm.add(media.desktop, () => {
        q<HTMLElement>("[data-drift]").forEach((col) => {
          const amt = Number(col.dataset.drift);
          gsap.fromTo(col, { yPercent: -amt }, { yPercent: amt, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
    },
    { scope: root }
  );

  const cols = [0, 1, 2].map((c) => services.filter((_, i) => i % 3 === c));

  return (
    <section ref={root} id="what-we-do" className="relative overflow-hidden bg-cream py-24 md:py-28" aria-labelledby="what-title">
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[900px] -translate-x-1/2 rounded-full bg-blush/25 blur-[170px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index="02">What we do</SectionLabel>
            <RevealText as="h2" id="what-title" className="mt-6 font-serif text-[clamp(2.5rem,4.4vw,4.6rem)] font-light leading-[0.95] tracking-[-0.02em] text-ink">
              Nine worlds. <em className="text-rose-deep">One team.</em>
            </RevealText>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-lg leading-relaxed text-stone">Not only a wedding planner. From boardrooms to ballrooms to concert stages, we plan, design and run every category.</p>
            <Link href="/what-we-do" className="link-underline mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink">
              All nine services <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Desktop: three staggered columns */}
        <div className="mt-16 hidden grid-cols-3 gap-6 lg:grid xl:gap-8">
          {cols.map((col, c) => (
            <div key={c} data-drift={c === 1 ? 0 : c === 0 ? 3 : -3} className={`flex flex-col gap-6 xl:gap-8 ${c === 1 ? "pt-24" : c === 2 ? "pt-10" : ""}`}>
              {col.map((s) => (
                <World key={s.key} s={s} col={c} shape={c === 1 ? "frame" : "arch"} />
              ))}
            </div>
          ))}
        </div>

        {/* Phones & tablets: two-column grid */}
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:hidden" aria-label="Our nine services">
          {services.map((s, i) => (
            <li key={s.key} className={i === services.length - 1 ? "col-span-2" : ""}>
              <World s={s} col={i % 2} shape={i === services.length - 1 ? "wide" : "frame"} compact />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function World({ s, col, shape, compact = false }: { s: Service; col: number; shape: "arch" | "frame" | "wide"; compact?: boolean }) {
  const live = Boolean(s.live);
  const label = live ? `${s.title}: enter Passion Live` : `${s.title}: discover more`;
  const frame =
    shape === "arch" ? "aspect-[3/4] rounded-t-[999px] rounded-b-[1.6rem]" : shape === "wide" ? "aspect-[16/10] rounded-[1.4rem]" : `${compact ? "aspect-[3/4]" : "aspect-[4/5]"} rounded-[1.4rem] md:rounded-[1.6rem]`;
  const inner = (
    <div data-world="" data-col={col} className="group relative">
      <div data-frame="" className={`relative overflow-hidden bg-blush/40 shadow-[0_40px_80px_-46px_rgb(94_52_64/0.75)] ${frame}`}>
        <div data-img="" className="absolute inset-0 transition-transform duration-[1.6s] ease-[var(--ease-silk)] group-hover:scale-[1.06]">
          <Pic image={s.image} alt="" sizes={compact ? "(max-width: 640px) 48vw, 45vw" : "(max-width: 1600px) 30vw, 480px"} />
        </div>
        <div className={`absolute inset-0 ${live ? "bg-gradient-to-t from-void/90 via-violet/25 to-transparent" : "bg-gradient-to-t from-ink/80 via-ink/20 to-transparent"}`} />
        <span className={`absolute font-serif italic text-ivory/90 ${compact ? "text-sm" : "text-lg"} ${shape === "arch" ? "left-1/2 top-10 -translate-x-1/2" : "left-4 top-4 md:left-6 md:top-6"}`}>{s.index}</span>
        {live && <span className="absolute right-4 top-4 rounded-full bg-black/50 px-2.5 py-1 font-grotesk text-[0.55rem] uppercase tracking-[0.2em] text-volt ring-1 ring-volt/40 backdrop-blur md:right-6 md:top-6">Passion Live</span>}
        <div className={`absolute inset-x-0 bottom-0 ${compact ? "p-3.5 sm:p-5" : "p-6 xl:p-7"}`}>
          <span className={`block font-script leading-none text-blush ${compact ? "text-2xl" : "text-4xl"}`}>
            <span className="block overflow-hidden pb-1">
              <span data-rise="" className="block">{s.script}</span>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-rise="" className={`block font-serif leading-[1.02] text-ivory ${compact ? "text-[1.15rem] sm:text-2xl" : "text-[clamp(1.6rem,2.1vw,2.3rem)]"}`}>
              {s.title}
            </span>
          </span>
          {!compact && (
            <span className="mt-3 grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[var(--ease-silk)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
              <span className="min-h-0 overflow-hidden">
                <span className="block max-w-xs text-sm leading-relaxed text-ivory/80">{s.short}</span>
                <span className="mt-3 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ivory">
                  {live ? "Enter Passion Live" : "Discover more"} <ArrowUpRight className="size-3.5" />
                </span>
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
  const cls = "block rounded-[1.6rem] outline-offset-4";
  return live ? (
    <UniverseLink href="/concerts" to="live" aria-label={label} className={cls}>
      {inner}
    </UniverseLink>
  ) : (
    <Link href={s.href} aria-label={label} className={cls}>
      {inner}
    </Link>
  );
}
