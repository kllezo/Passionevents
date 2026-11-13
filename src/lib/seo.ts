import type { Metadata } from "next";
import { site } from "./site";
import { services, type Service } from "@/content/services";
import { foundersList, type Founder } from "@/content/founders";
import { allCities } from "@/content/areas";
import type { Post } from "@/content/blog";
import { reelCover } from "@/content/reels";

/** Per-page metadata with canonical URL + Open Graph in one call. */
export function pageMetadata({
  title,
  description,
  path,
  image = "/brand/og-passion-events.jpg",
  live = false,
  article,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  live?: boolean;
  /** For blog posts: Open Graph article type with its dates. */
  article?: { published: string; modified: string; tags?: string[] };
}): Metadata {
  const og = {
    title,
    description,
    url: path,
    siteName: live ? site.liveName : site.name,
    images: [{ url: image, width: 1200, height: 630 }],
    locale: "en_IN",
  };
  return {
    title,
    description,
    alternates: { canonical: path, languages: { "en-IN": path, "x-default": path } },
    openGraph: article
      ? { ...og, type: "article", publishedTime: article.published, modifiedTime: article.modified, tags: article.tags }
      : { ...og, type: "website" },
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
    // Another business called "Passion Events" exists in Mumbai; say plainly which one this is.
    disambiguatingDescription: "Event company based in Hyderabad, Telangana, founded by Ramya and P. Sai Tanush (“By Ramya & Tanush”), with the concert brand Passion Live and Instagram @passionevents.p.",
    slogan: "Big or small. We make it special.",
    founder: foundersList.map((f) => founderJsonLd(f, false)),
    foundingLocation: { "@type": "Place", name: "Hyderabad, Telangana, India" },
    // The cities on the /event-management region pages, then the states.
    areaServed: [
      ...allCities.map((c) => ({ "@type": "City", name: c.name.replace(/ \(.*\)$/, ""), url: `${site.url}/event-management/${c.region.slug}#${c.id}` })),
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

/** A founder as a Person entity (stable @id so other pages can refer to it). */
export function founderJsonLd(f: Founder, withContext = true) {
  return {
    ...(withContext ? { "@context": "https://schema.org" } : {}),
    "@type": "Person",
    "@id": `${site.url}/founders#${f.id}`,
    name: f.name,
    ...(f.alternateNames.length ? { alternateName: f.alternateNames } : {}),
    jobTitle: "Co-founder",
    description: f.bio[0],
    url: `${site.url}/founders`,
    ...(f.image ? { image: `${site.url}${f.image.src}` } : {}),
    worksFor: { "@id": ORG_ID(), "@type": "Organization", name: site.name, url: site.url },
    ...(f.focus.length ? { knowsAbout: f.focus } : {}),
    homeLocation: { "@type": "Place", name: "Hyderabad, Telangana, India" },
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

/**
 * A guide on /blog. Written and published by the company itself, so author
 * and publisher are the organisation, never an invented person.
 */
export function articleJsonLd(p: Post) {
  const url = `${site.url}/blog/${p.slug}`;
  const org = { "@type": "Organization", "@id": ORG_ID(), name: site.name, url: site.url };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: p.h1,
    description: p.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${site.url}${reelCover(p.cover)}`,
    datePublished: p.published,
    dateModified: p.updated,
    inLanguage: "en-IN",
    keywords: p.tags.join(", "),
    articleSection: p.tags[0],
    author: org,
    publisher: { ...org, logo: { "@type": "ImageObject", url: `${site.url}/brand/logo-1400.webp` } },
    isPartOf: { "@id": `${site.url}/#website` },
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
