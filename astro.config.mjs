import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.transfil.com.ar',
  // Default `output: 'static'` is kept so every page is prerendered; only
  // routes that opt out with `export const prerender = false` (the contact
  // API endpoint) run on-demand as Vercel serverless functions.
  adapter: vercel(),
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-AR', en: 'en-US', pt: 'pt-BR' },
      },
      // The sitemap has to agree with the canonical each page emits, and
      // canonicals come from `src/i18n/routes.ts`: locale roots keep their
      // trailing slash (`/`, `/en/`, `/pt/`), landings don't (`/conformado`).
      // Also stamps build time so crawlers know when to come back.
      serialize(item) {
        const canonical = (url) => {
          const { pathname } = new URL(url);
          return /^\/(en\/|pt\/)?$/.test(pathname) ? url : url.replace(/\/$/, '');
        };
        return {
          ...item,
          url: canonical(item.url),
          links: item.links?.map((l) => ({ ...l, url: canonical(l.url) })),
          lastmod: new Date().toISOString(),
        };
      },
    }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'pt'],
    routing: { prefixDefaultLocale: false },
  },
  // The Vercel adapter turns these into platform-level redirects (see
  // `.vercel/output/config.json`), so they cost nothing at runtime.
  redirects: {
    // Legacy campaign URLs → the /conformado landing.
    '/filtracion-conformado-tubos': { status: 301, destination: '/conformado' },
    '/filtracao-conformacao-tubos': { status: 301, destination: '/pt/conformado' },
    // @astrojs/sitemap emits `sitemap-index.xml`; crawlers and humans still
    // guess `/sitemap.xml`, which used to 404.
    '/sitemap.xml': { status: 301, destination: '/sitemap-index.xml' },
  },
  build: { inlineStylesheets: 'auto' },
});
