"use client";

import Link from "next/link";
import { useRef, type ReactNode, type RefObject } from "react";
import { ArrowUpRight } from "lucide-react";
import type { SiteImage } from "@/content/media";
import type { Service } from "@/content/services";
import { Pic } from "@/components/shared/Pic";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";

/**
 * One-shot entrance for a What-we-do section, plus optional parallax.
 *  [data-rise]  text and small parts that rise in
 *  [data-mask]  image frames that open with a clip-path wipe
 *  [data-zoom]  the picture inside a frame, which settles from a slight zoom
 *  [data-speed] drifts against the scroll (number = strength)
 * Plays when the section is really visible, so nothing can stay hidden.
 */
export function useSectionMotion(root: RefObject<HTMLElement | null>, extra?: (q: (s: string) => HTMLElement[]) => void | (() => void)) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el) as (s: string) => HTMLElement[];
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const rise = q("[data-rise]");
        const masks = q("[data-mask]");
        const zooms = q("[data-zoom]");
        gsap.set(rise, { y: 46, autoAlpha: 0 });
        gsap.set(masks, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(zooms, { scale: 1.18 });
        const tl = gsap
          .timeline({ paused: true })
          .to(rise, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.07, ease: "expo.out" }, 0)
          .to(masks, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, stagger: 0.11, ease: "expo.inOut", clearProps: "clipPath" }, 0.05)
          .to(zooms, { scale: 1, duration: 2.1, stagger: 0.11, ease: "expo.out" }, 0.25);
        const stop = whenVisible(el, () => tl.play(), "0px 0px -18% 0px");

        const drift = q("[data-speed]");
        if (drift.length) {
          gsap.fromTo(
            drift,
            { yPercent: (_i: number, t: HTMLElement) => Number(t.dataset.speed) * 6 },
            { yPercent: (_i: number, t: HTMLElement) => -Number(t.dataset.speed) * 6, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
          );
        }
        const cleanup = extra?.(q);
        return () => {
          stop();
          if (typeof cleanup === "function") cleanup();
        };
      });
    },
    { scope: root }
  );
}

/** A photograph that leads to the service's detail page. */
export function ServicePhoto({
  service,
  image,
  label,
  sizes,
  className = "",
  radius = "rounded-[1.6rem]",
  speed,
  tone = "light",
  priority,
}: {
  service: Service;
  image: SiteImage;
  label?: string;
  sizes: string;
  className?: string;
  radius?: string;
  speed?: number;
  tone?: "light" | "dark";
  priority?: boolean;
}) {
  return (
    <Link
      href={service.href}
      data-mask=""
      aria-label={`${service.title}${label ? ` — ${label}` : ""}: view details`}
      className={`group relative block overflow-hidden ${radius} ${tone === "dark" ? "bg-graphite" : "bg-cream"} outline-offset-4 ${className}`}
    >
      <span data-zoom="" className="absolute inset-0 block">
        <span data-speed={speed} className={`absolute block ${speed ? "inset-[-9%_0]" : "inset-0"}`}>
          <Pic image={image} sizes={sizes} tone={tone} preload={priority} className="transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.06]" />
        </span>
      </span>
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
      {label && (
        <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
          <span className="rounded-full bg-black/25 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] backdrop-blur-md">{label}</span>
          <span className="grid size-9 shrink-0 translate-y-1 place-items-center rounded-full bg-white text-black opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100">
            <ArrowUpRight className="size-4" />
          </span>
        </span>
      )}
    </Link>
  );
}

/** Index, two-line title, script word and intro for a section. */
export function SectionTitle({ service, tone = "light", align = "left", children }: { service: Service; tone?: "light" | "dark" | "live"; align?: "left" | "center"; children?: ReactNode }) {
  const dark = tone !== "light";
  const live = tone === "live";
  return (
    <div className={align === "center" ? "flex flex-col items-center text-center" : ""}>
      <p data-rise="" className={`flex items-center gap-4 text-[0.72rem] font-semibold uppercase tracking-[0.3em] ${live ? "text-volt" : dark ? "text-blush" : "text-rose-deep"}`}>
        <span className="font-serif text-lg italic tracking-normal">{service.index}</span>
        <span className={`h-px w-12 ${live ? "bg-volt/60" : dark ? "bg-blush/50" : "bg-rose/50"}`} />
        <span>of 09</span>
      </p>
      <h2 id={`${service.key}-title`} className={`relative mt-6 ${live ? "font-display uppercase leading-[0.86]" : "font-serif font-light leading-[0.9] tracking-[-0.02em]"} ${dark ? "text-ivory" : "text-ink"} ${live ? "text-[clamp(3rem,6.2vw,6.6rem)]" : "text-[clamp(3rem,7.4vw,7.6rem)]"}`}>
        <span data-rise="" className="block">
          {service.lines[0]}
        </span>
        <span data-rise="" className={`block ${live ? "text-volt" : "italic"} ${!live && !dark ? "text-rose-deep" : ""} ${!live && dark ? "text-blush" : ""}`}>
          {service.lines[1]}
          <span aria-hidden="true" className={`ml-[0.25em] inline-block -translate-y-[0.15em] font-script text-[0.42em] normal-case not-italic leading-none ${live ? "text-hot" : "text-coral"}`}>
            {service.script}
          </span>
        </span>
      </h2>
      <p data-rise="" className={`mt-8 max-w-xl text-lg leading-relaxed ${dark ? "text-ivory/75" : "text-ink/75"}`}>
        {service.short}
      </p>
      {children}
    </div>
  );
}

/** "What we handle" list. */
export function Handles({ service, tone = "light", columns = 1 }: { service: Service; tone?: "light" | "dark" | "live"; columns?: 1 | 2 }) {
  const dark = tone !== "light";
  return (
    <ul className={`mt-8 grid gap-x-8 ${columns === 2 ? "sm:grid-cols-2" : ""}`} aria-label={`What we handle — ${service.title}`}>
      {service.handles.map((h, i) => (
        <li key={h} data-rise="" className={`flex items-baseline gap-4 border-b py-3 ${dark ? "border-white/12 text-ivory/90" : "border-ink/10 text-ink"}`}>
          <span className={`font-serif text-sm italic ${tone === "live" ? "text-volt" : dark ? "text-blush" : "text-rose"}`}>{String(i + 1).padStart(2, "0")}</span>
          <span className="text-[1.02rem]">{h}</span>
        </li>
      ))}
    </ul>
  );
}

export function DetailsLink({ service, tone = "light", label }: { service: Service; tone?: "light" | "dark" | "live"; label?: string }) {
  const dark = tone !== "light";
  return (
    <Link
      data-rise=""
      href={service.href}
      className={`group mt-10 inline-flex items-center gap-3 whitespace-nowrap rounded-full py-3 pl-6 pr-3 text-xs font-semibold uppercase tracking-[0.22em] transition-colors duration-300 ${
        tone === "live" ? "bg-volt text-black hover:bg-white" : dark ? "bg-ivory text-ink hover:bg-blush" : "bg-ink text-ivory hover:bg-rose-deep"
      }`}
    >
      {label ?? `Explore ${service.title.toLowerCase()}`}
      <span className={`grid size-8 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-45 ${tone === "live" ? "bg-black text-volt" : dark ? "bg-ink text-ivory" : "bg-ivory text-ink"}`}>
        <ArrowUpRight className="size-4" />
      </span>
    </Link>
  );
}

/** Section shell: anchor id, spacing and the motion hook. */
export function SectionShell({ service, className = "", children, extra }: { service: Service; className?: string; children: ReactNode; extra?: Parameters<typeof useSectionMotion>[1] }) {
  const root = useRef<HTMLElement>(null);
  useSectionMotion(root, extra);
  return (
    <section ref={root} id={service.key} data-service-section={service.key} aria-labelledby={`${service.key}-title`} className={`relative scroll-mt-24 overflow-x-clip ${className}`}>
      {children}
    </section>
  );
}
