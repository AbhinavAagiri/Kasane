import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { sampleTrips } from '@/data/trips';
import type { Activity, ActivityKind, InterestId, Trip, TripDay, UserCollection } from '@/data/types';

const STORAGE_KEY = 'kasane.atlas.v1';

export type AtlasState = {
  savedDestinations: string[];
  visitedDestinations: string[];
  savedStories: string[];
  savedEvents: string[];
  collections: UserCollection[];
  trips: Trip[];
  recentDestinations: string[];
};

type Action =
  | { type: 'toggle-save-destination'; slug: string }
  | { type: 'toggle-visited'; slug: string }
  | { type: 'toggle-save-story'; slug: string }
  | { type: 'toggle-save-event'; slug: string }
  | { type: 'view-destination'; slug: string }
  | { type: 'create-collection'; collection: UserCollection }
  | { type: 'update-collection'; id: string; patch: Partial<Pick<UserCollection, 'title' | 'description'>> }
  | { type: 'delete-collection'; id: string }
  | { type: 'add-to-collection'; id: string; destinationSlug?: string; storySlug?: string }
  | {
      type: 'remove-from-collection';
      id: string;
      destinationSlug?: string;
      storySlug?: string;
    }
  | { type: 'create-trip'; trip: Trip }
  | { type: 'update-trip'; id: string; patch: Partial<Pick<Trip, 'title' | 'description' | 'startDate' | 'endDate'>> }
  | { type: 'delete-trip'; id: string }
  | { type: 'add-destination-to-trip'; id: string; slug: string }
  | { type: 'remove-destination-from-trip'; id: string; slug: string }
  | { type: 'add-day'; id: string; day: TripDay }
  | { type: 'remove-day'; id: string; dayId: string }
  | { type: 'update-day'; id: string; dayId: string; title: string }
  | { type: 'add-activity'; id: string; dayId: string; activity: Activity }
  | { type: 'update-activity'; id: string; dayId: string; activity: Activity }
  | { type: 'remove-activity'; id: string; dayId: string; activityId: string }
  | { type: 'move-activity'; id: string; dayId: string; activityId: string; direction: -1 | 1 }
  | { type: 'reset' };

const initialState: AtlasState = {
  savedDestinations: [],
  visitedDestinations: [],
  savedStories: [],
  savedEvents: [],
  collections: [],
  trips: [],
  recentDestinations: [],
};

const unique = (list: string[]) => Array.from(new Set(list));

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

const editTrip = (state: AtlasState, id: string, edit: (trip: Trip) => Trip) => ({
  ...state,
  trips: state.trips.map((trip) => (trip.id === id ? edit(trip) : trip)),
});

const editDay = (trip: Trip, dayId: string, edit: (day: TripDay) => TripDay): Trip => ({
  ...trip,
  days: trip.days.map((day) => (day.id === dayId ? edit(day) : day)),
});

const reducer = (state: AtlasState, action: Action): AtlasState => {
  switch (action.type) {
    case 'toggle-save-destination':
      return { ...state, savedDestinations: toggle(state.savedDestinations, action.slug) };
    case 'toggle-visited': {
      const visited = toggle(state.visitedDestinations, action.slug);
      return { ...state, visitedDestinations: visited };
    }
    case 'toggle-save-story':
      return { ...state, savedStories: toggle(state.savedStories, action.slug) };
    case 'toggle-save-event':
      return { ...state, savedEvents: toggle(state.savedEvents, action.slug) };
    case 'view-destination':
      return {
        ...state,
        recentDestinations: [action.slug, ...state.recentDestinations.filter((s) => s !== action.slug)].slice(
          0,
          8,
        ),
      };
    case 'create-collection':
      return { ...state, collections: [action.collection, ...state.collections] };
    case 'update-collection':
      return {
        ...state,
        collections: state.collections.map((collection) =>
          collection.id === action.id ? { ...collection, ...action.patch } : collection,
        ),
      };
    case 'delete-collection':
      return { ...state, collections: state.collections.filter((c) => c.id !== action.id) };
    case 'add-to-collection':
      return {
        ...state,
        collections: state.collections.map((collection) => {
          if (collection.id !== action.id) return collection;
          return {
            ...collection,
            destinationSlugs: action.destinationSlug
              ? unique([...collection.destinationSlugs, action.destinationSlug])
              : collection.destinationSlugs,
            storySlugs: action.storySlug
              ? unique([...collection.storySlugs, action.storySlug])
              : collection.storySlugs,
          };
        }),
      };
    case 'remove-from-collection':
      return {
        ...state,
        collections: state.collections.map((collection) => {
          if (collection.id !== action.id) return collection;
          return {
            ...collection,
            destinationSlugs: action.destinationSlug
              ? collection.destinationSlugs.filter((slug) => slug !== action.destinationSlug)
              : collection.destinationSlugs,
            storySlugs: action.storySlug
              ? collection.storySlugs.filter((slug) => slug !== action.storySlug)
              : collection.storySlugs,
          };
        }),
      };
    case 'create-trip':
      return { ...state, trips: [action.trip, ...state.trips] };
    case 'update-trip':
      return editTrip(state, action.id, (trip) => ({ ...trip, ...action.patch }));
    case 'delete-trip':
      return { ...state, trips: state.trips.filter((trip) => trip.id !== action.id) };
    case 'add-destination-to-trip':
      return editTrip(state, action.id, (trip) => ({
        ...trip,
        destinationSlugs: unique([...trip.destinationSlugs, action.slug]),
      }));
    case 'remove-destination-from-trip':
      return editTrip(state, action.id, (trip) => ({
        ...trip,
        destinationSlugs: trip.destinationSlugs.filter((slug) => slug !== action.slug),
      }));
    case 'add-day':
      return editTrip(state, action.id, (trip) => ({ ...trip, days: [...trip.days, action.day] }));
    case 'remove-day':
      return editTrip(state, action.id, (trip) => ({
        ...trip,
        days: trip.days.filter((day) => day.id !== action.dayId),
      }));
    case 'update-day':
      return editTrip(state, action.id, (trip) =>
        editDay(trip, action.dayId, (day) => ({ ...day, title: action.title })),
      );
    case 'add-activity':
      return editTrip(state, action.id, (trip) =>
        editDay(trip, action.dayId, (day) => ({
          ...day,
          activities: [...day.activities, action.activity],
        })),
      );
    case 'update-activity':
      return editTrip(state, action.id, (trip) =>
        editDay(trip, action.dayId, (day) => ({
          ...day,
          activities: day.activities.map((activity) =>
            activity.id === action.activity.id ? action.activity : activity,
          ),
        })),
      );
    case 'remove-activity':
      return editTrip(state, action.id, (trip) =>
        editDay(trip, action.dayId, (day) => ({
          ...day,
          activities: day.activities.filter((activity) => activity.id !== action.activityId),
        })),
      );
    case 'move-activity':
      return editTrip(state, action.id, (trip) =>
        editDay(trip, action.dayId, (day) => {
          const index = day.activities.findIndex((activity) => activity.id === action.activityId);
          const target = index + action.direction;
          if (index < 0 || target < 0 || target >= day.activities.length) return day;
          const activities = [...day.activities];
          const current = activities[index];
          const other = activities[target];
          if (!current || !other) return day;
          activities[index] = other;
          activities[target] = current;
          return { ...day, activities };
        }),
      );
    case 'reset':
      return { ...initialState };
    default:
      return state;
  }
};

const MAX_STORAGE_CHARS = 1_500_000;
const ACTIVITY_KINDS: ActivityKind[] = ['place', 'food', 'walk', 'stay', 'travel', 'note'];
const INTEREST_IDS: InterestId[] = [
  'architecture',
  'culture',
  'nature',
  'food',
  'cities',
  'art',
  'history',
];

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const stripControlCharacters = (value: string) =>
  Array.from(value)
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code >= 32 || code === 9 || code === 10 || code === 13;
    })
    .join('');

const cleanText = (value: unknown, max: number) =>
  typeof value === 'string' ? stripControlCharacters(value).trim().slice(0, max) : '';

const cleanId = (value: unknown) => {
  const id = cleanText(value, 120);
  return /^[a-zA-Z0-9_-]+$/.test(id) ? id : '';
};

const cleanSlug = (value: unknown) => {
  const slug = cleanText(value, 80).toLowerCase();
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : '';
};

const cleanDate = (value: unknown) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return '';
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? '' : value;
};

const cleanLink = (value: unknown) => {
  const link = cleanText(value, 300);
  if (!link) return undefined;
  try {
    const url = new URL(link);
    return ['http:', 'https:'].includes(url.protocol) ? link : undefined;
  } catch {
    return undefined;
  }
};

const cleanSlugList = (value: unknown, maxItems: number) => {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value
        .slice(0, maxItems)
        .map(cleanSlug)
        .filter(Boolean),
    ),
  );
};

const cleanActivity = (value: unknown): Activity | null => {
  const record = asRecord(value);
  if (!record) return null;
  const id = cleanId(record.id);
  const title = cleanText(record.title, 90);
  if (!id || !title) return null;
  const cost =
    typeof record.cost === 'number' && Number.isFinite(record.cost) && record.cost >= 0
      ? Math.min(record.cost, 1_000_000)
      : undefined;
  const kind = ACTIVITY_KINDS.includes(record.kind as ActivityKind)
    ? (record.kind as ActivityKind)
    : 'place';
  return {
    id,
    title,
    kind,
    note: cleanText(record.note, 280) || undefined,
    time: /^([01]\d|2[0-3]):[0-5]\d$/.test(cleanText(record.time, 5))
      ? cleanText(record.time, 5)
      : undefined,
    cost,
    link: cleanLink(record.link),
  };
};

const cleanDay = (value: unknown): TripDay | null => {
  const record = asRecord(value);
  if (!record) return null;
  const id = cleanId(record.id);
  const title = cleanText(record.title, 80);
  if (!id || !title) return null;
  const activities = Array.isArray(record.activities)
    ? record.activities
        .slice(0, 40)
        .map(cleanActivity)
        .filter((activity): activity is Activity => Boolean(activity))
    : [];
  return { id, title, activities };
};

const cleanPlanning = (value: unknown) => {
  const record = asRecord(value);
  if (!record) return undefined;
  const pace = ['slow', 'balanced', 'full'].includes(String(record.pace))
    ? (record.pace as 'slow' | 'balanced' | 'full')
    : 'balanced';
  const budget = ['modest', 'considered', 'open'].includes(String(record.budget))
    ? (record.budget as 'modest' | 'considered' | 'open')
    : 'considered';
  const party = ['solo', 'couple', 'friends', 'family'].includes(String(record.party))
    ? (record.party as 'solo' | 'couple' | 'friends' | 'family')
    : 'couple';
  const interests = Array.isArray(record.interests)
    ? Array.from(
        new Set(
          record.interests.filter((interest): interest is InterestId =>
            INTEREST_IDS.includes(interest as InterestId),
          ),
        ),
      ).slice(0, INTEREST_IDS.length)
    : [];
  const practical = Array.isArray(record.practical)
    ? record.practical
        .slice(0, 12)
        .map((item) => cleanText(item, 240))
        .filter(Boolean)
    : undefined;
  return {
    pace,
    interests,
    accommodation: cleanText(record.accommodation, 80),
    accommodationArea: cleanText(record.accommodationArea, 80),
    transport: cleanText(record.transport, 80),
    arrival: cleanText(record.arrival, 80),
    budget,
    party,
    notes: cleanText(record.notes, 600) || undefined,
    generated: record.generated === true,
    practical,
  };
};

const cleanTrip = (value: unknown): Trip | null => {
  const record = asRecord(value);
  if (!record) return null;
  const id = cleanId(record.id);
  const title = cleanText(record.title, 90);
  const startDate = cleanDate(record.startDate);
  const endDate = cleanDate(record.endDate);
  if (!id || !title || !startDate || !endDate) return null;
  const days = Array.isArray(record.days)
    ? record.days
        .slice(0, 60)
        .map(cleanDay)
        .filter((day): day is TripDay => Boolean(day))
    : [];
  const trip: Trip = {
    id,
    title,
    description: cleanText(record.description, 300),
    startDate,
    endDate,
    destinationSlugs: cleanSlugList(record.destinationSlugs, 12),
    days,
    planning: cleanPlanning(record.planning),
    sample: record.sample === true,
  };
  return trip;
};

const cleanCollection = (value: unknown): UserCollection | null => {
  const record = asRecord(value);
  if (!record) return null;
  const id = cleanId(record.id);
  const title = cleanText(record.title, 80);
  if (!id || !title) return null;
  const createdAt = cleanText(record.createdAt, 40);
  return {
    id,
    title,
    description: cleanText(record.description, 300),
    destinationSlugs: cleanSlugList(record.destinationSlugs, 50),
    storySlugs: cleanSlugList(record.storySlugs, 40),
    createdAt: createdAt || new Date().toISOString(),
  };
};

const loadState = (): AtlasState => {
  if (typeof window === 'undefined') return initialState;
  const fallback = { ...initialState, trips: structuredClone(sampleTrips) };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw || raw.length > MAX_STORAGE_CHARS) return fallback;
    const parsed: unknown = JSON.parse(raw);
    const stored = asRecord(parsed);
    if (!stored) return fallback;

    const trips = Array.isArray(stored.trips)
      ? stored.trips
          .slice(0, 30)
          .map(cleanTrip)
          .filter((trip): trip is Trip => Boolean(trip))
      : null;
    const collections = Array.isArray(stored.collections)
      ? stored.collections
          .slice(0, 80)
          .map(cleanCollection)
          .filter((collection): collection is UserCollection => Boolean(collection))
      : [];

    return {
      savedDestinations: cleanSlugList(stored.savedDestinations, 200),
      visitedDestinations: cleanSlugList(stored.visitedDestinations, 200),
      savedStories: cleanSlugList(stored.savedStories, 200),
      savedEvents: cleanSlugList(stored.savedEvents, 200),
      collections,
      trips: trips ?? structuredClone(sampleTrips),
      recentDestinations: cleanSlugList(stored.recentDestinations, 8),
    };
  } catch {
    return fallback;
  }
};

const newId = (prefix: string) =>
  `${prefix}-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10)}`;

type AtlasActions = {
  toggleSavedDestination: (slug: string) => void;
  toggleVisited: (slug: string) => void;
  toggleSavedStory: (slug: string) => void;
  toggleSavedEvent: (slug: string) => void;
  recordView: (slug: string) => void;
  createCollection: (input: { title: string; description?: string; destinationSlug?: string; storySlug?: string }) => string;
  updateCollection: (id: string, patch: { title?: string; description?: string }) => void;
  deleteCollection: (id: string) => void;
  addToCollection: (id: string, item: { destinationSlug?: string; storySlug?: string }) => void;
  removeFromCollection: (id: string, item: { destinationSlug?: string; storySlug?: string }) => void;
  createTrip: (input: {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    destinationSlugs?: string[];
  }) => string;
  createGeneratedTrip: (trip: Omit<Trip, 'id'>) => string;
  updateTrip: (id: string, patch: { title?: string; description?: string; startDate?: string; endDate?: string }) => void;
  deleteTrip: (id: string) => void;
  addDestinationToTrip: (id: string, slug: string) => void;
  removeDestinationFromTrip: (id: string, slug: string) => void;
  addDay: (id: string, title?: string) => string;
  removeDay: (id: string, dayId: string) => void;
  updateDayTitle: (id: string, dayId: string, title: string) => void;
  addActivity: (id: string, dayId: string, activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, dayId: string, activity: Activity) => void;
  removeActivity: (id: string, dayId: string, activityId: string) => void;
  moveActivity: (id: string, dayId: string, activityId: string, direction: -1 | 1) => void;
  reset: () => void;
};

type AtlasContextValue = AtlasState &
  AtlasActions & {
    isSaved: (slug: string) => boolean;
    isVisited: (slug: string) => boolean;
    isStorySaved: (slug: string) => boolean;
    isEventSaved: (slug: string) => boolean;
  };

const AtlasContext = createContext<AtlasContextValue | null>(null);

export const AtlasProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable; the session still works in memory */
    }
  }, [state]);

  const actions = useMemo<AtlasActions>(
    () => ({
      toggleSavedDestination: (slug) => dispatch({ type: 'toggle-save-destination', slug }),
      toggleVisited: (slug) => dispatch({ type: 'toggle-visited', slug }),
      toggleSavedStory: (slug) => dispatch({ type: 'toggle-save-story', slug }),
      toggleSavedEvent: (slug) => dispatch({ type: 'toggle-save-event', slug }),
      recordView: (slug) => dispatch({ type: 'view-destination', slug }),
      createCollection: ({ title, description = '', destinationSlug, storySlug }) => {
        const collection: UserCollection = {
          id: newId('collection'),
          title,
          description,
          destinationSlugs: destinationSlug ? [destinationSlug] : [],
          storySlugs: storySlug ? [storySlug] : [],
          createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'create-collection', collection });
        return collection.id;
      },
      updateCollection: (id, patch) => dispatch({ type: 'update-collection', id, patch }),
      deleteCollection: (id) => dispatch({ type: 'delete-collection', id }),
      addToCollection: (id, item) => dispatch({ type: 'add-to-collection', id, ...item }),
      removeFromCollection: (id, item) =>
        dispatch({ type: 'remove-from-collection', id, ...item }),
      createTrip: ({ title, description = '', startDate, endDate, destinationSlugs = [] }) => {
        const trip: Trip = {
          id: newId('trip'),
          title,
          description,
          startDate,
          endDate,
          destinationSlugs,
          days: [
            {
              id: newId('day'),
              title: 'Day one',
              activities: [],
            },
          ],
        };
        dispatch({ type: 'create-trip', trip });
        return trip.id;
      },
      createGeneratedTrip: (input) => {
        const trip: Trip = { ...input, id: newId('trip') };
        dispatch({ type: 'create-trip', trip });
        return trip.id;
      },
      updateTrip: (id, patch) => dispatch({ type: 'update-trip', id, patch }),
      deleteTrip: (id) => dispatch({ type: 'delete-trip', id }),
      addDestinationToTrip: (id, slug) => dispatch({ type: 'add-destination-to-trip', id, slug }),
      removeDestinationFromTrip: (id, slug) =>
        dispatch({ type: 'remove-destination-from-trip', id, slug }),
      addDay: (id, title = 'A free day') => {
        const dayId = newId('day');
        dispatch({ type: 'add-day', id, day: { id: dayId, title, activities: [] } });
        return dayId;
      },
      removeDay: (id, dayId) => dispatch({ type: 'remove-day', id, dayId }),
      updateDayTitle: (id, dayId, title) => dispatch({ type: 'update-day', id, dayId, title }),
      addActivity: (id, dayId, activity) =>
        dispatch({
          type: 'add-activity',
          id,
          dayId,
          activity: { ...activity, id: newId('activity') },
        }),
      updateActivity: (id, dayId, activity) =>
        dispatch({ type: 'update-activity', id, dayId, activity }),
      removeActivity: (id, dayId, activityId) =>
        dispatch({ type: 'remove-activity', id, dayId, activityId }),
      moveActivity: (id, dayId, activityId, direction) =>
        dispatch({ type: 'move-activity', id, dayId, activityId, direction }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [],
  );

  const value = useMemo<AtlasContextValue>(
    () => ({
      ...state,
      ...actions,
      isSaved: (slug) => state.savedDestinations.includes(slug),
      isVisited: (slug) => state.visitedDestinations.includes(slug),
      isStorySaved: (slug) => state.savedStories.includes(slug),
      isEventSaved: (slug) => state.savedEvents.includes(slug),
    }),
    [state, actions],
  );

  return <AtlasContext.Provider value={value}>{children}</AtlasContext.Provider>;
};

export const useAtlas = () => {
  const context = useContext(AtlasContext);
  if (!context) throw new Error('useAtlas must be used inside AtlasProvider');
  return context;
};

