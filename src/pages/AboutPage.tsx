import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { aboutMeta } from '@/seo/routes';
import { SmartImage } from '@/components/media/SmartImage';
import { Button } from '@/components/ui/Button';
import { LayerMark } from '@/components/ui/LayerMark';
import { LayersMoment } from '@/components/three/LayersMoment';

const layers = [
  {
    title: 'History',
    body: 'What a place remembers, and what it has chosen to forget. The older layer is rarely the most obvious one.',
  },
  {
    title: 'Architecture',
    body: 'How a place builds for its climate, its beliefs and its idea of a good life. Buildings are arguments you can walk through.',
  },
  {
    title: 'Culture',
    body: 'Craft, food, ritual and the everyday habits that survive longer than any monument.',
  },
  {
    title: 'Nature',
    body: 'The weather, the water, the geology. The layer that sets the terms for everything above it.',
  },
  {
    title: 'Everyday life',
    body: 'The least photographed layer, and usually the most interesting: where people actually buy bread, sit down and wait.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Read',
    body: 'Start with a place or a story. The atlas is written to be read, not skimmed for a booking.',
  },
  {
    number: '02',
    title: 'Keep',
    body: 'Save destinations and essays. Make collections around a curiosity, not a checklist.',
  },
  {
    number: '03',
    title: 'Plan',
    body: 'Build a day-by-day itinerary with notes, costs and room for the unplanned afternoon.',
  },
];

export const AboutPage = () => {
  usePageMeta(aboutMeta);

  return (
    <>
      <section className="pb-14 pt-[calc(var(--nav-h)+3.5rem)] md:pt-[calc(var(--nav-h)+5rem)]">
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <div className="flex items-center gap-3 text-[0.75rem] text-ink/45">
                <LayerMark className="text-olive" />
                <span>About KASANE</span>
              </div>
              <h1 className="display-xl mt-5 max-w-[13ch]">The world is not a list.</h1>
            </div>
            <p className="max-w-[40ch] text-[1rem] leading-relaxed text-ink/65 md:col-span-4">
              KASANE means layers. The name comes from Japanese, but the idea is not tied to one
              country. Every place is a stack of earlier places, and the interesting part is
              usually underneath.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="shell">
          <div className="grid gap-8 md:grid-cols-12 md:items-end">
            <div className="aspect-[16/9] overflow-hidden bg-paper md:col-span-8">
              <SmartImage
                name="story-italy"
                alt="Fog lying across a landscape of hills and a distant town"
                sizes="(min-width: 768px) 66vw, 100vw"
              />
            </div>
            <p className="text-[0.75rem] leading-relaxed text-ink/45 md:col-span-3 md:col-start-10">
              The atlas is a way of paying attention. It is not exhaustive, and it is not neutral:
              every place here was chosen because it rewards a second look.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-forest py-[var(--spacing-section)] text-ivory">
        <div className="shell">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="text-[0.75rem] text-ivory/45">The idea</p>
              <h2 className="display-md mt-3">Five layers, one place.</h2>
              <p className="mt-5 max-w-[36ch] text-[0.9375rem] leading-relaxed text-ivory/60">
                You do not need all five to understand a place. But the more you notice, the more
                the place has to say.
              </p>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <ul>
                {layers.map((layer, index) => (
                  <li
                    key={layer.title}
                    className="grid gap-3 border-t border-ivory/15 py-5 last:border-b sm:grid-cols-[2.5rem_8rem_1fr] sm:items-baseline"
                  >
                    <span className="text-[0.6875rem] tabular-nums text-ivory/35">
                      0{index + 1}
                    </span>
                    <span className="font-display text-[1.45rem] leading-none text-ivory">
                      {layer.title}
                    </span>
                    <span className="text-[0.875rem] leading-relaxed text-ivory/60">
                      {layer.body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid gap-12 md:grid-cols-12 md:items-center md:gap-8">
          <div className="md:col-span-5">
            <p className="text-[0.75rem] text-ink/45">An object lesson</p>
            <h2 className="display-md mt-3 max-w-[12ch]">Nothing here is flat.</h2>
            <p className="mt-5 max-w-[42ch] text-[1rem] leading-relaxed text-ink/65">
              A destination is not a profile. It is several scales held at once: the geology under
              the street, the century in the facade, the hour in the market. The model is a reminder
              to keep looking after the first photograph.
            </p>
            <p className="mt-4 max-w-[40ch] text-[0.8125rem] leading-relaxed text-ink/50">
              A small study, drawn in the browser. It turns slowly, and it is deliberately
              unfinished.
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <LayersMoment />
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="text-[0.75rem] text-ink/45">How it works</p>
              <h2 className="display-md mt-3">Read, keep, plan.</h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <ol>
                {steps.map((step) => (
                  <li key={step.number} className="grid gap-4 border-t border-ink/12 py-6 sm:grid-cols-[3rem_10rem_1fr]">
                    <span className="text-[0.6875rem] tabular-nums text-ink/35">{step.number}</span>
                    <h3 className="font-display text-[1.5rem] leading-none">{step.title}</h3>
                    <p className="text-[0.9375rem] leading-relaxed text-ink/65">{step.body}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-[0.8125rem] leading-relaxed text-ink/50">
                Everything is stored in your browser. There is no account, no email and no server
                holding your plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/12 bg-paper py-14">
        <div className="shell grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="display-sm">What this is</h2>
          </div>
          <div className="grid gap-6 text-[0.9375rem] leading-relaxed text-ink/65 md:col-span-7 md:col-start-6 md:grid-cols-2">
            <p>
              An independent editorial atlas and a set of tools for keeping what you find. The
              places are real; the writing is editorial; nothing here is a booking.
            </p>
            <p>
              Photography and film are licensed via Unsplash and Pexels and credited in the
              credits page. The map is built on OpenStreetMap data with OpenFreeMap and styled in
              MapLibre. No account, no tracking and no advertising.
            </p>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <h2 className="display-lg max-w-[16ch]">Go and look at something closely.</h2>
          <div className="flex flex-wrap gap-3">
            <Button as={Link} to="/explore" variant="primary" size="lg">
              Explore the atlas
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </Button>
            <Button as={Link} to="/journal" variant="outline" size="lg">
              Read the journal
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
