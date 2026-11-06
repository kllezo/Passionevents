import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Passion Events",
    short_name: "Passion Events",
    description: "Weddings, corporate events, private celebrations, destination events and concerts across India.",
    start_url: "/",
    display: "standalone",
    background_color: "#fef9ee",
    theme_color: "#fef9ee",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
