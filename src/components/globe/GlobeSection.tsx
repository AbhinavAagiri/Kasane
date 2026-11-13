import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { destinations } from '@/data/destinations';
import { getGsap } from '@/lib/motion';
import { LayerMark } from '@/components/ui/LayerMark';

const AtlasGlobe = lazy(() => import('@/components/globe/AtlasGlobe'));

const Fallback = () => (
  <div
    className="globe-fallback aspect-square w-full max-w-[520px]"
    role="img"
    aria-label="A static world map, shown in place of the interactive globe"
  >
    <img src="/map/world.svg" alt="" />
  </div>
);

export const GlobeSection = () => {
  const root = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) {
      setVisible(true);
      return;
    }
    const { gsap, ScrollTrigger } = getGsap();
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 90%',
        once: true,
        onEnter: () => setVisible(true),
      });
      gsap.fromTo(
        '[data-globe-copy] > *',
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          scrollTrigger: { trigger: element, start: 'top 72%' },
        },
      );
    }, element);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-forest py-[var(--spacing-section)] text-ivory">
      <div className="shell grid items-center gap-14 md:grid-cols-12 md:gap-8">
        <div data-globe-copy className="md:col-span-5">
          <div className="flex items-center gap-3 text-[0.6875rem] uppercase tracking-[0.16em] text-ivory/45">
            <LayerMark className="text-ivory/50" />
            The world, held in one view
          </div>
          <h2 className="display-lg mt-6 max-w-[12ch]">
            Every place is
            <br />
            <em className="text-ivory/70">a layer.</em>
          </h2>
          <p className="mt-6 max-w-[40ch] text-[0.9375rem] leading-relaxed text-ivory/62">
            Drag the globe to read the atlas as a whole: land drawn as small points, destinations
            marked in seal red, everything connected by the long way round.
          </p>
          <dl className="mt-10 flex gap-8 border-t border-ivory/16 pt-5 text-[0.6875rem] uppercase tracking-[0.1em] text-ivory/40">
            <div>
              <dt>Places</dt>
              <dd className="mt-1 font-display text-[1.8rem] normal-case tracking-normal text-ivory/85">
                {destinations.length}
              </dd>
            </div>
            <div>
              <dt>Countries</dt>
              <dd className="mt-1 font-display text-[1.8rem] normal-case tracking-normal text-ivory/85">
                {new Set(destinations.map((destination) => destination.countryCode)).size}
              </dd>
            </div>
            <div>
              <dt>Field guides</dt>
              <dd className="mt-1 font-display text-[1.8rem] normal-case tracking-normal text-ivory/85">
                14
              </dd>
            </div>
          </dl>
          <Link
            to="/explore"
            className="mt-9 inline-flex items-center gap-2 text-[0.8125rem] text-ivory/80 underline decoration-ivory/30 underline-offset-4 transition-colors hover:text-ivory"
          >
            Open the atlas
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <div className="relative flex justify-center md:justify-end">
            <span
              aria-hidden="true"
              className="absolute inset-0 m-auto hidden h-[76%] w-[76%] rounded-full border border-ivory/10 sm:block"
            />
            {visible ? (
              <Suspense fallback={<Fallback />}>
                <AtlasGlobe />
              </Suspense>
            ) : (
              <Fallback />
            )}
          </div>
          <p className="mt-4 text-right text-[0.625rem] uppercase tracking-[0.12em] text-ivory/35">
            Land geometry · Natural Earth · Drag to rotate
          </p>
        </div>
      </div>
    </section>
  );
};
