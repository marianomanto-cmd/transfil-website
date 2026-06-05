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
- Analytics: **Google Tag Manager** (`GTM-PV9STD3`) — GA4 (`G-Y6H3JFZNNM`) is configured inside the container. The layout pushes a `page_view` to the `dataLayer` on every `astro:page-load` after the first (so view-transitions count), plus a `form_success` event on a confirmed contact-form send.

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

`npm run build` produces a fully static `dist/` (~19 MB total — see _Performance_ for the breakdown). Targets that work out of the box:

- **Vercel / Netlify / Cloudflare Pages** — point at the repo, build command `npm run build`, output dir `dist`.
- **Any static host** — upload `dist/` over FTP / S3 / similar.

The canonical URL is hardcoded in `src/layouts/Base.astro` and `astro.config.mjs` as `https://www.transfil.com.ar`. Update both constants if the domain changes.

## Section map

The landing page has 8 numbered sections + one unnumbered side-story:

| #  | id              | Component                       | Notes                                                                |
|----|-----------------|---------------------------------|----------------------------------------------------------------------|
| 01 | `#top`          | `Hero.tsx`                      | Workshop video bg + display headline + 4 hero stats                  |
| 02 | `#tech`         | `TechSection.tsx`               | 4 tech groups × 4 bullets, bento on desktop / accordion on mobile    |
| 03 | `#applications` | `AplicacionesSection.astro`     | Symptom → solution → benefit, A01–A04 collapsible on mobile          |
| –  | `#process`      | `ProcessSection.astro`          | 5 step cards over darkened workshop bg (unnumbered side-story)       |
| 04 | `#catalogs`     | `CatalogsSection.tsx`           | 3 PDF covers + in-page viewer modal                                  |
| 05 | `#services`     | `ServicesSection.astro`         | 4 services as a "stepper" grid of icon cards (S01–S04)               |
| 06 | `#industries`   | `IndustriesSection.tsx`         | Radar map + 3 client marquees + 14-countries watermark               |
| 07 | `#history`      | `HistorySection.astro`          | 5 milestones on vertical timeline                                    |
| 08 | `#contact`      | `ContactSection.tsx`            | Form + side panel + abstract SVG locator                             |

## Project layout

```
src/
  i18n/content.ts        all bilingual copy, typed (single source of truth)
  layouts/Base.astro     <head>, SEO meta, JSON-LD x3, GA4, skip-link, sr-only FAQ
  components/
    Hero.tsx                  workshop video bg + display headline + stats
    TechSection.tsx           bento grid of 4 tech groups × 4 bullets
    AplicacionesSection.astro symptom-cost-solution cards + metrics + CTA
    ProcessSection.astro      5 step cards over darkened workshop bg
    CatalogsSection.tsx       3 PDF covers + in-page viewer modal
    ServicesSection.astro     4 services as icon stepper (S01–S04)
    IndustriesSection.tsx     radar map + 3 client marquees + watermark
    HistorySection.astro      5 milestones on vertical timeline
    ContactSection.tsx        form + side panel + SVG locator
    Footer.astro              brand mark + per-tech and per-service deep-links
    Header.tsx                sticky header w/ scroll-progress + scroll-spy + burger
    Section.astro             helper layout for plain-content sections
    Media.tsx                 <img>/<video> wrapper with corner brackets
    CoverageRadar.tsx         SVG world map used inside IndustriesSection
    BackToTop.tsx             FAB
    WhatsAppFAB.tsx           FAB
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
  llms.txt               short site summary for AI agents (llmstxt.org)
  llms-full.txt          full bilingual fact dump for AI agents
  img/                   bullet thumbnails, catalog covers, service photos, og-image.jpg
  images/                process section background
  video/                 hero loop + autoplay clips referenced by Tech bullets
  catalogs/              the 6 catalog PDFs (3 ES + 3 EN)
design_handoff/          original handoff (kept for reference)
```

## Bilingual content

Every user-facing string lives in `src/i18n/content.ts`. The `Content` type defines what each section needs; `CONTENT.es` and `CONTENT.en` provide the values. The pages just thread `CONTENT[lang]` into the section components.

To change wording, image paths, country lists, milestones, contact info, FAQ entries, etc., edit `content.ts` only. Components don't hardcode user-facing strings (with one tiny exception in `AplicacionesSection.astro` for SÍNTOMA/SOLUCIÓN/BENEFICIO labels — kept inline because they're block markers, not content).

## Tech section: bento on desktop, accordion on mobile

`TechSection.tsx` renders two parallel structures — desktop uses an asymmetric bento grid (one row per tech: a 6×2 hero, two 3×1 small tiles, one 6-col auto-height banner). Hover on the small tiles slides up the description; touch tablets see the descriptions permanently (via `@media (hover: none)`).

Below 640px CSS hides the bento and reveals an accordion: each tech collapses to a preview row showing either its default cover or the user-selected bullet, with a tap-to-expand body that lists the four bullets as stacked cards.

Videos in the tech tiles are IntersectionObserver-gated — only the tile actively in viewport (≥50% visible after a 10% rootMargin inset) plays. Pauses on unmount too.

State (active tech / selected bullet per tech) is managed in React and persists across viewport resizes.

## Applications section (A01–A04)

`AplicacionesSection.astro` is the commercial-educational block sitting between Tech and Catalogs. Five stacked sub-blocks:

1. **Symptoms checklist** — 6 diagnostic items in a 2-col grid (1-col on mobile) + closing line.
2. **Four application cards** (`A01–A04`) in a 2×2 grid — each carries a `SÍNTOMA`, `SOLUCIÓN` and `BENEFICIO` block. The `BENEFICIO` block gets a left accent border + `--accent-soft` background.
3. **Custom-design editorial block** — branded TRANS-FIL conveyor photo as a heavily-shadowed backdrop on the right 65% of the block; on mobile it covers the whole block at lower opacity behind a near-solid overlay.
4. **Metrics strip** — 5 numeric callouts (2–4× coolant life, −50/70% changes, +10/30% tool life, etc.) with an italic caveat.
5. **Closing CTA banner** — single primary button pointing at `#contact`.

**Mobile behaviour:** the four `A0X` cards are collapsed by default at ≤640px. A small inline `<script>` (progressive enhancement, attached to `astro:page-load`) wraps the head + title in a `.tf-app-toggle` that gets `role="button"` / `aria-expanded` / `aria-controls`, plus click + keyboard handlers. Desktop is untouched — `.tf-app-toggle` uses `display: contents` so head and title flow as direct flex children of `.tf-app`, the chevron is `display: none`, and the body is always visible.

All four cards' text content stays in the server-rendered HTML, so the FAQ-adjacent keyword density is unaffected by the collapse.

## Catalog cards

`CatalogsSection.tsx` shows three downloadable PDFs as portrait covers on desktop (3-col grid, drops to 2-col at 1080px). Below 640px the cards flip to compact horizontal rows (88px cover thumb + title + 2-line desc + small CTA) so the section stays scrollable on phones.

Clicking a card opens an in-page PDF viewer (`CatalogViewer` modal — `iframe` with `#toolbar=1&view=FitH`).

The 6 PDFs (3 ES + 3 EN) live under `public/catalogs/`; they were recompressed via `gs -dPDFSETTINGS=/ebook` and total ~11 MB (down from ~29 MB) with no perceptible quality loss at screen viewing sizes.

## Services section

`ServicesSection.astro` is the S01–S04 stepper. Four cards in a 4×1 grid on desktop, 2×2 from 1080px, single column ≤640px (with a 2px accent left border replacing the hover-only rule). Each card has:

- the mono `S0X` code,
- an abstract line-art icon (wrench / loop / calendar+check / set-square+compass) — inline SVG paths,
- the title and one-line description,
- a 2px accent rule that slides in on hover and a small icon nudge.

Deep-link anchors (`#service-s01..s04`, used by the footer) and the `scroll-margin-top` offset are preserved.

## Contact form

`ContactSection.tsx#submit` validates locally and then opens the user's email client via `mailto:ventas@transfil.com.ar` prefilled with the form fields (subject + body assembled in `submit`). Zero backend required.

The form is accessibility-correct: `role=alert` on field errors, `aria-required` + `aria-invalid` + `aria-describedby` on each required input, `role=status` + `aria-live="polite"` on the success toast (with a `:empty` CSS rule so it doesn't reserve flex gap when idle), on-blur validation per field, focus-first-invalid on submit.

To upgrade to a real endpoint later (Formspree, Resend, etc.), replace the `window.location.href = href` line.

## SEO

- **Canonical**: every page emits a self-referential `<link rel="canonical">`.
- **hreflang**: ES, EN and `x-default` symmetric across pages and sitemap.
- **OG / Twitter**: `/img/og-image.jpg` (1200×630, ~94 KB) with TRANS-FIL conveyor branding, per-locale `og:image:alt`.
- **Meta description**: trimmed to ≤155 chars per locale; `keywords` removed (Google ignores, Bing penalises).
- **JSON-LD x3** in `Base.astro`:
  - `Organization` + `LocalBusiness` combined schema — workshop address, geo coordinates (−31.4036, −64.1924), `inLanguage`, E.164 telephone, `areaServed` as 14 `Country` objects.
  - `Service @graph` — one node per service S01–S04, attributed back to the org via `@id`.
  - `FAQPage` — the 12 bilingual Q&As from `content.faq` (3 of them about coolant degradation / soluble life / when to invest in filtration are direct surface for AI search engines).
- **Visually-hidden About + FAQ** in `<body>` — `.tf-sr-only` block that mirrors the JSON-LD in plain text so crawlers can extract facts without parsing JSON-LD.
- **404**: `noindex` via a `noindex` prop on `<Base>`.
- **Sitemap**: `<lastmod>` per build via `serialize` hook.
- **robots.txt**: allow-all + points at `https://www.transfil.com.ar/sitemap-index.xml`.
- **Deep links from footer**: each tech and service in the footer links to its own anchor (`#tech-conveyors`, `#service-s01`, …); the targets carry `scroll-margin-top: calc(var(--header-h) + 24px)` so the sticky header doesn't cover them.
- **Image alt + dims**: tech tile photos, video labels and catalog covers carry descriptive `alt` / `aria-label` text, plus `width`/`height` attributes where the source is known (anti-CLS).

## AI / LLM discoverability

- `/llms.txt` — short site summary per the llmstxt.org proposal (product lines, services, contact).
- `/llms-full.txt` — the full bilingual fact dump (all four product lines with bullets, services, industries, countries, history, contact, catalog file paths). Source of truth for AI agents fetching the site outside the rendered HTML.
- The FAQPage schema (12 Q&As) and the `.tf-sr-only` About + FAQ block in `<body>` cover the same ground for crawlers that don't fetch the side-files.

## Performance

`dist/` is ~19 MB total: 11 MB catalog PDFs + 4.6 MB video + 2.3 MB images + the rest (HTML/CSS/JS/fonts).

- **LCP**: hero video uses `preload="none"` + `src` set in JS via `requestIdleCallback` so the poster image (`/img/hero-poster.webp`) becomes the LCP element instead of competing with the multi-MB video fetch. Mobile/desktop split moved out of `<source media>` (Safari/Firefox don't honour it reliably) into a JS `matchMedia('(max-width: 768px)')` pick.
- **Hero video pause on scroll**: an IntersectionObserver pauses the hero video when the section is off-screen so the GPU isn't decoding a 1.2 MB H.264 loop while the user reads further down. Resumes when the section comes back.
- **Below-the-fold media**: bullet thumbnails are `loading="lazy"` + `decoding="async"`. Tech-section videos are IO-gated (only the tile actively in viewport — ≥50% visible after a 10% rootMargin inset — plays).
- **Counter SSR**: `useCountUp` renders the final value in HTML; client rewinds + animates on intersect. JS-off readers don't see "0 años de operación". Patterns like `24/7` short-circuit so the literal text renders.
- **View Transitions**: `<ClientRouter />` keeps the document alive across ES ↔ EN swaps.
- **Assets re-encoded** (see commits `eda68b8`, `5cb3ba0`, `a2f682a`):
  - **Videos** — total cut from 12 MB → 4.6 MB. `t02-magnetic-separator` trimmed 18s → 10s loop at CRF 31 (2.9 MB → 1.4 MB); `t04-laser-cutting` / `t04-plasma-cutting` downscaled to 540p + 25 fps + CRF 33 (744/625 KB → 375/311 KB); hero-desktop downscaled 1080p → 720p (2.7 MB → 1.2 MB). All videos run `-c:v libx264 -preset slower -an -movflags +faststart`.
  - **Images** — 18 largest webp files re-encoded at `cwebp -q 78 -m 6`; total -19% on those, no perceptible loss after the heavy shadowing/darkening overlays the site applies.
  - **PDFs** — all 6 recompressed with `gs -dPDFSETTINGS=/ebook -dDetectDuplicateImages=true`; 29 MB → 10.6 MB (-65%) with page counts preserved.
  - **Cleanup** — dropped an orphaned 958 KB `hf-welder.png` and a stray 800 KB `node_modules/` cache directory that was being shipped via `public/img/`.

## Accessibility

- Skip-to-content link (`Saltar al contenido` / `Skip to content`) at the top of `<body>`.
- `:focus-visible` outline in `--accent`, offset 3px (offset −2px on solid buttons, +4px on text links).
- `prefers-reduced-motion` respected globally:
  - hero parallax disabled when `(prefers-reduced-motion: reduce)` matches (gated on top of viewport + pointer checks; listens to `change` events on both media queries),
  - magnetic CTA effect skipped entirely,
  - process reveal, tech transitions, scroll-behavior, marquee tilt, accordion chevron, applications chevron all neutered.
- `font-variant-numeric: tabular-nums + slashed-zero` on stats, years, codes, coords.
- `data-active` scroll-spy on nav links via `IntersectionObserver` (includes the new `#applications` id).
- **Header burger**: 44×44, `type="button"`, `aria-expanded`, `aria-controls` wired to `id="tf-mobile-nav"`. The mobile drawer itself is a focus-trapped `role="dialog"` / `aria-modal="true"` region — Escape closes and returns focus to the burger; body scroll is locked while open.
- 44px minimum tap targets across all primary tappables (burger, language switcher, CTA button, FAB, catalog viewer buttons, app collapse toggles); `touch-action: manipulation` to drop the 300ms tap delay.
- `safe-area-inset` padding on the fixed header padding and the WhatsApp FAB so they clear the iPhone notch and home indicator.
- Mobile grain overlay (`body::before`) skipped at ≤640px to save paint cost.

## Open follow-ups

1. **og-image per locale** — current `og-image.jpg` works for both; could add English overlay text for /en/ shares.
2. **Contact form backend** — `mailto:` handoff is in place; upgrade to a real endpoint when the client picks one (Formspree, Resend, etc.).
3. **EN polish of the Applications section** — the Spanish copy was reviewed against SEO targets; the English version is a functional translation that the client should review before that locale is promoted.
4. **Final imagery review** — bullet photos and service photos are an evolving mix of real shots and AI renders. Replace anything still looking placeholder-y when better assets arrive. All paths live in `src/i18n/content.ts`.
5. **Tech section hero per-tech cover** — currently the bento's "hero" tile shows the first bullet's image, not the tech's `t.img` cover. The cover photos exist in `content.tech[i].img` but are unused in the current layout. Decide whether to surface them somewhere (e.g., on a future overview state) or remove from the schema.
6. **Hero LCP further** — the lazy video helps but a dedicated `<link rel="preload" as="image" href="/img/hero-poster.webp" fetchpriority="high">` would shave more time off the first paint.
