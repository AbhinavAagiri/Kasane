import { Intro } from '@/components/home/Intro';
import { EventsTeaser } from '@/components/home/EventsTeaser';
import { AtlasSection } from '@/components/home/AtlasSection';
import { CultureTeaser } from '@/components/home/CultureTeaser';
import { InterestsSection } from '@/components/home/InterestsSection';
import { FeatureSection } from '@/components/home/FeatureSection';
import { ElsewhereSection } from '@/components/home/ElsewhereSection';
import { GlobeJourney } from '@/components/globe/GlobeJourney';
import { CollectionsSection } from '@/components/home/CollectionsSection';
import { PlanSection } from '@/components/home/PlanSection';
import { ClosingSection } from '@/components/home/ClosingSection';
import { usePageMeta } from '@/hooks/usePageMeta';
import { homeMeta } from '@/seo/routes';

export const Home = () => {
  usePageMeta(homeMeta);

  return (
    <>
      <GlobeJourney />
      <Intro />
      <EventsTeaser />
      <AtlasSection />
      <CultureTeaser />
      <InterestsSection />
      <FeatureSection />
      <ElsewhereSection />
      <CollectionsSection />
      <PlanSection />
      <ClosingSection />
    </>
  );
};
