import { CategoryPage } from "@/components/events/CategoryPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Wedding Planners in Hyderabad & Across India",
  description: "Wedding planning, decor, floral styling, catering, photography and complete wedding management by Passion Events — intimate gatherings to grand celebrations across India.",
  path: "/weddings",
});

export default function Page() {
  return <CategoryPage categoryKey="weddings" />;
}
