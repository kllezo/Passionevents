import { categories } from "@/content/events";
import { services } from "@/content/services";
import { stock } from "@/content/media";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { Pic } from "@/components/shared/Pic";
import { ReelRail } from "@/components/shared/Reels";
import { SectionLabel } from "@/components/events/SectionLabel";
import { EnquirySection } from "@/components/events/EnquirySection";
import { Bloom } from "@/components/events/botanical/Sprig";
import { PrivateHero } from "@/components/events/private/PrivateHero";
import { OccasionCards } from "@/components/events/private/OccasionCards";
import { RevealText } from "@/motion/RevealText";
import { StaggerList } from "@/motion/StaggerList";

export const metadata = pageMetadata({
  title: "Private Celebrations & Parties",
  description: "Birthdays, anniversaries, engagements and milestone celebrations — thoughtfully styled and managed by Passion Events in Hyderabad and across India.",
  path: "/private-events",
});

const steps = [
  { n: "01", title: "Tell us the occasion", text: "Who it is for, how many guests, the date and the feeling you want." },
  { n: "02", title: "We design the theme", text: "Colours, décor, food, entertainment and favours, planned as one idea." },
  { n: "03", title: "We style and host", text: "Our team sets up, runs the celebration and clears away afterwards." },
];

/** Private celebrations: hero, occasions, how it works, what we handle, reels, enquiry. */
export default function PrivateEventsPage() {
  const c = categories.find((x) => x.key === "private")!;
  const service = services.find((s) => s.key === "private");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: c.title, path: c.href },
          ]),
          ...(service ? [serviceJsonLd(service)] : []),
        ]}
      />
      <PrivateHero title={c.title} description={c.description} />
      <OccasionCards />

      {/* How it works */}
      <section className="bg-ivory py-24 md:py-28" aria-labelledby="how-title">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <SectionLabel index="02">How it works</SectionLabel>
          <RevealText as="h2" id="how-title" className="mt-6 max-w-3xl font-serif text-[clamp(2.3rem,3.8vw,3.9rem)] font-light leading-[1] text-ink">
            You enjoy the party. <em className="text-rose-deep">We handle the rest.</em>
          </RevealText>
          <StaggerList className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
            {steps.map((s) => (
              <li key={s.n} className="relative border-t border-ink/15 pt-6">
                <svg viewBox="-14 -14 28 28" className="absolute -top-4 left-0 size-8 bg-ivory" aria-hidden="true">
                  <Bloom r={11} />
                </svg>
                <p className="mt-3 font-serif text-sm italic text-rose-deep">{s.n}</p>
                <h3 className="mt-1 font-serif text-2xl text-ink md:text-3xl">{s.title}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-stone">{s.text}</p>
              </li>
            ))}
          </StaggerList>
        </div>
      </section>

      {/* What we handle */}
      <section className="bg-cream py-24 md:py-28" aria-labelledby="handle-title">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-12 px-5 md:px-10 lg:grid-cols-12">
          <div className="relative order-2 lg:order-1 lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] bg-blush/40 shadow-[0_50px_100px_-50px_rgb(94_52_64/0.8)]">
              <Pic image={stock.privateTable} sizes="(max-width: 1024px) 90vw, 36vw" />
            </div>
            <p className="mt-3 text-[0.62rem] uppercase tracking-[0.2em] text-stone/70">Illustrative imagery</p>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
            <SectionLabel index="03">What we handle</SectionLabel>
            <RevealText as="h2" id="handle-title" className="mt-6 font-serif text-[clamp(2.3rem,3.8vw,3.9rem)] font-light leading-[1] text-ink">
              Every detail, <em className="text-rose-deep">quietly managed.</em>
            </RevealText>
            <StaggerList className="mt-10 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              {c.services.map((s) => (
                <li key={s} className="flex items-center gap-3 border-b border-ink/10 py-4 text-lg text-ink">
                  <svg viewBox="-14 -14 28 28" className="size-5 shrink-0" aria-hidden="true">
                    <Bloom r={11} />
                  </svg>
                  {s}
                </li>
              ))}
            </StaggerList>
            <p className="mt-8 max-w-lg text-stone">Book one piece, like décor or entertainment, or hand us the whole celebration.</p>
          </div>
        </div>
      </section>

      {/* Our own styling, from our reels */}
      <section className="bg-ivory py-24 md:py-28" aria-labelledby="private-reels">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <SectionLabel index="04">From our reels</SectionLabel>
          <h2 id="private-reels" className="mt-6 font-serif text-[clamp(2.2rem,3.6vw,3.6rem)] font-light leading-[1] text-ink">
            Styling we&apos;ve <em className="text-rose-deep">done.</em>
          </h2>
          <ReelRail ids={["DLImPaTz1bw", "DIgArydzZwW", "DNyDrfV5tsF", "DITK04ATEeA"]} className="mt-10" label="Décor and celebration reels" />
        </div>
      </section>

      <EnquirySection index="05" defaultCategory={c.enquiryCategory} />
    </>
  );
}
