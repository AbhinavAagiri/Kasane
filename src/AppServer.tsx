import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { Explore } from '@/pages/Explore';
import { CountryPage } from '@/pages/CountryPage';
import { DestinationPage } from '@/pages/DestinationPage';
import { JournalPage } from '@/pages/JournalPage';
import { StoryPage } from '@/pages/StoryPage';
import { Culture } from '@/pages/Culture';
import { EventsPage } from '@/pages/Events';
import { EventPage } from '@/pages/EventPage';
import { CollectionsPage } from '@/pages/CollectionsPage';
import { CollectionPage } from '@/pages/CollectionPage';
import { PlanPage } from '@/pages/PlanPage';
import { PlannerPage } from '@/pages/PlannerPage';
import { TripPage } from '@/pages/TripPage';
import { MyWorld } from '@/pages/MyWorld';
import { AboutPage } from '@/pages/AboutPage';
import { CreditsPage } from '@/pages/CreditsPage';
import { LegalPage } from '@/pages/LegalPage';
import { NotFound } from '@/pages/NotFound';

/** Eager route tree used only by the build-time prerenderer. */
export const AppServer = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/countries/:slug" element={<CountryPage />} />
      <Route path="/destinations/:slug" element={<DestinationPage />} />
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/journal/:slug" element={<StoryPage />} />
      <Route path="/culture" element={<Culture />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:slug" element={<EventPage />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/collections/:slug" element={<CollectionPage />} />
      <Route path="/plan" element={<PlanPage />} />
      <Route path="/plan/new" element={<PlannerPage />} />
      <Route path="/plan/:tripId" element={<TripPage />} />
      <Route path="/my-world" element={<MyWorld />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/credits" element={<CreditsPage />} />
      <Route path="/privacy" element={<LegalPage kind="privacy" />} />
      <Route path="/terms" element={<LegalPage kind="terms" />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);
