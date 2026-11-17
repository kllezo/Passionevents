import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { allCities } from "@/content/areas";
import { catalogue, cityProfiles, cityQas, type CatalogueKey, type CityProfile } from "@/content/qa";
import { reelById } from "@/content/reels";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { ReelRail } from "@/components/shared/Reels";
import { SectionLabel } from "./SectionLabel";
import { EnquirySection } from "./EnquirySection";
import { EventsButton } from "./Button";

/** How each service reads with a city name after it ("Wedding planning in Guntur"). */
export const cityServiceLabel: Record<CatalogueKey, string> = {
  weddings: "Wedding planning",
  corporate: "Corporate events",
  concerts: "Concerts & artist bookings",
  college: "College fests",
  private: "Birthday & private events",
  destination: "Destination events",
  production: "Event design & production",
};

const order: CatalogueKey[] = ["weddings", "corporate", "concerts", "college", "private", "destination", "production"];

/**
 * One city: what Passion Events plans there, every service by name, any real
 * work in the city, and the questions people ask about events there.
 */
export function CityPage({ city }: { city: CityProfile }) {
  const block = allCities.find((c) => c.id === city.id);
  const region = block?.region;
  const n = city.name;
  const path = `/event-management/${city.id}`;
  const work = (region?.work ?? []).filter((w) => w.label.includes(n));
  const reelIds = work.map((w) => w.reel).filter((r): r is string => Boolean(r && reelById(r)));
  const qas = cityQas(city);
  const nearby = city.nearby.map((id) => cityProfiles.find((c) => c.id === id)).filter((c): c is CityProfile => Boolean(c));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            ...(region ? [{ name: `Event management in ${region.name}`, path: `/event-management/${region.slug}` }] : []),
            { name: `Event management in ${n}`, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Event management in ${n}`,
            serviceType: "Event management",
            description: `${block?.intro ?? ""} Weddings, corporate events, concerts, college fests, private and destination events in ${n}.`.trim(),
            url: `${site.url}${path}`,
            provider: { "@id": `${site.url}/#organization`, "@type": "EventPlanner", name: site.name, url: site.url },
            areaServed: { "@type": "City", name: n, containedInPlace: { "@type": "State", name: city.state } },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: `Event services in ${n}`,
              itemListElement: order.map((k) => ({
                "@type": "OfferCatalog",
                name: `${cityServiceLabel[k]} in ${n}`,
                itemListElement: catalogue[k].items.map((i) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: `${i} in ${n}` } })),
              })),
            },
          },
          faqJsonLd(qas),
        ]}
      />

      <section className="relative overflow-hidden bg-ivory pb-20 pt-36 md:pb-28 md:pt-44" aria-labelledby="city-title">
        <div className="pointer-events-none absolute -right-40 top-10 size-[640px] rounded-full bg-blush/30 blur-[140px]" />
        <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
          <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.2em] text-stone">
            <Link href="/" className="link-underline">Home</Link> <span aria-hidden="true">/</span>{" "}
            {region && (
              <>
                <Link href={`/event-management/${region.slug}`} className="link-underline">{region.name}</Link> <span aria-hidden="true">/</span>{" "}
              </>
            )}
            <span className="text-ink">{n}</span>
          </nav>
          <h1 id="city-title" className="mt-8 max-w-5xl font-serif text-[clamp(3rem,6vw,6.5rem)] font-light leading-[0.9] tracking-[-0.02em] text-ink">
            Event management in <em className="text-rose-deep">{n}</em>
          </h1>
          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-ink/80">
            {`Weddings, haldi, mehendi and sangeet, corporate events, concerts, college fests and private celebrations in ${n}, by Passion Events — By Ramya & Tanush. `}
            {block?.intro}
          </p>
          {block?.aka && <p className="mt-4 text-xs uppercase tracking-[0.18em] text-stone">{`Also searched as: ${block.aka.join(" · ")}`}</p>}
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <EventsButton href="#enquire">{`Plan an event in ${n}`}</EventsButton>
            <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="link-underline text-xs font-semibold uppercase tracking-[0.2em] text-ink">
              {`Call ${site.contact.phone}`}
            </a>
          </div>
          <ul className="mt-12 flex flex-wrap gap-2" aria-label={`Services in ${n}`}>
            {order.map((k) => (
              <li key={k}>
                <a href={`#${k}`} className="inline-flex rounded-full border border-ink/15 bg-ivory px-4 py-2 text-sm text-ink transition-colors hover:border-rose hover:bg-cream">
                  {`${cityServiceLabel[k]} in ${n}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28" aria-labelledby="city-services">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <SectionLabel index="01">{`Services in ${n}`}</SectionLabel>
          <h2 id="city-services" className="mt-6 font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-none text-ink">
            {`Everything we plan in ${n},`} <em className="text-rose-deep">by name.</em>
          </h2>
          <p className="mt-6 max-w-2xl text-stone">Book a single service, several, or complete event management — from concept and planning to coordination and the day itself.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {order.map((k) => (
              <article key={k} id={k} className="scroll-mt-28 rounded-[1.75rem] bg-ivory p-7 ring-1 ring-ink/5 md:p-9">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-3xl text-ink">{`${cityServiceLabel[k]} in ${n}`}</h3>
                  <Link href={catalogue[k].href} aria-label={catalogue[k].title} className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/15 text-rose-deep transition-colors hover:border-rose">
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
                <ul className="mt-5 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                  {catalogue[k].items.map((i) => (
                    <li key={i} className="flex gap-2 text-stone">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rotate-45 bg-coral" />
                      {i}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {work.length > 0 && (
        <section className="bg-ivory py-20 md:py-28" aria-labelledby="city-work">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10">
            <SectionLabel index="02">{`Our work in ${n}`}</SectionLabel>
            <h2 id="city-work" className="mt-6 font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-none text-ink">
              Real events, <em className="text-rose-deep">our own reels.</em>
            </h2>
            <ul className="mt-8 grid gap-x-10 gap-y-2 sm:grid-cols-2">
              {work.map((w) => (
                <li key={w.label} className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-3">
                  <span className="text-ink">{w.label}</span>
                  <span className="shrink-0 text-sm text-stone">{w.detail}</span>
                </li>
              ))}
            </ul>
            {reelIds.length > 0 && <ReelRail ids={reelIds} className="mt-12" label={`Reels from ${n}`} />}
          </div>
        </section>
      )}

      <section className="bg-ivory py-20 md:py-28" aria-labelledby="city-faq">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel index="03">Questions</SectionLabel>
            <h2 id="city-faq" className="mt-6 font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-none text-ink">
              {`Events in ${n},`} <em className="text-rose-deep">answered.</em>
            </h2>
            {nearby.length > 0 && (
              <p className="mt-8 text-sm text-stone">
                Also nearby:{" "}
                {nearby.map((c, i) => (
                  <span key={c.id}>
                    {i > 0 && " · "}
                    <Link href={`/event-management/${c.id}`} className="link-underline text-ink">
                      {c.name}
                    </Link>
                  </span>
                ))}
              </p>
            )}
            {region && region.slug !== city.id && (
              <p className="mt-3 text-sm text-stone">
                <Link href={`/event-management/${region.slug}`} className="link-underline text-ink">{`All of ${region.name}`}</Link>
              </p>
            )}
          </div>
          <div className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-7 lg:col-start-6">
            {qas.map((f) => (
              <div key={f.q} className="py-6">
                <h3 className="font-serif text-2xl text-ink">{f.q}</h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-stone">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EnquirySection index="04" />
    </>
  );
}
