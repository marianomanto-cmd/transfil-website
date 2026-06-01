# Trans-Fil Website

Bilingual single-page institutional site for **Trans-Fil S.R.L.** — industrial machinery, Córdoba, Argentina.

- ES at `/` (default)
- EN at `/en/`
- Custom 404 at `/404`

## Stack

- **Astro 5** static output, with **React** islands hydrated per-component (`client:visible` / `client:load` / `client:idle`).
- **TypeScript** everywhere.
- All copy in `src/i18n/content.ts` — single source of truth, typed (`Content` type).
- Design tokens + section styles in `src/styles/global.css`; scoped styles inside Astro components where they're self-contained (e.g. `ProcessSection.astro`).
- `@astrojs/sitemap` for `sitemap-index.xml`.
- View Transitions via `<ClientRouter />` for ES ↔ EN swaps.

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/ (3 pages: /, /en/, /404)
npm run preview  # serve dist/ locally
npm run check    # astro type-check
```

Requires Node 18+.

## Deploy

`npm run build` produces a fully static `dist/`. Targets that work out of the box:

- **Vercel / Netlify / Cloudflare Pages** — point at the repo, build command `npm run build`, output dir `dist`.
- **Any static host** — upload `dist/` over FTP / S3 / similar.

The canonical URL is hardcoded in `src/layouts/Base.astro` as `https://www.trans-fil.com.ar`. Update that constant if the domain changes.

## Project layout

```
src/
  i18n/content.ts        all bilingual copy, typed (single source of truth)
  layouts/Base.astro     <head>, SEO meta, JSON-LD, skip-link, global scripts
  components/
    Hero.tsx             section 01 — workshop video bg + display headline + stats
    TechSection.tsx      section 02 — 'bento' grid of 4 tech groups × 4 bullets
    CatalogsSection.tsx  section 03 — 3 PDF covers + in-page viewer modal
    ProcessSection.astro section 04 — 5 step cards over darkened workshop bg
    ServicesSection.astro section 05 — 4 services as alternating image+text rows
    IndustriesSection.tsx section 06 — radar map + 3 client marquees + watermark
    HistorySection.astro section 07 — 5 milestones on vertical timeline
    ContactSection.tsx   section 08 — form + side panel + Google Maps embed
    Footer.astro         brand mark + nav links + contact + WhatsApp
    Header.tsx           sticky header w/ scroll-progress + scroll-spy
    Section.astro        helper layout for plain-content sections
    Media.tsx            <img>/<video> wrapper with corner brackets
    BackToTop.tsx        FAB
    WhatsAppFAB.tsx      FAB
    CoverageRadar.tsx    SVG world map used inside IndustriesSection
  pages/
    index.astro          ES home
    en/index.astro       EN home
    404.astro            custom 404
  styles/global.css      design tokens + section styles
public/
  favicon.svg            primary favicon
  favicon-16.png         legacy 16×16
  favicon-32.png         legacy 32×32
  apple-touch-icon.png   180×180 for iOS homescreen
  site.webmanifest       PWA-lite metadata
  robots.txt
  img/                   bullet thumbnails, catalog covers, service photos
  images/                process section background
  video/                 hero loop + autoplay clips referenced by Tech bullets
  catalogs/              the 6 catalog PDFs (3 ES + 3 EN)
design_handoff/          original handoff (kept for reference)
```

## Bilingual content

Every user-facing string lives in `src/i18n/content.ts`. The `Content` type defines what each section needs; `CONTENT.es` and `CONTENT.en` provide the values. The pages just thread `CONTENT[lang]` into the section components.

To change wording, image paths, country lists, milestones, contact info, etc., edit `content.ts` only. Components don't hardcode user-facing strings.

## Tech section: bento on desktop, accordion on mobile

`TechSection.tsx` renders two parallel structures — desktop uses an asymmetric bento grid (one row per tech: a 6×2 hero, two 3×1 small tiles, one 6-col auto-height banner). Below 640px CSS hides the bento and reveals an accordion: each tech collapses to a preview row showing either its default cover or the user-selected bullet, with a tap-to-expand body that lists the four bullets as stacked cards.

State (active tech / selected bullet per tech) is managed in React and persists across viewport resizes.

## Contact form

`ContactSection.tsx#submit` validates locally and then opens the user's email client via `mailto:ventas@transfil.com.ar` prefilled with the form fields (subject + body assembled in `submit`). Zero backend required. To upgrade to a real endpoint later (Formspree, serverless, API), replace the `window.location.href = href` line.

## Accessibility / SEO

- Skip-to-content link (`Saltar al contenido` / `Skip to content`) injected in `Base.astro`.
- `:focus-visible` outline in `--accent`, offset 3px.
- `prefers-reduced-motion` respected (process reveal, tech transitions, scroll-behavior, marquee tilt).
- `font-variant-numeric: tabular-nums` on stats, years, codes, coords — counters and tickers don't shimmy mid-animation.
- JSON-LD `Organization` schema in `<head>`.
- `<link rel="alternate" hreflang>` between ES / EN.
- `data-active` scroll-spy on nav links via `IntersectionObserver`.
- Stats SSR the final value (so JS-off readers don't see "0 años de operación"); the count-up rewinds + animates on client.

## Open follow-ups

1. **og-image per locale** — `og:image` currently points to `/img/hf-welder.png` for both ES and EN. Generate dedicated 1200×630 cards per locale.
2. **Contact form backend** — mailto handler in place; upgrade to a real endpoint when the client picks one (Formspree, Resend, etc.).
3. **Final imagery review** — bullet photos and service photos are an evolving mix of real shots and AI renders. Replace anything still looking placeholder-y when better assets arrive. All paths live in `src/i18n/content.ts`.
4. **Tech section hero per-tech cover** — currently the bento's "hero" tile shows the first bullet's image, not the tech's `t.img` cover. The cover photos exist in `content.tech[i].img` but are unused in the current layout. Decide whether to surface them somewhere (e.g., on a future overview state) or remove from the schema.
