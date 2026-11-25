import { Pic } from "@/components/shared/Pic";
import { ImageReveal } from "@/motion/primitives";
import type { WorkPhoto } from "@/content/wedding-work";

/** Same asymmetric rhythm as PortfolioGrid, with each photo's own shape. */
const layout = [
  { col: "md:col-span-7", aspect: "aspect-[4/3]" },
  { col: "md:col-span-5 md:mt-24", aspect: "aspect-[4/5]" },
  { col: "md:col-span-5", aspect: "aspect-[4/5]" },
  { col: "md:col-span-7 md:mt-16", aspect: "aspect-[3/2]" },
  { col: "md:col-span-7", aspect: "aspect-[5/3]" },
  { col: "md:col-span-5 md:mt-24", aspect: "aspect-[4/3]" },
];

/** Photographs from Passion Events' own events (static, client-supplied). */
export function WorkGallery({ photos, date }: { photos: WorkPhoto[]; date?: string }) {
  return (
    <div className="grid gap-x-8 gap-y-16 md:grid-cols-12">
      {photos.map((p, i) => {
        const l = layout[i % layout.length];
        return (
          <figure key={p.image.src} className={l.col}>
            <ImageReveal shape={i % 2 ? "arch" : "up"} className={`${l.aspect} w-full rounded-[1.5rem] bg-cream ${i % 2 ? "arch" : ""}`}>
              <Pic image={p.image} sizes="(max-width: 768px) 92vw, 50vw" />
            </ImageReveal>
            <figcaption className="mt-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
              <span>
                <span className="block font-serif text-3xl leading-tight text-ink md:text-4xl">{p.title}</span>
                <span className="mt-2 block max-w-md text-stone">{p.caption}</span>
              </span>
              <span className="shrink-0 text-sm text-stone md:pt-1 md:text-right">
                {date}
                {p.credit && <span className="mt-1 block text-xs opacity-70">{p.credit}</span>}
              </span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
