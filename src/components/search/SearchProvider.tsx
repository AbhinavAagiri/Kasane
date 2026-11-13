import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { searchAtlas, searchSuggestions, type SearchHit } from '@/lib/search';
import { featuredDestinations } from '@/data/destinations';
import { storyBySlug } from '@/data/stories';
import { useAtlas } from '@/store/AtlasProvider';
import { useScrollApi } from '@/hooks/useScrollApi';
import { SmartImage } from '@/components/media/SmartImage';
import { cn } from '@/lib/utils';

type SearchApi = { open: () => void };
const SearchContext = createContext<SearchApi | null>(null);

const ResultRow = ({
  hit,
  active,
  onSelect,
  onHover,
}: {
  hit: SearchHit;
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    onMouseEnter={onHover}
    className={cn(
      'flex w-full items-center gap-4 border-b border-ink/8 px-5 py-3 text-left transition-colors last:border-b-0',
      active ? 'bg-ink/[0.045]' : 'hover:bg-ink/[0.03]',
    )}
  >
    <span className="relative h-12 w-16 shrink-0 overflow-hidden bg-paper">
      <SmartImage name={hit.image} alt="" sizes="64px" widths={[640, 1000]} />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block truncate font-display text-[1.2rem] leading-tight text-ink">
        {hit.title}
      </span>
      <span className="mt-0.5 block truncate text-[0.75rem] text-ink/55">
        {hit.meta} · {hit.kind}
      </span>
    </span>
    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink/35" strokeWidth={1.5} aria-hidden="true" />
  </button>
);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const atlas = useAtlas();
  const { stop, start } = useScrollApi();

  const openSearch = useCallback(() => setOpen(true), []);
  const api = useMemo(() => ({ open: openSearch }), [openSearch]);

  const results = useMemo(() => searchAtlas(query), [query]);
  const recent = atlas.recentDestinations
    .map((slug) => featuredDestinations.find((destination) => destination.slug === slug))
    .filter((destination): destination is (typeof featuredDestinations)[number] => Boolean(destination))
    .slice(0, 3);

  useEffect(() => {
    if (open) stop();
    else start();
    return () => start();
  }, [open, stop, start]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    setQuery('');
    navigate(href);
  };

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }
    if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      go(results[activeIndex].href);
    }
  };

  return (
    <SearchContext.Provider value={api}>
      {children}
      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setQuery('');
            setActiveIndex(0);
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[140] bg-ink/40 backdrop-blur-[2px]" />
          <Dialog.Content
            className="fixed inset-x-3 top-[12vh] z-[150] max-h-[72dvh] overflow-hidden border border-ink/12 bg-ivory p-0 shadow-[0_40px_120px_-50px_rgba(16,18,15,0.65)] sm:inset-x-auto sm:left-1/2 sm:w-[min(42rem,calc(100vw-3rem))] sm:-translate-x-1/2"
            aria-describedby={undefined}
          >
            <Dialog.Title className="sr-only">Search KASANE</Dialog.Title>
            <div className="flex items-center gap-3 border-b border-ink/10 px-5">
              <Search className="h-4 w-4 shrink-0 text-ink/40" strokeWidth={1.5} aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="A place, a country, an idea"
                aria-label="Search destinations and stories"
                maxLength={80}
                spellCheck={false}
                autoComplete="off"
                className="h-14 w-full bg-transparent text-[1rem] text-ink placeholder:text-ink/40 focus:outline-none"
              />
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close search"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink/45 hover:bg-ink/5 hover:text-ink"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </Dialog.Close>
            </div>

            <div className="max-h-[calc(72dvh-3.5rem)] overflow-y-auto">
              {query.trim() ? (
                results.length ? (
                  <div>
                    {results.map((hit, index) => (
                      <ResultRow
                        key={`${hit.kind}-${hit.slug}`}
                        hit={hit}
                        active={index === activeIndex}
                        onSelect={() => go(hit.href)}
                        onHover={() => setActiveIndex(index)}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => go(`/explore?q=${encodeURIComponent(query.trim())}`)}
                      className="flex w-full items-center justify-between px-5 py-3.5 text-[0.8125rem] text-ink/60 transition-colors hover:text-ink"
                    >
                      Search the full atlas for “{query.trim()}”
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <div className="px-5 py-8">
                    <p className="font-display text-[1.35rem] text-ink">
                      Nothing matches “{query.trim()}” yet.
                    </p>
                    <p className="mt-2 text-[0.875rem] text-ink/60">
                      Try a country, an interest, or one of these.
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {searchSuggestions.slice(0, 4).map((suggestion) => (
                        <li key={suggestion.label}>
                          <button
                            type="button"
                            onClick={() => go(suggestion.href)}
                            className="rounded-full border border-ink/15 px-4 py-2 text-[0.8125rem] hover:border-ink/40"
                          >
                            {suggestion.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ) : (
                <div className="px-5 py-5">
                  <p className="text-[0.75rem] font-medium text-ink/45">Try searching for</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {searchSuggestions.map((suggestion) => (
                      <li key={suggestion.label}>
                        <button
                          type="button"
                          onClick={() => go(suggestion.href)}
                          className="rounded-full border border-ink/15 px-4 py-2 text-[0.8125rem] transition-colors hover:border-ink/40"
                        >
                          {suggestion.label}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {recent.length ? (
                    <div className="mt-6">
                      <p className="text-[0.75rem] font-medium text-ink/45">Recently viewed</p>
                      <ul className="mt-2">
                        {recent.map((destination) => (
                          <li key={destination.slug}>
                            <button
                              type="button"
                              onClick={() => go(`/destinations/${destination.slug}`)}
                              className="flex w-full items-center justify-between border-b border-ink/8 py-2.5 text-left last:border-b-0"
                            >
                              <span className="text-[0.9375rem]">{destination.name}</span>
                              <span className="text-[0.75rem] text-ink/45">{destination.country}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="mt-6">
                    <p className="text-[0.75rem] font-medium text-ink/45">In the atlas</p>
                    <ul className="mt-2">
                      {featuredDestinations.slice(0, 4).map((destination) => (
                        <li key={destination.slug}>
                          <button
                            type="button"
                            onClick={() => go(`/destinations/${destination.slug}`)}
                            className="flex w-full items-baseline justify-between gap-4 border-b border-ink/8 py-2.5 text-left last:border-b-0"
                          >
                            <span className="font-display text-[1.15rem]">{destination.name}</span>
                            <span className="text-[0.75rem] text-ink/45">{destination.country}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {atlas.savedStories.length ? (
                    <div className="mt-6 border-t border-ink/10 pt-4">
                      <p className="text-[0.75rem] font-medium text-ink/45">Saved reading</p>
                      {atlas.savedStories.slice(0, 2).map((slug) => {
                        const story = storyBySlug[slug];
                        if (!story) return null;
                        return (
                          <button
                            key={slug}
                            type="button"
                            onClick={() => go(`/journal/${slug}`)}
                            className="mt-2 block w-full truncate text-left text-[0.875rem] text-ink/75 hover:text-ink"
                          >
                            {story.title}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used inside SearchProvider');
  return context;
};
