import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/media/SmartImage';
import { interests } from '@/data/interests';
import { countDestinationsForInterest } from '@/data/destinations';
import { cn } from '@/lib/utils';

export const InterestsSection = () => {
  const [active, setActive] = useState(interests[0]?.id ?? '');
  const activeInterest = interests.find((interest) => interest.id === active) ?? interests[0];

  if (!activeInterest) return null;
  return (
    <section className="bg-paper py-[var(--spacing-section)]">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <SectionHeading
              title="Discover by interest"
              intro="The atlas is arranged by what draws you in, not by where you are. Start with a curiosity."
            />

            <ul className="mt-8" onMouseLeave={() => setActive(interests[0]?.id ?? '')}>
              {interests.map((interest) => {
                const isActive = interest.id === active;
                return (
                  <li key={interest.id} className="border-b border-ink/12">
                    <Link
                      to={`/explore?interest=${interest.id}`}
                      onMouseEnter={() => setActive(interest.id)}
                      onFocus={() => setActive(interest.id)}
                      className="group flex items-center justify-between gap-5 py-5"
                    >
                      <span className="flex items-center gap-4">
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full transition-colors duration-300',
                            isActive ? 'bg-olive' : 'bg-ink/30',
                          )}
                          aria-hidden="true"
                        />
                        <span
                          className={cn(
                            'display-sm transition-[transform,color] duration-300',
                            isActive ? 'translate-x-1 text-ink' : 'text-ink/70',
                          )}
                        >
                          {interest.label}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-4 text-[0.75rem] text-ink/58">
                        {countDestinationsForInterest(interest.id)} places
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="hidden md:col-span-4 md:col-start-9 md:block">
            <div className="sticky top-[calc(var(--nav-h)+2rem)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                {interests.map((interest) => (
                  <div
                    key={interest.id}
                    className={cn(
                      'absolute inset-0 transition-opacity duration-700',
                      interest.id === active ? 'opacity-100' : 'opacity-0',
                    )}
                    aria-hidden="true"
                  >
                    <SmartImage
                      name={interest.image.src}
                      alt={interest.image.alt}
                      sizes="(min-width: 768px) 32vw, 100vw"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-start justify-between gap-6">
                <p className="text-[0.75rem] text-ink/62">{activeInterest.description}</p>
                <span className="shrink-0 text-[0.6875rem] tabular-nums text-ink/48">0{interests.indexOf(activeInterest) + 1} / 07</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
