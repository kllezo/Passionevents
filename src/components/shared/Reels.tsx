"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { Pic } from "./Pic";
import { InstagramIcon } from "./InstagramIcon";
import { ReelPlayer } from "./ReelPlayer";
import { reelById, reelCover, reelMode, reelUrl, type Reel } from "@/content/reels";
import { gsap, useGSAP, media, whenVisible } from "@/motion/gsap";

type Tone = "light" | "dark";

/* ──────────────────────────────────────────────────────────────────────────
 * One reel: a tall 9:16 frame with the reel's cover, its caption and a soft
 * pulsing ring around Instagram's own play mark. Opens the full-screen viewer.
 * ────────────────────────────────────────────────────────────────────────── */
export function ReelCard({ reel, onOpen, tone = "light", className = "", sizes = "(max-width: 768px) 64vw, 280px", compact = false }: { reel: Reel; onOpen: () => void; tone?: Tone; className?: string; sizes?: string; compact?: boolean }) {
  const dark = tone === "dark";
  const meta = [reel.place, reel.date].filter(Boolean).join(" · ");
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative block aspect-[9/16] w-full overflow-hidden text-left transition-[transform,box-shadow] duration-500 ease-[var(--ease-silk)] hover:-translate-y-1.5 focus-visible:-translate-y-1.5 ${
        dark ? "rounded-[1.25rem] bg-graphite shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/10" : "rounded-[1.5rem] bg-cream shadow-[0_30px_60px_-34px_rgb(94_52_64/0.65)]"
      } ${className}`}
    >
      {reel.landscape && (
        <span aria-hidden="true" className="absolute inset-0 scale-125 bg-cover bg-center blur-2xl" style={{ backgroundImage: `url(${reelCover(reel.id)})` }} />
      )}
      <span className="absolute inset-0 block transition-transform duration-[1.2s] ease-[var(--ease-silk)] group-hover:scale-[1.05]">
        <Pic image={{ src: reelCover(reel.id), alt: `${reel.title}${meta ? `, ${meta}` : ""} — Passion Events reel` }} sizes={sizes} className={reel.landscape ? "object-contain!" : ""} tone={dark ? "dark" : "light"} />
      </span>
      {/* ring around Instagram's play mark */}
      <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[24%] rounded-full border-2 border-white/0 transition-colors duration-300 group-hover:border-white/80 group-focus-visible:border-white/80 motion-safe:group-hover:animate-[reelPulse_2.2s_ease-out_infinite] motion-safe:group-focus-visible:animate-[reelPulse_2.2s_ease-out_infinite]" style={{ transform: "translate(-50%,-50%)" }} />
      <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t ${dark ? "from-void/95 via-void/40" : "from-ink/85 via-ink/30"} to-transparent`} />
      <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] backdrop-blur-md ${dark ? "bg-black/50 text-volt ring-1 ring-volt/40" : "bg-ivory/85 text-rose-deep"}`}>
        {reel.category}
      </span>
      <span className={`absolute block ${compact ? "inset-x-3 bottom-3" : "inset-x-4 bottom-4"}`}>
        <span className={`block leading-tight text-white ${dark ? `font-display uppercase ${compact ? "text-sm" : "text-xl"}` : `font-serif ${compact ? "text-[0.95rem]" : "text-[1.35rem]"}`}`}>{reel.title}</span>
        {meta && <span className="mt-1.5 block text-[0.62rem] uppercase tracking-[0.16em] text-white/70">{meta}</span>}
        <span className={`mt-3 items-center gap-1.5 text-[0.65rem] ${compact ? "hidden" : "inline-flex"} font-semibold uppercase tracking-[0.2em] text-white/85 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:opacity-100`}>
          {reelMode(reel) !== "none" ? "▶ Play reel" : "Open reel"}
        </span>
      </span>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Full-screen viewer that keeps visitors on the site.
 *  - A reel with its own MP4 (reel.video) plays here in ReelPlayer.
 *  - A reel Instagram allows to embed (reel.embed) plays in Instagram's
 *    official embed, inside this viewer.
 *  - Otherwise the cover is shown with a clear note that the video file has
 *    not been added yet, and an optional link to Instagram.
 * Arrow keys / buttons move between reels, Esc closes, focus returns to the
 * card that opened it, the page behind does not scroll.
 * ────────────────────────────────────────────────────────────────────────── */
function ReelViewer({ list, index, onClose, onMove, tone }: { list: Reel[]; index: number; onClose: () => void; onMove: (d: number) => void; tone: Tone }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const reel = list[index];
  const dark = tone === "dark";
  const meta = [reel.place, reel.date].filter(Boolean).join(" · ");
  const mode = reelMode(reel);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onMove(1);
      else if (e.key === "ArrowLeft") onMove(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [onClose, onMove]);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`Reel: ${reel.title}`} data-lenis-prevent="" data-sound-ignore="" className="fixed inset-0 z-[160] flex items-center justify-center overflow-hidden">
      <button type="button" aria-label="Close" tabIndex={-1} onClick={onClose} className="absolute inset-0 cursor-default bg-black/88 backdrop-blur-xl" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 scale-110 bg-cover bg-center opacity-25 blur-3xl" style={{ backgroundImage: `url(${reelCover(reel.id)})` }} />

      <div key={reel.id} className="relative flex max-h-full w-full max-w-5xl items-center justify-center gap-6 px-4 motion-safe:animate-[reelIn_.5s_var(--ease-silk)_both] md:gap-12 md:px-10">
        <div className="relative aspect-[9/16] h-[min(80svh,760px)] shrink-0 overflow-hidden rounded-[1.6rem] bg-black shadow-[0_40px_120px_-30px_rgb(0_0_0/0.9)] ring-1 ring-white/15 max-md:h-[64svh]">
          {mode === "video" && <ReelPlayer src={reel.video!} poster={reelCover(reel.id)} title={reel.title} />}
          {mode === "embed" && (
            <iframe
              src={`https://www.instagram.com/reel/${reel.id}/embed/`}
              title={`${reel.title} (Instagram)`}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0 bg-white"
            />
          )}
          {mode === "none" && (
            <>
              {reel.landscape && <span aria-hidden="true" className="absolute inset-0 scale-125 bg-cover bg-center blur-2xl" style={{ backgroundImage: `url(${reelCover(reel.id)})` }} />}
              <Pic image={{ src: reelCover(reel.id), alt: reel.title }} sizes="420px" className={reel.landscape ? "object-contain!" : ""} tone="dark" />
              <span className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5 pt-20 text-center">
                <span className="text-xs leading-relaxed text-white/80">The video for this reel has not been added to the website yet.</span>
                <a
                  href={reelUrl(reel.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-black transition-transform duration-300 hover:scale-105"
                >
                  <InstagramIcon className="size-4" /> Watch on Instagram <ArrowUpRight className="size-3.5" />
                </a>
              </span>
            </>
          )}
        </div>

        <div className="hidden max-w-sm text-white md:block">
          <p className={`text-[0.68rem] font-semibold uppercase tracking-[0.28em] ${dark ? "text-volt" : "text-blush"}`}>{reel.category}</p>
          <h2 className={`mt-4 leading-[1.02] ${dark ? "font-display text-5xl uppercase" : "font-serif text-5xl font-light"}`}>{reel.title}</h2>
          {meta && <p className="mt-4 text-sm uppercase tracking-[0.22em] text-white/60">{meta}</p>}
          <p className="mt-8 text-sm leading-relaxed text-white/60">From our Instagram, @passionevents.p.</p>
          {mode === "video" && <p className="mt-3 text-xs text-white/45">Space play/pause · M mute · F full screen · ← → next</p>}
          <p className="mt-10 font-mono text-xs tracking-[0.3em] text-white/50">
            {String(index + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* caption on phones */}
      <div className="pointer-events-none absolute inset-x-5 bottom-[max(1rem,env(safe-area-inset-bottom))] text-center text-white md:hidden">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/60">
          {reel.category}
          {meta ? ` · ${meta}` : ""}
        </p>
        <p className="mt-1 font-serif text-xl">{reel.title}</p>
      </div>

      <button ref={closeRef} type="button" onClick={onClose} aria-label="Close reel" className="absolute right-4 top-4 grid size-12 place-items-center rounded-full bg-white text-black transition-transform hover:scale-105 md:right-8 md:top-8">
        <X className="size-5" />
      </button>
      {list.length > 1 && (
        <>
          <button type="button" onClick={() => onMove(-1)} aria-label="Previous reel" className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-white hover:text-black md:left-8">
            <ArrowLeft className="size-5" />
          </button>
          <button type="button" onClick={() => onMove(1)} aria-label="Next reel" className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur-md transition-colors hover:bg-white hover:text-black md:right-8">
            <ArrowRight className="size-5" />
          </button>
        </>
      )}
    </div>,
    document.body
  );
}

/** Holds which reel is open; returns an opener and the viewer element. */
export function useReelViewer(list: Reel[], tone: Tone = "light") {
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const close = useCallback(() => {
    setOpen(null);
    requestAnimationFrame(() => opener.current?.focus());
  }, []);
  const move = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length]);
  const openAt = useCallback((i: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setOpen(i);
  }, []);
  const viewer = open !== null && list[open] ? <ReelViewer list={list} index={open} onClose={close} onMove={move} tone={tone} /> : null;
  return { openAt, viewer };
}

/* ──────────────────────────────────────────────────────────────────────────
 * A horizontal rail of reels with prev/next buttons. Native scroll + snap,
 * so it is smooth with a trackpad, a mouse wheel (shift) or a finger.
 * ────────────────────────────────────────────────────────────────────────── */
export function ReelRail({ ids, tone = "light", className = "", label = "Reels", compact = false }: { ids: string[]; tone?: Tone; className?: string; label?: string; compact?: boolean }) {
  const list = ids.map(reelById).filter((r): r is Reel => Boolean(r));
  const { openAt, viewer } = useReelViewer(list, tone);
  const track = useRef<HTMLUListElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const dark = tone === "dark";

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };
  useEffect(onScroll, []);

  const nudge = (d: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: d * ((card?.clientWidth ?? 280) + 16) * 2, behavior: "smooth" });
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(media.ok, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reel-item]", root.current);
        const tl = gsap.fromTo(items, { y: 60, autoAlpha: 0, rotate: (i) => (i % 2 ? 2 : -2) }, { y: 0, autoAlpha: 1, rotate: 0, duration: 1.1, stagger: 0.07, ease: "expo.out", paused: true, clearProps: "transform" });
        return whenVisible(root.current!, () => tl.play(), "0px 0px -12% 0px");
      });
    },
    { scope: root }
  );

  if (list.length === 0) return null;

  // A single reel simply fills its container.
  if (list.length === 1) {
    return (
      <div ref={root} className={className}>
        <div data-reel-item="">
          <ReelCard reel={list[0]} tone={tone} onOpen={() => openAt(0)} sizes="300px" compact={compact} />
        </div>
        {viewer}
      </div>
    );
  }

  const btn = `grid size-12 place-items-center rounded-full transition-[background-color,color,opacity] duration-300 disabled:opacity-30 ${
    dark ? "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white hover:text-black" : "bg-ivory text-ink ring-1 ring-ink/10 hover:bg-ink hover:text-ivory"
  }`;

  return (
    <div ref={root} className={`relative ${className}`}>
      <ul
        ref={track}
        onScroll={onScroll}
        aria-label={label}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-4 [scrollbar-width:none] md:-mx-10 md:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {list.map((r, i) => (
          <li key={r.id} data-reel-item="" className="w-[min(62vw,270px)] shrink-0 snap-start">
            <ReelCard reel={r} tone={tone} onOpen={() => openAt(i)} />
          </li>
        ))}
      </ul>
      {list.length > 3 && (
        <div className="mt-4 flex items-center gap-3">
          <button type="button" className={btn} onClick={() => nudge(-1)} disabled={edge.start} aria-label="Scroll reels back">
            <ArrowLeft className="size-5" />
          </button>
          <button type="button" className={btn} onClick={() => nudge(1)} disabled={edge.end} aria-label="Scroll reels forward">
            <ArrowRight className="size-5" />
          </button>
        </div>
      )}
      {viewer}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * The /reels page wall: category filter + staggered grid of every reel.
 * ────────────────────────────────────────────────────────────────────────── */
export function ReelsWall({ all }: { all: Reel[] }) {
  const cats = ["All", ...Array.from(new Set(all.map((r) => r.category)))] as const;
  const [cat, setCat] = useState<string>("All");
  const list = cat === "All" ? all : all.filter((r) => r.category === cat);
  const { openAt, viewer } = useReelViewer(list);
  return (
    <div>
      <div role="tablist" aria-label="Filter reels" className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={`rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-300 ${cat === c ? "bg-ink text-ivory" : "bg-cream text-ink/75 hover:bg-blush/50"}`}
          >
            {c}
            <span className="ml-2 opacity-60">{c === "All" ? all.length : all.filter((r) => r.category === c).length}</span>
          </button>
        ))}
      </div>
      <ul key={cat} className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
        {list.map((r, i) => (
          <li key={r.id} className={`motion-safe:animate-[reelIn_.7s_var(--ease-silk)_both] ${i % 5 === 1 || i % 5 === 3 ? "lg:mt-16" : ""} ${i % 2 ? "max-lg:mt-10" : ""}`} style={{ animationDelay: `${i * 60}ms` }}>
            <ReelCard reel={r} onOpen={() => openAt(i)} sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 19vw" />
          </li>
        ))}
      </ul>
      {viewer}
    </div>
  );
}
