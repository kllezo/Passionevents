"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Pause, Play, Volume2, VolumeX } from "lucide-react";

const fmt = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

/**
 * In-site video player for a reel's own MP4. Loads only when the viewer is
 * open (preload="metadata", poster first). Starts playing because opening a
 * reel is a click; if the browser refuses sound it plays muted and shows the
 * unmute button. Space = play/pause, M = mute, F = full screen.
 * Tells the Passion Live soundtrack to step aside while it plays with sound.
 */
export function ReelPlayer({ src, poster, title }: { src: string; poster: string; title: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [full, setFull] = useState(false);
  const [failed, setFailed] = useState(false);
  const [buffering, setBuffering] = useState(true);

  const announce = useCallback((on: boolean) => window.dispatchEvent(new CustomEvent("pe:media", { detail: { playing: on } })), []);

  // Autoplay on open (the click that opened the viewer counts as a gesture).
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.volume = 1;
    v.play().catch((err: DOMException) => {
      // Only fall back to muted when the browser refuses sound; an
      // interrupted play() (AbortError) is not a sound refusal.
      if (err?.name !== "NotAllowedError") return;
      v.muted = true;
      setMuted(true);
      v.play().catch(() => setPlaying(false));
    });
    return () => {
      v.pause();
      announce(false);
    };
  }, [src, announce]);

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === wrap.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggle = useCallback(() => {
    const v = video.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  }, []);
  const toggleMute = useCallback(() => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted && v.volume === 0) v.volume = 0.8;
  }, []);
  const toggleFull = useCallback(() => {
    const el = wrap.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else if (el.requestFullscreen) void el.requestFullscreen();
    else (video.current as HTMLVideoElement & { webkitEnterFullscreen?: () => void })?.webkitEnterFullscreen?.();
  }, []);

  // Keyboard: arrows stay with the viewer (previous / next reel).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.isContentEditable)) return;
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        toggle();
      } else if (e.key === "m") toggleMute();
      else if (e.key === "f") toggleFull();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, toggleMute, toggleFull]);

  const pct = dur ? (time / dur) * 100 : 0;
  const btn = "grid size-10 shrink-0 place-items-center rounded-full text-white transition-colors hover:bg-white/15 focus-visible:bg-white/15";

  if (failed) {
    return (
      <div className="grid h-full w-full place-items-center bg-black p-6 text-center text-sm text-white/70">
        This video could not be loaded.
      </div>
    );
  }

  return (
    <div ref={wrap} className="group/player relative h-full w-full bg-black">
      <video
        ref={video}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        loop
        className="h-full w-full object-contain"
        aria-label={title}
        onClick={toggle}
        onPlay={() => {
          setPlaying(true);
          announce(!video.current?.muted);
        }}
        onPause={() => {
          setPlaying(false);
          announce(false);
        }}
        onVolumeChange={() => {
          const v = video.current!;
          setMuted(v.muted);
          setVolume(v.volume);
          if (!v.paused) announce(!v.muted && v.volume > 0);
        }}
        onTimeUpdate={() => setTime(video.current!.currentTime)}
        onLoadedMetadata={() => setDur(Number.isFinite(video.current!.duration) ? video.current!.duration : 0)}
        onDurationChange={() => Number.isFinite(video.current!.duration) && setDur(video.current!.duration)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        onError={() => setFailed(true)}
      />

      {buffering && playing && (
        <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-white/25 border-t-white" />
      )}
      {!playing && !buffering && (
        <button type="button" onClick={toggle} aria-label="Play" className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-black shadow-2xl transition-transform hover:scale-105">
          <Play className="ml-1 size-8" />
        </button>
      )}

      {/* Controls */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-3 pt-12 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover/player:opacity-100 md:group-focus-within/player:opacity-100 [&:has(:focus-visible)]:opacity-100">
        <input
          type="range"
          min={0}
          max={dur || 0}
          step={0.1}
          value={time}
          onChange={(e) => {
            const v = video.current;
            if (v) v.currentTime = Number(e.target.value);
          }}
          aria-label="Seek"
          aria-valuetext={`${fmt(time)} of ${fmt(dur)}`}
          className="reel-range block w-full"
          style={{ ["--p" as string]: `${pct}%` }}
        />
        <div className="mt-2 flex items-center gap-1">
          <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play"} className={btn}>
            {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
          </button>
          <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} aria-pressed={muted} className={btn}>
            {muted || volume === 0 ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => {
              const v = video.current;
              if (!v) return;
              v.volume = Number(e.target.value);
              v.muted = v.volume === 0;
            }}
            aria-label="Volume"
            className="reel-range w-20 max-sm:hidden"
            style={{ ["--p" as string]: `${(muted ? 0 : volume) * 100}%` }}
          />
          <span className="ml-2 font-mono text-[0.7rem] tabular-nums text-white/80">
            {fmt(time)} / {fmt(dur)}
          </span>
          <button type="button" onClick={toggleFull} aria-label={full ? "Exit full screen" : "Full screen"} className={`${btn} ml-auto`}>
            {full ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
          </button>
        </div>
      </div>
      {muted && playing && (
        <button type="button" onClick={toggleMute} className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-black shadow-lg">
          <VolumeX className="size-4" /> Tap for sound
        </button>
      )}
    </div>
  );
}
