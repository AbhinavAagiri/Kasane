import { useEffect, useRef, type ReactNode } from 'react';
import { getGsap } from '@/lib/motion';
import { cn } from '@/lib/utils';

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  start?: string;
  as?: 'div' | 'section' | 'li' | 'figure' | 'article' | 'header' | 'footer';
};

export const Reveal = ({
  children,
  className,
  delay = 0,
  y = 26,
  start = 'top 90%',
  as: Tag = 'div',
}: RevealProps) => {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;

    const { gsap } = getGsap();
    const animation = gsap.fromTo(
      element,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.15,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: element, start, once: true },
      },
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [delay, start, y]);

  return (
    <Tag ref={root as never} className={cn(className)}>
      {children}
    </Tag>
  );
};
