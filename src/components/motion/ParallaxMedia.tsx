import { useEffect, useRef, type ReactNode } from 'react';
import { getGsap } from '@/lib/motion';
import { cn } from '@/lib/utils';

type ParallaxMediaProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
  veil?: boolean;
};

/**
 * Wraps media in an overflow-clipped frame. The inner layer drifts slightly
 * against the scroll direction; the frame itself can unveil with clip-path.
 */
export const ParallaxMedia = ({
  children,
  className,
  strength = 7,
  veil = true,
}: ParallaxMediaProps) => {
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const inner = element.querySelector<HTMLElement>('[data-parallax-inner]');
    const { gsap } = getGsap();

    const context = gsap.context(() => {
      if (veil) {
        gsap.fromTo(
          element,
          { clipPath: 'inset(14% 0% 14% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.6,
            ease: 'expo.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          },
        );
      }
      if (inner && strength > 0) {
        gsap.fromTo(
          inner,
          { yPercent: -strength },
          {
            yPercent: strength,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
    }, element);

    return () => context.revert();
  }, [strength, veil]);

  return (
    <div ref={frame} className={cn('relative overflow-hidden', className)}>
      <div data-parallax-inner className="absolute inset-[-8%_0] h-[116%] w-full">
        {children}
      </div>
    </div>
  );
};
