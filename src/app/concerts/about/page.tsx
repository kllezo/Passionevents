import { Pic } from "@/components/shared/Pic";
import { stock } from "@/content/media";
import { foundersList } from "@/content/founders";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { LivePageHero } from "@/components/live/LivePageHero";
import { WhatWeHandle, Collaborate } from "@/components/live/HandleAndCollab";
import { GuitarSection } from "@/components/live/GuitarSection";
import { FinalCTA } from "@/components/live/FinalCTA";
import { VelocityMarquee } from "@/components/live/VelocityMarquee";
import { Waveform } from "@/components/live/Waveform";
import { RevealText } from "@/motion/RevealText";

export const metadata = pageMetadata({
  title: "Our Story",
  description: "Passion Live is the concert and live entertainment experience of Passion Events — artist bookings, concert planning, production and complete show execution.",
  path: "/concerts/about",
  image: "/brand/og-passion-live.jpg",
  live: true,
});

const process = [
  { k: "01", t: "Concept", d: "The artist, the audience and the room — what kind of night is this?" },
  { k: "02", t: "Book", d: "Artists, venue, production partners and permissions locked in." },
  { k: "03", t: "Build", d: "Stage, sound and lighting designed, promotion launched." },
  { k: "04", t: "Show", d: "Doors to encore, run by one team on the ground." },
];

export default function LiveAboutPage() {
  const tanush = foundersList[0];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Passion Live", path: "/concerts" }, { name: "About", path: "/concerts/about" }])} />
      <LivePageHero
        eyebrow="About Passion Live"
        title={
          <>
            Built for the <span className="text-volt">night.</span>
          </>
        }
        intro={<p>Passion Live is the concert and live-entertainment side of Passion Events — the same obsession with detail, turned up loud.</p>}
        image={stock.liveBand}
      />

      <section className="bg-void py-24 md:py-28">
        <div className="mx-auto grid max-w-[1700px] gap-14 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <RevealText as="p" flavor="live" split="words" className="font-display text-[clamp(2.2rem,3.7vw,4rem)] uppercase leading-[1] text-white">
              Artists deserve a stage that does them justice. Audiences deserve a night they talk about for years. We build both.
            </RevealText>
          </div>
          <div className="space-y-6 font-grotesk text-lg leading-relaxed text-fog lg:col-span-4 lg:col-start-9">
            <p>From intimate live sets to full-scale concerts, Passion Live handles artist bookings, venue coordination, stage production, sound, lighting, promotion and the audience experience.</p>
            <p>Brands and venues can partner with us on a single night or a series — we bring the production team and the plan.</p>
          </div>
        </div>
        <div className="mx-auto mt-20 h-40 max-w-[1700px] px-5 md:px-10">
          <Waveform variant="circle" className="h-full w-full" />
        </div>
      </section>

      <section className="bg-char py-24 md:py-32" aria-labelledby="process-title">
        <div className="mx-auto max-w-[1700px] px-5 md:px-10">
          <p className="font-grotesk text-[0.72rem] uppercase tracking-[0.4em] text-hot">How a show happens</p>
          <h2 id="process-title" className="sr-only">
            How a show happens
          </h2>
          <ol className="mt-12 grid gap-px bg-white/10 md:grid-cols-4">
            {process.map((p) => (
              <li key={p.k} className="group bg-char p-8 transition-colors hover:bg-graphite">
                <span className="font-grotesk text-xs tracking-[0.3em] text-hot">{p.k}</span>
                <p className="mt-10 font-display text-5xl uppercase text-white transition-colors group-hover:text-hot">{p.t}</p>
                <p className="mt-4 text-sm text-fog">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <GuitarSection />
      <WhatWeHandle index="03" />

      {tanush.image && (
        <section className="relative overflow-hidden bg-void py-24 md:py-28" aria-labelledby="founder-live">
          <div className="mx-auto grid max-w-[1700px] gap-12 px-5 md:px-10 lg:grid-cols-12 lg:items-center">
            <div className="relative lg:col-span-5">
              <div className="neon-border relative aspect-[3/4] overflow-hidden">
                <Pic image={tanush.image} sizes="(max-width: 1024px) 92vw, 40vw" className="object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
              </div>
              <p className="mt-3 font-grotesk text-xs text-white/40">{tanush.image.credit}</p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="font-grotesk text-[0.72rem] uppercase tracking-[0.4em] text-volt">Behind Passion Live</p>
              <h2 id="founder-live" className="mt-6 font-display text-[clamp(3rem,6.4vw,6.9rem)] uppercase leading-[0.86] text-white">
                {tanush.displayName}
              </h2>
              <p className="mt-4 font-grotesk uppercase tracking-[0.2em] text-fog">{tanush.role}</p>
              <p className="mt-8 max-w-xl font-grotesk text-lg leading-relaxed text-white/75">{tanush.bio[tanush.bio.length - 1]}</p>
            </div>
          </div>
        </section>
      )}

      <VelocityMarquee words={["Artists", "Audiences", "Moments"]} className="bg-void" />
      <Collaborate index="05" />
      <FinalCTA />
    </>
  );
}
