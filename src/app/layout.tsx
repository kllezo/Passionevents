import type { Metadata, Viewport } from "next";
import { Anton, Cormorant_Garamond, Manrope, Mrs_Saint_Delafield, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { SmoothScroll } from "@/motion/SmoothScroll";
import { UniverseTransitionProvider } from "@/components/shared/UniverseTransition";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const script = Mrs_Saint_Delafield({ variable: "--font-script-face", subsets: ["latin"], weight: "400", display: "swap" });
const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400", display: "swap" });
const grotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Passion Events — Weddings, Corporate & Live Events in Hyderabad",
    template: "%s | Passion Events",
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "event management Hyderabad",
    "wedding planner Hyderabad",
    "event planners India",
    "corporate event management",
    "destination wedding planner India",
    "concert organisers Hyderabad",
    "artist booking",
    "Passion Events",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    images: [{ url: "/brand/og-passion-events.jpg", width: 1200, height: 630, alt: "Passion Events logo" }],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [{ color: "#fef9ee" }],
  width: "device-width",
  initialScale: 1,
};

/** Marks the document as motion-capable before paint so reveal targets don't flash. */
const motionBootstrap = `try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion-ok');if(location.pathname==='/'&&!sessionStorage.getItem('pe-intro-seen'))d.classList.add('intro-pending')}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${cormorant.variable} ${manrope.variable} ${script.variable} ${anton.variable} ${grotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <UniverseTransitionProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </UniverseTransitionProvider>
      </body>
    </html>
  );
}
