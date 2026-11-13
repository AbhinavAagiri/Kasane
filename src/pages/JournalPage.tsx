import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { stories } from '@/data/stories';
import type { StoryCategory } from '@/data/types';
import { usePageMeta } from '@/hooks/usePageMeta';
import { journalMeta } from '@/seo/routes';
import { StoryCard } from '@/components/atlas/StoryCard';
import { SmartImage } from '@/components/media/SmartImage';
import { readingTime } from '@/lib/format';
import { cn } from '@/lib/utils';

const categories: StoryCategory[] = [
  'Places',
  'Architecture',
  'Culture',
  'Nature',
  'Experiences',
  'Guides',
];

export const JournalPage = () => {
  const [params, setParams] = useSearchParams();
  const category = (params.get('category') ?? '') as StoryCategory | '';
  const filtered = category ? stories.filter((story) => story.categories.includes(category)) : stories;
  const feature = !category ? filtered[0] : null;
  const rest = !category ? filtered.slice(1) : filtered;

  usePageMeta(journalMeta);

  return (
    <>
      <section className="pb-12 pt-[calc(var(--nav-h)+3.5rem)] md:pt-[calc(var(--nav-h)+5rem)]">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <p className="text-[0.75rem] text-ink/45">The journal</p>
              <h1 className="display-xl mt-3">Notes from the layers.</h1>
            </div>
            <p className="max-w-[40ch] pb-2 text-[0.9375rem] leading-relaxed text-ink/60">
              Essays on architecture, landscape, food and the small decisions that make a place
              feel like itself. No listicles, no opening hours.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-ink/12 pt-6">
            <button
              type="button"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
              aria-pressed={!category}
              className={cn(
                'h-8 rounded-full border px-3.5 text-[0.75rem] transition-colors',
                !category
                  ? 'border-ink bg-ink text-ivory'
                  : 'border-ink/15 text-ink/65 hover:border-ink/35',
              )}
            >
              All writing
            </button>
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setParams(item === category ? new URLSearchParams() : new URLSearchParams({ category: item }), {
                    replace: true,
                  })
                }
                aria-pressed={category === item}
                className={cn(
                  'h-8 rounded-full border px-3.5 text-[0.75rem] transition-colors',
                  category === item
                    ? 'border-ink bg-ink text-ivory'
                    : 'border-ink/15 text-ink/65 hover:border-ink/35',
                )}
              >
                {item}
              </button>
            ))}
            <span className="ml-auto text-[0.75rem] text-ink/40">
              {filtered.length} {filtered.length === 1 ? 'story' : 'stories'}
            </span>
          </div>
        </div>
      </section>

      {feature ? (
        <section className="pb-16">
          <div className="shell grid gap-10 md:grid-cols-12 md:items-end">
            <Link to={`/journal/${feature.slug}`} className="group md:col-span-8">
              <div className="aspect-[16/10] overflow-hidden bg-paper">
                <div className="h-full w-full transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.02]">
                  <SmartImage
                    name={feature.image.src}
                    alt={feature.image.alt}
                    sizes="(min-width: 768px) 66vw, 100vw"
                    priority
                  />
                </div>
              </div>
            </Link>
            <div className="md:col-span-4">
              <p className="text-[0.75rem] text-olive">
                {feature.categories[0]} · {readingTime(feature.readingMinutes)}
              </p>
              <h2 className="display-md mt-3">
                <Link to={`/journal/${feature.slug}`} className="hover:opacity-70">
                  {feature.title}
                </Link>
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink/65">{feature.standfirst}</p>
              <Link
                to={`/journal/${feature.slug}`}
                className="link-quiet mt-6 inline-flex text-[0.875rem] text-ink"
              >
                Read the story
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="pb-[var(--spacing-section)]">
        <div className="shell">
          {rest.length ? (
            <div className="grid gap-x-6 gap-y-16 border-t border-ink/12 pt-10 md:grid-cols-12">
              {rest.map((story, index) => (
                <StoryCard
                  key={story.slug}
                  story={story}
                  className={
                    index % 3 === 0
                      ? 'md:col-span-7'
                      : index % 3 === 1
                        ? 'md:col-span-4 md:col-start-9 md:mt-20'
                        : 'md:col-span-4'
                  }
                  ratio={index % 3 === 0 ? '16 / 10' : '4 / 5'}
                  sizes="(min-width: 768px) 38vw, 100vw"
                />
              ))}
            </div>
          ) : (
            <div className="border border-ink/12 bg-cream px-6 py-16 text-center">
              <p className="font-display text-[2rem]">No stories in this category yet.</p>
              <p className="mx-auto mt-3 max-w-[40ch] text-[0.9375rem] text-ink/60">
                The journal grows a few pieces at a time. Read everything, or start with a place.
              </p>
              <button
                type="button"
                onClick={() => setParams(new URLSearchParams(), { replace: true })}
                className="mt-6 h-11 rounded-full bg-ink px-5 text-[0.8125rem] font-medium text-ivory"
              >
                All writing
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
