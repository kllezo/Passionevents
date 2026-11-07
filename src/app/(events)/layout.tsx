import { EventsNav } from "@/components/events/EventsNav";
import { EventsFooter } from "@/components/events/EventsFooter";
import { UniverseMarker } from "@/components/shared/UniverseTransition";

export default function EventsLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="universe-events bg-ivory text-ink">
      <UniverseMarker value="events" />
      <EventsNav />
      <main id="main">{children}</main>
      <EventsFooter />
    </div>
  );
}
