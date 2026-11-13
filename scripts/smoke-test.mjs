/**
 * HTTP smoke test for every public route, key content and API guards.
 *
 *   node scripts/smoke-test.mjs                      # http://localhost:3000
 *   node scripts/smoke-test.mjs https://your-domain  # production
 *
 * Exits non-zero on any failure. Does not write to the database.
 */
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");

const pages = [
  ["/", ["Big or small", "final applause", "Your event is our passion", "What we do", "How we", "What you can count on", "Watch us", "Let&#x27;s make your next event"]],
  ["/about", ["Every event"]],
  ["/services", ["One team"]],
  ["/weddings", ["Weddings", "ritual by ritual"]],
  ["/corporate-events", ["Corporate Events", "to the minute"]],
  ["/private-events", ["Private Celebrations", "closest to", "Every reason", "What we handle"]],
  ["/destination-events", ["Destination Events", "Door to door"]],
  ["/event-production", ["Event Production", "whole show"]],
  ["/portfolio", ["Stories we"]],
  ["/founders", ["Sai Tanush", "Ramya", "ramya-960"]],
  ["/what-we-do", ["Every kind of", "Weddings &amp; Celebrations", "College Fests", "Complete Event Management"]],
  ["/services/concerts-and-live-entertainment", ["Concerts &amp; Live Entertainment", "What Passion Events handles"]],
  ["/services/college-fests-and-cultural-events", ["College Fests"]],
  ["/services/artist-and-entertainment-management", ["Sameera Bharadwaj"]],
  ["/services/complete-event-management", ["Conceptualisation"]],
  ["/reels", ["as they happened", "DeTkSCHtGHK"]],
  ["/event-management/andhra-pradesh", ["Event management in Vijayawada", "Event management in Tirupati", "Nandigama", "FAQPage"]],
  ["/event-management/telangana", ["Event management in Hyderabad", "Event management in Warangal", "Event management in Khammam"]],
  ["/event-management/bengaluru", ["Event management in Bengaluru", "Sameera Bharadwaj"]],
  ["/blog", ["Event planning guides", "telugu-wedding-planning-guide"]],
  ["/blog/how-to-choose-an-event-management-company", ["12 questions to ask before you book", "BlogPosting"]],
  ["/blog/telugu-wedding-planning-guide", ["Pellikuthuru", "DLImPaTz1bw", "BlogPosting"]],
  ["/blog/how-a-live-concert-is-produced", ["technical rider", "BlogPosting"]],
  ["/llms.txt", ["## Areas served", "## Guides", "Khammam"]],
  ["/contact", ["Enquire"]],
  ["/concerts", ["Turn the night", "We produce the", "starts with us"]],
  ["/concerts/events", ["Every"]],
  ["/concerts/about", ["Built for the"]],
  ["/concerts/partners", ["Pitch us"]],
  ["/admin/login", ["Studio dashboard"]],
  ["/robots.txt", ["Sitemap"]],
  ["/sitemap.xml", ["<urlset"]],
  ["/manifest.webmanifest", ["Passion Events"]],
];

const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
  console.log(`${ok ? "✓" : "✗"} ${msg}`);
};

for (const [path, needles] of pages) {
  const res = await fetch(base + path, { redirect: "manual" });
  const body = await res.text();
  check(res.status === 200, `${path} → ${res.status}`);
  for (const n of needles) check(body.includes(n), `${path} contains "${n.replace("&#x27;", "'")}"`);
  check(!/Application error|Internal Server Error/i.test(body), `${path} has no error page`);
}

for (const path of ["/does-not-exist", "/portfolio/does-not-exist", "/concerts/events/does-not-exist", "/services/does-not-exist", "/event-management/does-not-exist", "/blog/does-not-exist"]) {
  const res = await fetch(base + path);
  check(res.status === 404, `${path} → ${res.status} (expect 404)`);
}

const admin = await fetch(base + "/admin", { redirect: "manual" });
check([307, 308].includes(admin.status) && (admin.headers.get("location") || "").includes("/admin/login"), `/admin redirects to login when signed out (${admin.status})`);

const upload = await fetch(base + "/api/admin/upload", { method: "POST", body: new FormData() });
check(upload.status === 401, `upload API rejects anonymous requests (${upload.status})`);

const bad = await fetch(base + "/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: "" }) });
check(bad.status === 400, `enquiry API validates input (${bad.status})`);

const traversal = await fetch(base + "/api/media/..%2F.env");
// 404 from the app, or 400/403 when a host firewall (e.g. Hostinger) rejects it first — blocked either way.
check([400, 403, 404].includes(traversal.status), `media API blocks path traversal (${traversal.status})`);

console.log(`\n${failures.length ? `${failures.length} FAILED` : "All checks passed"} against ${base}`);
process.exit(failures.length ? 1 : 0);
