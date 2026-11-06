import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPublishedEventBySlug } from "@/lib/events";
import { EVENT_CATEGORY_LABEL, type EventCategory } from "@/lib/constants";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { MediaImage } from "@/components/shared/MediaImage";
import { JsonLd } from "@/components/shared/JsonLd";
import { SectionLabel } from "@/components/events/SectionLabel";
import { EventsButton } from "@/components/events/Button";
import { formatEventDate } from "@/components/events/portfolio/PortfolioGrid";
import { ImageReveal } from "@/motion/primitives";
import { RevealText } from "@/motion/RevealText";

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const e = await getPublishedEventBySlug(slug, "EVENTS");
  if (!e) return { title: "Portfolio" };
  const img = e.coverUrl ?? e.posterUrl ?? undefined;
  return pageMetadata({
    title: e.title,
    description: e.summary || e.description.slice(0, 155) || `${e.title} — by Passion Events.`,
    path: `/portfolio/${e.slug}`,
    image: img,
  });
}

async function StoryContent({ params }: { params: PageProps<"/portfolio/[slug]">["params"] }) {
  const { slug } = await params;
  const e = await getPublishedEventBySlug(slug, "EVENTS");
  if (!e) notFound();
  const cover = e.coverUrl ?? e.posterUrl ?? e.media[0]?.url ?? null;
  const date = formatEventDate(e.startsAt);
  const category = EVENT_CATEGORY_LABEL[e.category as EventCategory] ?? e.category;

  return (
    <article>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Portfolio", path: "/portfolio" },
          { name: e.title, path: `/portfolio/${e.slug}` },
        ])}
      />
      <header data-nav-theme="dark" className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink pb-16 pt-32 text-ivory">
        {cover && (
          <ImageReveal shape="center" immediate className="!absolute inset-0" parallax={6}>
            <MediaImage src={cover} alt={e.media[0]?.alt || e.title} fill preload sizes="100vw" className="object-cover" />
          </ImageReveal>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
        <div className="relative mx-auto w-full max-w-[1600px] px-5 md:px-10">
          <SectionLabel tone="ivory">{category}</SectionLabel>
          <RevealText as="h1" trigger="mount" delay={0.4} className="mt-6 max-w-5xl font-serif text-[clamp(3rem,8vw,8rem)] font-light leading-[0.92]">
            {e.title}
          </RevealText>
          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4 text-sm">
            {[
              ["Date", date],
              ["Venue", e.venue],
              ["City", e.city],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow text-blush">{k}</dt>
                  <dd className="mt-1 font-serif text-2xl">{v}</dd>
                </div>
              ))}
          </dl>
        </div>
      </header>

      {(e.summary || e.description) && (
        <section className="bg-ivory py-24 md:py-32">
          <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:px-10 lg:grid-cols-12">
            {e.summary && (
              <p className="font-serif text-[clamp(1.8rem,3vw,3rem)] font-light italic leading-[1.15] text-ink lg:col-span-5">{e.summary}</p>
            )}
            <div className="space-y-5 whitespace-pre-line text-lg leading-relaxed text-stone lg:col-span-6 lg:col-start-7">{e.description}</div>
          </div>
        </section>
      )}

      {e.media.length > 0 && (
        <section className="bg-cream py-24 md:py-32" aria-label="Gallery">
          <div className="mx-auto max-w-[1600px] columns-1 gap-6 px-5 sm:columns-2 md:px-10 lg:columns-3">
            {e.media.map((m, i) => (
              <ImageReveal
                key={m.id}
                shape={i % 3 === 1 ? "arch" : "up"}
                className={`mb-6 w-full break-inside-avoid rounded-[1.25rem] ${i % 3 === 1 ? "arch" : ""}`}
                style={{ aspectRatio: m.width && m.height ? `${m.width}/${m.height}` : "4/5" }}
              >
                <MediaImage src={m.url} alt={m.alt || `${e.title} — photograph ${i + 1}`} fill sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw" className="object-cover" />
              </ImageReveal>
            ))}
          </div>
        </section>
      )}

      <section className="bg-ivory py-24 text-center">
        <p className="eyebrow text-rose-deep">{site.name}</p>
        <h2 className="mx-auto mt-6 max-w-3xl font-serif text-5xl font-light text-ink md:text-7xl">
          Imagine <em className="text-rose-deep">yours.</em>
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <EventsButton href="/contact#enquire">Plan your event</EventsButton>
          <EventsButton href="/portfolio" variant="outline">
            More stories
          </EventsButton>
        </div>
        <p className="mt-10 text-sm text-stone">
          <Link href="/portfolio" className="link-underline">
            ← Back to portfolio
          </Link>
        </p>
      </section>
    </article>
  );
}

export default function PortfolioStoryPage({ params }: PageProps<"/portfolio/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[92svh] animate-pulse bg-cream" />}>
      <StoryContent params={params} />
    </Suspense>
  );
}
