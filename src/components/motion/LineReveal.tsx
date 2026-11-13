import { useEffect, useRef } from 'react';
import { getGsap, prefersReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';

type LineRevealProps = {
  lines: readonly string[];
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  lineClassName?: string;
  /** Indices rendered in the serif italic accent. */
  italicLines?: readonly number[];
  start?: string;
  delay?: number;
};

/**
 * Each visual line sits in its own overflow mask so the reveal never clips a
 * neighbouring line.
 */
export const LineReveal = ({
  lines,
  as: Tag = 'h2',
  className,
  lineClassName,
  italicLines = [],
  start = 'top 88%',
  delay = 0,
}: LineRevealProps) => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element || prefersReducedMotion()) return;

    const targets = element.querySelectorAll<HTMLElement>('[data-line-inner]');
    if (!targets.length) return;

    const { gsap } = getGsap();
    const animation = gsap.fromTo(
      targets,
      { yPercent: 112 },
      {
        yPercent: 0,
        duration: 1.35,
        ease: 'expo.out',
        stagger: 0.09,
        delay,
        scrollTrigger: { trigger: element, start, once: true },
      },
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [delay, start]);

  return (
    <div ref={root} className={className}>
      <Tag>
        {lines.map((line, index) => (
          <span key={line} className="block overflow-hidden pb-[0.06em]">
            <span
              data-line-inner
              className={cn(
                'block will-change-transform',
                italicLines.includes(index) && 'font-accent italic',
                lineClassName,
              )}
            >
              {line}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
};
