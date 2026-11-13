import type { Destination } from '@/data/types';

export const destinationsPartFour: Destination[] = [
  {
    slug: 'paris',
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    region: 'Île-de-France',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    character: 'urban',
    hiddenGem: false,
    line: 'A city that is most itself between the monuments.',
    summary:
      'Paris is not a museum you queue for; it is a dense, lived-in city of courtyards, markets, river light and argument. The useful way in is through a neighbourhood, then another.',
    body: [
      'The postcard version of Paris is vertical: towers, domes, a river. The lived city is horizontal — a bench, a bakery queue, a passage cut through a block, the green edge of a canal. Its beauty is civic before it is monumental.',
      'Haussmann’s boulevards gave the centre its famous regularity, but the city resists being reduced to one plan. Courtyards hide workshops, markets run on their own clocks, and the Seine still works as a seam between two ways of being in the city.',
    ],
    image: {
      src: 'dest-paris',
      alt: 'Paris rooftops and chimney pots under a pale evening sky',
    },
    secondaryImage: {
      src: 'dest-paris-b',
      alt: 'A quiet Parisian street with stone facades and a neighbourhood café',
    },
    interests: ['architecture', 'art', 'food', 'cities', 'history', 'culture'],
    bestSeason: 'May to June, or September to October',
    suggestedDays: 4,
    layers: [
      {
        title: 'The city as a set of rooms',
        kind: 'architecture',
        layout: 'split',
        body: 'Paris is an interior city. A street door opens onto a courtyard; the courtyard opens onto stairs; the stairs lead to a room with a particular kind of light. The grand set pieces matter less than this sequence, which repeats across the centre and gives the city its intimacy.',
      },
      {
        title: 'Looking, then looking again',
        kind: 'art',
        layout: 'quiet',
        body: 'The Louvre is an appetite; the smaller collections are a discipline. Choose one room and stay too long in it. The city rewards the visitor who returns to the same painting, the same square, the same bridge at a different hour.',
      },
      {
        title: 'The market is the map',
        kind: 'food',
        layout: 'quiet',
        image: {
          src: 'dest-paris-b',
          alt: 'A quiet Parisian street with stone facades and a neighbourhood café',
        },
        body: 'Bread, cheese, fish, flowers, a rotisserie chicken turning behind glass. Parisian food is regional produce organised by neighbourhood ritual. Shop in the morning, cook if you can, and treat lunch as a proper pause rather than an interruption.',
      },
      {
        title: 'The river, and the edge',
        kind: 'cities',
        layout: 'quiet',
        body: 'The Seine is the city’s most democratic room. Joggers, anglers, readers, lovers and teenagers share its banks. Walk one stretch at dusk without crossing, and the city’s scale — domestic, civil, a little melancholy — becomes clear.',
      },
    ],
    places: [
      {
        name: 'Sainte-Chapelle',
        kind: 'architecture',
        note: 'Thirteen windows and almost no wall. Go early, sit down and let your eyes adjust.',
        coordinates: { lat: 48.8554, lng: 2.345 },
      },
      {
        name: 'Musée de l’Orangerie',
        kind: 'art',
        note: 'Two oval rooms for the Water Lilies, plus a small, excellent modern collection below.',
        coordinates: { lat: 48.8638, lng: 2.3226 },
      },
      {
        name: 'Marché d’Aligre',
        kind: 'food',
        note: 'A working market with a covered hall, street stalls and a square that stays busy.',
        coordinates: { lat: 48.8496, lng: 2.3785 },
      },
      {
        name: 'Canal Saint-Martin',
        kind: 'cities',
        note: 'Iron footbridges, plane trees and the slow choreography of a lock filling.',
        coordinates: { lat: 48.871, lng: 2.365 },
      },
      {
        name: 'Palais de Tokyo',
        kind: 'art',
        note: 'A raw concrete shell for contemporary art, open late and usefully unpredictable.',
        coordinates: { lat: 48.8642, lng: 2.2965 },
      },
    ],
    storySlugs: [],
    related: ['florence', 'lisbon'],
  },
  {
    slug: 'seoul',
    name: 'Seoul',
    country: 'South Korea',
    countryCode: 'KR',
    region: 'Seoul Capital Area',
    coordinates: { lat: 37.5665, lng: 126.978 },
    character: 'urban',
    hiddenGem: false,
    line: 'A city that changes speed every few blocks — and expects you to keep up.',
    summary:
      'Seoul is a city of compressed time: palace courtyards, postwar markets, glass towers and mountains, sometimes in the same view. Its culture is generous, fast and deeply social, with a long memory underneath.',
    body: [
      'Seoul does not separate old and new into districts. A seventeenth-century palace wall ends at a boulevard; a market built around a riverbed sits below a tower of screens. The effect is not pastiche but density — several cities occupying one geography.',
      'The city’s rhythm is social. Meals are shared from the centre of the table, cafés are places to be seen and to work, and the evening extends in waves. Underneath it all, the mountains are never entirely out of sight, and the older grammar of Confucian respect still shapes how people speak to one another.',
    ],
    image: {
      src: 'dest-seoul',
      alt: 'A traditional Korean palace pavilion at Gyeongbokgung, Seoul',
    },
    secondaryImage: {
      src: 'dest-seoul-b',
      alt: 'Layered hanok rooftops in Bukchon, Seoul',
    },
    interests: ['architecture', 'food', 'cities', 'culture', 'history', 'art'],
    bestSeason: 'April to May, or October to early November',
    suggestedDays: 4,
    layers: [
      {
        title: 'Five palaces, one grid',
        kind: 'history',
        layout: 'split',
        body: 'The Joseon capital was organised around royal precincts, ancestral rites and the geometry of the mountain behind. Gyeongbokgung is the set piece, but the smaller palaces and the surviving hanok lanes are better at showing how the old city fit together. Look for the axis, not just the gate.',
      },
      {
        title: 'The table belongs to everyone',
        kind: 'food',
        layout: 'quiet',
        body: 'Korean food is built for sharing: banchan spread across the table, a single pot at the centre, rice and soup as anchors. Seoul compresses regional cooking into a market and a late-night street. Gwangjang is the obvious starting point; a neighbourhood market is usually the better meal.',
      },
      {
        title: 'Making, at speed',
        kind: 'culture',
        layout: 'quiet',
        image: {
          src: 'dest-seoul-b',
          alt: 'Layered hanok rooftops in Bukchon, Seoul',
        },
        body: 'Ceramics, paper, metalwork and textiles survive in small studios, often run by people who left corporate jobs to work with their hands. The city’s craft is not a folk exhibit; it is contemporary practice, sold in design shops and used at home.',
      },
      {
        title: 'Night as a public room',
        kind: 'cities',
        layout: 'quiet',
        body: 'Seoul after dark is not a separate economy; it is the same city with the lights on. Food stalls, convenience stores, late cafés, noraebang and the Han River parks keep the public realm open. The useful move is to walk one neighbourhood until it begins to repeat, then eat.',
      },
    ],
    places: [
      {
        name: 'Gyeongbokgung',
        kind: 'history',
        note: 'The main palace; arrive for the changing of the guard, then walk the side courtyards.',
        coordinates: { lat: 37.5796, lng: 126.977 },
      },
      {
        name: 'Bukchon Hanok Village',
        kind: 'architecture',
        note: 'Lanes of traditional houses; it is a residential area, so keep voices low.',
        coordinates: { lat: 37.5826, lng: 126.983 },
      },
      {
        name: 'Leeum Museum of Art',
        kind: 'art',
        note: 'Three architects, one hillside, and a collection that moves from celadon to contemporary.',
        coordinates: { lat: 37.5385, lng: 126.999 },
      },
      {
        name: 'Gwangjang Market',
        kind: 'food',
        note: 'Bindaetteok, mayak gimbap and a long counter of knife-cut noodles.',
        coordinates: { lat: 37.57, lng: 126.9994 },
      },
      {
        name: 'Seongsu-dong',
        kind: 'cities',
        note: 'Old shoe factories, new bakeries and a riverside walk at the edge of the city.',
        coordinates: { lat: 37.5445, lng: 127.0557 },
      },
      {
        name: 'Namsan Park',
        kind: 'nature',
        note: 'A wooded ridge in the middle of the city, with a slow climb and a clean view back.',
        coordinates: { lat: 37.5512, lng: 126.9882 },
      },
    ],
    storySlugs: [],
    related: ['kyoto', 'new-york'],
  },
];
