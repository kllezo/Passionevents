import Link from "next/link";
import { ReelRail } from "@/components/shared/Reels";
import { InstagramIcon } from "@/components/shared/InstagramIcon";
import { reels } from "@/content/reels";
import { instagramUrl } from "@/content/proof";
import { SectionLabel } from "../SectionLabel";

/** Our own reels: weddings, décor, concerts and behind the scenes. */
export function HomeReels({ index = "06" }: { index?: string }) {
  return (
    <section className="relative overflow-hidden bg-cream py-24 md:py-28" aria-labelledby="reels-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel index={index}>Reels · behind the scenes</SectionLabel>
            <h2 id="reels-title" className="mt-6 font-serif text-[clamp(2.2rem,3.6vw,3.6rem)] font-light leading-[1] text-ink">
              Watch us <em className="text-rose-deep">at work.</em>
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink">
              <InstagramIcon className="size-4" /> @passionevents.p
            </a>
            <Link href="/reels" className="link-underline text-xs font-semibold uppercase tracking-[0.2em] text-rose-deep">
              All reels →
            </Link>
          </div>
        </div>
        <ReelRail ids={reels.map((r) => r.id)} className="mt-10" label="Passion Events reels" />
      </div>
    </section>
  );
}
