import { destinationBySlug } from '@/data/destinations';
import { eventBySlug } from '@/data/events';

export type JourneyFilmSide = 'left' | 'right';

export type JourneyScene = {
  id: string;
  index: string;
  kicker: string;
  title: string;
  body: string;
  /** A shorter, complete edition of the copy for the mobile choreography. */
  mobileBody?: string;
  focus: { lat: number; lng: number };
  distance: number;
  markerSlugs: string[];
  destinations?: string[];
  events?: string[];
  links?: Array<{ label: string; to: string }>;
  /** A verified hero-library clip presented as this chapter's editorial film. */
  filmId?: string;
  filmSide?: JourneyFilmSide;
  layers?: string[];
  interactive?: boolean;
};

export const journeyScenes: JourneyScene[] = [
  {
    id: 'world',
    index: '01',
    kicker: 'An atlas of living culture',
    title: 'See the world in layers.',
    body: 'A field guide to the places, cultures and landscapes that make a world — and a quieter way to move through it.',
    mobileBody: 'A field guide to the places, cultures and landscapes that make a world.',
    focus: { lat: 18, lng: 20 },
    distance: 3.55,
    markerSlugs: [],
  },
  {
    id: 'japan',
    index: '02',
    kicker: 'Japan · Kyoto',
    title: 'Ancient, and still becoming.',
    body: 'Where ancient traditions meet an ever-changing present. In Kyoto, that conversation is in the grain of the wood, the edge of a garden, the counter behind a curtain.',
    mobileBody: 'Ancient traditions, an ever-changing present: Kyoto keeps both in the grain of the wood and the edge of a garden.',
    focus: { lat: 36, lng: 138 },
    distance: 3.7,
    markerSlugs: ['kyoto'],
    destinations: ['kyoto'],
    filmId: 'kyoto',
    filmSide: 'right',
  },
  {
    id: 'india',
    index: '03',
    kicker: 'India · Jaipur',
    title: 'No single image.',
    body: 'A world of contrasts, where architecture, history, belief and everyday life exist in layers. Jaipur is a planned city that still feels found: courtyards, bazaars and rooftops holding the desert light.',
    mobileBody: 'Architecture, history, belief and everyday life exist in layers. Jaipur holds them in courtyards, bazaars and desert light.',
    focus: { lat: 24, lng: 78 },
    distance: 3.7,
    markerSlugs: ['jaipur'],
    destinations: ['jaipur'],
    filmId: 'rajasthan',
    filmSide: 'left',
  },
  {
    id: 'europe',
    index: '04',
    kicker: 'Europe',
    title: 'One continent, many grammars.',
    body: 'From the Mediterranean to the Alps, Europe is a set of local arguments about how to live — in stone, at the table, in the square, in the light.',
    mobileBody: 'From the Mediterranean to the Alps, Europe is a set of local arguments about how to live.',
    focus: { lat: 46, lng: 10 },
    distance: 3.75,
    markerSlugs: [
      'florence',
      'barcelona',
      'paris',
      'lucerne',
      'lisbon',
      'matera',
      'ghent',
      'valletta',
    ],
    destinations: ['florence', 'barcelona', 'paris', 'lucerne'],
    filmId: 'italy',
    filmSide: 'right',
  },
  {
    id: 'nature',
    index: '05',
    kicker: 'Nature & landscape',
    title: 'Landscape sets the tempo.',
    body: 'Coastlines, mountains and weather set the pace. Landscape is not scenery here; it is the schedule the day is built around.',
    mobileBody: 'Coastlines, mountains and weather set the pace; landscape is the schedule a day is built around.',
    focus: { lat: 25, lng: -18 },
    distance: 3.7,
    markerSlugs: ['reykjavik', 'lucerne', 'valletta', 'essaouira', 'matera'],
    destinations: ['reykjavik', 'lucerne', 'essaouira'],
    filmId: 'iceland',
    filmSide: 'left',
  },
  {
    id: 'layers',
    index: '06',
    kicker: 'The world of KASANE',
    title: 'The world is more than a list.',
    body: 'KASANE reads a place through the things that hold it together: the architecture, the culture, the history, the landscape, the table and the calendar.',
    mobileBody: 'KASANE reads a place through architecture, culture, history, nature, food and the calendar.',
    focus: { lat: 24, lng: 24 },
    distance: 3.85,
    markerSlugs: [
      'kyoto',
      'jaipur',
      'barcelona',
      'florence',
      'reykjavik',
      'new-york',
      'lucerne',
      'lisbon',
      'matera',
      'ghent',
      'valletta',
      'essaouira',
      'paris',
      'seoul',
    ],
    layers: ['Places', 'Culture', 'History', 'Nature', 'Architecture', 'Food', 'Events', 'Experiences'],
    links: [
      { label: 'Explore the atlas', to: '/explore' },
      { label: 'Open collections', to: '/collections' },
      { label: 'Plan a journey', to: '/plan' },
    ],
  },
  {
    id: 'interactive',
    index: '07',
    kicker: 'The atlas is yours',
    title: 'The atlas is yours.',
    body: 'Rotate the globe. Follow a place into its field guide. Leave room for the unplanned afternoon.',
    mobileBody: 'Rotate the globe, then follow a place into its field guide.',
    focus: { lat: 18, lng: 10 },
    distance: 3.9,
    markerSlugs: [
      'kyoto',
      'jaipur',
      'barcelona',
      'florence',
      'reykjavik',
      'new-york',
      'lucerne',
      'lisbon',
      'matera',
      'ghent',
      'valletta',
      'essaouira',
      'paris',
      'seoul',
    ],
    interactive: true,
  },
];

export const sceneDestinations = (scene: JourneyScene) =>
  (scene.destinations ?? [])
    .map((slug) => destinationBySlug[slug])
    .filter((destination): destination is NonNullable<typeof destination> => Boolean(destination));

export const sceneEvents = (scene: JourneyScene) =>
  (scene.events ?? [])
    .map((slug) => eventBySlug[slug])
    .filter((event): event is NonNullable<typeof event> => Boolean(event));

export type GlobeMotionKeyframe = {
  /** Normalised progress through the pinned journey. */
  at: number;
  lat: number;
  lng: number;
  distance: number;
  fov: number;
  cameraX: number;
  cameraY: number;
  tilt: number;
  roll: number;
  scale: number;
  atmosphere: number;
  light: number;
  spin: number;
};

/**
 * The globe's independent motion track. The DOM foreground has its own GSAP
 * timeline; this track is read by React Three Fiber from the same progress
 * ref, so both layers stay on one clock without a second scroll listener.
 */
export const globeMotionKeyframes: GlobeMotionKeyframe[] = [
  { at: 0, lat: 18, lng: 20, distance: 3.55, fov: 38, cameraX: 0, cameraY: 0, tilt: 0, roll: 0, scale: 1, atmosphere: 1, light: 1, spin: 0 },
  { at: 0.15, lat: 36, lng: 138, distance: 3.25, fov: 36, cameraX: -0.18, cameraY: 0.08, tilt: -0.08, roll: 0.02, scale: 1.04, atmosphere: 1, light: 1.05, spin: 0.08 },
  { at: 0.3, lat: 24, lng: 78, distance: 3.05, fov: 40, cameraX: 0.16, cameraY: -0.04, tilt: 0.06, roll: -0.02, scale: 1.06, atmosphere: 1.15, light: 0.95, spin: 0.18 },
  { at: 0.45, lat: 46, lng: 10, distance: 3.4, fov: 37, cameraX: 0.2, cameraY: 0.05, tilt: -0.05, roll: 0.03, scale: 1, atmosphere: 0.9, light: 1.1, spin: 0.3 },
  { at: 0.6, lat: 25, lng: -18, distance: 3, fov: 42, cameraX: -0.12, cameraY: -0.05, tilt: 0.1, roll: -0.02, scale: 1.08, atmosphere: 1.2, light: 0.9, spin: 0.4 },
  { at: 0.78, lat: 24, lng: 24, distance: 3.35, fov: 37, cameraX: 0, cameraY: 0, tilt: 0, roll: 0, scale: 1.02, atmosphere: 1, light: 1, spin: 0.5 },
  { at: 0.9, lat: 18, lng: 10, distance: 3.9, fov: 38, cameraX: 0, cameraY: 0, tilt: 0, roll: 0, scale: 1, atmosphere: 0.85, light: 1.1, spin: 0.55 },
  { at: 1, lat: 18, lng: 10, distance: 3.9, fov: 38, cameraX: 0, cameraY: 0, tilt: 0, roll: 0, scale: 1, atmosphere: 0.85, light: 1.1, spin: 0.55 },
];

const smoothstep = (value: number) => value * value * (3 - 2 * value);

/** Continuous interpolation keeps the globe from snapping at chapter labels. */
export const globeMotionAt = (progress: number): GlobeMotionKeyframe => {
  const clamped = Math.min(1, Math.max(0, progress));
  const frames = globeMotionKeyframes;
  let index = 0;
  while (index < frames.length - 1 && clamped > frames[index + 1]!.at) index += 1;
  const from = frames[index] ?? frames[0]!;
  const to = frames[Math.min(index + 1, frames.length - 1)] ?? from;
  if (from === to) return { ...from };
  const span = Math.max(0.0001, to.at - from.at);
  const t = smoothstep(Math.min(1, Math.max(0, (clamped - from.at) / span)));
  return {
    at: clamped,
    lat: from.lat + (to.lat - from.lat) * t,
    lng: from.lng + (to.lng - from.lng) * t,
    distance: from.distance + (to.distance - from.distance) * t,
    fov: from.fov + (to.fov - from.fov) * t,
    cameraX: from.cameraX + (to.cameraX - from.cameraX) * t,
    cameraY: from.cameraY + (to.cameraY - from.cameraY) * t,
    tilt: from.tilt + (to.tilt - from.tilt) * t,
    roll: from.roll + (to.roll - from.roll) * t,
    scale: from.scale + (to.scale - from.scale) * t,
    atmosphere: from.atmosphere + (to.atmosphere - from.atmosphere) * t,
    light: from.light + (to.light - from.light) * t,
    spin: from.spin + (to.spin - from.spin) * t,
  };
};
