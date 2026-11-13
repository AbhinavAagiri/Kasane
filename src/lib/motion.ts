import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const getGsap = () => {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    // Mobile browser chrome changes should not re-measure pinned scenes.
    ScrollTrigger.config({ ignoreMobileResize: true });
    gsap.defaults({ ease: 'power3.out', duration: 1 });
    registered = true;
  }
  return { gsap, ScrollTrigger };
};

/** Breakpoints mirror the CSS so JS and CSS never disagree about layout. */
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
} as const;
