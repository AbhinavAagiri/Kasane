import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, CalendarDays, MapPin, Search, X } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { eventsMeta } from '@/seo/routes';
import {
  categoryLabel,
  dateStatusLabel,
  daysUntil,
  eventCategories,
  eventDateLabel,
  eventMonth,
  upcomingEvents,
  type AtlasEvent,
  type EventCategory,
} from '@/data/events';
import { destinationBySlug } from '@/data/destinations';
import { SmartImage } from '@/components/media/SmartImage';
import { EventSaveButton } from '@/components/events/EventSaveButton';
import { cn } from '@/lib/utils';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const imageFor = (event: AtlasEvent) =>
  event.image ?? destinationBySlug[event.destinationSlug]?.image.src ?? 'atlas-hero';

const num = (event: AtlasEvent) => new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
}).format(new Date(`${event.startDate}T12:00:00`));

export const EventsPage = () => {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const category = params.get('category') as EventCategory | null;
  const country = params.get('country') ?? '';
  const month = params.get('month') ?? '';
  const freeOnly = params.get('free') === '1';

  usePageMeta(eventsMeta);

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const countries = Array.from(new Set(upcomingEvents.map((event) => event.country))).sort();
  const months = Array.from(new Set(upcomingEvents.map((event) => eventMonth(event)))).sort(
    (a, b) => a - b,
  );

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return upcomingEvents.filter((event) => {
      if (category && event.category !== category) return false;
      if (country && event.country !== country) return false;
      if (month && String(eventMonth(event)) !== month) return false;
      if (freeOnly && !['free', 'free-registration'].includes(event.tickets.status)) return false;
      if (!term) return true;
      return [event.name, event.city, event.country, event.summary, ...event.tags]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  }, [category, country, month, freeOnly, query]);

  const featured = results[0];
  const rest = results.slice(1);
  const activeFilters = Boolean(category || country || month || freeOnly || query);

  const clear = () => {
    setQuery('');
    setParams(new URLSearchParams(), { replace: true });
  };

  return (
    <>
      <section className="relative overflow-hidden bg-forest pb-16 pt-[calc(var(--nav-h)+3rem)] text-ivory md:pb-20 md:pt-[calc(var(--nav-h)+4.5rem)]">
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.16em] text-ivory/50">
                <span className="seal-dot" aria-hidden="true" />
                The calendar · 2027
              </p>
              <h1 className="display-xl mt-5 max-w-[12ch]">
                What’s
                <br />
                <em className="text-ivory/70">on.</em>
              </h1>
            </div>
            <div className="md:col-span-4">
              <p className="max-w-[36ch] text-[0.9375rem] leading-relaxed text-ivory/65">
                Not a city events feed. A short, checked list of cultural moments worth building a
                journey around — with the source, the etiquette and the caveats attached.
              </p>
              <p className="mt-5 border-t border-ivory/15 pt-4 text-[0.6875rem] uppercase leading-relaxed tracking-[0.11em] text-ivory/35">
                {upcomingEvents.length} upcoming entries
                <br />
                Dates checked 12 Nov 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-paper">
        <div className="shell py-5">
          <div className="flex flex-col gap-4">
            <form
              role="search"
              className="flex items-center gap-3 border-b border-ink/25 pb-2.5"
              onSubmit={(event) => {
                event.preventDefault();
                update('q', query.trim() || null);
              }}
            >
              <Search className="h-4 w-4 shrink-0 text-ink/45" strokeWidth={1.5} aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onBlur={() => update('q', query.trim() || null)}
                placeholder="Search a festival, city or subject"
                aria-label="Search events"
                maxLength={80}
                className="h-8 w-full bg-transparent text-[0.9375rem] placeholder:text-ink/35 focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    update('q', null);
                  }}
                  aria-label="Clear event search"
                  className="text-ink/40 hover:text-ink"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              ) : null}
            </form>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => update('category', null)}
                aria-pressed={!category}
                className={cn(
                  'h-8 rounded-full border px-3.5 text-[0.6875rem] transition-colors',
                  !category
                    ? 'border-ink bg-ink text-ivory'
                    : 'border-ink/15 text-ink/65 hover:border-ink/35',
                )}
              >
                Everything
              </button>
              {eventCategories.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => update('category', category === entry.id ? null : entry.id)}
                  aria-pressed={category === entry.id}
                  className={cn(
                    'h-8 rounded-full border px-3.5 text-[0.6875rem] transition-colors',
                    category === entry.id
                      ? 'border-ink bg-ink text-ivory'
                      : 'border-ink/15 text-ink/65 hover:border-ink/35',
                  )}
                >
                  {entry.label}
                </button>
              ))}
              <span className="mx-1 hidden h-5 w-px bg-ink/15 sm:block" aria-hidden="true" />
              <select
                value={country}
                onChange={(event) => update('country', event.target.value || null)}
                aria-label="Filter by country"
                className="h-8 rounded-full border border-ink/15 bg-transparent px-3 pr-7 text-[0.6875rem] text-ink/65 focus:outline-none"
              >
                <option value="">All countries</option>
                {countries.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
              <select
                value={month}
                onChange={(event) => update('month', event.target.value || null)}
                aria-label="Filter by month"
                className="h-8 rounded-full border border-ink/15 bg-transparent px-3 pr-7 text-[0.6875rem] text-ink/65 focus:outline-none"
              >
                <option value="">Any month</option>
                {months.map((entry) => (
                  <option key={entry} value={String(entry)}>
                    {monthNames[entry - 1]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => update('free', freeOnly ? null : '1')}
                aria-pressed={freeOnly}
                className={cn(
                  'h-8 rounded-full border px-3.5 text-[0.6875rem] transition-colors',
                  freeOnly
                    ? 'border-ink bg-ink text-ivory'
                    : 'border-ink/15 text-ink/65 hover:border-ink/35',
                )}
              >
                Free to attend
              </button>
              {activeFilters ? (
                <button
                  type="button"
                  onClick={clear}
                  className="ml-auto text-[0.6875rem] text-ink/45 underline decoration-ink/20 underline-offset-4 hover:text-ink"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          {featured ? (
            <article className="grid gap-8 border-b border-ink/15 pb-14 md:grid-cols-12 md:gap-10">
              <Link
                to={`/events/${featured.slug}`}
                className="group relative col-span-full block overflow-hidden bg-paper md:col-span-7"
              >
                <div className="aspect-[16/11] overflow-hidden">
                  <SmartImage
                    name={imageFor(featured)}
                    alt={`${featured.name} in ${featured.city}`}
                    sizes="(min-width: 768px) 56vw, 100vw"
                    priority
                    className="transition-transform duration-[900ms] group-hover:scale-[1.025]"
                  />
                </div>
                <div className="absolute left-0 top-0 flex items-center gap-2 bg-cream px-4 py-2 text-[0.625rem] uppercase tracking-[0.12em] text-ink/65">
                  <span className="seal-dot" aria-hidden="true" />
                  Next in the atlas
                </div>
              </Link>

              <div className="flex flex-col md:col-span-5 md:py-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.6875rem] uppercase tracking-[0.13em] text-ink/45">
                      {categoryLabel(featured.category)} · {featured.city}
                    </p>
                    <h2 className="display-md mt-3 max-w-[15ch]">{featured.name}</h2>
                  </div>
                  <EventSaveButton slug={featured.slug} name={featured.name} />
                </div>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink/65">{featured.summary}</p>
                <dl className="mt-6 grid gap-3 border-t border-ink/12 pt-5 text-[0.8125rem]">
                  <div className="flex gap-3">
                    <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/40" strokeWidth={1.5} aria-hidden="true" />
                    <div>
                      <dt className="sr-only">Dates</dt>
                      <dd>{eventDateLabel(featured)}</dd>
                      <dd className="mt-0.5 text-[0.6875rem] text-ink/45">
                        {dateStatusLabel[featured.dateStatus]} · {featured.source.label}
                      </dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink/40" strokeWidth={1.5} aria-hidden="true" />
                    <div>
                      <dt className="sr-only">Venue</dt>
                      <dd>{featured.venue}</dd>
                    </div>
                  </div>
                </dl>
                <div className="mt-auto flex flex-wrap items-center gap-4 pt-7">
                  <Link
                    to={`/events/${featured.slug}`}
                    className="group inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[0.8125rem] font-medium text-ivory"
                  >
                    Read the field note
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                  </Link>
                  <span className="text-[0.6875rem] uppercase tracking-[0.1em] text-ink/40">
                    {daysUntil(featured) <= 0 ? 'In progress' : `${daysUntil(featured)} days away`}
                  </span>
                </div>
              </div>
            </article>
          ) : (
            <div className="border border-ink/12 bg-cream px-6 py-16 text-center">
              <p className="font-display text-[2rem]">Nothing matches that.</p>
              <p className="mx-auto mt-3 max-w-[42ch] text-[0.9375rem] text-ink/60">
                The event list is deliberately short. Try another month or clear the filters.
              </p>
              <button
                type="button"
                onClick={clear}
                className="mt-6 h-11 rounded-full bg-ink px-5 text-[0.8125rem] text-ivory"
              >
                Show every event
              </button>
            </div>
          )}

          {rest.length ? (
            <div>
              <div className="flex items-baseline justify-between gap-6 border-b border-ink/12 py-5">
                <h2 className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45">
                  Also ahead
                </h2>
                <p className="text-[0.6875rem] uppercase tracking-[0.1em] text-ink/35">
                  {results.length} {results.length === 1 ? 'entry' : 'entries'}
                </p>
              </div>
              <ol>
                {rest.map((event, index) => (
                  <li key={event.slug} className="border-b border-ink/10">
                    <article className="group grid gap-5 py-7 md:grid-cols-12 md:items-center md:gap-6">
                      <div className="flex items-baseline gap-4 md:col-span-2">
                        <span className="index-number text-ink/30">
                          {String(index + 2).padStart(2, '0')}
                        </span>
                        <div>
                          <p className="font-display text-[1.5rem] leading-none">{num(event)}</p>
                          <p className="mt-1 text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">
                            {event.city}
                          </p>
                        </div>
                      </div>
                      <div className="md:col-span-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-seal">
                              {categoryLabel(event.category)}
                            </p>
                            <h3 className="mt-1.5 font-display text-[1.65rem] leading-[1.05]">
                              <Link to={`/events/${event.slug}`} className="transition-opacity hover:opacity-65">
                                {event.name}
                              </Link>
                            </h3>
                            <p className="mt-2 max-w-[48ch] text-[0.8125rem] leading-relaxed text-ink/55">
                              {event.summary}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-3">
                        <p className="text-[0.75rem]">{eventDateLabel(event)}</p>
                        <p className="mt-1 text-[0.6875rem] leading-relaxed text-ink/45">
                          {event.venue}
                        </p>
                        <p className="mt-2 text-[0.625rem] uppercase tracking-[0.08em] text-ink/35">
                          {dateStatusLabel[event.dateStatus]}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-4 md:col-span-2 md:justify-end">
                        <Link
                          to={`/events/${event.slug}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-ivory"
                          aria-label={`Open ${event.name}`}
                        >
                          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                        </Link>
                        <EventSaveButton slug={event.slug} name={event.name} />
                      </div>
                    </article>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <p className="mt-10 max-w-[70ch] text-[0.75rem] leading-relaxed text-ink/45">
            Dates are checked against the organiser or an official calendar. Some traditional
            festivals follow lunar or liturgical calendars and may be confirmed closer to the date.
            Always verify with the organiser before booking non-refundable travel.
          </p>
        </div>
      </section>
    </>
  );
};
