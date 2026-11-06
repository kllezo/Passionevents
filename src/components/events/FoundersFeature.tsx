import Image from "next/image";
import { Pic } from "@/components/shared/Pic";
import { foundersList } from "@/content/founders";
import { ImageReveal, Parallax } from "@/motion/primitives";
import { RevealText } from "@/motion/RevealText";
import { SectionLabel } from "./SectionLabel";
import { EventsButton } from "./Button";
import { Bloom } from "./botanical/Sprig";

/**
 * Founders — built only from client-supplied facts (names, roles, portrait).
 * Edit copy in src/content/founders.ts.
 */
export function FoundersFeature({ index = "07", detailed = false }: { index?: string; detailed?: boolean }) {
  const [tanush, ramya] = foundersList;
  return (
    <section className="relative overflow-hidden bg-ivory py-28 md:py-40" aria-labelledby="founders-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel index={index}>The founders</SectionLabel>
            <RevealText as="h2" id="founders-title" className="mt-8 font-serif text-[clamp(2.8rem,6vw,6.4rem)] font-light leading-[0.92] tracking-[-0.02em] text-ink">
              By Ramya <em className="font-script text-[1.1em] not-italic text-coral">&amp;</em> Tanush
            </RevealText>
          </div>
          <p className="max-w-sm text-stone">Every Passion Events celebration carries the founders&apos; signature — the same one written beneath our logo.</p>
        </div>

        <div className="mt-20 grid items-center gap-16 lg:grid-cols-12">
          {/* Portrait */}
          <div className="relative lg:col-span-5">
            {tanush.image && (
              <>
                <ImageReveal shape="arch" parallax={5} className="arch aspect-[3/4] w-full bg-cream">
                  <Pic image={tanush.image} sizes="(max-width: 1024px) 92vw, 40vw" className="object-top" />
                </ImageReveal>
                <svg viewBox="0 0 500 660" className="pointer-events-none absolute inset-[-4%] h-[108%] w-[108%] overflow-visible" aria-hidden="true">
                  <ellipse cx="250" cy="330" rx="236" ry="316" fill="none" stroke="var(--color-rose)" strokeWidth="1.2" transform="rotate(-5 250 330)" />
                </svg>
                <Parallax speed={-18} className="absolute -right-4 top-[12%] md:-right-10">
                  <svg viewBox="-24 -24 48 48" className="size-16 animate-float" aria-hidden="true">
                    <Bloom r={18} />
                  </svg>
                </Parallax>
                <p className="mt-4 text-xs text-stone-light">{tanush.image.credit}</p>
              </>
            )}
          </div>

          {/* Story */}
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow text-rose-deep">{tanush.role}</p>
            <RevealText as="h3" className="mt-5 font-serif text-[clamp(3rem,6vw,6rem)] font-light leading-[0.95] text-ink">
              {tanush.displayName}
            </RevealText>
            <p className="mt-2 font-serif text-xl italic text-stone">{tanush.name}</p>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/80">
              {(detailed ? tanush.bio : tanush.bio.slice(0, 2)).map((p) => (
                <RevealText as="p" key={p.slice(0, 20)}>
                  {p}
                </RevealText>
              ))}
            </div>
            {tanush.focus.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {tanush.focus.map((f) => (
                  <li key={f} className="rounded-full border border-rose/40 px-4 py-1.5 text-sm text-rose-deep">
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {/* Co-founder */}
            <div className="mt-14 flex items-center gap-6 border-t border-ink/10 pt-10">
              <div className="relative grid size-24 shrink-0 place-items-center rounded-full border border-rose/50 bg-cream">
                {ramya.image ? (
                  <Pic image={ramya.image} className="rounded-full object-cover" sizes="96px" />
                ) : (
                  <span className="font-script text-5xl text-coral">R</span>
                )}
              </div>
              <div>
                <p className="font-serif text-3xl text-ink">{ramya.displayName}</p>
                <p className="eyebrow mt-1 text-rose-deep">{ramya.role}</p>
                {detailed && <p className="mt-3 max-w-md text-stone">{ramya.bio[0]}</p>}
              </div>
            </div>

            {!detailed && (
              <div className="mt-12">
                <EventsButton href="/founders" variant="outline" cursor="Meet">
                  Meet the founders
                </EventsButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
