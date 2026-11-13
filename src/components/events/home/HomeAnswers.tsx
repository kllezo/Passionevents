import Link from "next/link";
import { homeFaqs } from "@/content/events";
import { posts } from "@/content/blog";
import { faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { SectionLabel } from "../SectionLabel";

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

/**
 * The home page's answer layer: who we are in one paragraph, who we work
 * with, a plain comparison of booking one service vs. the whole event, and
 * the questions people ask, each answered directly.
 */
export function HomeAnswers({ index = "08" }: { index?: string }) {
  return (
    <section className="bg-ivory py-28 md:py-36" aria-labelledby="answers-title">
      <JsonLd data={faqJsonLd(homeFaqs)} />
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index={index}>Quick answers</SectionLabel>
            <h2 id="answers-title" className="mt-8 font-serif text-[clamp(2.6rem,5vw,5rem)] font-light leading-[0.95] text-ink">
              Event management in Hyderabad, <em className="text-rose-deep">answered.</em>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/80">
              <strong className="font-semibold text-ink">In short:</strong> Passion Events is a Hyderabad event management company that plans and runs weddings, corporate events, concerts, college fests and private parties across Andhra Pradesh, Telangana and Bengaluru. Book one service, or hand us the whole event.
            </p>

            <h3 className="mt-12 font-serif text-2xl text-ink">Who we work with</h3>
            <ul className="mt-5 space-y-4">
              {audiences.map((a) => (
                <li key={a.who} className="border-l-2 border-rose/50 pl-4">
                  <span className="block font-semibold text-ink">{a.who}</span>
                  <span className="text-stone">{a.what}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-stone">
              Working outside Hyderabad?{" "}
              <Link href="/event-management/andhra-pradesh" className="link-underline text-ink">
                Andhra Pradesh
              </Link>
              ,{" "}
              <Link href="/event-management/telangana" className="link-underline text-ink">
                Telangana
              </Link>{" "}
              and{" "}
              <Link href="/event-management/bengaluru" className="link-underline text-ink">
                Bengaluru
              </Link>
              .
            </p>
            <h3 className="mt-10 font-serif text-2xl text-ink">Planning guides</h3>
            <ul className="mt-4 space-y-2 text-[0.95rem]">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="link-underline text-ink">
                    {p.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <h3 className="font-serif text-2xl text-ink">One service or the whole event?</h3>
            <div className="mt-5 overflow-x-auto rounded-[1.25rem] ring-1 ring-ink/10">
              <table className="w-full min-w-[34rem] border-collapse text-left text-[0.95rem]">
                <caption className="sr-only">Booking one service compared with complete event management</caption>
                <thead className="bg-cream text-ink">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">What you need</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Book one service</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Complete event management</th>
                  </tr>
                </thead>
                <tbody>
                  {compare.map((r) => (
                    <tr key={r.need} className="border-t border-ink/10">
                      <th scope="row" className="px-4 py-3 font-medium text-ink">{r.need}</th>
                      <td className="px-4 py-3 text-stone">{r.one}</td>
                      <td className="px-4 py-3 text-ink/85">{r.full}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="mt-14 font-serif text-2xl text-ink">Questions people ask us</h3>
            <div className="mt-4 divide-y divide-ink/15 border-y border-ink/15">
              {homeFaqs.map((f, i) => (
                <details key={f.q} open={i < 2} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                    <h4 className="font-serif text-xl text-ink md:text-2xl">{f.q}</h4>
                    <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/20 text-lg transition-transform duration-500 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl leading-relaxed text-stone">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
