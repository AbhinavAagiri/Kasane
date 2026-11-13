import { cn } from '@/lib/utils';

type SmartImageProps = {
  /** Base name of the processed asset set, e.g. "dest-kyoto". */
  name: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  widths?: readonly number[];
  position?: string;
};

const DEFAULT_WIDTHS = [640, 1000, 1600, 2200] as const;

const srcSet = (name: string, widths: readonly number[], ext: 'webp' | 'jpg') =>
  widths.map((width) => `/images/${name}-${width}.${ext} ${width}w`).join(', ');

/**
 * Serves pre-generated responsive derivatives (WebP with a JPEG fallback).
 * The surrounding element owns the aspect ratio so no layout shift occurs.
 */
export const SmartImage = ({
  name,
  alt,
  sizes = '100vw',
  priority = false,
  className,
  imgClassName,
  widths = DEFAULT_WIDTHS,
  position = '50% 50%',
}: SmartImageProps) => {
  const largest = widths[widths.length - 1] ?? 1600;

  return (
    <picture className={cn('block h-full w-full', className)}>
      <source type="image/webp" srcSet={srcSet(name, widths, 'webp')} sizes={sizes} />
      <img
        src={`/images/${name}-${Math.min(1600, largest)}.jpg`}
        srcSet={srcSet(name, widths, 'jpg')}
        sizes={sizes}
        alt={alt}
        width={largest}
        height={Math.round(largest * 0.66)}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn('h-full w-full object-cover', imgClassName)}
        style={{ objectPosition: position }}
      />
    </picture>
  );
};
