import { Link } from 'react-router-dom';
import { SmartImage } from '@/components/media/SmartImage';
import type { Story } from '@/data/types';
import { cn } from '@/lib/utils';
import { readingTime } from '@/lib/format';

type StoryCardProps = {
  story: Story;
  className?: string;
  ratio?: string;
  sizes?: string;
  showStandfirst?: boolean;
  size?: 'default' | 'large';
};

export const StoryCard = ({
  story,
  className,
  ratio = '3 / 2',
  sizes = '(min-width: 1024px) 33vw, 100vw',
  showStandfirst = true,
  size = 'default',
}: StoryCardProps) => (
  <article className={cn('group', className)}>
    <Link to={`/journal/${story.slug}`} className="block">
      <div className="relative overflow-hidden bg-paper" style={{ aspectRatio: ratio }}>
        <div className="h-full w-full transition-transform duration-[900ms] ease-[var(--ease-out)] group-hover:scale-[1.025]">
          <SmartImage name={story.image.src} alt={story.image.alt} sizes={sizes} />
        </div>
      </div>
      <p className="mt-4 text-[0.75rem] font-medium text-olive">
        {story.categories[0]}
        <span className="mx-2 inline-block h-px w-3 translate-y-[-3px] bg-ink/25" aria-hidden="true" />
        <span className="font-normal text-ink/50">{readingTime(story.readingMinutes)}</span>
      </p>
      <h3 className={cn('mt-2', size === 'large' ? 'display-md' : 'display-sm')}>{story.title}</h3>
      {showStandfirst ? (
        <p className="mt-2.5 max-w-[46ch] text-[0.9rem] leading-relaxed text-ink/65">
          {story.standfirst}
        </p>
      ) : null}
    </Link>
  </article>
);
