"use client";

import { useMemo, useState } from "react";
import type { PublicEvent } from "@/lib/events";
import { EVENT_CATEGORY_LABEL, type EventCategory } from "@/lib/constants";
import { ScrollTrigger } from "@/motion/gsap";
import { PortfolioGrid } from "./PortfolioGrid";

/** Category filter over the published portfolio (client-side, instant). */
export function PortfolioExplorer({ events }: { events: PublicEvent[] }) {
  const [filter, setFilter] = useState<string>("ALL");
  const present = useMemo(() => [...new Set(events.map((e) => e.category))], [events]);
  const shown = filter === "ALL" ? events : events.filter((e) => e.category === filter);

  return (
    <>
      {present.length > 1 && (
        <div role="group" aria-label="Filter by category" className="mb-14 flex flex-wrap gap-2">
          {["ALL", ...present].map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={filter === k}
              onClick={() => {
                setFilter(k);
                requestAnimationFrame(() => ScrollTrigger.refresh());
              }}
              className="rounded-full border border-ink/15 px-5 py-2.5 text-sm transition-colors aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-ivory"
            >
              {k === "ALL" ? "All work" : EVENT_CATEGORY_LABEL[k as EventCategory] ?? k}
            </button>
          ))}
        </div>
      )}
      <PortfolioGrid key={filter} events={shown} />
    </>
  );
}
