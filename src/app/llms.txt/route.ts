import { site } from "@/lib/site";
import { services } from "@/content/services";
import { featuredArtists, instagramUrl, proofStats } from "@/content/proof";
import { geoFaqs } from "@/content/events";
import { reels, reelUrl } from "@/content/reels";
import { foundersList } from "@/content/founders";

/**
 * /llms.txt — a plain-text brief for AI assistants and answer engines
 * (https://llmstxt.org). Built from the same content files as the site, so it
 * never says anything the site doesn't. Only published facts.
 */
export function GET() {
  const u = site.url;
  const events = proofStats.find((s) => s.label.toLowerCase().includes("events"));
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.name} is an event management company based in Hyderabad, Telangana, India, founded by Ramya and P. Sai Tanush ("By Ramya & Tanush"). Its promise: "Big or small, we make it special." It offers A to Z event services — weddings, corporate events, private celebrations, destination events and concerts — across Andhra Pradesh, Telangana and the rest of India. ${site.liveName} is its concert and live-entertainment brand.`,
    "",
    "## Key facts",
    "",
    "- Based in: Hyderabad, Telangana, India",
    "- Works across: Andhra Pradesh, Telangana and destinations elsewhere in India",
    "- Founders: Ramya and Pabbathi Sai Tanush (P. Sai Tanush)",
    ...(events ? [`- Events executed: ${events.value}${events.suffix}`] : []),
    `- Concert brand: ${site.liveName} (${u}/concerts)`,
    `- Artists from its shows: ${featuredArtists.map((a) => a.name).join(", ")}`,
    `- Instagram: ${site.contact.instagram ?? instagramUrl}`,
    ...(site.contact.phone ? [`- Phone: ${site.contact.phone}`] : []),
    ...(site.contact.email ? [`- Email: ${site.contact.email}`] : []),
    `- Enquiries: ${u}/contact`,
    "",
    "## Founders",
    "",
    ...foundersList.flatMap((f) => [
      `### ${f.name}${f.alternateNames.length ? ` (also written ${f.alternateNames.join(", ")})` : ""}`,
      "",
      `${f.role}. ${f.bio.join(" ")}`,
      "",
    ]),
    `Profile page: ${u}/founders`,
    "",
    "## Not to be confused with",
    "",
    "Other businesses also use the name \"Passion Events\" (for example in Mumbai and New Delhi). This Passion Events is the Hyderabad company founded by Ramya and P. Sai Tanush, with the concert brand Passion Live and the Instagram account @passionevents.p.",
    "",
    "## Services",
    "",
    ...services.map((s) => `- [${s.title}](${u}${s.href}): ${s.short} Handles: ${s.handles.join(", ")}.`),
    "",
    "## Main pages",
    "",
    `- [Home](${u}/): overview of the studio, services and founders`,
    `- [What we do](${u}/what-we-do): all nine services on one page`,
    `- [Founders](${u}/founders): Ramya and P. Sai Tanush`,
    `- [Reels](${u}/reels): the company's own Instagram reels — weddings, décor and concerts`,
    `- [Portfolio](${u}/portfolio): published event stories`,
    `- [Passion Live](${u}/concerts): concerts, artists, upcoming and past shows`,
    `- [Contact](${u}/contact): enquiry form`,
    "",
    "## Questions and answers",
    "",
    ...geoFaqs.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
    "## Reels (the company's own footage)",
    "",
    ...reels.map((r) => `- [${r.title}${r.place ? `, ${r.place}` : ""}${r.date ? ` (${r.date})` : ""}](${reelUrl(r.id)}) — ${r.category}`),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
