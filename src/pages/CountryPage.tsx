import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { countryBySlug } from '@/data/destinations';
import { usePageMeta } from '@/hooks/usePageMeta';
import { countryRouteMeta } from '@/seo/routes';
import { DestinationCard } from '@/components/atlas/DestinationCard';
import { Button } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const CountryPage = () => {
  const { slug } = useParams();
  const country = slug ? countryBySlug[slug] : undefined;

  usePageMeta(countryRouteMeta(country, slug));

  if (!country) {
    return (
      <section className="shell flex min-h-[70svh] flex-col justify-center py-32">
        <p className="text-[0.75rem] text-ink/45">Countries</p>
        <h1 className="display-lg mt-4 max-w-[18ch]">This country is not in the atlas yet.</h1>
        <p className="mt-5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink/65">
          The atlas is growing slowly and deliberately. Explore the places and countries already
          here.
        </p>
        <Button as={Link} to="/explore" variant="primary" className="mt-8 w-fit">
          Explore the atlas
        </Button>
      </section>
    );
  }

  const count = country.destinations.length;

  return (
    <>
      <section className="pb-14 pt-[calc(var(--nav-h)+3.5rem)] md:pb-20 md:pt-[calc(var(--nav-h)+5rem)]">
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="text-[0.75rem] uppercase tracking-[0.12em] text-ink/45">
                Countries · {country.code}
              </p>
              <h1 className="display-xl mt-4 max-w-[14ch]">Explore {country.name}</h1>
            </div>
            <div className="md:col-span-4">
              <p className="max-w-[38ch] text-[1rem] leading-relaxed text-ink/65">
                {count === 1
                  ? `One place in ${country.name} is currently in the KASANE atlas. Read its field guide, or return to the atlas for the wider map.`
                  : `${count} places in ${country.name} are currently in the KASANE atlas — each read through its architecture, culture, landscape and everyday life.`}
              </p>
              <Link to="/explore" className="link-quiet mt-5 text-[0.875rem] text-ink">
                All countries in the atlas
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-[var(--spacing-section)]">
        <div className="shell">
          <SectionHeading
            title={count === 1 ? 'The field guide' : 'Field guides'}
            intro={`Places in ${country.name} selected and edited by KASANE.`}
          />
          <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {country.destinations.map((destination) => (
              <DestinationCard
                key={destination.slug}
                destination={destination}
                ratio="4 / 3"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
