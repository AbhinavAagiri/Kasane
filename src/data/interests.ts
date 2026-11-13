import type { Interest } from '@/data/types';

export const interests: Interest[] = [
  {
    id: 'architecture',
    label: 'Architecture & Design',
    description: 'Buildings that shape the way a place is lived in.',
    image: {
      src: 'interest-architecture',
      alt: 'A pale concrete modernist building against a clear sky',
    },
  },
  {
    id: 'culture',
    label: 'Culture & Heritage',
    description: 'Craft, ritual and the things a place passes down.',
    image: {
      src: 'interest-culture',
      alt: 'Marigold garlands and hanging ornaments at a market stall',
    },
  },
  {
    id: 'nature',
    label: 'Nature & Landscapes',
    description: 'Coast, mountain and the weather between them.',
    image: {
      src: 'interest-nature',
      alt: 'A waterfall dropping over a green cliff',
    },
  },
  {
    id: 'food',
    label: 'Food & Local Life',
    description: 'Markets, kitchens and the everyday table.',
    image: {
      src: 'interest-food',
      alt: 'A cook working at a busy street food stall',
    },
  },
  {
    id: 'cities',
    label: 'Cities & Neighbourhoods',
    description: 'The parts of a city that never make the postcard.',
    image: {
      src: 'interest-cities',
      alt: 'Apartment blocks along a quiet street at sunset',
    },
  },
  {
    id: 'art',
    label: 'Art & Experiences',
    description: 'Rooms and encounters worth making time for.',
    image: {
      src: 'interest-art',
      alt: 'A single large painting on the wall of a quiet gallery',
    },
  },
  {
    id: 'history',
    label: 'History & Places',
    description: 'What remains, and how it sits in the present.',
    image: {
      src: 'interest-history',
      alt: 'Ancient stone columns standing under an open sky',
    },
  },
];

export const interestById = Object.fromEntries(
  interests.map((interest) => [interest.id, interest]),
) as Record<Interest['id'], Interest>;
