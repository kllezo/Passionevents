import Link from "next/link";
import { homeFaqs } from "@/content/events";
import { posts } from "@/content/blog";
import { faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { SectionLabel } from "../SectionLabel";
import { site } from "@/lib/site";
import { meraEventsUrl, ticketedShows } from "@/content/proof";
import { reelUrl } from "@/content/reels";

/** Weddings and celebrations from the company's own reels (first-hand footage). */
const ownCelebrations = [
  { title: "Engagement evening", place: "Nandigama", label: "Apr 2025", reel: "DIT7CNHzKqG" },
  { title: "Wedding day", place: "Nandigama", label: "Apr 2025", reel: "DIlOuTfIzG6" },
  { title: "Sunflower haldi", place: "Jaggayyapeta", label: "Jun 2025", reel: "DLImPaTz1bw" },
  { title: "Sangeet night", place: "Hyderabad", label: "Aug 2025", reel: "DNyDrfV5tsF" },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const [uy, um, ud] = site.contentUpdated.split("-").map(Number);
const updatedLabel = `${ud} ${MONTHS[um - 1]} ${uy}`;

const compare = [
  { need: "Concept, theme and planning", one: "You plan; we deliver our part", full: "We plan it with you, start to finish" },
  { need: "Vendors and bookings", one: "You coordinate other vendors", full: "One point of contact for every vendor" },
  { need: "Décor, stage, sound and lighting", one: "Booked individually", full: "Designed and run as one production" },
  { need: "Artists and entertainment", one: "Booked individually", full: "Programmed into the run-of-show" },
  { need: "On the day", one: "Our team for our service", full: "Our team runs the whole day" },
  { need: "Best for", one: "Families and companies with their own planner", full: "Anyone who wants to enjoy the event, not manage it" },
];

const audiences = [
  { who: "Couples and families", what: "Engagements, haldi, pelli kuthuru, sangeet, weddings and receptions." },
  { who: "Companies and HR teams", what: "Conferences, launches, award nights and annual celebrations." },
  { who: "Colleges and student committees", what: "Fests and cultural nights with proper stage and sound." },
  { who: "Artists, promoters and venues", what: "Concert production and artist coordination through Passion Live." },
];

const pill = "inline-flex items-center rounded-full border border-ink/15 bg-ivory px-4 py-1.5 text-ink transition-colors hover:border-rose hover:bg-cream";

/**
 * The home page's answer layer, laid out compactly: the summary beside the
 * heading, who we work with as four tiles, the one-service-vs-everything
 * comparison beside the questions people ask, and a slim strip of region
 * and guide links. Same words, far less vertical space.
 */
export function HomeAnswers({ index = "08" }: { index?: string }) {
  return (
    <section className="bg-ivory py-24 md:py-28" aria-labelledby="answers-title">
      <JsonLd data={faqJsonLd(homeFaqs)} />
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        {/* Heading + the short answer */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <SectionLabel index={index}>Quick answers</SectionLabel>
            <h2 id="answers-title" className="mt-6 font-serif text-[clamp(2.4rem,3.6vw,3.8rem)] font-light leading-[0.98] text-ink">
              Event management in Hyderabad, <em className="text-rose-deep">answered.</em>
            </h2>
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-stone">
              Updated <time dateTime={site.contentUpdated}>{updatedLabel}</time> · By {site.name}
            </p>
          </div>
          <p data-summary="" className="relative rounded-[1.5rem] bg-cream/80 p-6 text-[1.05rem] leading-relaxed text-ink/80 ring-1 ring-rose/15 before:absolute before:inset-y-6 before:left-0 before:w-[3px] before:rounded-full before:bg-gradient-to-b before:from-rose before:to-coral md:p-7 lg:col-span-7">
            <strong className="font-semibold text-ink">In short:</strong> Passion Events is a Hyderabad event management company that plans and runs weddings, corporate events, concerts, college fests and private parties across Andhra Pradesh, Telangana and Bengaluru. Book one service, or hand us the whole event.
          </p>
        </div>

        {/* Who we work with: four tiles */}
        <h3 className="mt-14 font-serif text-2xl text-ink">Who we work with</h3>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a, i) => (
            <li key={a.who} className="rounded-[1.25rem] bg-cream/70 p-5 ring-1 ring-ink/5 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgb(94_52_64/0.5)]">
              <span className="font-serif text-sm italic text-rose-deep">{String(i + 1).padStart(2, "0")}</span>
              <span className="mt-1.5 block font-semibold leading-snug text-ink">{a.who}</span>
              <span className="mt-1.5 block text-[0.92rem] leading-snug text-stone">{a.what}</span>
            </li>
          ))}
        </ul>

        {/* First-hand record: real dates and venues, each with its source */}
        <div className="mt-14">
          <h3 className="font-serif text-2xl text-ink">From our own events</h3>
          <p className="mt-2 max-w-3xl text-[0.95rem] leading-relaxed text-stone">
            Real dates and real venues. Ticketed shows link to their public listing on{" "}
            <a href={meraEventsUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-ink">MeraEvents</a>; weddings and celebrations link to our own footage on Instagram.
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ticketedShows.map((e) => (
              <li key={e.url} className="rounded-[1.25rem] bg-cream/70 p-5 ring-1 ring-ink/5">
                <time dateTime={e.date} className="font-serif text-sm italic text-rose-deep">{e.label}</time>
                <span className="mt-1.5 block font-semibold leading-snug text-ink">{e.title}</span>
                <span className="mt-1 block text-[0.88rem] leading-snug text-stone">{e.venue}</span>
                <a href={e.url} target="_blank" rel="noopener noreferrer" className="link-underline mt-2 inline-block text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink">Listing on MeraEvents</a>
              </li>
            ))}
            {ownCelebrations.map((e) => (
              <li key={e.reel} className="rounded-[1.25rem] bg-cream/70 p-5 ring-1 ring-ink/5">
                <span className="font-serif text-sm italic text-rose-deep">{e.label}</span>
                <span className="mt-1.5 block font-semibold leading-snug text-ink">{e.title}</span>
                <span className="mt-1 block text-[0.88rem] leading-snug text-stone">{e.place}</span>
                <a href={reelUrl(e.reel)} target="_blank" rel="noopener noreferrer" className="link-underline mt-2 inline-block text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink">Watch our reel</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Comparison beside the questions */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h3 className="font-serif text-2xl text-ink">One service or the whole event?</h3>
            <div className="mt-5 overflow-x-auto rounded-[1.25rem] ring-1 ring-ink/10">
              <table className="w-full min-w-[32rem] border-collapse text-left text-[0.9rem]">
                <caption className="sr-only">Booking one service compared with complete event management</caption>
                <thead className="text-ink">
                  <tr>
                    <th scope="col" className="bg-cream px-4 py-3 font-semibold">What you need</th>
                    <th scope="col" className="bg-cream px-4 py-3 font-semibold">Book one service</th>
                    <th scope="col" className="bg-blush/40 px-4 py-3 font-semibold">Complete event management</th>
                  </tr>
                </thead>
                <tbody>
                  {compare.map((r) => (
                    <tr key={r.need} className="border-t border-ink/10">
                      <th scope="row" className="px-4 py-2.5 font-medium text-ink">{r.need}</th>
                      <td className="px-4 py-2.5 text-stone">{r.one}</td>
                      <td className="bg-blush/15 px-4 py-2.5 text-ink/90">{r.full}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5">
            <h3 className="font-serif text-2xl text-ink">Questions people ask us</h3>
            <div className="mt-5 space-y-2">
              {homeFaqs.map((f, i) => (
                <details key={f.q} open={i === 0} className="group rounded-[1rem] bg-cream/60 px-5 py-3.5 ring-1 ring-ink/5 transition-colors open:bg-cream [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <h4 className="font-serif text-[1.15rem] leading-snug text-ink">{f.q}</h4>
                    <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full border border-ink/20 text-base transition-transform duration-500 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-stone">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Slim strip: regions and guides */}
        <div className="mt-14 grid grid-cols-1 gap-6 rounded-[1.5rem] border border-ink/10 p-5 text-sm md:p-6 lg:grid-cols-12 lg:items-center">
          <p className="flex flex-wrap items-center gap-2 text-stone lg:col-span-5">
            Working outside Hyderabad?{" "}
            <Link href="/event-management/andhra-pradesh" className={pill}>
              Andhra Pradesh
            </Link>
            ,{" "}
            <Link href="/event-management/telangana" className={pill}>
              Telangana
            </Link>{" "}
            and{" "}
            <Link href="/event-management/bengaluru" className={pill}>
              Bengaluru
            </Link>
            .
          </p>
          <div className="lg:col-span-7">
            <h3 className="font-serif text-lg text-ink">Planning guides</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className={`${pill} text-[0.85rem]`}>
                    {p.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
