"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Opt-in synthesised sound for the guitar and drum interactions. Nothing ever
 * autoplays: an AudioContext is only created when the visitor turns sound on,
 * and every tone is generated in the browser (no recorded music).
 */
type Voice = "kick" | "snare" | "hat" | "tom" | "crash";
type Ctx = {
  enabled: boolean;
  toggle: () => void;
  pluck: (stringIndex: number, velocity?: number) => void;
  drum: (voice: Voice) => void;
};

const SoundContext = createContext<Ctx>({ enabled: false, toggle: () => {}, pluck: () => {}, drum: () => {} });
export const useLiveSound = () => useContext(SoundContext);

// Standard tuning E2 A2 D3 G3 B3 E4 (index 0 = low E)
const STRING_HZ = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];

export function LiveSoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const ac = useRef<AudioContext | null>(null);
  const master = useRef<GainNode | null>(null);

  const toggle = useCallback(() => {
    setEnabled((on) => {
      const next = !on;
      if (next && !ac.current) {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ac.current = new Ctor();
        master.current = ac.current.createGain();
        master.current.gain.value = 0.5;
        master.current.connect(ac.current.destination);
      }
      if (next) void ac.current?.resume();
      else void ac.current?.suspend();
      return next;
    });
  }, []);

  useEffect(() => () => void ac.current?.close(), []);

  /** Karplus–Strong plucked string. */
  const pluck = useCallback(
    (i: number, velocity = 0.8) => {
      const ctx = ac.current;
      if (!enabled || !ctx || !master.current) return;
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
      src.connect(lp).connect(g).connect(master.current);
      src.start();
    },
    [enabled]
  );

  const drum = useCallback(
    (voice: Voice) => {
      const ctx = ac.current;
      if (!enabled || !ctx || !master.current) return;
      const now = ctx.currentTime;
      const out = master.current;
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
    [enabled]
  );

  return <SoundContext.Provider value={{ enabled, toggle, pluck, drum }}>{children}</SoundContext.Provider>;
}

export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggle } = useLiveSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      className={`inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-grotesk text-[0.7rem] uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-volt hover:text-white aria-pressed:border-volt aria-pressed:text-volt ${className ?? ""}`}
      data-cursor={enabled ? "Mute" : "Sound"}
    >
      {enabled ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
      Sound {enabled ? "on" : "off"}
    </button>
  );
}
