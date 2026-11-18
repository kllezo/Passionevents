import Image from "next/image";
import Link from "next/link";
import { brand } from "@/content/media";
import { site, whatsappLink } from "@/lib/site";
import { UniverseLink } from "@/components/shared/UniverseTransition";
import { InstagramIcon } from "@/components/shared/InstagramIcon";
import { Year } from "@/components/shared/Year";
import { LiveWordmark } from "./LiveWordmark";

export function LiveFooter() {
  const wa = whatsappLink("Hi Passion Live, I'd like to talk about a show.");
  const { instagram, email, phone } = site.contact;
  return (
    <footer className="live-grid-bg relative overflow-hidden border-t border-white/10 bg-void pt-20 text-white">
      <div className="mx-auto max-w-[1700px] px-5 md:px-10">
        <p className="font-display text-[clamp(4rem,17vw,16rem)] uppercase leading-[0.82] text-white/90">
          <span className="text-outline">Stay</span> <span className="text-volt">loud.</span>
        </p>
        <div className="mt-16 grid gap-12 border-t border-white/10 pt-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <LiveWordmark className="text-3xl" />
            <p className="mt-4 max-w-md font-grotesk text-sm leading-relaxed text-fog">{site.liveDescription}</p>
          </div>
          <div>
            <p className="font-grotesk text-[0.7rem] uppercase tracking-[0.25em] text-volt">Navigate</p>
            <ul className="mt-4 space-y-2 font-grotesk text-sm text-white/80">
              <li>
                <Link href="/concerts/events" className="hover:text-volt">
                  Upcoming shows
                </Link>
              </li>
              <li>
                <Link href="/concerts/about" className="hover:text-volt">
                  About Passion Live
                </Link>
              </li>
              <li>
                <Link href="/concerts/partners" className="hover:text-volt">
                  Partner with us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-grotesk text-[0.7rem] uppercase tracking-[0.25em] text-volt">Connect</p>
            <ul className="mt-4 space-y-2 font-grotesk text-sm text-white/80">
              <li>{site.contactPerson}</li>
              {phone && (
                <li>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-volt">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="hover:text-volt">
                    {email}
                  </a>
                </li>
              )}
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-volt">
                    WhatsApp
                  </a>
                </li>
              )}
              {instagram && (
                <li>
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-volt">
                    <InstagramIcon className="size-4" /> Instagram
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[1700px] px-5 md:px-10">
        <UniverseLink
          href="/"
          to="events"
          className="group flex flex-col items-start justify-between gap-6 rounded-[1.5rem] bg-ivory p-8 text-ink md:flex-row md:items-center md:px-12"
        >
          <span className="flex items-center gap-6">
            <Image src={brand.logoSmall.src} alt="Passion Events" width={brand.logoSmall.width} height={brand.logoSmall.height} className="h-auto w-20" />
            <span>
              <span className="block font-sans text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-rose-deep">Passion Live is a Passion Events experience</span>
              <span className="mt-1 block font-serif text-3xl italic md:text-4xl">Weddings, celebrations & more →</span>
            </span>
          </span>
        </UniverseLink>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1700px] flex-col gap-2 border-t border-white/10 px-5 py-8 font-grotesk text-xs text-fog md:flex-row md:justify-between md:px-10">
        <p>
          © <Year /> {site.name} · {site.liveName}. All rights reserved.
        </p>
        <p className="uppercase tracking-[0.25em]">Turn the night into a movement</p>
      </div>
    </footer>
  );
}
