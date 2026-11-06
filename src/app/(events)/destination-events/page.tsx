import { CategoryPage } from "@/components/events/CategoryPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Destination Weddings & Events in India",
  description: "Destination weddings and events across India — venues, hotels, guest travel, local vendors and multi-day itineraries managed by Passion Events.",
  path: "/destination-events",
});

export default function Page() {
  return <CategoryPage categoryKey="destination" />;
}
