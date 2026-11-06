"use client";

import { Pic } from "@/components/shared/Pic";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { categories, type Category } from "@/content/events";
import { UniverseLink } from "@/components/shared/UniverseTransition";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "../SectionLabel";
import { Bloom } from "../botanical/Sprig";

/**
 * Six worlds told horizontally: vertical scroll drives a pinned track on
 * desktop; on tablet/mobile the same cards stack as an editorial column.
 */
export function WhatWeDo() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(media.desktop, () => {
        const track = q("[data-track]")[0] as HTMLElement;
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-pin]")[0],
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.9,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.to(q("[data-progress]"), {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: () => `+=${distance()}`, scrub: true },
        });
        q<HTMLElement>("[data-card]").forEach((card) => {
          const img = card.querySelector("[data-card-img]");
          gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
          gsap.from(card.querySelector("[data-card-media]"), {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 1.4,
            ease: "expo.inOut",
            scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 85%", once: true },
          });
        });
      });
      mm.add(media.mobile, () => {
        q<HTMLElement>("[data-card-media]").forEach((m) =>
          gsap.from(m, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: m, start: "top 85%", once: true } })
        );
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-cream" aria-labelledby="what-title" id="what-we-do">
      <div data-pin="" className="relative overflow-hidden lg:h-[100svh]">
        <div data-track="" className="flex flex-col gap-16 px-5 py-28 md:px-10 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-[4vw] lg:py-0 lg:pl-10 lg:pr-[10vw]">
          {/* Intro panel */}
          <div className="flex shrink-0 flex-col justify-center lg:w-[34vw]">
            <SectionLabel index="03">What we do</SectionLabel>
            <RevealText as="h2" id="what-title" className="mt-8 font-serif text-[clamp(3rem,6vw,6.4rem)] font-light leading-[0.92] tracking-[-0.02em] text-ink">
              Six worlds. <em className="text-rose-deep">One team.</em>
            </RevealText>
            <RevealText as="p" className="mt-8 max-w-md text-lg leading-relaxed text-stone">
              Passion Events is not only a wedding planner. From boardrooms to ballrooms to concert stages — we plan, design and run events across every category.
            </RevealText>
            <p className="eyebrow mt-10 hidden items-center gap-3 text-stone lg:flex">
              Keep scrolling <span className="inline-block h-px w-16 bg-stone/50" /> →
            </p>
          </div>

          {categories.map((c) => (
            <CategoryCard key={c.key} c={c} />
          ))}
        </div>

        <div className="absolute inset-x-10 bottom-10 hidden h-px bg-ink/10 lg:block">
          <div data-progress="" className="h-full origin-left scale-x-0 bg-rose" />
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ c }: { c: Category }) {
  const live = c.key === "concerts";

  return (
    <article data-card="" className="group relative shrink-0 lg:w-[38vw] xl:w-[34vw]">
      <CardLink live={live} href={c.href} label={`${c.title} — discover more`}>
        <div className="relative">
          <div data-card-media="" className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] lg:aspect-auto lg:h-[min(52svh,560px)]">
            <div data-card-img="" className="absolute inset-[0_-10%] transition-transform duration-[1.6s] ease-[var(--ease-silk)] group-hover:scale-[1.06]">
              <Pic image={c.image} sizes="(max-width: 1024px) 92vw, 36vw" className="" />
            </div>
            <div className={`absolute inset-0 ${live ? "bg-gradient-to-t from-void/80 via-violet/20 to-transparent" : "bg-gradient-to-t from-ink/60 via-transparent to-transparent"}`} />
            <span className="absolute left-6 top-[18%] font-serif text-7xl font-light italic text-ivory/90 md:text-8xl">{c.index}</span>
            <span className="absolute bottom-5 right-6 font-script text-5xl text-ivory/95 transition-transform duration-1000 ease-[var(--ease-silk)] group-hover:-translate-y-2 md:text-6xl">
              {c.script}
            </span>
          </div>
          {/* animated border */}
          <span className="pointer-events-none absolute inset-0 rounded-t-[999px] rounded-b-[1.5rem] border border-rose/0 transition-all duration-700 group-hover:inset-[-10px] group-hover:border-rose/60" />
          {/* botanical detail */}
          <svg viewBox="-20 -20 40 40" className="pointer-events-none absolute -right-3 top-[14%] size-12 scale-0 transition-transform duration-700 ease-[var(--ease-silk)] group-hover:scale-100 group-hover:rotate-45" aria-hidden="true">
            <Bloom r={14} />
          </svg>
        </div>

        <div className="mt-7 transition-transform duration-700 ease-[var(--ease-silk)] group-hover:translate-x-2">
          <h3 className="font-serif text-4xl leading-none text-ink md:text-5xl">{c.title}</h3>
          <p className="mt-4 max-w-md text-[0.97rem] leading-relaxed text-stone">{c.description}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {c.services.slice(0, 4).map((s) => (
              <li key={s} className="rounded-full border border-ink/12 px-3 py-1 text-xs text-ink/75">
                {s}
              </li>
            ))}
          </ul>
          <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink lg:translate-y-2 lg:opacity-0 lg:transition-all lg:duration-700 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
            {live ? "Enter Passion Live" : "Discover more"} <ArrowUpRight className="size-4" />
          </span>
        </div>
      </CardLink>
    </article>
  );
}

function CardLink({ live, href, label, children }: { live: boolean; href: string; label: string; children: React.ReactNode }) {
  return live ? (
    <UniverseLink href={href} to="live" className="block" data-cursor="Enter Live" aria-label={label}>
      {children}
    </UniverseLink>
  ) : (
    <Link href={href} className="block" data-cursor="Discover" aria-label={label}>
      {children}
    </Link>
  );
}
