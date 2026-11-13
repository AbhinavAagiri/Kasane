export type InterestId =
  | 'architecture'
  | 'culture'
  | 'nature'
  | 'food'
  | 'cities'
  | 'art'
  | 'history';

export type Character = 'coastal' | 'historic' | 'mountain' | 'urban' | 'rural' | 'island';

export type Coordinates = {
  lat: number;
  lng: number;
};

export type DestinationImage = {
  src: string;
  alt: string;
  /** Optional caption used under full-bleed figures. */
  caption?: string;
};

export type Place = {
  name: string;
  kind: InterestId;
  note: string;
  coordinates: Coordinates;
};

export type LayerLayout = 'split' | 'wide' | 'quiet';

export type DestinationLayer = {
  title: string;
  kind: InterestId;
  body: string;
  layout: LayerLayout;
  image?: DestinationImage;
};

export type Destination = {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  coordinates: Coordinates;
  character: Character;
  hiddenGem: boolean;
  /** Short line used on cards and in search results. */
  line: string;
  /** Standfirst at the top of the destination page. */
  summary: string;
  body: string[];
  image: DestinationImage;
  secondaryImage: DestinationImage;
  interests: InterestId[];
  bestSeason: string;
  suggestedDays: number;
  layers: DestinationLayer[];
  places: Place[];
  storySlugs: string[];
  related: string[];
};

export type StoryCategory =
  | 'Places'
  | 'Architecture'
  | 'Culture'
  | 'Nature'
  | 'Experiences'
  | 'Guides';

export type StoryBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'image'; image: DestinationImage }
  | { type: 'pull'; text: string }
  | { type: 'facts'; title: string; items: { label: string; value: string }[] };

export type Story = {
  slug: string;
  title: string;
  standfirst: string;
  categories: StoryCategory[];
  destinationSlug: string;
  image: DestinationImage;
  issue: string;
  readingMinutes: number;
  blocks: StoryBlock[];
  related: string[];
};

export type CuratedCollection = {
  slug: string;
  title: string;
  description: string;
  image: DestinationImage;
  destinationSlugs: string[];
  storySlugs: string[];
};

export type Interest = {
  id: InterestId;
  label: string;
  description: string;
  image: DestinationImage;
};

export type ActivityKind = 'place' | 'food' | 'walk' | 'stay' | 'travel' | 'note';

export type Activity = {
  id: string;
  title: string;
  note?: string;
  time?: string;
  cost?: number;
  link?: string;
  kind: ActivityKind;
};

export type TripDay = {
  id: string;
  title: string;
  activities: Activity[];
};

export type TripPlanning = {
  pace: 'slow' | 'balanced' | 'full';
  interests: InterestId[];
  accommodation: string;
  accommodationArea: string;
  transport: string;
  arrival: string;
  budget: 'modest' | 'considered' | 'open';
  party: 'solo' | 'couple' | 'friends' | 'family';
  notes?: string;
  generated?: boolean;
  practical?: string[];
};

export type Trip = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  destinationSlugs: string[];
  days: TripDay[];
  planning?: TripPlanning;
  sample?: boolean;
};

export type UserCollection = {
  id: string;
  title: string;
  description: string;
  destinationSlugs: string[];
  storySlugs: string[];
  createdAt: string;
};
