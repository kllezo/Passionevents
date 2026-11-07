import { CategoryPage } from "@/components/events/CategoryPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Event Production & Management in Hyderabad",
  description: "Stage design and fabrication, sound, lighting, LED, on-ground event teams and complete event management by Passion Events.",
  path: "/event-production",
});

export default function Page() {
  return <CategoryPage categoryKey="production" />;
}
