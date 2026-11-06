import "server-only";
import path from "node:path";
import { mkdir, writeFile, readFile, stat } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import sharp, { type Metadata as SharpMetadata } from "sharp";
import { put } from "@vercel/blob";

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp", "avif", "heif", "gif", "tiff"]);

/** Vercel Blob is used whenever its token is configured (required on Vercel); otherwise local disk. */
export function usingBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function uploadRoot() {
  return path.resolve(/*turbopackIgnore: true*/ process.cwd(), process.env.UPLOAD_DIR || "./uploads");
}

export type StoredImage = { url: string; width: number; height: number; bytes: number };

export class UploadError extends Error {}

/**
 * Validates an uploaded image by decoding it (never trusting the MIME type),
 * strips metadata, auto-rotates, caps the long edge and stores it as WebP.
 */
export async function storeImage(file: File, kind: "poster" | "cover" | "gallery"): Promise<StoredImage> {
  if (file.size === 0) throw new UploadError("The file is empty.");
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("Images must be 15 MB or smaller.");

  const input = Buffer.from(await file.arrayBuffer());
  let meta: SharpMetadata;
  try {
    meta = await sharp(input).metadata();
  } catch {
    throw new UploadError("That file is not a readable image.");
  }
  if (!meta.format || !ALLOWED_FORMATS.has(meta.format)) {
    throw new UploadError("Please upload a JPG, PNG, WebP or AVIF image.");
  }

  const maxEdge = kind === "gallery" ? 2400 : 2000;
  const { data, info } = await sharp(input, { failOn: "error" })
    .rotate()
    .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84 })
    .toBuffer({ resolveWithObject: true });

  const month = new Date().toISOString().slice(0, 7);
  if (usingBlob()) {
    const blob = await put(`uploads/${month}/${kind}-${randomUUID()}.webp`, data, {
      access: "public",
      contentType: "image/webp",
      addRandomSuffix: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return { url: blob.url, width: info.width, height: info.height, bytes: data.length };
  }
  const dir = path.join(uploadRoot(), month);
  await mkdir(dir, { recursive: true });
  const name = `${kind}-${randomUUID()}.webp`;
  await writeFile(path.join(dir, name), data);

  return { url: `/api/media/${month}/${name}`, width: info.width, height: info.height, bytes: data.length };
}

/** Resolves a /api/media/... path safely inside the upload root (no traversal). */
export async function readUpload(segments: string[]) {
  if (segments.length === 0 || segments.some((s) => !/^[\w\-.]+$/.test(s) || s.startsWith("."))) return null;
  const root = uploadRoot();
  const full = path.resolve(/*turbopackIgnore: true*/ root, ...segments);
  if (!full.startsWith(root + path.sep)) return null;
  try {
    const s = await stat(full);
    if (!s.isFile()) return null;
    return { data: await readFile(full), mtime: s.mtime };
  } catch {
    return null;
  }
}

/** Public Vercel Blob URLs created by storeImage. */
export function isBlobUrl(url: string) {
  return /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/uploads\//i.test(url);
}
