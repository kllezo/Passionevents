import type { Metadata } from "next";
import { site } from "./site";

/** Per-page metadata with canonical URL + Open Graph in one call. */
export function pageMetadata({
  title,
  description,
  path,
  image = "/brand/og-passion-events.jpg",
  live = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  live?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: live ? site.liveName : site.name,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: "en_IN",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function organizationJsonLd() {
  const sameAs = [site.contact.instagram].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "EventPlanner",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/logo-1400.webp`,
    image: `${site.url}/brand/og-passion-events.jpg`,
    description: site.description,
    slogan: "Big or small. We make it special.",
    founder: [
      { "@type": "Person", name: "Pabbathi Sai Tanush" },
      { "@type": "Person", name: "Ramya" },
    ],
    areaServed: { "@type": "Country", name: "India" },
    address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressRegion: "Telangana", addressCountry: "IN" },
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    knowsAbout: ["Wedding planning", "Corporate events", "Private celebrations", "Destination events", "Concerts", "Artist booking", "Event production"],
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${site.url}${it.path}` })),
  };
}
