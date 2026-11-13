import { site } from '@/data/site';
import {
  countries,
  countrySlug,
  destinationBySlug,
  destinations,
  type Country,
} from '@/data/destinations';
import { curatedCollections, curatedCollectionBySlug } from '@/data/collections';
import { upcomingEvents, type AtlasEvent } from '@/data/events';
import { stories, storyBySlug } from '@/data/stories';
import type { CuratedCollection, Destination, Story } from '@/data/types';

export type JsonLdObject = Record<string, unknown>;
export type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export type RouteMeta = {
  path: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  type: 'website' | 'article';
  noindex?: boolean;
  jsonLd: JsonLdObject[];
  priority: number;
  changefreq: ChangeFrequency;
};

const ROOT = site.url.replace(/\/+$/, '');
const WEBSITE_ID = `${ROOT}/#website`;
const ORGANIZATION_ID = `${ROOT}/#organization`;
const DEFAULT_IMAGE = '/images/og-kasane.jpg';
const DEFAULT_IMAGE_ALT =
  'KASANE, an editorial atlas of places, cultures and landscapes in layers';
const HOME_DESCRIPTION =
  'An independent editorial atlas of 24 places across 22 countries: architecture, culture, landscape, food and the festivals that change them.';
const IMAGE_WIDTH = 1600;

const cleanPath = (path: string) => {
  const withoutQuery = path.split(/[?#]/)[0] ?? '/';
  const normalised = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
  return normalised === '/' ? '/' : normalised.replace(/\/+$/, '');
};

export const canonicalUrl = (path: string) => {
  const clean = cleanPath(path);
  return clean === '/' ? `${ROOT}/` : `${ROOT}${clean}`;
};

export const absoluteAsset = (path: string) =>
  /^https?:\/\//i.test(path) ? path : `${ROOT}${path.startsWith('/') ? path : `/${path}`}`;

export const socialImage = (name: string) =>
  name.startsWith('/') ? name : `/images/${name}-${IMAGE_WIDTH}.jpg`;

const clip = (text: string, length = 158) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length - 1).replace(/\s+\S*$/, '')}…`;
};

const websiteRef = { '@id': WEBSITE_ID };
const organizationRef = { '@id': ORGANIZATION_ID };

const webPage = (meta: Pick<RouteMeta, 'path' | 'title' | 'description' | 'image'>) => ({
  '@type': 'WebPage',
  '@id': `${canonicalUrl(meta.path)}#webpage`,
  url: canonicalUrl(meta.path),
  name: meta.title,
  description: meta.description,
  inLanguage: 'en',
  isPartOf: websiteRef,
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: absoluteAsset(meta.image),
  },
});

const homepageGraph: JsonLdObject[] = [
  {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: site.name,
    url: canonicalUrl('/'),
    description: site.description,
    image: absoluteAsset(DEFAULT_IMAGE),
  },
  {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: site.name,
    alternateName: 'KASANE Atlas',
    url: canonicalUrl('/'),
    description: site.description,
    inLanguage: 'en',
    publisher: organizationRef,
  },
  {
    ...webPage({
      path: '/',
      title: 'KASANE — The World in Layers | Worldwide Travel Atlas',
      description: HOME_DESCRIPTION,
      image: DEFAULT_IMAGE,
    }),
    about: organizationRef,
  },
];

const page = (
  input: Omit<RouteMeta, 'jsonLd' | 'priority' | 'changefreq' | 'image' | 'imageAlt' | 'type'> &
    Partial<Pick<RouteMeta, 'image' | 'imageAlt' | 'type'>> & {
      jsonLd?: JsonLdObject[];
      priority?: number;
      changefreq?: ChangeFrequency;
    },
): RouteMeta => ({
  image: DEFAULT_IMAGE,
  imageAlt: DEFAULT_IMAGE_ALT,
  type: 'website',
  priority: 0.5,
  changefreq: 'monthly',
  ...input,
  description: clip(input.description),
  jsonLd: input.jsonLd ?? [],
});

const privatePage = (input: {
  path: string;
  title: string;
  description: string;
  changefreq?: ChangeFrequency;
}): RouteMeta => ({
  ...page({ ...input, noindex: true }),
  priority: 0,
  changefreq: input.changefreq ?? 'yearly',
});

const destinationPage = (destination: Destination): RouteMeta => {
  const path = `/destinations/${destination.slug}`;
  const url = canonicalUrl(path);
  const image = socialImage(destination.image.src);
  const meta = page({
    path,
    title: `Explore ${destination.name} — Places, Culture & Travel Guide | KASANE`,
    description: destination.summary,
    image,
    imageAlt: destination.image.alt,
    type: 'article',
    priority: 0.8,
    changefreq: 'yearly',
    jsonLd: [
      webPage({
        path,
        title: `Explore ${destination.name} — Places, Culture & Travel Guide | KASANE`,
        description: clip(destination.summary),
        image,
      }),
      {
        '@type': 'Place',
        '@id': `${url}#place`,
        name: destination.name,
        description: destination.summary,
        url,
        image: absoluteAsset(image),
        address: {
          '@type': 'PostalAddress',
          addressLocality: destination.name,
          addressRegion: destination.region,
          addressCountry: destination.countryCode,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: destination.coordinates.lat,
          longitude: destination.coordinates.lng,
        },
      },
    ],
  });
  return meta;
};

const countryPage = (country: Country): RouteMeta => {
  const slug = countrySlug(country.name);
  const path = `/countries/${slug}`;
  const url = canonicalUrl(path);
  const names = country.destinations.map((destination) => destination.name);
  const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0];
  const image = socialImage(country.destinations[0]?.image.src ?? 'atlas-hero');
  const title = `Explore ${country.name} — Regions, Destinations & Places | KASANE`;
  const description =
    country.destinations.length === 1
      ? `${country.name} in the KASANE atlas: ${list}. Read the field guide, places and cultural layers of this country.`
      : `Explore ${country.name} through ${country.destinations.length} KASANE field guides: ${list}. Places, culture, geography and the details that make each one itself.`;
  return page({
    path,
    title,
    description,
    image,
    imageAlt: country.destinations[0]?.image.alt ?? DEFAULT_IMAGE_ALT,
    priority: 0.7,
    changefreq: 'monthly',
    jsonLd: [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#collection`,
        url,
        name: title,
        description: clip(description),
        inLanguage: 'en',
        isPartOf: websiteRef,
        about: {
          '@type': 'Place',
          name: country.name,
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: country.destinations.length,
          itemListElement: country.destinations.map((destination, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: canonicalUrl(`/destinations/${destination.slug}`),
            name: destination.name,
          })),
        },
      },
    ],
  });
};

const storyPage = (story: Story): RouteMeta => {
  const path = `/journal/${story.slug}`;
  const url = canonicalUrl(path);
  const image = socialImage(story.image.src);
  return page({
    path,
    title: `${story.title} | KASANE Journal`,
    description: story.standfirst,
    image,
    imageAlt: story.image.alt,
    type: 'article',
    priority: 0.7,
    changefreq: 'yearly',
    jsonLd: [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: story.title,
        description: story.standfirst,
        url,
        mainEntityOfPage: url,
        image: absoluteAsset(image),
        inLanguage: 'en',
        articleSection: story.categories.join(', '),
        author: organizationRef,
        publisher: organizationRef,
        isPartOf: websiteRef,
      },
    ],
  });
};

const collectionPage = (collection: CuratedCollection): RouteMeta => {
  const path = `/collections/${collection.slug}`;
  const url = canonicalUrl(path);
  const image = socialImage(collection.image.src);
  const items = [
    ...collection.destinationSlugs
      .map((slug) => destinationBySlug[slug])
      .filter((destination): destination is Destination => Boolean(destination))
      .map((destination) => ({
        '@type': 'ListItem',
        url: canonicalUrl(`/destinations/${destination.slug}`),
        name: destination.name,
      })),
    ...collection.storySlugs
      .map((slug) => storyBySlug[slug])
      .filter((story): story is Story => Boolean(story))
      .map((story) => ({
        '@type': 'ListItem',
        url: canonicalUrl(`/journal/${story.slug}`),
        name: story.title,
      })),
  ].map((item, index) => ({ ...item, position: index + 1 }));
  return page({
    path,
    title: `${collection.title} — A KASANE Collection | KASANE`,
    description: collection.description,
    image,
    imageAlt: collection.image.alt,
    priority: 0.6,
    changefreq: 'yearly',
    jsonLd: [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#collection`,
        url,
        name: `${collection.title} — A KASANE Collection`,
        description: collection.description,
        inLanguage: 'en',
        isPartOf: websiteRef,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: absoluteAsset(image),
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: items.length,
          itemListElement: items,
        },
      },
    ],
  });
};

const eventPage = (event: AtlasEvent): RouteMeta => {
  const path = `/events/${event.slug}`;
  const url = canonicalUrl(path);
  const image = socialImage(event.image ?? destinationBySlug[event.destinationSlug]?.image.src ?? 'atlas-hero');
  const year = event.startDate.slice(0, 4);
  const title = `${event.name} ${year} — Dates, Venue & Guide | KASANE`;
  const isFree = event.tickets.status === 'free' || event.tickets.status === 'free-registration';
  return page({
    path,
    title,
    description: event.summary,
    image,
    imageAlt: destinationBySlug[event.destinationSlug]?.image.alt ?? DEFAULT_IMAGE_ALT,
    type: 'article',
    priority: 0.7,
    changefreq: 'monthly',
    jsonLd: [
      {
        '@type': 'Event',
        '@id': `${url}#event`,
        name: event.name,
        description: event.summary,
        url,
        startDate: event.startDate,
        endDate: event.endDate,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: event.venue,
          address: {
            '@type': 'PostalAddress',
            addressLocality: event.city,
            addressCountry: event.country,
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: event.coordinates.lat,
            longitude: event.coordinates.lng,
          },
        },
        image: absoluteAsset(image),
        ...(isFree ? { isAccessibleForFree: true } : {}),
        inLanguage: 'en',
      },
    ],
  });
};

export const homeMeta: RouteMeta = {
  ...page({
    path: '/',
    title: 'KASANE — The World in Layers | Worldwide Travel Atlas',
    description: HOME_DESCRIPTION,
    image: DEFAULT_IMAGE,
    priority: 1,
    changefreq: 'monthly',
    jsonLd: homepageGraph,
  }),
  imageAlt: DEFAULT_IMAGE_ALT,
};

export const exploreMeta = page({
  path: '/explore',
  title: `Explore the Atlas — ${destinations.length} Places, ${countries.length} Countries | KASANE`,
  description: `Search and filter ${destinations.length} destinations across ${countries.length} countries by interest, country and character. See them on a map or as an editorial grid.`,
  image: DEFAULT_IMAGE,
  priority: 0.9,
  changefreq: 'monthly',
  jsonLd: [
    webPage({
      path: '/explore',
      title: `Explore the Atlas — ${destinations.length} Places, ${countries.length} Countries | KASANE`,
      description: `Search and filter ${destinations.length} destinations across ${countries.length} countries by interest, country and character.`,
      image: DEFAULT_IMAGE,
    }),
    {
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl('/explore')}#collection`,
      url: canonicalUrl('/explore'),
      name: 'The KASANE atlas',
      description: `An editorial atlas of ${destinations.length} places in ${countries.length} countries.`,
      inLanguage: 'en',
      isPartOf: websiteRef,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: destinations.length,
        itemListElement: destinations.map((destination, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: canonicalUrl(`/destinations/${destination.slug}`),
          name: destination.name,
        })),
      },
    },
  ],
});

export const journalMeta = page({
  path: '/journal',
  title: 'KASANE Journal — Essays on Places, Culture & Architecture',
  description:
    'Slow essays on places, architecture, culture and nature from the KASANE editorial desk. Six field notes for a larger world.',
  priority: 0.8,
  jsonLd: [
    {
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl('/journal')}#collection`,
      url: canonicalUrl('/journal'),
      name: 'The KASANE Journal',
      description: 'Essays on places, architecture, culture and nature.',
      inLanguage: 'en',
      isPartOf: websiteRef,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: stories.length,
        itemListElement: stories.map((story, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: canonicalUrl(`/journal/${story.slug}`),
          name: story.title,
        })),
      },
    },
  ],
});

export const cultureMeta = page({
  path: '/culture',
  title: 'Culture — Beliefs, Rituals & Everyday Life | KASANE',
  description:
    'Beliefs, myths, traditions, food, craft, festivals and local life across the KASANE atlas — with myth distinguished from fact.',
  priority: 0.8,
  jsonLd: [
    webPage({
      path: '/culture',
      title: 'Culture — Beliefs, Rituals & Everyday Life | KASANE',
      description:
        'Beliefs, myths, traditions, food, craft, festivals and local life across the KASANE atlas.',
      image: DEFAULT_IMAGE,
    }),
  ],
});

export const eventsMeta = page({
  path: '/events',
  title: 'Cultural Events & Festivals Worth Planning Around | KASANE',
  description: `A checked calendar of ${upcomingEvents.length} cultural festivals, rituals, music and literary events across the atlas, with dates, sources and ticket notes.`,
  priority: 0.9,
  changefreq: 'weekly',
  jsonLd: [
    {
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl('/events')}#collection`,
      url: canonicalUrl('/events'),
      name: 'Events worth planning around',
      description: `A checked calendar of ${upcomingEvents.length} cultural events across the KASANE atlas.`,
      inLanguage: 'en',
      isPartOf: websiteRef,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: upcomingEvents.length,
        itemListElement: upcomingEvents.map((event, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: canonicalUrl(`/events/${event.slug}`),
          name: event.name,
        })),
      },
    },
  ],
});

export const collectionsMeta = page({
  path: '/collections',
  title: 'Collections — Curated Places & Stories | KASANE',
  description:
    'Curated and personal collections of places and stories — architecture, quiet escapes, coastal light and the journeys you are still planning.',
  priority: 0.7,
  jsonLd: [
    {
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl('/collections')}#collection`,
      url: canonicalUrl('/collections'),
      name: 'KASANE Collections',
      description: 'Curated and personal collections of places and stories.',
      inLanguage: 'en',
      isPartOf: websiteRef,
    },
  ],
});

export const planMeta = page({
  path: '/plan',
  title: 'Plan a Journey — Day-by-Day Itinerary | KASANE',
  description:
    'Build a day-by-day itinerary, add places and activities, estimate costs and print the plan. All saved locally in your browser.',
  priority: 0.6,
  jsonLd: [
    webPage({
      path: '/plan',
      title: 'Plan a Journey — Day-by-Day Itinerary | KASANE',
      description:
        'Build a day-by-day itinerary, add places and activities, estimate costs and print the plan.',
      image: DEFAULT_IMAGE,
    }),
  ],
});

export const aboutMeta = page({
  path: '/about',
  title: 'About KASANE — An Independent Editorial Atlas',
  description:
    'KASANE is an independent editorial atlas built around the idea that every place has layers: history, architecture, culture, nature and everyday life.',
  priority: 0.5,
  jsonLd: [
    webPage({
      path: '/about',
      title: 'About KASANE — An Independent Editorial Atlas',
      description:
        'An independent editorial atlas built around the idea that every place has layers.',
      image: DEFAULT_IMAGE,
    }),
  ],
});

export const creditsMeta = page({
  path: '/credits',
  title: 'Credits — Photography, Film, Maps & Typefaces | KASANE',
  description:
    'Photography, film, typefaces, map data and editorial sources for the KASANE atlas.',
  priority: 0.3,
  jsonLd: [
    webPage({
      path: '/credits',
      title: 'Credits — Photography, Film, Maps & Typefaces | KASANE',
      description: 'Photography, film, typefaces, map data and editorial sources for KASANE.',
      image: DEFAULT_IMAGE,
    }),
  ],
});

export const privacyMeta = page({
  path: '/privacy',
  title: "Privacy — What KASANE Stores and What It Doesn't",
  description:
    'KASANE stores saved places, collections and trips only in your browser. No account, no analytics, no advertising and no server-side profile.',
  priority: 0.3,
  jsonLd: [
    webPage({
      path: '/privacy',
      title: "Privacy — What KASANE Stores and What It Doesn't",
      description: 'How KASANE handles browser storage, third-party requests and personal data.',
      image: DEFAULT_IMAGE,
    }),
  ],
});

export const termsMeta = page({
  path: '/terms',
  title: 'Terms — Editorial Use, Accuracy & Liability | KASANE',
  description:
    'The terms for using KASANE: an independent editorial atlas and planning tool, not a booking service, with no price or availability guarantees.',
  priority: 0.3,
  jsonLd: [
    webPage({
      path: '/terms',
      title: 'Terms — Editorial Use, Accuracy & Liability | KASANE',
      description: 'The terms for using the KASANE editorial atlas and planning tools.',
      image: DEFAULT_IMAGE,
    }),
  ],
});

export const plannerMeta = privatePage({
  path: '/plan/new',
  title: 'Compose a Journey | KASANE',
  description:
    'Build a personal itinerary from the KASANE atlas. The planner runs locally in your browser, with no account and nothing sent anywhere.',
});

export const myWorldMeta = privatePage({
  path: '/my-world',
  title: 'My World — Your Saved Places & Journeys | KASANE',
  description:
    'Your saved places, reading, collections, trips and visited destinations. Stored in this browser, with no account.',
});

export const notFoundMeta = (path = '/404'): RouteMeta =>
  privatePage({
    path,
    title: 'Page Not Found | KASANE',
    description: 'This page is not in the KASANE atlas. Explore the places, stories and journeys that are.',
  });

export const collectionRouteMeta = (slug: string | undefined): RouteMeta => {
  const curated = slug ? curatedCollectionBySlug[slug] : undefined;
  if (curated) return collectionPage(curated);
  return privatePage({
    path: `/collections/${slug ?? ''}`,
    title: 'Collection | KASANE',
    description: 'A personal collection of places and stories from the KASANE atlas.',
  });
};

export const userCollectionMeta = (
  title: string | undefined,
  description: string | undefined,
  id?: string,
): RouteMeta =>
  privatePage({
    path: `/collections/${id ?? ''}`,
    title: title ? `${title} — Your Collection | KASANE` : 'Collection | KASANE',
    description: description || 'A personal collection of places and stories from the KASANE atlas.',
  });

export const destinationRouteMeta = (destination: Destination | undefined, slug?: string): RouteMeta =>
  destination ? destinationPage(destination) : notFoundMeta(`/destinations/${slug ?? ''}`);

export const countryRouteMeta = (country: Country | undefined, slug?: string): RouteMeta =>
  country ? countryPage(country) : notFoundMeta(`/countries/${slug ?? ''}`);

export const storyRouteMeta = (story: Story | undefined, slug?: string): RouteMeta =>
  story ? storyPage(story) : notFoundMeta(`/journal/${slug ?? ''}`);

export const eventRouteMeta = (event: AtlasEvent | undefined, slug?: string): RouteMeta =>
  event ? eventPage(event) : notFoundMeta(`/events/${slug ?? ''}`);

export const tripRouteMeta = (title: string | undefined, description: string | undefined, id?: string) =>
  privatePage({
    path: `/plan/${id ?? ''}`,
    title: title ? `${title} — Your Journey | KASANE` : 'Trip | KASANE',
    description: description || 'A day-by-day journey planned in KASANE.',
  });

export const publicRoutes: RouteMeta[] = [
  homeMeta,
  exploreMeta,
  ...countries.map(countryPage),
  ...destinations.map(destinationPage),
  journalMeta,
  ...stories.map(storyPage),
  cultureMeta,
  eventsMeta,
  ...upcomingEvents.map(eventPage),
  collectionsMeta,
  ...curatedCollections.map(collectionPage),
  planMeta,
  aboutMeta,
  creditsMeta,
  privacyMeta,
  termsMeta,
];

export const staticRoutes: RouteMeta[] = [...publicRoutes, plannerMeta, myWorldMeta];

export const prerenderPaths = staticRoutes.map((route) => route.path);

export const routeMetaForPublicPath = (path: string) =>
  publicRoutes.find((route) => route.path === cleanPath(path));

export const buildRouteLookup = () => new Map(publicRoutes.map((route) => [route.path, route]));
