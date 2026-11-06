import { CategoryPage } from "@/components/events/CategoryPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Private Celebrations & Parties",
  description: "Birthdays, anniversaries, engagements and milestone celebrations — thoughtfully styled and managed by Passion Events in Hyderabad and across India.",
  path: "/private-events",
});

export default function Page() {
  return <CategoryPage categoryKey="private" />;
}
