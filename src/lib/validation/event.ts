import { z } from "zod";
import { EVENT_CATEGORIES, EVENT_STATUSES, EXPERIENCES, PUBLISH_STATES } from "@/lib/constants";

const optionalUrl = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .refine((v) => v === null || /^https?:\/\//i.test(v), "Must be a full URL starting with https://");

/** Uploaded media: local /api/media/... paths or public Vercel Blob URLs. */
const uploadedUrl = /^(\/api\/media\/[\w\-/.]+|https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/uploads\/[\w\-/.]+)$/i;
const mediaPath = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : v))
  .nullable()
  .refine((v) => v === null || uploadedUrl.test(v), "Invalid image reference");

const optionalDate = z
  .string()
  .trim()
  .transform((v) => (v === "" ? null : new Date(v)))
  .nullable()
  .refine((v) => v === null || !Number.isNaN(v.getTime()), "Invalid date");

export const eventSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(160),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .max(120)
    .transform((v) => v.replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, ""))
    .optional()
    .default(""),
  experience: z.enum(EXPERIENCES),
  status: z.enum(PUBLISH_STATES),
  eventStatus: z.enum(EVENT_STATUSES),
  category: z.enum(EVENT_CATEGORIES),
  artists: z.string().trim().max(500).default(""),
  summary: z.string().trim().max(300).default(""),
  description: z.string().trim().max(10000).default(""),
  venue: z.string().trim().max(200).default(""),
  city: z.string().trim().max(120).default(""),
  startsAt: optionalDate,
  endsAt: optionalDate,
  posterUrl: mediaPath,
  coverUrl: mediaPath,
  bookingUrl: optionalUrl,
  featured: z.boolean().default(false),
  gallery: z
    .array(z.object({ url: z.string().regex(uploadedUrl), alt: z.string().max(200).default("") }))
    .max(60)
    .default([]),
});

export type EventFormData = z.output<typeof eventSchema>;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}
