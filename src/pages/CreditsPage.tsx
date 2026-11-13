import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { creditsMeta } from '@/seo/routes';
import { heroClips } from '@/data/hero';

type Attribution = {
  key: string;
  source: string;
  photoId?: string;
  creator?: string;
  sourceUrl?: string;
  alt?: string;
  license: string;
};

type AttributionFile = {
  note: string;
  images: Attribution[];
};

const sourceHref = (image: Attribution) => {
  if (image.sourceUrl) return image.sourceUrl;
  if (image.source === 'Unsplash' && image.photoId)
    return `https://unsplash.com/photos/${image.photoId}`;
  return 'https://www.pexels.com/';
};

export const CreditsPage = () => {
  const [data, setData] = useState<AttributionFile | null>(null);
  const [failed, setFailed] = useState(false);

  usePageMeta(creditsMeta);

  useEffect(() => {
    let active = true;
    fetch('/images/attribution.json')
      .then((response) => {
        if (!response.ok) throw new Error('Missing attribution');
        return response.json() as Promise<AttributionFile>;
      })
      .then((file) => {
        if (active) setData(file);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="pb-10 pt-[calc(var(--nav-h)+3.5rem)] md:pt-[calc(var(--nav-h)+5rem)]">
        <div className="shell">
          <p className="text-[0.75rem] uppercase tracking-[0.12em] text-ink/45">Credits</p>
          <h1 className="display-xl mt-3 max-w-[15ch]">Made with other people’s work.</h1>
          <p className="mt-6 max-w-[54ch] text-[1rem] leading-relaxed text-ink/65">
            KASANE is an independent editorial project. The photography and film are licensed, the
            map is built on open data, and the typefaces are used under their open licences.
          </p>
        </div>
      </section>

      <section className="pb-[var(--spacing-section)]">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="space-y-8">
              <div>
                <h2 className="display-sm">Photography</h2>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-ink/60">
                  Photographs are sourced from Unsplash and Pexels. Unsplash images are used under
                  the{' '}
                  <a
                    href="https://unsplash.com/license"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline decoration-ink/25 underline-offset-4 hover:text-ink"
                  >
                    Unsplash License
                  </a>
                  ; Pexels images are used under the{' '}
                  <a
                    href="https://www.pexels.com/license/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline decoration-ink/25 underline-offset-4 hover:text-ink"
                  >
                    Pexels License
                  </a>
                  . Source pages are listed so every asset can be traced.
                </p>
              </div>
              <div>
                <h2 className="display-sm">Film</h2>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-ink/60">
                  The globe journey uses four licensed clips from Pexels, re-encoded at editorial
                  lengths from the original masters with 1080p desktop and 720p mobile variants.
                  Seoul and Switzerland remain in the film library; every clip is credited below
                  with its creator and source page.
                </p>
                <ul className="mt-4 space-y-2">
                  {heroClips.map((clip) => (
                    <li key={clip.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[0.75rem]">
                      <span className="text-ink/65">
                        {clip.place} · {clip.creator}
                      </span>
                      <a
                        href={clip.sourcePage}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="shrink-0 text-[0.6875rem] text-ink/40 underline decoration-ink/15 underline-offset-4 hover:text-ink"
                      >
                        Pexels #{clip.sourceId}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="display-sm">Typefaces</h2>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-ink/60">
                  Newsreader and Hanken Grotesk, served by Google Fonts and used under the SIL Open
                  Font License.
                </p>
              </div>
              <div>
                <h2 className="display-sm">Map</h2>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-ink/60">
                  Vector tiles and styling use{' '}
                  <a
                    href="https://openfreemap.org/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline decoration-ink/25 underline-offset-4 hover:text-ink"
                  >
                    OpenFreeMap
                  </a>{' '}
                  and OpenMapTiles; map data ©{' '}
                  <a
                    href="https://www.openstreetmap.org/copyright"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline decoration-ink/25 underline-offset-4 hover:text-ink"
                  >
                    OpenStreetMap contributors
                  </a>
                  . The printed fallback and globe use Natural Earth land geometry (public domain).
                  Rendered with MapLibre GL JS.
                </p>
              </div>
              <div>
                <h2 className="display-sm">Events</h2>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-ink/60">
                  Every curated event links to its organiser or an official calendar. Optional
                  generated listings use the Ticketmaster Discovery API and retain their source
                  link. Dates and programmes can change.
                </p>
              </div>
              <div>
                <h2 className="display-sm">Elsewhere</h2>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-ink/60">
                  Icons from Lucide. The layered mark, layouts, itinerary engine and editorial
                  writing are original to KASANE.
                </p>
              </div>
              <p className="border-t border-ink/12 pt-5 text-[0.75rem] leading-relaxed text-ink/45">
                {data?.note ??
                  'Destinations are depicted editorially. KASANE is not affiliated with any place shown.'}
              </p>
            </div>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <h2 className="display-sm">Image credits</h2>
            {failed ? (
              <p className="mt-4 border border-ink/12 bg-cream p-5 text-[0.875rem] leading-relaxed text-ink/60">
                The image credits could not be loaded. Photographs are from Unsplash and Pexels
                under their respective licences.
              </p>
            ) : data ? (
              <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
                {data.images.map((image) => (
                  <li
                    key={image.key}
                    className="flex items-baseline justify-between gap-4 border-b border-ink/8 py-2.5"
                  >
                    <span className="min-w-0 truncate text-[0.8125rem] text-ink/70">
                      {image.key.replace(/-/g, ' ')}
                    </span>
                    <a
                      href={sourceHref(image)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="shrink-0 text-[0.625rem] uppercase tracking-[0.05em] text-ink/40 underline decoration-ink/15 underline-offset-4 hover:text-ink"
                    >
                      {image.source}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-[0.875rem] text-ink/50">Loading credits…</p>
            )}
            <p className="mt-6 text-[0.75rem] leading-relaxed text-ink/45">
              Attribution is maintained here and in{' '}
              <code className="text-[0.6875rem] text-ink/60">public/images/attribution.json</code>.
              If an image needs a correction or removal, open an issue in the project repository.
            </p>
          </div>
        </div>
      </section>

      <div className="shell pb-16">
        <Link to="/" className="link-quiet text-[0.875rem] text-ink">
          Back to the atlas
        </Link>
      </div>
    </>
  );
};
