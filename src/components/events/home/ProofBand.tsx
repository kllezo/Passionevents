import { featuredArtists, ownWords, proofStats, instagramUrl } from "@/content/proof";
import { Counter, Marquee } from "@/motion/primitives";
import { RevealText } from "@/motion/RevealText";
import { InstagramIcon } from "@/components/shared/InstagramIcon";
import { Bloom } from "../botanical/Sprig";

/**
 * Trust band directly under the hero: verified numbers, the company's own
 * words and the artists it has worked with. Sources live in content/proof.ts.
 */
export function ProofBand() {
  return (
    <section className="relative overflow-hidden border-y border-rose/20 bg-paper py-16 md:py-24" aria-labelledby="proof-title">
      <h2 id="proof-title" className="sr-only">
        Passion Events in numbers
      </h2>
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 md:gap-14 md:px-10 lg:grid-cols-12 lg:items-center">
        <div className="grid grid-cols-3 gap-3 max-sm:rounded-[1.5rem] max-sm:bg-ivory/80 max-sm:p-4 max-sm:shadow-[0_24px_50px_-35px_rgb(94_52_64/0.55)] max-sm:ring-1 max-sm:ring-rose/15 sm:gap-8 lg:col-span-6">
          {proofStats.map((s) => (
            <div key={s.label} className="border-l border-rose/40 pl-3 max-sm:first:border-l-0 max-sm:first:pl-0 sm:pl-5">
              <Counter to={s.value} suffix={s.suffix} className="block font-serif text-[clamp(2.3rem,6vw,5.5rem)] font-light leading-none text-ink" />
              <p className="mt-2 max-w-[14rem] text-[0.68rem] leading-snug text-stone sm:mt-3 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="min-w-0 lg:col-span-6 lg:pl-10">
          <RevealText as="p" className="font-serif text-[clamp(2rem,3.4vw,3.2rem)] font-light italic leading-[1.1] text-rose-deep">
            “{ownWords.line}”
          </RevealText>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/80">{ownWords.scope}</p>
          <div className="mt-8">
            <p className="eyebrow text-stone">Artists from our shows</p>
            {/* phones: the artists glide past as a ribbon */}
            <Marquee duration={26} className="-mx-5 mt-4 border-y border-rose/20 py-3 sm:hidden">
              {[...featuredArtists, ...featuredArtists].map((a, i) => (
                <span key={`${a.name}-${i}`} className="flex items-center gap-4 pr-4 font-serif text-2xl italic text-ink">
                  {a.name}
                  <svg viewBox="-12 -12 24 24" className="size-3.5" aria-hidden="true">
                    <Bloom r={9} />
                  </svg>
                </span>
              ))}
            </Marquee>
            <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-serif text-xl text-ink max-sm:sr-only md:text-2xl">
              {featuredArtists.map((a, i) => (
                <li key={a.name} className="flex items-center gap-4">
                  {i > 0 && (
                    <svg viewBox="-12 -12 24 24" className="size-3.5" aria-hidden="true">
                      <Bloom r={9} />
                    </svg>
                  )}
                  {a.name}
                </li>
              ))}
            </ul>
          </div>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="link-underline mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-ink">
            <InstagramIcon className="size-4" /> See our work on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
