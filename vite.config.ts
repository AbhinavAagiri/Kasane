import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

const FALLBACK_SITE_URL = 'https://kasane-atlas.pages.dev';

const normaliseSiteUrl = (value: string | undefined) =>
  (value || FALLBACK_SITE_URL).replace(/\/+$/, '');

export default defineConfig(({ isSsrBuild, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = normaliseSiteUrl(env.VITE_SITE_URL || env.SITE_URL);

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __SITE_URL__: JSON.stringify(siteUrl),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      rollupOptions: {
        output: isSsrBuild
          ? {}
          : {
              // three and Drei are deliberately left to Rollup: grouping them by
              // hand made the bundler hoist React into that chunk, which pulled the
              // whole 3D stack into the initial load.
              manualChunks: {
                gsap: ['gsap'],
                motion: ['lenis'],
              },
            },
      },
    },
  };
});
