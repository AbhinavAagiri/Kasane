export type CultureThemeId =
  | 'beliefs'
  | 'myth'
  | 'traditions'
  | 'food'
  | 'arts'
  | 'festival'
  | 'nature'
  | 'local';

export type CultureChapter = {
  theme: CultureThemeId;
  title: string;
  body: string;
  /** Use to separate living belief from folklore, legend or contested history. */
  note?: string;
};

export type CultureProfile = {
  destinationSlug: string;
  standfirst: string;
  chapters: CultureChapter[];
  etiquette: string[];
  stayArea: string;
  arrival: string;
  gettingAround: string;
  sources?: { label: string; url: string }[];
};

export const cultureThemes: {
  id: CultureThemeId;
  label: string;
  question: string;
}[] = [
  { id: 'beliefs', label: 'Beliefs', question: 'What holds the place together?' },
  { id: 'myth', label: 'Myth & memory', question: 'What is told, and what is true?' },
  { id: 'traditions', label: 'Traditions', question: 'What is repeated, and why?' },
  { id: 'food', label: 'The table', question: 'How does the place eat?' },
  { id: 'arts', label: 'Arts & making', question: 'What is made by hand?' },
  { id: 'festival', label: 'Festivals', question: 'When does the place gather?' },
  { id: 'nature', label: 'Landscape', question: 'What does the land ask?' },
  { id: 'local', label: 'Local life', question: 'How do people live it?' },
];
