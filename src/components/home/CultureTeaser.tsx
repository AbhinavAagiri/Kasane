import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SmartImage } from '@/components/media/SmartImage';
import { cultureProfiles, cultureThemes } from '@/data/culture';

export const CultureTeaser = () => (
  <section className="relative overflow-hidden bg-forest text-ivory">
    <div className="grid md:grid-cols-12">
      <div className="relative min-h-[380px] md:col-span-6 md:min-h-[720px]">
        <div className="absolute inset-0">
          <SmartImage
            name="dest-seoul-b"
            alt="Layered hanok rooftops in Bukchon, Seoul"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,18,15,0.2),rgba(16,18,15,0.7))]" />
        <p className="absolute bottom-5 left-[var(--spacing-gutter)] max-w-[28ch] text-[0.6875rem] uppercase leading-relaxed tracking-[0.1em] text-ivory/82">
          Seoul · a city that changes speed every few blocks
        </p>
      </div>

      <div className="flex flex-col justify-center px-[var(--spacing-gutter)] py-16 md:col-span-6 md:py-24 lg:px-16">
        <p className="flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.16em] text-ivory/62">
          <span className="h-px w-8 bg-ivory/30" aria-hidden="true" />
          The culture layer
        </p>
        <h2 className="display-lg mt-5 max-w-[13ch]">
          Read the place,
          <br />
          not just <em className="text-ivory/80">the view.</em>
        </h2>
        <p className="mt-6 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ivory/76">
          Who holds the place together? What is believed, cooked, repaired, argued over and
          celebrated? {cultureProfiles.length} field guides that separate living culture from
          costume.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-0 border-t border-ivory/16">
          {cultureThemes.map((theme, index) => (
            <div
              key={theme.id}
              className="flex items-baseline gap-3 border-b border-ivory/16 py-3 text-[0.8125rem] text-ivory/78"
            >
              <span className="index-number text-[0.5625rem] text-ivory/48">
                {String(index + 1).padStart(2, '0')}
              </span>
              {theme.label}
            </div>
          ))}
        </div>

        <Link
          to="/culture"
          className="mt-9 inline-flex w-fit items-center gap-2 rounded-full border border-ivory/45 px-5 py-3 text-[0.8125rem] text-ivory transition-colors hover:border-ivory/70 hover:bg-ivory/5"
        >
          Enter the culture atlas
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>
    </div>
  </section>
);
