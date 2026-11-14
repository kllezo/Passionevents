/**
 * Self-host the photographs that appear above the fold (the home hero), in
 * pre-sized WebP files, so the first screen never waits on a remote image CDN.
 *
 *   node scripts/build-sized-images.mjs
 *
 * Writes public/media/sized/<name>-{24,480,800,1200,1600}.webp. The 24 px file
 * is the blurred placeholder. Pic.tsx picks the right width (sizedLoader).
 * Sources are the same Unsplash photos already used on the site (temporary,
 * illustrative) — replace with client photography when it arrives.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public/media/sized");
const WIDTHS = [480, 640, 800, 1080, 1200, 1600];
const images = {
  "hero-canopy": "photo-1587271636175-90d58cdad458",
  "wedding-arch": "photo-1744804298431-57953e4eaba0",
  "decor-arch": "photo-1761472606347-bfebc5a3e546",
  "live-crowd": "photo-1540039155733-5bb30b53aa14",
};

fs.mkdirSync(OUT, { recursive: true });
for (const [name, id] of Object.entries(images)) {
  const res = await fetch(`https://images.unsplash.com/${id}?fm=jpg&q=90&w=2000`);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  const src = Buffer.from(await res.arrayBuffer());
  for (const w of WIDTHS) {
    await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: w >= 1200 ? 72 : 76 }).toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  await sharp(src).resize({ width: 24 }).webp({ quality: 50 }).toFile(path.join(OUT, `${name}-24.webp`));
  const sizes = WIDTHS.map((w) => `${w}:${Math.round(fs.statSync(path.join(OUT, `${name}-${w}.webp`)).size / 1024)}KB`).join(" ");
  console.log(name, sizes);
}
