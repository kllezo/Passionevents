import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { services, serviceBySlug } from "@/content/services";
import { featuredArtists } from "@/content/proof";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { Pic } from "@/components/shared/Pic";
import { ReelRail } from "@/components/shared/Reels";
import { UniverseLink } from "@/components/shared/UniverseTransition";
import { PageHero } from "@/components/events/PageHero";
import { SectionLabel } from "@/components/events/SectionLabel";
import { EnquirySection } from "@/components/events/EnquirySection";
import { EventsButton } from "@/components/events/Button";
import { RevealText } from "@/motion/RevealText";
import { StaggerList } from "@/motion/StaggerList";

/** Trim to a whole word within `max` characters. */
const clip = (t: string, max: number) => (t.length <= max ? t : `${t.slice(0, t.lastIndexOf(" ", max - 1))}…`);

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return { title: "Services" };
  return pageMetadata({ title: s.title, description: clip(`${s.short} ${s.description}`, 158), path: s.href });
}

/**
 * Detail view for one of the nine services. Services that already have their
 * own landing page (weddings, corporate, private, destination, production)
 * redirect there, so every link to /services/<slug> works.
 */
export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();
  if (s.hasCategoryPage) redirect(s.href);

  const i = services.indexOf(s);
  const prev = services[(i - 1 + services.length) % services.length];
  const next = services[(i + 1) % services.length];
  const [g0, g1, g2, g3] = s.gallery;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "What we do", path: "/what-we-do" },
            { name: s.title, path: s.href },
          ]),
          serviceJsonLd(s),
        ]}
      />
      <PageHero
        variant="full"
        index={s.index}
        eyebrow={`What we do · ${s.index}`}
        title={s.title}
        script={s.script}
        image={s.image}
        intro={<p>{s.short}</p>}
      >
        <Link href={`/what-we-do#${s.key}`} className="mt-8 inline-flex items-center gap-3 rounded-full bg-ivory/90 py-2 pl-2 pr-5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink backdrop-blur-md transition-colors hover:bg-ivory">
          <span className="grid size-8 place-items-center rounded-full bg-ink text-ivory">
            <ArrowLeft className="size-4" />
          </span>
          Back to What we do
        </Link>
      </PageHero>

      <section className="bg-ivory py-24 md:py-36" aria-labelledby="svc-about">
        <div className="mx-auto grid max-w-[1600px] gap-16 px-5 md:px-10 grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel index="01">The service</SectionLabel>
            <RevealText as="h2" id="svc-about" className="mt-8 font-serif text-[clamp(2.4rem,4.6vw,4.8rem)] font-light leading-[1] text-ink">
              {s.lines[0]} <em className="text-rose-deep">{s.lines[1]}</em>
            </RevealText>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/80">{s.description}</p>
            {s.key === "artists" && (
              <div className="mt-10 rounded-[1.5rem] bg-cream p-6">
                <p className="eyebrow text-rose-deep">Artists from our shows</p>
                <p className="mt-3 font-serif text-2xl leading-relaxed text-ink">{featuredArtists.map((a) => a.name).join(" · ")}</p>
              </div>
            )}
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <EventsButton href="#enquire">Enquire about {s.title.split(" ")[0].toLowerCase()}</EventsButton>
              {s.live && (
                <UniverseLink href="/concerts" to="live" className="link-underline text-xs font-semibold uppercase tracking-[0.2em] text-ink">
                  Enter Passion Live →
                </UniverseLink>
              )}
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="eyebrow text-stone">What Passion Events handles</p>
            <StaggerList className="mt-6 border-t border-ink/10">
              {s.handles.map((h, n) => (
                <li key={h} className="flex items-baseline gap-5 border-b border-ink/10 py-4">
                  <span className="font-serif text-sm italic text-rose-deep">{String(n + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-2xl text-ink">{h}</span>
                </li>
              ))}
            </StaggerList>
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32" aria-label={`${s.title} — photographs`}>
        <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-4 px-5 md:px-10">
          <div className="relative col-span-12 aspect-[4/3] overflow-hidden rounded-[1.6rem] md:col-span-7 md:aspect-auto md:h-[64svh]">
            <Pic image={g0} sizes="(max-width: 768px) 100vw, 56vw" />
          </div>
          <div className="col-span-12 grid grid-cols-2 gap-4 md:col-span-5">
            <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[1.6rem]">
              <Pic image={g1} sizes="(max-width: 768px) 100vw, 40vw" />
            </div>
            {g2 && (
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1.6rem]">
                <Pic image={g2} sizes="(max-width: 768px) 50vw, 20vw" />
              </div>
            )}
            {g3 && (
              <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-[1.6rem]">
                <Pic image={g3} sizes="(max-width: 768px) 50vw, 20vw" />
              </div>
            )}
          </div>
          <p className="col-span-12 mt-2 text-xs text-stone">Mood photography: Unsplash (temporary). Our own work is in the reels{s.reels.length ? " below" : " on our Instagram"}.</p>
        </div>
      </section>

      {s.reels.length > 0 && (
        <section className="bg-ivory py-24 md:py-32" aria-labelledby="svc-reels">
          <div className="mx-auto max-w-[1600px] px-5 md:px-10">
            <SectionLabel index="02">On our reels</SectionLabel>
            <h2 id="svc-reels" className="mt-8 font-serif text-[clamp(2.2rem,4vw,3.8rem)] font-light leading-none text-ink">
              Real nights, <em className="text-rose-deep">our own footage.</em>
            </h2>
            <ReelRail ids={s.reels} className="mt-12" label={`${s.title} reels`} />
          </div>
        </section>
      )}

      <nav aria-label="More services" className="border-y border-ink/10 bg-ivory">
        <div className="mx-auto grid max-w-[1600px] md:grid-cols-2">
          <Link href={prev.href} className="group flex items-center gap-5 border-b border-ink/10 px-5 py-10 md:border-b-0 md:border-r md:px-10">
            <ArrowLeft className="size-5 shrink-0 text-rose-deep transition-transform group-hover:-translate-x-1" />
            <span>
              <span className="eyebrow text-stone">Previous · {prev.index}</span>
              <span className="mt-2 block font-serif text-3xl text-ink">{prev.title}</span>
            </span>
          </Link>
          <Link href={next.href} className="group flex items-center justify-end gap-5 px-5 py-10 text-right md:px-10">
            <span>
              <span className="eyebrow text-stone">Next · {next.index}</span>
              <span className="mt-2 block font-serif text-3xl text-ink">{next.title}</span>
            </span>
            <ArrowRight className="size-5 shrink-0 text-rose-deep transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </nav>

      <EnquirySection index="03" defaultCategory={s.enquiryCategory} />
    </>
  );
}
