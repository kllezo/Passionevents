"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLiveSound } from "./LiveSound";

const TRACKS: Record<string, string> = {
  "/concerts": "Passion Live — the night",
  "/concerts/events": "Shows — on the horizon",
  "/concerts/about": "About — built for the stage",
  "/concerts/partners": "Partners — build the night",
};
const LENGTH = 4 * 60 + 20; // a 4:20 "track": purely the page's scroll progress

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * A mini music-player pill on concert pages. The "track" is the page: its
 * progress bar and time follow how far you've scrolled. The speaker button is
 * the same opt-in sound switch as the one in the nav (nothing autoplays).
 */
export function LivePlayer() {
  const path = usePathname() ?? "/concerts";
  const { enabled, toggle } = useLiveSound();
  const bar = useRef<HTMLSpanElement>(null);
  const [time, setTime] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      setTime(Math.round(p * LENGTH));
      setShow(window.scrollY > window.innerHeight * 0.6 && p < 0.985);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [path]);

  const title = TRACKS[path] ?? (path.startsWith("/concerts/events/") ? "Show — live" : "Passion Live");

  return (
    <div
      className={`pointer-events-none fixed bottom-4 left-4 z-[70] transition-[transform,opacity] duration-500 max-sm:bottom-3 max-sm:left-3 ${show ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0"}`}
      aria-hidden={!show}
      inert={!show}
    >
      <div className="pointer-events-auto flex w-[min(52vw,200px)] items-center gap-3 rounded-2xl sm:w-[340px] border border-white/10 bg-black/70 p-2.5 pr-3 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.9)] backdrop-blur-xl">
        <span className="relative grid size-8 shrink-0 sm:size-10 place-items-center overflow-hidden rounded-xl bg-[conic-gradient(from_200deg,#ff5a1f,#ff2e88,#8b5cff,#2ec5ff,#ff5a1f)]" aria-hidden="true">
          <span className="size-3 rounded-full bg-black" />
          <span className="absolute inset-0 animate-[spin_4s_linear_infinite] rounded-xl bg-[conic-gradient(from_0deg,transparent,rgb(255_255_255/0.25)_30deg,transparent_60deg)] motion-reduce:animate-none" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-grotesk text-[0.72rem] font-semibold text-white max-sm:hidden">{title}</span>
            <span className="flex h-3 shrink-0 items-end gap-[2px]" aria-hidden="true">
              {[0.6, 1, 0.5, 0.85].map((v, k) => (
                <span key={k} className="w-[2px] origin-bottom animate-[eq_0.7s_ease-in-out_infinite] bg-volt motion-reduce:animate-none" style={{ height: `${v * 100}%`, animationDelay: `${k * 0.12}s` }} />
              ))}
            </span>
          </span>
          <span className="mt-1.5 block h-[3px] overflow-hidden rounded-full bg-white/15 max-sm:mt-0">
            <span ref={bar} className="block h-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-acid via-volt to-hot" />
          </span>
          <span className="mt-1 flex justify-between font-grotesk text-[0.58rem] tabular-nums text-white/50 max-sm:hidden">
            <span>{fmt(time)}</span>
            <span>{fmt(LENGTH)}</span>
          </span>
        </span>
        <button
          type="button"
          onClick={toggle}
          aria-label={enabled ? "Turn interaction sound off" : "Turn interaction sound on"}
          aria-pressed={enabled}
          className={`grid size-8 shrink-0 place-items-center rounded-full border transition-colors sm:size-9 ${enabled ? "border-volt bg-volt text-black" : "border-white/20 text-white hover:border-white"}`}
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor" stroke="none" />
            {enabled ? <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" strokeLinecap="round" /> : <path d="m16 9 5 6m0-6-5 6" strokeLinecap="round" />}
          </svg>
        </button>
      </div>
    </div>
  );
}
