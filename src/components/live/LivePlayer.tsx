"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";
import { Eq, useLiveSound } from "./LiveSound";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * The Passion Live music player: the original soundtrack's title, its real
 * playback position and length, play/pause, mute and volume. It slides in
 * once you're past the hero, or as soon as the music is playing.
 */
export function LivePlayer() {
  const path = usePathname() ?? "/concerts";
  const { enabled, blocked, playing, playPause, toggle, volume, setVolume, position, trackLength, trackTitle } = useLiveSound();
  const [time, setTime] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setScrolled(window.scrollY > window.innerHeight * 0.6);
      setNearEnd(p > 0.985);
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

  // real playback clock, updated four times a second while playing
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show the paused position straight away
    setTime(position());
    if (!playing) return;
    const id = window.setInterval(() => setTime(position()), 250);
    return () => window.clearInterval(id);
  }, [playing, position]);

  const show = (scrolled || playing) && !nearEnd;
  const pct = trackLength ? (time / trackLength) * 100 : 0;
  const VolIcon = !enabled || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      data-sound-ignore=""
      className={`pointer-events-none fixed bottom-4 left-4 z-[70] transition-[transform,opacity] duration-500 max-sm:bottom-3 max-sm:left-3 max-sm:right-3 ${show ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0"}`}
      aria-hidden={!show}
      inert={!show}
    >
      <div role="region" aria-label="Music player" className="pointer-events-auto relative overflow-hidden rounded-[1.4rem] bg-black/75 p-2.5 shadow-[0_24px_60px_-18px_rgb(0_0_0/0.95)] ring-1 ring-white/12 backdrop-blur-xl sm:w-[400px] sm:p-3">
        {/* progress along the top edge on phones */}
        <span className="absolute inset-x-0 top-0 h-[2px] bg-white/10 sm:hidden" aria-hidden="true">
          <span className="block h-full bg-gradient-to-r from-acid via-volt to-hot transition-[width] duration-200" style={{ width: `${pct}%` }} />
        </span>

        <div className="flex items-center gap-3">
          {/* spinning record */}
          <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[conic-gradient(from_200deg,#ff5a1f,#ff2e88,#8b5cff,#2ec5ff,#ff5a1f)] sm:size-12" aria-hidden="true">
            <span className={`absolute inset-[3px] rounded-full bg-[repeating-radial-gradient(circle,#0b0b0f_0px,#0b0b0f_2px,#17171d_3px)] ${playing ? "animate-[spin_3s_linear_infinite]" : ""} motion-reduce:animate-none`} />
            <span className="relative size-3 rounded-full bg-volt" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-display text-base uppercase leading-none text-white">{trackTitle}</p>
              <Eq on={playing} className="text-volt" />
            </div>
            <p className="mt-1 truncate font-grotesk text-[0.6rem] uppercase tracking-[0.2em] text-white/50">
              {blocked ? "Tap sound on to play" : "Passion Live · original soundtrack"}
            </p>
            <div className="mt-2 hidden items-center gap-2 sm:flex">
              <span className="font-grotesk text-[0.6rem] tabular-nums text-white/60">{fmt(time)}</span>
              <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-label="Playback position" aria-valuemin={0} aria-valuemax={Math.round(trackLength)} aria-valuenow={Math.round(time)}>
                <span className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-acid via-volt to-hot transition-[width] duration-200" style={{ width: `${pct}%` }} />
              </span>
              <span className="font-grotesk text-[0.6rem] tabular-nums text-white/40">{fmt(trackLength)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={playPause}
            aria-label={playing ? "Pause the soundtrack" : "Play the soundtrack"}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-black transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            {playing ? <Pause className="size-4 fill-current" /> : <Play className="ml-0.5 size-4 fill-current" />}
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-pressed={enabled}
            aria-label={enabled ? "Mute — sound off" : "Unmute — sound on"}
            className={`grid size-10 shrink-0 place-items-center rounded-full ring-1 transition-colors ${enabled ? "text-white ring-white/25 hover:bg-white hover:text-black" : "text-white/60 ring-white/15 hover:text-white"}`}
          >
            <VolIcon className="size-4" />
          </button>
        </div>

        <label className="mt-2.5 hidden items-center gap-3 border-t border-white/10 pt-2.5 sm:flex">
          <span className="font-grotesk text-[0.58rem] uppercase tracking-[0.2em] text-white/45">Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/15 accent-volt [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          <span className="w-8 text-right font-grotesk text-[0.6rem] tabular-nums text-white/55">{Math.round(volume * 100)}</span>
        </label>
      </div>
    </div>
  );
}
