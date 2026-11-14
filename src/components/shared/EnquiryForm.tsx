"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Check, Loader2, MessageCircle } from "lucide-react";
import { BUDGET_RANGES, ENQUIRY_CATEGORIES, ENQUIRY_SERVICES } from "@/lib/constants";
import { gsap } from "@/motion/gsap";

type Theme = "events" | "live";
type Status = "idle" | "submitting" | "success" | "error";

const themes = {
  events: {
    group: "border-t border-ink/15 pt-8",
    groupNo: "font-serif text-lg italic text-rose",
    groupTitle: "font-serif text-3xl text-ink",
    label: "text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-stone",
    input:
      "mt-2 w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-lg text-ink placeholder:text-stone-light/70 transition-colors focus:border-rose-deep focus:outline-none focus:ring-0",
    chip: "border-ink/15 text-ink/80 hover:border-ink/40 has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-ivory",
    error: "text-coral-deep",
    submit: "bg-ink text-ivory hover:bg-forest",
    success: "bg-cream text-ink",
  },
  live: {
    group: "border-t border-white/10 pt-8",
    groupNo: "font-grotesk text-sm text-volt",
    groupTitle: "font-display text-3xl uppercase tracking-wide text-white",
    label: "font-grotesk text-[0.7rem] uppercase tracking-[0.22em] text-fog",
    input:
      "mt-2 w-full rounded-none border-0 border-b border-white/20 bg-transparent px-0 py-3 font-grotesk text-lg text-white placeholder:text-white/30 transition-colors focus:border-volt focus:outline-none focus:ring-0 [color-scheme:dark]",
    chip: "border-white/15 font-grotesk text-white/80 hover:border-white/50 has-[:checked]:border-volt has-[:checked]:bg-volt has-[:checked]:text-black",
    error: "text-hot",
    submit: "bg-volt text-black hover:bg-white",
    success: "bg-graphite text-white",
  },
} as const;

export function EnquiryForm({
  theme = "events",
  source = "events",
  defaultCategory,
  whatsappHref,
  partnerTypes,
}: {
  partnerTypes?: { key: string; label: string }[];
  theme?: Theme;
  source?: "events" | "live" | "partners";
  defaultCategory?: (typeof ENQUIRY_CATEGORIES)[number];
  whatsappHref?: string | null;
}) {
  const t = themes[theme];
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [partner, setPartner] = useState<string>("");

  // Pre-select a partnership type from ?type=… (set by the collaboration cards).
  useEffect(() => {
    if (!partnerTypes) return;
    const t = new URLSearchParams(window.location.search).get("type");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL once on mount
    if (t && partnerTypes.some((p) => p.key === t)) setPartner(t);
  }, [partnerTypes]);

  const id = (k: string) => `${uid}-${k}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      fullName: String(fd.get("fullName") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      category: String(fd.get("category") ?? ""),
      eventDate: String(fd.get("eventDate") ?? ""),
      location: String(fd.get("location") ?? ""),
      guestCount: String(fd.get("guestCount") ?? ""),
      budget: String(fd.get("budget") ?? ""),
      services: fd.getAll("services").map(String),
      details: [partner ? `Partnership type: ${partnerTypes?.find((p) => p.key === partner)?.label ?? partner}` : "", String(fd.get("details") ?? "")]
        .filter(Boolean)
        .join("\n\n"),
      website: String(fd.get("website") ?? ""),
      source,
    };

    // Validation library loads on first submit, not with the page.
    const { enquirySchema } = await import("@/lib/validation/enquiry");
    const check = enquirySchema.safeParse(payload);
    if (!check.success) {
      const fe: Record<string, string> = {};
      for (const i of check.error.issues) {
        const k = String(i.path[0]);
        if (!fe[k]) fe[k] = i.message;
      }
      setErrors(fe);
      setStatus("error");
      setMessage("Please check the highlighted fields.");
      const first = formRef.current?.querySelector<HTMLElement>(`[name="${Object.keys(fe)[0]}"]`);
      first?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };
      if (!res.ok || !data.ok) {
        setErrors(data.fieldErrors ?? {});
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setName(payload.fullName.split(" ")[0]);
      setStatus("success");
      requestAnimationFrame(() => {
        if (successRef.current) {
          gsap.from(successRef.current.children, { autoAlpha: 0, y: 24, stagger: 0.08, duration: 1, ease: "expo.out" });
          successRef.current.focus();
        }
      });
    } catch {
      setStatus("error");
      setMessage("We couldn't reach the server. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className={`rounded-[2rem] p-10 outline-none md:p-16 ${t.success}`}>
        <span className={`grid size-16 place-items-center rounded-full ${theme === "live" ? "bg-volt text-black" : "bg-coral text-ivory"}`}>
          <Check className="size-7" />
        </span>
        <h3 className={`mt-8 ${theme === "live" ? "font-display text-5xl uppercase" : "font-serif text-5xl font-light"}`}>Thank you{name ? `, ${name}` : ""}.</h3>
        <p className="mt-4 max-w-lg text-lg opacity-80">Your enquiry has been received. Our team will review the details and get back to you.</p>
        {whatsappHref && (
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 underline underline-offset-4">
            <MessageCircle className="size-4" /> Prefer to chat? Message us on WhatsApp
          </a>
        )}
      </div>
    );
  }

  const field = (k: string, label: string, control: ReactNode, span = "") => (
    <div className={span}>
      <label htmlFor={id(k)} className={t.label}>
        {label}
      </label>
      {control}
      {errors[k] && (
        <p id={`${id(k)}-err`} className={`mt-2 text-sm ${t.error}`}>
          {errors[k]}
        </p>
      )}
    </div>
  );
  const aria = (k: string) => ({ id: id(k), name: k, "aria-invalid": Boolean(errors[k]) || undefined, "aria-describedby": errors[k] ? `${id(k)}-err` : undefined });

  return (
    <form ref={formRef} onSubmit={onSubmit} method="post" action="/api/enquiries" noValidate className="space-y-14" aria-describedby={message ? id("status") : undefined}>
      <input type="hidden" name="source" value={source} />
      {/* honeypot */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {partnerTypes && (
        <fieldset className={t.group}>
          <legend className="mb-6 flex items-baseline gap-4">
            <span className={t.groupNo}>00</span>
            <span className={t.groupTitle}>You are a…</span>
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {partnerTypes.map((p) => (
              <label key={p.key} className={`relative cursor-pointer select-none rounded-full border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${t.chip}`}>
                <input type="radio" name="partnerType" value={p.key} checked={partner === p.key} onChange={() => setPartner(p.key)} className="sr-only" />
                {p.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className={t.group}>
        <legend className="mb-8 flex items-baseline gap-4">
          <span className={t.groupNo}>01</span>
          <span className={t.groupTitle}>About you</span>
        </legend>
        <div className="grid gap-8 md:grid-cols-2">
          {field("fullName", "Full name *", <input {...aria("fullName")} type="text" autoComplete="name" required className={t.input} placeholder="Your name" />, "md:col-span-2")}
          {field("phone", "Phone number *", <input {...aria("phone")} type="tel" autoComplete="tel" inputMode="tel" required className={t.input} placeholder="+91" />)}
          {field("email", "Email *", <input {...aria("email")} type="email" autoComplete="email" required className={t.input} placeholder="you@example.com" />)}
        </div>
      </fieldset>

      <fieldset className={t.group}>
        <legend className="mb-8 flex items-baseline gap-4">
          <span className={t.groupNo}>02</span>
          <span className={t.groupTitle}>The event</span>
        </legend>
        <div className="grid gap-8 md:grid-cols-2">
          {field(
            "category",
            "Event category *",
            <select {...aria("category")} required defaultValue={defaultCategory ?? ""} className={`${t.input} appearance-none`}>
              <option value="" disabled>
                Choose a category
              </option>
              {ENQUIRY_CATEGORIES.map((c) => (
                <option key={c} value={c} className="text-ink">
                  {c}
                </option>
              ))}
            </select>
          )}
          {field("eventDate", "Event date", <input {...aria("eventDate")} type="date" className={t.input} />)}
          {field("location", "Event location", <input {...aria("location")} type="text" autoComplete="address-level2" className={t.input} placeholder="City or venue" />)}
          {field("guestCount", "Guest count", <input {...aria("guestCount")} type="number" min={1} inputMode="numeric" className={t.input} placeholder="Approximate" />)}
          {field(
            "budget",
            "Estimated budget",
            <select {...aria("budget")} defaultValue="" className={`${t.input} appearance-none`}>
              <option value="">Prefer not to say</option>
              {BUDGET_RANGES.map((b) => (
                <option key={b} value={b} className="text-ink">
                  {b}
                </option>
              ))}
            </select>,
            "md:col-span-2"
          )}
        </div>
      </fieldset>

      <fieldset className={t.group}>
        <legend className="mb-8 flex items-baseline gap-4">
          <span className={t.groupNo}>03</span>
          <span className={t.groupTitle}>What you need</span>
        </legend>
        <p className={`${t.label} mb-4`}>Services required — select all that apply</p>
        <div className="flex flex-wrap gap-2.5">
          {ENQUIRY_SERVICES.map((s) => (
            <label key={s} className={`relative cursor-pointer select-none rounded-full border px-4 py-2.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${t.chip}`}>
              <input type="checkbox" name="services" value={s} className="sr-only" />
              {s}
            </label>
          ))}
        </div>
        <div className="mt-10">
          {field(
            "details",
            "Additional details",
            <textarea {...aria("details")} rows={5} className={`${t.input} resize-y`} placeholder="Tell us about the occasion, the feeling you want, venues you love…" />
          )}
        </div>
      </fieldset>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div id={id("status")} role="status" aria-live="polite" className={`text-sm ${status === "error" ? t.error : "opacity-70"}`}>
          {message}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {whatsappHref && (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm underline underline-offset-4">
              <MessageCircle className="size-4" /> WhatsApp us
            </a>
          )}
          <button
            type="submit"
            disabled={status === "submitting"}
            className={`inline-flex min-w-[220px] items-center justify-center gap-3 rounded-full px-9 py-4 text-xs font-semibold uppercase tracking-[0.22em] transition-colors disabled:opacity-60 ${t.submit}`}
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Sending…
              </>
            ) : (
              "Send enquiry"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
