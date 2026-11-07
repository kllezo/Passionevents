"use client";

import Link from "next/link";
import { useState } from "react";
import type { VerifiedArtist } from "@/lib/events";
import { MediaImage } from "@/components/shared/MediaImage";

/** Artists discovered from published shows only — never invented. */
export function ArtistsList({ artists }: { artists: VerifiedArtist[] }) {
  const [active, setActive] = useState(0);

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
    <div className="mx-auto grid max-w-[1700px] gap-10 px-5 md:px-10 lg:grid-cols-12">
      <ul className="lg:col-span-7" onPointerLeave={() => undefined}>
        {artists.map((a, i) => (
          <li key={a.name} className="border-b border-white/10">
            {a.events.length > 0 ? (
              <Link
                href={`/concerts/events/${a.events[0].slug}`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="glitch group flex items-baseline justify-between gap-6 py-5"
                data-text={a.name}
              >
              <span className={`font-display text-[clamp(2.4rem,6vw,5.5rem)] uppercase leading-none transition-colors ${i === active ? "text-volt" : "text-white"}`}>{a.name}</span>
              <span className="shrink-0 font-grotesk text-xs uppercase tracking-[0.25em] text-white/40">
                {a.events.length} {a.events.length === 1 ? "show" : "shows"}
              </span>
              </Link>
            ) : (
              <div onPointerEnter={() => setActive(i)} className="glitch flex items-baseline justify-between gap-6 py-5" data-text={a.name}>
              <span className={`font-display text-[clamp(2.4rem,6vw,5.5rem)] uppercase leading-none transition-colors ${i === active ? "text-volt" : "text-white"}`}>{a.name}</span>
              <span className="shrink-0 font-grotesk text-xs uppercase tracking-[0.25em] text-white/40">
                Collaborated
              </span>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="relative hidden lg:col-span-5 lg:block">
        <div className="sticky top-28 aspect-[4/5] overflow-hidden bg-graphite">
          {current?.image ? (
            <MediaImage key={current.image} src={current.image} alt={`${current.name}`} fill sizes="35vw" className="object-cover" />
          ) : (
            <div className="live-grid-bg grid h-full place-items-center font-display text-6xl uppercase text-white/20">{current?.name}</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-void/70 to-transparent" />
        </div>
      </div>
    </div>
  );
}
