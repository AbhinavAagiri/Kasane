import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/media/SmartImage';
import { destinationBySlug } from '@/data/destinations';
import type { Destination } from '@/data/types';

const picks = ['matera', 'ghent', 'essaouira'];

export const ElsewhereSection = () => {
  const matera = destinationBySlug.matera;
  const others = picks
    .slice(1)
    .map((slug) => destinationBySlug[slug])
    .filter((destination): destination is Destination => Boolean(destination));

  if (!matera) return null;

  return (
    <section className="section-y">
      <div className="shell">
        <SectionHeading
          title="The world, differently"
          aside={
            <Link to="/explore?hidden=1" className="link-quiet text-ink">
              Places worth the detour
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          }
          intro="The atlas is not a ranking. Some of the most rewarding places are the ones that rarely make a list — a city of caves, a medieval port, a wind-scoured harbour town."
        />

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Link to={`/destinations/${matera.slug}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden bg-paper">
                <div className="h-full w-full transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.02]">
                  <SmartImage
                    name={matera.image.src}
                    alt={matera.image.alt}
                    sizes="(min-width: 768px) 58vw, 100vw"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-start justify-between gap-6">
                <div>
                  <h3 className="display-sm">{matera.name}</h3>
                  <p className="mt-1 text-[0.8125rem] text-ink/62">
                    {matera.country}, {matera.region}
                  </p>
                </div>
                <p className="max-w-[30ch] text-right text-[0.875rem] leading-relaxed text-ink/70">
                  {matera.line}
                </p>
              </div>
            </Link>
          </div>

          <div className="md:col-span-4 md:col-start-9">
            <p className="text-[0.9rem] leading-relaxed text-ink/72">
              Places that ask for a second look: a city that grew out of the rock, a port that
              kept its working character, a whitewashed town where the wind sets the pace.
            </p>

            <ul className="mt-8">
              {others.map((destination) => (
                <li key={destination.slug} className="border-t border-ink/12">
                  <Link
                    to={`/destinations/${destination.slug}`}
                    className="group flex items-center gap-4 py-4"
                  >
                    <span className="relative h-20 w-16 shrink-0 overflow-hidden bg-paper">
                      <SmartImage
                        name={destination.image.src}
                        alt={destination.image.alt}
                        sizes="64px"
                        widths={[640, 1000]}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[1.45rem] leading-tight">
                        {destination.name}
                      </span>
                      <span className="mt-0.5 block text-[0.75rem] text-ink/62">
                        {destination.country}, {destination.region}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-ink/48 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <Link to="/explore?hidden=1" className="link-quiet mt-6 text-[0.875rem] text-ink">
              More places off the main road
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
