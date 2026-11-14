import { foundersList, type Founder } from "@/content/founders";
import { RevealText } from "@/motion/RevealText";
import { FounderPortrait } from "./FounderPortrait";
import { SectionLabel } from "./SectionLabel";
import { Bloom } from "./botanical/Sprig";
import { PromiseBlock } from "./PromiseBlock";

/**
 * Founders — Tanush, then Ramya, stacked and alternating (portrait left,
 * then portrait right) so both get the same space. The brand motto follows
 * as their shared philosophy; it appears nowhere else on the site.
 * Built only from client-supplied facts; edit copy in src/content/founders.ts.
 */
export function FoundersFeature({ index = "07", detailed = false }: { index?: string; detailed?: boolean }) {
  const [tanush, ramya] = foundersList;
  return (
    <section className="relative overflow-hidden bg-ivory py-24 md:py-28" aria-labelledby="founders-title">
      <div className="pointer-events-none absolute left-1/2 top-1/4 size-[900px] -translate-x-1/2 rounded-full bg-blush/20 blur-[160px]" />
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col items-center text-center">
          <SectionLabel index={index}>The founders</SectionLabel>
          <RevealText as={detailed ? "h1" : "h2"} id="founders-title" className="mt-6 font-serif text-[clamp(2.6rem,5vw,5.2rem)] font-light leading-[0.95] tracking-[-0.02em] text-ink">
            By Ramya <em className="font-script text-[1.1em] not-italic text-coral">&amp;</em> Tanush
          </RevealText>
          <p className="mt-5 max-w-lg text-lg text-stone">Two founders, one signature: the same one written beneath our logo.</p>
        </div>

        <div className="mt-16 space-y-20 md:mt-20 md:space-y-28">
          <Profile founder={tanush} detailed={detailed} side="left" />
          <Divider />
          <Profile founder={ramya} detailed={detailed} side="right" />
        </div>

        {/* The shared philosophy, said once */}
        <PromiseBlock detailed={detailed} />
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-5" aria-hidden="true">
      <span className="h-px w-24 bg-gradient-to-r from-transparent to-rose/50" />
      <svg viewBox="-20 -20 40 40" className="size-9">
        <Bloom r={15} />
      </svg>
      <span className="h-px w-24 bg-gradient-to-l from-transparent to-rose/50" />
    </div>
  );
}

function Profile({ founder, detailed, side }: { founder: Founder; detailed: boolean; side: "left" | "right" }) {
  const bio = detailed ? founder.bio : founder.bio.slice(0, 2);
  const right = side === "right";
  return (
    <article className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-8 lg:gap-12">
      {founder.image && (
        <div className={`mx-auto w-full max-w-[420px] md:col-span-5 md:max-w-none ${right ? "md:order-2 md:col-start-8" : ""}`}>
          <FounderPortrait image={founder.image} />
        </div>
      )}
      <div className={`md:col-span-6 ${right ? "md:order-1 md:col-start-1 md:text-right" : "md:col-start-7"}`}>
        <p className="eyebrow text-rose-deep">{founder.role}</p>
        {detailed ? (
          <h2 className="mt-4 font-serif text-[clamp(2.4rem,3.8vw,3.9rem)] font-light leading-[0.98] text-ink">{founder.displayName}</h2>
        ) : (
          <h3 className="mt-4 font-serif text-[clamp(2.4rem,3.8vw,3.9rem)] font-light leading-[0.98] text-ink">{founder.displayName}</h3>
        )}
        {founder.name !== founder.displayName && <p className="mt-2 font-serif text-xl italic text-stone">{founder.name}</p>}
        <div className={`mt-6 space-y-4 text-lg leading-relaxed text-ink/80 ${right ? "md:ml-auto" : ""} max-w-xl`}>
          {bio.map((p) => (
            <RevealText as="p" key={p.slice(0, 24)}>
              {p}
            </RevealText>
          ))}
        </div>
        {founder.focus.length > 0 && (
          <ul className={`mt-7 flex flex-wrap gap-2 ${right ? "md:justify-end" : ""}`}>
            {founder.focus.map((f) => (
              <li key={f} className="rounded-full border border-rose/40 px-4 py-1.5 text-sm text-rose-deep">
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
