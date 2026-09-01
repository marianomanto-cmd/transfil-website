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
      // Stamp every entry with build time so search engines can prioritise
      // re-crawling when the site changes.
      serialize(item) {
        return { ...item, lastmod: new Date().toISOString() };
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
