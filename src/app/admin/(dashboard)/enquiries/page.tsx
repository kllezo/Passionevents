import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/dal";
import { ENQUIRY_STATUSES } from "@/lib/constants";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { deleteEnquiryAction, setEnquiryStatusAction } from "../../actions";

// Session-gated, always request-time: allow blocking navigation.
export const instant = false;

export const metadata = { title: "Enquiries" };

const label: Record<string, string> = { NEW: "New", CONTACTED: "Contacted", CLOSED: "Closed" };

export default async function EnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  await requireAdmin();
  const sp = await searchParams;
  const status = typeof sp.status === "string" && (ENQUIRY_STATUSES as readonly string[]).includes(sp.status) ? sp.status : undefined;
  const enquiries = await db.enquiry.findMany({ where: status ? { status } : {}, orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-5xl">Enquiries</h1>
        <p className="mt-2 text-stone">Every submission from the website forms, newest first.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {[undefined, ...ENQUIRY_STATUSES].map((s) => (
          <Link
            key={s ?? "all"}
            href={s ? `/admin/enquiries?status=${s}` : "/admin/enquiries"}
            className={`rounded-full border px-4 py-2 text-sm ${status === s ? "border-ink bg-ink text-ivory" : "border-[#e0d6c8] bg-white"}`}
          >
            {s ? label[s] : "All"}
          </Link>
        ))}
      </div>

      {enquiries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d8cdbd] bg-white p-12 text-center text-stone">No enquiries to show.</div>
      ) : (
        <ul className="space-y-4">
          {enquiries.map((e) => {
            let services: string[] = [];
            try {
              services = JSON.parse(e.services);
            } catch {}
            return (
              <li key={e.id} className="rounded-2xl border border-[#e8e0d4] bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-2xl">{e.fullName}</p>
                    <p className="text-sm text-stone">
                      {e.category} · received {e.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}
                      {e.source !== "events" && <span className="ml-2 rounded-full bg-[#efe8dd] px-2 py-0.5 text-xs text-ink">{e.source}</span>}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${e.status === "NEW" ? "bg-coral/15 text-coral-deep" : e.status === "CONTACTED" ? "bg-forest/10 text-forest" : "bg-[#efe8dd] text-stone"}`}>
                    {label[e.status] ?? e.status}
                  </span>
                </div>
                <dl className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-stone">Phone</dt>
                    <dd>
                      <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="underline underline-offset-2">
                        {e.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-stone">Email</dt>
                    <dd>
                      <a href={`mailto:${e.email}`} className="break-all underline underline-offset-2">
                        {e.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-stone">Date</dt>
                    <dd>{e.eventDate ? e.eventDate.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium" }) : "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-stone">Location</dt>
                    <dd>{e.location || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-stone">Guests</dt>
                    <dd>{e.guestCount ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-stone">Budget</dt>
                    <dd>{e.budget || "—"}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs uppercase tracking-wider text-stone">Services</dt>
                    <dd>{services.length ? services.join(", ") : "—"}</dd>
                  </div>
                </dl>
                {e.details && <p className="mt-5 whitespace-pre-line rounded-xl bg-[#f9f6f1] p-4 text-sm leading-relaxed">{e.details}</p>}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {ENQUIRY_STATUSES.filter((s) => s !== e.status).map((s) => (
                    <form key={s} action={setEnquiryStatusAction}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="status" value={s} />
                      <button type="submit" className="rounded-full border border-[#e0d6c8] px-3 py-1.5 text-xs hover:bg-[#f6f3ee]">
                        Mark {label[s].toLowerCase()}
                      </button>
                    </form>
                  ))}
                  <form action={deleteEnquiryAction} className="ml-auto">
                    <input type="hidden" name="id" value={e.id} />
                    <ConfirmSubmit message="Delete this enquiry permanently?" className="rounded-full px-3 py-1.5 text-xs text-coral-deep hover:bg-coral/10">
                      Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
