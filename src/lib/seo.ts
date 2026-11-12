import type { Metadata } from "next";
import { site } from "./site";
import { services, type Service } from "@/content/services";

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

const ORG_ID = () => `${site.url}/#organization`;

/**
 * The business, as search engines and AI assistants should understand it.
 * Every field is a supplied or published fact: areas served come from the
 * company's Instagram bio ("across Andhra Pradesh & Telangana"), the 50+
 * figure from the client's brief, contact details from environment variables.
 */
export function organizationJsonLd() {
  const sameAs = [site.contact.instagram].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "EventPlanner",
    "@id": ORG_ID(),
    name: site.name,
    alternateName: ["Passion Events Hyderabad", "Passion Events by Ramya & Tanush"],
    url: site.url,
    logo: `${site.url}/brand/logo-1400.webp`,
    image: `${site.url}/brand/og-passion-events.jpg`,
    description: site.description,
    slogan: "Big or small. We make it special.",
    founder: [
      { "@type": "Person", name: "Pabbathi Sai Tanush", alternateName: "P. Sai Tanush", jobTitle: "Co-founder", url: `${site.url}/founders`, image: `${site.url}/media/founders/sai-tanush-900.webp` },
      { "@type": "Person", name: "Ramya", jobTitle: "Co-founder", url: `${site.url}/founders`, image: `${site.url}/media/founders/ramya-960.webp` },
    ],
    foundingLocation: { "@type": "Place", name: "Hyderabad, Telangana, India" },
    areaServed: [
      { "@type": "City", name: "Hyderabad" },
      { "@type": "State", name: "Telangana" },
      { "@type": "State", name: "Andhra Pradesh" },
      { "@type": "Country", name: "India" },
    ],
    address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressRegion: "Telangana", addressCountry: "IN" },
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(site.contact.phone || site.contact.email
      ? { contactPoint: { "@type": "ContactPoint", contactType: "customer service", areaServed: "IN", ...(site.contact.phone ? { telephone: site.contact.phone } : {}), ...(site.contact.email ? { email: site.contact.email } : {}) } }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
    knowsAbout: services.map((s) => s.title),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Event services",
      itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, url: `${site.url}${s.href}` } })),
    },
    subOrganization: { "@type": "Organization", name: site.liveName, url: `${site.url}/concerts`, description: site.liveDescription },
  };
}

/** The website itself, linked to the business. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: "en-IN",
    publisher: { "@id": ORG_ID() },
  };
}

/** One of the nine services. */
export function serviceJsonLd(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    serviceType: s.title,
    description: s.description,
    url: `${site.url}${s.href}`,
    provider: { "@id": ORG_ID(), "@type": "EventPlanner", name: site.name, url: site.url },
    areaServed: [
      { "@type": "State", name: "Telangana" },
      { "@type": "State", name: "Andhra Pradesh" },
      { "@type": "Country", name: "India" },
    ],
    hasOfferCatalog: { "@type": "OfferCatalog", name: s.title, itemListElement: s.handles.map((h) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: h } })) },
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
