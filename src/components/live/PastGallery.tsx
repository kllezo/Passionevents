"use client";

import Link from "next/link";
import { useRef } from "react";
import type { PublicEvent } from "@/lib/events";
import { MediaImage } from "@/components/shared/MediaImage";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { liveDateParts } from "@/lib/event-format";

/**
 * Past experiences as a pinned horizontal reel (desktop) built from published
 * past LIVE events and their uploaded galleries — genuine photos only.
 */
export function PastGallery({ events }: { events: PublicEvent[] }) {
  const root = useRef<HTMLDivElement>(null);
  const frames = events.flatMap((e) => {
    const imgs = [e.coverUrl, e.posterUrl, ...e.media.map((m) => m.url)].filter(Boolean) as string[];
    return imgs.slice(0, 4).map((src, k) => ({ e, src, k, alt: e.media.find((m) => m.url === src)?.alt || `${e.title} — live` }));
  });

  useGSAP(
    () => {
      if (frames.length < 3) return;
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.desktop, () => {
        const track = q("[data-reel]")[0] as HTMLElement;
        const dist = () => track.scrollWidth - window.innerWidth + 80;
        const tween = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
        });
        q<HTMLElement>("[data-frame]").forEach((f) =>
          gsap.fromTo(f.querySelector("[data-img]"), { scale: 1.25 }, { scale: 1, ease: "none", scrollTrigger: { trigger: f, containerAnimation: tween, start: "left right", end: "center center", scrub: true } })
        );
      });
    },
    { scope: root, dependencies: [frames.length] }
  );

  if (events.length === 0) {
    return (
      <div className="mx-auto max-w-[1700px] px-5 md:px-10">
        <div className="grid gap-8 border border-dashed border-white/15 p-10 md:grid-cols-2 md:items-center md:p-16">
          <h3 className="font-display text-5xl uppercase leading-[0.9] text-white md:text-7xl">
            The archive <span className="text-outline-volt">opens</span> soon.
          </h3>
          <p className="text-fog">
            Photographs and films from Passion Live nights will be published here — real crowds, real stages, real moments. No stand-ins.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={root} className="relative overflow-hidden lg:flex lg:h-[100svh] lg:items-center">
      <div data-reel="" className="flex gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:px-10 lg:w-max lg:overflow-visible lg:pb-0">
        {frames.map(({ e, src, k, alt }, i) => {
          const d = liveDateParts(e.startsAt);
          return (
            <Link
              key={`${e.id}-${k}`}
              href={`/concerts/events/${e.slug}`}
              data-frame=""
              data-cursor="Relive"
              className={`group relative block shrink-0 overflow-hidden ${i % 3 === 1 ? "h-[52vh] w-[70vw] lg:h-[62vh] lg:w-[30vw]" : "h-[52vh] w-[80vw] lg:h-[74vh] lg:w-[44vw]"}`}
            >
              <div data-img="" className="absolute inset-0">
                <MediaImage src={src} alt={alt} fill sizes="(max-width: 1024px) 80vw, 44vw" className="object-cover grayscale-[40%] transition-all duration-700 group-hover:grayscale-0" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <p className="font-display text-3xl uppercase leading-none text-white md:text-4xl">{e.title}</p>
                {d && <p className="shrink-0 font-grotesk text-xs tracking-[0.25em] text-volt">{`${d.month} ${d.year}`}</p>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
