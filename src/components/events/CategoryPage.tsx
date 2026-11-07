import { Pic } from "@/components/shared/Pic";
import Link from "next/link";
import { Suspense } from "react";
import { categories, type Category } from "@/content/events";
import { getPortfolioEvents, safeRead } from "@/lib/events";
import { ImageReveal, Parallax } from "@/motion/primitives";
import { RevealText } from "@/motion/RevealText";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "./PageHero";
import { SectionLabel } from "./SectionLabel";
import { EnquirySection } from "./EnquirySection";
import { Approach } from "./home/Approach";
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

/** Shared template for Weddings / Corporate / Private / Destination pages. */
export function CategoryPage({ categoryKey }: { categoryKey: Category["key"] }) {
  const c = categories.find((x) => x.key === categoryKey)!;
  const others = categories.filter((x) => x.key !== categoryKey && x.key !== "concerts" && x.key !== "production");
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
      />

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
            <ul className="mt-6 border-t border-ink/15">
              {c.services.map((s, i) => (
                <li key={s} className="group flex items-center justify-between border-b border-ink/15 py-5">
                  <span className="flex items-baseline gap-5">
                    <span className="font-serif text-sm italic text-rose">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-serif text-2xl text-ink transition-transform duration-700 ease-[var(--ease-silk)] group-hover:translate-x-2 md:text-3xl">{s}</span>
                  </span>
                  <svg viewBox="-16 -16 32 32" className="size-6 scale-0 transition-transform duration-700 group-hover:scale-100" aria-hidden="true">
                    <Bloom r={11} />
                  </svg>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-stone">
              Each of these can be booked on its own — see <Link href="/services" className="link-underline text-ink">individual services</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Moodboard — inspiration imagery, not presented as our work */}
      <section className="bg-cream py-24 md:py-32" aria-labelledby="mood-title">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel>Moodboard</SectionLabel>
              <h2 id="mood-title" className="mt-6 font-serif text-4xl font-light text-ink md:text-6xl">
                The feeling we design <em className="text-rose-deep">towards.</em>
              </h2>
            </div>
            <p className="max-w-sm text-sm text-stone">Inspiration imagery. Our own event photography lives in the portfolio below.</p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
            {c.gallery.map((img, i) => (
              <Parallax key={img.src} speed={i % 2 ? 10 : 4} className={i === 0 ? "col-span-2 md:col-span-6" : i === 1 ? "md:col-span-3 md:mt-24" : "md:col-span-3"}>
                <ImageReveal shape={i % 2 ? "arch" : "up"} delay={i * 0.1} className={`${i === 0 ? "aspect-[4/3]" : "aspect-[3/4]"} w-full rounded-[1.25rem] ${i % 2 ? "arch" : ""}`}>
                  <Pic image={img} sizes="(max-width: 768px) 50vw, 30vw" className="" />
                </ImageReveal>
              </Parallax>
            ))}
          </div>
        </div>
      </section>

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

      <Approach index="" />

      {/* Other categories */}
      <section className="bg-ivory py-24">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <p className="eyebrow text-rose-deep">Also from Passion Events</p>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
          </ul>
        </div>
      </section>

      <EnquirySection index="" defaultCategory={c.enquiryCategory} />
    </>
  );
}
