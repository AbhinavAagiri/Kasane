import type { CultureProfile, CultureThemeId } from '@/data/culture.types';
import { cultureProfilesOne } from '@/data/culture.part1';
import { cultureProfilesTwo } from '@/data/culture.part2';
import { cultureProfilesThree } from '@/data/culture.part3';
import { cultureProfilesFour } from '@/data/culture.part4';

export const cultureProfiles: CultureProfile[] = [
  ...cultureProfilesOne,
  ...cultureProfilesTwo,
  ...cultureProfilesThree,
  ...cultureProfilesFour,
];

export const cultureBySlug = Object.fromEntries(
  cultureProfiles.map((profile) => [profile.destinationSlug, profile]),
) as Record<string, CultureProfile | undefined>;

export const getCulture = (slug: string | undefined) =>
  slug ? cultureBySlug[slug] : undefined;

export const countForTheme = (theme: CultureThemeId) =>
  cultureProfiles.filter((profile) => profile.chapters.some((chapter) => chapter.theme === theme))
    .length;

export type { CultureChapter, CultureProfile, CultureThemeId } from '@/data/culture.types';
export { cultureThemes } from '@/data/culture.types';
