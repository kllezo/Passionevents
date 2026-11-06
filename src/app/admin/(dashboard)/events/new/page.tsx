import Link from "next/link";
import { requireAdmin } from "@/lib/auth/dal";
import { EventForm } from "@/components/admin/EventForm";

// Session-gated, always request-time: allow blocking navigation.
export const instant = false;

export const metadata = { title: "New event" };

export default async function NewEventPage({ searchParams }: PageProps<"/admin/events/new">) {
  await requireAdmin();
  const sp = await searchParams;
  const experience = sp.type === "EVENTS" ? "EVENTS" : "LIVE";
  return (
    <div className="max-w-5xl space-y-6">
      <Link href="/admin/events" className="text-sm text-stone hover:text-ink">
        ← All events
      </Link>
      <h1 className="font-serif text-5xl">New event</h1>
      <EventForm
        initial={{
          title: "",
          slug: "",
          experience,
          status: "DRAFT",
          eventStatus: "ANNOUNCED",
          category: experience === "LIVE" ? "CONCERT" : "WEDDING",
          artists: "",
          summary: "",
          description: "",
          venue: "",
          city: "",
          startsAt: null,
          endsAt: null,
          posterUrl: null,
          coverUrl: null,
          bookingUrl: null,
          featured: false,
          gallery: [],
        }}
      />
    </div>
  );
}
