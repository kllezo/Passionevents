import { foundersList, type Founder } from "@/content/founders";
import { ScatterText } from "@/motion/ScatterText";
import { RevealText } from "@/motion/RevealText";
import { ReelRail } from "@/components/shared/Reels";
import { FounderPortrait } from "./FounderPortrait";
import { FoundersJoin } from "./FoundersJoin";
import { SectionLabel } from "./SectionLabel";
import { EventsButton } from "./Button";

/**
 * Founders — Ramya & Tanush, side by side as equals. Two arched portraits
 * assemble as they scroll in, joined by a drawn line and the script "&" of
 * the brand byline. Built only from client-supplied facts; edit copy in
 * src/content/founders.ts.
 */
export function FoundersFeature({ index = "07", detailed = false }: { index?: string; detailed?: boolean }) {
  const [tanush, ramya] = foundersList;
  return (
    <section className="relative overflow-hidden bg-ivory py-28 md:py-40" aria-labelledby="founders-title">
      <div className="pointer-events-none absolute left-1/2 top-1/3 size-[900px] -translate-x-1/2 rounded-full bg-blush/25 blur-[160px]" />
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col items-center text-center">
          <SectionLabel index={index}>The founders</SectionLabel>
          <RevealText as={detailed ? "h1" : "h2"} id="founders-title" className="mt-8 font-serif text-[clamp(3rem,7vw,7.4rem)] font-light leading-[0.9] tracking-[-0.02em] text-ink">
            By Ramya <em className="font-script text-[1.1em] not-italic text-coral">&amp;</em> Tanush
          </RevealText>
          <p className="mt-6 max-w-lg text-lg text-stone">Two founders, one signature — the same one written beneath our logo, on every celebration we create.</p>
        </div>

        <div className="relative mt-20 grid gap-20 md:mt-28 grid-cols-1 lg:grid-cols-12 lg:gap-0">
          <Profile founder={tanush} detailed={detailed} className="lg:col-span-5" />
          <FoundersJoin className="hidden lg:col-span-2 lg:flex" />
          <Profile founder={ramya} detailed={detailed} className="lg:col-span-5 lg:mt-48" />
        </div>

        <div className="mt-24 grid items-center gap-12 border-t border-ink/10 pt-16 md:mt-32 grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-rose-deep">Shared promise</p>
            <RevealText as="p" className="mt-5 font-serif text-[clamp(2.4rem,4.6vw,4.6rem)] font-light italic leading-[1.02] text-ink">
              Big or small, <span className="text-rose-deep">we make it special.</span>
            </RevealText>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">Whichever founder you meet first, you get both — one plan, one team, and the same care from the first call to the last guest leaving.</p>
            {!detailed && (
              <div className="mt-10">
                <EventsButton href="/founders" variant="outline">
                  Meet the founders
                </EventsButton>
              </div>
            )}
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="eyebrow mb-5 text-stone">Behind the scenes</p>
            <div className="max-w-[270px] max-lg:mx-auto">
              <ReelRail ids={["DXmBXWMkzwd"]} label="Founder behind-the-scenes reel" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Profile({ founder, detailed, className = "" }: { founder: Founder; detailed: boolean; className?: string }) {
  const bio = detailed ? founder.bio : founder.bio.slice(0, 2);
  return (
    <article className={className}>
      {founder.image && <FounderPortrait image={founder.image} />}
      <div className="mt-10 max-sm:px-1">
        <p className="eyebrow text-rose-deep">{founder.role}</p>
        <ScatterText as="h3" className="mt-4 block font-serif text-[clamp(2.8rem,5vw,5.2rem)] font-light leading-[0.95] text-ink">
          {founder.displayName}
        </ScatterText>
        {founder.name !== founder.displayName && <p className="mt-2 font-serif text-xl italic text-stone">{founder.name}</p>}
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/80">
          {bio.map((p) => (
            <RevealText as="p" key={p.slice(0, 24)}>
              {p}
            </RevealText>
          ))}
        </div>
        {founder.focus.length > 0 && (
          <ul className="mt-7 flex flex-wrap gap-2">
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
