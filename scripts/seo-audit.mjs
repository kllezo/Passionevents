/**
 * SEO / AI-search audit for every page in the sitemap (plus a few extras).
 *
 *   node scripts/seo-audit.mjs                      # http://localhost:3000
 *   node scripts/seo-audit.mjs https://passionevents.co
 *
 * Reports per page: status, title + length, description + length, canonical,
 * Open Graph image, number of <h1>, robots meta, JSON-LD @types; then site
 * files (robots.txt, sitemap.xml, llms.txt). Exits non-zero on hard problems.
 */
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const extra = ["/what-we-do", "/reels"];

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const meta = (html, attr, key) => {
  const re = new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`, "i");
  const re2 = new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${key}"`, "i");
  return decode((html.match(re) || html.match(re2) || [])[1] || "");
};

const sm = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const paths = [...new Set([...urls, ...extra])];

const problems = [];
const titles = new Map();
console.log(`Auditing ${paths.length} pages on ${base}\n`);
for (const p of paths) {
  const res = await fetch(base + p, { redirect: "manual" });
  if (res.status !== 200) {
    console.log(`${res.status}  ${p}`);
    if (res.status >= 400) problems.push(`${p}: HTTP ${res.status}`);
    continue;
  }
  const html = await res.text();
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || "");
  const desc = meta(html, "name", "description");
  const canon = (html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/) || [])[1] || "";
  const ogImg = meta(html, "property", "og:image");
  const robots = meta(html, "name", "robots");
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  const types = [...html.matchAll(/"@type":"([A-Za-z]+)"/g)].map((m) => m[1]);
  const topTypes = [...new Set(types)].join(",");
  console.log(`200  ${p}\n     title (${title.length}): ${title}\n     desc  (${desc.length}): ${desc.slice(0, 90)}${desc.length > 90 ? "…" : ""}\n     canonical: ${canon}  h1: ${h1}  og:image: ${ogImg ? "yes" : "NO"}${robots ? `  robots: ${robots}` : ""}\n     ld: ${topTypes || "—"}`);
  if (!title) problems.push(`${p}: no title`);
  if (title.length > 65) problems.push(`${p}: title ${title.length} chars`);
  if (!desc) problems.push(`${p}: no description`);
  else if (desc.length < 70 || desc.length > 165) problems.push(`${p}: description ${desc.length} chars`);
  if (!canon) problems.push(`${p}: no canonical`);
  if (h1 !== 1) problems.push(`${p}: ${h1} <h1>`);
  if (!ogImg) problems.push(`${p}: no og:image`);
  if (titles.has(title)) problems.push(`${p}: duplicate title with ${titles.get(title)}`);
  titles.set(title, p);
}

for (const f of ["/robots.txt", "/llms.txt"]) {
  const r = await fetch(base + f);
  console.log(`\n${f}: ${r.status}`);
  if (r.ok) console.log((await r.text()).split("\n").slice(0, 14).join("\n"));
  else problems.push(`${f}: HTTP ${r.status}`);
}

console.log(`\n${problems.length ? `${problems.length} issue(s):\n- ${problems.join("\n- ")}` : "No issues found."}`);
process.exit(problems.length ? 1 : 0);
