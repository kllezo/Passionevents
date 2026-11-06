import "server-only";
import path from "node:path";
import { unlink } from "node:fs/promises";
import { db } from "@/lib/db";
import { del } from "@vercel/blob";
import { isBlobUrl, uploadRoot } from "@/lib/uploads";

/**
 * Deletes uploaded files that are no longer referenced by any event.
 * Only ever touches files inside the upload root.
 */
export async function deleteUploads(urls: string[]) {
  const root = uploadRoot();
  for (const url of new Set(urls)) {
    if (!url.startsWith("/api/media/") && !isBlobUrl(url)) continue;
    const stillUsed = await db.event.count({ where: { OR: [{ posterUrl: url }, { coverUrl: url }] } });
    const stillInGallery = await db.media.count({ where: { url } });
    if (stillUsed || stillInGallery) continue;
    if (isBlobUrl(url)) {
      await del(url).catch(() => undefined);
      continue;
    }
    const segments = url.replace("/api/media/", "").split("/");
    if (segments.some((s) => !/^[\w\-.]+$/.test(s) || s.startsWith("."))) continue;
    const full = path.resolve(/*turbopackIgnore: true*/ root, ...segments);
    if (!full.startsWith(root + path.sep)) continue;
    await unlink(full).catch(() => undefined);
  }
}
