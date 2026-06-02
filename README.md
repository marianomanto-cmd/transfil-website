# Trans-Fil Website

Bilingual single-page institutional site for **Trans-Fil S.R.L.** — industrial machinery, Córdoba, Argentina. Production at <https://www.transfil.com.ar>.

- ES at `/` (default)
- EN at `/en/`
- Custom 404 at `/404` (auto-localises based on the path that triggered it; `noindex`)

## Stack

- **Astro 5** static output, with **React** islands hydrated per-component (`client:visible` / `client:load` / `client:idle`).
- **TypeScript** everywhere; `npm run check` runs `astro check`.
- All copy in `src/i18n/content.ts` — single source of truth, typed (`Content` type).
- Design tokens + section styles in `src/styles/global.css`; scoped styles inside Astro components where they're self-contained (e.g. `ProcessSection.astro`).
- `@astrojs/sitemap` emits `sitemap-index.xml` + `sitemap-0.xml` with hreflang + per-build `lastmod`.
- View Transitions via `<ClientRouter />` for ES ↔ EN swaps.
- Analytics: **Google Analytics 4** (`G-Y6H3JFZNNM`) — fires `gtag('event', 'page_view', …)` on every `astro:page-load` after the first, so view-transitions count.

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

The canonical URL is hardcoded in `src/layouts/Base.astro` and `astro.config.mjs` as `https://www.transfil.com.ar`. Update both constants if the domain changes.

## Project layout

```
src/
  i18n/content.ts        all bilingual copy, typed (single source of truth)
  layouts/Base.astro     <head>, SEO meta, JSON-LD, GA4, skip-link, global scripts
  components/
    Hero.tsx             section 01 — workshop video bg + display headline + stats
    TechSection.tsx      section 02 — 'bento' grid of 4 tech groups × 4 bullets
    CatalogsSection.tsx  section 03 — 3 PDF covers + in-page viewer modal
    ProcessSection.astro section 04 — 5 step cards over darkened workshop bg
    ServicesSection.astro section 05 — 4 services as alternating image+text rows
    IndustriesSection.tsx section 06 — radar map + 3 client marquees + watermark
    HistorySection.astro section 07 — 5 milestones on vertical timeline
    ContactSection.tsx   section 08 — form + side panel + Google Maps embed
    Footer.astro         brand mark + per-tech and per-service deep-links + contact
    Header.tsx           sticky header w/ scroll-progress + scroll-spy + burger
    Section.astro        helper layout for plain-content sections
    Media.tsx            <img>/<video> wrapper with corner brackets
    CoverageRadar.tsx    SVG world map used inside IndustriesSection
    BackToTop.tsx        FAB
    WhatsAppFAB.tsx      FAB
  pages/
    index.astro          ES home
    en/index.astro       EN home
    404.astro            custom 404 (path-aware locale, noindex)
  lib/
    cx.ts                className helper
    hooks.ts             useReveal / useScrollY / useCountUp
  styles/global.css      design tokens + section styles
public/
  favicon.svg            primary favicon
  favicon-16.png         legacy 16×16
  favicon-32.png         legacy 32×32
  apple-touch-icon.png   180×180 for iOS homescreen
  site.webmanifest       PWA-lite metadata
  robots.txt             allow-all, points at /sitemap-index.xml
  img/                   bullet thumbnails, catalog covers, service photos, og-image.jpg
  images/                process section background
  video/                 hero loop + autoplay clips referenced by Tech bullets
  catalogs/              the 6 catalog PDFs (3 ES + 3 EN)
design_handoff/          original handoff (kept for reference)
```

## Bilingual content

Every user-facing string lives in `src/i18n/content.ts`. The `Content` type defines what each section needs; `CONTENT.es` and `CONTENT.en` provide the values. The pages just thread `CONTENT[lang]` into the section components.

To change wording, image paths, country lists, milestones, contact info, etc., edit `content.ts` only. Components don't hardcode user-facing strings.

## Tech section: bento on desktop, accordion on mobile

`TechSection.tsx` renders two parallel structures — desktop uses an asymmetric bento grid (one row per tech: a 6×2 hero, two 3×1 small tiles, one 6-col auto-height banner). Hover on the small tiles slides up the description; touch tablets see the descriptions permanently (via `@media (hover: none)`).

Below 640px CSS hides the bento and reveals an accordion: each tech collapses to a preview row showing either its default cover or the user-selected bullet, with a tap-to-expand body that lists the four bullets as stacked cards.

Videos in the tech tiles are IntersectionObserver-gated — only the bullet currently in the viewport plays.

State (active tech / selected bullet per tech) is managed in React and persists across viewport resizes.

## Catalog cards

`CatalogsSection.tsx` shows three downloadable PDFs as portrait covers on desktop (3-col grid, drops to 2-col at 1080px). Below 640px the cards flip to compact horizontal rows (88px cover thumb + title + 2-line desc + small CTA) so the section stays scrollable on phones.

Clicking a card opens an in-page PDF viewer (`CatalogViewer` modal — `iframe` with `#toolbar=1&view=FitH`).

## Contact form

`ContactSection.tsx#submit` validates locally and then opens the user's email client via `mailto:ventas@transfil.com.ar` prefilled with the form fields (subject + body assembled in `submit`). Zero backend required. To upgrade to a real endpoint later (Formspree, Resend, etc.), replace the `window.location.href = href` line.

## SEO

- **Canonical**: every page emits a self-referential `<link rel="canonical">`.
- **hreflang**: ES, EN and `x-default` symmetric across pages and sitemap.
- **OG / Twitter**: `/img/og-image.jpg` (1200×630, ~94 KB) with TRANS-FIL conveyor branding, per-locale `og:image:alt`.
- **Meta description**: trimmed to ≤155 chars per locale; `keywords` removed (Google ignores, Bing penalises).
- **JSON-LD**: `Organization` + `LocalBusiness` combined schema in `Base.astro` — includes the workshop address, geo coordinates (−31.4036, −64.1924), `inLanguage`, E.164 telephone, and `areaServed` as 14 `Country` objects (matches `content.industries.coverage`).
- **404**: noindex via a `noindex` prop on `<Base>`.
- **Sitemap**: `<lastmod>` per build via `serialize` hook.
- **robots.txt**: allow-all + points at `https://www.transfil.com.ar/sitemap-index.xml`.
- **Deep links from footer**: each tech and service in the footer links to its own anchor (`#tech-conveyors`, `#service-s01`, …); the targets carry `scroll-margin-top: calc(var(--header-h) + 24px)` so the sticky header doesn't cover them.
- **Image alt + dims**: tech tile photos, video labels and catalog covers carry descriptive `alt` / `aria-label` text, plus `width`/`height` attributes where the source is known (anti-CLS).

## Performance

- **LCP**: hero video uses `preload="none"` + `src` set in JS via `requestIdleCallback` so the poster image (`/img/hero-poster.webp`) becomes the LCP element instead of competing with the multi-MB video fetch. Mobile/desktop split moved out of `<source media>` (Safari/Firefox don't honour it reliably) into a JS `matchMedia('(max-width: 768px)')` pick.
- **Below-the-fold media**: bullet thumbnails are `loading="lazy"` + `decoding="async"`. Tech-section videos are IO-gated (only the visible one plays).
- **Counter SSR**: `useCountUp` renders the final value in HTML; client rewinds + animates on intersect. JS-off readers don't see "0 años de operación". Patterns like `24/7` short-circuit so the literal text renders.
- **View Transitions**: `<ClientRouter />` keeps the document alive across ES ↔ EN swaps.

## Accessibility

- Skip-to-content link (`Saltar al contenido` / `Skip to content`) injected at the top of `<body>`.
- `:focus-visible` outline in `--accent`, offset 3px.
- `prefers-reduced-motion` respected (process reveal, tech transitions, scroll-behavior, marquee tilt, accordion chevron).
- `font-variant-numeric: tabular-nums + slashed-zero` on stats, years, codes, coords.
- `data-active` scroll-spy on nav links via `IntersectionObserver`.
- Burger button: `type="button"`, `aria-expanded`, `aria-controls` wired to the mobile nav `id`.
- 44px minimum tap targets (burger, catalog viewer buttons, marquee tabs, accordion preview).

## Open follow-ups

1. **og-image per locale** — current `og-image.jpg` works for both; could add English overlay text for /en/ shares.
2. **Contact form backend** — mailto handler in place; upgrade to a real endpoint when the client picks one (Formspree, Resend, etc.).
3. **Final imagery review** — bullet photos and service photos are an evolving mix of real shots and AI renders. Replace anything still looking placeholder-y when better assets arrive. All paths live in `src/i18n/content.ts`.
4. **Tech section hero per-tech cover** — currently the bento's "hero" tile shows the first bullet's image, not the tech's `t.img` cover. The cover photos exist in `content.tech[i].img` but are unused in the current layout. Decide whether to surface them somewhere (e.g., on a future overview state) or remove from the schema.
5. **Hero LCP further** — the lazy video helps but a dedicated `<link rel="preload" as="image" href="/img/hero-poster.webp" fetchpriority="high">` would shave more time off the first paint.
