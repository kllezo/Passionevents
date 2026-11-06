import type { Metadata } from "next";
import { UniverseMarker } from "@/components/shared/UniverseTransition";

// Admin screens are always request-time (session cookie); opt out of instant-navigation validation.
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Passion Events Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen bg-[#f6f3ee] font-sans text-ink">
      <UniverseMarker value="admin" />
      {children}
    </div>
  );
}
