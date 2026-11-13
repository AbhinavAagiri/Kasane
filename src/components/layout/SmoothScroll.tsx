import { useCallback, useEffect, useState, type ReactNode } from 'react';
import type Lenis from 'lenis';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { ScrollContext } from '@/hooks/useScrollApi';
import { prefersReducedMotion } from '@/lib/motion';

export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const lenisRef = useSmoothScroll(true);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const sync = () => setLenis(lenisRef.current);
    sync();
    const id = window.setTimeout(sync, 0);
    return () => window.clearTimeout(id);
  }, [lenisRef]);

  const scrollTo = useCallback(
    (target: string | number | HTMLElement, offset = -72) => {
      const instance = lenisRef.current;
      if (instance) {
        instance.scrollTo(target, { offset, duration: 1.4 });
        return;
      }
      const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior });
        return;
      }
      const element = typeof target === 'string' ? document.querySelector(target) : target;
      if (element instanceof HTMLElement) {
        const top = element.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior });
      }
    },
    [lenisRef],
  );

  const stop = useCallback(() => {
    lenisRef.current?.stop();
    document.documentElement.classList.add('overflow-hidden');
  }, [lenisRef]);

  const start = useCallback(() => {
    lenisRef.current?.start();
    document.documentElement.classList.remove('overflow-hidden');
  }, [lenisRef]);

  return (
    <ScrollContext.Provider value={{ lenis, scrollTo, stop, start }}>
      {children}
    </ScrollContext.Provider>
  );
};
