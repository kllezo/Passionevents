"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/auth/session";
import { requireAdmin } from "@/lib/auth/dal";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { eventSchema, slugify } from "@/lib/validation/event";
import { ENQUIRY_STATUSES, PUBLISH_STATES } from "@/lib/constants";
import { deleteUploads } from "@/lib/upload-cleanup";

/* ── Auth ──────────────────────────────────────────────────────────────────── */

export type LoginState = { error?: string } | undefined;

// Used when the email doesn't exist so response time doesn't reveal valid accounts.
const DUMMY_HASH = "$2b$12$uyZljl7aj5mmozBLKVC4q.y3m4NJF89Q6zQ15oIMhtveuGyxDh252";

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const h = await headers();
  if (!rateLimit(`login:${clientKey(h)}`, 8, 15 * 60 * 1000).ok) {
    return { error: "Too many sign-in attempts. Please wait 15 minutes and try again." };
  }
  const parsed = z
    .object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1).max(200) })
    .safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Enter your email and password." };

  const user = await db.adminUser.findUnique({ where: { email: parsed.data.email } });
  const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) return { error: "That email and password don't match." };

  await createSession({ sub: user.id, email: user.email, name: user.name });
  await db.adminUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  redirect("/admin");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}

/* ── Events ────────────────────────────────────────────────────────────────── */

export type EventFormState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string>; id?: string } | undefined;

function revalidatePublic() {
  revalidatePath("/", "layout");
}

async function uniqueSlug(base: string, excludeId?: string) {
  const root = base || "event";
  let slug = root;
  for (let i = 2; i < 200; i++) {
    const clash = await db.event.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) }, select: { id: true } });
    if (!clash) return slug;
    slug = `${root}-${i}`;
  }
  return `${root}-${Date.now()}`;
}

export async function saveEventAction(_prev: EventFormState, formData: FormData): Promise<EventFormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "") || undefined;
  let gallery: unknown = [];
  try {
    gallery = JSON.parse(String(formData.get("gallery") ?? "[]"));
  } catch {
    return { error: "Gallery data was malformed. Please reload and try again." };
  }

  const parsed = eventSchema.safeParse({
    title: formData.get("title") ?? "",
    slug: formData.get("slug") ?? "",
    experience: formData.get("experience"),
    status: formData.get("intent") === "publish" ? "PUBLISHED" : formData.get("intent") === "draft" ? "DRAFT" : formData.get("status"),
    eventStatus: formData.get("eventStatus"),
    category: formData.get("category"),
    artists: formData.get("artists") ?? "",
    summary: formData.get("summary") ?? "",
    description: formData.get("description") ?? "",
    venue: formData.get("venue") ?? "",
    city: formData.get("city") ?? "",
    startsAt: formData.get("startsAt") ?? "",
    endsAt: formData.get("endsAt") ?? "",
    posterUrl: formData.get("posterUrl") ?? "",
    coverUrl: formData.get("coverUrl") ?? "",
    bookingUrl: formData.get("bookingUrl") ?? "",
    featured: formData.get("featured") === "on",
    gallery,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) {
      const k = String(i.path[0] ?? "form");
      if (!fieldErrors[k]) fieldErrors[k] = i.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }
  const d = parsed.data;
  if (d.endsAt && d.startsAt && d.endsAt < d.startsAt) return { error: "The end time is before the start time.", fieldErrors: { endsAt: "Must be after the start" } };

  const slug = await uniqueSlug(d.slug || slugify(d.title), id);
  const existing = id ? await db.event.findUnique({ where: { id }, select: { publishedAt: true, posterUrl: true, coverUrl: true, media: { select: { url: true } } } }) : null;
  if (id && !existing) return { error: "This event no longer exists." };

  const data = {
    title: d.title,
    slug,
    experience: d.experience,
    status: d.status,
    eventStatus: d.eventStatus,
    category: d.category,
    artists: d.artists
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .join(", "),
    summary: d.summary,
    description: d.description,
    venue: d.venue,
    city: d.city,
    startsAt: d.startsAt,
    endsAt: d.endsAt,
    posterUrl: d.posterUrl,
    coverUrl: d.coverUrl,
    bookingUrl: d.bookingUrl,
    featured: d.featured,
    publishedAt: d.status === "PUBLISHED" ? (existing?.publishedAt ?? new Date()) : existing?.publishedAt ?? null,
  };

  let savedId = id;
  await db.$transaction(async (tx) => {
    if (id) {
      await tx.event.update({ where: { id }, data });
      await tx.media.deleteMany({ where: { eventId: id } });
    } else {
      const created = await tx.event.create({ data });
      savedId = created.id;
    }
    if (d.gallery.length) {
      await tx.media.createMany({
        data: d.gallery.map((g, i) => ({ eventId: savedId!, url: g.url, alt: g.alt, sortOrder: i })),
      });
    }
  });

  // Remove files that were detached from this event during the edit.
  if (existing) {
    const keep = new Set([d.posterUrl, d.coverUrl, ...d.gallery.map((g) => g.url)].filter(Boolean));
    const old = [existing.posterUrl, existing.coverUrl, ...existing.media.map((m) => m.url)].filter((u): u is string => Boolean(u));
    await deleteUploads(old.filter((u) => !keep.has(u)));
  }

  revalidatePublic();
  revalidatePath("/admin", "layout");
  if (!id) redirect(`/admin/events/${savedId}?saved=1`);
  return { ok: true, id: savedId };
}

export async function setEventPublishAction(formData: FormData) {
  await requireAdmin();
  const id = z.string().min(1).parse(formData.get("id"));
  const status = z.enum(PUBLISH_STATES).parse(formData.get("status"));
  const e = await db.event.findUnique({ where: { id }, select: { publishedAt: true } });
  if (!e) return;
  await db.event.update({ where: { id }, data: { status, publishedAt: status === "PUBLISHED" ? (e.publishedAt ?? new Date()) : e.publishedAt } });
  revalidatePublic();
  revalidatePath("/admin", "layout");
}

export async function deleteEventAction(formData: FormData) {
  await requireAdmin();
  const id = z.string().min(1).parse(formData.get("id"));
  const e = await db.event.findUnique({ where: { id }, include: { media: true } });
  if (!e) redirect("/admin/events");
  await db.event.delete({ where: { id } });
  await deleteUploads([e.posterUrl, e.coverUrl, ...e.media.map((m) => m.url)].filter((u): u is string => Boolean(u)));
  revalidatePublic();
  revalidatePath("/admin", "layout");
  redirect("/admin/events?deleted=1");
}

/* ── Enquiries ─────────────────────────────────────────────────────────────── */

export async function setEnquiryStatusAction(formData: FormData) {
  await requireAdmin();
  const id = z.string().min(1).parse(formData.get("id"));
  const status = z.enum(ENQUIRY_STATUSES).parse(formData.get("status"));
  await db.enquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin", "layout");
}

export async function deleteEnquiryAction(formData: FormData) {
  await requireAdmin();
  const id = z.string().min(1).parse(formData.get("id"));
  await db.enquiry.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin", "layout");
}
