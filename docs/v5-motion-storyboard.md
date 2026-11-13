# KASANE V5 — Motion Storyboard

Reference studied: https://lenis.dev/ (opened and reviewed at 1440×900). The
useful qualities are not its hand artwork but its structure: an independently
animated atmospheric field, oversized foreground typography crossing it, and
content that enters from beyond the frame while earlier content is still
leaving. KASANE applies that structure to an editorial atlas, not a tech demo.

## Principles

- One pinned stage, one persistent globe canvas, one continuous scroll progress
  value shared by the background and foreground.
- The globe has its own continuous life (drift, rotation, atmosphere) even when
  the reader stops.
- Every foreground element has its own entrance, hold and exit. No global
  fade-in.
- Animations overlap. A film can still be settling while the heading is already
  leaving; a new destination name can enter before the previous image has
  cleared.
- Compositions change in kind, not just in copy: a type-led opening, a film
  expanding into a frame, a full-bleed film, a photographic collage, a
  landscape takeover, a text-only atlas moment, then the interactive globe.
- Reverse scroll is the same timeline played backward. Nothing depends on
  scroll velocity for its final state.

## Scroll map

Desktop pin distance: 720% (8 viewport heights). Mobile: 540%. Timeline duration
is divided into seven equal scene beats; the final beat releases the atlas.

| Progress | Phase | Globe | Foreground |
| --- | --- | --- | --- |
| 0–12% | Arrival | Large, centred-right; slow autonomous yaw; strong atmosphere; Europe/Africa in view | Huge two-line serif title enters by masked rise; kicker and coordinates follow; thin rule draws; scroll cue appears. Title begins leaving at the end of the beat. |
| 12–29% | Japan | Moves to the right, slightly smaller; camera closes in; rotates to Kyoto; Japan highlight and marker appear | “JAPAN” crosses from the right edge; “KYOTO” and coordinate stack enter separately. Kyoto film starts as a small crop, expands into a right-hand frame and keeps a slight parallax. Copy enters from below on the left, so type and film occupy opposite sides. A second caption and a rule arrive late. Film and type exit in different directions. |
| 29–46% | India | Enlarges behind the foreground; sits near centre; camera widens; rotates to Jaipur; India highlight | Rajasthan film enters from a framed crop, expands to full-bleed, then holds. “INDIA” rises through the centre-left while “NO SINGLE IMAGE” enters from the right. A small Jaipur photograph overlaps the lower-right corner. Copy and coordinates sit in the dark lower band. Film clips away at the exit while the globe remains behind it. |
| 46–63% | Europe | Moves left and settles lower; moderate scale; rotates to Europe; several country markers | Photographic collage: Florence main image arrives from the right and overlaps the globe; Barcelona detail enters from below at centre; Lucerne strip drops in at upper left. “EUROPE” runs vertically at the right edge while “ONE CONTINENT, MANY GRAMMARS” sits lower left. The Italy film floats over the right edge of the Florence image. Each image exits on a different vector. |
| 63–79% | Nature | Expands behind the image; camera settles lower and wider; rotates to the Atlantic/north; nature markers | Iceland film takes the full viewport; “NATURE” enters from the left as an outline, “SETS THE TEMPO” follows as a smaller line. A Lucerne alpine inset overlaps the top-right. Copy and coordinates sit on the lower left. Film frame scales down and clears to reveal the globe again at the exit. |
| 79–90% | Layers | Returns to an offset left position, slightly larger; slow yaw; all destination markers; minimal highlights | Text-only moment. “THE WORLD / IS MORE THAN / A LIST” arrives line by line at different x positions. The eight KASANE layers stack in from alternating sides at the right, clear of the globe. A serif coda and small links hold. The list begins clearing before the final beat. |
| 90–100% | Interactive | Moves into its final right-of-centre position; camera settles; final orientation; user control enabled; highlighted destinations | Foreground type and details clear. Explore panel, reset control and instructions arrive. The globe’s own scroll rotation eases into OrbitControls without a canvas remount. |

## Implementation map

- `GlobeJourney.tsx` owns the single GSAP timeline, ScrollTrigger and the
  active chapter state. `scrub` is frame-rate independent; the same tween is
  played backward by reverse scrolling.
- `GlobeScene.tsx` reads scroll progress in R3F every frame, so the globe is
  continuous even when the timeline is between labelled scenes.
- `JourneyFilm.tsx` keeps all four films mounted for GSAP but plays only the
  active one; `preload` is `none` until a film becomes active.
- Scroll progress leaves the DOM timeline at 90%, where the globe hands over
  to OrbitControls without remounting the canvas. The final transition is
  explicitly resettled to the atlas orientation so a slow or fast approach
  reaches the same view.

## Globe motion track

Keyframed in `worldScenes.ts` and read by R3F every frame from a shared progress
ref:

- Latitude/longitude focus interpolated between chapters.
- Camera distance and FOV eased between wide, close and exploration views.
- Camera x/y offset for perspective, plus globe tilt and roll.
- A continuous slow drift added to the scroll-driven yaw so the globe is alive
  at rest.
- DOM media container animated separately through position, size and scale.
- Atmosphere/vignette and light intensity follow the same progress, with a
  constant low-frequency ambient pulse.
- Geographic highlight and marker set update per chapter; markers scale in on
  mount. The final chapter shows the full destination set.

## Foreground motion vocabulary

- Masked line rises for display type (different durations per line).
- Long horizontal translations for destination names.
- Clip-path/crop expansion for films and photography.
- Scale and aspect changes on film frames during transitions.
- Small insets that overlap the main image and the globe.
- Rules drawing horizontally or vertically.
- Coordinate stacks, captions and kickers that appear after the primary image,
  not with it.
- Different exits: type leaves upward, film clips down, photographs slide out
  on the opposite side from their entrance.
- Layer rows enter from alternating left/right with a stagger.

## Mobile direction

The same seven phases and the same timeline order, but the foreground is
recomposed rather than shrunk:

- Display type remains large but wraps in shorter lines.
- Japan film becomes a full-width frame below the title; India stays full-bleed;
  Europe keeps a three-image collage but drops the Lucerne strip back and lets
  the Italy film sit beneath Florence; Nature keeps a full-bleed frame; Layers
  becomes a two-column layer index above the progress line.
- Camera distances are slightly wider and the globe’s mobile scale is larger.
- Touch drag and pinch are enabled only on the final globe; `touch-action:none`
  prevents the page from scrolling under a gesture.
- Motion is unconditional for every visitor; there is no reduced-motion control or static edition.

## Accessibility

- The page is usable without the choreography: every chapter remains in the DOM
  with a heading, copy and destination links.
- Inactive panels are `inert` and `aria-hidden`.
- Only the arrival title is `h1`; chapters use `h2`.
- The exploration panel is inert until its final beat.
