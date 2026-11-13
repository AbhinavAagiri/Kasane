export type HeroClip = {
  id: string;
  place: string;
  country: string;
  region: string;
  caption: string;
  file: string;
  poster: string;
  destinationSlug: string;
  sourceId: string;
  sourcePage: string;
  creator: string;
  license: string;
  masterWidth: number;
  masterHeight: number;
  masterDuration: number;
  deliveryWidth: number;
  deliveryHeight: number;
  checkedAt: string;
  linkHref: string;
  linkLabel: string;
};

/**
 * Six original clips, cut to a single visual rhythm: warm stone, water,
 * aerial distance, night city. Every delivery is mastered from a locally
 * verified high-resolution source at 1080p; the mobile cut is 720p.
 *
 * Source metadata is checked against the public Pexels listing. The Pexels
 * pages are the canonical source; local masters are retained in tmp/v2/hero-src
 * for reproducibility and are not part of the deployed site.
 */
export const heroClips: HeroClip[] = [
  {
    id: 'kyoto',
    place: 'Kyoto',
    country: 'Japan',
    region: 'Kansai',
    caption: 'A garden kept for the turn of a season',
    file: 'kyoto',
    poster: '/media/hero/kyoto-poster.jpg',
    destinationSlug: 'kyoto',
    sourceId: '31385441',
    sourcePage: 'https://www.pexels.com/video/traditional-stroll-in-historic-kyoto-street-31385441',
    creator: 'Ali Alcántara',
    license: 'Pexels License',
    masterWidth: 1920,
    masterHeight: 1080,
    masterDuration: 15.48,
    deliveryWidth: 1920,
    deliveryHeight: 1080,
    checkedAt: '2026-11-12',
    linkHref: '/destinations/kyoto',
    linkLabel: 'Read the Kyoto field guide',
  },
  {
    id: 'rajasthan',
    place: 'Jaipur',
    country: 'India',
    region: 'Rajasthan',
    caption: 'Still water, and a palace that floats',
    file: 'rajasthan',
    poster: '/media/hero/rajasthan-poster.jpg',
    destinationSlug: 'jaipur',
    sourceId: '30640745',
    sourcePage: 'https://www.pexels.com/video/aerial-view-of-jal-mahal-in-jaipur-india-30640745',
    creator: 'Irphan Kathat',
    license: 'Pexels License',
    masterWidth: 1920,
    masterHeight: 1080,
    masterDuration: 9.6,
    deliveryWidth: 1920,
    deliveryHeight: 1080,
    checkedAt: '2026-11-12',
    linkHref: '/destinations/jaipur',
    linkLabel: 'Read the Jaipur field guide',
  },
  {
    id: 'italy',
    place: 'Positano',
    country: 'Italy',
    region: 'Amalfi Coast',
    caption: 'The Mediterranean, built into the rock',
    file: 'italy',
    poster: '/media/hero/italy-poster.jpg',
    destinationSlug: 'florence',
    sourceId: '20156101',
    sourcePage: 'https://www.pexels.com/video/a-view-of-the-town-of-positano-italy-20156101',
    creator: 'K',
    license: 'Pexels License',
    masterWidth: 2560,
    masterHeight: 1440,
    masterDuration: 18.62,
    deliveryWidth: 1920,
    deliveryHeight: 1080,
    checkedAt: '2026-11-12',
    linkHref: '/explore?country=Italy',
    linkLabel: 'Explore Italy',
  },
  {
    id: 'iceland',
    place: 'Iceland',
    country: 'Iceland',
    region: 'Iceland',
    caption: 'Water and weather, moving as one system',
    file: 'iceland',
    poster: '/media/hero/iceland-poster.jpg',
    destinationSlug: 'reykjavik',
    sourceId: '37404986',
    sourcePage: 'https://www.pexels.com/video/aerial-view-of-majestic-icelandic-waterfall-37404986/',
    creator: 'Gylfi Gylfason',
    license: 'Pexels License',
    masterWidth: 3840,
    masterHeight: 2160,
    masterDuration: 24.72,
    deliveryWidth: 1920,
    deliveryHeight: 1080,
    checkedAt: '2026-11-12',
    linkHref: '/destinations/reykjavik',
    linkLabel: 'Read the Reykjavík field guide',
  },
  {
    id: 'switzerland',
    place: 'Switzerland',
    country: 'Switzerland',
    region: 'Swiss Alps',
    caption: 'A lake held in the palm of a valley',
    file: 'switzerland',
    poster: '/media/hero/switzerland-poster.jpg',
    destinationSlug: 'lucerne',
    sourceId: '32665724',
    sourcePage: 'https://www.pexels.com/video/aerial-view-of-swiss-lake-and-mountain-village-32665724',
    creator: 'Oskar Gross',
    license: 'Pexels License',
    masterWidth: 3840,
    masterHeight: 2160,
    masterDuration: 51.45,
    deliveryWidth: 1920,
    deliveryHeight: 1080,
    checkedAt: '2026-11-12',
    linkHref: '/destinations/lucerne',
    linkLabel: 'Read the Lucerne field guide',
  },
  {
    id: 'seoul',
    place: 'Seoul',
    country: 'South Korea',
    region: 'Jongno',
    caption: 'The city that keeps moving after dark',
    file: 'seoul',
    poster: '/media/hero/seoul-poster.jpg',
    destinationSlug: 'seoul',
    sourceId: '26690702',
    sourcePage: 'https://www.pexels.com/video/a-busy-city-street-at-night-with-many-cars-26690702',
    creator: 'Timo Volz',
    license: 'Pexels License',
    masterWidth: 3840,
    masterHeight: 2160,
    masterDuration: 18.85,
    deliveryWidth: 1920,
    deliveryHeight: 1080,
    checkedAt: '2026-11-12',
    linkHref: '/destinations/seoul',
    linkLabel: 'Read the Seoul field guide',
  },
];
