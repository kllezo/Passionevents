"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { VerifiedArtist } from "@/lib/events";
import { gsap, media } from "@/motion/gsap";
import { MediaImage } from "@/components/shared/MediaImage";

const tones = ["text-white", "text-volt", "text-laser", "text-hot", "text-acid", "text-violet"];

/**
 * Artists discovered from published shows (and the company's own verified
 * profile) — never invented. Desktop: a festival-poster line-up beside a
 * spinning vinyl that "plays" whichever artist you hover or focus. Phones:
 * the record sits on top and tapping a name drops it on the deck.
 */
export function ArtistsList({ artists }: { artists: VerifiedArtist[] }) {
  const [active, setActive] = useState(0);
  const label = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // Every change of artist: the record label pops and the needle re-drops.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!label.current || window.matchMedia(media.reduced).matches) return;
    gsap.fromTo(label.current, { scale: 0.6, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2)", overwrite: true });
    gsap.fromTo("[data-needle]", { rotate: -28 }, { rotate: -8, duration: 0.7, ease: "power3.out", overwrite: true });
  }, [active]);

  if (artists.length === 0) {
    return (
      <div className="mx-auto max-w-[1700px] px-5 md:px-10">
        <div className="flex flex-col gap-6 border-y border-white/10 py-14 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-4xl uppercase text-white md:text-6xl">
            Line-ups <span className="text-volt">drop</span> with every show.
          </p>
          <p className="max-w-sm text-fog">Artists appear here once their performances with Passion Live are confirmed and published.</p>
        </div>
      </div>
    );
  }

  const current = artists[active];

  return (
    <div className="mx-auto grid max-w-[1700px] grid-cols-1 gap-12 overflow-x-clip px-5 py-4 md:px-10 lg:grid-cols-12 lg:items-center">
      {/* The deck */}
      <div className="relative lg:order-2 lg:col-span-5">
        <div className="relative mx-auto aspect-square w-[min(82vw,460px)]">
          {/* platter glow */}
          <div className="absolute inset-[-8%] rounded-full bg-[radial-gradient(circle,rgb(255_90_31/0.35),rgb(139_92_255/0.18)_45%,transparent_70%)] blur-2xl" aria-hidden="true" />
          {/* record */}
          <div className="absolute inset-0 animate-[spin_3.2s_linear_infinite] rounded-full bg-[repeating-radial-gradient(circle_at_50%_50%,#0b0b0f_0px,#0b0b0f_2px,#17171d_3px,#0b0b0f_4px)] shadow-[0_30px_80px_-20px_rgb(0_0_0/0.9),inset_0_0_0_2px_rgb(255_255_255/0.04)] motion-reduce:animate-none">
            {/* light catching the grooves */}
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgb(255_255_255/0.10)_20deg,transparent_60deg,transparent_180deg,rgb(255_255_255/0.08)_200deg,transparent_240deg)]" />
            {/* label */}
            <div ref={label} className="absolute inset-[31%] grid place-items-center rounded-full bg-[conic-gradient(from_200deg,#ff5a1f,#ff2e88,#8b5cff,#2ec5ff,#c6ff3d,#ff5a1f)] p-[6%] text-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <path id="labelArc" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
                </defs>
                <text className="fill-black font-grotesk text-[7px] font-bold uppercase tracking-[0.25em]">
                  <textPath href="#labelArc">Passion Live · side A · Passion Live · side A ·</textPath>
                </text>
              </svg>
              {current.image && (
                <span className="absolute inset-[3%] overflow-hidden rounded-full" aria-hidden="true">
                  <MediaImage key={current.image} src={current.image} alt="" fill sizes="200px" className="object-cover" />
                  <span className="absolute inset-0 bg-black/45" />
                </span>
              )}
              <span className={`relative max-w-[78%] font-display text-[clamp(0.9rem,1.6vw,1.35rem)] uppercase leading-[0.95] ${current.image ? "text-white [text-shadow:0_1px_8px_rgb(0_0_0/0.7)]" : "text-black"}`}>{current.name}</span>
              <span className="absolute left-1/2 top-1/2 size-[9%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-void" />
            </div>
          </div>
          {/* tonearm */}
          <svg data-needle="" viewBox="0 0 100 100" className="absolute -right-[6%] -top-[4%] h-[70%] w-[40%] origin-[78%_10%]" style={{ transform: "rotate(-8deg)" }} aria-hidden="true">
            <circle cx="78" cy="10" r="8" fill="#2a2a33" stroke="#555" />
            <path d="M78 10 L70 70 L52 88" stroke="#c9c9d1" strokeWidth="3" fill="none" strokeLinecap="round" />
            <rect x="44" y="84" width="14" height="9" rx="2" fill="#ff5a1f" transform="rotate(-40 51 88)" />
          </svg>
        </div>

        <div className="mx-auto mt-8 flex w-[min(82vw,460px)] items-center justify-between gap-4 border-t border-white/10 pt-5">
          <div className="min-w-0">
            <p className="font-grotesk text-[0.62rem] uppercase tracking-[0.35em] text-volt">Now playing</p>
            <p className="mt-1 truncate font-display text-2xl uppercase text-white">{current.name}</p>
          </div>
          <span className="flex h-7 shrink-0 items-end gap-[3px]" aria-hidden="true">
            {[0.5, 1, 0.7, 0.9, 0.4, 0.8].map((v, k) => (
              <span key={k} className="w-[4px] origin-bottom animate-[eq_0.8s_ease-in-out_infinite] bg-gradient-to-t from-volt to-hot motion-reduce:animate-none" style={{ height: `${v * 100}%`, animationDelay: `${k * 0.11}s` }} />
            ))}
          </span>
        </div>
      </div>

      {/* The line-up */}
      <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-1 lg:order-1 lg:col-span-7" aria-label="Artists">
        {artists.map((a, i) => {
          const on = i === active;
          const cls = `glitch group inline-flex items-baseline gap-3 py-1 text-left font-display text-[clamp(2.1rem,4.5vw,4.6rem)] uppercase leading-[0.95] max-sm:w-full max-sm:justify-between transition-[color,transform,opacity] duration-300 ${
            on ? `${tones[i % tones.length] === "text-white" ? "text-volt" : tones[i % tones.length]} -rotate-1 scale-[1.03]` : "text-white/85 hover:text-white"
          }`;
          const meta = (
            <span className="shrink-0 font-grotesk text-[0.6rem] tracking-[0.25em] text-white/40">
              {a.events.length > 0 ? `${a.events.length} ${a.events.length === 1 ? "show" : "shows"}` : "collab"}
            </span>
          );
          return (
            <li key={a.name} className="inline-flex items-baseline gap-5 max-sm:w-full max-sm:border-b max-sm:border-white/10">
              {a.events.length > 0 ? (
                <Link href={`/concerts/events/${a.events[0].slug}`} onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} className={cls} data-text={a.name}>
                  {a.name}
                  {meta}
                </Link>
              ) : (
                <button type="button" onPointerEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-pressed={on} className={cls} data-text={a.name}>
                  {a.name}
                  {meta}
                </button>
              )}
              {i < artists.length - 1 && <span className="font-display text-3xl text-volt max-sm:hidden md:text-5xl" aria-hidden="true">✦</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
