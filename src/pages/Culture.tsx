import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cultureMeta } from '@/seo/routes';
import {
  countForTheme,
  cultureProfiles,
  cultureThemes,
  type CultureThemeId,
} from '@/data/culture';
import { destinationBySlug } from '@/data/destinations';
import { SmartImage } from '@/components/media/SmartImage';
import { upcomingEvents } from '@/data/events';
import { cn } from '@/lib/utils';

const truncate = (text: string, length = 260) =>
  text.length > length ? `${text.slice(0, length).replace(/\s+\S*$/, '')}…` : text;

export const Culture = () => {
  const [theme, setTheme] = useState<CultureThemeId>('beliefs');

  usePageMeta(cultureMeta);

  const excerpts = useMemo(
    () =>
      cultureProfiles
        .map((profile) => {
          const chapter = profile.chapters.find((entry) => entry.theme === theme);
          const destination = destinationBySlug[profile.destinationSlug];
          return chapter && destination ? { profile, chapter, destination } : null;
        })
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
        .slice(0, 4),
    [theme],
  );

  const featured = ['kyoto', 'matera', 'seoul']
    .map((slug) => {
      const profile = cultureProfiles.find((entry) => entry.destinationSlug === slug);
      const destination = destinationBySlug[slug];
      return profile && destination ? { profile, destination } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  const activeTheme = cultureThemes.find((entry) => entry.id === theme);

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-[calc(var(--nav-h)+3.2rem)] md:pb-24 md:pt-[calc(var(--nav-h)+5rem)]">
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <div className="flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.16em] text-ink/45">
                <span className="h-px w-8 bg-ink/30" aria-hidden="true" />
                The culture layer
              </div>
              <h1 className="display-xl mt-5 max-w-[12ch]">
                A place is
                <br />
                more than
                <br />
                <em className="text-olive">its view.</em>
              </h1>
              <p className="mt-7 max-w-[50ch] text-[1rem] leading-relaxed text-ink/65">
                Belief, memory, the table, the workshop, the festival, the weather. Culture is the
                slow layer beneath the photograph — and the part that asks the most of a visitor.
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="relative ml-auto max-w-[430px]">
                <div className="aspect-[4/5] overflow-hidden bg-paper">
                  <SmartImage
                    name="dest-matera"
                    alt="The stone city of Matera, held in its landscape"
                    sizes="(min-width: 768px) 34vw, 100vw"
                    priority
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 hidden w-[46%] border-[6px] border-ivory bg-paper shadow-sm sm:block">
                  <div className="aspect-square overflow-hidden">
                    <SmartImage
                      name="dest-kyoto-b"
                      alt="A raked garden in Kyoto"
                      sizes="20vw"
                    />
                  </div>
                </div>
                <p className="mt-6 max-w-[26ch] text-[0.6875rem] leading-relaxed text-ink/40 sm:ml-0 sm:mt-10">
                  Matera, Italy. Rock, ritual and a long argument about what a city is for.
                </p>
              </div>
            </div>
          </div>

          <a
            href="#field-guide"
            className="mt-14 inline-flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.12em] text-ink/45 transition-colors hover:text-ink"
          >
            Read the field guide
            <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="border-y border-ink/12 bg-paper py-12">
        <div className="shell grid gap-8 md:grid-cols-12 md:items-start">
          <div className="md:col-span-3">
            <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink/40">A working rule</p>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <p className="font-display text-[clamp(1.65rem,2.8vw,2.5rem)] leading-[1.15] text-ink/85">
              We name belief as belief, and folklore as folklore. Living religion is not evidence
              for a myth, and a beautiful story is not the same as a fact.
            </p>
            <p className="mt-5 max-w-[62ch] text-[0.875rem] leading-relaxed text-ink/55">
              Each field guide separates what a community practises from what it tells. Where a
              custom is contested, commercialised or changing, we say so. Where a place is sacred,
              we do not turn it into content.
            </p>
          </div>
        </div>
      </section>

      <section id="field-guide" className="scroll-mt-24 py-[var(--spacing-section)]">
        <div className="shell">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-6">
              <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45">
                Eight ways in
              </p>
              <h2 className="display-lg mt-3">How to read a place.</h2>
            </div>
            <p className="max-w-[40ch] text-[0.875rem] leading-relaxed text-ink/55 md:col-span-4 md:col-start-9">
              A culture is not a list of facts to collect. These are the doors we use — and the
              questions we keep asking once inside.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="border-t border-ink/14">
                {cultureThemes.map((entry, index) => {
                  const active = entry.id === theme;
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setTheme(entry.id)}
                      aria-pressed={active}
                      className={cn(
                        'group flex w-full items-baseline gap-4 border-b border-ink/10 py-3.5 text-left transition-colors',
                        active ? 'text-ink' : 'text-ink/48 hover:text-ink',
                      )}
                    >
                      <span
                        className={cn(
                          'index-number w-6 shrink-0',
                          active ? 'text-seal' : 'text-ink/25',
                        )}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1">
                        <span className="font-display text-[1.45rem] leading-none">{entry.label}</span>
                        <span className="mt-1 block text-[0.75rem] text-ink/45">
                          {entry.question}
                        </span>
                      </span>
                      <span className="text-[0.625rem] tabular-nums text-ink/30">
                        {countForTheme(entry.id)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <div className="border border-ink/14 bg-cream p-6 md:p-8">
                <p className="text-[0.625rem] uppercase tracking-[0.13em] text-seal">
                  {activeTheme?.label}
                </p>
                <h3 className="display-sm mt-2">{activeTheme?.question}</h3>
                <div className="mt-6 space-y-6">
                  {excerpts.map(({ profile, chapter, destination }, index) => (
                    <Link
                      key={`${profile.destinationSlug}-${chapter.title}`}
                      to={`/destinations/${destination.slug}#culture`}
                      className="group block border-t border-ink/10 pt-4 first:border-t-0 first:pt-0"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="font-display text-[1.3rem] leading-tight">{chapter.title}</p>
                        <span className="index-number shrink-0 text-ink/25">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink/55">
                        {truncate(chapter.body, 210)}
                      </p>
                      <p className="mt-2 text-[0.625rem] uppercase tracking-[0.1em] text-ink/35">
                        {destination.name}, {destination.country}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/12 bg-paper py-[var(--spacing-section)]">
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-3">
            {featured.map(({ profile, destination }, index) => (
              <article
                key={destination.slug}
                className={cn('group', index === 1 && 'md:mt-16', index === 2 && 'md:mt-8')}
              >
                <Link to={`/destinations/${destination.slug}#culture`} className="block">
                  <div className="aspect-[4/5] overflow-hidden bg-stone">
                    <SmartImage
                      name={destination.image.src}
                      alt={destination.image.alt}
                      sizes="(min-width: 768px) 30vw, 100vw"
                      className="transition-transform duration-[900ms] group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-4 text-[0.625rem] uppercase tracking-[0.12em] text-ink/40">
                    Field guide · {destination.country}
                  </p>
                  <h3 className="mt-1.5 font-display text-[2rem] leading-none">{destination.name}</h3>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-ink/60">
                    {profile.standfirst}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[0.75rem] text-ink/55 group-hover:text-ink">
                    Read the culture layer
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink/14 pb-4">
            <div>
              <p className="text-[0.6875rem] uppercase tracking-[0.14em] text-ink/45">
                The full index
              </p>
              <h2 className="display-md mt-2">{cultureProfiles.length} culture layers.</h2>
            </div>
            <p className="max-w-[34ch] text-[0.8125rem] leading-relaxed text-ink/50">
              Each is written for the place, not the template. Read one before you book, or after
              you arrive.
            </p>
          </div>

          <ol className="mt-2">
            {cultureProfiles.map((profile, index) => {
              const destination = destinationBySlug[profile.destinationSlug];
              if (!destination) return null;
              return (
                <li key={profile.destinationSlug} className="border-b border-ink/10">
                  <Link
                    to={`/destinations/${destination.slug}#culture`}
                    className="group grid gap-4 py-5 md:grid-cols-12 md:items-center md:gap-6"
                  >
                    <span className="index-number text-ink/25 md:col-span-1">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="md:col-span-3">
                      <p className="font-display text-[1.8rem] leading-none transition-colors group-hover:text-olive">
                        {destination.name}
                      </p>
                      <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.09em] text-ink/35">
                        {destination.country}
                      </p>
                    </div>
                    <p className="max-w-[70ch] text-[0.8125rem] leading-relaxed text-ink/55 md:col-span-6">
                      {profile.standfirst}
                    </p>
                    <div className="hidden md:col-span-1 md:block">
                      <div className="aspect-square w-14 overflow-hidden bg-paper">
                        <SmartImage
                          name={destination.image.src}
                          alt=""
                          sizes="56px"
                          widths={[640]}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:col-span-1 md:justify-end">
                      <span className="text-[0.625rem] uppercase tracking-[0.1em] text-ink/30">
                        {profile.chapters.length} chapters
                      </span>
                      <ArrowUpRight className="ml-3 h-4 w-4 text-ink/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="mt-14 grid gap-8 border border-ink/14 bg-cream p-7 md:grid-cols-12 md:items-center md:p-10">
            <div className="md:col-span-8">
              <p className="flex items-center gap-3 text-[0.625rem] uppercase tracking-[0.12em] text-ink/45">
                <span className="seal-dot" aria-hidden="true" />
                The calendar
              </p>
              <h2 className="display-sm mt-2">Culture is also something you can attend.</h2>
              <p className="mt-3 max-w-[56ch] text-[0.875rem] leading-relaxed text-ink/55">
                {upcomingEvents.length} checked festivals, rituals and gatherings, with dates,
                sources and the etiquette that matters.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link
                to="/events"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[0.8125rem] text-ivory"
              >
                See what’s on
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
