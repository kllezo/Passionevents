import { CategoryPage } from "@/components/events/CategoryPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Corporate Event Management",
  description: "Conferences, product launches, award nights and offsites — stage, AV, lighting and complete corporate event management by Passion Events, Hyderabad.",
  path: "/corporate-events",
});

export default function Page() {
  return <CategoryPage categoryKey="corporate" />;
}
