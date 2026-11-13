"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Pic } from "@/components/shared/Pic";
import { collaborators } from "@/content/live";

/**
 * Partner types as an expanding row. Desktop: the hovered or focused card
 * widens, its photo comes to full colour and its text and CTA reveal while
 * the others contract. Phones and tablets: a stack where a tap opens a card.
 * One state drives both, so keyboard focus works everywhere.
 */
export function PartnerCards() {
  const [active, setActive] = useState(0);
  const base = useId();

  return (
    <ul className="mt-14 flex flex-col gap-3 lg:h-[min(34rem,68vh)] lg:flex-row lg:gap-3" aria-label="Partner types">
      {collaborators.map((c, i) => {
        const open = i === active;
        const panel = `${base}-p${i}`;
        return (
          <li
            key={c.key}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={`group relative isolate overflow-hidden rounded-[1.25rem] bg-void ring-1 ring-white/10 transition-[flex-grow,height] duration-700 ease-[cubic-bezier(.16,1,.3,1)] lg:min-w-0 lg:basis-0 ${open ? "lg:grow-[3.4]" : "lg:grow"} ${open ? "h-[26rem]" : "h-24"} lg:h-auto`}
          >
            <Pic
              image={c.image}
              alt=""
              sizes="(max-width: 1024px) 92vw, 46vw"
              tone="dark"
              className={`transition-[filter,opacity,transform] duration-1000 ${open ? "scale-100 opacity-80 grayscale-0" : "scale-105 opacity-35 grayscale"}`}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-void/10" />

            {/* Header: the tap target on phones, a label on desktop */}
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panel}
              aria-label={c.title}
              onClick={() => setActive(open ? -1 : i)}
              className="relative flex w-full items-center gap-4 p-6 text-left lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-0"
            >
              <span className="font-grotesk text-xs tracking-[0.3em] text-volt">0{i + 1}</span>
              <span aria-hidden="true" className="font-display text-2xl uppercase leading-none text-white lg:hidden">
                {c.title}
              </span>
              <Plus className={`ml-auto size-5 text-white transition-transform duration-500 lg:hidden ${open ? "rotate-45" : ""}`} aria-hidden="true" />
            </button>

            <div className="absolute inset-x-0 bottom-0 p-6 lg:p-7">
              <h3 className={`font-display uppercase leading-[0.9] text-white transition-[font-size] duration-700 max-lg:hidden ${open ? "text-[clamp(2.4rem,3.4vw,3.8rem)]" : "text-[clamp(1.6rem,1.9vw,2.2rem)]"}`}>
                {c.title}
              </h3>
              <div
                id={panel}
                role="region"
                aria-label={c.title}
                className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 md:text-base">{c.text}</p>
                  <Link
                    href={`/concerts/partners?type=${c.key}#partner-form`}
                    tabIndex={open ? 0 : -1}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-grotesk text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:bg-volt"
                  >
                    Start a conversation <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
