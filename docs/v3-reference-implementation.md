# KASANE V3 — Reference Implementation Report

Checked 12 November 2026. This document records what was inspected, what was
actually built, where it lives, and what remains limited. It is a verification
note, not a wish list.

## 1. Libraries and versions actually installed

| Library | Installed version | Role |
| --- | --- | --- |
| `gsap` | 3.15.1 | Timeline, scroll choreography, text reveals, camera-adjacent UI motion |
| `lenis` | 1.3.27 | One smoothed document scroll, synchronised to GSAP |
| `@react-three/fiber` | 9.8.2 | Persistent WebGL globe scene |
| `@react-three/drei` | 10.7.9 | `OrbitControls`, `Html`, `AdaptiveDpr` |
| `three` | 0.187.0 | Sphere, textures, marker geometry, lights, camera |
| `react` / `react-dom` | 19.3.1 | Application runtime |

No Vanta package was installed. No 21st.dev or ReactBits package was installed:
21st.dev is a component source site and ReactBits components are copied source,
so the selected patterns were adapted into local components instead.

## 2. Reference inspection and implementation evidence

| Reference | Inspected | What was examined | Actual implementation | Files |
| --- | --- | --- | --- | --- |
| GSAP | Yes | Timelines, sequencing, staggers, `gsap.context()`, `fromTo`, `quickTo`, ScrollTrigger integration, cleanup | Seven-scene master timeline; chapter crossfades and copy staggers; hero intro timeline; coda word reveal; chapter-rail jumps | `src/components/globe/GlobeJourney.tsx`, `src/components/motion/WordReveal.tsx`, `src/components/home/Hero.tsx` |
| ScrollTrigger | Yes | Pinning, scrub, start/end functions, `invalidateOnRefresh`, progress callbacks, refresh | Pinned `.world-stage`; 630% desktop / 470% mobile scroll distance; `scrub: 0.7`; progress rail; scene index from normalised progress | `src/components/globe/GlobeJourney.tsx` |
| Lenis | Yes | Installation, `autoRaf`, RAF ownership, GSAP ScrollTrigger sync, resize/cleanup | Single app-wide Lenis instance, `lenis.on('scroll', ScrollTrigger.update)`, one GSAP ticker loop, `destroy()` cleanup; wheel is handed to the globe only while the pointer is over it | `src/hooks/useSmoothScroll.ts`, `src/components/layout/SmoothScroll.tsx`, `src/components/globe/GlobeJourney.tsx` |
| React Three Fiber | Yes | `Canvas`, `useThree`, `useFrame`, events, DPR, demand/always rendering, disposal | One persistent Canvas; sphere with generated map texture; highlighted-country texture; boundary and marker geometry; camera damping; pointer events on markers | `src/components/globe/GlobeCanvas.tsx`, `src/components/globe/GlobeScene.tsx`, `src/components/globe/globeData.ts` |
| Drei | Yes | `OrbitControls`, `Html`, `AdaptiveDpr`, performance helpers | Orbit controls only in the interactive phase; hover/selected labels via `Html`; adaptive DPR | `src/components/globe/GlobeScene.tsx` |
| ReactBits | Yes | ScrollReveal source and its scroll-linked word treatment | `WordReveal`, adapted from `DavidHDev/react-bits` ScrollReveal. Scoped to its own GSAP context, no global ScrollTrigger kill, accessible full text retained, reduced-motion safe | `src/components/motion/WordReveal.tsx`, used in `src/components/globe/GlobeJourney.tsx` |
| 21st.dev | Yes, as a pattern library | Public search directory and the `search-expand-nav` listing: icon-to-field expansion, a card of suggestions, keyboard support and responsive behaviour | No package or copied default styling. The chapter rail predates this change; the search console now expands in place with an in-flow suggestion card, an adaptation of the expandable-search pattern that suits KASANE's bottom-anchored atlas console | `src/components/globe/GlobeJourney.tsx` (`ChapterRail`), `src/components/globe/WorldExplore.tsx`, `src/styles/globals.css` |
| Airbnb (live search UI) | Yes, live at `https://www.airbnb.com/` on 12 November 2026 | Category tab row with an active underline; a floating cream segmented search bar with `Where` / `When` / `Who`, hairline dividers and a circular brand-colour submit button. The cookie sheet blocked a clean capture of the expanded dropdown, so the base structure and observed interaction were adapted; no source was copied. | KASANE category tabs; cream `Where` / `Interest` segmented control with divider and circular gold submit; expanding cream results/category panel; thumbnails, result counts, category grid, clear/Escape/outside-click/Enter behaviour and mobile layout | `src/components/globe/WorldExplore.tsx`, `src/styles/globals.css` |
| Vanta | Yes | `clouds2` effect page and repository | Deliberately rejected. The globe is already a real WebGL scene; a second full-screen WebGL atmosphere would add GPU cost and push the section toward a generic technology landing page. No Vanta dependency or canvas exists | none |

### What was inspected in practice

- GSAP documentation for timelines, ScrollTrigger pin/scrub behaviour,
  stagger sequencing and context cleanup.
- Lenis documentation for its RAF loop and the supported GSAP ScrollTrigger
  integration pattern, plus the package API used here (`on`, `scrollTo`,
  `stop`, `start`, `destroy`).
- React Three Fiber documentation for Canvas setup, `useFrame`, `useThree`,
  pointer events, DPR and rendering performance.
- Drei documentation/source for `OrbitControls`, `Html`, and `AdaptiveDpr`.
- ReactBits ScrollReveal source, including its ScrollTrigger-per-word approach.
  The adaptation removes the original global trigger teardown, which would be
  unsafe on a routed page.
- 21st.dev public listings for navigation and compact control patterns. The
  site does not expose one installable package, so no package installation is
  claimed. The visual styling is KASANE's own.
- The live Airbnb homepage search in Chromium at desktop width: the category
  tabs, segmented cream bar, vertical rules and circular submit button were
  observed directly. The cookie sheet prevented a clean expanded-dropdown
  capture, so the panel follows the visible structure and the expandable-search
  pattern; no Airbnb code, logo, copy, colour token or asset is included.
- The 21st.dev `search-expand-nav` listing for the in-place expansion and
  suggestion-card behaviour. The KASANE console is bottom-anchored, so the
  expanded panel adds height in normal flow and the whole console grows upward
  rather than dropping below the viewport.
- Vanta `clouds2` and its WebGL implementation, before rejecting it.

The references were not used as decoration. The chapter timeline, its scroll
driver, the globe scene, the final orbit interaction, and the coda reveal all
depend on the libraries above at runtime.

## 3. The globe narrative

`GlobeJourney` renders a pinned 100svh stage. A single ScrollTrigger owns the
timeline:

- Desktop scroll distance: `630%` of the viewport.
- Mobile scroll distance: `470%` of the viewport.
- Scrub: `0.7` seconds, so the camera and copy trail the scroll slightly rather
  than feeling mechanically locked.
- The master timeline is six units long; seven scenes divide it evenly. This
  keeps scene boundaries stable even though chapter copy lengths differ.
- `onUpdate` converts normalised progress to `sceneIndex =
  floor(progress * 7)`. The seventh scene sets `interactive`.
- Chapters are stacked in the same pinned stage. Their opacity and vertical
  offset are animated on the same timeline; each chapter's copy items stagger
  in rather than appearing as a block.
- The progress rule and the right-hand chapter rail are driven by the same
  scene state. Rail buttons use Lenis `scrollTo` to jump to a scene.
- The stage, Canvas, globe and markers are never unmounted between scenes. The
  only handoff is from narrative camera control to `OrbitControls`.

Seven scenes, in order: the world, a world of places, culture and history,
nature and landscape, the cultural calendar, a personal world, and exploration.
All copy is original KASANE editorial copy. All highlighted destinations and
events come from the existing datasets, not a separate globe-only list.

The camera rig damps rotation and distance toward each scene's focus. A very
small idle drift (roughly 0.03 radians) keeps the atlas alive without moving
the reader's eye while they read. Chapter transitions use `power2.in` exits and
`power3.out` copy entrances; there is no bounce and no perpetual zoom.

The coda uses the adapted ReactBits ScrollReveal to bring the afterword in
word by word at `top 82%` → `top 38%`, with opacity, 10px rise and a 7px blur.

## 4. Geographic data and markers

- Source: Natural Earth 1:110m Admin 0 Countries, public domain
  (`https://www.naturalearthdata.com/downloads/110m-cultural-vectors/`).
- The downloaded GeoJSON was converted to
  `public/map/globe-countries.json`: 177 country records with ISO alpha-3,
  ISO alpha-2, name and polygon rings. The file records its source, URL,
  licence and conversion date.
- Land polygons also come from the project's Natural Earth-derived
  `public/map/world-land.json`, used for the ivory land fill.
- The live globe draws a generated canvas texture from those rings. Country
  borders are separate line geometry. Highlighted countries are drawn into a
  second texture and their borders into a raised line geometry.
- Marker coordinates come directly from the existing KASANE destination
  records (`coordinates.lat`, `coordinates.lng`, `countryCode`) in
  `src/data/destinations.part*.ts`; there is no duplicated globe-only place
  list.
- Conversion is a real spherical conversion, shared by the sphere UVs and the
  markers (`latLngToVector`, `focusRotation` in `globeData.ts`). Destination
  country highlights are resolved through the same ISO alpha-2 codes as the
  destination data.
- Events come from `src/data/events.ts` and `upcomingEvents`; no event is
  invented for a scene.

The 110m dataset intentionally omits very small states. Malta is the one
KASANE destination affected: Valletta has a correctly positioned marker and a
field guide, but Malta has no polygon in this dataset, so it does not receive a
country fill. This is recorded as a limitation rather than hidden.

The reduced-motion and no-WebGL still (`public/map/globe-still.svg` /
`.webp`) is generated from the same Natural Earth land and country data by
`scripts/build-globe-still.mjs`. It is a real orthographic atlas plate, not a
stock illustration.

## 5. The interactive atlas

The last scene does not swap in a second globe. The same Canvas remains:

- `OrbitControls` is disabled during the narrative and enabled when
  `interactive` is true.
- Drag rotates; wheel and pinch zoom within `minDistance: 2.2` and
  `maxDistance: 5.2`; panning is disabled; polar angles are clamped so the
  globe cannot be rolled upside down.
- Damping is `0.065`; rotation speed is `0.42`; zoom speed is `0.55`.
- While the pointer is over the globe on a fine-pointer device, Lenis is
  stopped so the wheel belongs to the globe. Leaving the globe restores the
  document scroll. This was verified: wheel input changed the scene but left
  page scroll at the pinned position.
- Markers scale with damping on hover and selection. Only the hovered or
  selected destination gets an HTML label, with name and coordinates.
- The preview panel shows a real destination image, category, country/region,
  editorial line, next event when present, and a link to the existing
  `/destinations/:slug` page.
- The atlas exposes these filter groups from KASANE's data: All,
  Architecture, Culture, Nature, History, Food, Events. Events is derived from
  upcoming events and returns destinations with event records.
- The search control is modelled on the live Airbnb search: a row of category
  tabs above a floating cream segmented bar. KASANE's bar uses `Where`
  (destination name, country or region) and `Interest` (the active category),
  with a hairline divider and a circular gold submit button. It contains no
  Airbnb branding or assets.
- Clicking or typing in `Where` opens an in-flow cream panel below the bar. It
  shows up to five matching destinations with a thumbnail, country/region and
  upcoming-event count, then interest chips when the query is empty. The
  `Interest` segment opens a two-column category grid with live counts. Both
  panel states hide the index and preview while open, so the panel is the
  single focus rather than a layer over duplicate controls.
- The panel is not a free-floating overlay. It adds height in normal flow and
  the bottom-anchored console grows upward, adapting the 21st.dev expandable
  search pattern to the stage. This keeps every result inside the viewport at
  short desktop heights and inside the scrollable mobile sheet.
- Keyboard and pointer behaviour: `ArrowDown` moves from the field to the first
  result/category; `Enter` selects the first match; `Escape` closes the panel
  and returns focus to the segment that opened it; pointer-down outside closes
  it; the clear button empties the query without closing the panel. Tab order
  follows the visible controls.
- Selecting a result starts a 0.9-second camera flight to the destination;
  `OrbitControls` is briefly paused so the controlled flight and the user
  cannot fight. The index and preview return after selection.
- Clicking a marker selects it; clicking empty space closes the preview.
- On mobile, the chapter rail is replaced by the progress rule and the explore
  sheet stacks the search tabs, segmented bar, optional search panel, a 14-place
  index and the selected preview. The interest grid becomes two columns and
  drops the category notes so all seven categories fit without clipping. The
  sheet scrolls within a 54svh cap; the page itself does not overflow
  horizontally.

## 6. Performance, fallbacks and accessibility

- The Canvas is lazy-loaded with `React.lazy` and `Suspense`.
- WebGL availability is checked before mounting the Canvas. A failed geometry
  fetch also falls back to the still.
- `frameloop` is `always` only while the stage is in view and `never`
  otherwise.
- DPR is capped at `1.75` on a high-quality desktop and `1.35` elsewhere.
- Globe texture width is `3072` on high quality and `2048` on low; sphere
  segments are `128` and `72`; highlight textures are `2048` and `1024`.
- The scene uses two directional lights, ambient light, one sphere, one border
  line set and 14 marker groups. No post-processing is used. `AdaptiveDpr`
  handles frame pressure.
- Inactive chapters use `aria-hidden` and `inert`; the inactive explore shell
  is also `inert`. The current chapter is announced through a polite
  screen-reader status.
- `prefers-reduced-motion` removes the pinned scrub narrative and renders a
  static editorial atlas: six story chapters, the static globe, the full
  searchable destination list and the coda. No 3D canvas is mounted.
- If WebGL is unavailable, the pinned narrative still runs with the generated
  static globe; all seven chapters, the 14-place list, filters, search and
  links remain available.
- Hero videos are poster-backed, muted, `playsInline`, preload the next clip,
  and do not autoplay when reduced motion is requested. The poster remains the
  fallback if playback is refused.

## 7. Video overhaul

The complete manifest is in `docs/video-manifest.md`.

- All six hero clips were rebuilt from the local high-resolution Pexels
  masters, not from the previous low-quality web encodes.
- Presentation masters: 1920×1080 H.264 High, 30fps, yuv420p,
  `+faststart`; CRF 23, maxrate 9M.
- Mobile: 1280×720 H.264 High, 30fps, CRF 25, maxrate 3.5M.
- Posters are 1920×1080 frames from the same masters.
- Old `.webm` derivatives were removed; the page now uses one MP4 per clip
  with no dead WebM source path.
- The playlist uses two stacked video layers, keeps the outgoing layer until
  the incoming film is running, and preloads the next clip. The poster sits
  behind the video so a refused autoplay never produces a black hero.
- The clip at 6s of every final desktop delivery was inspected as a contact
  sheet. No watermarks or platform overlays were visible; each clip is sharp
  enough at 1080p and matches its intended place.

Master resolutions were measured from the local files, not inferred from the
listing: Rajasthan, Iceland, Switzerland and Seoul are 3840×2160; Italy is
2560×1440; Kyoto is 1920×1080. Delivery is 1080p, not 4K.

## 8. Files

New globe and motion components:

- `src/components/globe/GlobeJourney.tsx`
- `src/components/globe/GlobeScene.tsx`
- `src/components/globe/GlobeCanvas.tsx`
- `src/components/globe/GlobeStill.tsx`
- `src/components/globe/globeData.ts`
- `src/components/globe/worldScenes.ts`
- `src/components/globe/WorldExplore.tsx`
- `src/components/motion/WordReveal.tsx`

New data and fallback assets:

- `public/map/globe-countries.json`
- `public/map/globe-still.svg`
- `public/map/globe-still.webp`
- `scripts/build-globe-still.mjs`

Modified integration, styling and media:

- `src/pages/Home.tsx` — renders `GlobeJourney`
- `src/styles/globals.css` — globe narrative, interactive atlas, mobile,
  reduced-motion, coda and page-enter fixes
- `src/components/layout/Nav.tsx` — dark nav surface during the atlas and
  afterword
- `src/data/hero.ts` — verified source/creator/licence/link metadata
- `src/components/home/Hero.tsx` — MP4-only sources, verified links, reduced
  motion poster fallback
- `src/pages/CreditsPage.tsx` — film credits with creator and source page
- `public/media/hero/*.mp4`, `*-mobile.mp4`, `*-poster.jpg` — rebuilt delivery
- `scripts/encode-hero.mjs` — reproducible 1080p/720p encode
- removed: old `public/media/hero/*.webm`

Supporting integration that predates V3 but is used by it:

- `src/hooks/useSmoothScroll.ts`
- `src/components/layout/SmoothScroll.tsx`
- `src/lib/motion.ts`

Verification script for this change:

- `tmp/v3/test-search.mjs` — 16-check desktop, reduced-motion and mobile
  interaction suite for the segmented search, panel, keyboard and filtering
  behaviour

## 9. Verification performed

Run on 12 November 2026 against the Vite dev server at
`http://127.0.0.1:5323/`, headless Chrome with SwiftShader for WebGL.

| Check | Result |
| --- | --- |
| TypeScript (`npm run typecheck`) | Passed |
| Production build (`npm run build`) | Passed |
| Hero video element | `kyoto.mp4`, 1920×1080, duration 12s, readyState 4, muted, `playsInline`, playing |
| Narrative scenes | 7/7 reached; scene titles and progress update at the end of each scroll segment |
| Markers | 14 destination records rendered; scene subsets appear per chapter |
| Filters | Events filter returned 12 destinations with upcoming events; All restored 14 |
| Search | New `Where` field typed “Reykjavik”; one result row returned; selection opened the Reykjavík preview, marker label on screen, link `/destinations/reykjavik` |
| Search appearance | Desktop segmented bar measured 819×52px, 999px radius, cream background; seven tabs and the circular submit were present |
| Search panel | Interest panel showed seven categories and hid the index; Escape closed it and returned focus to the Interest segment; Nature tab returned five places; Enter selected Kyoto; outside click closed the panel |
| Camera flight | Reykjavík marker label stayed visible after the camera flight and finished inside the viewport; preview and destination link were correct |
| Drag | Screenshot changed after drag on the canvas |
| Zoom | Screenshot changed after wheel zoom; page scroll stayed at the pinned position |
| Destination navigation | Preview link navigated to `/destinations/reykjavik` |
| Coda | 10 word spans, all revealed; dark nav surface active over the afterword |
| Reduced motion | Static atlas, 6 chapters, static globe, 14-place explore list, 6 posters, 6 paused videos, 0 canvases, no overflow; interest panel 725px wide, right edge 1208px, no horizontal overflow |
| No WebGL | 0 canvases, static globe present, 7 chapters, 14 explore items, no console errors |
| Mobile 390×844 | Search bar 340px wide inside the 390px viewport; interest panel 340×242px ended at 795px, inside the 844px viewport; Culture returned nine places; Kyoto result selection opened the preview and link; no horizontal overflow at narrative or interactive phases |
| Console/page errors | None in desktop, reduced-motion, no-WebGL or mobile runs |
| ESLint, V3 files | Passed for `GlobeCanvas`, `GlobeJourney`, `GlobeScene`, `WordReveal` and `Hero`. Repo-wide lint still reports pre-existing compiler-rule errors in `AtlasMap` and the unused V2 `AtlasGlobe`/`GlobeSection`; those files are outside this change |

The tests were interaction checks in headless Chrome, not a performance
measurement on real GPUs. Frame rate, battery cost and touch feel on physical
iOS/Android hardware have not been measured.

The focused search suite (`tmp/v3/test-search.mjs`) ran 16 checks across
desktop, reduced-motion and mobile: 16 passed, 0 failed. It covers the visual
segmented bar, interest-panel focus return, real typing, result selection,
category filtering, Enter, outside click, reduced-motion fit and mobile fit.

## 10. Remaining limitations

- Delivery video is 1080p desktop / 720p mobile. Four source masters are 4K,
  one is 1440p, one is 1080p, but no 4K delivery file is shipped.
- Natural Earth 1:110m is a deliberately simplified dataset; small islands and
  microstates can be absent. Malta has a marker but no country polygon.
- WebGL is required for the interactive globe. The no-WebGL experience retains
  the narrative and complete destination index but is not rotatable.
- Reduced motion uses the static atlas by design; there is no 3D interaction in
  that branch.
- Search is client-side across the 14 destinations and their event records. It
  is not natural-language search, it has no saved/recent searches, and it does
  not include the two interest taxonomies (`cities`, `art`) that are not exposed
  as globe filters.
- The headless SwiftShader runs verify behaviour and rendering, not real-device
  frame rate.
- The production build warns about large chunks (`AtlasMap` 1.09 MB, `extends`
  931 kB, main `index` 830 kB). The globe, MapLibre map and GSAP/motion code
  are already split into lazy route/scene chunks; the warning is not a failed
  build.
- Vanta was inspected and rejected. There is no Vanta runtime dependency.
