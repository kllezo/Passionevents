import { Pic } from "@/components/shared/Pic";
import Link from "next/link";
import { liveHandles, collaborators } from "@/content/live";
import { RevealText } from "@/motion/RevealText";

export function WhatWeHandle({ index = "06" }: { index?: string }) {
  return (
    <section className="relative bg-void py-28 md:py-40" aria-labelledby="handle-title">
      <div className="mx-auto max-w-[1700px] px-5 md:px-10">
        <p className="font-grotesk text-[0.72rem] uppercase tracking-[0.4em] text-laser">({index}) What we handle</p>
        <RevealText as="h2" id="handle-title" flavor="live" split="chars" className="mt-6 max-w-5xl font-display text-[clamp(3rem,8vw,8rem)] uppercase leading-[0.86] text-white">
          Everything between <span className="text-laser">doors</span> &amp; encore.
        </RevealText>
        <ol className="mt-16 grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {liveHandles.map((h, i) => (
            <li key={h.title} className="group relative overflow-hidden border-b border-r border-white/10 p-7 transition-colors duration-300 hover:bg-white/[0.03] md:p-9">
              <span className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-volt via-hot to-violet transition-transform duration-500 group-hover:scale-x-100" />
              <div className="flex items-start justify-between">
                <span className="font-grotesk text-xs tracking-[0.3em] text-white/40">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex h-6 items-end gap-[3px]" aria-hidden="true">
                  {[0.4, 0.9, 0.6, 1, 0.5].map((v, k) => (
                    <span
                      key={k}
                      className="w-[3px] origin-bottom bg-white/30 transition-colors group-hover:animate-[eq_0.7s_ease-in-out_infinite] group-hover:bg-volt"
                      style={{ height: `${v * 100}%`, animationDelay: `${k * 0.09}s` }}
                    />
                  ))}
                </span>
              </div>
              <h3 className="glitch mt-10 font-display text-3xl uppercase leading-none text-white md:text-4xl" data-text={h.title}>
                {h.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-fog">{h.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Collaborate({ index = "07", showCta = true }: { index?: string; showCta?: boolean }) {
  return (
    <section id="collaborate" className="relative scroll-mt-20 overflow-hidden bg-char py-28 md:py-40" aria-labelledby="collab-title">
      <div className="mx-auto max-w-[1700px] px-5 md:px-10">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="font-grotesk text-[0.72rem] uppercase tracking-[0.4em] text-violet">({index}) Collaborate</p>
            <RevealText as="h2" id="collab-title" flavor="live" split="chars" className="mt-6 font-display text-[clamp(3rem,8vw,8rem)] uppercase leading-[0.86] text-white">
              Build the <span className="text-violet neon-text-violet">night</span> with us.
            </RevealText>
          </div>
          <p className="text-fog md:col-span-4">Brands, sponsors, artists, venues and production partners — the best nights are made together.</p>
        </div>
        <ul className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {collaborators.map((c, i) => (
            <li key={c.key} className={`group relative min-h-[420px] overflow-hidden ${i === 0 ? "lg:col-span-2" : ""}`}>
              <Link href={`/concerts/partners?type=${c.key}#partner-form`} className="absolute inset-0 flex flex-col justify-end p-6">
                <Pic image={c.image} sizes="(max-width: 768px) 92vw, 30vw" className="opacity-50 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-80 group-hover:grayscale-0" />
                <span className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-transparent" />
                <span className="relative font-grotesk text-xs tracking-[0.3em] text-volt">0{i + 1}</span>
                <span className="relative mt-3 font-display text-4xl uppercase leading-none text-white">{c.title}</span>
                <span className="relative mt-3 text-sm leading-relaxed text-white/70">{c.text}</span>
                <span className="relative mt-5 inline-flex items-center gap-2 font-grotesk text-[0.7rem] uppercase tracking-[0.25em] text-white transition-colors group-hover:text-volt">
                  Start a conversation ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {showCta && (
          <p className="mt-10 font-grotesk text-sm text-fog">
            Or go straight to the <Link href="/concerts/partners#partner-form" className="text-white underline underline-offset-4 hover:text-volt">partnership form</Link>.
          </p>
        )}
      </div>
    </section>
  );
}
