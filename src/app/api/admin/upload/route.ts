import { NextResponse, type NextRequest } from "next/server";
import { getAdmin } from "@/lib/auth/dal";
import { storeImage, UploadError } from "@/lib/uploads";
import { rateLimit } from "@/lib/rate-limit";

/** Authenticated image upload for the admin dashboard. */
export async function POST(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Not authorised." }, { status: 401 });

  // Same-origin only (defence in depth on top of SameSite cookies).
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) {
    return NextResponse.json({ error: "Cross-origin uploads are not allowed." }, { status: 403 });
  }
  if (!rateLimit(`upload:${admin.id}`, 120, 10 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Upload limit reached. Please wait a few minutes." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  const file = form.get("file");
  const kindRaw = String(form.get("kind") ?? "gallery");
  const kind = (["poster", "cover", "gallery"] as const).find((k) => k === kindRaw) ?? "gallery";
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });

  try {
    const stored = await storeImage(file, kind);
    return NextResponse.json(stored, { status: 201 });
  } catch (err) {
    if (err instanceof UploadError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("[upload] failed", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
