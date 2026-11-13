import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';

const Explore = lazy(() => import('@/pages/Explore').then((module) => ({ default: module.Explore })));
const CountryPage = lazy(() =>
  import('@/pages/CountryPage').then((module) => ({ default: module.CountryPage })),
);
const DestinationPage = lazy(() =>
  import('@/pages/DestinationPage').then((module) => ({ default: module.DestinationPage })),
);
const JournalPage = lazy(() =>
  import('@/pages/JournalPage').then((module) => ({ default: module.JournalPage })),
);
const StoryPage = lazy(() =>
  import('@/pages/StoryPage').then((module) => ({ default: module.StoryPage })),
);
const Culture = lazy(() => import('@/pages/Culture').then((module) => ({ default: module.Culture })));
const EventsPage = lazy(() =>
  import('@/pages/Events').then((module) => ({ default: module.EventsPage })),
);
const EventPage = lazy(() =>
  import('@/pages/EventPage').then((module) => ({ default: module.EventPage })),
);
const CollectionsPage = lazy(() =>
  import('@/pages/CollectionsPage').then((module) => ({ default: module.CollectionsPage })),
);
const CollectionPage = lazy(() =>
  import('@/pages/CollectionPage').then((module) => ({ default: module.CollectionPage })),
);
const PlanPage = lazy(() =>
  import('@/pages/PlanPage').then((module) => ({ default: module.PlanPage })),
);
const PlannerPage = lazy(() =>
  import('@/pages/PlannerPage').then((module) => ({ default: module.PlannerPage })),
);
const TripPage = lazy(() =>
  import('@/pages/TripPage').then((module) => ({ default: module.TripPage })),
);
const MyWorld = lazy(() =>
  import('@/pages/MyWorld').then((module) => ({ default: module.MyWorld })),
);
const AboutPage = lazy(() =>
  import('@/pages/AboutPage').then((module) => ({ default: module.AboutPage })),
);
const CreditsPage = lazy(() =>
  import('@/pages/CreditsPage').then((module) => ({ default: module.CreditsPage })),
);
const LegalPage = lazy(() =>
  import('@/pages/LegalPage').then((module) => ({ default: module.LegalPage })),
);

const RouteFallback = () => (
  <div className="flex min-h-[60svh] items-center justify-center" role="status">
    <span className="text-[0.75rem] uppercase tracking-[0.14em] text-ink/45">
      Loading the atlas
    </span>
  </div>
);

export const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route
        path="/explore"
        element={
          <Suspense fallback={<RouteFallback />}>
            <Explore />
          </Suspense>
        }
      />
      <Route
        path="/countries/:slug"
        element={
          <Suspense fallback={<RouteFallback />}>
            <CountryPage />
          </Suspense>
        }
      />
      <Route
        path="/destinations/:slug"
        element={
          <Suspense fallback={<RouteFallback />}>
            <DestinationPage />
          </Suspense>
        }
      />
      <Route
        path="/journal"
        element={
          <Suspense fallback={<RouteFallback />}>
            <JournalPage />
          </Suspense>
        }
      />
      <Route
        path="/journal/:slug"
        element={
          <Suspense fallback={<RouteFallback />}>
            <StoryPage />
          </Suspense>
        }
      />
      <Route
        path="/culture"
        element={
          <Suspense fallback={<RouteFallback />}>
            <Culture />
          </Suspense>
        }
      />
      <Route
        path="/events"
        element={
          <Suspense fallback={<RouteFallback />}>
            <EventsPage />
          </Suspense>
        }
      />
      <Route
        path="/events/:slug"
        element={
          <Suspense fallback={<RouteFallback />}>
            <EventPage />
          </Suspense>
        }
      />
      <Route
        path="/collections"
        element={
          <Suspense fallback={<RouteFallback />}>
            <CollectionsPage />
          </Suspense>
        }
      />
      <Route
        path="/collections/:slug"
        element={
          <Suspense fallback={<RouteFallback />}>
            <CollectionPage />
          </Suspense>
        }
      />
      <Route
        path="/plan"
        element={
          <Suspense fallback={<RouteFallback />}>
            <PlanPage />
          </Suspense>
        }
      />
      <Route
        path="/plan/new"
        element={
          <Suspense fallback={<RouteFallback />}>
            <PlannerPage />
          </Suspense>
        }
      />
      <Route
        path="/plan/:tripId"
        element={
          <Suspense fallback={<RouteFallback />}>
            <TripPage />
          </Suspense>
        }
      />
      <Route
        path="/my-world"
        element={
          <Suspense fallback={<RouteFallback />}>
            <MyWorld />
          </Suspense>
        }
      />
      <Route
        path="/about"
        element={
          <Suspense fallback={<RouteFallback />}>
            <AboutPage />
          </Suspense>
        }
      />
      <Route
        path="/credits"
        element={
          <Suspense fallback={<RouteFallback />}>
            <CreditsPage />
          </Suspense>
        }
      />
      <Route
        path="/privacy"
        element={
          <Suspense fallback={<RouteFallback />}>
            <LegalPage kind="privacy" />
          </Suspense>
        }
      />
      <Route
        path="/terms"
        element={
          <Suspense fallback={<RouteFallback />}>
            <LegalPage kind="terms" />
          </Suspense>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);
