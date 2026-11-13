/**
 * Tell IndexNow search engines (Bing, Yandex, Seznam, Naver…) about every URL
 * in the sitemap. Bing's index also feeds AI answers such as ChatGPT search
 * and Copilot. Run after a deploy:
 *
 *   node scripts/indexnow.mjs                       # https://passionevents.co
 *   node scripts/indexnow.mjs https://passionevents.co /what-we-do /reels   # only these paths
 *
 * The key is public by design (https://www.indexnow.org/documentation): the
 * file /<key>.txt on the site proves the submission comes from the site owner.
 */
const KEY = "101396d445ba0409370eb3a63f733df5";
const site = (process.argv[2] || "https://passionevents.co").replace(/\/$/, "");
const only = process.argv.slice(3);
const host = new URL(site).host;

const keyRes = await fetch(`${site}/${KEY}.txt`);
if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) {
  console.error(`Key file ${site}/${KEY}.txt is not live yet — deploy first.`);
  process.exit(1);
}

let urls;
if (only.length) urls = only.map((p) => `${site}${p}`);
else {
  const sm = await (await fetch(`${site}/sitemap.xml`)).text();
  urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: `${site}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: HTTP ${res.status} ${res.statusText} for ${urls.length} URL(s)`);
// 200 = accepted, 202 = accepted (key validation pending), 422 = URLs don't match host, 429 = too many requests
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
