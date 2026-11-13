import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SmartImage } from '@/components/media/SmartImage';
import { LineReveal } from '@/components/motion/LineReveal';
import { LayerMark } from '@/components/ui/LayerMark';

export const Intro = () => (
  <section className="section-y">
    <div className="shell grid gap-14 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-7">
        <div className="flex items-center gap-3 text-[0.75rem] text-ink/62">
          <LayerMark className="text-olive" />
          <span>Every place has another side</span>
        </div>

        <LineReveal
          as="h2"
          className="display-lg mt-8 max-w-[16ch]"
          lines={[
            'Some places reveal',
            'themselves immediately.',
            'Others ask you to look',
            'a little closer.',
          ]}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <p className="body-lead text-ink/75">
            KASANE is a way of travelling through layers: the architecture, the culture, the
            landscape and the everyday life that make a place what it is.
          </p>
          <div>
            <p className="text-[0.9rem] leading-relaxed text-ink/68">
              Read the atlas as a publication. Follow a place as far as you like. Save what stays
              with you. Then build a journey that has room for the unplanned afternoon.
            </p>
            <Link to="/about" className="link-quiet mt-5 text-[0.875rem] text-ink">
              How KASANE works
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <div className="md:col-span-4 md:col-start-9">
        <div className="ml-auto w-[82%]">
          <div className="aspect-[3/4] overflow-hidden bg-paper">
            <SmartImage
              name="dest-jaipur"
              alt="Jal Mahal floating on a lake at dawn"
              sizes="(min-width: 768px) 24vw, 80vw"
            />
          </div>
          <p className="mt-2 text-[0.75rem] text-ink/58">Jaipur, Rajasthan</p>
        </div>

        <div className="relative z-10 -mt-14 w-[56%]">
          <div className="aspect-square overflow-hidden bg-paper">
            <SmartImage
              name="story-iceland"
              alt="A river braiding through the Icelandic highlands"
              sizes="(min-width: 768px) 18vw, 56vw"
            />
          </div>
          <p className="mt-2 text-[0.75rem] text-ink/58">The highlands, Iceland</p>
        </div>

        <div className="ml-auto -mt-8 w-[46%]">
          <div className="aspect-[4/5] overflow-hidden bg-paper">
            <SmartImage
              name="story-lisbon"
              alt="A tiled Lisbon facade with a passer-by"
              sizes="(min-width: 768px) 14vw, 46vw"
            />
          </div>
          <p className="mt-2 text-[0.75rem] text-ink/58">Alfama, Lisbon</p>
        </div>
      </div>
    </div>
  </section>
);
