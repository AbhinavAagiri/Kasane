import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { canUseWebGL, isConstrainedDevice } from '@/lib/webgl';

const LayersScene = lazy(() => import('@/components/three/LayersScene'));

const StackFallback = () => (
  <div
    className="absolute inset-0 grid place-items-center [perspective:900px]"
    aria-hidden="true"
  >
    <div className="relative h-[13rem] w-[13rem] [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-36deg)] sm:h-[15rem] sm:w-[15rem]">
      {[0, 1, 2, 3].map((layer) => (
        <div
          key={layer}
          className="absolute inset-0 rounded-[2rem] border border-ink/30 bg-cream/55 shadow-[0_18px_45px_-34px_rgba(16,18,15,0.55)]"
          style={{
            transform: `translateZ(${layer * 22}px) scale(${1 - layer * 0.035})`,
            opacity: 0.9 - layer * 0.08,
          }}
        >
          <div className="absolute inset-[18%] rounded-full border border-olive/35" />
          <div className="absolute inset-[34%] rounded-full border border-olive/25" />
          {layer === 0 ? (
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/70" />
          ) : null}
        </div>
      ))}
    </div>
  </div>
);

export const LayersMoment = () => {
  const host = useRef<HTMLDivElement>(null);
  const [supported] = useState(() => canUseWebGL() && !isConstrainedDevice());
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = host.current;
    if (!node || !supported) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [supported]);

  return (
    <figure>
      <div
        ref={host}
        className="relative aspect-[5/4] overflow-hidden border border-ink/12 bg-[radial-gradient(circle_at_50%_42%,#f7f3e9_0%,#ede8dd_58%,#e3ddd1_100%)]"
      >
        {supported && inView ? (
          <Suspense fallback={<StackFallback />}>
            <LayersScene />
          </Suspense>
        ) : (
          <StackFallback />
        )}

        <div className="pointer-events-none absolute left-5 top-5 flex items-center gap-2 text-[0.6875rem] text-ink/40">
          <span className="h-px w-5 bg-ink/25" aria-hidden="true" />
          Object study, 01
        </div>
        <div className="pointer-events-none absolute bottom-5 left-5 text-[0.6875rem] text-ink/40">
          Five layers, one place
        </div>
      </div>
      <figcaption className="mt-3 flex items-start justify-between gap-6 text-[0.75rem] text-ink/45">
        <span>
          A place is a stack, not a surface. The model is deliberately incomplete.
        </span>
        <span className="hidden shrink-0 text-ink/30 sm:inline">A study in layers</span>
      </figcaption>
    </figure>
  );
};
