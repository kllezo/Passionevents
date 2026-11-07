import { Pic } from "@/components/shared/Pic";
import Link from "next/link";
import { stock } from "@/content/media";
import { categories } from "@/content/events";
import { pageMetadata, breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/events/PageHero";
import { SectionLabel } from "@/components/events/SectionLabel";
import { Approach } from "@/components/events/home/Approach";
import { WhyUs } from "@/components/events/home/WhyUs";
import { FoundersFeature } from "@/components/events/FoundersFeature";
import { EnquirySection } from "@/components/events/EnquirySection";
import { JsonLd } from "@/components/shared/JsonLd";
import { UniverseLink } from "@/components/shared/UniverseTransition";
import { ImageReveal, ScrubWords } from "@/motion/primitives";
import { RevealText } from "@/motion/RevealText";

export const metadata = pageMetadata({
  title: "About Passion Events",
  description:
    "Passion Events is a Hyderabad-based event company founded by Ramya and Sai Tanush, creating weddings, corporate events, private celebrations, destination events and concerts across India.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])]} />
      <PageHero
        eyebrow="About us"
        title={
          <>
            Every event, <em className="text-rose-deep">made personal.</em>
          </>
        }
        intro={<p>Passion Events plans, designs and manages celebrations of every size — from Hyderabad, for clients across India.</p>}
        image={stock.celebrationStage}
        secondary={stock.florals}
      />

      <section className="bg-ivory py-28 md:py-40">
        <div className="mx-auto grid max-w-[1600px] gap-16 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionLabel index="01">Our belief</SectionLabel>
            <ScrubWords
              className="mt-10 font-serif text-[clamp(2rem,4vw,4rem)] font-light leading-[1.14] text-ink"
              text="Big or small isn't a measure of how much an event matters. A dinner for twelve and a concert for thousands both deserve a team that cares about every detail — that is the promise written beneath our name."
            />
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-stone lg:col-span-4 lg:pt-24">
            <RevealText as="p">
              We work as one team across planning, design, vendors, artists and production, so clients have a single point of contact from the first call to the last guest leaving.
            </RevealText>
            <RevealText as="p">
              Clients can book us for one service — décor, catering, photography, sound and lighting, transport — or for complete end-to-end management.
            </RevealText>
          </div>
        </div>
      </section>

      <section className="bg-cream py-28 md:py-36" aria-labelledby="about-cats">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <SectionLabel index="02">What we create</SectionLabel>
          <h2 id="about-cats" className="mt-8 max-w-3xl font-serif text-[clamp(2.4rem,5vw,5rem)] font-light leading-[0.98] text-ink">
            More than weddings — <em className="text-rose-deep">every kind of occasion.</em>
          </h2>
          <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => {
              const body = (
                <>
                  <ImageReveal shape={i % 2 ? "arch" : "up"} delay={(i % 3) * 0.1} className={`aspect-[4/5] w-full rounded-[1.25rem] ${i % 2 ? "arch" : ""}`}>
                    <Pic image={c.image} sizes="(max-width: 768px) 92vw, 30vw" className="transition-transform duration-[1.6s] group-hover:scale-105" />
                  </ImageReveal>
                  <p className="mt-5 font-serif text-sm italic text-rose">{c.index}</p>
                  <h3 className="mt-1 font-serif text-3xl text-ink group-hover:text-rose-deep">{c.title}</h3>
                  <p className="mt-2 text-stone">{c.short}</p>
                </>
              );
              return (
                <li key={c.key}>
                  {c.key === "concerts" ? (
                    <UniverseLink href={c.href} to="live" className="group block">
                      {body}
                    </UniverseLink>
                  ) : (
                    <Link href={c.href} className="group block">
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Approach index="03" />
      <FoundersFeature index="04" />
      <WhyUs index="05" />
      <EnquirySection index="06" />
    </>
  );
}
