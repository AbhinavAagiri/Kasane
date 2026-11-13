# KASANE V4 — Globe-First Homepage Reference Implementation

Last updated: 12 November 2026.

## 1. What changed

V4 replaces the conventional homepage opening — hero, film carousel, progress
bar and introductory layout — with one full-viewport globe journey. The globe is
the first thing rendered. It is not a decorative hero followed by a separate
globe section: a single React Three Fiber canvas persists through the whole
chapter sequence and becomes the interactive atlas at the end.

Removed:

- `src/components/home/Hero.tsx` and its render from `src/pages/Home.tsx`.
- The hero film carousel, hero progress bar, hero markers and their CSS.
- Print/reduced-motion rules that referred to the old hero elements.

Kept after the journey:

- The existing editorial discovery sections (`Intro`, `EventsTeaser`,
  `AtlasSection`, `CultureTeaser`, `InterestsSection`, `FeatureSection`,
  `ElsewhereSection`, `CollectionsSection`, `PlanSection`, `ClosingSection`).
- The existing Airbnb-style atlas search in `WorldExplore`.

## 2. Chapter model

`src/components/globe/worldScenes.ts` is the single source of chapter data.
There are seven scenes over one pinned timeline:

| # | Scene | Globe focus | Chapter film | Film side |
| --- | --- | --- | --- | --- |
| 01 | Arrival · world | 18°N, 20°E | — | — |
| 02 | Japan · Kyoto | 36°N, 138°E | Kyoto | right |
| 03 | India · Jaipur | 24°N, 78°E | Rajasthan / Jaipur | left |
| 04 | Europe | 46°N, 10°E | Positano / Italy | right |
| 05 | Nature | 25°N, 18°W | Iceland | left |
| 06 | The world of KASANE | 24°N, 24°E | — | — |
| 07 | The atlas is yours | 18°N, 10°E | — | — |

Destination markers are real places from `src/data/destinations.part1.ts` and
`part2.ts`. `latLngToVector` in `globeData.ts` converts their real coordinates
to positions on the sphere; the outline and borders come from the local
TopoJSON atlas, not a decorative texture.

Each chapter carries its own copy, shorter `mobileBody`, marker slugs,
destination/event links and optional film metadata. The final interaction
chapter exposes every destination marker and the filtered atlas.

## 3. Scroll choreography

`src/components/globe/GlobeJourney.tsx` owns the journey:

- GSAP ScrollTrigger pins `.world-stage` at `top top`.
- Desktop duration is `630%`; mobile duration is `470%`. The pinned stage remains
  the same DOM element and the same R3F canvas throughout.
- `scrub: 0.7` gives the globe and copy a small, controlled lag behind the
  wheel without turning the page into a slideshow.
- The master timeline is six beats long. Chapters switch at equal fractions of
  scroll progress (`Math.floor(progress * 7)`), with copy crossfades and a
  staggered per-item reveal. The final beat releases `interactive`.
- Scroll state drives scene index, active film, copy, marker set, globe
  position/scale, camera distance, chapter rail and progress.
- `world-stage` exposes `data-scene`, `data-has-film`, `data-film-side` and
  `data-interactive` for styling and tests.
- Lenis is the document scroller. On the final chapter only, pointer entry into
  `.world-media` stops Lenis so wheel input belongs to OrbitControls; leaving
  the globe returns wheel input to the document.

The stage is responsive rather than a shrunken desktop layout:

- Desktop: globe left/right composition, film and copy on opposite sides.
- Tablet (768–1100px): globe at the top, copy and film side by side below it.
- Mobile (≤767px): centred globe, full-width film at `37svh`, copy at the bottom;
  `mobileBody` cuts the editorial copy to a complete short edition, not a
  truncated desktop paragraph. At very short viewports the film moves to
  `35svh` and copy heights tighten.
- Arrival, layers and final chapters have their own positions and copy rules.

## 4. The interactive handoff

At the end of the timeline the same globe becomes the atlas:

- `interactive=true` enables OrbitControls and freezes the historical focus
  animation.
- OrbitControls: rotate, wheel zoom and pinch zoom; pan is disabled.
- `GlobeCanvas` only renders continuously while in view; `frameloop` is
  `always` in view.
- Markers are real meshes with hover rings and labels. Hovering a marker (or an
  atlas list row) highlights the same destination on the globe and sets the
  pointer cursor through `data-hovered`.
- Clicking a marker or list row selects a destination, starts a short camera
  flight, clears OrbitControls for the flight, and opens the editorial preview
  with a field-guide link.
- `Reset view` clears selection and calls `controls.reset()`; the preview returns
  to its empty state.
- `WorldExplore` is `inert` and hidden until the final chapter, so keyboard and
  screen-reader users do not enter an invisible panel mid-journey.
- The chapter rail jumps with Lenis to the corresponding trigger progress.

## 5. Libraries and components

- **GSAP + ScrollTrigger** — pin, scrubbed timeline, chapter transitions.
- **Lenis** — smooth document scroll and programmatic chapter jumps.
- **React Three Fiber** — the persistent WebGL scene and frame loop.
- **Drei** — `OrbitControls`, `Html` marker labels, `AdaptiveDpr`.
- **Three.js** — sphere, lat/lng projection, boundary geometry, shaders,
  textures and raycast markers.
- **ReactBits** — the existing `WordReveal` scroll reveal is used in the
  afterword (`WorldCoda`); the adaptation lives in
  `src/components/motion/WordReveal.tsx`.
- **21st.dev** — used as a pattern reference for compact search/filter
  affordances. No third-party component is vendored; the search is the
  project's existing `WorldExplore`.
- **Tailwind CSS + project CSS** — responsive composition, type, film frames,
  atlas panel; all globe-specific layout lives in `src/styles/globals.css`.

Primary files:

- `src/pages/Home.tsx`
- `src/components/globe/GlobeJourney.tsx`
- `src/components/globe/GlobeCanvas.tsx`
- `src/components/globe/GlobeScene.tsx`
- `src/components/globe/GlobeStill.tsx`
- `src/components/globe/WorldExplore.tsx`
- `src/components/globe/worldScenes.ts`
- `src/components/globe/globeData.ts`
- `src/data/hero.ts`
- `src/data/destinations.part1.ts`, `part2.ts`
- `src/styles/globals.css`
- `src/pages/CreditsPage.tsx`
- `docs/video-manifest.md`

## 6. Art direction

The visual direction is editorial rather than dashboard-like:

- Ivory, sand, olive and charcoal; one restrained gold accent for coordinates,
  marker points and active rules.
- Newsreader display serif for chapter titles; Hanken Grotesk for the working
  interface.
- Asymmetry: copy and film occupy opposite edges, leaving the globe as the
  still centre of gravity.
- Restrained motion: a barely perceptible globe drift in the narrative scenes,
  short copy stagger, a single film cut, no bouncing cards or generic split
  hero.
- References: Cereal, Kinfolk, The Local Project, Aesop, Aman and Six Senses.
- Lines and thin rules carry hierarchy; no glassmorphism, neon gradients or
  floating card stacks.

## 7. Video assets

`src/data/hero.ts` is the verified clip library. V4 mounts four clips:
Kyoto, Rajasthan (Jaipur), Italy (Positano) and Iceland. Seoul and Switzerland
remain verified in the library but are not mounted in this journey.

- Desktop: 1920×1080 H.264.
- Mobile (≤767px): 1280×720 H.264 via the `-mobile.mp4` variants.
- One `<video>` is mounted for the active chapter only. No preload of the next
  clip and no crossfade.
- Posters are present for metadata/fallback; `playsInline`, `muted`, `loop` and
  `autoPlay` are set. `JourneyFilm` pauses on unmount.
- Full creator/source/delivery audit: `docs/video-manifest.md`.

## 8. Accessibility and fallbacks

- `prefers-reduced-motion: reduce` replaces the entire pinned journey with a
  static editorial atlas: one globe still, four film posters, five chapters,
  no ScrollTrigger pin, no WebGL canvas, no videos and no autoplay.
- If WebGL is unavailable, `GlobeStill` is rendered in the media slot while the
  chapter copy, films and final atlas remain usable.
- Every chapter has a heading hierarchy: only the arrival copy is `h1`; later
  chapters are `h2`.
- Inactive chapters are `aria-hidden` and `inert`; the final exploration panel
  is `inert` until it is visible.
- The reset control is a real button with visible text.
- Marker labels include the destination name and coordinates; markers also
  highlight from the keyboard-focusable atlas list.
- `touch-action: none` is applied only to the interactive globe so touch drag
  and pinch do not scroll the document.

## 9. Verification evidence

Puppeteer drove the local Vite server with Chrome/SwiftShader at 1440×900,
1024×768 and 390×844. Reduced motion and a forced no-WebGL environment were
tested separately. Evidence lives in `tmp/v4/` (not part of the deployed site).

- `test-desktop.log` — desktop journey, all seven chapters, persistent canvas,
  film resolutions/sources, reverse scroll, drag, wheel zoom, reset, marker
  hover/click, console and request errors.
- `test-mobile.log` — mobile copy fit, 720p variants, film/copy separation,
  final explore panel, touch drag, pinch, reset, console and request errors.
- `test-tablet.log` — tablet composition, copy/film separation, final panel.
- `test-fallbacks.log` — reduced-motion static atlas and no-WebGL still fallback.
- `test-search.log` — the retained atlas search/filter/preview suite (16/16).
- `build.log` — `tsc -b` and the production Vite build (2405 modules;
  pre-existing large-chunk warnings only).
- Screenshots: `desktop-opening.png`, `desktop-japan.png`,
  `desktop-layers.png`, `desktop-final.png`, `mobile-opening.png`,
  `mobile-japan.png`, `mobile-final.png`, `tablet-japan.png`,
  `tablet-final.png`, `reduced-atlas.png`, `no-webgl-japan.png`.
- The earlier V3 search suite (`tmp/v3/test-search.mjs`) remains the regression
  check for search, filters, interest panel, empty state and preview selection.

## 10. Limitations

- The headless browser uses SwiftShader, not the user's GPU. Frame pacing and
  antialiasing on a real GPU were not benchmarked.
- Touch drag and pinch were exercised through Chrome DevTools synthetic touch
  events, not on a physical iOS or Android device.
- The journey uses four films. Seoul and Switzerland are intentionally
  unmounted; adding them would require new chapters or a film swap.
- The active film is fetched when its chapter mounts; there is no next-clip
  prefetch. A slow connection can show the poster briefly before playback.
- The video library is large by editorial-site standards (desktop clips
  3.7–13 MB). It is acceptable for a visual portfolio, but a stricter data
  budget would need shorter cuts or adaptive streaming.
- The no-WebGL fallback is a still globe, not an interactive 3D globe; the atlas
  search and film journey remain available.
- This is a static Vite build with client-side routing, intended for static
  hosting (Cloudflare Pages or equivalent). No server-side API was added.
