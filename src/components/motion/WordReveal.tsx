import { useEffect, useRef } from 'react';
import { getGsap, prefersReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';

type WordRevealProps = {
  text: string;
  className?: string;
};

/**
 * Adapted from ReactBits' ScrollReveal (DavidHDev/react-bits, MIT).
 *
 * The original kills every ScrollTrigger on unmount, which is unsafe on a
 * routed page. This version scopes the tween to this component only and keeps
 * the words readable in the accessibility tree.
 */
export const WordReveal = ({ text, className }: WordRevealProps) => {
  const root = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    if (!root.current || prefersReducedMotion()) return;
    const element = root.current;
    const { gsap } = getGsap();
    const context = gsap.context(() => {
      const targets = element.querySelectorAll<HTMLElement>('[data-word-reveal]');
      gsap.fromTo(
        targets,
        {
          opacity: 0.14,
          y: 10,
          filter: 'blur(7px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          stagger: 0.045,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top 82%',
            end: 'top 38%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      );
    }, element);
    return () => context.revert();
  }, [text]);

  return (
    <p ref={root} className={cn('word-reveal', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span key={`${word}-${index}`} data-word-reveal className="word-reveal__word">
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </p>
  );
};
