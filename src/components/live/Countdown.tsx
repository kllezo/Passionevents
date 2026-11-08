"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Live countdown to a show. Renders nothing until mounted (no server/client
 * clock mismatch) and nothing once the date has passed. Each changing unit
 * flips in. When only a date is known, it counts to the start of that day
 * (labelled "until show day", not a door time).
 */
export function Countdown({ target, hasTime }: { target: string; hasTime: boolean }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- start the clock after mount
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const end = new Date(target).getTime();
  if (now === null || !Number.isFinite(end) || end <= now) return null;

  const s = Math.floor((end - now) / 1000);
  const units = [
    { label: "Days", value: String(Math.floor(s / 86400)) },
    { label: "Hrs", value: pad(Math.floor((s % 86400) / 3600)) },
    { label: "Min", value: pad(Math.floor((s % 3600) / 60)) },
    { label: "Sec", value: pad(s % 60) },
  ];

  return (
    <div className="relative" role="timer" aria-live="off" aria-label={`${units[0].value} days ${units[1].value} hours ${units[2].value} minutes to go`}>
      <p className="font-grotesk text-[0.65rem] uppercase tracking-[0.3em] text-white/45">{hasTime ? "Until doors" : "Until show day"}</p>
      <div className="mt-3 flex gap-2 md:gap-3">
        {units.map((u) => (
          <div key={u.label} className="relative min-w-[4.2rem] overflow-hidden border border-white/15 bg-void/70 px-3 py-2 text-center md:min-w-[5.2rem]">
            <span className="absolute inset-x-0 top-1/2 h-px bg-white/10" aria-hidden="true" />
            <span key={u.value} className="block animate-[countFlip_0.45s_cubic-bezier(.2,.9,.3,1.2)] font-display text-[clamp(2rem,3.4vw,3.2rem)] leading-none text-white [transform-origin:50%_100%]">
              {u.value}
            </span>
            <span className="mt-1 block font-grotesk text-[0.58rem] uppercase tracking-[0.25em] text-volt">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
