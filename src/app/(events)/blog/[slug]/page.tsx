import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { posts, postBySlug, type Block } from "@/content/blog";
import { reelById, reelCover, reelUrl } from "@/content/reels";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/shared/JsonLd";
import { ReelRail } from "@/components/shared/Reels";
import { SectionLabel } from "@/components/events/SectionLabel";
import { EnquirySection } from "@/components/events/EnquirySection";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) return { title: "Blog" };
  return {
    ...pageMetadata({ title: p.title, description: p.description, path: `/blog/${p.slug}`, article: { published: p.published, modified: p.updated, tags: p.tags } }),
    title: { absolute: p.title },
  };
}

const slugify = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const longDate = (iso: string) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(iso));

function BlockView({ b, title }: { b: Block; title: string }) {
  switch (b.type) {
    case "p":
      return <p className="mt-5 text-lg leading-relaxed text-ink/80">{b.text}</p>;
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      return (
        <Tag className={`mt-5 space-y-3 text-lg leading-relaxed text-ink/80 ${b.ordered ? "list-decimal pl-6 marker:font-serif marker:text-rose-deep" : ""}`}>
          {b.items.map((it) => (
            <li key={it} className={b.ordered ? "pl-2" : "flex gap-3"}>
              {!b.ordered && <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rotate-45 bg-coral" />}
              <span>{it}</span>
            </li>
          ))}
        </Tag>
      );
    }
    case "table":
      return (
        <div className="mt-6 overflow-x-auto rounded-[1.25rem] ring-1 ring-ink/10">
          <table className="w-full min-w-[34rem] border-collapse text-left text-[0.95rem]">
            <caption className="sr-only">{b.caption}</caption>
            <thead className="bg-cream text-ink">
              <tr>
                {b.head.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r) => (
                <tr key={r.join("|")} className="border-t border-ink/10">
                  {r.map((c, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="px-4 py-3 font-medium text-ink">
                        {c}
                      </th>
                    ) : (
                      <td key={i} className="px-4 py-3 text-stone">
                        {c}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "reels":
      // A single reel fills its container, so give it a card-sized width.
      return <ReelRail ids={b.ids} compact className={b.ids.length === 1 ? "mt-8 w-[min(70vw,300px)]" : "mt-8"} label={`Reels: ${title}`} />;
    case "links":
      return (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {b.items.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group flex items-center justify-between gap-4 rounded-2xl bg-cream p-5 ring-1 ring-ink/5 transition-colors hover:ring-rose/40">
                <span className="font-serif text-xl text-ink">{l.label}</span>
                <ArrowUpRight className="size-5 shrink-0 text-rose-deep transition-transform group-hover:rotate-45" />
              </Link>
            </li>
          ))}
        </ul>
      );
  }
}

/** One guide: answer-first summary, contents, sections, questions, related reading. */
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = postBySlug(slug);
  if (!p) notFound();
  const path = `/blog/${p.slug}`;
  const related = posts.filter((x) => x.slug !== p.slug);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: p.h1, path },
          ]),
          articleJsonLd(p),
          faqJsonLd(p.faqs),
        ]}
      />

      <article aria-labelledby="post-title">
        <header className="relative overflow-hidden bg-ivory pb-16 pt-36 md:pb-20 md:pt-44">
          <div className="pointer-events-none absolute -right-40 top-10 size-[640px] rounded-full bg-blush/30 blur-[140px]" />
          <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.2em] text-stone">
                <Link href="/" className="link-underline">
                  Home
                </Link>{" "}
                <span aria-hidden="true">/</span>{" "}
                <Link href="/blog" className="link-underline">
                  Blog
                </Link>
              </nav>
              <p className="eyebrow mt-8 text-rose-deep">{p.tags.join(" · ")}</p>
              <h1 id="post-title" className="mt-5 font-serif text-[clamp(2.6rem,5.6vw,5.6rem)] font-light leading-[0.95] tracking-[-0.015em] text-ink">
                {p.h1}
              </h1>
              <p className="mt-8 max-w-3xl text-xl leading-relaxed text-ink/80">{p.description}</p>
              <p className="mt-8 text-sm text-stone">
                By <Link href="/about" className="link-underline text-ink">{site.name}</Link> · Published <time dateTime={p.published}>{longDate(p.published)}</time>
                {p.updated !== p.published && (
                  <>
                    {" "}
                    · Updated <time dateTime={p.updated}>{longDate(p.updated)}</time>
                  </>
                )}{" "}
                · {p.minutes} min read
              </p>
            </div>
            <div className="hidden lg:col-span-3 lg:col-start-10 lg:block">
              {/* The cover is a reel thumbnail (with Instagram's play mark), so it opens that reel. */}
              <a
                href={reelUrl(p.cover)}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-[9/14] overflow-hidden rounded-[1.75rem] bg-cream ring-1 ring-ink/5"
              >
                <Image src={reelCover(p.cover)} alt={`Watch on Instagram: ${reelById(p.cover)?.title ?? "a Passion Events reel"}`} fill sizes="22vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" priority />
              </a>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-stone">From our own work</p>
            </div>
          </div>
        </header>

        <div className="bg-ivory pb-24 md:pb-32">
          <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-12">
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow text-rose-deep">In this guide</p>
                <ol className="mt-4 space-y-2 border-l border-ink/15 pl-4 text-sm">
                  {p.sections.map((s) => (
                    <li key={s.h2}>
                      <a href={`#${slugify(s.h2)}`} className="text-stone transition-colors hover:text-ink">
                        {s.h2}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#questions" className="text-stone transition-colors hover:text-ink">
                      Questions
                    </a>
                  </li>
                </ol>
              </div>
            </aside>

            <div className="min-w-0 lg:col-span-8 lg:col-start-5">
              <section aria-labelledby="takeaways" className="rounded-[1.75rem] bg-cream/80 p-7 ring-1 ring-ink/5 md:p-9">
                <h2 id="takeaways" className="font-serif text-2xl text-ink md:text-3xl">
                  Key takeaways
                </h2>
                <ul className="mt-5 space-y-3">
                  {p.takeaways.map((t) => (
                    <li key={t} className="flex gap-3 leading-relaxed text-ink/80">
                      <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-coral" />
                      {t}
                    </li>
                  ))}
                </ul>
              </section>

              {p.sections.map((s) => (
                <section key={s.h2} aria-labelledby={slugify(s.h2)} className="mt-16 scroll-mt-28">
                  <h2 id={slugify(s.h2)} className="scroll-mt-28 font-serif text-[clamp(1.9rem,3vw,2.8rem)] font-light leading-tight text-ink">
                    {s.h2}
                  </h2>
                  {s.blocks.map((b, i) => (
                    <BlockView key={i} b={b} title={s.h2} />
                  ))}
                </section>
              ))}

              <section aria-labelledby="questions" className="mt-20 scroll-mt-28">
                <SectionLabel>Questions</SectionLabel>
                <h2 id="questions" className="mt-5 scroll-mt-28 font-serif text-[clamp(1.9rem,3vw,2.8rem)] font-light leading-tight text-ink">
                  Questions people ask
                </h2>
                <div className="mt-6 divide-y divide-ink/15 border-y border-ink/15">
                  {p.faqs.map((f) => (
                    <div key={f.q} className="py-6">
                      <h3 className="font-serif text-2xl text-ink">{f.q}</h3>
                      <p className="mt-3 max-w-2xl leading-relaxed text-stone">{f.a}</p>
                    </div>
                  ))}
                </div>
              </section>

              <nav aria-label="More guides" className="mt-20">
                <p className="eyebrow text-rose-deep">More guides</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/blog/${r.slug}`} className="group flex h-full flex-col justify-between gap-4 rounded-2xl bg-cream p-6 ring-1 ring-ink/5 transition-colors hover:ring-rose/40">
                        <span className="font-serif text-xl leading-snug text-ink">{r.h1}</span>
                        <span className="flex items-center justify-between text-sm text-stone">
                          {r.minutes} min read
                          <ArrowUpRight className="size-5 text-rose-deep transition-transform group-hover:rotate-45" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </article>

      <EnquirySection index="" />
    </>
  );
}
