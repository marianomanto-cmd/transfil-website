# Trans-Fil Website

Bilingual single-page institutional site for **Trans-Fil S.R.L.** — industrial machinery, Córdoba, Argentina. Built with Astro + React islands per the handoff in `design_handoff/`.

- ES at `/` (default)
- EN at `/en/`

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve dist/ locally
```

Requires Node 18+ (developed against Node 22).

## Deploy

The output is fully static — `npm run build` produces a `dist/` folder you can host anywhere. One-click deploy targets:

- **Vercel / Netlify / Cloudflare Pages** — point the project at this repo, set build command `npm run build`, output directory `dist`.
- **Any static host** — upload `dist/` over FTP/S3/etc.

After deploy, update `site` in `astro.config.mjs` if the canonical URL changes from `https://www.trans-fil.com.ar`.

## Project layout

```
src/
  i18n/content.ts        all bilingual copy (single source of truth)
  layouts/Base.astro     <head>, SEO meta, JSON-LD, global scripts
  components/            section components (Astro = static, .tsx = React island)
  styles/global.css      design tokens + section styles (verbatim from handoff)
  pages/
    index.astro          ES home
    en/index.astro       EN home
public/                  favicon, robots.txt, /img/*, /catalogs/*.pdf
design_handoff/          original handoff (README + reference jsx/css) — see §11
```

## Open follow-ups

1. **Contact form backend** — currently logs to console and shows success state. Pick mailto / Formspree / serverless and wire `ContactSection.tsx#submit`.
2. **og-image** — generate dedicated `1200×630` JPG for social previews; replace `og:image` URL in `Base.astro`.
3. **PNG favicons** (32px, 180px) for legacy browsers.
4. **Final imagery** — the photos in `public/img/` are placeholders. Replace as the client delivers final assets. All image paths live in `src/i18n/content.ts`.
5. **Tweaks panel** — intentionally not ported (per handoff README §11). The chosen variants are hardcoded: hero `type`, clients `marquee`, services `rows`, process `hotspots`.
