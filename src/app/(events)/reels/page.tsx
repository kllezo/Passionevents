import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { reels, reelCover, reelUrl } from "@/content/reels";
import { site } from "@/lib/site";
import { instagramUrl } from "@/content/proof";
import { JsonLd } from "@/components/shared/JsonLd";
import { ReelsWall } from "@/components/shared/Reels";
import { InstagramIcon } from "@/components/shared/InstagramIcon";
import { SectionLabel } from "@/components/events/SectionLabel";
import { EnquirySection } from "@/components/events/EnquirySection";
import { RevealText } from "@/motion/RevealText";

export const metadata = pageMetadata({
  title: "Reels — Weddings, Décor & Concerts",
  description: "Our own reels from @passionevents.p — engagements, sangeets, haldis and weddings, décor, and concerts with Sameera Bharadwaj and Geetha Madhuri.",
  path: "/reels",
});

export default function ReelsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Reels", path: "/reels" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Passion Events reels",
            itemListElement: reels
              .filter((r) => r.published)
              .map((r, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "VideoObject",
                  name: r.title,
                  description: `${r.title}${r.place ? ` — ${r.place}` : ""}. A ${r.category.toLowerCase()} reel by Passion Events.`,
                  thumbnailUrl: `${site.url}${reelCover(r.id)}`,
                  uploadDate: r.published,
                  url: reelUrl(r.id),
                  publisher: { "@type": "Organization", name: site.name, url: site.url },
                },
              })),
          },
        ]}
      />
      <section className="relative overflow-hidden bg-ivory pb-28 pt-36 md:pb-36 md:pt-44" aria-labelledby="reels-title">
        <div className="pointer-events-none absolute -left-40 top-10 size-[640px] rounded-full bg-blush/30 blur-[140px]" />
        <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <SectionLabel index="01">Reels · behind the scenes</SectionLabel>
              <RevealText as="h1" id="reels-title" className="mt-8 font-serif text-[clamp(3.1rem,7.2vw,8.2rem)] font-light leading-[0.88] tracking-[-0.03em] text-ink">
                The moments, <em className="text-rose-deep">as they happened.</em>
              </RevealText>
            </div>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-rose-deep">
              <InstagramIcon className="size-4" /> Follow @passionevents.p
            </a>
          </div>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-stone">Weddings, décor and concerts — filmed by our team at our own events. Tap a reel to watch it on Instagram with sound.</p>
          <div className="mt-16">
            <ReelsWall all={reels} />
          </div>
        </div>
      </section>
      <EnquirySection index="02" />
    </>
  );
}
