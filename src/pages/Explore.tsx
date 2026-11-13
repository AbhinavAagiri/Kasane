import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LayoutGrid, Map as MapIcon, Search, X } from 'lucide-react';
import { destinations, countries } from '@/data/destinations';
import { interests } from '@/data/interests';
import type { Character, InterestId } from '@/data/types';
import { usePageMeta } from '@/hooks/usePageMeta';
import { exploreMeta } from '@/seo/routes';
import { DestinationCard } from '@/components/atlas/DestinationCard';
import { AtlasMapLazy } from '@/components/map/AtlasMapLazy';
import type { MapPoint } from '@/components/map/AtlasMap';
import { Select } from '@/components/ui/field';
import { SmartImage } from '@/components/media/SmartImage';
import { cn } from '@/lib/utils';

const characterLabels: Record<Character, string> = {
  coastal: 'Coastal',
  historic: 'Historic',
  mountain: 'Mountain',
  urban: 'Urban',
  rural: 'Rural',
  island: 'Island',
};

const availableCharacters = Array.from(new Set(destinations.map((d) => d.character)));

const normalise = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const Explore = () => {
  const [params, setParams] = useSearchParams();
  const queryParam = params.get('q') ?? '';
  const interestParam = (params.get('interest') ?? '') as InterestId | '';
  const countryParam = params.get('country') ?? '';
  const characterParam = (params.get('character') ?? '') as Character | '';
  const sort = params.get('sort') ?? 'editorial';
  const view = params.get('view') === 'map' ? 'map' : 'grid';
  const hiddenOnly = params.get('hidden') === '1';
  const [selected, setSelected] = useState<string | null>(null);
  const query = queryParam;

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const term = normalise(query.trim());
    const filtered = destinations.filter((destination) => {
      if (interestParam && !destination.interests.includes(interestParam)) return false;
      if (countryParam && destination.countryCode !== countryParam) return false;
      if (characterParam && destination.character !== characterParam) return false;
      if (hiddenOnly && !destination.hiddenGem) return false;
      if (!term) return true;
      const text = normalise(
        [
          destination.name,
          destination.country,
          destination.region,
          destination.line,
          destination.summary,
          ...destination.interests,
          ...destination.places.map((place) => place.name),
        ].join(' '),
      );
      return term.split(/\s+/).every((word) => text.includes(word));
    });

    if (sort === 'name') return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'country')
      return [...filtered].sort(
        (a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name),
      );
    return filtered;
  }, [query, interestParam, countryParam, characterParam, hiddenOnly, sort]);

  const points = useMemo<MapPoint[]>(() =>
    results.map((destination) => ({
      id: destination.slug,
      name: destination.name,
      subtitle: destination.country,
      coordinates: destination.coordinates,
      href: `/destinations/${destination.slug}`,
      kind: 'destination',
    })),
  [results]);

  const activeFilters = Boolean(interestParam || countryParam || characterParam || hiddenOnly || query);
  const selectedDestination = results.find((destination) => destination.slug === selected) ?? results[0];

  usePageMeta(exploreMeta);

  const reset = () => {
    setParams(new URLSearchParams(), { replace: true });
  };

  return (
    <>
      <section className="bg-forest pb-14 pt-[calc(var(--nav-h)+3.5rem)] text-ivory md:pb-16 md:pt-[calc(var(--nav-h)+5rem)]">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[0.75rem] text-ivory/50">Explore</p>
              <h1 className="display-xl mt-3">The atlas.</h1>
            </div>
            <p className="max-w-[38ch] pb-2 text-[0.9375rem] leading-relaxed text-ivory/60">
              {destinations.length} places, {countries.length} countries, one idea: look closer.
              Search by name, country, region or interest.
            </p>
          </div>

          <form
            className="mt-10 flex items-center gap-3 border-b border-ivory/25 pb-3"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              update('q', query.trim() || null);
            }}
          >
            <Search className="h-5 w-5 shrink-0 text-ivory/45" strokeWidth={1.5} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => update('q', event.target.value || null)}
              placeholder="Try Kyoto or Iceland"
              aria-label="Search destinations"
              maxLength={80}
              spellCheck={false}
              autoComplete="off"
              className="h-11 w-full bg-transparent text-[1.125rem] text-ivory placeholder:text-ivory/35 focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => update('q', null)}
                aria-label="Clear search"
                className="flex h-8 w-8 items-center justify-center rounded-full text-ivory/50 hover:bg-ivory/10 hover:text-ivory"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            ) : null}
            <button
              type="submit"
              className="h-10 shrink-0 rounded-full bg-ivory px-5 text-[0.8125rem] font-medium text-ink transition-colors hover:bg-cream"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="shell py-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[0.75rem] font-medium text-ink/45">Interest</span>
              <button
                type="button"
                onClick={() => update('interest', null)}
                aria-pressed={!interestParam}
                className={cn(
                  'h-8 rounded-full border px-3.5 text-[0.75rem] transition-colors',
                  !interestParam
                    ? 'border-ink bg-ink text-ivory'
                    : 'border-ink/15 text-ink/65 hover:border-ink/35',
                )}
              >
                All
              </button>
              {interests.map((interest) => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() =>
                    update('interest', interestParam === interest.id ? null : interest.id)
                  }
                  aria-pressed={interestParam === interest.id}
                  className={cn(
                    'h-8 rounded-full border px-3.5 text-[0.75rem] transition-colors',
                    interestParam === interest.id
                      ? 'border-ink bg-ink text-ivory'
                      : 'border-ink/15 text-ink/65 hover:border-ink/35',
                  )}
                >
                  {interest.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
              <label className="flex items-center gap-3 text-[0.75rem] text-ink/45">
                Country
                <Select
                  value={countryParam}
                  onChange={(event) => update('country', event.target.value || null)}
                  className="h-8 w-auto min-w-36 border-b-0 py-0 text-[0.8125rem]"
                >
                  <option value="">All countries</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </Select>
              </label>

              <label className="flex items-center gap-3 text-[0.75rem] text-ink/45">
                Character
                <Select
                  value={characterParam}
                  onChange={(event) => update('character', event.target.value || null)}
                  className="h-8 w-auto min-w-32 border-b-0 py-0 text-[0.8125rem]"
                >
                  <option value="">Any</option>
                  {availableCharacters.map((character) => (
                    <option key={character} value={character}>
                      {characterLabels[character]}
                    </option>
                  ))}
                </Select>
              </label>

              <label className="flex items-center gap-3 text-[0.75rem] text-ink/45">
                Sort
                <Select
                  value={sort}
                  onChange={(event) => update('sort', event.target.value)}
                  className="h-8 w-auto min-w-32 border-b-0 py-0 text-[0.8125rem]"
                >
                  <option value="editorial">Editorial</option>
                  <option value="name">A–Z</option>
                  <option value="country">Country</option>
                </Select>
              </label>

              <div className="ml-auto flex items-center gap-2">
                <span className="mr-2 text-[0.75rem] text-ink/45">
                  {results.length} {results.length === 1 ? 'place' : 'places'}
                </span>
                <div className="flex rounded-full border border-ink/15 p-0.5">
                  <button
                    type="button"
                    onClick={() => update('view', null)}
                    aria-pressed={view === 'grid'}
                    className={cn(
                      'flex h-7 items-center gap-1.5 rounded-full px-3 text-[0.75rem] transition-colors',
                      view === 'grid' ? 'bg-ink text-ivory' : 'text-ink/60 hover:text-ink',
                    )}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                    Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => update('view', 'map')}
                    aria-pressed={view === 'map'}
                    className={cn(
                      'flex h-7 items-center gap-1.5 rounded-full px-3 text-[0.75rem] transition-colors',
                      view === 'map' ? 'bg-ink text-ivory' : 'text-ink/60 hover:text-ink',
                    )}
                  >
                    <MapIcon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                    Map
                  </button>
                </div>
              </div>
            </div>

            {activeFilters ? (
              <button
                type="button"
                onClick={reset}
                className="w-fit text-[0.75rem] text-ink/45 underline decoration-ink/20 underline-offset-4 hover:text-ink"
              >
                Clear all filters
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="pb-[var(--spacing-section)] pt-10">
        <div className="shell">
          {results.length === 0 ? (
            <div className="border border-ink/12 bg-cream px-6 py-16 text-center">
              <p className="font-display text-[2rem] leading-tight">Nothing matches that yet.</p>
              <p className="mx-auto mt-3 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink/60">
                The atlas is small on purpose. Try a different interest, or clear the filters and
                start again.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="h-11 rounded-full bg-ink px-5 text-[0.8125rem] font-medium text-ivory"
                >
                  Show every place
                </button>
                <Link
                  to="/journal"
                  className="inline-flex h-11 items-center rounded-full border border-ink/20 px-5 text-[0.8125rem]"
                >
                  Read the journal instead
                </Link>
              </div>
            </div>
          ) : view === 'map' ? (
            <div className="grid border border-ink/12 md:grid-cols-12">
              <div className="order-2 md:order-2 md:col-span-5 md:border-l md:border-ink/12">
                <div className="max-h-[620px] overflow-y-auto">
                  {results.map((destination) => (
                    <button
                      key={destination.slug}
                      type="button"
                      onClick={() => setSelected(destination.slug)}
                      onMouseEnter={() => setSelected(destination.slug)}
                      className={cn(
                        'flex w-full items-start gap-4 border-b border-ink/8 p-4 text-left transition-colors',
                        selectedDestination?.slug === destination.slug
                          ? 'bg-paper'
                          : 'hover:bg-ink/[0.03]',
                      )}
                    >
                      <span className="relative h-16 w-20 shrink-0 overflow-hidden bg-paper">
                        <SmartImage
                          name={destination.image.src}
                          alt=""
                          sizes="80px"
                          widths={[640, 1000]}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[1.25rem] leading-tight">
                          {destination.name}
                        </span>
                        <span className="mt-0.5 block text-[0.75rem] text-ink/50">
                          {destination.country}
                        </span>
                        {selectedDestination?.slug === destination.slug ? (
                          <Link
                            to={`/destinations/${destination.slug}`}
                            className="mt-2 inline-block text-[0.75rem] underline decoration-ink/25 underline-offset-4"
                          >
                            Open the place
                          </Link>
                        ) : null}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="order-1 md:order-1 md:col-span-7">
                <AtlasMapLazy
                  points={points}
                  activeId={selected}
                  onActiveChange={setSelected}
                  follow
                  className="h-[420px] md:h-[620px]"
                  label="Map of filtered destinations"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((destination) => (
                <DestinationCard
                  key={destination.slug}
                  destination={destination}
                  ratio="4 / 3"
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 46vw, 100vw"
                  showLine
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
