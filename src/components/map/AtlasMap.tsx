import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { LngLatBoundsLike, Map as MapLibreMap, Marker } from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@/lib/utils';
import type { Coordinates } from '@/data/types';

export type MapPoint = {
  id: string;
  name: string;
  subtitle?: string;
  coordinates: Coordinates;
  href?: string;
  kind?: 'destination' | 'place';
};

type AtlasMapProps = {
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

const STYLE_URL = '/map/kasane-style.json';
const ATTRIBUTION = 'OpenStreetMap contributors · OpenFreeMap';

// Vite pre-bundles the main MapLibre module for development, which breaks the
// relative worker URL MapLibre resolves on its own. Point it at the bundled
// worker explicitly so both dev and the production build load a real module.
maplibregl.setWorkerUrl(maplibreWorkerUrl);

const popupNode = (point: MapPoint) => {
  const wrap = document.createElement('div');
  const label = document.createElement('span');
  label.textContent = point.kind === 'place' ? 'In the atlas' : 'Destination';
  label.style.cssText =
    'display:block;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#7a7c6d;margin-bottom:3px';
  wrap.appendChild(label);

  const title = document.createElement('strong');
  title.textContent = point.name;
  title.style.cssText = 'font-family:Newsreader,serif;font-size:19px;font-weight:400;display:block;line-height:1.1;color:#24251f';
  wrap.appendChild(title);

  if (point.subtitle) {
    const subtitle = document.createElement('span');
    subtitle.textContent = point.subtitle;
    subtitle.style.cssText = 'display:block;margin-top:4px;font-size:12px;line-height:1.45;color:#5f6257;max-width:210px';
    wrap.appendChild(subtitle);
  }
  if (point.href) {
    const link = document.createElement('a');
    link.href = point.href;
    link.textContent = 'Open field guide →';
    link.style.cssText =
      'display:inline-block;margin-top:8px;font-size:11px;text-decoration:underline;text-underline-offset:3px;color:#24251f';
    wrap.appendChild(link);
  }
  return wrap;
};

const boundsOf = (points: MapPoint[]): LngLatBoundsLike => {
  const bounds = new maplibregl.LngLatBounds();
  points.forEach((point) => bounds.extend([point.coordinates.lng, point.coordinates.lat]));
  return bounds;
};

export const AtlasMap = ({
  points,
  className,
  activeId,
  onActiveChange,
  fit = true,
  follow = false,
  initialZoom = 2,
  center = [30, 8],
  label,
}: AtlasMapProps) => {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markers = useRef(new Map<string, Marker>());
  const callbacks = useRef({ onActiveChange });
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    callbacks.current.onActiveChange = onActiveChange;
  }, [onActiveChange]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;

    let map: MapLibreMap;
    try {
      map = new maplibregl.Map({
        container: element,
        style: STYLE_URL,
        center: [center[1], center[0]],
        zoom: initialZoom,
        minZoom: -2,
        maxZoom: 15,
        attributionControl: false,
        scrollZoom: false,
        dragRotate: false,
        pitchWithRotate: false,
        renderWorldCopies: true,
      });
    } catch {
      // The constructor failed before a map existed to clean up. Let the effect
      // settle before switching to the static fallback.
      queueMicrotask(() => setFailed(true));
      return;
    }

    mapRef.current = map;
    map.addControl(
      new maplibregl.AttributionControl({ compact: true, customAttribution: ATTRIBUTION }),
      'bottom-right',
    );
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    let loaded = false;
    let sourceFailures = 0;
    const watchdog = window.setTimeout(() => {
      if (!loaded) setFailed(true);
    }, 20_000);

    // MapLibre paints on requestAnimationFrame. In a hidden tab the browser
    // suspends those frames, so the first paint never completes and the map
    // sits behind the loading card forever. While hidden, force a synchronous
    // redraw until the style has loaded; visible tabs use the normal loop.
    let kickTimer = 0;
    let kickCount = 0;
    const scheduleKick = () => {
      window.clearTimeout(kickTimer);
      const tick = () => {
        if (loaded || kickCount >= 60) return;
        kickCount += 1;
        try {
          map.resize();
          map.redraw();
        } catch {
          // A half-built map can refuse a redraw; the next tick will retry.
        }
        kickTimer = window.setTimeout(tick, 300);
      };
      kickTimer = window.setTimeout(tick, 300);
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        window.clearTimeout(kickTimer);
        map.resize();
        map.redraw();
      } else if (!loaded) {
        scheduleKick();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (document.visibilityState === 'hidden') scheduleKick();

    map.on('error', (event) => {
      const sourceId = (event as { sourceId?: string }).sourceId;
      if (!sourceId) {
        console.error('[AtlasMap] MapLibre error', event.error ?? event);
        const message = event.error instanceof Error ? event.error.message : '';
        if (/worker failed to load|failed to initialize webgl|could not load style/i.test(message)) {
          setFailed(true);
        }
        return;
      }
      sourceFailures += 1;
      if (sourceFailures >= 3) setFailed(true);
    });
    map.on('load', () => {
      loaded = true;
      window.clearTimeout(watchdog);
      window.clearTimeout(kickTimer);
      setReady(true);
      map.resize();
    });

    const resize = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      map.resize();
    });
    resize.observe(element);

    return () => {
      window.clearTimeout(watchdog);
      window.clearTimeout(kickTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      resize.disconnect();
      markers.current.clear();
      map.remove();
      mapRef.current = null;
    };
    // The map instance is independent of data updates; effect below handles points.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const registry = markers.current;

    registry.forEach((marker) => marker.remove());
    registry.clear();

    points.forEach((point) => {
      const node = document.createElement('button');
      node.type = 'button';
      node.className = 'kasane-marker';
      node.dataset.kind = point.kind ?? 'destination';
      node.setAttribute('aria-label', `${point.name}${point.subtitle ? ` — ${point.subtitle}` : ''}`);
      node.addEventListener('click', (event) => {
        // Keep the opening click from bubbling to MapLibre's map-level handler,
        // which would immediately close the popup because closeOnClick is on.
        event.stopPropagation();
        callbacks.current.onActiveChange?.(point.id);
        new maplibregl.Popup({
          offset: 16,
          closeButton: true,
          className: 'kasane-popup',
          maxWidth: '250px',
        })
          .setLngLat([point.coordinates.lng, point.coordinates.lat])
          .setDOMContent(popupNode(point))
          .addTo(map);
      });

      const marker = new maplibregl.Marker({ element: node, anchor: 'center' })
        .setLngLat([point.coordinates.lng, point.coordinates.lat])
        .addTo(map);
      registry.set(point.id, marker);
    });

    if (!fit || !points.length) return;
    if (points.length === 1) {
      const point = points[0];
      if (point) {
        map.easeTo({
          center: [point.coordinates.lng, point.coordinates.lat],
          zoom: Math.max(5, Math.min(12, initialZoom)),
          duration: 0,
        });
      }
      return;
    }
    map.fitBounds(boundsOf(points), { padding: 58, maxZoom: 12, duration: 0 });
  }, [points, fit, initialZoom]);

  useEffect(() => {
    markers.current.forEach((marker, id) => {
      marker.getElement().dataset.active = String(id === activeId);
    });
    if (!follow || !activeId) return;
    const point = points.find((entry) => entry.id === activeId);
    if (point && mapRef.current) {
      const map = mapRef.current;
      map.easeTo({
        center: [point.coordinates.lng, point.coordinates.lat],
        zoom: Math.max(map.getZoom(), 4.5),
        duration: 700,
        essential: false,
      });
    }
  }, [activeId, follow, points]);

  // Equirectangular fallback, preserving the 2:1 aspect of the generated SVG.
  const mapWidth = Math.max(size.width, size.height * 2);
  const mapHeight = mapWidth / 2;
  const offsetX = (size.width - mapWidth) / 2;
  const offsetY = (size.height - mapHeight) / 2;

  return (
    <div className={cn('atlas-map relative', className)}>
      <div ref={container} className="h-full w-full" role="application" aria-label={label} />
      {!ready && !failed ? <div className="map-loading">Drawing the atlas</div> : null}
      {failed ? (
        <div className="atlas-map-fallback" role="img" aria-label={`${label}. Basemap unavailable; static world map shown.`}>
          <div
            className="absolute"
            style={{
              width: mapWidth,
              height: mapHeight,
              left: offsetX,
              top: offsetY,
            }}
          >
            <img
              src="/map/world.svg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
            />
            {points.map((point) => {
              const x = ((point.coordinates.lng + 180) / 360) * mapWidth;
              const y = ((90 - point.coordinates.lat) / 180) * mapHeight;
              return (
                <button
                  key={point.id}
                  type="button"
                  className="fallback-marker"
                  data-active={point.id === activeId}
                  style={{ left: x, top: y }}
                  aria-label={point.name}
                  onClick={() => onActiveChange?.(point.id)}
                />
              );
            })}
          </div>
          <div className="absolute inset-x-4 bottom-9 z-[4] border border-ink/12 bg-cream/95 px-4 py-2.5 text-[0.75rem] leading-relaxed text-ink/60">
            Live tiles are unavailable. Showing the printed fallback map — all places remain listed
            beside it.
          </div>
        </div>
      ) : null}
    </div>
  );
};
