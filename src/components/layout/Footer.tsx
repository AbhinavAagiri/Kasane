import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { site } from '@/data/site';
import { useScrollApi } from '@/hooks/useScrollApi';
import { LayerMark } from '@/components/ui/LayerMark';

const places = [
  { label: 'Kyoto', href: '/destinations/kyoto' },
  { label: 'Paris', href: '/destinations/paris' },
  { label: 'Seoul', href: '/destinations/seoul' },
  { label: 'Matera', href: '/destinations/matera' },
  { label: 'Essaouira', href: '/destinations/essaouira' },
];

export const Footer = () => {
  const { scrollTo } = useScrollApi();

  return (
    <footer data-dark className="print-hide relative overflow-hidden bg-forest text-ivory">
      <div className="shell pt-16 md:pt-24">
        <div className="grid gap-12 border-b border-ivory/14 pb-16 md:grid-cols-[1.35fr_0.65fr_0.65fr_0.7fr] md:gap-10">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <LayerMark className="text-ivory/70" />
              <span className="font-display text-[1.35rem] tracking-[0.14em]">KASANE</span>
            </div>
            <p className="mt-6 font-display text-[clamp(1.9rem,3vw,2.5rem)] leading-[1.05] text-ivory/92">
              See the world
              <br />
              in <em className="text-ivory/70">layers.</em>
            </p>
            <p className="mt-5 max-w-[36ch] text-[0.875rem] leading-relaxed text-ivory/55">
              An independent atlas of places, beliefs, kitchens and the journeys between them.
              No bookings, no rankings, no hurry.
            </p>
          </div>

          <nav aria-label="Explore" className="flex flex-col gap-3">
            <p className="kicker text-ivory/40">Explore</p>
            {site.footer.explore.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="w-fit text-[0.875rem] text-ivory/72 transition-colors duration-200 hover:text-ivory"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="About" className="flex flex-col gap-3">
            <p className="kicker text-ivory/40">The project</p>
            {site.footer.about.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="w-fit text-[0.875rem] text-ivory/72 transition-colors duration-200 hover:text-ivory"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Places" className="flex flex-col gap-3">
            <p className="kicker text-ivory/40">A few places</p>
            {places.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="w-fit text-[0.875rem] text-ivory/72 transition-colors duration-200 hover:text-ivory"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="relative select-none pt-10">
          <p
            aria-hidden="true"
            className="font-display leading-[0.76] tracking-[-0.045em] text-ivory/[0.93]"
            style={{ fontSize: 'clamp(4rem, 16.5vw, 15rem)' }}
          >
            KASANE
          </p>
          <p className="absolute bottom-2 right-0 hidden text-right text-[0.625rem] uppercase leading-relaxed tracking-[0.14em] text-ivory/35 sm:block">
            Vol. II
            <br />
            An atlas of living culture
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-ivory/12 py-7 text-[0.75rem] text-ivory/50 md:flex-row md:items-center md:justify-between">
          <p>{site.copyright}</p>
          <p className="max-w-xl leading-relaxed">
            Photography & film via Unsplash and Pexels. Maps © OpenStreetMap contributors, rendered
            with OpenFreeMap. Land geometry from Natural Earth.
          </p>
          <button
            type="button"
            onClick={() => scrollTo(0)}
            className="flex w-fit items-center gap-2 text-ivory/65 transition-colors hover:text-ivory"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <p className="border-t border-ivory/10 py-6 text-[0.75rem] leading-relaxed text-ivory/40">
          {site.disclosure}
        </p>

        <div className="pb-7 pt-2 text-center">
          <a
            href="https://abhinavaagiri.com"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-block text-[0.6875rem] uppercase tracking-[0.16em] text-ivory/40 transition-colors duration-200 hover:text-ivory focus-visible:text-ivory"
          >
            <span aria-hidden="true">~ </span>Abhinav Aagiri<span aria-hidden="true"> ~</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
