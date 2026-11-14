/**
 * Pre-size concert photographs (from the photographer's gallery downloads)
 * into public/media/sized/<name>-{24,480,640,800,1080,1200,1600}.webp, the
 * format Pic.tsx serves. The full-resolution originals stay outside the repo.
 *
 *   node scripts/build-show-photos.mjs <name>=<path-to-jpg> [<name>=<path> ...]
 *
 * Photos by 24 Frames Photography (credited on the show pages).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public/media/sized");
const WIDTHS = [480, 640, 800, 1080, 1200, 1600];
fs.mkdirSync(OUT, { recursive: true });

for (const arg of process.argv.slice(2)) {
  const i = arg.indexOf("=");
  const name = arg.slice(0, i);
  const src = arg.slice(i + 1);
  if (!/^[a-z0-9-]+$/.test(name)) throw new Error(`bad name: ${name}`);
  const base = sharp(src).rotate(); // honour camera orientation
  const meta = await base.metadata();
  for (const w of WIDTHS) {
    await sharp(src).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: w >= 1200 ? 72 : 76 }).toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  await sharp(src).rotate().resize({ width: 24 }).webp({ quality: 50 }).toFile(path.join(OUT, `${name}-24.webp`));
  const kb = WIDTHS.map((w) => `${w}:${Math.round(fs.statSync(path.join(OUT, `${name}-${w}.webp`)).size / 1024)}KB`).join(" ");
  console.log(`${name} ${meta.width}x${meta.height} ${kb}`);
}
