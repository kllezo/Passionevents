import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { posts } from "@/content/blog";
import { reelCover } from "@/content/reels";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/shared/JsonLd";
import { EnquirySection } from "@/components/events/EnquirySection";

const TITLE = "Event Planning Guides & Blog | Passion Events";

export const metadata: Metadata = {
  ...pageMetadata({
    title: TITLE,
    description: "Practical guides from Passion Events, Hyderabad: choosing an event company, planning a Telugu wedding and how a live concert is produced.",
    path: "/blog",
  }),
  title: { absolute: TITLE },
};

const longDate = (iso: string) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(iso));

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${site.url}/blog#blog`,
            name: "Passion Events blog",
            url: `${site.url}/blog`,
            inLanguage: "en-IN",
            publisher: { "@id": `${site.url}/#organization` },
            blogPost: posts.map((p) => ({ "@type": "BlogPosting", "@id": `${site.url}/blog/${p.slug}#article`, headline: p.h1, url: `${site.url}/blog/${p.slug}`, datePublished: p.published })),
          },
        ]}
      />

      <section className="relative overflow-hidden bg-ivory pb-24 pt-36 md:pb-32 md:pt-44" aria-labelledby="blog-title">
        <div className="pointer-events-none absolute -left-40 top-10 size-[640px] rounded-full bg-blush/30 blur-[140px]" />
        <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
          <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.2em] text-stone">
            <Link href="/" className="link-underline">
              Home
            </Link>{" "}
            <span aria-hidden="true">/</span> <span className="text-ink">Blog</span>
          </nav>
          <h1 id="blog-title" className="mt-8 max-w-5xl font-serif text-[clamp(3rem,6vw,6.5rem)] font-light leading-[0.9] tracking-[-0.02em] text-ink">
            Event planning guides, <em className="text-rose-deep">from our team.</em>
          </h1>
          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-ink/80">
            Straight answers to the questions families, companies and artists ask us before they plan: how to choose an event company, how the functions of a Telugu wedding fit together, and what goes into a live concert.
          </p>

          <ul className="mt-16 grid gap-6 lg:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-cream ring-1 ring-ink/5 transition-shadow hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)]">
                  <span className="relative block aspect-[4/3] overflow-hidden bg-blush/30">
                    <Image src={reelCover(p.cover)} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
                  </span>
                  <span className="flex flex-1 flex-col p-7">
                    <span className="eyebrow text-rose-deep">{p.tags.join(" · ")}</span>
                    <span className="mt-4 block font-serif text-3xl leading-tight text-ink">{p.h1}</span>
                    <span className="mt-4 block flex-1 leading-relaxed text-stone">{p.description}</span>
                    <span className="mt-6 flex items-center justify-between text-sm text-stone">
                      <span>
                        <time dateTime={p.published}>{longDate(p.published)}</time> · {p.minutes} min read
                      </span>
                      <ArrowUpRight className="size-5 text-rose-deep transition-transform group-hover:rotate-45" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <EnquirySection index="" />
    </>
  );
}
