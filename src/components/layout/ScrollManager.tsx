import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollApi } from '@/hooks/useScrollApi';
import { getGsap } from '@/lib/motion';

export const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  const { scrollTo } = useScrollApi();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      let attempts = 0;
      const tryScroll = () => {
        const target = document.getElementById(id);
        if (target) {
          scrollTo(target, -64);
          return;
        }
        attempts += 1;
        if (attempts < 20) window.setTimeout(tryScroll, 50);
      };
      window.requestAnimationFrame(tryScroll);
      return;
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
    const frame = window.requestAnimationFrame(() => {
      getGsap().ScrollTrigger.refresh();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, scrollTo]);

  return null;
};
