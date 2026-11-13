import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SmartImage } from '@/components/media/SmartImage';
import { ParallaxMedia } from '@/components/motion/ParallaxMedia';
import { Button } from '@/components/ui/Button';
import { storyBySlug } from '@/data/stories';
import { readingTime } from '@/lib/format';

export const FeatureSection = () => {
  const story = storyBySlug['a-slower-journey-through-the-italian-countryside'];
  if (!story) return null;

  return (
    <section className="relative overflow-hidden bg-forest text-ivory">
      <ParallaxMedia className="absolute inset-0" strength={4} veil={false}>
        <SmartImage
          name={story.image.src}
          alt={story.image.alt}
          sizes="100vw"
          widths={[1000, 1600, 2200]}
        />
      </ParallaxMedia>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,8,0.8)_0%,rgba(8,10,8,0.44)_18%,rgba(8,10,8,0.12)_40%,rgba(8,10,8,0.28)_58%,rgba(8,10,8,0.9)_100%)]" />

      <div className="shell relative flex min-h-[78svh] flex-col justify-end py-14 md:py-20">
        <p className="text-[0.75rem] text-ivory/82">
          {story.categories.join(', ')}
          <span className="mx-2 inline-block h-px w-3 translate-y-[-3px] bg-ivory/45" aria-hidden="true" />
          {readingTime(story.readingMinutes)}
        </p>
        <h2 className="display-lg mt-5 max-w-[17ch] text-ivory">{story.title}</h2>
        <p className="mt-6 max-w-[52ch] text-[1rem] leading-relaxed text-ivory/82">
          {story.standfirst}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Button as={Link} to={`/journal/${story.slug}`} variant="light" size="lg">
            Read the story
            <span className="btn-icon" aria-hidden="true">
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </span>
          </Button>
          <span className="text-[0.75rem] text-ivory/66">{story.issue} · KASANE Editorial</span>
        </div>
      </div>
    </section>
  );
};
