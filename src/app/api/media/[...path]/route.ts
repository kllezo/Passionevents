import type { NextRequest } from "next/server";
import { readUpload } from "@/lib/uploads";

/** Serves admin-uploaded images (stored outside /public so they survive builds). */
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/media/[...path]">) {
  const { path } = await ctx.params;
  const file = await readUpload(path);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Last-Modified": file.mtime.toUTCString(),
      "X-Content-Type-Options": "nosniff",
    },
  });
}
