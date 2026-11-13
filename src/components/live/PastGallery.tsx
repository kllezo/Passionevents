"use client";

import Link from "next/link";
import { useRef } from "react";
import type { PublicEvent } from "@/lib/events";
import { MediaImage } from "@/components/shared/MediaImage";
import { gsap, useGSAP, media } from "@/motion/gsap";
import { liveDateParts, artistList } from "@/lib/event-format";
import { EVENT_STATUS_LABEL, type EventStatus } from "@/lib/constants";
import { whenVisible } from "@/motion/gsap";

/**
 * Past experiences as a pinned horizontal reel (desktop) built from published
 * past LIVE events and their uploaded galleries — genuine photos only.
 */
export function PastGallery({ events }: { events: PublicEvent[] }) {
  const root = useRef<HTMLDivElement>(null);
  // Shows without uploaded photos still appear, as typographic poster frames.
  const frames = events.flatMap((e) => {
    const imgs = [e.coverUrl, e.posterUrl, ...e.media.map((m) => m.url)].filter(Boolean) as string[];
    if (imgs.length === 0) return [{ e, src: null as string | null, k: 0, alt: e.title }];
    return imgs.slice(0, 4).map((src, k) => ({ e, src: src as string | null, k, alt: e.media.find((m) => m.url === src)?.alt || `${e.title} — live` }));
  });
  const pinned = frames.length >= 3;

  useGSAP(
    () => {
      if (pinned) return;
      const q = gsap.utils.selector(root.current);
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const tickets = q<HTMLElement>("[data-ticket]");
        if (!tickets.length) return;
        const tl = gsap
          .timeline({ paused: true })
          .fromTo(q("[data-frame]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut", stagger: 0.12 }, 0)
          .fromTo(tickets, { x: 120, rotate: 6, autoAlpha: 0 }, { x: 0, rotate: 0, autoAlpha: 1, duration: 1, ease: "back.out(1.6)", stagger: 0.12 }, 0.3)
          .fromTo(q("[data-stub]"), { rotate: 0 }, { rotate: 8, duration: 0.35, ease: "power2.out", yoyo: true, repeat: 1, stagger: 0.12, clearProps: "transform" }, 1.0);
        return whenVisible(root.current!, () => tl.play(), "0px 0px -20% 0px");
      });
    },
    { scope: root, dependencies: [pinned] }
  );

  useGSAP(
    () => {
      if (!pinned) return;
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

  const frameEls = frames.map(({ e, src, k, alt }, i) => {
    const d = liveDateParts(e.startsAt);
    return (
      <Link
        key={`${e.id}-${k}`}
        href={`/concerts/events/${e.slug}`}
        data-frame=""
        className={`group relative block shrink-0 overflow-hidden ${
          pinned
            ? i % 3 === 1
              ? "h-[52vh] w-[70vw] lg:h-[62vh] lg:w-[30vw]"
              : "h-[52vh] w-[80vw] lg:h-[74vh] lg:w-[44vw]"
            : frames.length === 1
              ? "h-[52vh] w-full lg:h-[64vh]"
              : "h-[52vh] w-[80vw] sm:w-[60vw] lg:h-[60vh] lg:w-[48%]"
        }`}
      >
        <div data-img="" className="absolute inset-0">
          {src ? (
            <MediaImage src={src} alt={alt} fill sizes="(max-width: 1024px) 80vw, 44vw" className="object-cover grayscale-[40%] transition-all duration-700 group-hover:grayscale-0" />
          ) : (
            <div className="live-grid-bg absolute inset-0 bg-[radial-gradient(70%_70%_at_30%_20%,rgb(255_46_136/0.35),transparent_60%),radial-gradient(60%_60%_at_80%_90%,rgb(139_92_255/0.4),transparent_60%)] bg-graphite">
              <span className="absolute left-5 top-5 border border-white/20 px-2.5 py-1 font-grotesk text-[0.62rem] uppercase tracking-[0.25em] text-white/70">
                {[e.venue, e.city].filter(Boolean).join(" · ") || "Passion Live"}
              </span>
              <span className="absolute inset-x-5 top-1/2 -translate-y-1/2 font-display text-[clamp(2.6rem,4vw,4rem)] uppercase leading-[0.9] text-white/90 transition-transform duration-700 group-hover:scale-[1.03]">
                {e.artists || e.title}
              </span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent" />
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
          <p className="font-display text-3xl uppercase leading-none text-white md:text-4xl">{e.title}</p>
          {d && <p className="shrink-0 font-grotesk text-xs tracking-[0.25em] text-volt">{`${d.month} ${d.year}`}</p>}
        </div>
      </Link>
    );
  });

  if (pinned) {
    return (
      <div ref={root} className="relative overflow-hidden lg:flex lg:h-[100svh] lg:items-center">
        <div data-reel="" className="flex gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:px-10 lg:w-max lg:overflow-visible lg:pb-0">
          {frameEls}
        </div>
      </div>
    );
  }

  // One or two shows so far: the photographs beside a stack of torn ticket stubs.
  return (
    <div ref={root} className="mx-auto grid max-w-[1700px] grid-cols-1 gap-8 overflow-x-clip px-5 md:px-10 lg:grid-cols-12 lg:items-center">
      <div className="flex min-w-0 gap-5 overflow-x-auto pb-2 [scrollbar-width:none] lg:col-span-7 lg:overflow-visible">{frameEls}</div>
      <ol className="min-w-0 space-y-5 lg:col-span-5" aria-label="Past shows">
        {events.map((e) => (
          <li key={e.id}>
            <TicketStub e={e} />
          </li>
        ))}
        <li className="pt-2 font-grotesk text-xs uppercase tracking-[0.3em] text-white/40">More nights are being added to the archive.</li>
      </ol>
    </div>
  );
}

/** A past show as a concert ticket — perforated, with a stub that tears on hover. */
function TicketStub({ e }: { e: PublicEvent }) {
  const d = liveDateParts(e.startsAt);
  const artists = artistList(e);
  const status = EVENT_STATUS_LABEL[e.eventStatus as EventStatus] ?? "Completed";
  return (
    <Link
      href={`/concerts/events/${e.slug}`}
      data-ticket=""
      className="group relative flex overflow-visible text-black [filter:drop-shadow(0_24px_40px_rgb(0_0_0/0.6))]"
    >
      <span
        className="relative min-w-0 flex-1 bg-[linear-gradient(120deg,#c6ff3d,#ff5a1f_55%,#ff2e88)] p-5 sm:p-6 [mask:radial-gradient(circle_12px_at_100%_50%,transparent_11px,#000_12px)] md:p-7"
      >
        <span className="block font-grotesk text-[0.62rem] font-bold uppercase tracking-[0.3em] opacity-70">Passion Live · {status}</span>
        <span className="mt-3 block break-words font-display text-[clamp(1.8rem,3.2vw,3.2rem)] uppercase leading-[0.9]">{e.title}</span>
        {artists.length > 0 && <span className="mt-2 block font-grotesk text-sm font-semibold uppercase tracking-[0.18em]">{artists.join(" · ")}</span>}
        <span className="mt-5 flex flex-wrap gap-x-6 gap-y-1 font-grotesk text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
          {(e.venue || e.city) && <span>{[e.venue, e.city].filter(Boolean).join(" · ")}</span>}
          {d && <span>{`${d.day} ${d.month} ${d.year}`}</span>}
        </span>
      </span>
      <span
        data-stub=""
        className="relative grid w-16 shrink-0 origin-bottom-left sm:w-20 place-items-center border-l-2 border-dashed border-black/40 bg-[#ff2e88] transition-transform duration-500 ease-out [mask:radial-gradient(circle_12px_at_0%_50%,transparent_11px,#000_12px)] group-hover:rotate-[9deg] md:w-24"
        aria-hidden="true"
      >
        <span className="rotate-90 whitespace-nowrap font-display text-lg uppercase tracking-[0.15em] sm:text-xl">Admit one</span>
      </span>
    </Link>
  );
}
