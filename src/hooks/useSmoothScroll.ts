import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { getGsap, prefersReducedMotion } from '@/lib/motion';

/**
 * Owns the Lenis instance for the document. ScrollTrigger is updated from
 * Lenis' own rAF loop, which keeps pinned sections in sync with the smoothing.
 * Smoothing is skipped when the visitor asks for reduced motion; native
 * scrolling remains available in every case.
 */
export const useSmoothScroll = (enabled: boolean) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = getGsap();
    let instance: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const start = () => {
      if (instance) return;

      const lenis = new Lenis({
        // Short enough to stay attached to the wheel, long enough to smooth
        // trackpad steps and chapter transitions.
        duration: 1.02,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.35,
        syncTouch: false,
        autoRaf: false,
      });

      instance = lenis;
      lenisRef.current = lenis;
      lenis.on('scroll', ScrollTrigger.update);

      tick = (time: number) => {
        instance?.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // The pinned stage may have been created while the native scrollbar was
      // still in charge. Recalculate once Lenis owns the scroll position and
      // again when webfonts settle, which changes headline metrics.
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
      const refreshAfterFonts = () => {
        if (!instance) return;
        window.requestAnimationFrame(() => ScrollTrigger.refresh());
      };
      void document.fonts?.ready.then(refreshAfterFonts);
    };

    start();

    return () => {
      if (tick) gsap.ticker.remove(tick);
      instance?.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);

  return lenisRef;
};
