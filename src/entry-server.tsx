import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppServer } from '@/AppServer';
import { AtlasProvider } from '@/store/AtlasProvider';
import { ToastProvider } from '@/components/ui/Toast';

export { publicRoutes, staticRoutes, notFoundMeta } from '@/seo/routes';
export { site } from '@/data/site';

/**
 * Build-only entry. The browser bundle is still a normal Vite SPA; this file
 * lets the post-build step emit the same editorial markup for crawlers and
 * no-JS visitors without hydrating the interactive globe or maps.
 */
export const render = (url: string) =>
  renderToString(
    <StaticRouter location={url}>
      <AtlasProvider>
        <ToastProvider>
          <AppServer />
        </ToastProvider>
      </AtlasProvider>
    </StaticRouter>,
  );
