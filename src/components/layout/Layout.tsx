import { Outlet, useLocation } from 'react-router-dom';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { ScrollManager } from '@/components/layout/ScrollManager';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { SearchProvider } from '@/components/search/SearchProvider';

export const Layout = () => {
  const { pathname } = useLocation();

  return (
    <SmoothScroll>
      <ScrollManager />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-[0.8125rem] focus:text-ivory"
      >
        Skip to content
      </a>
      <SearchProvider>
        <Nav />
        <main id="main" key={pathname} className="page-enter">
          <Outlet />
        </main>
        <Footer />
      </SearchProvider>
    </SmoothScroll>
  );
};
