import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/media/SmartImage';
import { curatedCollections } from '@/data/collections';

export const CollectionsSection = () => {
  const picks = curatedCollections.slice(0, 4);

  return (
    <section className="section-y">
      <div className="shell">
        <SectionHeading
          title="Keep what stays with you"
          aside={
            <Link to="/collections" className="link-quiet text-ink">
              All collections
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          }
          intro="A collection is an argument you make for yourself: the buildings you want to see, the quiet places you are saving for later, the trip you are not ready to plan yet."
        />

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-12">
          {picks.map((collection, index) => (
            <article
              key={collection.slug}
              className={
                index === 0
                  ? 'lg:col-span-4'
                  : index === 1
                    ? 'lg:col-span-3 lg:mt-16'
                    : index === 2
                      ? 'lg:col-span-3 lg:mt-6'
                      : 'lg:col-span-2 lg:mt-24'
              }
            >
              <Link to={`/collections/${collection.slug}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-paper">
                  <div className="h-full w-full transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.025]">
                    <SmartImage
                      name={collection.image.src}
                      alt={collection.image.alt}
                      sizes="(min-width: 1024px) 30vw, 50vw"
                    />
                  </div>
                </div>
                <h3 className="mt-4 font-display text-[1.45rem] leading-tight">{collection.title}</h3>
                <p className="mt-1.5 text-[0.75rem] text-ink/45">
                  {collection.destinationSlugs.length + collection.storySlugs.length} entries
                </p>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-5 border-t border-ink/12 pt-6">
          <p className="max-w-[52ch] text-[0.9rem] leading-relaxed text-ink/60">
            Start with one of ours, or make a collection of your own. A place can belong to as many
            as you like.
          </p>
          <Link
            to="/collections"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/20 px-5 text-[0.8125rem] transition-colors hover:border-ink/40"
          >
            Start collecting
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
