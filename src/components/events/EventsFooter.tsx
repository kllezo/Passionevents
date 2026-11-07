import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/shared/InstagramIcon";
import { brand } from "@/content/media";
import { categories } from "@/content/events";
import { site, whatsappLink } from "@/lib/site";
import { UniverseLink } from "@/components/shared/UniverseTransition";
import { Year } from "@/components/shared/Year";
import { Marquee } from "@/motion/primitives";
import { RevealText } from "@/motion/RevealText";
import { SprigGroup } from "./botanical/Sprig";
import { buildSprig } from "./botanical/geometry";

const sprig = buildSprig({
  p0: { x: 10, y: 300 },
  p1: { x: 200, y: 260 },
  p2: { x: 420, y: 340 },
  p3: { x: 690, y: 120 },
  seed: 42,
  leafCount: 16,
  bloomCount: 8,
});

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/founders", label: "Founders" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

export function EventsFooter() {
  const wa = whatsappLink();
  const { phone, email, instagram } = site.contact;
  return (
    <footer className="paper-grain relative overflow-hidden bg-cream pt-24 text-ink">
      <Marquee duration={60} className="border-y border-rose/20 py-6">
        {["Weddings", "Corporate", "Private Celebrations", "Destination", "Concerts", "Production"].map((w) => (
          <span key={w} className="flex items-center gap-10 pr-10 font-serif text-5xl italic text-ink/80 md:text-7xl">
            {w}
            <span className="inline-block size-3 rotate-45 bg-coral/70" />
          </span>
        ))}
      </Marquee>

      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 pb-10 pt-20 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Image src={brand.logo.src} alt={brand.logo.alt} width={brand.logo.width} height={brand.logo.height} className="h-auto w-[230px] md:w-[300px]" />
          <RevealText as="p" className="mt-8 max-w-md font-serif text-3xl leading-tight text-ink md:text-4xl">
            Big or small, we make it special — across India, from Hyderabad.
          </RevealText>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
          <div>
            <p className="eyebrow text-rose-deep">Explore</p>
            <ul className="mt-5 space-y-2.5 text-[0.95rem]">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-underline">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-rose-deep">Services</p>
            <ul className="mt-5 space-y-2.5 text-[0.95rem]">
              {categories.map((c) => (
                <li key={c.key}>
                  {c.key === "concerts" ? (
                    <UniverseLink href={c.href} to="live" className="link-underline">
                      {c.title}
                    </UniverseLink>
                  ) : (
                    <Link href={c.href} className="link-underline">
                      {c.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="eyebrow text-rose-deep">Contact</p>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              <li className="text-stone">{site.contactPerson}</li>
              <li className="text-stone">Based in {site.baseCity}, working across {site.region}</li>
              {phone && (
                <li>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="link-underline inline-flex items-center gap-2">
                    <Phone className="size-4" /> {phone}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="link-underline inline-flex items-center gap-2">
                    <Mail className="size-4" /> {email}
                  </a>
                </li>
              )}
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-2">
                    <MessageCircle className="size-4" /> WhatsApp
                  </a>
                </li>
              )}
              {instagram && (
                <li>
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-2">
                    <InstagramIcon className="size-4" /> Instagram
                  </a>
                </li>
              )}
              <li>
                <Link href="/contact#enquire" className="link-underline font-semibold">
                  Send an enquiry →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Passion Live doorway */}
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <UniverseLink
          href="/concerts"
          to="live"
          className="group relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[2rem] bg-void px-8 py-10 text-white md:flex-row md:items-center md:px-14"
        >
          <span className="absolute inset-0 bg-[radial-gradient(60%_120%_at_80%_50%,rgb(139_92_255/0.45),transparent_60%),radial-gradient(40%_90%_at_95%_80%,rgb(255_90_31/0.45),transparent_60%)] opacity-70 transition-opacity duration-700 group-hover:opacity-100" />
          <span className="relative">
            <span className="block font-grotesk text-xs uppercase tracking-[0.35em] text-fog">Our concert universe</span>
            <span className="mt-2 block font-display text-5xl uppercase leading-none tracking-wide md:text-7xl">
              Passion <span className="text-volt">Live</span>
            </span>
          </span>
          <span className="relative flex items-center gap-4 font-grotesk text-sm uppercase tracking-[0.25em]">
            Enter the night
            <span className="grid size-14 place-items-center rounded-full border border-white/30 transition-all duration-500 group-hover:border-volt group-hover:bg-volt group-hover:text-black">
              →
            </span>
          </span>
        </UniverseLink>
      </div>

      <svg viewBox="0 0 700 360" className="pointer-events-none absolute -right-24 top-40 hidden w-[620px] opacity-50 lg:block" aria-hidden="true">
        <SprigGroup g={sprig} strokeWidth={1.4} />
      </svg>

      <div className="mx-auto mt-16 flex max-w-[1600px] flex-col gap-3 border-t border-ink/10 px-5 py-8 text-xs text-stone md:flex-row md:items-center md:justify-between md:px-10">
        <p>
          © <Year /> {site.name}. {site.byline}. All rights reserved.
        </p>
        <p className="font-serif text-base italic text-rose-deep">{site.tagline}</p>
      </div>
    </footer>
  );
}
