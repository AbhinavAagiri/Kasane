import { useEffect, useMemo, useState, type CSSProperties, type MutableRefObject } from 'react';
import { Canvas, events as createPointerEvents } from '@react-three/fiber';
import * as THREE from 'three';
import { GlobeStill } from '@/components/globe/GlobeStill';
import GlobeScene from '@/components/globe/GlobeScene';
import { loadGlobeData, type GlobeData } from '@/components/globe/globeData';
import { CANVAS_OVERSCAN, overscanFov } from '@/components/globe/globeView';
import type { JourneyScene } from '@/components/globe/worldScenes';

type GlobeCanvasProps = {
  scene: JourneyScene;
  interactive: boolean;
  inView: boolean;
  visibleSlugs: string[];
  selectedSlug: string | null;
  hoveredSlug: string | null;
  resetSignal?: number;
  scrollProgress: MutableRefObject<number>;
  onSelect: (slug: string) => void;
  onHover: (slug: string | null) => void;
  onReady?: () => void;
};

// The pointer target is the original square stage, not the overscanned
// canvas. R3F still needs coordinates relative to the full drawing buffer,
// so its pointer math is overridden to use the canvas itself.
const createStagePointerEvents = (store: Parameters<typeof createPointerEvents>[0]) => {
  const manager = createPointerEvents(store);
  manager.compute = (event, state) => {
    const rect = state.gl.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    state.pointer.set(x, y);
    state.raycaster.setFromCamera(state.pointer, state.camera);
  };
  return manager;
};

const supportsWebGL = () => {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
        canvas.getContext('webgl'),
    );
  } catch {
    return false;
  }
};

export const GlobeCanvas = ({
  scene,
  interactive,
  inView,
  visibleSlugs,
  selectedSlug,
  hoveredSlug,
  resetSignal,
  scrollProgress,
  onSelect,
  onHover,
  onReady,
}: GlobeCanvasProps) => {
  const [data, setData] = useState<GlobeData | null>(null);
  const [failed, setFailed] = useState(false);
  const webgl = useMemo(() => supportsWebGL(), []);
  const [hitElement, setHitElement] = useState<HTMLDivElement | null>(null);
  const distanceScale = useMemo(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
        ? 1.22
        : 1,
    [],
  );
  const quality = useMemo(() => {
    if (typeof window === 'undefined') return 'low' as const;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const narrow = window.matchMedia('(max-width: 767px)').matches;
    return !narrow && memory >= 4 ? ('high' as const) : ('low' as const);
  }, []);

  useEffect(() => {
    if (!webgl) return;
    let live = true;
    loadGlobeData()
      .then((result) => {
        if (!live) return;
        setData(result);
        onReady?.();
      })
      .catch(() => {
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, [onReady, webgl]);

  if (!webgl || failed) return <GlobeStill />;
  if (!data) {
    return (
      <div className="relative h-full w-full">
        <GlobeStill />
        <span className="globe-loading" role="status">
          Drawing the atlas
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        className="globe-canvas"
        style={{ '--globe-overscan': CANVAS_OVERSCAN } as CSSProperties}
        data-hovered={interactive && Boolean(hoveredSlug)}
        aria-hidden="true"
      >
        <Canvas
          dpr={[1, quality === 'high' ? 1.5 : 1.25]}
          frameloop={inView ? 'always' : 'never'}
          camera={{
            position: [0, 0, scene.distance * distanceScale],
            fov: overscanFov(38),
            near: 0.1,
            far: 30,
          }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          events={createStagePointerEvents}
          eventSource={hitElement ?? undefined}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.02;
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
          onPointerMissed={() => onSelect('')}
        >
          <GlobeScene
            data={data}
            scene={scene}
            interactive={interactive}
            inView={inView}
            visibleSlugs={visibleSlugs}
            selectedSlug={selectedSlug}
            hoveredSlug={hoveredSlug}
            resetSignal={resetSignal}
            scrollProgress={scrollProgress}
            quality={quality}
            distanceScale={distanceScale}
            eventsElement={hitElement}
            onSelect={onSelect}
            onHover={onHover}
          />
        </Canvas>
      </div>
      <div
        className="globe-hit"
        ref={setHitElement}
        data-hovered={interactive && Boolean(hoveredSlug)}
        aria-hidden="true"
      />
    </>
  );
};

export default GlobeCanvas;
