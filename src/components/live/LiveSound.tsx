"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Soundtrack, TRACK_LENGTH, TRACK_TITLE } from "./soundtrack";

/**
 * Passion Live sound. The experience is meant to be heard, so sound is ON by
 * default — but browsers only allow audio after the visitor has interacted
 * with the page. So:
 *  - arriving by a click (e.g. from Passion Events) the soundtrack starts at once;
 *  - otherwise it starts on the first tap, click or key press, and a prompt
 *    offers to turn it on (or keep it quiet);
 *  - the choice is remembered (localStorage) across pages and visits;
 *  - it pauses while the tab is hidden and stops when you leave Passion Live.
 * "Sound on" is only ever shown when audio is actually running.
 * Everything is synthesised in the browser — original, no recordings.
 */
type Voice = "kick" | "snare" | "hat" | "tom" | "crash";
type Pref = "on" | "off";
type Ctx = {
  /** Audio is actually running. */
  enabled: boolean;
  /** The visitor wants sound but the browser is waiting for a gesture. */
  blocked: boolean;
  /** Music playing (can be paused while sound stays on). */
  playing: boolean;
  volume: number;
  setVolume: (v: number) => void;
  toggle: () => void;
  enable: () => void;
  disable: () => void;
  playPause: () => void;
  position: () => number;
  trackLength: number;
  trackTitle: string;
  pluck: (stringIndex: number, velocity?: number) => void;
  drum: (voice: Voice) => void;
};

const noop = () => {};
const SoundContext = createContext<Ctx>({
  enabled: false,
  blocked: false,
  playing: false,
  volume: 0.7,
  setVolume: noop,
  toggle: noop,
  enable: noop,
  disable: noop,
  playPause: noop,
  position: () => 0,
  trackLength: TRACK_LENGTH,
  trackTitle: TRACK_TITLE,
  pluck: noop,
  drum: noop,
});
export const useLiveSound = () => useContext(SoundContext);

const KEY = "pl-sound";
const readPref = (): Pref => {
  try {
    return localStorage.getItem(KEY) === "off" ? "off" : "on";
  } catch {
    return "on";
  }
};
const writePref = (p: Pref) => {
  try {
    localStorage.setItem(KEY, p);
  } catch {
    /* private mode: the choice simply isn't remembered */
  }
};

// Standard tuning E2 A2 D3 G3 B3 E4 (index 0 = low E)
const STRING_HZ = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];

export function LiveSoundProvider({ children }: { children: ReactNode }) {
  const [pref, setPref] = useState<Pref>("off");
  const [running, setRunning] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const ac = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);
  const fx = useRef<GainNode | null>(null);
  const track = useRef<Soundtrack | null>(null);
  const runningRef = useRef(false);
  const wantMusic = useRef(true);
  const volumeRef = useRef(0.7);

  const ensure = useCallback(() => {
    if (ac.current) return ac.current;
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    const ctx = new Ctor();
    master.current = ctx.createGain();
    master.current.gain.value = volumeRef.current;
    master.current.connect(ctx.destination);
    fx.current = ctx.createGain();
    fx.current.gain.value = 0.8;
    fx.current.connect(master.current);
    track.current = new Soundtrack(ctx, master.current);
    ac.current = ctx;
    ctx.onstatechange = () => {
      const on = ctx.state === "running";
      runningRef.current = on;
      setRunning(on);
    };
    return ctx;
  }, []);

  /** Must run inside a user gesture the first time. */
  const enable = useCallback(() => {
    setPref("on");
    writePref("on");
    const ctx = ensure();
    if (!ctx) return;
    void ctx.resume().then(() => {
      if (ctx.state !== "running") return;
      runningRef.current = true;
      setRunning(true);
      if (wantMusic.current && track.current && !track.current.playing) {
        track.current.play();
        setPlaying(true);
      }
    });
  }, [ensure]);

  const disable = useCallback(() => {
    setPref("off");
    writePref("off");
    track.current?.pause();
    setPlaying(false);
    const ctx = ac.current;
    if (ctx) window.setTimeout(() => void ctx.suspend(), 250);
  }, []);

  const toggle = useCallback(() => {
    if (runningRef.current) disable();
    else enable();
  }, [enable, disable]);

  const playPause = useCallback(() => {
    if (!runningRef.current) {
      wantMusic.current = true;
      enable();
      return;
    }
    const t = track.current;
    if (!t) return;
    if (t.playing) {
      t.pause();
      wantMusic.current = false;
      setPlaying(false);
    } else {
      t.play();
      wantMusic.current = true;
      setPlaying(true);
    }
  }, [enable]);

  const setVolume = useCallback((v: number) => {
    volumeRef.current = v;
    setVolumeState(v);
    const g = master.current;
    if (g && ac.current) g.gain.setTargetAtTime(v, ac.current.currentTime, 0.05);
  }, []);

  const position = useCallback(() => track.current?.position() ?? 0, []);

  // Start-up: read the remembered choice; start now if the browser already
  // allows audio, otherwise on the first interaction.
  useEffect(() => {
    const p = readPref();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate the stored preference
    setPref(p);
    if (p === "off") return;
    const activated = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive;
    if (activated) enable();
    const evs = ["pointerdown", "keydown", "touchend"] as const;
    const detach = () => evs.forEach((ev) => window.removeEventListener(ev, onGesture, true));
    function onGesture(e: Event) {
      const t = e.target as Element | null;
      if (t?.closest?.("[data-sound-ignore]")) return;
      detach();
      if (readPref() === "on" && !runningRef.current) enable();
    }
    evs.forEach((ev) => window.addEventListener(ev, onGesture, true));
    return detach;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per visit to Passion Live
  }, []);

  // Step aside while a reel plays with sound (Reels.tsx sends "pe:media").
  useEffect(() => {
    let resume = false;
    const onMedia = (e: Event) => {
      const ctx = ac.current;
      if (!ctx) return;
      if ((e as CustomEvent<{ playing: boolean }>).detail?.playing) {
        resume = resume || ctx.state === "running";
        void ctx.suspend();
      } else if (resume) {
        resume = false;
        if (readPref() === "on") void ctx.resume();
      }
    };
    window.addEventListener("pe:media", onMedia);
    return () => window.removeEventListener("pe:media", onMedia);
  }, []);

  // Pause while the tab is hidden.
  useEffect(() => {
    let resume = false;
    const onVis = () => {
      const ctx = ac.current;
      if (!ctx) return;
      if (document.hidden) {
        resume = ctx.state === "running";
        void ctx.suspend();
      } else if (resume && readPref() === "on") {
        void ctx.resume();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Leaving Passion Live: stop everything.
  useEffect(
    () => () => {
      track.current?.dispose();
      void ac.current?.close();
    },
    []
  );

  /** Karplus–Strong plucked string. */
  const pluck = useCallback(
    (i: number, velocity = 0.8) => {
      const ctx = ac.current;
      if (!runningRef.current || !ctx || !fx.current) return;
      const f = STRING_HZ[i] ?? 110;
      const sr = ctx.sampleRate;
      const dur = 2.2;
      const buf = ctx.createBuffer(1, Math.floor(sr * dur), sr);
      const data = buf.getChannelData(0);
      const period = Math.round(sr / f);
      const ring = new Float32Array(period).map(() => Math.random() * 2 - 1);
      let idx = 0;
      for (let n = 0; n < data.length; n++) {
        const next = (idx + 1) % period;
        const v = 0.497 * (ring[idx] + ring[next]);
        data[n] = ring[idx];
        ring[idx] = v;
        idx = next;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const g = ctx.createGain();
      g.gain.value = 0.35 * velocity;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2400 + velocity * 2400;
      src.connect(lp).connect(g).connect(fx.current);
      src.start();
    },
    []
  );

  const drum = useCallback(
    (voice: Voice) => {
      const ctx = ac.current;
      if (!runningRef.current || !ctx || !fx.current) return;
      const now = ctx.currentTime;
      const out = fx.current;
      const noise = (len: number) => {
        const b = ctx.createBuffer(1, Math.floor(ctx.sampleRate * len), ctx.sampleRate);
        const d = b.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const s = ctx.createBufferSource();
        s.buffer = b;
        return s;
      };
      if (voice === "kick" || voice === "tom") {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const start = voice === "kick" ? 150 : 220;
        const end = voice === "kick" ? 42 : 90;
        o.frequency.setValueAtTime(start, now);
        o.frequency.exponentialRampToValueAtTime(end, now + 0.25);
        g.gain.setValueAtTime(voice === "kick" ? 1 : 0.6, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + (voice === "kick" ? 0.45 : 0.35));
        o.connect(g).connect(out);
        o.start(now);
        o.stop(now + 0.5);
      } else {
        const len = voice === "crash" ? 1.4 : voice === "snare" ? 0.22 : 0.06;
        const s = noise(len);
        const f = ctx.createBiquadFilter();
        f.type = voice === "snare" ? "bandpass" : "highpass";
        f.frequency.value = voice === "snare" ? 1800 : 7000;
        const g = ctx.createGain();
        g.gain.setValueAtTime(voice === "crash" ? 0.35 : voice === "snare" ? 0.6 : 0.3, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + len);
        s.connect(f).connect(g).connect(out);
        s.start(now);
        if (voice === "snare") {
          const o = ctx.createOscillator();
          const og = ctx.createGain();
          o.frequency.value = 190;
          og.gain.setValueAtTime(0.4, now);
          og.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          o.connect(og).connect(out);
          o.start(now);
          o.stop(now + 0.15);
        }
      }
    },
    []
  );

  const enabled = running && pref === "on";
  const blocked = pref === "on" && !running;

  return (
    <SoundContext.Provider
      value={{ enabled, blocked, playing: enabled && playing, volume, setVolume, toggle, enable, disable, playPause, position, trackLength: TRACK_LENGTH, trackTitle: TRACK_TITLE, pluck, drum }}
    >
      {children}
      <SoundPrompt />
    </SoundContext.Provider>
  );
}

/** Animated equaliser bars — they only move while sound is really playing. */
export function Eq({ on, className = "" }: { on: boolean; className?: string }) {
  return (
    <span className={`flex h-3.5 items-end gap-[2px] ${className}`} aria-hidden="true">
      {[0.55, 1, 0.7, 0.9].map((v, k) => (
        <span
          key={k}
          className={`w-[3px] origin-bottom rounded-full bg-current ${on ? "animate-[eq_0.8s_ease-in-out_infinite] motion-reduce:animate-none" : "opacity-40"}`}
          style={{ height: `${on ? v * 100 : 30}%`, animationDelay: `${k * 0.12}s` }}
        />
      ))}
    </span>
  );
}

/**
 * The sound switch: a large white pill. It says SOUND ON only when audio is
 * actually running; while the browser is still waiting for a tap it says
 * SOUND OFF with a small pulsing hint.
 */
export function SoundToggle({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { enabled, blocked, toggle } = useLiveSound();
  return (
    <button
      type="button"
      data-sound-ignore=""
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Sound on — turn sound off" : "Sound off — turn sound on"}
      className={`group relative inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-white font-grotesk font-semibold uppercase text-black shadow-[0_10px_40px_-12px_rgb(255_255_255/0.45)] transition-[transform,box-shadow,background-color] duration-300 ease-out hover:scale-[1.04] hover:bg-volt hover:shadow-[0_14px_50px_-10px_rgb(255_90_31/0.7)] active:scale-[0.98] ${
        compact ? "h-10 gap-2 px-3.5 text-[0.62rem] tracking-[0.12em]" : "h-12 px-6 text-[0.74rem] tracking-[0.22em]"
      } ${className ?? ""}`}
    >
      {enabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
      <span>Sound {enabled ? "on" : "off"}</span>
      <span className={compact ? "max-[420px]:hidden" : ""}>
        <Eq on={enabled} />
      </span>
      {blocked && (
        <span className="absolute -right-0.5 -top-0.5 flex size-3" aria-hidden="true">
          <span className="absolute inset-0 animate-ping rounded-full bg-hot/80" />
          <span className="relative size-3 rounded-full bg-hot ring-2 ring-void" />
        </span>
      )}
    </button>
  );
}

/** Shown when the visitor wants sound but the browser is waiting for a tap. */
function SoundPrompt() {
  const { blocked, enable, disable } = useLiveSound();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!blocked) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hide as soon as sound runs
      setShow(false);
      return;
    }
    const t = window.setTimeout(() => setShow(true), 1400);
    // Step aside once the visitor scrolls on, or after a while: the nav's
    // SOUND pill (with its dot) stays as the way to turn sound on.
    const hide = () => setShow(false);
    const onScroll = () => window.scrollY > window.innerHeight * 0.9 && hide();
    const later = window.setTimeout(hide, 15400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(later);
      window.removeEventListener("scroll", onScroll);
    };
  }, [blocked]);

  return (
    <div
      data-sound-ignore=""
      role="dialog"
      aria-label="Turn on sound"
      aria-hidden={!show}
      inert={!show}
      className={`fixed bottom-24 left-1/2 z-[95] w-[min(92vw,470px)] -translate-x-1/2 transition-[opacity,transform] duration-500 ease-out max-sm:bottom-20 ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
    >
      <div className="flex items-center gap-4 rounded-[1.6rem] bg-black/80 p-3 pl-4 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9)] ring-1 ring-white/15 backdrop-blur-xl">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[conic-gradient(from_200deg,#ff5a1f,#ff2e88,#8b5cff,#2ec5ff,#ff5a1f)] text-black">
          <Volume2 className="size-5" />
        </span>
        <p className="min-w-0 flex-1 font-grotesk text-sm leading-snug text-white">
          Passion Live is better loud.
          <span className="block text-xs text-white/55">Original soundtrack, made in your browser</span>
        </p>
        <div className="flex shrink-0 flex-col items-stretch gap-1 sm:flex-row sm:items-center">
          <button type="button" onClick={enable} className="rounded-full bg-white px-4 py-2 font-grotesk text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-black transition-transform hover:scale-105">
            Sound on
          </button>
          <button type="button" onClick={disable} className="rounded-full px-3 py-2 font-grotesk text-[0.62rem] uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-white">
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
