import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { destinationBySlug, destinations } from '@/data/destinations';
import { upcomingEvents } from '@/data/events';
import { heroClips, type HeroClip } from '@/data/hero';
import type { Destination, InterestId } from '@/data/types';
import { useScrollApi } from '@/hooks/useScrollApi';
import { getGsap, prefersReducedMotion } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { GlobeStill } from '@/components/globe/GlobeStill';
import { JourneyFilm } from '@/components/globe/JourneyFilm';
import { SmartImage } from '@/components/media/SmartImage';
import { WordReveal } from '@/components/motion/WordReveal';
import { WorldExplore, type GlobeFilter } from '@/components/globe/WorldExplore';
import { journeyScenes, type JourneyScene } from '@/components/globe/worldScenes';

const LazyGlobeCanvas = lazy(() => import('@/components/globe/GlobeCanvas'));

const eventsByDestination = upcomingEvents.reduce<Map<string, typeof upcomingEvents>>(
  (map, event) => {
    const list = map.get(event.destinationSlug) ?? [];
    list.push(event);
    map.set(event.destinationSlug, list);
    return map;
  },
  new Map(),
);

const eventDestinationSlugs = new Set(eventsByDestination.keys());
const filmById = new Map(heroClips.map((clip) => [clip.id, clip]));
const journeyFilms = ['kyoto', 'rajasthan', 'italy', 'iceland']
  .map((id) => filmById.get(id))
  .filter((clip): clip is HeroClip => Boolean(clip));

const normalise = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const formatCoordinate = (lat: number, lng: number) =>
  `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'} · ${Math.abs(lng).toFixed(1)}°${
    lng >= 0 ? 'E' : 'W'
  }`;

const sceneFilm = (scene: JourneyScene) => (scene.filmId ? filmById.get(scene.filmId) : undefined);

const MaskedLine = ({
  children,
  className,
  dataAnim,
}: {
  children: ReactNode;
  className?: string;
  dataAnim: string;
}) => (
  <span className={cn('line-mask', className)}>
    <span className="line-inner" data-anim={dataAnim}>
      {children}
    </span>
  </span>
);

const ScenePanel = ({
  id,
  active,
  className,
  children,
}: {
  id: string;
  active: boolean;
  className?: string;
  children: ReactNode;
}) => (
  <section
    className={cn('scene-panel', `scene-panel--${id}`, className)}
    data-scene-panel={id}
    aria-hidden={!active}
    inert={!active ? true : undefined}
  >
    {children}
  </section>
);

const ChapterRail = ({ active, onJump }: { active: number; onJump: (index: number) => void }) => (
  <nav className="world-rail" aria-label="Journey chapters">
    <span className="world-rail__line" aria-hidden="true">
      <span style={{ transform: `scaleY(${(active + 1) / journeyScenes.length})` }} />
    </span>
    {journeyScenes.map((scene, index) => (
      <button
        key={scene.id}
        type="button"
        onClick={() => onJump(index)}
        className={cn('world-rail__button', active === index && 'is-active')}
        aria-label={`Chapter ${scene.index}: ${scene.kicker}`}
        aria-current={active === index ? 'true' : undefined}
      >
        <span>{scene.index}</span>
        <span className="world-rail__label">{scene.kicker}</span>
      </button>
    ))}
  </nav>
);

const WorldCoda = () => (
  <div className="world-coda">
    <div className="shell world-coda__inner">
      <div className="world-coda__head">
        <p className="kicker text-ivory/45">Afterword · Vol. II</p>
        <Link to="/explore" className="link-quiet text-ivory/70">
          Open the full atlas
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>
      <WordReveal
        text="The world is not a backdrop. It is the story."
        className="world-coda__word display-lg"
      />
      <p className="world-coda__note">
        KASANE is an independent editorial atlas: {destinations.length} places, their layers, and
        the dates that change them. No rankings, no endless feed. Just enough to make you look
        twice.
      </p>
    </div>
  </div>
);

export const GlobeJourney = () => {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progressFill = useRef<HTMLSpanElement>(null);
  const progressRef = useRef(0);
  const triggerRange = useRef<{ start: number; end: number } | null>(null);
  const lastScene = useRef(-1);
  const interactiveRef = useRef(false);
  const { lenis } = useScrollApi();
  const lenisRef = useRef(lenis);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [interactive, setInteractive] = useState(false);
  const [inView, setInView] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [filter, setFilter] = useState<GlobeFilter>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const byFilter: Destination[] =
      filter === 'all'
        ? destinations
        : filter === 'events'
          ? destinations.filter((destination) => eventDestinationSlugs.has(destination.slug))
          : destinations.filter((destination) => destination.interests.includes(filter as InterestId));
    const search = normalise(query.trim());
    if (!search) return byFilter;
    return byFilter.filter((destination) =>
      normalise(`${destination.name} ${destination.country} ${destination.region}`).includes(search),
    );
  }, [filter, query]);

  const selected = selectedSlug ? destinationBySlug[selectedSlug] ?? null : null;
  const scene = journeyScenes[sceneIndex] ?? journeyScenes[0]!;
  const layersScene = journeyScenes.find((journeyScene) => journeyScene.id === 'layers');
  const activeFilm = interactive ? undefined : sceneFilm(scene);
  const italyFilm = filmById.get('italy');
  const visibleSlugs = useMemo(
    () => (interactive ? filtered.map((destination) => destination.slug) : scene.markerSlugs),
    [filtered, interactive, scene.markerSlugs],
  );

  const applyFilter = (next: GlobeFilter) => {
    setFilter(next);
    setSelectedSlug(null);
  };

  const applyQuery = (next: string) => {
    setQuery(next);
    setSelectedSlug(null);
  };

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) document.documentElement.dataset.surface = 'dark';
        else if (document.documentElement.dataset.surface === 'dark') {
          delete document.documentElement.dataset.surface;
        }
      },
      { threshold: 0.04 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      if (document.documentElement.dataset.surface === 'dark') {
        delete document.documentElement.dataset.surface;
      }
    };
  }, []);

  // The background and foreground share this one scrubbed timeline. The globe
  // reads progressRef every frame; the DOM is choreographed by GSAP.
  useLayoutEffect(() => {
    const stageEl = stage.current;
    if (!stageEl) return;
    const { gsap, ScrollTrigger } = getGsap();
    const media = stageEl.querySelector<HTMLElement>('.world-media');
    if (!media) return;

    const $ = <T extends Element>(selector: string) => stageEl.querySelector<T>(selector);
    const $$ = <T extends Element>(selector: string) =>
      Array.from(stageEl.querySelectorAll<T>(selector));

    const buildTimeline = (mobile: boolean) => {
      const reducedMotion = prefersReducedMotion();
      // The media stage is a fixed square. The R3F drawing buffer therefore
      // never changes aspect ratio while the journey is scrolling. Every
      // scene change only moves the square and applies a *uniform* scale, so
      // no parent, canvas or sphere can be stretched on either axis.
      const stageSide = media.offsetHeight || window.innerHeight * 1.04;
      const scaleFor = (heightVh: number) =>
        (window.innerHeight * heightVh) / 100 / stageSide;
      const shortLandscape = mobile && window.innerHeight < 500;
      const states = mobile
        ? {
            world: { left: '50%', top: '39%', scale: scaleFor(56) },
            japan: { left: '50%', top: '34%', scale: scaleFor(46) },
            india: { left: '50%', top: '38%', scale: scaleFor(64) },
            europe: { left: '50%', top: '34%', scale: scaleFor(52) },
            nature: { left: '50%', top: '36%', scale: scaleFor(70) },
            layers: { left: '50%', top: '36%', scale: scaleFor(58) },
            // Keep the final globe centred and fully inside narrow screens. The
            // explore sheet occupies the lower half, so leave a clear stage
            // above it for dragging and selecting markers. In short landscape
            // the sheet moves left, so the globe takes the right column.
            interactive: shortLandscape
              ? {
                  left: '65%',
                  top: '12%',
                  scale: Math.min(scaleFor(70), (window.innerWidth * 0.38) / stageSide),
                }
              : {
                  left: '50%',
                  top: '14%',
                  scale: Math.min(scaleFor(34), (window.innerWidth - 32) / stageSide),
                },
          }
        : {
            world: { left: '52%', top: '50%', scale: scaleFor(90) },
            japan: { left: '63%', top: '46%', scale: scaleFor(80) },
            india: { left: '48%', top: '44%', scale: scaleFor(100) },
            europe: { left: '34%', top: '48%', scale: scaleFor(84) },
            nature: { left: '52%', top: '48%', scale: scaleFor(104) },
            layers: { left: '34%', top: '48%', scale: scaleFor(92) },
            interactive: { left: '66%', top: '50%', scale: scaleFor(92) },
          };

      const panels = {
        world: $('[data-scene-panel="world"]'),
        japan: $('[data-scene-panel="japan"]'),
        india: $('[data-scene-panel="india"]'),
        europe: $('[data-scene-panel="europe"]'),
        nature: $('[data-scene-panel="nature"]'),
        layers: $('[data-scene-panel="layers"]'),
        interactive: $('[data-scene-panel="interactive"]'),
      };
      const films = {
        kyoto: $('[data-film="kyoto"]'),
        rajasthan: $('[data-film="rajasthan"]'),
        italy: $('[data-film="italy"]'),
        iceland: $('[data-film="iceland"]'),
      };
      const explore = $('.world-explore-shell');
      const rules = $$('[data-line]');
      const imageCards = $$<HTMLElement>('figure');

      // Full-bleed films fade across the whole viewport, so a partial fade
      // has no interior edge to cut the globe. Floating cards can still
      // paint a hard frame while they are barely visible; keep those out of
      // the compositor until enough of the frame is readable. Only write when
      // the value changes so this tick does not invalidate styles every frame.
      const imageVisibility = new WeakMap<Element, string>();
      const gateFaintImages = () => {
        imageCards.forEach((card) => {
          const opacity = Number(card.style.opacity || 1);
          const fullBleedFilm =
            card.classList.contains('journey-film--iceland') ||
            card.classList.contains('journey-film--rajasthan');
          const threshold = fullBleedFilm
            ? 0.02
            : card.classList.contains('journey-film')
              ? 0.5
              : 0.2;
          const visibility = opacity > threshold ? 'visible' : 'hidden';
          if (imageVisibility.get(card) === visibility) return;
          imageVisibility.set(card, visibility);
          card.style.visibility = visibility;
        });
      };
      // Run after GSAP's render tick so autoAlpha/opacity has already been
      // written when the threshold is checked.
      gsap.ticker.add(gateFaintImages);

      gsap.set(media, states.world);
      gsap.set($$('.scene-panel').filter((panel) => panel !== panels.world), {
        autoAlpha: 0,
      });
      gsap.set(explore, { autoAlpha: 0, y: 22 });
      gsap.set(Object.values(films).filter(Boolean), { autoAlpha: 0 });
      gsap.set(rules, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set($$('[data-reveal]'), { autoAlpha: 0, y: 22 });
      gsap.set(
        $$('.line-inner').filter((line) => !line.closest('.scene-panel--arrival')),
        { yPercent: 120 },
      );
      gsap.set(panels.world, { autoAlpha: 1 });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: stageEl,
          start: 'top top',
          end: `+=${mobile ? 540 : 720}%`,
          scrub: reducedMotion ? true : 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            if (progressFill.current) {
              progressFill.current.style.transform = `scaleX(${self.progress})`;
            }
            const next = Math.min(6, Math.floor(self.progress * 7));
            if (next !== lastScene.current) {
              lastScene.current = next;
              setSceneIndex(next);
            }
            const nextInteractive = self.progress >= 0.9;
            if (nextInteractive !== interactiveRef.current) {
              interactiveRef.current = nextInteractive;
              setInteractive(nextInteractive);
            }
          },
          onToggle: (self) => setInView(self.isActive),
        },
      });

      // Arrival is already composed at progress 0; it leaves as the first
      // chapter begins. This keeps the opening readable before any scroll.
      tl.to(media, { ...states.japan, duration: 2.2, ease: 'power2.inOut' }, 1.3);
      tl.to(
        [$('[data-anim="arrival-line-1"]'), $('[data-anim="arrival-line-2"]')],
        { yPercent: -115, duration: 0.8, stagger: 0.08, ease: 'power2.in' },
        1.45,
      );
      tl.to(
        [
          $('[data-anim="arrival-kicker"]'),
          $('[data-anim="arrival-note"]'),
          $('[data-anim="arrival-coord"]'),
          $('[data-anim="arrival-cue"]'),
        ],
        { autoAlpha: 0, y: -18, duration: 0.5, stagger: 0.04 },
        1.45,
      );
      tl.to(panels.world, { autoAlpha: 0, duration: 0.22 }, 1.9);

      // Japan: type from the right, film unfolds from a small crop, copy lags.
      tl.fromTo(panels.japan, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.32 }, 1.98);
      tl.fromTo(
        $('[data-anim="japan-word"]'),
        { autoAlpha: 0, xPercent: 118 },
        { autoAlpha: 1, xPercent: 0, duration: 1.2, ease: 'power4.out' },
        2.02,
      );
      tl.fromTo(
        $('[data-anim="japan-kicker"]'),
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        2.18,
      );
      tl.fromTo(
        $('[data-anim="japan-copy"]'),
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, duration: 0.8 },
        2.48,
      );
      tl.to($('[data-anim="japan-title"]'), { yPercent: 0, duration: 0.8 }, 2.55);
      tl.fromTo(
        $('[data-line="japan-rule"]'),
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power2.inOut' },
        2.35,
      );
      tl.fromTo(
        $('[data-anim="japan-filmnote"]'),
        { autoAlpha: 0, x: 24 },
        { autoAlpha: 1, x: 0, duration: 0.65 },
        3.0,
      );
      tl.fromTo(
        $('[data-anim="japan-coord"]'),
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        3.1,
      );
      tl.fromTo(
        films.kyoto,
        { autoAlpha: 0, scale: 0.56, yPercent: 10 },
        { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.95, ease: 'power3.out' },
        2.2,
      );
      tl.to(films.kyoto, { scale: 1.04, duration: 0.9, ease: 'none' }, 3.18);
      tl.to(
        $('[data-anim="japan-word"]'),
        { xPercent: -40, autoAlpha: 0, duration: 0.65, ease: 'power2.in' },
        3.55,
      );
      tl.to($('[data-anim="japan-copy"]'), { autoAlpha: 0, y: -20, duration: 0.45 }, 3.62);
      tl.to(films.kyoto, { autoAlpha: 0, scale: 0.92, yPercent: -10, duration: 0.5 }, 3.6);
      tl.to(panels.japan, { autoAlpha: 0, duration: 0.25 }, 3.86);

      // India: a full-bleed film arrives while the globe grows behind it.
      tl.to(media, { ...states.india, duration: 2.2, ease: 'power2.inOut' }, 3.5);
      tl.fromTo(panels.india, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24 }, 3.94);
      tl.fromTo(
        films.rajasthan,
        { autoAlpha: 0, scale: 1.08 },
        { autoAlpha: 1, scale: 1, duration: 0.95, ease: 'power3.out' },
        4.0,
      );
      tl.fromTo(
        $('[data-anim="india-word"]'),
        { autoAlpha: 0, yPercent: 60 },
        { autoAlpha: 1, yPercent: 0, duration: 1.05, ease: 'power4.out' },
        4.2,
      );
      tl.fromTo(
        $('[data-anim="india-sub"]'),
        { autoAlpha: 0, xPercent: 26 },
        { autoAlpha: 1, xPercent: 0, duration: 0.8 },
        4.58,
      );
      tl.fromTo(
        $('[data-anim="india-copy"]'),
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.6 },
        4.7,
      );
      tl.fromTo(
        $('[data-anim="india-inset"]'),
        { autoAlpha: 0, x: 50, y: 28 },
        { autoAlpha: 1, x: 0, y: 0, duration: 0.8 },
        4.58,
      );
      tl.fromTo(
        $('[data-anim="india-coord"]'),
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        5.0,
      );
      tl.to($('[data-anim="india-word"]'), { yPercent: -24, duration: 0.7 }, 5.3);
      tl.to($('[data-anim="india-sub"]'), { autoAlpha: 0, xPercent: 12, duration: 0.45 }, 5.38);
      tl.to(
        [films.rajasthan],
        { autoAlpha: 0, scale: 1.04, duration: 0.55 },
        5.43,
      );
      tl.to(
        [$('[data-anim="india-copy"]'), $('[data-anim="india-inset"]')],
        { autoAlpha: 0, y: -20, duration: 0.4, stagger: 0.04 },
        5.38,
      );
      tl.to(panels.india, { autoAlpha: 0, duration: 0.25 }, 5.85);

      // Europe: a photographic collage with a small floating film.
      tl.to(media, { ...states.europe, duration: 2.2, ease: 'power2.inOut' }, 5.4);
      tl.fromTo(panels.europe, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24 }, 5.95);
      tl.fromTo(
        $('[data-anim="europe-word"]'),
        { autoAlpha: 0, yPercent: 46 },
        { autoAlpha: 1, yPercent: 0, duration: 1, ease: 'power4.out' },
        6.0,
      );
      tl.fromTo(
        $('[data-anim="europe-copy"]'),
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, duration: 0.8 },
        6.3,
      );
      tl.to($('[data-anim="europe-title"]'), { yPercent: 0, duration: 0.7 }, 6.45);
      tl.fromTo(
        $('[data-anim="europe-florence"]'),
        { autoAlpha: 0, xPercent: 38, yPercent: 8 },
        { autoAlpha: 1, xPercent: 0, yPercent: 0, duration: 1.05, ease: 'power3.out' },
        6.05,
      );
      tl.fromTo(
        $('[data-anim="europe-barcelona"]'),
        { autoAlpha: 0, xPercent: -36, yPercent: 14 },
        { autoAlpha: 1, xPercent: 0, yPercent: 0, duration: 0.9 },
        6.45,
      );
      tl.fromTo(
        $('[data-anim="europe-lucerne"]'),
        { autoAlpha: 0, yPercent: -40 },
        { autoAlpha: 1, yPercent: 0, duration: 0.8 },
        6.6,
      );
      tl.fromTo(
        films.italy,
        { autoAlpha: 0, xPercent: 30, yPercent: -8, scale: 0.7 },
        { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, duration: 0.8, ease: 'power3.out' },
        6.35,
      );
      tl.fromTo(
        $('[data-anim="europe-coord"]'),
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        7.0,
      );
      tl.to(
        $('[data-anim="europe-word"]'),
        { xPercent: -18, autoAlpha: 0, duration: 0.6 },
        7.32,
      );
      tl.to(
        [$('[data-anim="europe-copy"]'), $('[data-anim="europe-lucerne"]')],
        { autoAlpha: 0, y: -22, duration: 0.42, stagger: 0.04 },
        7.3,
      );
      tl.to(
        [$('[data-anim="europe-florence"]'), $('[data-anim="europe-barcelona"]')],
        { autoAlpha: 0, yPercent: -16, duration: 0.5, stagger: 0.05 },
        7.35,
      );
      tl.to(films.italy, { autoAlpha: 0, yPercent: -14, scale: 0.82, duration: 0.4 }, 7.4);
      tl.to(panels.europe, { autoAlpha: 0, duration: 0.25 }, 7.85);

      // Nature: the landscape takes the screen, then opens back to the globe.
      tl.to(media, { ...states.nature, duration: 2.2, ease: 'power2.inOut' }, 7.3);
      tl.fromTo(panels.nature, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24 }, 7.94);
      tl.fromTo(
        films.iceland,
        { autoAlpha: 0, scale: 1.06 },
        { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'power3.out' },
        8.0,
      );
      tl.fromTo(
        $('[data-anim="nature-word"]'),
        { autoAlpha: 0, xPercent: -78 },
        { autoAlpha: 1, xPercent: -6, duration: 1.15, ease: 'power4.out' },
        8.12,
      );
      tl.fromTo(
        $('[data-anim="nature-sub"]'),
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7 },
        8.58,
      );
      tl.fromTo(
        $('[data-anim="nature-copy"]'),
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.6 },
        8.6,
      );
      tl.fromTo(
        $('[data-anim="nature-inset"]'),
        { autoAlpha: 0, x: 36, yPercent: -14 },
        { autoAlpha: 1, x: 0, yPercent: 0, duration: 0.8 },
        8.55,
      );
      tl.fromTo(
        $('[data-anim="nature-coord"]'),
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        8.9,
      );
      tl.to($('[data-anim="nature-word"]'), { autoAlpha: 0, xPercent: -22, duration: 0.55 }, 9.35);
      tl.to(
        [$('[data-anim="nature-sub"]'), $('[data-anim="nature-copy"]'), $('[data-anim="nature-inset"]')],
        { autoAlpha: 0, y: -18, duration: 0.4, stagger: 0.03 },
        9.4,
      );
      tl.to(
        films.iceland,
        { autoAlpha: 0, scale: 1.04, duration: 0.6, ease: 'power2.in' },
        9.4,
      );
      tl.to(panels.nature, { autoAlpha: 0, duration: 0.24 }, 9.82);

      // Layers: no imagery. The globe and the typographic system carry it.
      tl.to(media, { ...states.layers, duration: 2, ease: 'power2.inOut' }, 9.45);
      tl.fromTo(panels.layers, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24 }, 9.9);
      tl.fromTo(
        $('[data-anim="layers-word"]'),
        { autoAlpha: 0, xPercent: -34 },
        { autoAlpha: 1, xPercent: 0, duration: 1.1, ease: 'power3.out' },
        9.96,
      );
      tl.fromTo(
        $('[data-anim="layers-title"]'),
        { autoAlpha: 0, y: 34 },
        { autoAlpha: 1, y: 0, duration: 0.8 },
        10.1,
      );
      $$('[data-layer]').forEach((row, index) => {
        tl.fromTo(
          row,
          { autoAlpha: 0, x: index % 2 === 0 ? -38 : 38 },
          { autoAlpha: 1, x: 0, duration: 0.45 },
          10.35 + index * 0.075,
        );
      });
      tl.fromTo(
        $('[data-anim="layers-note"]'),
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.5 },
        11.05,
      );
      tl.to(
        [$('[data-anim="layers-word"]'), $('[data-anim="layers-title"]')],
        { autoAlpha: 0, y: -24, duration: 0.5, stagger: 0.04 },
        11.45,
      );
      tl.to($$('[data-layer]'), { autoAlpha: 0, x: 24, duration: 0.4, stagger: 0.03 }, 11.48);
      tl.to(panels.layers, { autoAlpha: 0, duration: 0.22 }, 11.86);

      // Final: the foreground clears, the globe takes the frame, and the
      // exploration UI is the only new layer.
      tl.to(media, { ...states.interactive, duration: 2.2, ease: 'power2.inOut' }, 11.5);
      tl.fromTo(panels.interactive, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 11.92);
      tl.fromTo(
        $('[data-anim="final-copy"]'),
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.55 },
        12.0,
      );
      tl.to($('[data-anim="final-copy"]'), { autoAlpha: 0, y: -18, duration: 0.4 }, 12.35);
      tl.to(panels.interactive, { autoAlpha: 0, duration: 0.2 }, 12.55);
      tl.to(explore, { autoAlpha: 1, y: 0, duration: 0.65 }, 12.5);

      tl.to({}, { duration: 0.01 }, 14);

      const refresh = window.setTimeout(() => {
        ScrollTrigger.refresh();
        const trigger = tl.scrollTrigger;
        if (trigger) triggerRange.current = { start: trigger.start, end: trigger.end };
      }, 500);

      lastScene.current = -1;
      interactiveRef.current = false;
      progressRef.current = 0;
      setSceneIndex(0);
      setInteractive(false);
      const trigger = tl.scrollTrigger;
      if (trigger) triggerRange.current = { start: trigger.start, end: trigger.end };

      // A width change rewrites the pin spacer. Preserve the normalized
      // chapter progress instead of leaving the viewport at the old absolute
      // scroll position, which can land past a now-shorter pinned range.
      let lastWidth = window.innerWidth;
      let resizeTimer = 0;
      const onResize = () => {
        const nextWidth = window.innerWidth;
        if (nextWidth === lastWidth) return;
        lastWidth = nextWidth;
        const progress = progressRef.current;
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          ScrollTrigger.refresh();
          const activeTrigger = tl.scrollTrigger;
          if (!activeTrigger || progress <= 0.001 || progress >= 0.999) return;
          const target =
            activeTrigger.start + (activeTrigger.end - activeTrigger.start) * progress;
          if (Math.abs(window.scrollY - target) < 2) return;
          if (lenisRef.current) lenisRef.current.scrollTo(target, { immediate: true, force: true });
          else window.scrollTo({ top: target, behavior: 'instant' });
        }, 260);
      };
      window.addEventListener('resize', onResize);

      return () => {
        window.clearTimeout(refresh);
        window.clearTimeout(resizeTimer);
        gsap.ticker.remove(gateFaintImages);
        window.removeEventListener('resize', onResize);
        tl.scrollTrigger?.kill();
        tl.kill();
        setInView(false);
      };
    };

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => buildTimeline(false));
    mm.add('(max-width: 767px)', () => buildTimeline(true));

    return () => {
      mm.revert();
      triggerRange.current = null;
      delete document.documentElement.dataset.surface;
    };
    // Lenis is created after this component mounts. Rebuilding the full
    // timeline when the context updates caused a second pin setup and a
    // visible scroll hitch; the resize handler reads the current instance
    // through a ref instead.
  }, []);

  const jumpTo = (index: number) => {
    const range = triggerRange.current;
    if (!range) return;
    // The last chapter is the settled interactive atlas, which begins at 90%
    // rather than at a seventh of the timeline. Jump past that threshold.
    const progress = index >= journeyScenes.length - 1 ? 0.96 : (index + 0.5) / journeyScenes.length;
    const target = range.start + progress * (range.end - range.start);
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else window.scrollTo({ top: target, behavior: 'smooth' });
  };

  const selectDestination = (slug: string) => {
    setSelectedSlug(slug || null);
  };

  const resetGlobe = () => {
    setSelectedSlug(null);
    setResetSignal((value) => value + 1);
  };

  const explore = (
    <WorldExplore
      destinations={destinations}
      filtered={filtered}
      filter={filter}
      query={query}
      selected={selected}
      eventsByDestination={eventsByDestination}
      onFilter={applyFilter}
      onQuery={applyQuery}
      onSelect={selectDestination}
      onHover={setHoveredSlug}
    />
  );

  return (
    <section ref={root} className="world world--v5" data-nav-surface="dark">
      <div
        ref={stage}
        className="world-stage"
        data-interactive={interactive}
        data-scene={scene.id}
        data-has-film={Boolean(activeFilm)}
      >
        <div className="world-backdrop" aria-hidden="true" />
        <div className="world-media" data-interactive={interactive} data-in-view={inView} data-scene={scene.id}>
          <p className="sr-only">
            An interactive globe of the KASANE atlas. Drag to rotate, pinch or scroll to zoom, and
            select a marked destination. Every place is also available in the searchable list below.
          </p>
          {typeof window === 'undefined' ? (
            <GlobeStill />
          ) : (
            <Suspense fallback={<GlobeStill />}>
              <LazyGlobeCanvas
                scene={scene}
                interactive={interactive && inView}
                inView={inView}
                visibleSlugs={visibleSlugs}
                selectedSlug={interactive ? selectedSlug : null}
                hoveredSlug={hoveredSlug}
                resetSignal={resetSignal}
                scrollProgress={progressRef}
                onSelect={selectDestination}
                onHover={setHoveredSlug}
              />
            </Suspense>
          )}
        </div>

        <div className="world-film-layer">
          {journeyFilms
            .filter((clip) => clip.id !== 'italy')
            .map((clip) => (
              <JourneyFilm key={clip.id} clip={clip} active={activeFilm?.id === clip.id} />
            ))}
        </div>

        <div className="world-composition">
          <ScenePanel id="world" active={sceneIndex === 0} className="scene-panel--arrival">
            <div className="arrival-type">
              <p className="scene-kicker" data-anim="arrival-kicker">
                <span>An atlas of living culture</span>
                <span>Vol. II</span>
              </p>
              <h1 className="arrival-title display-mega">
                <MaskedLine dataAnim="arrival-line-1">See the</MaskedLine>
                <MaskedLine dataAnim="arrival-line-2">
                  {' '}world <em>in layers.</em>
                </MaskedLine>
              </h1>
            </div>
            <div className="arrival-note" data-anim="arrival-note">
              <p className="scene-lede">
                A field guide to the places, cultures and landscapes that make a world — and a
                quieter way to move through it.
              </p>
              <p className="scene-small">
                {destinations.length} places. Their architecture, their table, their weather,
                their dates.
              </p>
              <Link to="/explore" className="scene-link">
                Open the atlas
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
            <div className="scene-coordinate arrival-coordinate" data-anim="arrival-coord">
              18.0°N · 20.0°E
            </div>
            <div className="arrival-cue" data-anim="arrival-cue">
              <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.4} aria-hidden="true" />
              <span>Scroll to travel</span>
            </div>
          </ScenePanel>

          <ScenePanel id="japan" active={sceneIndex === 1} className="scene-panel--japan">
            <div className="scene-word japan-word" aria-hidden="true">
              <span data-anim="japan-word">JAPAN</span>
            </div>
            <div className="scene-kicker japan-kicker" data-anim="japan-kicker">
              <span>02 / 07</span>
              <span>Kansai · Japan</span>
            </div>
            <div className="japan-copy" data-anim="japan-copy">
              <p className="scene-label">Kyoto</p>
              <h2 className="display-md">
                <MaskedLine dataAnim="japan-title">Ancient, and still becoming.</MaskedLine>
              </h2>
              <p className="scene-body">
                Where ancient traditions meet an ever-changing present. In Kyoto, that
                conversation is in the grain of the wood, the edge of a garden, the counter
                behind a curtain.
              </p>
              <Link to="/destinations/kyoto" className="scene-link">
                Read the Kyoto field guide
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
            <div className="japan-filmnote" data-anim="japan-filmnote">
              <span>On film</span>
              <p>A garden kept for the turn of a season</p>
            </div>
            <div className="scene-coordinate japan-coordinate" data-anim="japan-coord">
              35.0116°N · 135.7681°E
            </div>
            <span className="scene-rule japan-rule" data-line="japan-rule" aria-hidden="true" />
          </ScenePanel>

          <ScenePanel id="india" active={sceneIndex === 2} className="scene-panel--india">
            <div className="scene-word india-word" aria-hidden="true">
              <span data-anim="india-word">INDIA</span>
            </div>
            <div className="india-sub" data-anim="india-sub">
              No single image.
            </div>
            <div className="india-copy" data-anim="india-copy">
              <p className="scene-label">Jaipur · Rajasthan</p>
              <p className="scene-body">
                A world of contrasts, where architecture, history, belief and everyday life
                exist in layers. Jaipur is a planned city that still feels found: courtyards,
                bazaars and rooftops holding the desert light.
              </p>
              <Link to="/destinations/jaipur" className="scene-link">
                Read the Jaipur field guide
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
            <figure className="india-inset" data-anim="india-inset">
              <SmartImage
                name="dest-jaipur-b"
                alt="The pink sandstone facade of Hawa Mahal"
                sizes="(max-width: 767px) 34vw, 19vw"
              />
              <figcaption>Hawa Mahal · Jaipur</figcaption>
            </figure>
            <div className="scene-coordinate india-coordinate" data-anim="india-coord">
              26.9124°N · 75.7873°E
            </div>
            <span className="scene-rule india-rule" data-line="india-rule" aria-hidden="true" />
          </ScenePanel>

          <ScenePanel id="europe" active={sceneIndex === 3} className="scene-panel--europe">
            <div className="scene-word europe-word" aria-hidden="true">
              <span data-anim="europe-word">EUROPE</span>
            </div>
            <div className="europe-copy" data-anim="europe-copy">
              <p className="scene-kicker">
                <span>04 / 07</span>
                <span>Europe</span>
              </p>
              <h2 className="display-md">
                <MaskedLine dataAnim="europe-title">One continent, many grammars.</MaskedLine>
              </h2>
              <p className="scene-body">
                From the Mediterranean to the Alps, Europe is a set of local arguments about how
                to live — in stone, at the table, in the square, in the light.
              </p>
              <div className="europe-links">
                <Link to="/destinations/florence">Florence</Link>
                <Link to="/destinations/barcelona">Barcelona</Link>
                <Link to="/destinations/lucerne">Lucerne</Link>
              </div>
            </div>
            <figure className="europe-photo europe-photo--florence" data-anim="europe-florence">
              <SmartImage
                name="dest-florence"
                alt="Florence rooftops with the Duomo beyond"
                sizes="(max-width: 767px) 78vw, 34vw"
                priority
              />
              <figcaption>Florence · Tuscany</figcaption>
            </figure>
            <figure className="europe-photo europe-photo--barcelona" data-anim="europe-barcelona">
              <SmartImage
                name="dest-barcelona-b"
                alt="Eixample facades with wrought-iron balconies"
                sizes="(max-width: 767px) 42vw, 18vw"
              />
              <figcaption>Barcelona · Catalonia</figcaption>
            </figure>
            <figure className="europe-photo europe-photo--lucerne" data-anim="europe-lucerne">
              <SmartImage
                name="dest-lucerne"
                alt="A Swiss lake and mountain village"
                sizes="(max-width: 767px) 34vw, 13vw"
              />
              <figcaption>Lucerne · Switzerland</figcaption>
            </figure>
            <div className="scene-coordinate europe-coordinate" data-anim="europe-coord">
              46.0°N · 10.0°E
            </div>
            {italyFilm ? (
              <JourneyFilm clip={italyFilm} active={activeFilm?.id === 'italy'} />
            ) : null}
          </ScenePanel>

          <ScenePanel id="nature" active={sceneIndex === 4} className="scene-panel--nature">
            <div className="scene-word nature-word" aria-hidden="true">
              <span data-anim="nature-word">NATURE</span>
            </div>
            <div className="nature-sub" data-anim="nature-sub">
              Landscape sets the tempo.
            </div>
            <div className="nature-copy" data-anim="nature-copy">
              <p className="scene-label">Iceland · North Atlantic</p>
              <p className="scene-body">
                Coastlines, mountains and weather set the pace. Landscape is not scenery here;
                it is the schedule the day is built around.
              </p>
              <Link to="/destinations/reykjavik" className="scene-link">
                Read the Reykjavík field guide
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
            <figure className="nature-inset" data-anim="nature-inset">
              <SmartImage
                name="dest-lucerne-b"
                alt="A lake and mountain village in the Swiss Alps"
                sizes="(max-width: 767px) 36vw, 18vw"
              />
              <figcaption>Alpine water · Switzerland</figcaption>
            </figure>
            <div className="scene-coordinate nature-coordinate" data-anim="nature-coord">
              25.0°N · 18.0°W
            </div>
          </ScenePanel>

          <ScenePanel id="layers" active={sceneIndex === 5} className="scene-panel--layers">
            <div className="layers-title" data-anim="layers-title">
              <p className="scene-kicker">
                <span>06 / 07</span>
                <span>The world of KASANE</span>
              </p>
              <h2 className="display-md">
                The world is
                <br />
                <em>more than a list.</em>
              </h2>
              <p className="scene-body">
                KASANE reads a place through the things that hold it together: the architecture,
                the culture, the history, the landscape, the table and the calendar.
              </p>
              <div className="layers-links">
                <Link to="/explore">Explore the atlas</Link>
                <Link to="/collections">Open collections</Link>
                <Link to="/plan">Plan a journey</Link>
              </div>
            </div>
            <div className="layers-word" aria-hidden="true">
              <span data-anim="layers-word">LAYERS</span>
            </div>
            <ol className="layers-list">
              {layersScene?.layers?.map((layer, index) => (
                <li key={layer} data-layer>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{layer}</span>
                </li>
              ))}
            </ol>
            <p className="layers-note" data-anim="layers-note">
              Eight ways of looking. One place at a time.
            </p>
          </ScenePanel>

          <ScenePanel id="interactive" active={sceneIndex === 6} className="scene-panel--final">
            <div className="final-copy" data-anim="final-copy">
              <p className="scene-kicker">
                <span>07 / 07</span>
                <span>The atlas is yours</span>
              </p>
              <h2 className="display-md">The atlas is yours.</h2>
              <p className="scene-body">
                Rotate the globe. Follow a place into its field guide. Leave room for the
                unplanned afternoon.
              </p>
            </div>
          </ScenePanel>
        </div>

        <div className="world-vignette" aria-hidden="true" />
        <div className="world-grain" aria-hidden="true" />

        <header className="world-masthead">
          <div className="world-masthead__left">
            <span className="world-masthead__mark">
              <span />
              <span />
              <span />
            </span>
            <span>KASANE · The world in layers</span>
          </div>
          <div className="world-masthead__right">
            <span>{scene.index} / 0{journeyScenes.length}</span>
            <span className="world-masthead__coord">{formatCoordinate(scene.focus.lat, scene.focus.lng)}</span>
          </div>
        </header>

        <ChapterRail active={sceneIndex} onJump={jumpTo} />

        <div
          className="world-explore-shell"
          data-visible={interactive}
          aria-hidden={!interactive}
          inert={!interactive ? true : undefined}
        >
          <div className="world-explore-shell__head">
            <span>Explore the world</span>
            <span className="world-explore-shell__tools">
              <span className="world-explore-shell__hint">Rotate · Zoom · Select</span>
              <button type="button" className="world-reset" onClick={resetGlobe}>
                Reset view
              </button>
            </span>
          </div>
          {explore}
        </div>

        <div className="world-progress">
          <span className="world-progress__label">
            {String(sceneIndex + 1).padStart(2, '0')} / {String(journeyScenes.length).padStart(2, '0')}
          </span>
          <span className="world-progress__track" aria-hidden="true">
            <span ref={progressFill} />
          </span>
          <span className="world-progress__hint">
            {interactive ? 'Drag · Zoom · Select' : scene.id === 'world' ? 'Scroll to travel' : 'Keep scrolling'}
          </span>
        </div>

        <p className="sr-only" aria-live="polite">
          Chapter {scene.index}: {scene.title}
        </p>
      </div>
      <WorldCoda />
    </section>
  );
};
