import curated from '@/data/events/curated.json';
import generated from '@/data/events/generated.json';
import { destinationBySlug } from '@/data/destinations';

export type EventCategory =
  | 'festival'
  | 'ritual'
  | 'music'
  | 'food'
  | 'arts'
  | 'literature'
  | 'national-day';

export type EventDateStatus =
  | 'confirmed'
  | 'confirmed-window'
  | 'annual-fixed'
  | 'annual-liturgical'
  | 'dates-announced';

export type AtlasEvent = {
  slug: string;
  name: string;
  destinationSlug: string;
  city: string;
  country: string;
  venue: string;
  coordinates: { lat: number; lng: number };
  startDate: string;
  endDate: string;
  category: EventCategory;
  dateStatus: EventDateStatus;
  summary: string;
  body: string[];
  whyGo: string;
  etiquette: string[];
  tickets: {
    status: 'free' | 'mixed' | 'ticketed' | 'free-registration';
    note: string;
    url?: string;
  };
  source: { label: string; url: string; checkedAt: string };
  tags: string[];
  image?: string;
  generated?: boolean;
};

type GeneratedFile = {
  checkedAt: string;
  source: string;
  events: AtlasEvent[];
};

const curatedEvents = curated as unknown as AtlasEvent[];
const generatedFile = generated as GeneratedFile;

/** Generated listings may omit editorial fields; hide anything incomplete. */
const validGenerated = (generatedFile.events ?? []).filter(
  (event) =>
    event.slug &&
    event.name &&
    event.destinationSlug &&
    event.startDate &&
    event.endDate &&
    event.source?.url &&
    destinationBySlug[event.destinationSlug],
);

const seen = new Set<string>();
export const events: AtlasEvent[] = [...curatedEvents, ...validGenerated]
  .filter((event) => {
    const key = `${event.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${event.startDate}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .sort((a, b) => a.startDate.localeCompare(b.startDate));

export const eventBySlug = Object.fromEntries(events.map((event) => [event.slug, event])) as Record<
  string,
  AtlasEvent | undefined
>;

export const getEvent = (slug: string | undefined) => (slug ? eventBySlug[slug] : undefined);

const startOfToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`;
};

export const isUpcoming = (event: AtlasEvent, today = startOfToday()) => event.endDate >= today;

export const upcomingEvents = events.filter((event) => isUpcoming(event));

export const eventsForDestination = (slug: string) =>
  upcomingEvents.filter((event) => event.destinationSlug === slug);

export const eventCategories: { id: EventCategory; label: string }[] = [
  { id: 'festival', label: 'Festival' },
  { id: 'ritual', label: 'Ritual' },
  { id: 'music', label: 'Music' },
  { id: 'food', label: 'Table' },
  { id: 'arts', label: 'Arts' },
  { id: 'literature', label: 'Books' },
  { id: 'national-day', label: 'National day' },
];

export const categoryLabel = (id: EventCategory) =>
  eventCategories.find((category) => category.id === id)?.label ?? id;

const longDate = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const shortDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const parseDate = (iso: string) => new Date(`${iso}T12:00:00`);

export const eventDateLabel = (event: Pick<AtlasEvent, 'startDate' | 'endDate'>) => {
  const start = parseDate(event.startDate);
  const end = parseDate(event.endDate);
  if (Number.isNaN(start.getTime())) return event.startDate;
  if (event.startDate === event.endDate) return longDate.format(start);
  if (Number.isNaN(end.getTime())) return longDate.format(start);
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()}–${end.getDate()} ${new Intl.DateTimeFormat('en-GB', {
      month: 'long',
      year: 'numeric',
    }).format(start)}`;
  }
  return `${shortDate.format(start)} – ${shortDate.format(end)}`;
};

export const eventMonth = (event: Pick<AtlasEvent, 'startDate'>) =>
  Number(event.startDate.slice(5, 7));

export const daysUntil = (event: Pick<AtlasEvent, 'startDate' | 'endDate'>) => {
  const target = parseDate(event.startDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
};

export const ticketStatusLabel: Record<AtlasEvent['tickets']['status'], string> = {
  free: 'Free to attend',
  mixed: 'Mixed — check the listing',
  ticketed: 'Ticketed',
  'free-registration': 'Free, registration required',
};

export const checkedDateLabel = (iso: string) => {
  const date = parseDate(iso.slice(0, 10));
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const dateStatusLabel: Record<EventDateStatus, string> = {
  confirmed: 'Dates confirmed',
  'confirmed-window': 'Dates confirmed',
  'annual-fixed': 'Fixed annual date',
  'annual-liturgical': 'Follows the liturgical calendar',
  'dates-announced': 'Dates announced',
};

export const eventSourceNote =
  'Dates are checked against the organiser or an official calendar. Schedules can change — confirm before booking travel.';
