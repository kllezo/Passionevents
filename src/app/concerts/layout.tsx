import type { Metadata, Viewport } from "next";
import { site } from "@/lib/site";
import { UniverseMarker } from "@/components/shared/UniverseTransition";
import { LiveNav } from "@/components/live/LiveNav";
import { LiveFooter } from "@/components/live/LiveFooter";
import { LiveSoundProvider } from "@/components/live/LiveSound";

export const metadata: Metadata = {
  title: { default: "Passion Live — Concerts & Live Entertainment", template: "%s | Passion Live" },
  description: site.liveDescription,
  openGraph: {
    siteName: site.liveName,
    images: [{ url: "/brand/og-passion-live.jpg", width: 1200, height: 630, alt: "Passion Live" }],
  },
};

export const viewport: Viewport = { themeColor: "#050508", colorScheme: "dark" };

export default function LiveLayout({ children }: LayoutProps<"/concerts">) {
  return (
    <LiveSoundProvider>
      <div className="universe-live min-h-screen bg-void font-grotesk text-white">
        <UniverseMarker value="live" />
        <LiveNav />
        <main id="main">{children}</main>
        <LiveFooter />
      </div>
    </LiveSoundProvider>
  );
}
