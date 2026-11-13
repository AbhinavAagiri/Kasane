import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  MapPin,
  Plus,
  Ticket,
} from 'lucide-react';
import { getEvent, upcomingEvents, eventDateLabel, daysUntil, dateStatusLabel, categoryLabel, eventSourceNote, ticketStatusLabel, checkedDateLabel } from '@/data/events';
import { destinationBySlug } from '@/data/destinations';
import { usePageMeta } from '@/hooks/usePageMeta';
import { eventRouteMeta } from '@/seo/routes';
import { SmartImage } from '@/components/media/SmartImage';
import { EventSaveButton } from '@/components/events/EventSaveButton';
import { AddEventToTrip } from '@/components/events/AddEventToTrip';
import { AtlasMapLazy } from '@/components/map/AtlasMapLazy';
import type { MapPoint } from '@/components/map/AtlasMap';
import { Button } from '@/components/ui/Button';

export const EventPage = () => {
  const { slug } = useParams();
  const event = getEvent(slug);
  const [tripOpen, setTripOpen] = useState(false);
  const destination = event ? destinationBySlug[event.destinationSlug] : undefined;

  usePageMeta(eventRouteMeta(event, slug));

  const mapPoints = useMemo<MapPoint[]>(
    () =>
      event
        ? [
            {
              id: event.slug,
              name: event.name,
              subtitle: `${event.venue} · ${eventDateLabel(event)}`,
              coordinates: event.coordinates,
              kind: 'destination',
            },
          ]
        : [],
    [event],
  );

  if (!event) {
    return (
      <section className="shell flex min-h-[70svh] flex-col justify-center py-32">
        <p className="text-[0.75rem] uppercase tracking-[0.12em] text-ink/45">The calendar</p>
        <h1 className="display-lg mt-4 max-w-[15ch]">This event is not in the atlas.</h1>
        <p className="mt-5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink/65">
          The calendar is deliberately short. Return to the list to see what is coming up.
        </p>
        <div className="mt-8">
          <Button as={Link} to="/events" variant="primary">
            Back to events
          </Button>
        </div>
      </section>
    );
  }

  const related = upcomingEvents
    .filter(
      (entry) =>
        entry.slug !== event.slug &&
        (entry.destinationSlug === event.destinationSlug || entry.category === event.category),
    )
    .slice(0, 3);

  const image = event.image ?? destination?.image.src ?? 'atlas-hero';
  const countdown = daysUntil(event);

  return (
    <>
      <section className="grain relative flex min-h-[82svh] flex-col overflow-hidden bg-forest text-ivory">
        <div className="absolute inset-0">
          <SmartImage
            name={image}
            alt={`${event.name} in ${event.city}`}
            sizes="100vw"
            priority
            widths={[1000, 1600, 2200]}
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,18,15,0.52)_0%,rgba(16,18,15,0.16)_34%,rgba(16,18,15,0.72)_88%,rgba(16,18,15,0.94)_100%)]" />
        <div className="shell relative z-10 flex flex-1 flex-col justify-between pb-9 pt-[calc(var(--nav-h)+2.5rem)]">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/events"
              className="flex items-center gap-2 text-[0.75rem] text-ivory/65 transition-colors hover:text-ivory"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              The calendar
            </Link>
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-ivory/45">
              {event.city} · {event.country}
            </p>
          </div>

          <div className="mt-20 max-w-[54rem]">
            <p className="flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.15em] text-ivory/65">
              <span className="seal-dot" aria-hidden="true" />
              {categoryLabel(event.category)} · {dateStatusLabel[event.dateStatus]}
            </p>
            <h1 className="display-xl mt-5 max-w-[16ch]">{event.name}</h1>
            <p className="mt-6 max-w-[52ch] text-[1rem] leading-relaxed text-ivory/78 md:text-[1.125rem]">
              {event.summary}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-2.5 border-t border-ivory/20 pt-6">
              <div className="mr-3">
                <p className="text-[0.625rem] uppercase tracking-[0.1em] text-ivory/45">When</p>
                <p className="mt-1 text-[0.9375rem]">{eventDateLabel(event)}</p>
              </div>
              <EventSaveButton slug={event.slug} name={event.name} tone="dark" withLabel />
              <button
                type="button"
                onClick={() => setTripOpen(true)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-ivory/30 px-3.5 text-[0.75rem] text-ivory transition-colors hover:border-ivory/60 hover:bg-white/[0.06]"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                Add to trip
              </button>
              <a
                href={event.source.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-ivory/20 px-3.5 text-[0.75rem] text-ivory/70 transition-colors hover:border-ivory/50 hover:text-ivory"
              >
                Official source
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-end justify-between gap-4 border-t border-ivory/16 pt-4 text-[0.6875rem] uppercase tracking-[0.12em] text-ivory/45">
            <span>{event.venue}</span>
            <span>
              {countdown > 0 ? `${countdown} days away` : countdown === 0 ? 'Today' : 'In progress'}
            </span>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-paper">
        <div className="shell grid gap-4 py-5 text-[0.8125rem] sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 shrink-0 text-ink/40" strokeWidth={1.5} aria-hidden="true" />
            <div>
              <p className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Dates</p>
              <p className="mt-0.5">{eventDateLabel(event)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 shrink-0 text-ink/40" strokeWidth={1.5} aria-hidden="true" />
            <div>
              <p className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Where</p>
              <p className="mt-0.5">{event.venue}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Ticket className="h-4 w-4 shrink-0 text-ink/40" strokeWidth={1.5} aria-hidden="true" />
            <div>
              <p className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Entry</p>
              <p className="mt-0.5">{ticketStatusLabel[event.tickets.status]}</p>
            </div>
          </div>
        </div>
      </section>

      <article className="section-y">
        <div className="shell grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45">Why it matters</p>
            <p className="body-lead mt-4 max-w-[56ch] text-ink/82">{event.whyGo}</p>
            <div className="mt-9 space-y-5">
              {event.body.map((paragraph) => (
                <p key={paragraph.slice(0, 30)} className="max-w-[62ch] text-[0.96875rem] leading-[1.78] text-ink/65">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 border-t border-ink/12 pt-8">
              <h2 className="display-sm">Going well</h2>
              <p className="mt-3 max-w-[56ch] text-[0.875rem] leading-relaxed text-ink/55">
                A festival is someone else’s home, faith or working day before it is your
                experience. These are the practical courtesies that matter most.
              </p>
              <ul className="mt-5 space-y-3">
                {event.etiquette.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink/68">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-olive" strokeWidth={1.6} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="border border-ink/14 bg-cream p-6">
              <p className="text-[0.6875rem] uppercase tracking-[0.13em] text-ink/45">Practical</p>
              <dl className="mt-5 space-y-5 text-[0.8125rem]">
                <div>
                  <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Date basis</dt>
                  <dd className="mt-1 leading-relaxed">{dateStatusLabel[event.dateStatus]}</dd>
                </div>
                <div>
                  <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Tickets</dt>
                  <dd className="mt-1 leading-relaxed text-ink/65">{event.tickets.note}</dd>
                  {event.tickets.url ? (
                    <a
                      href={event.tickets.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-2 inline-flex items-center gap-1 text-[0.75rem] underline decoration-ink/25 underline-offset-4 hover:text-ink"
                    >
                      Official ticket information
                      <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
                <div>
                  <dt className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">Source</dt>
                  <dd className="mt-1 leading-relaxed">
                    <a
                      href={event.source.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline decoration-ink/25 underline-offset-4 hover:text-ink"
                    >
                      {event.source.label}
                    </a>
                  </dd>
                  <dd className="mt-1 text-[0.6875rem] text-ink/40">
                    Checked {checkedDateLabel(event.source.checkedAt)}
                  </dd>
                </div>
              </dl>
              <p className="mt-5 border-t border-ink/10 pt-4 text-[0.6875rem] leading-relaxed text-ink/45">
                {eventSourceNote}
              </p>
            </div>

            {destination ? (
              <Link
                to={`/destinations/${destination.slug}`}
                className="group mt-5 block border border-ink/14"
              >
                <div className="aspect-[5/3] overflow-hidden bg-paper">
                  <SmartImage
                    name={destination.image.src}
                    alt={destination.image.alt}
                    sizes="(min-width: 768px) 28vw, 100vw"
                    className="transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-center justify-between gap-4 bg-cream px-5 py-4">
                  <div>
                    <p className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">
                      The field guide
                    </p>
                    <p className="mt-0.5 font-display text-[1.3rem] leading-tight">{destination.name}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ink/45 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                </div>
              </Link>
            ) : null}
          </aside>
        </div>
      </article>

      <section className="border-y border-ink/10 bg-paper py-12">
        <div className="shell grid gap-8 md:grid-cols-12 md:items-center">
          <div className="md:col-span-4">
            <p className="text-[0.6875rem] uppercase tracking-[0.13em] text-ink/45">Find it</p>
            <h2 className="display-sm mt-2">{event.venue}</h2>
            <p className="mt-3 max-w-[32ch] text-[0.8125rem] leading-relaxed text-ink/55">
              The pin marks the venue area. Check the organiser’s transport advice before the day
              itself; festival routes often change.
            </p>
          </div>
          <div className="md:col-span-8">
            <AtlasMapLazy
              points={mapPoints}
              fit
              initialZoom={11}
              className="h-[320px] border border-ink/12 md:h-[360px]"
              label={`Map showing ${event.venue}`}
            />
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="section-y">
          <div className="shell">
            <div className="flex items-baseline justify-between gap-6 border-b border-ink/14 pb-4">
              <h2 className="display-sm">Nearby in the calendar</h2>
              <Link to="/events" className="link-quiet text-[0.8125rem] text-ink/65">
                All events
              </Link>
            </div>
            <div className="grid gap-8 pt-8 md:grid-cols-3">
              {related.map((entry) => (
                <Link key={entry.slug} to={`/events/${entry.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-paper">
                    <SmartImage
                      name={entry.image ?? destinationBySlug[entry.destinationSlug]?.image.src ?? 'atlas-hero'}
                      alt=""
                      sizes="(min-width: 768px) 30vw, 100vw"
                      className="transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-3 text-[0.625rem] uppercase tracking-[0.1em] text-ink/40">
                    {eventDateLabel(entry)} · {entry.city}
                  </p>
                  <h3 className="mt-1 font-display text-[1.35rem] leading-tight transition-opacity group-hover:opacity-65">
                    {entry.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <AddEventToTrip event={event} open={tripOpen} onOpenChange={setTripOpen} />
    </>
  );
};
