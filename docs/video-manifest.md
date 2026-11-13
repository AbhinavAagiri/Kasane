# KASANE Globe Journey — Video Manifest

Last checked: 12 November 2026. All source pages, creators and masters were
verified against the local files and the public Pexels listing. The Pexels
License permits free use without attribution; KASANE credits every clip on the
Credits page.

## V5 placement

The homepage opens directly into one pinned globe journey. All four films stay
mounted so GSAP can choreograph their entrances, holds and exits against the
globe, but only the film for the active chapter plays. There is no carousel and
no crossfade. Inactive films have `preload="none"`; the active one loads `auto`.

| Chapter | Clip | Composition | Status |
| --- | --- | --- | --- |
| 02 · Japan | Kyoto | Right-hand editorial frame, opposite the Kyoto copy | Mounted, desktop + mobile; plays when Japan is active |
| 03 · India | Jaipur / Rajasthan | Full-bleed centerpiece beneath the India type | Mounted, desktop + mobile; plays when India is active |
| 04 · Europe | Positano / Italy | Small floating film over the Florence collage image | Mounted inside the Europe panel; plays when Europe is active |
| 05 · Nature | Iceland | Full-bleed landscape takeover | Mounted, desktop + mobile; plays when Nature is active |
| Library | Switzerland | — | Verified, retained, not mounted in V5 |
| Library | Seoul | — | Verified, retained, not mounted in V5 |

## Delivery recipe

- Desktop: 1920×1080, H.264 High, 30fps, yuv420p, CRF 23, maxrate 9M,
  `+faststart`, no audio.
- Mobile (`-mobile.mp4`, served at ≤767px): 1280×720, H.264 High, 30fps,
  yuv420p, CRF 25, maxrate 3.5M, `+faststart`, no audio.
- Posters: 1920×1080 JPEG cut from the same master. Each `<video>` also carries
  a poster so the frame is present before metadata or playback.
- Loading: all four elements are mounted for the pinned timeline, but only the
  active film has `preload="auto"` and plays. The others remain paused with
  `preload="none"`, so the next chapter fetches its own clip when it becomes
  active.
- Rebuild command: `node scripts/encode-hero.mjs`. Local masters are kept in
  `tmp/v2/hero-src` and are not deployed.
- Motion policy: the pinned journey and its mounted films are unconditional;
  there is no static reduced-motion edition.

## 1. Kyoto

| Field | Value |
| --- | --- |
| Files | `public/media/hero/kyoto.mp4` (4.8 MB), `kyoto-mobile.mp4` (1.9 MB), `kyoto-poster.jpg` (220 KB) |
| Placement | Chapter 02 · Japan, right-hand frame, desktop and mobile |
| Destination | Kyoto, Japan |
| Source page | https://www.pexels.com/video/traditional-stroll-in-historic-kyoto-street-31385441 |
| Creator | Ali Alcántara |
| Licence | Pexels License |
| Master | 1920×1080, 15.48s |
| Delivery | 1920×1080 at 3.33 Mbps / 1280×720 at 1.28 Mbps, 12.00s |
| Last checked | 2026-11-12 |

## 2. Jaipur

| Field | Value |
| --- | --- |
| Files | `public/media/hero/rajasthan.mp4` (4.7 MB), `rajasthan-mobile.mp4` (1.2 MB), `rajasthan-poster.jpg` (122 KB) |
| Placement | Chapter 03 · India, full-bleed film, desktop and mobile |
| Destination | Jaipur, India (Jal Mahal) |
| Source page | https://www.pexels.com/video/aerial-view-of-jal-mahal-in-jaipur-india-30640745 |
| Creator | Irphan Kathat |
| Licence | Pexels License |
| Master | 1920×1080, 9.60s (`tmp/v2/hero-src/rajasthan-alt.mp4`) |
| Delivery | 1920×1080 at 4.23 Mbps / 1280×720 at 1.02 Mbps, 9.20s |
| Last checked | 2026-11-12 |

The previous local `rajasthan.mp4` master was an aerial of Jaisalmer rooftops,
not Jal Mahal. It has been replaced by the verified Jaipur clip above. The
chapter caption and source metadata now match the delivered frames.

## 3. Positano / Italy

| Field | Value |
| --- | --- |
| Files | `public/media/hero/italy.mp4` (7.7 MB), `italy-mobile.mp4` (2.9 MB), `italy-poster.jpg` (369 KB) |
| Placement | Chapter 04 · Europe, floating inset over the collage, desktop and mobile |
| Destination | Positano, Italy; the film CTA opens the Italy view of the atlas |
| Source page | https://www.pexels.com/video/a-view-of-the-town-of-positano-italy-20156101 |
| Creator | K |
| Licence | Pexels License |
| Master | 2560×1440, 18.62s |
| Delivery | 1920×1080 at 5.37 Mbps / 1280×720 at 2.00 Mbps, 12.00s |
| Last checked | 2026-11-12 |

## 4. Iceland

| Field | Value |
| --- | --- |
| Files | `public/media/hero/iceland.mp4` (12 MB), `iceland-mobile.mp4` (4.9 MB), `iceland-poster.jpg` (815 KB) |
| Placement | Chapter 05 · Nature, full-bleed landscape, desktop and mobile |
| Destination | Icelandic waterfall landscape; the film CTA opens the Reykjavík field guide |
| Source page | https://www.pexels.com/video/aerial-view-of-majestic-icelandic-waterfall-37404986/ |
| Creator | Gylfi Gylfason |
| Licence | Pexels License |
| Master | 3840×2160, 24.72s |
| Delivery | 1920×1080 at 8.17 Mbps / 1280×720 at 3.37 Mbps, 12.03s |
| Last checked | 2026-11-12 |

The public listing names the subject generically as an Icelandic waterfall, not
a specific named falls; the chapter therefore does not assert a landmark name.

## 5. Switzerland

| Field | Value |
| --- | --- |
| Files | `public/media/hero/switzerland.mp4` (3.7 MB), `switzerland-mobile.mp4` (1.2 MB), `switzerland-poster.jpg` (248 KB) |
| Placement | Verified library clip; not mounted in the V5 journey |
| Destination | Swiss lake and mountain village; the library CTA opens the Lucerne field guide |
| Source page | https://www.pexels.com/video/aerial-view-of-swiss-lake-and-mountain-village-32665724 |
| Creator | Oskar Gross |
| Licence | Pexels License |
| Master | 3840×2160, 51.45s |
| Delivery | 1920×1080 at 2.54 Mbps / 1280×720 at 0.83 Mbps, 12.03s |
| Last checked | 2026-11-12 |

The public listing does not name the village or lake, so neither the site nor
this manifest claims a specific Swiss location.

## 6. Seoul

| Field | Value |
| --- | --- |
| Files | `public/media/hero/seoul.mp4` (13 MB), `seoul-mobile.mp4` (5.0 MB), `seoul-poster.jpg` (604 KB) |
| Placement | Verified library clip; not mounted in the V5 journey |
| Destination | Seoul, South Korea |
| Source page | https://www.pexels.com/video/a-busy-city-street-at-night-with-many-cars-26690702 |
| Creator | Timo Volz |
| Licence | Pexels License |
| Master | 3840×2160, 18.85s, 60fps source; delivery is re-timed to 30fps |
| Delivery | 1920×1080 at 8.72 Mbps / 1280×720 at 3.45 Mbps, 12.00s |
| Last checked | 2026-11-12 |

## Audit summary

| Check | Result |
| --- | --- |
| Resolution | Every desktop delivery is 1920×1080; every mobile delivery is 1280×720 |
| Watermarks / platform branding | None visible in the final delivery frames |
| Composition / relevance | Kyoto street, Jaipur aerial, Positano coast, Icelandic water; Swiss lake and Seoul night traffic preserved in the library |
| Playback | MP4 H.264, `+faststart`, muted, `loop`, `playsInline`, poster fallback |
| File weight | Desktop 3.7–13 MB; mobile 1.2–5.0 MB (the Jaipur cut is 9.2s, the other mounted cuts are 12s) |
| Active-film policy | All four are mounted; exactly one plays in the active chapter, the others are paused with `preload="none"` |
| Motion policy | Unconditional pinned journey; no reduced-motion edition |
| Removed | Previous `.webm` derivatives, the hero carousel and its `<source>` entries |
| Verification date | 2026-11-12 |

The old low-quality web encodes are no longer referenced. A contact sheet of
the final desktop deliveries was inspected at the 6-second mark; no watermark,
stretched frame or obviously degraded clip was present.
