import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import { countrySlug, getDestination, destinationBySlug } from '@/data/destinations';
import { interestById } from '@/data/interests';
import { storyBySlug } from '@/data/stories';
import { usePageMeta } from '@/hooks/usePageMeta';
import { destinationRouteMeta } from '@/seo/routes';
import { useAtlas } from '@/store/AtlasProvider';
import { useToast } from '@/components/ui/Toast';
import { SmartImage } from '@/components/media/SmartImage';
import { Button } from '@/components/ui/Button';
import { SaveButton } from '@/components/atlas/SaveButton';
import { CollectionDialog } from '@/components/atlas/CollectionDialog';
import { TripPickerDialog } from '@/components/atlas/TripPickerDialog';
import { StoryCard } from '@/components/atlas/StoryCard';
import { DestinationCard } from '@/components/atlas/DestinationCard';
import { AtlasMapLazy } from '@/components/map/AtlasMapLazy';
import type { MapPoint } from '@/components/map/AtlasMap';
import { CultureLayers } from '@/components/culture/CultureLayers';
import { getCulture } from '@/data/culture';
import { categoryLabel, eventDateLabel, eventsForDestination } from '@/data/events';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils';

export const DestinationPage = () => {
  const { slug } = useParams();
  const destination = getDestination(slug);
  const atlas = useAtlas();
  const { push } = useToast();
  const [collectOpen, setCollectOpen] = useState(false);
  const [tripOpen, setTripOpen] = useState(false);
  const [activePlace, setActivePlace] = useState<string | null>(null);

  useEffect(() => {
    if (slug) atlas.recordView(slug);
    // Only record a view when the place itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  usePageMeta(destinationRouteMeta(destination, slug));

  const mapPoints = useMemo<MapPoint[]>(
    () =>
      destination
        ? destination.places.map((place) => ({
            id: place.name,
            name: place.name,
            subtitle: place.note,
            coordinates: place.coordinates,
            kind: 'place' as const,
          }))
        : [],
    [destination],
  );

  if (!destination) {
    return (
      <section className="shell flex min-h-[70svh] flex-col justify-center py-32">
        <p className="text-[0.75rem] text-ink/45">The atlas</p>
        <h1 className="display-lg mt-4 max-w-[18ch]">This place is not in the atlas yet.</h1>
        <p className="mt-5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink/65">
          The atlas is growing slowly and deliberately. Explore the places already here, or search
          for somewhere else.
        </p>
        <div className="mt-8 flex gap-3">
          <Button as={Link} to="/explore" variant="primary">
            Explore the atlas
          </Button>
          <Button as={Link} to="/" variant="outline">
            Back to Discover
          </Button>
        </div>
      </section>
    );
  }

  const visited = atlas.isVisited(destination.slug);
  const culture = getCulture(destination.slug);
  const destinationEvents = eventsForDestination(destination.slug);
  const stories = destination.storySlugs
    .map((storySlug) => storyBySlug[storySlug])
    .filter(Boolean);
  const related = destination.related
    .map((relatedSlug) => destinationBySlug[relatedSlug])
    .filter(Boolean);

  return (
    <>
      <section className="grain relative flex min-h-[76svh] flex-col overflow-hidden bg-forest text-ivory">
        <div className="absolute inset-0">
          <SmartImage
            name={destination.image.src}
            alt={destination.image.alt}
            sizes="100vw"
            priority
            widths={[1000, 1600, 2200]}
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,18,15,0.7)_0%,rgba(16,18,15,0.26)_38%,rgba(16,18,15,0.78)_100%)]" />

        <div className="shell relative z-10 flex flex-1 flex-col justify-end pb-10 pt-32 md:pb-14">
          <p className="text-[0.75rem] text-ivory/80">
            <Link
              to={`/countries/${countrySlug(destination.country)}`}
              className="underline decoration-ivory/30 underline-offset-4 transition-colors hover:text-ivory"
            >
              {destination.country}
            </Link>
            , {destination.region}
          </p>
          <h1 className="display-xl mt-3">{destination.name}</h1>
          <div className="mt-8 grid gap-6 border-t border-ivory/20 pt-6 md:grid-cols-12 md:items-end">
            <p className="max-w-[58ch] text-[1rem] leading-relaxed text-ivory/78 md:col-span-7">
              {destination.summary}
            </p>
            <div className="flex flex-wrap gap-2.5 md:col-span-5 md:justify-end">
              <SaveButton
                kind="destination"
                slug={destination.slug}
                name={destination.name}
                withLabel
                tone="dark"
              />
              <Button
                type="button"
                variant="outlineLight"
                size="md"
                onClick={() => setTripOpen(true)}
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                Add to trip
              </Button>
              <button
                type="button"
                onClick={() => {
                  atlas.toggleVisited(destination.slug);
                  push({
                    title: visited
                      ? `${destination.name} marked unvisited`
                      : `${destination.name} marked visited`,
                  });
                }}
                aria-pressed={visited}
                className={cn(
                  'inline-flex h-12 items-center gap-2 rounded-full border px-5 text-[0.8125rem] transition-colors',
                  visited
                    ? 'border-ivory bg-ivory text-ink'
                    : 'border-ivory/28 text-ivory hover:bg-ivory/10',
                )}
              >
                <Check className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                {visited ? 'Visited' : 'Mark visited'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-paper">
        <div className="shell flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-5 text-[0.8125rem]">
          <dl className="flex flex-wrap gap-x-10 gap-y-3">
            <div>
              <dt className="text-[0.6875rem] text-ink/40">Country</dt>
              <dd className="mt-0.5">
                <Link
                  to={`/countries/${countrySlug(destination.country)}`}
                  className="underline decoration-ink/25 underline-offset-4 hover:text-ink"
                >
                  {destination.country}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] text-ink/40">Best time</dt>
              <dd className="mt-0.5">{destination.bestSeason}</dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] text-ink/40">Suggested stay</dt>
              <dd className="mt-0.5">{destination.suggestedDays} days</dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] text-ink/40">Coordinates</dt>
              <dd className="mt-0.5 tabular-nums">
                {destination.coordinates.lat.toFixed(2)}, {destination.coordinates.lng.toFixed(2)}
              </dd>
            </div>
          </dl>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setCollectOpen(true)}
              className="link-quiet text-[0.8125rem] text-ink/70"
            >
              Add to a collection
            </button>
            <div className="flex flex-wrap gap-2">
              {destination.interests.map((interest) => (
                <Link
                  key={interest}
                  to={`/explore?interest=${interest}`}
                  className="rounded-full border border-ink/15 px-3 py-1.5 text-[0.6875rem] text-ink/60 transition-colors hover:border-ink/35 hover:text-ink"
                >
                  {interestById[interest].label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <article className="section-y">
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-4">
              <p className="text-[0.75rem] text-ink/45">The place</p>
            </div>
            <div className="md:col-span-7">
              <p className="body-lead text-ink/82">{destination.body[0]}</p>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink/65">{destination.body[1]}</p>
            </div>
          </div>

          <div className="mt-20">
            {destination.layers.map((layer, index) => {
              if (layer.image) {
                return (
                  <section
                    key={layer.title}
                    className="grid gap-8 border-t border-ink/12 py-12 md:grid-cols-12 md:items-start md:gap-10"
                  >
                    <div
                      className={cn(
                        'md:col-span-6',
                        index % 2 === 1 ? 'md:order-2 md:col-start-7' : '',
                      )}
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-paper">
                        <SmartImage
                          name={layer.image.src}
                          alt={layer.image.alt}
                          sizes="(min-width: 768px) 48vw, 100vw"
                        />
                      </div>
                    </div>
                    <div
                      className={cn(
                        'md:col-span-4',
                        index % 2 === 1 ? 'md:order-1 md:col-start-1' : 'md:col-start-8',
                      )}
                    >
                      <p className="text-[0.75rem] text-ink/40">{interestById[layer.kind].label}</p>
                      <h2 className="display-md mt-2.5">{layer.title}</h2>
                      <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink/65">{layer.body}</p>
                    </div>
                  </section>
                );
              }

              return (
                <section
                  key={layer.title}
                  className="grid gap-4 border-t border-ink/12 py-10 md:grid-cols-12 md:gap-8 md:py-12"
                >
                  <div className="md:col-span-4">
                    <p className="text-[0.75rem] text-ink/40">{interestById[layer.kind].label}</p>
                    <h2 className="display-sm mt-2">{layer.title}</h2>
                  </div>
                  <p className="max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink/65 md:col-span-7 md:col-start-6">
                    {layer.body}
                  </p>
                </section>
              );
            })}
          </div>
        </div>
      </article>

      {culture ? <CultureLayers profile={culture} destination={destination} /> : null}

      <section className="bg-forest py-[var(--spacing-section)] text-ivory">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-ivory/18 pt-5">
            <h2 className="display-md">Notable places</h2>
            <p className="max-w-[38ch] text-[0.8125rem] leading-relaxed text-ivory/55">
              Four or five starting points, not a checklist. The map gives you the geography; the
              walking gives you the place.
            </p>
          </div>

          <div className="mt-10 grid border border-ivory/15 md:grid-cols-12">
            <div className="flex flex-col md:col-span-5 md:border-r md:border-ivory/15">
              <ul>
                {destination.places.map((place) => (
                  <li key={place.name} className="border-b border-ivory/12 last:border-b-0">
                    <button
                      type="button"
                      onMouseEnter={() => setActivePlace(place.name)}
                      onFocus={() => setActivePlace(place.name)}
                      onClick={() => setActivePlace(place.name)}
                      className={cn(
                        'w-full px-5 py-4 text-left transition-colors',
                        activePlace === place.name ? 'bg-ivory/[0.06]' : 'hover:bg-ivory/[0.04]',
                      )}
                    >
                      <span className="flex items-baseline justify-between gap-4">
                        <span className="font-display text-[1.35rem] leading-tight">{place.name}</span>
                        <span className="shrink-0 text-[0.6875rem] text-ivory/35">
                          {interestById[place.kind].label}
                        </span>
                      </span>
                      <span className="mt-1 block text-[0.8125rem] leading-relaxed text-ivory/55">
                        {place.note}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-auto border-t border-ivory/10 px-5 py-4 text-[0.75rem] leading-relaxed text-ivory/40">
                Select a place to find it on the map. Positions are approximate.
              </p>
            </div>
            <div className="md:col-span-7">
              <AtlasMapLazy
                points={mapPoints}
                activeId={activePlace}
                onActiveChange={setActivePlace}
                follow
                center={[destination.coordinates.lat, destination.coordinates.lng]}
                initialZoom={12}
                className="h-[380px] md:h-[520px]"
                label={`Map of notable places in ${destination.name}`}
              />
            </div>
          </div>
        </div>
      </section>

      {destinationEvents.length ? (
        <section className="border-b border-ink/10 bg-paper py-14">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/14 pb-4">
              <div>
                <p className="flex items-center gap-3 text-[0.625rem] uppercase tracking-[0.13em] text-ink/40">
                  <span className="seal-dot" aria-hidden="true" />
                  When to be here
                </p>
                <h2 className="display-sm mt-2">The calendar, nearby.</h2>
              </div>
              <Link to="/events" className="link-quiet text-[0.8125rem] text-ink/60">
                All events
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
            <ul>
              {destinationEvents.map((event) => (
                <li key={event.slug} className="border-b border-ink/10 last:border-b-0">
                  <Link
                    to={`/events/${event.slug}`}
                    className="group grid gap-3 py-5 md:grid-cols-12 md:items-center md:gap-6"
                  >
                    <p className="font-display text-[1.1rem] leading-tight md:col-span-3">
                      {eventDateLabel(event)}
                    </p>
                    <div className="md:col-span-5">
                      <p className="text-[0.625rem] uppercase tracking-[0.1em] text-seal">
                        {categoryLabel(event.category)}
                      </p>
                      <h3 className="mt-1 font-display text-[1.55rem] leading-tight transition-colors group-hover:text-olive">
                        {event.name}
                      </h3>
                    </div>
                    <p className="max-w-[52ch] text-[0.8125rem] leading-relaxed text-ink/50 md:col-span-3">
                      {event.summary}
                    </p>
                    <div className="flex justify-end md:col-span-1">
                      <ArrowUpRight
                        className="h-4 w-4 text-ink/35 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {stories.length ? (
        <section className="section-y">
          <div className="shell">
            <SectionHeading
              title="Reading for this place"
              aside={
                <Link to="/journal" className="link-quiet text-ink">
                  The journal
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                </Link>
              }
            />
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              {stories.map((story) =>
                story ? (
                  <StoryCard
                    key={story.slug}
                    story={story}
                    sizes="(min-width: 768px) 46vw, 100vw"
                  />
                ) : null,
              )}
            </div>
          </div>
        </section>
      ) : null}

      <section className="pb-[var(--spacing-section)]">
        <div className="shell">
          <SectionHeading title="If this place stays with you" intro="Nearby in spirit, if not always on the map." />
          <div className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2">
            {related.map((relatedDestination) =>
              relatedDestination ? (
                <DestinationCard
                  key={relatedDestination.slug}
                  destination={relatedDestination}
                  ratio="16 / 10"
                  sizes="(min-width: 768px) 46vw, 100vw"
                />
              ) : null,
            )}
          </div>
        </div>
      </section>

      <CollectionDialog
        open={collectOpen}
        onOpenChange={setCollectOpen}
        destinationSlug={destination.slug}
        name={destination.name}
      />
      <TripPickerDialog
        open={tripOpen}
        onOpenChange={setTripOpen}
        destinationSlug={destination.slug}
        name={destination.name}
      />
    </>
  );
};
