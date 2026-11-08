import { Pic } from "@/components/shared/Pic";
import Link from "next/link";
import { Suspense } from "react";
import { categories, type Category } from "@/content/events";
import { getPortfolioEvents, safeRead } from "@/lib/events";
import { RevealText } from "@/motion/RevealText";
import { StaggerList } from "@/motion/StaggerList";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "./PageHero";
import { FanDeck } from "./FanDeck";
import { SectionLabel } from "./SectionLabel";
import { EnquirySection } from "./EnquirySection";
import { HeroMotif, type MotifKind } from "./signature/HeroMotif";
import { WeddingJourney } from "./signature/WeddingJourney";
import { CorporateRunSheet } from "./signature/CorporateRunSheet";
import { PrivateOccasions } from "./signature/PrivateOccasions";
import { DestinationRoute } from "./signature/DestinationRoute";
import { ProductionBuild } from "./signature/ProductionBuild";
import { PortfolioGrid } from "./portfolio/PortfolioGrid";
import { PortfolioSkeleton } from "./home/PortfolioPreview";
import { EventsButton } from "./Button";
import { Bloom } from "./botanical/Sprig";

const categoryDbKey: Record<Category["key"], string> = {
  weddings: "WEDDING",
  corporate: "CORPORATE",
  private: "PRIVATE",
  destination: "DESTINATION",
  concerts: "CONCERT",
  production: "PRODUCTION",
};

async function CategoryWork({ category }: { category: Category }) {
  const events = await safeRead("category work", () => getPortfolioEvents(categoryDbKey[category.key]), []);
  if (events.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-rose/40 bg-cream/60 p-10 text-center md:p-16">
        <p className="font-serif text-3xl italic text-ink md:text-4xl">Stories from our {category.title.toLowerCase()} are on their way.</p>
        <p className="mx-auto mt-4 max-w-lg text-stone">We&apos;ll publish real photographs from our events here as they&apos;re curated.</p>
      </div>
    );
  }
  return <PortfolioGrid events={events} />;
}

/** Each page's own ambient hero layer and signature section. */
const pageIdentity: Partial<Record<Category["key"], { motif: MotifKind; Signature: () => React.JSX.Element }>> = {
  weddings: { motif: "petals", Signature: WeddingJourney },
  corporate: { motif: "beams", Signature: CorporateRunSheet },
  private: { motif: "confetti", Signature: PrivateOccasions },
  destination: { motif: "lanterns", Signature: DestinationRoute },
  production: { motif: "spotlights", Signature: ProductionBuild },
};

/** Shared template for Weddings / Corporate / Private / Destination pages. */
export function CategoryPage({ categoryKey }: { categoryKey: Category["key"] }) {
  const c = categories.find((x) => x.key === categoryKey)!;
  const others = categories.filter((x) => x.key !== categoryKey && x.key !== "concerts");
  const identity = pageIdentity[categoryKey];
  const Signature = identity?.Signature;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: c.title, path: c.href },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: c.title,
            provider: { "@type": "EventPlanner", name: "Passion Events" },
            areaServed: { "@type": "Country", name: "India" },
            description: c.description,
          },
        ]}
      />
      <PageHero
        variant="full"
        index={c.index}
        eyebrow={c.title}
        title={c.title}
        script={c.script}
        image={c.image}
        intro={<p>{c.short}</p>}
        overlay={identity && <HeroMotif kind={identity.motif} />}
      >
        {/* phones: a clear next step right in the first screen */}
        <div className="mt-8 flex items-center gap-5 lg:hidden">
          <EventsButton href="#enquire" variant="ivory">
            Enquire
          </EventsButton>
          <span className="text-[0.62rem] uppercase tracking-[0.3em] text-ivory/70">Scroll to explore ↓</span>
        </div>
      </PageHero>

      {/* Narrative + services */}
      <section className="bg-ivory py-28 md:py-40">
        <div className="mx-auto grid max-w-[1600px] gap-16 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel>How we approach {c.title.toLowerCase()}</SectionLabel>
            <RevealText as="p" className="mt-8 font-serif text-[clamp(2rem,3.6vw,3.6rem)] font-light leading-[1.12] text-ink">
              {c.description}
            </RevealText>
            <div className="mt-10">
              <EventsButton href="#enquire">
                Enquire about {c.title.toLowerCase()}
              </EventsButton>
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="eyebrow text-rose-deep">What we take care of</p>
            <StaggerList className="mt-6 border-t border-ink/15">
              {c.services.map((s, i) => (
                <li key={s} className="group relative flex items-center justify-between py-5">
                  <span data-rule="" aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-ink/15" />
                  <span className="flex items-baseline gap-5">
                    <span className="font-serif text-sm italic text-rose">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-serif text-2xl text-ink transition-transform duration-700 ease-[var(--ease-silk)] group-hover:translate-x-2 md:text-3xl">{s}</span>
                  </span>
                  <svg viewBox="-16 -16 32 32" className="size-6 scale-0 transition-transform duration-700 group-hover:scale-100" aria-hidden="true">
                    <Bloom r={11} />
                  </svg>
                </li>
              ))}
            </StaggerList>
            <p className="mt-6 text-sm text-stone">
              Each of these can be booked on its own — see <Link href="/services" className="link-underline text-ink">individual services</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Page signature — unique to each category */}
      {Signature && <Signature />}

      {/* Moodboard — inspiration imagery, not presented as our work */}
      <FanDeck images={[c.image, ...c.gallery]} word={c.title} script={c.script} />

      {/* Real work from the admin dashboard */}
      <section className="bg-ivory py-28 md:py-36" aria-labelledby="work-title">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <SectionLabel>Portfolio</SectionLabel>
          <h2 id="work-title" className="mb-14 mt-6 font-serif text-4xl font-light text-ink md:text-6xl">
            Our {c.title.toLowerCase()}
          </h2>
          <Suspense fallback={<PortfolioSkeleton />}>
            <CategoryWork category={c} />
          </Suspense>
        </div>
      </section>

      {/* Other categories */}
      <section className="bg-ivory py-24">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <p className="eyebrow text-rose-deep">Also from Passion Events</p>
          <StaggerList className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {others.map((o) => (
              <li key={o.key}>
                <Link href={o.href} className="group flex items-center gap-5">
                  <span className="relative size-24 shrink-0 overflow-hidden rounded-full">
                    <Pic image={o.image} alt="" sizes="96px" className="transition-transform duration-1000 group-hover:scale-110" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-serif text-3xl text-ink transition-colors group-hover:text-rose-deep">{o.title}</span>
                    <span className="mt-1 block text-sm text-stone">{o.short}</span>
                  </span>
                </Link>
              </li>
            ))}
          </StaggerList>
        </div>
      </section>

      <EnquirySection index="" defaultCategory={c.enquiryCategory} />
    </>
  );
}
