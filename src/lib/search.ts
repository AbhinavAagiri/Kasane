import { curatedCollections } from '@/data/collections';
import { destinations } from '@/data/destinations';
import { stories } from '@/data/stories';

export type SearchHit = {
  kind: 'destination' | 'story' | 'collection';
  slug: string;
  title: string;
  meta: string;
  line: string;
  image: string;
  href: string;
};

const normalise = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const searchHits: SearchHit[] = [
  ...destinations.map<SearchHit>((destination) => ({
    kind: 'destination',
    slug: destination.slug,
    title: destination.name,
    meta: destination.country,
    line: destination.line,
    image: destination.image.src,
    href: `/destinations/${destination.slug}`,
  })),
  ...stories.map<SearchHit>((story) => ({
    kind: 'story',
    slug: story.slug,
    title: story.title,
    meta: story.categories.join(', '),
    line: story.standfirst,
    image: story.image.src,
    href: `/journal/${story.slug}`,
  })),
  ...curatedCollections.map<SearchHit>((collection) => ({
    kind: 'collection',
    slug: collection.slug,
    title: collection.title,
    meta: 'Curated collection',
    line: collection.description,
    image: collection.image.src,
    href: `/collections/${collection.slug}`,
  })),
];

const haystack = new Map<string, string>(
  searchHits.map((hit) => {
    const source =
      hit.kind === 'destination'
        ? [
            hit.title,
            hit.meta,
            hit.line,
            ...destinations
              .filter((destination) => destination.slug === hit.slug)
              .flatMap((destination) => [
                destination.region,
                ...destination.interests,
                ...destination.places.map((place) => place.name),
              ]),
          ]
        : hit.kind === 'story'
          ? [
              hit.title,
              hit.meta,
              hit.line,
              ...stories
                .filter((story) => story.slug === hit.slug)
                .flatMap((story) => [
                  story.destinationSlug,
                  ...story.categories,
                  ...story.blocks
                    .filter((block) => block.type === 'paragraph')
                    .map((block) => block.text),
                ]),
            ]
          : [hit.title, hit.meta, hit.line];
    return [`${hit.kind}:${hit.slug}`, normalise(source.join(' '))];
  }),
);

export const searchAtlas = (query: string, limit = 8): SearchHit[] => {
  const term = normalise(query.trim());
  if (!term) return [];
  const words = term.split(/\s+/).filter(Boolean);
  return searchHits
    .map((hit) => {
      const text = haystack.get(`${hit.kind}:${hit.slug}`) ?? '';
      const title = normalise(hit.title);
      let score = 0;
      if (title === term) score += 40;
      if (title.startsWith(term)) score += 24;
      if (title.includes(term)) score += 14;
      if (words.every((word) => text.includes(word))) score += 8;
      if (words.some((word) => title.includes(word))) score += 4;
      return { hit, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.hit);
};

export const searchSuggestions = [
  { label: 'Kyoto', href: '/destinations/kyoto' },
  { label: 'Iceland', href: '/explore?q=Iceland' },
  { label: 'Architecture', href: '/explore?interest=architecture' },
  { label: 'Slow travel', href: '/journal/a-slower-journey-through-the-italian-countryside' },
  { label: 'Coastal places', href: '/collections/coastal-light' },
] as const;
