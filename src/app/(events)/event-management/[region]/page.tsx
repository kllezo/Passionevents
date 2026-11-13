import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { areas, areaBySlug } from "@/content/areas";
import { services } from "@/content/services";
import { reelById } from "@/content/reels";
import { posts } from "@/content/blog";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { ReelRail } from "@/components/shared/Reels";
import { SectionLabel } from "@/components/events/SectionLabel";
import { EnquirySection } from "@/components/events/EnquirySection";
import { EventsButton } from "@/components/events/Button";

export function generateStaticParams() {
  return areas.map((a) => ({ region: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region } = await params;
  const a = areaBySlug(region);
  if (!a) return { title: "Areas we serve" };
  return { ...pageMetadata({ title: a.title, description: a.description, path: `/event-management/${a.slug}` }), title: { absolute: a.title } };
}

/**
 * Regional landing page: one answer-first summary, the real work we've done
 * there, a distinct section per city, the services, and region questions.
 */
export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  const a = areaBySlug(region);
  if (!a) notFound();
  const reelIds = a.work.map((w) => w.reel).filter((r): r is string => Boolean(r && reelById(r)));
  const others = areas.filter((x) => x.slug !== a.slug);
  const path = `/event-management/${a.slug}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: `Event management in ${a.name}`, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: `Event management in ${a.name}`,
            serviceType: "Event management",
            description: a.summary,
            url: `${site.url}${path}`,
            provider: { "@id": `${site.url}/#organization`, "@type": "EventPlanner", name: site.name, url: site.url },
            areaServed: a.cities.map((c) => ({ "@type": "City", name: c.name.replace(/ \(.*\)$/, "") })),
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: `Event services in ${a.name}`,
              itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, url: `${site.url}${s.href}` } })),
            },
          },
          faqJsonLd(a.faqs),
        ]}
      />

      <section className="relative overflow-hidden bg-ivory pb-20 pt-36 md:pb-28 md:pt-44" aria-labelledby="region-title">
        <div className="pointer-events-none absolute -right-40 top-10 size-[640px] rounded-full bg-blush/30 blur-[140px]" />
        <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
          <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.2em] text-stone">
            <Link href="/" className="link-underline">Home</Link> <span aria-hidden="true">/</span> Areas we serve <span aria-hidden="true">/</span> <span className="text-ink">{a.name}</span>
          </nav>
          <h1 id="region-title" className="mt-8 max-w-5xl font-serif text-[clamp(3rem,6vw,6.5rem)] font-light leading-[0.9] tracking-[-0.02em] text-ink">
            {a.h1.split(" in ")[0]} in <em className="text-rose-deep">{a.h1.split(" in ").slice(1).join(" in ")}</em>
          </h1>
          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-ink/80">{a.summary}</p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <EventsButton href="#enquire">{`Plan an event in ${a.name}`}</EventsButton>
            <Link href="/what-we-do" className="link-underline text-xs font-semibold uppercase tracking-[0.2em] text-ink">
              All nine services
            </Link>
          </div>
          <ul className="mt-12 flex flex-wrap gap-2" aria-label={`Cities in ${a.name}`}>
            {a.cities.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} className="inline-flex rounded-full border border-ink/15 bg-ivory px-4 py-2 text-sm text-ink transition-colors hover:border-rose hover:bg-cream">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {a.work.length > 0 && (
        <section className="bg-cream py-20 md:py-28" aria-labelledby="work-title">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10">
            <SectionLabel index="01">{`Our work in ${a.name}`}</SectionLabel>
            <h2 id="work-title" className="mt-6 font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-none text-ink">
              Real events, <em className="text-rose-deep">our own reels.</em>
            </h2>
            <ul className="mt-8 grid gap-x-10 gap-y-2 sm:grid-cols-2">
              {a.work.map((w) => (
                <li key={w.label} className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-3">
                  <span className="text-ink">{w.label}</span>
                  <span className="shrink-0 text-sm text-stone">{w.detail}</span>
                </li>
              ))}
            </ul>
            {reelIds.length > 0 && <ReelRail ids={reelIds} className="mt-12" label={`Reels from ${a.name}`} />}
          </div>
        </section>
      )}

      <section className="bg-ivory py-20 md:py-28" aria-labelledby="cities-title">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <SectionLabel index="02">Cities</SectionLabel>
          <h2 id="cities-title" className="mt-6 font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-none text-ink">
            Where we plan events in <em className="text-rose-deep">{a.name}</em>
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {a.cities.map((c) => (
              <article key={c.id} id={c.id} className="scroll-mt-28 rounded-[1.75rem] bg-cream/70 p-7 ring-1 ring-ink/5 md:p-9">
                <h3 className="font-serif text-3xl text-ink md:text-4xl">{`Event management in ${c.name}`}</h3>
                {c.aka && <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone">{`Also searched as: ${c.aka.join(" · ")}`}</p>}
                <p className="mt-5 leading-relaxed text-ink/80">{c.intro}</p>
                <h4 className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-rose-deep">{`What we plan in ${c.name.replace(/ \(.*\)$/, "")}`}</h4>
                <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                  {c.events.map((e) => (
                    <li key={e} className="flex gap-2 text-stone">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rotate-45 bg-coral" />
                      {e}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28" aria-labelledby="svc-title">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <SectionLabel index="03">Services</SectionLabel>
          <h2 id="svc-title" className="mt-6 font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-none text-ink">
            Every service, <em className="text-rose-deep">wherever you celebrate.</em>
          </h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.key}>
                <Link href={s.href} className="group flex h-full items-start justify-between gap-4 rounded-2xl bg-ivory p-5 ring-1 ring-ink/5 transition-colors hover:ring-rose/40">
                  <span>
                    <span className="block font-serif text-xl text-ink">{s.title}</span>
                    <span className="mt-1 block text-sm text-stone">{s.short}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-rose-deep transition-transform group-hover:rotate-45" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ivory py-20 md:py-28" aria-labelledby="region-faq">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel index="04">Questions</SectionLabel>
            <h2 id="region-faq" className="mt-6 font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-none text-ink">
              {a.name}, <em className="text-rose-deep">answered.</em>
            </h2>
            <p className="mt-8 text-sm text-stone">
              Also serving:{" "}
              {others.map((o, i) => (
                <span key={o.slug}>
                  {i > 0 && " · "}
                  <Link href={`/event-management/${o.slug}`} className="link-underline text-ink">
                    {o.name}
                  </Link>
                </span>
              ))}
            </p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-rose-deep">Planning guides</p>
            <ul className="mt-3 space-y-2 text-sm">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="link-underline text-ink">
                    {p.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-7 lg:col-start-6">
            {a.faqs.map((f) => (
              <div key={f.q} className="py-6">
                <h3 className="font-serif text-2xl text-ink">{f.q}</h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-stone">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EnquirySection index="05" />
    </>
  );
}

// Slugs are prerendered from generateStaticParams; navigation into the
// page may block on the server, which is fine (same as portfolio/[slug]).
export const instant = false;
