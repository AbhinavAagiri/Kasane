import type { CuratedCollection } from '@/data/types';

export const curatedCollections: CuratedCollection[] = [
  {
    slug: 'architectural-wonders',
    title: 'Architectural wonders',
    description:
      'Stone, brick and concrete at the scale of a city — places where the built environment is the main event.',
    image: {
      src: 'dest-barcelona',
      alt: 'An aerial view of Barcelona’s Eixample grid',
    },
    destinationSlugs: [
      'barcelona',
      'matera',
      'valletta',
      'kyoto',
      'marrakech',
      'istanbul',
      'mexico-city',
      'athens',
      'cusco',
    ],
    storySlugs: ['the-quiet-architecture-of-kyoto', 'lisbon-read-in-tiles'],
  },
  {
    slug: 'southern-crossings',
    title: 'Southern crossings',
    description:
      'Highlands, islands and a city at the end of a continent — a southern route through very different climates.',
    image: {
      src: 'dest-queenstown',
      alt: 'Queenstown and Lake Wakatipu at dusk from Bob’s Peak',
    },
    destinationSlugs: ['cusco', 'ubud', 'cape-town', 'queenstown'],
    storySlugs: [],
  },
  {
    slug: 'somewhere-quiet',
    title: 'Somewhere quiet',
    description: 'For the weeks when the best plan is a small room, a long walk and very little else.',
    image: {
      src: 'dest-lucerne',
      alt: 'Lake Lucerne and the town beneath the mountains',
    },
    destinationSlugs: ['lucerne', 'essaouira', 'ghent', 'matera', 'ubud'],
    storySlugs: ['what-the-icelandic-light-does-to-a-landscape'],
  },
  {
    slug: 'coastal-light',
    title: 'Coastal light',
    description: 'Ports, ramparts and the particular clarity of a city that faces the sea.',
    image: {
      src: 'dest-essaouira',
      alt: 'Essaouira’s ramparts and cannons above the Atlantic',
    },
    destinationSlugs: ['lisbon', 'essaouira', 'valletta', 'reykjavik', 'cape-town'],
    storySlugs: ['lisbon-read-in-tiles'],
  },
  {
    slug: 'cities-for-a-long-weekend',
    title: 'Cities for a long weekend',
    description: 'Enough to fill three or four days, and enough left over to make you want to return.',
    image: {
      src: 'dest-new-york',
      alt: 'The Manhattan Bridge seen between brick buildings',
    },
    destinationSlugs: [
      'new-york',
      'lisbon',
      'barcelona',
      'florence',
      'hanoi',
      'bangkok',
      'istanbul',
      'mexico-city',
      'marrakech',
    ],
    storySlugs: ['new-york-in-layers'],
  },
  {
    slug: 'landscapes-of-the-north',
    title: 'Landscapes of the north',
    description: 'Cold water, long light and cities that have made peace with the weather.',
    image: {
      src: 'dest-reykjavik-b',
      alt: 'Reykjavík’s painted rooftops seen from above',
    },
    destinationSlugs: ['reykjavik', 'lucerne', 'ghent'],
    storySlugs: ['what-the-icelandic-light-does-to-a-landscape'],
  },
  {
    slug: 'a-week-in-japan',
    title: 'A week in Japan',
    description:
      'A slower reading of Kyoto: gardens, thresholds, workshops and the meals in between.',
    image: {
      src: 'dest-kyoto-b',
      alt: 'Raked gravel and a stone in a Kyoto garden',
    },
    destinationSlugs: ['kyoto'],
    storySlugs: ['the-quiet-architecture-of-kyoto'],
  },
];

export const curatedCollectionBySlug = Object.fromEntries(
  curatedCollections.map((collection) => [collection.slug, collection]),
) as Record<string, CuratedCollection | undefined>;
