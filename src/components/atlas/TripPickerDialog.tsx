import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useAtlas } from '@/store/AtlasProvider';
import { useToast } from '@/components/ui/Toast';
import { formatDateRange, pluralize } from '@/lib/format';
import { cn } from '@/lib/utils';

type TripPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destinationSlug: string;
  name: string;
};

export const TripPickerDialog = ({
  open,
  onOpenChange,
  destinationSlug,
  name,
}: TripPickerDialogProps) => {
  const atlas = useAtlas();
  const { push } = useToast();

  const add = (tripId: string, title: string) => {
    atlas.addDestinationToTrip(tripId, destinationSlug);
    push({ title: `${name} added to ${title}`, description: 'Open Plan to build the days.' });
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Add ${name} to a trip`}
      description="The place is added to the trip’s map. Activities stay yours to arrange."
      footer={
        <div className="flex items-center justify-between gap-4 text-[0.8125rem]">
          <Link to="/plan?new=1" onClick={() => onOpenChange(false)} className="link-quiet text-ink">
            Start a new trip
          </Link>
          <Link to="/plan" onClick={() => onOpenChange(false)} className="text-ink/55 hover:text-ink">
            All trips
          </Link>
        </div>
      }
    >
      {atlas.trips.length ? (
        <ul className="flex flex-col">
          {atlas.trips.map((trip) => {
            const included = trip.destinationSlugs.includes(destinationSlug);
            return (
              <li key={trip.id} className="border-b border-ink/8 last:border-b-0">
                <button
                  type="button"
                  disabled={included}
                  onClick={() => add(trip.id, trip.title)}
                  className={cn(
                    'flex w-full items-center justify-between gap-4 py-3.5 text-left transition-colors',
                    included ? 'cursor-default text-ink/55' : 'hover:text-olive',
                  )}
                >
                  <span>
                    <span className="block text-[0.9375rem] leading-snug">{trip.title}</span>
                    <span className="mt-0.5 block text-[0.75rem] text-ink/50">
                      {formatDateRange(trip.startDate, trip.endDate)} ·{' '}
                      {pluralize(trip.days.length, 'day')}
                    </span>
                  </span>
                  <span className="text-[0.75rem]">{included ? 'In trip' : 'Add'}</span>
                  {included ? (
                    <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="border-t border-ink/10 py-6">
          <p className="text-[0.9375rem] text-ink/65">No trips yet. Start one and add places as you go.</p>
          <Link
            to="/plan?new=1"
            onClick={() => onOpenChange(false)}
            className="mt-4 inline-flex h-11 items-center rounded-full bg-ink px-6 text-[0.875rem] font-medium text-ivory"
          >
            Plan a trip
          </Link>
        </div>
      )}
    </Modal>
  );
};
