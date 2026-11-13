import { Link } from 'react-router-dom';
import { CalendarPlus, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useAtlas } from '@/store/AtlasProvider';
import { useToast } from '@/components/ui/Toast';
import { eventDateLabel, type AtlasEvent } from '@/data/events';
import { cn } from '@/lib/utils';

type AddEventToTripProps = {
  event: AtlasEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const AddEventToTrip = ({ event, open, onOpenChange }: AddEventToTripProps) => {
  const atlas = useAtlas();
  const { push } = useToast();

  const add = (tripId: string, title: string) => {
    const trip = atlas.trips.find((entry) => entry.id === tripId);
    const day = trip?.days[0];
    if (!trip || !day) return;
    if (!trip.destinationSlugs.includes(event.destinationSlug)) {
      atlas.addDestinationToTrip(trip.id, event.destinationSlug);
    }
    const exists = trip.days.some((entry) =>
      entry.activities.some((activity) => activity.title === event.name),
    );
    if (exists) {
      push({ title: `${event.name} is already in ${title}` });
      onOpenChange(false);
      return;
    }
    atlas.addActivity(trip.id, day.id, {
      title: event.name,
      note: `${eventDateLabel(event)} · ${event.city}. ${event.summary}`,
      time: '19:00',
      kind: 'note',
      link: `/events/${event.slug}`,
    });
    push({
      title: `${event.name} added to ${title}`,
      description: 'Open the trip to move it to the right day.',
    });
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Add this event to a trip"
      description="The event is added to the first day as a note. Move it once you know your dates."
      footer={
        <div className="flex items-center justify-between gap-4 text-[0.8125rem]">
          <Link to="/plan/new" onClick={() => onOpenChange(false)} className="link-quiet text-ink">
            Compose a new journey
          </Link>
          <Link to="/plan" onClick={() => onOpenChange(false)} className="text-ink/55 hover:text-ink">
            All trips
          </Link>
        </div>
      }
    >
      {atlas.trips.length ? (
        <ul className="flex flex-col">
          {atlas.trips.map((trip) => (
            <li key={trip.id} className="border-b border-ink/8 last:border-b-0">
              <button
                type="button"
                onClick={() => add(trip.id, trip.title)}
                className="flex w-full items-center justify-between gap-4 py-3.5 text-left transition-colors hover:text-olive"
              >
                <span>
                  <span className="block text-[0.9375rem] leading-snug">{trip.title}</span>
                  <span className="mt-0.5 block text-[0.75rem] text-ink/50">
                    {trip.startDate} → {trip.endDate}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-[0.75rem]">
                  {trip.days.some((day) =>
                    day.activities.some((activity) => activity.title === event.name),
                  ) ? (
                    <>
                      In trip
                      <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      Add
                      <CalendarPlus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                    </>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-t border-ink/10 py-6">
          <p className="text-[0.9375rem] text-ink/65">
            No trips yet. Compose one and the event can be added there.
          </p>
          <Link
            to="/plan/new"
            onClick={() => onOpenChange(false)}
            className={cn(
              'mt-4 inline-flex h-11 items-center rounded-full bg-ink px-6 text-[0.875rem] font-medium text-ivory',
            )}
          >
            Compose a journey
          </Link>
        </div>
      )}
    </Modal>
  );
};
