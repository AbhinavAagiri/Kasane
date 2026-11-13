import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { sampleTrips } from '@/data/trips';
import { formatCurrency, formatDateRange, formatDayDate, pluralize, tripCost } from '@/lib/format';

export const PlanSection = () => {
  const trip = sampleTrips[0];
  if (!trip) return null;

  const days = trip.days.slice(0, 3);
  const total = tripCost(trip);

  return (
    <section className="bg-stone/45 py-[var(--spacing-section)]">
      <div className="shell grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4">
          <SectionHeading title="A journey, not a list" />
          <p className="mt-6 body-lead text-ink/75">
            The best trips have room in them. Build a day-by-day plan, keep the places you care
            about together, and leave the rest open.
          </p>
          <p className="mt-4 text-[0.9rem] leading-relaxed text-ink/60">
            Add destinations, activities, notes and costs. Reorder the days until they feel right.
            Then print the itinerary, or keep it here until you are ready.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button as={Link} to="/plan/new" variant="primary" size="md">
              Build your own journey
            </Button>
            <Link to="/plan" className="link-quiet text-[0.875rem] text-ink/70">
              See all trips
            </Link>
          </div>
          <p className="mt-8 border-t border-ink/15 pt-4 text-[0.75rem] leading-relaxed text-ink/45">
            This sample is fully editable. Dates, places and costs are estimates, not bookings.
          </p>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <div className="border border-ink/12 bg-cream p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/12 pb-6">
              <div>
                <p className="text-[0.75rem] font-medium text-olive">A sample journey</p>
                <h3 className="display-sm mt-2">{trip.title}</h3>
                <p className="mt-2 text-[0.8125rem] text-ink/55">
                  {formatDateRange(trip.startDate, trip.endDate)} ·{' '}
                  {pluralize(trip.days.length, 'day')} ·{' '}
                  {trip.destinationSlugs.length} base
                </p>
              </div>
              <span className="border border-ink/15 px-3 py-1.5 text-[0.6875rem] text-ink/50">
                Editable
              </span>
            </div>

            <div>
              {days.map((day, index) => (
                <div key={day.id} className="grid gap-3 border-b border-ink/10 py-5 sm:grid-cols-[7rem_1fr]">
                  <div>
                    <p className="text-[0.6875rem] font-medium tabular-nums text-ink/40">
                      Day {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-1 text-[0.75rem] text-ink/50">{formatDayDate(trip.startDate, index)}</p>
                  </div>
                  <div>
                    <p className="font-display text-[1.25rem] leading-tight">{day.title}</p>
                    <ul className="mt-2 space-y-1.5">
                      {day.activities.slice(0, 2).map((activity) => (
                        <li key={activity.id} className="flex gap-3 text-[0.8125rem] text-ink/60">
                          {activity.time ? (
                            <span className="w-10 shrink-0 tabular-nums text-ink/40">{activity.time}</span>
                          ) : null}
                          <span>{activity.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-end justify-between gap-5 pt-6">
              <div>
                <p className="text-[0.6875rem] font-medium text-ink/40">Estimated total</p>
                <p className="mt-1 font-display text-[1.8rem] leading-none">{formatCurrency(total)}</p>
              </div>
              <Link
                to={`/plan/${trip.id}`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[0.8125rem] font-medium text-ivory transition-colors hover:bg-forest"
              >
                Open this trip
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
