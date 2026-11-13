import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Globe2,
  Hourglass,
  Landmark,
  MapPin,
  Mountain,
  Palette,
  Search,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Destination, InterestId } from '@/data/types';
import { interestById } from '@/data/interests';
import { eventDateLabel } from '@/data/events';
import type { AtlasEvent } from '@/data/events';
import { SmartImage } from '@/components/media/SmartImage';
import { cn } from '@/lib/utils';

export type GlobeFilter = 'all' | 'events' | InterestId;

const filters: Array<{ id: GlobeFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'culture', label: 'Culture' },
  { id: 'nature', label: 'Nature' },
  { id: 'history', label: 'History' },
  { id: 'food', label: 'Food' },
  { id: 'events', label: 'Events' },
];

const filterMeta: Record<GlobeFilter, { note: string; icon: LucideIcon }> = {
  all: { note: 'The whole atlas', icon: Globe2 },
  architecture: { note: 'Buildings and rooms', icon: Building2 },
  culture: { note: 'Craft, ritual, heritage', icon: Landmark },
  nature: { note: 'Coast, mountain, weather', icon: Mountain },
  cities: { note: 'Streets beyond the postcard', icon: MapPin },
  art: { note: 'Rooms and encounters', icon: Palette },
  history: { note: 'What remains, and where', icon: Hourglass },
  food: { note: 'Markets and everyday tables', icon: UtensilsCrossed },
  events: { note: 'The calendar ahead', icon: CalendarDays },
};

type SearchMode = 'where' | 'interest';

type WorldExploreProps = {
  destinations: Destination[];
  filtered: Destination[];
  filter: GlobeFilter;
  query: string;
  selected: Destination | null;
  eventsByDestination: Map<string, AtlasEvent[]>;
  onFilter: (filter: GlobeFilter) => void;
  onQuery: (query: string) => void;
  onSelect: (slug: string) => void;
  onHover: (slug: string | null) => void;
};

export const WorldExplore = ({
  destinations,
  filtered,
  filter,
  query,
  selected,
  eventsByDestination,
  onFilter,
  onQuery,
  onSelect,
  onHover,
}: WorldExploreProps) => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<SearchMode>('where');
  const searchRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const interestRef = useRef<HTMLButtonElement>(null);

  const activeFilterLabel = filters.find((item) => item.id === filter)?.label ?? 'All';
  const suggestions = filtered.slice(0, 5);
  const trimmedQuery = query.trim();

  const closePanel = () => {
    setOpen(false);
    onHover(null);
  };

  const openPanel = (nextMode: SearchMode) => {
    setMode(nextMode);
    setOpen(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (filtered[0]) {
      onSelect(filtered[0].slug);
      closePanel();
    }
  };

  const chooseDestination = (slug: string) => {
    onSelect(slug);
    closePanel();
    inputRef.current?.focus();
  };

  const chooseFilter = (id: GlobeFilter) => {
    onFilter(id);
    closePanel();
  };

  const countForFilter = (id: GlobeFilter) => {
    if (id === 'all') return destinations.length;
    if (id === 'events') {
      return destinations.filter((destination) => (eventsByDestination.get(destination.slug)?.length ?? 0) > 0)
        .length;
    }
    return destinations.filter((destination) => destination.interests.includes(id)).length;
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setOpen(false);
        onHover(null);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      onHover(null);
      if (mode === 'interest') interestRef.current?.focus();
      else inputRef.current?.focus();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, mode, onHover]);

  const focusFirstPanelItem = () => {
    const first = panelRef.current?.querySelector<HTMLButtonElement>(
      '.atlas-search__result, .atlas-search__interest',
    );
    first?.focus();
  };

  const selectedEvents = selected ? eventsByDestination.get(selected.slug) ?? [] : [];
  const selectedCategory =
    selected && selected.interests[0] ? interestById[selected.interests[0]]?.label : '';

  return (
    <div className="world-explore">
      <div className="world-explore__toolbar">
        <div className="atlas-search" ref={searchRef}>
          <div className="world-filters atlas-search__tabs no-scrollbar" role="group" aria-label="Filter destinations">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => chooseFilter(item.id)}
                aria-pressed={filter === item.id}
                className={cn('world-filter', filter === item.id && 'is-active')}
              >
                {item.label}
              </button>
            ))}
          </div>

          <form className="world-search atlas-search__bar" role="search" onSubmit={submit}>
            <label
              className={cn(
                'atlas-search__field atlas-search__field--where',
                query && 'has-query',
              )}
            >
              <span className="atlas-search__label">Where</span>
              <input
                ref={inputRef}
                className="atlas-search__input"
                value={query}
                onClick={() => openPanel('where')}
                onChange={(event) => {
                  onQuery(event.target.value);
                  setMode('where');
                  setOpen(true);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown' && open && mode === 'where') {
                    event.preventDefault();
                    focusFirstPanelItem();
                  }
                }}
                placeholder="Search destinations"
                aria-label="Where"
                autoComplete="off"
              />
              {query ? (
                <button
                  type="button"
                  className="atlas-search__clear"
                  onClick={() => {
                    onQuery('');
                    setOpen(true);
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" strokeWidth={1.8} />
                </button>
              ) : null}
            </label>

            <span className="atlas-search__divider" aria-hidden="true" />

            <button
              ref={interestRef}
              type="button"
              className={cn(
                'atlas-search__field atlas-search__field--interest',
                mode === 'interest' && open && 'is-active',
              )}
              onClick={() => openPanel('interest')}
              aria-haspopup="dialog"
              aria-expanded={open && mode === 'interest'}
              aria-controls="atlas-search-panel"
            >
              <span className="atlas-search__label">Interest</span>
              <span className="atlas-search__value">{activeFilterLabel}</span>
            </button>

            <button type="submit" className="atlas-search__submit" aria-label="Search destinations">
              <Search className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </button>
          </form>

          {open ? (
            <div
              ref={panelRef}
              id="atlas-search-panel"
              className="atlas-search__panel"
              role="region"
              aria-label="Search suggestions"
            >
              <div className="atlas-search__panel-head">
                <span>
                  {mode === 'interest'
                    ? 'Browse by interest'
                    : trimmedQuery
                      ? `${filtered.length} ${filtered.length === 1 ? 'place' : 'places'} for “${trimmedQuery}”`
                      : 'Places to begin with'}
                </span>
                <button
                  type="button"
                  className="atlas-search__close"
                  onClick={() => closePanel()}
                  aria-label="Close search"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={1.7} />
                </button>
              </div>

              {mode === 'interest' ? (
                <div className="atlas-search__interest-grid">
                  {filters.map((item) => {
                    const Icon = filterMeta[item.id].icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={cn(
                          'atlas-search__interest',
                          filter === item.id && 'is-active',
                        )}
                        onClick={() => chooseFilter(item.id)}
                        aria-pressed={filter === item.id}
                      >
                        <Icon
                          className="atlas-search__interest-icon"
                          strokeWidth={1.4}
                          aria-hidden="true"
                        />
                        <span className="atlas-search__interest-copy">
                          <span className="atlas-search__interest-label">{item.label}</span>
                          <span className="atlas-search__interest-note">
                            {filterMeta[item.id].note}
                          </span>
                        </span>
                        <span className="atlas-search__interest-count">
                          {countForFilter(item.id)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <>
                  {suggestions.length ? (
                    <ul className="atlas-search__results">
                      {suggestions.map((destination) => {
                        const destinationEvents = eventsByDestination.get(destination.slug) ?? [];
                        return (
                          <li key={destination.slug}>
                            <button
                              type="button"
                              className="atlas-search__result"
                              onClick={() => chooseDestination(destination.slug)}
                              onMouseEnter={() => onHover(destination.slug)}
                              onMouseLeave={() => onHover(null)}
                              onFocus={() => onHover(destination.slug)}
                              onBlur={() => onHover(null)}
                            >
                              <span className="atlas-search__thumb" aria-hidden="true">
                                <SmartImage
                                  name={destination.image.src}
                                  alt=""
                                  sizes="42px"
                                  widths={[640]}
                                />
                              </span>
                              <span className="atlas-search__result-copy">
                                <span className="atlas-search__result-name">{destination.name}</span>
                                <span className="atlas-search__result-place">
                                  {destination.country} · {destination.region}
                                  {destinationEvents.length ? (
                                    <span className="atlas-search__result-event">
                                      {destinationEvents.length} upcoming
                                    </span>
                                  ) : null}
                                </span>
                              </span>
                              <ArrowUpRight
                                className="atlas-search__result-arrow"
                                strokeWidth={1.5}
                                aria-hidden="true"
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="atlas-search__no-results">
                      No places match “{trimmedQuery}”. Try another name, country or interest.
                    </p>
                  )}

                  {!trimmedQuery ? (
                    <div className="atlas-search__section">
                      <span className="atlas-search__section-label">Or browse by interest</span>
                      <div className="atlas-search__chips">
                        {filters.slice(1).map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            className={cn(
                              'atlas-search__chip',
                              filter === item.id && 'is-active',
                            )}
                            onClick={() => chooseFilter(item.id)}
                            aria-pressed={filter === item.id}
                          >
                            {item.label}
                            <span>{countForFilter(item.id)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div className={cn('world-explore__body', open && 'is-searching')}>
        <div className="world-index">
          <div className="world-index__head">
            <span>
              {filtered.length} {filtered.length === 1 ? 'place' : 'places'}
            </span>
            <span className="world-index__hint">Select a point</span>
          </div>
          <ul className="world-index__list">
            {filtered.map((destination) => {
              const destinationEvents = eventsByDestination.get(destination.slug) ?? [];
              const isSelected = selected?.slug === destination.slug;
              return (
                <li key={destination.slug}>
                  <button
                    type="button"
                    onClick={() => onSelect(destination.slug)}
                    onMouseEnter={() => onHover(destination.slug)}
                    onMouseLeave={() => onHover(null)}
                    onFocus={() => onHover(destination.slug)}
                    onBlur={() => onHover(null)}
                    className={cn('world-index__item', isSelected && 'is-selected')}
                  >
                    <span className="world-index__name">{destination.name}</span>
                    <span className="world-index__country">
                      {destination.country}
                      {destinationEvents.length ? (
                        <span className="world-index__event">
                          {destinationEvents.length} {destinationEvents.length === 1 ? 'event' : 'events'}
                        </span>
                      ) : null}
                    </span>
                    <ArrowUpRight className="h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </li>
              );
            })}
            {!filtered.length ? (
              <li className="world-index__empty">
                No places match this search. Try another name or filter.
              </li>
            ) : null}
          </ul>
        </div>

        <aside className="world-preview" aria-live="polite">
          {selected ? (
            <>
              <button
                type="button"
                className="world-preview__close"
                onClick={() => onSelect('')}
                aria-label={`Close ${selected.name} preview`}
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
              <div className="world-preview__figure">
                <SmartImage
                  name={selected.image.src}
                  alt={selected.image.alt}
                  sizes="(max-width: 767px) 36vw, 300px"
                  widths={[640, 1000]}
                />
              </div>
              <div className="world-preview__copy">
                <p className="world-preview__kicker">
                  {selectedCategory}
                  {selectedEvents.length ? <span> · {selectedEvents.length} upcoming</span> : null}
                </p>
                <h4 className="world-preview__name">{selected.name}</h4>
                <p className="world-preview__place">
                  {selected.country} · {selected.region}
                </p>
                <p className="world-preview__line">{selected.line}</p>
                {selectedEvents[0] ? (
                  <p className="world-preview__event">
                    {selectedEvents[0].name} · {eventDateLabel(selectedEvents[0])}
                  </p>
                ) : null}
                <Link to={`/destinations/${selected.slug}`} className="world-preview__link">
                  Read the field guide
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </div>
            </>
          ) : (
            <div className="world-preview__empty">
              <span className="world-preview__empty-mark" aria-hidden="true" />
              <p>Select a point to read its story.</p>
              <span>{filtered.length} places · {destinations.length} field guides</span>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
