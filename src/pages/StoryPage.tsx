import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { storyBySlug } from '@/data/stories';
import { destinationBySlug } from '@/data/destinations';
import { usePageMeta } from '@/hooks/usePageMeta';
import { storyRouteMeta } from '@/seo/routes';
import { SmartImage } from '@/components/media/SmartImage';
import { SaveButton } from '@/components/atlas/SaveButton';
import { CollectionDialog } from '@/components/atlas/CollectionDialog';
import { StoryCard } from '@/components/atlas/StoryCard';
import { Button } from '@/components/ui/Button';
import { readingTime } from '@/lib/format';

export const StoryPage = () => {
  const { slug } = useParams();
  const story = slug ? storyBySlug[slug] : undefined;
  const [collectOpen, setCollectOpen] = useState(false);

  usePageMeta(storyRouteMeta(story, slug));

  if (!story) {
    return (
      <section className="shell flex min-h-[70svh] flex-col justify-center py-32">
        <p className="text-[0.75rem] text-ink/45">The journal</p>
        <h1 className="display-lg mt-4">This story is not here.</h1>
        <p className="mt-5 max-w-[44ch] text-[0.9375rem] leading-relaxed text-ink/65">
          It may have moved, or it may not have been written yet. The journal is the best place to
          start again.
        </p>
        <Button as={Link} to="/journal" variant="primary" className="mt-8 w-fit">
          Read the journal
        </Button>
      </section>
    );
  }

  const destination = destinationBySlug[story.destinationSlug];
  const related = story.related
    .map((relatedSlug) => storyBySlug[relatedSlug])
    .filter(Boolean)
    .slice(0, 2);

  return (
    <>
      <section className="grain relative flex min-h-[68svh] items-end overflow-hidden bg-forest">
        <div className="absolute inset-0">
          <SmartImage
            name={story.image.src}
            alt={story.image.alt}
            sizes="100vw"
            priority
            widths={[1000, 1600, 2200]}
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,18,15,0.22),rgba(16,18,15,0.12)_40%,rgba(16,18,15,0.55))]" />
      </section>

      <article className="pb-[var(--spacing-section)]">
        <div className="shell">
          <header className="grid gap-8 border-b border-ink/12 pb-12 pt-12 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="text-[0.75rem] text-olive">
                {story.categories.join(', ')} · {readingTime(story.readingMinutes)}
              </p>
              <h1 className="display-lg mt-4 max-w-[20ch]">{story.title}</h1>
              <p className="mt-6 max-w-[56ch] text-[1.0625rem] leading-relaxed text-ink/70">
                {story.standfirst}
              </p>
            </div>
            <div className="flex flex-col justify-between gap-6 md:col-span-3 md:col-start-10">
              <div>
                <p className="text-[0.75rem] text-ink/40">Words</p>
                <p className="mt-1 text-[0.9375rem]">KASANE Editorial</p>
                <p className="mt-4 text-[0.75rem] text-ink/40">Issue</p>
                <p className="mt-1 text-[0.9375rem]">{story.issue}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <SaveButton
                  kind="story"
                  slug={story.slug}
                  name={story.title}
                  withLabel
                />
                <button
                  type="button"
                  onClick={() => setCollectOpen(true)}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/20 px-5 text-[0.8125rem] transition-colors hover:border-ink/40"
                >
                  Collect
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto mt-14 max-w-[68ch]">
            {story.blocks.map((block, index) => {
              if (block.type === 'paragraph') {
                return (
                  <p
                    key={index}
                    className="mb-6 text-[1.0625rem] leading-[1.8] text-ink/85 last:mb-0"
                  >
                    {block.text}
                  </p>
                );
              }
              if (block.type === 'heading') {
                return (
                  <h2 key={index} className="display-sm mb-5 mt-12" style={{ fontSize: '1.9rem' }}>
                    {block.text}
                  </h2>
                );
              }
              if (block.type === 'image') {
                return (
                  <figure key={index} className="my-10">
                    <div className="aspect-[16/10] overflow-hidden bg-paper">
                      <SmartImage
                        name={block.image.src}
                        alt={block.image.alt}
                        sizes="(min-width: 768px) 68ch, 100vw"
                      />
                    </div>
                    <figcaption className="mt-3 text-[0.75rem] text-ink/45">
                      {block.image.alt}
                    </figcaption>
                  </figure>
                );
              }
              if (block.type === 'pull') {
                return (
                  <blockquote
                    key={index}
                    className="my-12 border-y border-ink/12 py-10 font-display text-[1.85rem] leading-[1.2] tracking-[-0.02em] text-ink"
                  >
                    {block.text}
                  </blockquote>
                );
              }
              return (
                <aside key={index} className="my-12 border border-ink/12 bg-cream p-6">
                  <p className="text-[0.75rem] font-medium text-olive">{block.title}</p>
                  <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-3">
                    {block.items.map((item) => (
                      <div key={item.label}>
                        <dt className="text-[0.6875rem] text-ink/40">{item.label}</dt>
                        <dd className="mt-1 text-[0.875rem] text-ink/80">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </aside>
              );
            })}
          </div>

          {destination ? (
            <div className="mx-auto mt-16 max-w-[68ch] border-t border-ink/12 pt-8">
              <p className="text-[0.75rem] text-ink/45">The place in this story</p>
              <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="display-sm">{destination.name}</h2>
                  <p className="mt-1 text-[0.8125rem] text-ink/50">
                    {destination.country}, {destination.region}
                  </p>
                </div>
                <Button as={Link} to={`/destinations/${destination.slug}`} variant="outline" size="md">
                  Open the place
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </article>

      {related.length ? (
        <section className="bg-paper py-[var(--spacing-section)]">
          <div className="shell">
            <div className="border-t border-ink/14 pt-5">
              <h2 className="display-md">Keep reading</h2>
            </div>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              {related.map((relatedStory) =>
                relatedStory ? (
                  <StoryCard
                    key={relatedStory.slug}
                    story={relatedStory}
                    sizes="(min-width: 768px) 46vw, 100vw"
                  />
                ) : null,
              )}
            </div>
            <Link to="/journal" className="link-quiet mt-10 inline-flex text-[0.875rem] text-ink">
              All stories
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        </section>
      ) : null}

      <CollectionDialog
        open={collectOpen}
        onOpenChange={setCollectOpen}
        storySlug={story.slug}
        name={story.title}
      />
    </>
  );
};
