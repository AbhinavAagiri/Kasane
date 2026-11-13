import type { Activity, InterestId, Trip, TripDay, TripPlanning } from '@/data/types';
import type { Destination } from '@/data/types';
import { getCulture } from '@/data/culture';

export type PlannerInput = {
  destinationSlugs: string[];
  startDate: string;
  days: number;
  pace: TripPlanning['pace'];
  interests: InterestId[];
  budget: TripPlanning['budget'];
  party: TripPlanning['party'];
  accommodation: string;
  notes?: string;
};

const id = (prefix: string) =>
  `${prefix}-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10)}`;

const activityKindFor = (kind: InterestId): Activity['kind'] => {
  if (kind === 'food') return 'food';
  if (kind === 'nature') return 'walk';
  if (kind === 'history' || kind === 'culture') return 'place';
  return 'place';
};

const interestWeight = (destination: Destination, interests: InterestId[]) => {
  const matches = destination.interests.filter((interest) => interests.includes(interest)).length;
  return 1 + matches * 0.55 + (destination.hiddenGem ? 0.18 : 0);
};

/** Largest-remainder allocation, minimum one day for each selected place. */
const allocateDays = (total: number, destinations: Destination[], interests: InterestId[]) => {
  const minimum = Math.min(total, destinations.length);
  const remaining = Math.max(0, total - minimum);
  const weights = destinations.map((destination) => interestWeight(destination, interests));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0) || 1;
  const raw = weights.map((weight) => (weight / totalWeight) * remaining);
  const allocated = raw.map((value) => Math.floor(value) + 1);
  let left = total - allocated.reduce((sum, value) => sum + value, 0);
  const order = raw
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);
  let cursor = 0;
  while (left > 0) {
    const entry = order[cursor % order.length];
    if (entry) {
      allocated[entry.index] = (allocated[entry.index] ?? 0) + 1;
      left -= 1;
    }
    cursor += 1;
  }
  return allocated;
};

const dateAfter = (start: string, offset: number) => {
  const date = new Date(`${start}T12:00:00`);
  if (Number.isNaN(date.getTime())) return start;
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

const excerpt = (text: string, limit = 180) => {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).replace(/\s+\S*$/, '')}…`;
};

const PLACE_TIMES = ['09:30', '11:30', '14:30', '16:30', '18:30'];
const PACE_COUNT: Record<TripPlanning['pace'], number> = {
  slow: 2,
  balanced: 3,
  full: 4,
};

const buildDay = (
  destination: Destination,
  dayNumber: number,
  index: number,
  pace: TripPlanning['pace'],
  interests: InterestId[],
  transferFrom?: Destination,
): TripDay => {
  const culture = getCulture(destination.slug);
  const chapter = (theme: string) =>
    culture?.chapters.find((entry) => entry.theme === theme)?.body ?? '';
  const preferredPlaces = [...destination.places].sort((a, b) => {
    const aScore = (interests.includes(a.kind) ? 2 : 0) + (a.kind === 'food' ? 0.5 : 0);
    const bScore = (interests.includes(b.kind) ? 2 : 0) + (b.kind === 'food' ? 0.5 : 0);
    return bScore - aScore;
  });

  const target = PACE_COUNT[pace];
  const chosen = preferredPlaces.slice(index * target, index * target + target);
  const rotation = preferredPlaces.length
    ? preferredPlaces.slice((index * target) % preferredPlaces.length)
    : [];
  const fallback = rotation.filter((place) => !chosen.some((entry) => entry.name === place.name));
  while (chosen.length < target && fallback.length) {
    const next = fallback.shift();
    if (next) chosen.push(next);
  }

  const activities: Activity[] = [];
  if (transferFrom) {
    activities.push({
      id: id('activity'),
      title: `Leave ${transferFrom.name} for ${destination.name}`,
      note: 'Book the morning connection, travel light, and keep the first afternoon loose. Check the latest timetable before you go.',
      time: '08:30',
      kind: 'travel',
    });
  } else if (dayNumber === 1) {
    activities.push({
      id: id('activity'),
      title: `Arrive in ${destination.name}`,
      note: culture?.arrival ?? 'Drop bags, take a short walk and let the city set the pace.',
      time: '12:00',
      kind: 'travel',
    });
  } else {
    activities.push({
      id: id('activity'),
      title: 'Start without a screen',
      note: `One slow hour near ${culture?.stayArea ?? destination.region}. Coffee, a bakery, a look at the street.`,
      time: '08:30',
      kind: 'note',
    });
  }

  chosen.forEach((place, placeIndex) => {
    activities.push({
      id: id('activity'),
      title: place.name,
      note: place.note,
      time: PLACE_TIMES[placeIndex] ?? '16:00',
      kind: activityKindFor(place.kind),
    });
  });

  const localChapter =
    pace === 'slow' || index % 2 === 0 ? chapter('local') : chapter('food');
  if (localChapter) {
    activities.push({
      id: id('activity'),
      title: index % 2 === 0 ? 'Local texture' : 'The table',
      note: excerpt(localChapter, 190),
      time: pace === 'full' ? '19:00' : '19:30',
      kind: index % 2 === 0 ? 'walk' : 'food',
    });
  }

  const dayTitle =
    dayNumber === 1
      ? `First lines in ${destination.name}`
      : chosen[0]
        ? `${chosen[0].name}, and what surrounds it`
        : `A slower day in ${destination.name}`;

  return {
    id: id('day'),
    title: dayTitle,
    activities,
  };
};

const PRACTICAL_NOTES = [
  'This is a locally generated plan, not a booking. It uses editorial data and deterministic scheduling — your answers stay in this browser.',
  'Opening hours, tickets and transport change. Confirm the one or two things that matter before you leave.',
  'The plan deliberately leaves empty space. Move a day, delete an activity, or keep the morning and abandon the afternoon.',
];

const BUDGET_NOTE: Record<TripPlanning['budget'], string> = {
  modest:
    'Planning band, excluding flights and accommodation: roughly €55–85 a day for food, local transport and modest entries. It is a range for budgeting, not a quote.',
  considered:
    'Planning band, excluding flights and accommodation: roughly €110–170 a day for a comfortable room, meals out and entries. It is a range for budgeting, not a quote.',
  open:
    'Planning band, excluding flights and accommodation: €200+ a day if you want flexibility, long meals and taxis. It is a range for budgeting, not a quote.',
};

export const buildItinerary = (
  input: PlannerInput,
  selected: Destination[],
): Omit<Trip, 'id'> => {
  const destinations = selected.length ? selected : [];
  const totalDays = Math.max(1, Math.min(21, input.days));
  const allocation = allocateDays(totalDays, destinations, input.interests);
  const days: TripDay[] = [];
  let cursor = 0;
  let previous: Destination | undefined;

  destinations.forEach((destination, destinationIndex) => {
    const count = allocation[destinationIndex] ?? 1;
    for (let dayIndex = 0; dayIndex < count && cursor < totalDays; dayIndex += 1) {
      days.push(
        buildDay(
          destination,
          cursor + 1,
          dayIndex,
          input.pace,
          input.interests,
          destinationIndex > 0 && dayIndex === 0 ? previous : undefined,
        ),
      );
      cursor += 1;
    }
    previous = destination;
  });

  const culture = getCulture(destinations[0]?.slug);
  const names = destinations.map((destination) => destination.name);
  const area =
    destinations
      .map((destination) => getCulture(destination.slug)?.stayArea)
      .filter(Boolean)
      .join(' · ') || 'A central base within walking distance of the old centre';
  const transport =
    destinations.length > 1
      ? `This plan moves between ${names.join(', ')}. Keep each base for at least two nights; check rail and flight schedules before booking, and avoid same-day long transfers where possible.`
      : culture?.gettingAround ?? 'Walk the centre and use public transport for the longer edges.';

  const planning: TripPlanning = {
    pace: input.pace,
    interests: input.interests,
    accommodation: input.accommodation,
    accommodationArea: area,
    transport,
    arrival: culture?.arrival ?? 'Check the airport or station connection before you book.',
    budget: input.budget,
    party: input.party,
    notes: input.notes,
    generated: true,
    practical: [...PRACTICAL_NOTES, BUDGET_NOTE[input.budget]],
  };

  return {
    title:
      destinations.length > 1
        ? `${totalDays} days: ${names.join(' & ')}`
        : `${totalDays} days in ${names[0] ?? 'the atlas'}`,
    description:
      destinations.length > 1
        ? `A ${input.pace} journey through ${names.join(' and ')}, composed around ${input.interests.length ? input.interests.join(', ') : 'the city itself'}.`
        : `A ${input.pace} stay in ${names[0] ?? 'one place'}, composed around ${input.interests.length ? input.interests.join(', ') : 'the texture of the city'}.`,
    startDate: input.startDate,
    endDate: dateAfter(input.startDate, totalDays - 1),
    destinationSlugs: destinations.map((destination) => destination.slug),
    days,
    planning,
  };
};

export const accommodationOptions = [
  { value: 'Small hotel or guesthouse', label: 'Small hotel / guesthouse' },
  { value: 'Apartment with a kitchen', label: 'Apartment with a kitchen' },
  { value: 'Design hotel', label: 'Design hotel' },
  { value: 'Cave, riad or historic house', label: 'Cave, riad or historic house' },
];
