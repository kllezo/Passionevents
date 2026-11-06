"use client";

import { useActionState, useId, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { saveEventAction, type EventFormState } from "@/app/admin/actions";
import { EVENT_CATEGORIES, EVENT_CATEGORY_LABEL, EVENT_STATUSES, EVENT_STATUS_LABEL } from "@/lib/constants";

export type EventFormValues = {
  id?: string;
  title: string;
  slug: string;
  experience: "EVENTS" | "LIVE";
  status: "DRAFT" | "PUBLISHED";
  eventStatus: string;
  category: string;
  artists: string;
  summary: string;
  description: string;
  venue: string;
  city: string;
  startsAt: string | null; // ISO
  endsAt: string | null;
  posterUrl: string | null;
  coverUrl: string | null;
  bookingUrl: string | null;
  featured: boolean;
  gallery: { url: string; alt: string }[];
};

/** Dates are entered and shown in India Standard Time regardless of server/browser TZ. */
function toISTInput(iso: string | null) {
  if (!iso) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${g("year")}-${g("month")}-${g("day")}T${g("hour")}:${g("minute")}`;
}
const fromISTInput = (v: string) => (v ? `${v}:00+05:30` : "");

async function upload(file: File, kind: "poster" | "cover" | "gallery") {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("kind", kind);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
  return data.url;
}

export function EventForm({ initial }: { initial: EventFormValues }) {
  const [state, action, pending] = useActionState<EventFormState, FormData>(saveEventAction, undefined);
  const [experience, setExperience] = useState(initial.experience);
  const [poster, setPoster] = useState(initial.posterUrl);
  const [cover, setCover] = useState(initial.coverUrl);
  const [gallery, setGallery] = useState(initial.gallery);
  const [startsAt, setStartsAt] = useState(toISTInput(initial.startsAt));
  const [endsAt, setEndsAt] = useState(toISTInput(initial.endsAt));
  const [uploading, setUploading] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fe = state?.fieldErrors ?? {};
  const uid = useId();

  const addGallery = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploadError("");
    setUploading((n) => n + files.length);
    for (const file of Array.from(files)) {
      try {
        const url = await upload(file, "gallery");
        setGallery((g) => [...g, { url, alt: "" }]);
      } catch (e) {
        setUploadError(`${file.name}: ${(e as Error).message}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };

  const move = (i: number, d: -1 | 1) =>
    setGallery((g) => {
      const next = [...g];
      const j = i + d;
      if (j < 0 || j >= next.length) return g;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const label = "mb-1.5 block text-sm font-medium";
  const err = (k: string) => (fe[k] ? <p className="mt-1 text-xs text-coral-deep">{fe[k]}</p> : null);

  return (
    <form action={action} className="space-y-8">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="status" value={initial.status} />
      <input type="hidden" name="posterUrl" value={poster ?? ""} />
      <input type="hidden" name="coverUrl" value={cover ?? ""} />
      <input type="hidden" name="gallery" value={JSON.stringify(gallery)} />
      <input type="hidden" name="startsAt" value={fromISTInput(startsAt)} />
      <input type="hidden" name="endsAt" value={fromISTInput(endsAt)} />

      {state?.error && (
        <p role="alert" className="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral-deep">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="rounded-xl bg-forest/10 px-4 py-3 text-sm text-forest">
          Saved.
        </p>
      )}

      {/* Where it appears */}
      <section className="rounded-2xl border border-[#e8e0d4] bg-white p-6">
        <h2 className="font-serif text-2xl">Where should this appear?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["LIVE", "Passion Live show", "Concerts & live events on /concerts — upcoming shows, past experiences and artists."],
              ["EVENTS", "Passion Events portfolio", "A real event you've delivered, shown on /portfolio and its category page."],
            ] as const
          ).map(([v, t, d]) => (
            <label key={v} className={`cursor-pointer rounded-xl border p-4 transition-colors ${experience === v ? "border-ink bg-[#f6f3ee]" : "border-[#e8e0d4]"}`}>
              <input type="radio" name="experience" value={v} checked={experience === v} onChange={() => setExperience(v)} className="sr-only" />
              <span className="block font-semibold">{t}</span>
              <span className="mt-1 block text-sm text-stone">{d}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Basics */}
      <section className="grid gap-5 rounded-2xl border border-[#e8e0d4] bg-white p-6 md:grid-cols-2">
        <h2 className="font-serif text-2xl md:col-span-2">Details</h2>
        <div className="md:col-span-2">
          <label htmlFor={`${uid}-title`} className={label}>
            Title *
          </label>
          <input id={`${uid}-title`} name="title" defaultValue={initial.title} required className="admin-input" />
          {err("title")}
        </div>
        <div>
          <label htmlFor={`${uid}-category`} className={label}>
            Category
          </label>
          <select id={`${uid}-category`} name="category" defaultValue={initial.category} className="admin-input">
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {EVENT_CATEGORY_LABEL[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${uid}-es`} className={label}>
            Event status
          </label>
          <select id={`${uid}-es`} name="eventStatus" defaultValue={initial.eventStatus} className="admin-input">
            {EVENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {EVENT_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        {experience === "LIVE" && (
          <div className="md:col-span-2">
            <label htmlFor={`${uid}-artists`} className={label}>
              Artists (comma separated)
            </label>
            <input id={`${uid}-artists`} name="artists" defaultValue={initial.artists} className="admin-input" placeholder="Only confirmed, verified names" />
            <p className="mt-1 text-xs text-stone">These names power the public &ldquo;Artists &amp; performers&rdquo; section once the show is published.</p>
          </div>
        )}
        {experience !== "LIVE" && <input type="hidden" name="artists" value={initial.artists} />}
        <div className="md:col-span-2">
          <label htmlFor={`${uid}-summary`} className={label}>
            Short summary
          </label>
          <input id={`${uid}-summary`} name="summary" defaultValue={initial.summary} maxLength={300} className="admin-input" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor={`${uid}-desc`} className={label}>
            Description
          </label>
          <textarea id={`${uid}-desc`} name="description" defaultValue={initial.description} rows={7} className="admin-input" />
        </div>
      </section>

      {/* When & where */}
      <section className="grid gap-5 rounded-2xl border border-[#e8e0d4] bg-white p-6 md:grid-cols-2">
        <h2 className="font-serif text-2xl md:col-span-2">When &amp; where</h2>
        <div>
          <label htmlFor={`${uid}-start`} className={label}>
            Starts (IST)
          </label>
          <input id={`${uid}-start`} type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="admin-input" />
          {err("startsAt")}
        </div>
        <div>
          <label htmlFor={`${uid}-end`} className={label}>
            Ends (IST, optional)
          </label>
          <input id={`${uid}-end`} type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="admin-input" />
          {err("endsAt")}
        </div>
        <div>
          <label htmlFor={`${uid}-venue`} className={label}>
            Venue
          </label>
          <input id={`${uid}-venue`} name="venue" defaultValue={initial.venue} className="admin-input" />
        </div>
        <div>
          <label htmlFor={`${uid}-city`} className={label}>
            City
          </label>
          <input id={`${uid}-city`} name="city" defaultValue={initial.city} className="admin-input" />
        </div>
        {experience === "LIVE" ? (
          <div className="md:col-span-2">
            <label htmlFor={`${uid}-book`} className={label}>
              Booking URL
            </label>
            <input id={`${uid}-book`} name="bookingUrl" type="url" defaultValue={initial.bookingUrl ?? ""} placeholder="https://…" className="admin-input" />
            <p className="mt-1 text-xs text-stone">The &ldquo;Book tickets&rdquo; button only appears when this is filled in.</p>
            {err("bookingUrl")}
          </div>
        ) : (
          <input type="hidden" name="bookingUrl" value={initial.bookingUrl ?? ""} />
        )}
      </section>

      {/* Images */}
      <section className="space-y-6 rounded-2xl border border-[#e8e0d4] bg-white p-6">
        <h2 className="font-serif text-2xl">Images</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <SingleImage label={experience === "LIVE" ? "Poster (portrait)" : "Feature image (portrait)"} value={poster} onChange={setPoster} kind="poster" />
          <SingleImage label="Cover image (landscape)" value={cover} onChange={setCover} kind="cover" />
        </div>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium">Gallery ({gallery.length})</p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#e0d6c8] px-4 py-2 text-sm hover:bg-[#f6f3ee]">
              <ImagePlus className="size-4" /> Add photos
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="sr-only" onChange={(e) => addGallery(e.target.files).then(() => (e.target.value = ""))} />
            </label>
          </div>
          {uploading > 0 && (
            <p className="mt-3 flex items-center gap-2 text-sm text-stone">
              <Loader2 className="size-4 animate-spin" /> Uploading {uploading}…
            </p>
          )}
          {uploadError && <p className="mt-3 text-sm text-coral-deep">{uploadError}</p>}
          {gallery.length > 0 && (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((g, i) => (
                <li key={g.url} className="overflow-hidden rounded-xl border border-[#e8e0d4]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.url} alt="" className="aspect-[4/3] w-full object-cover" />
                  <div className="space-y-2 p-3">
                    <input
                      value={g.alt}
                      onChange={(e) => setGallery((all) => all.map((x, k) => (k === i ? { ...x, alt: e.target.value } : x)))}
                      placeholder="Describe the photo (alt text)"
                      aria-label={`Alt text for photo ${i + 1}`}
                      className="admin-input !py-1.5 text-xs"
                    />
                    <div className="flex justify-between">
                      <div className="flex gap-1">
                        <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-md border border-[#e0d6c8] p-1.5 disabled:opacity-30" aria-label="Move earlier">
                          <ArrowUp className="size-3.5" />
                        </button>
                        <button type="button" onClick={() => move(i, 1)} disabled={i === gallery.length - 1} className="rounded-md border border-[#e0d6c8] p-1.5 disabled:opacity-30" aria-label="Move later">
                          <ArrowDown className="size-3.5" />
                        </button>
                      </div>
                      <button type="button" onClick={() => setGallery((all) => all.filter((_, k) => k !== i))} className="rounded-md border border-[#e0d6c8] p-1.5 text-coral-deep" aria-label="Remove photo">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Advanced */}
      <section className="grid gap-5 rounded-2xl border border-[#e8e0d4] bg-white p-6 md:grid-cols-2">
        <h2 className="font-serif text-2xl md:col-span-2">Advanced</h2>
        <div>
          <label htmlFor={`${uid}-slug`} className={label}>
            URL slug
          </label>
          <input id={`${uid}-slug`} name="slug" defaultValue={initial.slug} placeholder="generated from the title" className="admin-input" />
        </div>
        <label className="flex items-center gap-3 self-end pb-3 text-sm">
          <input type="checkbox" name="featured" defaultChecked={initial.featured} className="size-4 accent-[var(--color-rose-deep)]" /> Feature at the top of the portfolio
        </label>
      </section>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e8e0d4] bg-white/95 p-4 shadow-lg backdrop-blur">
        <p className="text-sm text-stone">
          Currently: <strong className="text-ink">{initial.status === "PUBLISHED" ? "Published" : "Draft"}</strong>
        </p>
        <div className="flex gap-3">
          <button type="submit" name="intent" value="draft" disabled={pending || uploading > 0} className="rounded-full border border-[#d8cdbd] px-5 py-2.5 text-sm font-semibold disabled:opacity-50">
            {initial.status === "PUBLISHED" ? "Unpublish & save as draft" : "Save draft"}
          </button>
          <button type="submit" name="intent" value="publish" disabled={pending || uploading > 0} className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-ivory disabled:opacity-50">
            {pending && <Loader2 className="size-4 animate-spin" />}
            {initial.status === "PUBLISHED" ? "Save & keep published" : "Publish"}
          </button>
        </div>
      </div>
    </form>
  );
}

function SingleImage({ label, value, onChange, kind }: { label: string; value: string | null; onChange: (v: string | null) => void; kind: "poster" | "cover" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-[#e8e0d4]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className={`w-full object-cover ${kind === "poster" ? "aspect-[3/4] max-h-80" : "aspect-video"}`} />
          <button type="button" onClick={() => onChange(null)} className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow" aria-label={`Remove ${label}`}>
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#d8cdbd] text-sm text-stone hover:bg-[#f6f3ee]">
          {busy ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
          {busy ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            disabled={busy}
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              setError("");
              try {
                onChange(await upload(f, kind));
              } catch (err) {
                setError((err as Error).message);
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
          />
        </label>
      )}
      {error && <p className="mt-2 text-xs text-coral-deep">{error}</p>}
    </div>
  );
}
