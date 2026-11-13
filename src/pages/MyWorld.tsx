import { Link } from 'react-router-dom';
import { ArrowUpRight, Bookmark, CalendarDays, Check, MapPin, Plus, X } from 'lucide-react';
import { useAtlas } from '@/store/AtlasProvider';
import { useToast } from '@/components/ui/Toast';
import { usePageMeta } from '@/hooks/usePageMeta';
import { myWorldMeta } from '@/seo/routes';
import { destinationBySlug } from '@/data/destinations';
import { storyBySlug } from '@/data/stories';
import { eventBySlug, eventDateLabel } from '@/data/events';
import { SmartImage } from '@/components/media/SmartImage';
import { Button } from '@/components/ui/Button';
import { formatDateRange, pluralize } from '@/lib/format';
import { LayerMark } from '@/components/ui/LayerMark';

export const MyWorld = () => {
  const atlas = useAtlas();
  const { push } = useToast();

  usePageMeta(myWorldMeta);

  const savedPlaces = atlas.savedDestinations
    .map((slug) => destinationBySlug[slug])
    .filter(Boolean);
  const savedStories = atlas.savedStories.map((slug) => storyBySlug[slug]).filter(Boolean);
  const savedEvents = atlas.savedEvents
    .map((slug) => eventBySlug[slug])
    .filter(Boolean)
    .sort((a, b) => (a?.startDate ?? '').localeCompare(b?.startDate ?? ''));
  const visited = atlas.visitedDestinations
    .map((slug) => destinationBySlug[slug])
    .filter(Boolean);
  const recent = atlas.recentDestinations
    .map((slug) => destinationBySlug[slug])
    .filter(Boolean)
    .slice(0, 4);
  const isEmpty =
    !savedPlaces.length &&
    !savedStories.length &&
    !savedEvents.length &&
    !atlas.collections.length &&
    !atlas.trips.length &&
    !visited.length;

  return (
    <>
      <section className="pb-12 pt-[calc(var(--nav-h)+3.5rem)] md:pt-[calc(var(--nav-h)+5rem)]">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 text-[0.75rem] text-ink/45">
                <LayerMark className="text-olive" />
                <span>My World</span>
              </div>
              <h1 className="display-xl mt-4 max-w-[16ch]">The places you have kept.</h1>
            </div>
            <div className="max-w-[36ch] pb-2">
              <p className="text-[0.9375rem] leading-relaxed text-ink/60">
                Everything here is stored in this browser. No account, no email, no profile —
                close the tab and it will still be here when you return.
              </p>
              <div className="mt-5 flex gap-6 text-[0.75rem] text-ink/45">
                <span>{savedPlaces.length} saved</span>
                <span>{pluralize(atlas.collections.length, 'collection')}</span>
                <span>{pluralize(atlas.trips.length, 'trip')}</span>
                {savedEvents.length ? <span>{savedEvents.length} events</span> : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isEmpty ? (
        <section className="pb-[var(--spacing-section)]">
          <div className="shell">
            <div className="border border-ink/12 bg-cream p-8 md:p-12">
              <p className="font-display text-[2rem] leading-tight">Your world is still open.</p>
              <p className="mt-3 max-w-[48ch] text-[0.9375rem] leading-relaxed text-ink/60">
                Save a place as you read, start a collection around an idea, or plan a journey.
                It will collect here as you go.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button as={Link} to="/explore" variant="primary">
                  Explore the atlas
                </Button>
                <Button as={Link} to="/plan/new" variant="outline">
                  Compose a journey
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {savedPlaces.length ? (
        <section className="pb-14">
          <div className="shell">
            <div className="flex items-baseline justify-between border-t border-ink/12 pt-5">
              <h2 className="display-md">Saved places</h2>
              <span className="text-[0.75rem] text-ink/40">{savedPlaces.length}</span>
            </div>
            <ul className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {savedPlaces.map((destination) =>
                destination ? (
                  <li key={destination.slug} className="group relative">
                    <Link to={`/destinations/${destination.slug}`} className="block">
                      <div className="aspect-[4/3] overflow-hidden bg-paper">
                        <SmartImage
                          name={destination.image.src}
                          alt={destination.image.alt}
                          sizes="(min-width: 1024px) 24vw, 50vw"
                        />
                      </div>
                      <div className="mt-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-[1.35rem] leading-tight">
                            {destination.name}
                          </p>
                          <p className="mt-0.5 text-[0.75rem] text-ink/50">{destination.country}</p>
                        </div>
                        <ArrowUpRight className="mt-1 h-4 w-4 text-ink/30" strokeWidth={1.5} aria-hidden="true" />
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        atlas.toggleSavedDestination(destination.slug);
                        push({ title: `${destination.name} removed` });
                      }}
                      aria-label={`Remove ${destination.name} from saved places`}
                      className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 bg-cream/95 text-ink/55 transition-colors hover:text-ink"
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        </section>
      ) : null}

      {savedEvents.length ? (
        <section className="pb-14">
          <div className="shell">
            <div className="flex items-baseline justify-between border-t border-ink/12 pt-5">
              <h2 className="display-md">Saved events</h2>
              <Link to="/events" className="link-quiet text-[0.75rem] text-ink/50">
                The calendar
              </Link>
            </div>
            <ul className="mt-5 border-t border-ink/10">
              {savedEvents.map((event) =>
                event ? (
                  <li key={event.slug} className="border-b border-ink/10">
                    <div className="flex items-center gap-4 py-4">
                      <CalendarDays className="h-4 w-4 shrink-0 text-seal/70" strokeWidth={1.5} aria-hidden="true" />
                      <Link to={`/events/${event.slug}`} className="min-w-0 flex-1 group">
                        <p className="text-[0.6875rem] uppercase tracking-[0.08em] text-ink/40">
                          {eventDateLabel(event)} · {event.city}
                        </p>
                        <p className="mt-0.5 font-display text-[1.4rem] leading-tight transition-colors group-hover:text-olive">
                          {event.name}
                        </p>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          atlas.toggleSavedEvent(event.slug);
                          push({ title: `${event.name} removed` });
                        }}
                        aria-label={`Remove ${event.name} from saved events`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink/35 hover:bg-ink/5 hover:text-ink"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="pb-[var(--spacing-section)]">
        <div className="shell grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <div className="flex items-baseline justify-between border-t border-ink/12 pt-5">
              <h2 className="display-md">Saved places</h2>
              <span className="text-[0.75rem] text-ink/40">{savedPlaces.length}</span>
            </div>
            {savedPlaces.length ? null : (
              <div className="mt-4 flex items-center justify-between gap-4 border border-ink/12 bg-cream p-5">
                <p className="text-[0.875rem] leading-relaxed text-ink/60">
                  Nothing kept yet. Use the bookmark on any place to start your own atlas.
                </p>
                <Link to="/explore" className="link-quiet shrink-0 text-[0.8125rem]">
                  Explore
                </Link>
              </div>
            )}

            <div className="flex items-baseline justify-between border-t border-ink/12 pt-5">
              <h2 className="display-md">Saved reading</h2>
              <span className="text-[0.75rem] text-ink/40">{savedStories.length}</span>
            </div>
            {savedStories.length ? (
              <ul className="mt-4">
                {savedStories.map((story) =>
                  story ? (
                    <li
                      key={story.slug}
                      className="flex items-center justify-between gap-5 border-b border-ink/10 py-4"
                    >
                      <Link to={`/journal/${story.slug}`} className="group flex items-center gap-4">
                        <span className="relative h-16 w-20 shrink-0 overflow-hidden bg-paper">
                          <SmartImage
                            name={story.image.src}
                            alt=""
                            sizes="80px"
                            widths={[640, 1000]}
                          />
                        </span>
                        <span>
                          <span className="block font-display text-[1.3rem] leading-tight">
                            {story.title}
                          </span>
                          <span className="mt-0.5 block text-[0.75rem] text-ink/50">
                            {story.categories[0]}
                          </span>
                        </span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          atlas.toggleSavedStory(story.slug);
                          push({ title: 'Reading removed' });
                        }}
                        aria-label={`Remove ${story.title} from saved reading`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink/35 hover:bg-ink/5 hover:text-ink"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </li>
                  ) : null,
                )}
              </ul>
            ) : (
              <div className="mt-4 flex items-center justify-between gap-4 border border-ink/12 bg-cream p-5">
                <p className="text-[0.875rem] text-ink/60">
                  No saved stories yet. The journal is a good place to begin.
                </p>
                <Link to="/journal" className="link-quiet shrink-0 text-[0.8125rem]">
                  Read
                </Link>
              </div>
            )}

            {visited.length ? (
              <div className="mt-12">
                <div className="flex items-baseline justify-between border-t border-ink/12 pt-5">
                  <h2 className="display-md">Visited</h2>
                  <span className="text-[0.75rem] text-ink/40">{visited.length}</span>
                </div>
                <ul className="mt-4">
                  {visited.map((destination) =>
                    destination ? (
                      <li
                        key={destination.slug}
                        className="flex items-center justify-between gap-4 border-b border-ink/10 py-3"
                      >
                        <Link
                          to={`/destinations/${destination.slug}`}
                          className="flex items-center gap-3 text-[0.9375rem]"
                        >
                          <Check className="h-3.5 w-3.5 text-olive" strokeWidth={1.75} aria-hidden="true" />
                          {destination.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => atlas.toggleVisited(destination.slug)}
                          className="text-[0.75rem] text-ink/40 hover:text-ink"
                        >
                          Mark unvisited
                        </button>
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <div className="flex items-baseline justify-between border-t border-ink/12 pt-5">
              <h2 className="display-md">Collections</h2>
              <Link to="/collections" className="link-quiet text-[0.75rem] text-ink/60">
                All
              </Link>
            </div>
            {atlas.collections.length ? (
              <ul className="mt-4">
                {atlas.collections.map((collection) => (
                  <li key={collection.id} className="border-b border-ink/10">
                    <Link
                      to={`/collections/${collection.id}`}
                      className="flex items-center justify-between gap-4 py-3.5"
                    >
                      <span>
                        <span className="block text-[0.9375rem]">{collection.title}</span>
                        <span className="mt-0.5 block text-[0.75rem] text-ink/45">
                          {pluralize(
                            collection.destinationSlugs.length + collection.storySlugs.length,
                            'entry',
                            'entries',
                          )}
                        </span>
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-ink/30" strokeWidth={1.5} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Link
                to="/collections"
                className="mt-4 flex items-center gap-3 border border-dashed border-ink/20 p-4 text-[0.8125rem] text-ink/55 transition-colors hover:border-ink/40 hover:text-ink"
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                Start your first collection
              </Link>
            )}

            <div className="mt-12 flex items-baseline justify-between border-t border-ink/12 pt-5">
              <h2 className="display-md">Trips</h2>
              <Link to="/plan" className="link-quiet text-[0.75rem] text-ink/60">
                All
              </Link>
            </div>
            {atlas.trips.length ? (
              <ul className="mt-4">
                {atlas.trips.map((trip) => (
                  <li key={trip.id} className="border-b border-ink/10">
                    <Link
                      to={`/plan/${trip.id}`}
                      className="block py-3.5 transition-colors hover:text-olive"
                    >
                      <span className="block font-display text-[1.2rem] leading-tight">{trip.title}</span>
                      <span className="mt-0.5 block text-[0.75rem] text-ink/45">
                        {formatDateRange(trip.startDate, trip.endDate)} ·{' '}
                        {pluralize(trip.days.length, 'day')}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Link
                to="/plan?new=1"
                className="mt-4 flex items-center gap-3 border border-dashed border-ink/20 p-4 text-[0.8125rem] text-ink/55 transition-colors hover:border-ink/40 hover:text-ink"
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                Plan a journey
              </Link>
            )}

            {recent.length ? (
              <div className="mt-12 border-t border-ink/12 pt-5">
                <h2 className="text-[0.75rem] font-medium text-ink/45">Recently viewed</h2>
                <ul className="mt-3">
                  {recent.map((destination) =>
                    destination ? (
                      <li key={destination.slug}>
                        <Link
                          to={`/destinations/${destination.slug}`}
                          className="flex items-center gap-2 py-1.5 text-[0.8125rem] text-ink/65 hover:text-ink"
                        >
                          <MapPin className="h-3 w-3 text-ink/30" strokeWidth={1.5} aria-hidden="true" />
                          {destination.name}
                        </Link>
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            ) : null}

            <div className="mt-10 flex items-start gap-3 border-t border-ink/12 pt-5">
              <Bookmark className="mt-0.5 h-3.5 w-3.5 text-ink/30" strokeWidth={1.5} aria-hidden="true" />
              <p className="text-[0.75rem] leading-relaxed text-ink/45">
                Saved in this browser only. Clearing site data will reset My World.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
