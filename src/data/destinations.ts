import type { Destination, InterestId } from '@/data/types';
import { destinationsPartOne } from '@/data/destinations.part1';
import { destinationsPartTwo } from '@/data/destinations.part2';
import { destinationsPartThree } from '@/data/destinations.part3';
import { destinationsPartFour } from '@/data/destinations.part4';
import { destinationsPartFive } from '@/data/destinations.part5';
import { destinationsPartSix } from '@/data/destinations.part6';

export const destinations: Destination[] = [
  ...destinationsPartOne,
  ...destinationsPartTwo,
  ...destinationsPartThree,
  ...destinationsPartFour,
  ...destinationsPartFive,
  ...destinationsPartSix,
];

export const destinationBySlug = Object.fromEntries(
  destinations.map((destination) => [destination.slug, destination]),
) as Record<string, Destination | undefined>;

export type Country = {
  name: string;
  code: string;
  destinations: Destination[];
};

export const countries: Country[] = destinations.reduce<Country[]>((list, destination) => {
  const found = list.find((country) => country.code === destination.countryCode);
  if (found) found.destinations.push(destination);
  else
    list.push({
      name: destination.country,
      code: destination.countryCode,
      destinations: [destination],
    });
  return list;
}, []);

export const searchableCountries = countries
  .map((country) => country.name)
  .sort((a, b) => a.localeCompare(b));

export const countrySlug = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const countryBySlug = Object.fromEntries(
  countries.map((country) => [countrySlug(country.name), country]),
) as Record<string, Country | undefined>;

// The homepage is an edited selection, not the whole atlas. New records are
// deliberately kept out of the opening narrative but are available everywhere
// else: Explore, collections, the planner and the final interactive globe.
export const featuredDestinations = destinations.slice(0, 8);

export const hiddenDestinations = destinations.filter((destination) => destination.hiddenGem);

export const interestsOf = (destination: Destination): InterestId[] => destination.interests;

export const countDestinationsForInterest = (interest: InterestId) =>
  destinations.filter((destination) => destination.interests.includes(interest)).length;

export const getDestination = (slug: string | undefined) =>
  slug ? destinationBySlug[slug] : undefined;
