import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Info, TrainFront } from 'lucide-react';
import { cultureThemes, type CultureProfile, type CultureThemeId } from '@/data/culture';
import type { Destination } from '@/data/types';
import { SmartImage } from '@/components/media/SmartImage';
import { cn } from '@/lib/utils';

export const CultureLayers = ({
  profile,
  destination,
}: {
  profile: CultureProfile;
  destination: Destination;
}) => {
  const [active, setActive] = useState<CultureThemeId>('beliefs');
  const chapter = profile.chapters.find((entry) => entry.theme === active) ?? profile.chapters[0];

  return (
    <section id="culture" className="scroll-mt-24 border-t border-ink/12 py-[var(--spacing-section)]">
      <div className="shell">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45">
              The culture layer
            </p>
            <h2 className="display-lg mt-3 max-w-[15ch]">
              How the place
              <br />
              <em className="text-ink/60">holds together.</em>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-[0.9375rem] leading-relaxed text-ink/65">{profile.standfirst}</p>
          </div>
        </div>

        <div className="mt-12 grid border-y border-ink/14 md:grid-cols-12">
          <div className="md:col-span-3 md:border-r md:border-ink/12">
            <div className="flex gap-1.5 overflow-x-auto py-3 no-scrollbar md:flex-col md:gap-0 md:overflow-visible md:py-0">
              {cultureThemes.map((theme, index) => {
                const available = profile.chapters.some((entry) => entry.theme === theme.id);
                return (
                  <button
                    key={theme.id}
                    type="button"
                    disabled={!available}
                    onClick={() => setActive(theme.id)}
                    aria-pressed={active === theme.id}
                    className={cn(
                      'group flex shrink-0 items-baseline gap-3 rounded-full px-3 py-2 text-left transition-colors md:rounded-none md:border-b md:border-ink/8 md:px-0 md:py-3.5 md:last:border-b-0',
                      active === theme.id
                        ? 'bg-ink text-ivory md:bg-transparent md:text-ink'
                        : 'text-ink/50 hover:text-ink',
                      !available && 'public-disabled hidden',
                    )}
                  >
                    <span
                      className={cn(
                        'index-number shrink-0',
                        active === theme.id ? 'text-ivory/55 md:text-seal' : 'text-ink/25',
                      )}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="block text-[0.8125rem] font-medium">{theme.label}</span>
                      <span className="mt-0.5 hidden text-[0.6875rem] leading-relaxed text-ink/40 md:block">
                        {theme.question}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="hidden border-t border-ink/10 px-0 py-4 md:block">
              <Link
                to="/culture"
                className="inline-flex items-center gap-1.5 text-[0.6875rem] text-ink/45 transition-colors hover:text-ink"
              >
                Read the culture field guide
                <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-9">
            {chapter ? (
              <div className="grid h-full md:grid-cols-12">
                <div className="flex flex-col justify-between gap-8 px-0 py-8 md:col-span-7 md:px-9 md:py-10">
                  <div>
                    <p className="text-[0.625rem] uppercase tracking-[0.13em] text-seal">
                      {cultureThemes.find((theme) => theme.id === chapter.theme)?.label}
                    </p>
                    <h3 className="display-md mt-3 max-w-[18ch]">{chapter.title}</h3>
                    <p className="mt-5 max-w-[52ch] text-[0.9375rem] leading-[1.75] text-ink/68">
                      {chapter.body}
                    </p>
                    {chapter.note ? (
                      <div className="mt-6 flex max-w-[50ch] gap-3 border-l border-seal/40 pl-4">
                        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-seal/70" strokeWidth={1.5} aria-hidden="true" />
                        <p className="text-[0.75rem] leading-relaxed text-ink/50">{chapter.note}</p>
                      </div>
                    ) : null}
                  </div>
                  <p className="text-[0.625rem] uppercase tracking-[0.12em] text-ink/30">
                    {destination.name} · {active === 'myth' ? 'Myth and memory' : 'Field note'}
                  </p>
                </div>
                <div className="relative min-h-[260px] overflow-hidden bg-paper md:col-span-5 md:min-h-full">
                  <SmartImage
                    name={destination.secondaryImage.src}
                    alt={destination.secondaryImage.alt}
                    sizes="(min-width: 768px) 32vw, 100vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(16,18,15,0.66))] px-5 pb-4 pt-12 text-[0.625rem] uppercase leading-relaxed tracking-[0.1em] text-ivory/65">
                    {destination.name}, {destination.country}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-10 pt-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <p className="flex items-center gap-2 text-[0.625rem] uppercase tracking-[0.12em] text-ink/40">
                  <TrainFront className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  Getting there
                </p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink/60">{profile.arrival}</p>
              </div>
              <div>
                <p className="text-[0.625rem] uppercase tracking-[0.12em] text-ink/40">A good base</p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink/60">{profile.stayArea}</p>
              </div>
              <div>
                <p className="text-[0.625rem] uppercase tracking-[0.12em] text-ink/40">Getting around</p>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink/60">
                  {profile.gettingAround}
                </p>
              </div>
            </div>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-ink/40">A few courtesies</p>
            <ul className="mt-2 space-y-1.5">
              {profile.etiquette.map((item) => (
                <li key={item} className="text-[0.8125rem] leading-relaxed text-ink/55">
                  — {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
