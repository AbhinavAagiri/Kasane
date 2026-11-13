import { useEffect, useRef, type ReactNode } from 'react';
import { getGsap } from '@/lib/motion';
import { hasFinePointer } from '@/lib/webgl';
import { cn } from '@/lib/utils';

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** Fraction of the pointer offset applied to the element. */
  strength?: number;
};

/**
 * A restrained magnetic wrapper for primary calls to action, in the spirit of
 * the magnetic-button pattern on 21st.dev, re-implemented with GSAP so the
 * project keeps a single animation library. Pointer-only; keyboard focus and
 * layout are untouched.
 */
export const Magnetic = ({ children, className, strength = 0.22 }: MagneticProps) => {
  const host = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    if (!hasFinePointer()) return;

    const { gsap } = getGsap();
    const xTo = gsap.quickTo(element, 'x', { duration: 0.55, ease: 'power3.out' });
    const yTo = gsap.quickTo(element, 'y', { duration: 0.55, ease: 'power3.out' });
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const limit = Math.min(18, rect.width * 0.05);
        const offsetX = (event.clientX - (rect.left + rect.width / 2)) * strength;
        const offsetY = (event.clientY - (rect.top + rect.height / 2)) * strength;
        xTo(gsap.utils.clamp(-limit, limit, offsetX));
        yTo(gsap.utils.clamp(-limit * 0.7, limit * 0.7, offsetY));
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      xTo(0);
      yTo(0);
    };

    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(element);
      gsap.set(element, { x: 0, y: 0 });
    };
  }, [strength]);

  return (
    <span ref={host} className={cn('inline-block will-change-transform', className)}>
      {children}
    </span>
  );
};
