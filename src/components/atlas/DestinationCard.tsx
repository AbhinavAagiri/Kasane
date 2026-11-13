import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SmartImage } from '@/components/media/SmartImage';
import { SaveButton } from '@/components/atlas/SaveButton';
import type { Destination } from '@/data/types';
import { cn } from '@/lib/utils';

type DestinationCardProps = {
  destination: Destination;
  className?: string;
  ratio?: string;
  sizes?: string;
  showLine?: boolean;
  saveTone?: 'light' | 'dark';
};

export const DestinationCard = ({
  destination,
  className,
  ratio = '4 / 3',
  sizes = '(min-width: 1024px) 40vw, 100vw',
  showLine = true,
  saveTone = 'light',
}: DestinationCardProps) => (
  <article className={cn('group relative', className)}>
    <div className="relative overflow-hidden bg-paper" style={{ aspectRatio: ratio }}>
      <Link
        to={`/destinations/${destination.slug}`}
        className="block h-full w-full"
        aria-label={`Explore ${destination.name}, ${destination.country}`}
        tabIndex={-1}
      >
        <div className="h-full w-full transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.025]">
          <SmartImage name={destination.image.src} alt={destination.image.alt} sizes={sizes} />
        </div>
        <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/[0.06]" />
      </Link>
      <SaveButton
        kind="destination"
        slug={destination.slug}
        name={destination.name}
        tone={saveTone}
        className="absolute right-3 top-3 z-10"
      />
    </div>

    <div className="mt-4 flex items-start justify-between gap-6">
      <div>
        <h3 className="display-sm">
          <Link
            to={`/destinations/${destination.slug}`}
            className="transition-transform duration-300 group-hover:translate-x-0.5 inline-block"
          >
            {destination.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-[0.8125rem] text-ink/64">
          {destination.country}, {destination.region}
        </p>
      </div>
      <ArrowUpRight
        className="mt-1 h-4 w-4 shrink-0 text-ink/48 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </div>
    {showLine ? (
      <p className="mt-2.5 max-w-[42ch] text-[0.9rem] leading-relaxed text-ink/72">
        {destination.line}
      </p>
    ) : null}
  </article>
);
