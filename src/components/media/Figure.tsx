import { SmartImage } from '@/components/media/SmartImage';
import { cn } from '@/lib/utils';

type FigureProps = {
  image: { src: string; alt: string };
  caption?: string;
  credit?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  ratio?: string;
};

export const Figure = ({
  image,
  caption,
  credit = 'Photograph: licensed editorial image',
  className,
  imageClassName,
  sizes = '100vw',
  priority = false,
  ratio,
}: FigureProps) => (
  <figure className={cn('group/figure', className)}>
    <div
      className={cn('relative overflow-hidden bg-paper', imageClassName)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <SmartImage name={image.src} alt={image.alt} sizes={sizes} priority={priority} />
    </div>
    {(caption || credit) && (
      <figcaption className="mt-3 flex items-baseline justify-between gap-6 text-[0.75rem] leading-relaxed text-ink/50">
        <span className="max-w-[52ch]">{caption}</span>
        <span className="shrink-0 text-right">{credit}</span>
      </figcaption>
    )}
  </figure>
);
