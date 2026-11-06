import { EventsNav } from "@/components/events/EventsNav";
import { EventsFooter } from "@/components/events/EventsFooter";
import { EventsCursor } from "@/components/events/Cursor";
import { UniverseMarker } from "@/components/shared/UniverseTransition";

export default function EventsLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="universe-events bg-ivory text-ink">
      <UniverseMarker value="events" />
      <EventsCursor />
      <EventsNav />
      <main id="main">{children}</main>
      <EventsFooter />
    </div>
  );
}
