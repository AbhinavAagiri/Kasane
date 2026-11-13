import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { categoryLabel, eventDateLabel, upcomingEvents } from '@/data/events';

export const EventsTeaser = () => {
  const next = upcomingEvents.slice(0, 4);

  return (
    <section id="today" className="scroll-mt-24 border-b border-ink/10 py-[var(--spacing-section)]">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.14em] text-ink/58">
              <span className="seal-dot" aria-hidden="true" />
              The calendar · what’s next
            </p>
            <h2 className="display-lg mt-3 max-w-[14ch]">
              A reason to
              <br />
              <em className="text-ink/68">go now.</em>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-[0.9375rem] leading-relaxed text-ink/68">
              A short, checked list of festivals, rituals and gatherings — chosen for what they say
              about a place, not for how photogenic they are.
            </p>
            <Link
              to="/events"
              className="mt-5 inline-flex items-center gap-2 text-[0.8125rem] underline decoration-ink/25 underline-offset-4 transition-colors hover:text-olive"
            >
              See the full calendar
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <ol className="mt-10 border-t border-ink/14">
          {next.map((event, index) => (
            <li key={event.slug} className="border-b border-ink/10">
              <Link
                to={`/events/${event.slug}`}
                className="group grid gap-4 py-5 md:grid-cols-12 md:items-center md:gap-6"
              >
                <div className="flex items-baseline gap-4 md:col-span-3">
                  <span className="index-number text-ink/38">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-display text-[1.35rem] leading-none">{eventDateLabel(event)}</p>
                    <p className="mt-1 text-[0.625rem] uppercase tracking-[0.1em] text-ink/50">
                      {categoryLabel(event.category)}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <h3 className="font-display text-[1.6rem] leading-tight transition-colors group-hover:text-olive">
                    {event.name}
                  </h3>
                  <p className="mt-1 text-[0.75rem] text-ink/58">
                    {event.city}, {event.country}
                  </p>
                </div>
                <p className="max-w-[52ch] text-[0.8125rem] leading-relaxed text-ink/62 md:col-span-3">
                  {event.summary}
                </p>
                <div className="flex items-center justify-end md:col-span-1">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-ivory">
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
