import { lazy, Suspense } from 'react';
import { cn } from '@/lib/utils';
import type { MapPoint } from '@/components/map/AtlasMap';

const AtlasMap = lazy(() =>
  import('@/components/map/AtlasMap').then((module) => ({ default: module.AtlasMap })),
);

type AtlasMapLazyProps = {
  points: MapPoint[];
  className?: string;
  activeId?: string | null;
  onActiveChange?: (id: string) => void;
  fit?: boolean;
  follow?: boolean;
  initialZoom?: number;
  center?: [number, number];
  label: string;
};

export const AtlasMapLazy = ({ className, label, ...props }: AtlasMapLazyProps) => {
  // MapLibre is browser-only. Keep the prerendered document complete without
  // suspending the whole route; the live map mounts immediately on the client.
  if (typeof window === 'undefined') {
    return (
      <div
        className={cn(
          'flex items-center justify-center border border-ink/10 bg-paper text-[0.75rem] uppercase tracking-[0.1em] text-ink/45',
          className,
        )}
        role="img"
        aria-label={`${label}. The interactive map is available with JavaScript.`}
      >
        Drawing the atlas
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          className={cn(
            'flex items-center justify-center border border-ink/10 bg-paper text-[0.75rem] uppercase tracking-[0.1em] text-ink/45',
            className,
          )}
          aria-hidden="true"
        >
          Drawing the atlas
        </div>
      }
    >
      <AtlasMap {...props} className={className} label={label} />
    </Suspense>
  );
};
