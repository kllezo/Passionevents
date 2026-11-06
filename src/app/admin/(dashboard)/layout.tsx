import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { CalendarDays, ExternalLink, Inbox, LayoutDashboard, LogOut, Plus } from "lucide-react";
import { brand } from "@/content/media";
import { requireAdmin } from "@/lib/auth/dal";
import { logoutAction } from "../actions";

export const instant = false;

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events & shows", icon: CalendarDays },
  { href: "/admin/events/new", label: "New event", icon: Plus },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
];

/** Session check streams in behind Suspense; children render only for admins. */
async function AdminGate({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-[#e8e0d4] pb-5">
        <p className="text-sm text-stone">
          Signed in as <span className="font-semibold text-ink">{admin.name || admin.email}</span>
        </p>
        <form action={logoutAction}>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full border border-[#e0d6c8] px-4 py-2 text-sm hover:bg-white">
            <LogOut className="size-4" /> Sign out
          </button>
        </form>
      </div>
      {children}
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="border-b border-[#e8e0d4] bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-5 py-5">
          <Image src={brand.logoSmall.src} alt="Passion Events" width={brand.logoSmall.width} height={brand.logoSmall.height} className="h-auto w-12" />
          <div>
            <p className="font-serif text-xl leading-none">Passion Events</p>
            <p className="text-xs text-stone">Studio dashboard</p>
          </div>
        </div>
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink/80 transition-colors hover:bg-[#f6f3ee] hover:text-ink">
              <n.icon className="size-4" /> {n.label}
            </Link>
          ))}
          <a href="/" target="_blank" className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink/60 hover:bg-[#f6f3ee] lg:mt-6">
            <ExternalLink className="size-4" /> View website
          </a>
        </nav>
      </aside>
      <main id="main" className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-10">
        <Suspense fallback={<p className="text-sm text-stone">Loading…</p>}>
          <AdminGate>{children}</AdminGate>
        </Suspense>
      </main>
    </div>
  );
}
