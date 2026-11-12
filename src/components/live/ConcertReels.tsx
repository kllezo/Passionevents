import { ReelRail } from "@/components/shared/Reels";
import { reelsBy } from "@/content/reels";
import { instagramUrl } from "@/content/proof";
import { InstagramIcon } from "@/components/shared/InstagramIcon";
import { LiveSectionHead } from "./LiveSectionHead";

/** Concert reels — the company's own Instagram footage from Passion Live nights. */
export function ConcertReels({ index = "04" }: { index?: string }) {
  const ids = [...reelsBy("Concerts"), ...reelsBy("Behind the scenes")].map((r) => r.id);
  return (
    <section className="relative overflow-hidden bg-void py-24 md:py-32" aria-labelledby="reels-title">
      <div className="pointer-events-none absolute -right-40 top-10 size-[620px] rounded-full bg-violet/25 blur-[140px]" />
      <LiveSectionHead
        index={index}
        eyebrow="Concert reels"
        id="reels-title"
        tone="text-hot"
        title={
          <>
            Straight from the <span className="text-hot">crowd.</span>
          </>
        }
        aside={
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-grotesk text-xs uppercase tracking-[0.3em] text-white underline-offset-4 hover:text-volt hover:underline">
            <InstagramIcon className="size-4" /> @passionevents.p
          </a>
        }
      />
      <div className="relative mx-auto max-w-[1700px] px-5 md:px-10">
        <ReelRail ids={ids} tone="dark" label="Passion Live concert reels" />
      </div>
    </section>
  );
}
