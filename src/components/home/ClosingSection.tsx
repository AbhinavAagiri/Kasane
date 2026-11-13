import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SmartImage } from '@/components/media/SmartImage';
import { ParallaxMedia } from '@/components/motion/ParallaxMedia';
import { Button } from '@/components/ui/Button';
import { destinations } from '@/data/destinations';

export const ClosingSection = () => (
  <section className="relative overflow-hidden bg-forest text-ivory">
    <ParallaxMedia className="absolute inset-0" strength={5} veil={false}>
      <SmartImage
        name="atlas-closing"
        alt="A road winding through a fog-filled mountain valley"
        sizes="100vw"
        widths={[1000, 1600, 2200]}
      />
    </ParallaxMedia>
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,18,15,0.28),rgba(16,18,15,0.62))]" />

    <div className="shell relative flex min-h-[64svh] flex-col justify-between gap-16 py-14 md:min-h-[72svh] md:py-20">
      <p className="text-[0.75rem] text-ivory/55">The last layer</p>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h2 className="display-lg max-w-[14ch] text-ivory">The world is larger than your list.</h2>
        <div className="shrink-0">
          <Button as={Link} to="/explore" variant="light" size="lg">
            Find somewhere new
            <span className="btn-icon" aria-hidden="true">
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </span>
          </Button>
          <p className="mt-3 text-right text-[0.75rem] text-ivory/45">
            {destinations.length} places, more to come
          </p>
        </div>
      </div>
    </div>
  </section>
);
