import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { DestinationCard } from '@/components/atlas/DestinationCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { destinations, featuredDestinations } from '@/data/destinations';

export const AtlasSection = () => {
  const [kyoto, jaipur, florence, reykjavik, newYork, barcelona, lisbon, lucerne] =
    featuredDestinations;

  if (!kyoto || !jaipur || !florence || !reykjavik || !newYork || !barcelona || !lisbon || !lucerne) {
    return null;
  }

  return (
    <section id="atlas" className="pb-[var(--spacing-section)]">
      <div className="shell">
        <SectionHeading
          title="A first look at the atlas"
          aside={
            <Link to="/explore" className="link-quiet text-ink">
              All {destinations.length} places
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          }
          intro={`A first look at an atlas of ${destinations.length} places. These eight are a way in — chosen for what they reward rather than what they advertise.`}
        />

        <div className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-12">
          <DestinationCard
            destination={kyoto}
            className="md:col-span-7"
            ratio="4 / 3"
            sizes="(min-width: 768px) 58vw, 100vw"
          />
          <DestinationCard
            destination={jaipur}
            className="md:col-span-5 md:mt-20"
            ratio="3 / 4"
            sizes="(min-width: 768px) 38vw, 100vw"
          />
          <DestinationCard
            destination={florence}
            className="md:col-span-4"
            ratio="4 / 5"
            sizes="(min-width: 768px) 32vw, 100vw"
          />
          <DestinationCard
            destination={reykjavik}
            className="md:col-span-4 md:mt-14"
            ratio="4 / 5"
            sizes="(min-width: 768px) 32vw, 100vw"
          />
          <DestinationCard
            destination={newYork}
            className="md:col-span-4"
            ratio="4 / 5"
            sizes="(min-width: 768px) 32vw, 100vw"
          />
          <DestinationCard
            destination={barcelona}
            className="md:col-span-5"
            ratio="16 / 10"
            sizes="(min-width: 768px) 40vw, 100vw"
          />
          <DestinationCard
            destination={lisbon}
            className="md:col-span-3 md:col-start-7 md:mt-16"
            ratio="3 / 4"
            sizes="(min-width: 768px) 24vw, 100vw"
          />
          <DestinationCard
            destination={lucerne}
            className="md:col-span-4 md:col-start-9 md:mt-4"
            ratio="4 / 3"
            sizes="(min-width: 768px) 32vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
};
