# Trans-Fil Website

Trilingual institutional site for **Trans-Fil S.R.L.** — industrial machinery, Córdoba, Argentina — plus its campaign landings. Production at <https://www.transfil.com.ar>.

| Page | ES | EN | PT |
|---|---|---|---|
| Home (single-page, 8 sections) | `/` | `/en/` | `/pt/` |
| Tube-forming filtration landing | `/conformado` | `/en/conformado` | `/pt/conformado` |

- Custom 404 at `/404` (auto-localises based on the path that triggered it; `noindex`)
- Locales, prefixes and per-page URLs all come from `src/i18n/routes.ts` — see [`docs/LANDINGS.md`](docs/LANDINGS.md)

## Stack

- **Astro 5** static output, with **React** islands hydrated per-component (`client:visible` / `client:load` / `client:idle`).
- **TypeScript** everywhere; `npm run check` runs `astro check`.
- All institutional copy in `src/i18n/content.ts` and all campaign-landing copy in `src/i18n/landings.ts` — single sources of truth, typed (`Content` / `LandingContent`).
- All URLs in `src/i18n/routes.ts` — locales, prefixes and the path of every page in every language. No component hardcodes a path.
- Design tokens + section styles in `src/styles/global.css`; scoped styles inside Astro components where they're self-contained (e.g. `ProcessSection.astro`).
- `@astrojs/sitemap` emits `sitemap-index.xml` + `sitemap-0.xml` with the three hreflangs per URL and per-build `lastmod`; `/sitemap.xml` 301s to the index.
- View Transitions via `<ClientRouter />` for ES ↔ EN ↔ PT swaps.
- Analytics: **Google Tag Manager** (`GTM-PV9STD3`) — GA4 (`G-Y6H3JFZNNM`) is configured inside the container. The layout pushes `dataLayer` key events for GTM/GA4: `page_view` on every `astro:page-load` after the first (so view-transitions count), `generate_lead` on a confirmed contact-form send, and `click_whatsapp` / `click_phone` on those link clicks (delegated listener in `Base.astro`). Campaign landings additionally push `generate_lead` with `page` / `locale` / `lead_type` and a `whatsapp_click` event — see [`docs/LANDINGS.md`](docs/LANDINGS.md).

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/ (7 pages: 3 homes, 3 landings, /404)
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
| 03 | `#applications` | `AplicacionesSection.astro`     | Diagnostic panel + dirty→filter→clean figure + A01–A04 machine diagrams |
| –  | `#process`      | `ProcessSection.astro`          | 5 step cards over darkened workshop bg (unnumbered side-story)       |
| 04 | `#catalogs`     | `CatalogsSection.tsx`           | 3 PDF covers + in-page viewer modal                                  |
| 05 | `#services`     | `ServicesSection.astro`         | 4 services as a "stepper" grid of icon cards (S01–S04)               |
| 06 | `#industries`   | `IndustriesSection.tsx`         | Dotted coverage map + 3 client marquees + 14-countries watermark               |
| 07 | `#history`      | `HistorySection.astro`          | 5 milestones on vertical timeline                                    |
| 08 | `#contact`      | `ContactSection.tsx`            | Form + side panel + abstract SVG locator                             |

## Project layout

```
src/
  i18n/
    routes.ts            locales, prefixes and every page's URL per language
    content.ts           all institutional copy in ES/EN/PT, typed
    landings.ts          campaign-landing copy (LANDINGS.conformado.*), typed
  layouts/
    Base.astro           <head>, SEO meta, JSON-LD, GTM, skip-link, sr-only FAQ
    LandingLayout.astro  the campaign-landing shape, reused by every landing
  components/
    Hero.tsx                  workshop video bg + display headline + stats
    TechSection.tsx           bento grid of 4 tech groups × 4 bullets
    AplicacionesSection.astro diagnostic panel + A01–A04 cards + metrics + CTA
    FlowDiagram.astro         dirty fluid → filtration cassette → stable flow
    MachineDiagram.astro      the four A01–A04 process microdiagrams
    SystemDiagram.astro       scroll-driven schematic of the filtration station
    ProcessSection.astro      5 step cards over darkened workshop bg
    CatalogsSection.tsx       3 PDF covers + in-page viewer modal
    ServicesSection.astro     4 services as icon stepper (S01–S04)
    IndustriesSection.tsx     dotted coverage map + 3 client marquees + watermark
    HistorySection.astro      5 milestones on vertical timeline
    ContactSection.tsx        form + side panel + SVG locator
    Footer.astro              brand mark + per-tech and per-service deep-links + landing link
    Header.tsx                sticky header w/ scroll-progress + scroll-spy + burger
    Section.astro             helper layout for plain-content sections
    Media.tsx                 <img>/<video> wrapper with corner brackets
    CoverageRadar.tsx         dotted (halftone) coverage map in IndustriesSection
    coverage-dots.ts          pre-computed halftone dot positions for the map
    BackToTop.tsx             FAB
    WhatsAppFAB.tsx           FAB
  pages/
    index.astro          ES home
    en/index.astro       EN home
    pt/index.astro       PT home
    conformado.astro     ES tube-forming landing
    en/conformado.astro  EN tube-forming landing
    pt/conformado.astro  PT tube-forming landing
    api/contact.ts       Resend endpoint (prerender=false → serverless)
    404.astro            custom 404 (path-aware locale, noindex)
  lib/
    cx.ts                className helper
    hooks.ts             useReveal / useScrollY / useCountUp
  styles/global.css      design tokens + section styles
public/
  favicon-16/32/48.png   favicons, generated from the brand logo
  apple-touch-icon.png   180×180 for iOS homescreen
  favicon-192/512.png    larger icons (PWA / manifest, social)
  site.webmanifest       icons + theme-color (display: browser → not installable)
  robots.txt             allow-all, points at /sitemap-index.xml
  llms.txt               short site summary for AI agents (llmstxt.org)
  llms-full.txt          full ES/EN fact dump + landings, for AI agents
  img/                   logo-mark.png, bullet thumbnails, catalog covers, service photos, og-image.jpg
  images/                process section background
  video/                 hero loop + autoplay clips referenced by Tech bullets
  catalogs/              the 6 catalog PDFs (3 ES + 3 EN)
docs/
  LANDINGS.md            locales + the landing pattern + roadmap + recipe
  contacto-email.md      Resend setup, DNS records, RESEND_API_KEY
design_handoff/          original handoff (kept for reference)
```

## Trilingual content (ES / EN / PT)

Three locales: `es` (default, no prefix, `es-AR`), `en` (`/en/`, `en-US`) and `pt` (`/pt/`, `pt-BR` — Brazilian Portuguese, industrial register).

Every user-facing string lives in `src/i18n/content.ts`. The `Content` type defines what each section needs; `CONTENT.es`, `CONTENT.en` and `CONTENT.pt` provide the values, so TypeScript flags any locale missing a field. Pages just thread `CONTENT[lang]` into the section components.

Chrome labels that used to be inline `lang === 'es' ? … : …` ternaries inside components (skip-link, `SÍNTOMA` / `SOLUCIÓN` / `BENEFICIO`, `Descargar` / `Cerrar`, `COBERTURA`, `Países alcanzados`, the About/FAQ headings) now live in `content.ui`. That's what keeps a new locale from silently shipping Spanish fragments — **don't reintroduce a locale ternary in a component**.

`src/i18n/routes.ts` owns the URL layer: `LOCALES`, `LOCALE_META` (html lang / og:locale / hreflang / prefix / schema language) and `PAGE_PATHS` (`home` and `conformado` × 3 locales). The language switcher, the hreflang block, canonicals, the logo link, the footer deep-links and the sitemap all read from it.

PT catalogs point at the English PDFs (there is no Portuguese edition yet); `catalogs.note` renders the caveat under the section subtitle.

To change wording, image paths, country lists, milestones, contact info or FAQ entries, edit `content.ts` only. Adding a locale is documented step by step in [`docs/LANDINGS.md`](docs/LANDINGS.md).

## Campaign landings

`/conformado` (+ `/en/` and `/pt/`) is the first **application** landing: coolant filtration for tube-forming lines. Google Ads and LinkedIn point here, never at the home.

- Copy: `src/i18n/landings.ts` (`LANDINGS.conformado.{es,en,pt}`, typed `LandingContent`).
- Layout: `src/layouts/LandingLayout.astro` — symptom → system → why us → proof → form/WhatsApp → FAQ → closing. Reuses the `tf-*` classes and tokens; no new visual language.
- Masthead: a muted 16s loop of the coolant shot (`/video/hero-coolant.mp4`, 812 KB), built from the full 8s UHD master the home hero comes from, played forward then reversed so the loop closes exactly without discarding a frame (the take is a slow push-in, so a plain loop snaps back). The poster is the LCP (preloaded via `Base.astro`'s `preloadImage`) and matches the loop's first frame; the video source is attached on idle and skipped entirely under `prefers-reduced-motion`. Recipe in [`docs/LANDINGS.md`](docs/LANDINGS.md).
- Pages: `src/pages/conformado.astro`, `src/pages/en/conformado.astro`, `src/pages/pt/conformado.astro` — six lines each.
- Own SEO: canonical, reciprocal hreflang, page-specific OG, and `WebPage` + `Service` + `FAQPage` + `BreadcrumbList` JSON-LD. The home's FAQ is *not* emitted here.
- Deep-linked from the home: the `A01` card carries `link: { page: 'conformado', … }`, which renders both the card's "Ver solución" button and the footer link.
- Section `02 — El sistema` opens with `SystemDiagram.astro` (below), then the four `F01–F04` cards.
- 301s from the legacy campaign URLs (`/filtracion-conformado-tubos`, `/filtracao-conformacao-tubos`) in `astro.config.mjs`.

The full pattern, the roadmap (`/lavado`, `/transporte`, `/hornos` — not implemented) and the step-by-step recipe for a new landing are in [`docs/LANDINGS.md`](docs/LANDINGS.md).

## Filtration-station schematic (`SystemDiagram.astro`)

Opens section `02 — El sistema` on every application landing: one SVG plan of the central filtration station (viewBox `1320 × 680`), walked stage by stage. It replaces the line-art PNG that used to circulate — same content, redrawn in the site's dark language, with every reference as translatable text.

**The run.** The outer block is `380vh`; the inner one is `position: sticky` and the scroll advances `F01 → F02 → F03 → F04`. Each quarter lights its equipment group to full ink (the rest sit at `0.4`), moves a plan-style focus (four corner ticks + a blue halo, redrawn from a `{x,y,w,h}` model so the tick arms keep their length as the box changes shape) and pulls the tub's gradient from brown toward blue as the fluid gets clean. The effective run is `380vh − 100vh ≈ 2520px` at a 900px viewport — about 630px, or six wheel notches, per stage.

**References are HTML, not `<text>`.** Fourteen `<span>`s positioned in percentages over the plan, in an `aria-hidden` overlay. They translate through `landings.ts` like any other string, scale with the container via `cqw`, and can be selected. The SVG carries the whole description in `role="img"` + `aria-label` so a screen reader gets one coherent sentence instead of fourteen fragments.

**The rail** below the plan is real navigation: four buttons with `aria-current="step"`. With the pin active a click scrolls to that stage; without it (phones, reduced motion) the click *is* the navigation and renders the stage directly.

**Dependencies: none.** Loops are CSS. The stage progress is one `scroll` listener (capture + `requestAnimationFrame`, torn down on view transitions). GSAP is used for the focus tween *only if* `window.gsap` already exists; it isn't installed, so the focus snaps — which the group cross-fade covers.

**Phones (≤860px)** drop the pin: 380vh of hijacked scroll on a handset is a trap. The plan becomes a normal block that pans horizontally inside its frame, the rail goes 2×2, and selecting a stage scrolls the frame so the lit zone is actually on screen. `prefers-reduced-motion` gets the same treatment — no pin, no loops, every group at full ink.

**Two constraints worth knowing before editing:**

1. `.tf-sd-stage` has `min-width: 1030px`. That is where `max(10.5px, 1.02cqw)` meets its floor: below it the labels stop shrinking with the drawing, and the bottom reference row starts colliding. Holding the container above that point keeps the plan at the proportions it was drawn in at every viewport. Lower it and the labels overlap on phones.
2. `body` must not be `overflow-x: hidden` — see the note in `global.css`. `hidden` makes the body a scroll container and silently kills `position: sticky` for every descendant, which is exactly how this schematic pins. `clip` crops identically without creating a scrollport.

Label positions live inline on each `<span>`. If the copy changes, re-check the bottom row: `waste`, `tank`, `exchanger`, `bag` and `cabinet` share one baseline and the Spanish strings are the longest in the set.

## Tech section: bento on desktop, accordion on mobile

`TechSection.tsx` renders two parallel structures — desktop uses an asymmetric bento grid (one row per tech: a 6×2 hero, two 3×1 small tiles, one 6-col auto-height banner). Hover on the small tiles slides up the description; touch tablets see the descriptions permanently (via `@media (hover: none)`).

Below 640px CSS hides the bento and reveals an accordion: each tech collapses to a preview row showing either its default cover or the user-selected bullet, with a tap-to-expand body that lists the four bullets as stacked cards.

Videos in the tech tiles are IntersectionObserver-gated — only the tile actively in viewport (≥50% visible after a 10% rootMargin inset) plays. Pauses on unmount too.

State (active tech / selected bullet per tech) is managed in React and persists across viewport resizes.

## Applications section (A01–A04)

`AplicacionesSection.astro` is the commercial-educational block sitting between Tech and Catalogs. It reads as one narrative — *problem → diagnosis → contamination → filtration → stable flow → applications* — built from six stacked sub-blocks:

0. **Kicker rail** — `FILTRACIÓN · RECUPERACIÓN · VIDA ÚTIL` under the section head (from `applications.kicker`, localized).
1. **Diagnostic panel** — instrument housing (blueprint grid, corner ticks, localized blue glow) around the 6 symptoms as indexed rows `01`–`06` in a 2-col grid (1-col on mobile). On entry a blue scan sweeps the panel once, the divider draws, the rows stagger in, and the two demonstration rows light up: accent bar, lit bed, filled box and a tick that draws itself. The `UMBRAL` readout is a bordered block with a six-segment gauge (two lit) next to `02 / 06`. That count is the threshold the closing line states ("two or more"), *not* a claim about the reader's plant — the framing, the label and the gauge are all deliberate about that.
2. **Flow figure** (`FlowDiagram.astro`) — contaminated fluid (blue + industrial brown, scattered heights) → an isometric filtration cassette → recovered fluid (blue only, collapsed onto the centreline). Inside the cassette blue passes through three stages while brown is caught at the plates and settles into the bed. Pure HTML/CSS/SVG: no WebGL, no canvas, no per-particle JS. Each rail particle is a full-width track element whose single `translateX(100%)` keyframe resolves against the rail width, with a negative `animation-delay` that spreads the particles at t=0 *and* doubles as the static position under reduced motion.
3. **Four application cards** (`A01–A04`) in a 2×2 grid — each carries `SÍNTOMA`, `SOLUCIÓN`, `BENEFICIO` and its own process microdiagram (`MachineDiagram.astro`: rolls + tube, lathe + chips, wheel + coolant, tunnel + spray). The four share one visual language (graphite structure, grey technical lines, blue for flow, brown for contamination, same viewBox / stroke weights / blueprint grid). The `BENEFICIO` block gets a left accent border, a deep blue bed and one light sweep on entry. A card with a `link` in `content.ts` (today only `A01` → `/conformado`) also renders a "Ver solución" button, in all three locales.
4. **Custom-design editorial block** — branded TRANS-FIL conveyor photo as a heavily-shadowed backdrop on the right 65%; on mobile it covers the whole block at lower opacity behind a near-solid overlay.
5. **Metrics strip** — 5 numeric callouts with an italic caveat.
6. **Closing CTA banner** — single primary button pointing at `#contact`.

**Layout rule for the diagrams:** the microdiagram always gets its own grid cell — its own column beside the text at ≥1360px, its own full-width row directly under the title below that. It is never absolutely positioned over the copy, at any width.

**Motion orchestration:** one inline `<script>` on `astro:page-load`, no framework, no animation library.
- `is-active` fires the one-shot entry sequences (panel scan, flow assembly, per-card cascade `rule → code → title → symptom → solution → benefit`). Added once per block, never removed.
- `is-idle` pauses **every** mechanical loop while a figure is off screen; scrolled away, the section runs zero animations.
- The cursor light over the card grid (`--mx` / `--my` on `.tf-apps-grid`, rAF-throttled `pointermove`) only binds on fine pointers when the visitor hasn't asked for reduced motion.
- The safety net that reveals a block whose observer never reported is deliberately limited to what is already on screen — revealing the whole section on a timer would burn every entry sequence before the visitor scrolled down to it.

**CSS location:** the section's ~600 lines live in the components themselves (Astro-scoped), not `global.css`, so the campaign landings — which never render it — don't download them. The shared blocks below it (custom / metrics / CTA) keep their rules in `global.css`.

**Mobile behaviour:** the four `A0X` cards are collapsed by default at ≤640px. The head, title and the machine diagram stay visible (so a collapsed card still has a visual identity); only the three text blocks toggle, via a `.tf-app-collapse` region wired with `role="button"` / `aria-expanded` / `aria-controls` on the head. The diagram viewport is capped at 150px tall on phones, the flow figure stacks to one column with the chevrons turned downward, and the particle count per rail drops.

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

`ContactSection.tsx#submit` validates locally, then `fetch`-POSTs the fields as JSON to `/api/contact` (`src/pages/api/contact.ts`, `prerender = false` → a Vercel serverless function) which sends the email via **Resend** to `ventas@transfil.com.ar` (`from: web@transfil.com.ar`, `replyTo` = the visitor). A hidden `website` honeypot plus server-side validation guard it; the form adds a "Línea de interés" select, sending/success/error states, and pushes a `generate_lead` dataLayer event on a confirmed send. Setup, DNS records and the `RESEND_API_KEY` env var are documented in `docs/contacto-email.md`.

On a campaign landing the same component takes `page`, `defaultLinea`, `lineType`, `heading`, `success`, `waPrompt` and `waMessage` props: it pre-selects the line of interest, adds a "tipo de línea" select, captures the URL's UTMs, swaps the inline toast for a success panel with a WhatsApp button, and pushes `generate_lead` with `page` / `locale` / `lead_type`. The endpoint then tags the subject `[Conformado][es] Consulta web — {empresa}` and appends *Tipo de línea*, *Origen* and the UTM rows. **Without `page` — i.e. from the home — subject and body are byte-for-byte what they were.** There is one mailer; don't add another.

`Header` and `ContactSection` deliberately take narrow props (`nav` + `langSwitch`; `contact` + `lang` + `whatsappMessage` + `workshopActive`) rather than the whole `Content`. Passing the full dictionary serialised ~60 KB of unrelated copy into the island props on every page. Keep it that way.

The form is accessibility-correct: `role=alert` on field errors, `aria-required` + `aria-invalid` + `aria-describedby` on each required input, `role=status` + `aria-live="polite"` on the success toast (with a `:empty` CSS rule so it doesn't reserve flex gap when idle), on-blur validation per field, focus-first-invalid on submit.

## SEO

- **Canonical**: every page emits a self-referential `<link rel="canonical">`.
- **hreflang**: ES, EN, PT and `x-default` (→ ES), reciprocal across pages and sitemap, generated from `src/i18n/routes.ts`.
- **OG / Twitter**: `/img/og-image.jpg` (1200×630, ~94 KB) with TRANS-FIL conveyor branding, per-locale `og:image:alt`.
- **Meta description**: trimmed to ≤155 chars per locale; `keywords` removed (Google ignores, Bing penalises).
- **JSON-LD x3** in `Base.astro`:
  - `Organization` + `LocalBusiness` combined schema — workshop address, geo coordinates (−31.4036, −64.1924), `inLanguage`, E.164 telephone, `areaServed` as 14 `Country` objects.
  - `Service @graph` — one node per service S01–S04, attributed back to the org via `@id`.
  - `FAQPage` — the 12 Q&As from `content.faq` per locale (3 of them about coolant degradation / soluble life / when to invest in filtration are direct surface for AI search engines). Landings override it with their own FAQ and add `WebPage` + `Service` + `BreadcrumbList`.
- **Visually-hidden About + FAQ** in `<body>` — `.tf-sr-only` block that mirrors the JSON-LD in plain text so crawlers can extract facts without parsing JSON-LD.
- **404**: `noindex` via a `noindex` prop on `<Base>`.
- **Sitemap**: 6 URLs (3 homes + 3 landings), each with the three `xhtml:link` alternates and a `<lastmod>` per build. The `serialize` hook also normalises trailing slashes so every `<loc>` matches the page's own canonical (locale roots keep the slash, landings don't).
- **robots.txt**: allow-all + points at `https://www.transfil.com.ar/sitemap-index.xml`. `/sitemap.xml` used to 404; it now 301s to the index.
- **Redirects**: declared in `astro.config.mjs` and emitted by the Vercel adapter as real 301s in `.vercel/output/config.json` (no meta-refresh HTML).
- **Deep links from footer**: each tech and service in the footer links to its own anchor (`#tech-conveyors`, `#service-s01`, …); the targets carry `scroll-margin-top: calc(var(--header-h) + 24px)` so the sticky header doesn't cover them.
- **Image alt + dims**: tech tile photos, video labels and catalog covers carry descriptive `alt` / `aria-label` text, plus `width`/`height` attributes where the source is known (anti-CLS).

## AI / LLM discoverability

- `/llms.txt` — short site summary per the llmstxt.org proposal (product lines, services, contact).
- `/llms-full.txt` — the full fact dump (all four product lines with bullets, the four production applications A01–A04 as symptom → installation → benefit, services, industries, countries, history, contact, catalog file paths). Source of truth for AI agents fetching the site outside the rendered HTML.
- Both side-files are hand-maintained: when `applications.cards` or the product-line copy changes in `src/i18n/content.ts`, update them in the same commit — nothing generates them.
- The FAQPage schema (12 Q&As) and the `.tf-sr-only` About + FAQ block in `<body>` cover the same ground for crawlers that don't fetch the side-files.

## Performance

`dist/` is ~19 MB total: 11 MB catalog PDFs + 4.6 MB video + 2.3 MB images + the rest (HTML/CSS/JS/fonts).

- **LCP**: hero video uses `preload="none"` + `src` set in JS via `requestIdleCallback` so the poster image (`/img/hero-poster.webp`) becomes the LCP element instead of competing with the multi-MB video fetch. Mobile/desktop split moved out of `<source media>` (Safari/Firefox don't honour it reliably) into a JS `matchMedia('(max-width: 768px)')` pick.
- **Hero video pause on scroll**: an IntersectionObserver pauses the hero video when the section is off-screen so the GPU isn't decoding a 1.2 MB H.264 loop while the user reads further down. Resumes when the section comes back.
- **Below-the-fold media**: bullet thumbnails are `loading="lazy"` + `decoding="async"`. Tech-section videos are IO-gated (only the tile actively in viewport — ≥50% visible after a 10% rootMargin inset — plays).
- **Counter SSR**: `useCountUp` renders the final value in HTML; client rewinds + animates on intersect. JS-off readers don't see "0 años de operación". Patterns like `24/7` short-circuit so the literal text renders.
- **View Transitions**: `<ClientRouter />` keeps the document alive across ES ↔ EN swaps.
- **Applications CSS is component-scoped**: the section's ~600 lines live in `AplicacionesSection.astro` / `FlowDiagram.astro` / `MachineDiagram.astro` rather than `global.css`, so the campaign landings — which never render it — stop downloading them (`global.css` −4 KB, and the landing bundle no longer carries the flow/diagram rules at all).
- **Nothing animates off-screen**: an IntersectionObserver puts `is-idle` on the flow figure and each machine diagram when it leaves the viewport, which pauses every loop. Measured: 97 running animations with the section in view, 0 once it scrolls away. The pause rules need `!important` because the entry rules re-declare the `animation` shorthand, which resets `animation-play-state`.
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
  - process reveal, tech transitions, scroll-behavior, marquee tilt, accordion chevron, applications chevron all neutered,
  - the landing schematic drops its `380vh` pin entirely — hijacking three screens of scroll is itself motion nobody asked for — and shows every stage at full ink, navigable from the rail,
  - the whole applications section holds its final frame: no scan, no rotations, no particle loops, no cursor light. The flow figure swaps its moving particles for a parked set (`.tf-fl-still`) so the dirty → filtered → clean story still reads as a static drawing. Verified at 0 running animations.
- `font-variant-numeric: tabular-nums + slashed-zero` on stats, years, codes, coords.
- `data-active` scroll-spy on nav links via `IntersectionObserver` (includes the new `#applications` id).
- **Header burger**: 44×44, `type="button"`, `aria-expanded`, `aria-controls` wired to `id="tf-mobile-nav"`. The mobile drawer itself is a focus-trapped `role="dialog"` / `aria-modal="true"` region — Escape closes and returns focus to the burger; body scroll is locked while open.
- 44px minimum tap targets across all primary tappables (burger, language switcher, CTA button, FAB, catalog viewer buttons, app collapse toggles); `touch-action: manipulation` to drop the 300ms tap delay.
- `safe-area-inset` padding on the fixed header padding and the WhatsApp FAB so they clear the iPhone notch and home indicator.
- Mobile grain overlay (`body::before`) skipped at ≤640px to save paint cost.

## Open follow-ups

1. **Applications section vs. the V7 prototype** — the rebuild was specified by a written handoff that referenced a prototype file (`transfil-applications-animation-v7.html`) which was not in the repo and could not be found anywhere in the working environment. Composition, motion and the diagrams were built from the written spec plus the site's own tokens, so they match the description rather than the prototype frame-for-frame. If that file turns up, diff it against the section before making further changes.
2. **Landing OG image** — `/conformado` shares `/img/t03-fluids-cover.webp` (1800×900, real filtration hardware, correct `alt`). A purpose-built 1200×630 JPG with campaign framing would be better; the repo has no image tooling, so it needs to come from design. Swap it in the `ogImage` prop in `src/layouts/LandingLayout.astro`.
3. **og-image per locale** — the site-wide `og-image.jpg` works for all three; could add locale-specific overlay text.
4. **Contact form ops** — live via the Resend endpoint (`/api/contact`); to actually send, set `RESEND_API_KEY` in Vercel and publish the GTM container. The landing subject tag (`[Conformado][es] …`) and the UTM rows are worth verifying with one real send after deploy. See `docs/contacto-email.md`.
5. **GTM triggers for the landings** — `generate_lead` now carries `page` / `locale` / `lead_type`, and `whatsapp_click` is new. Note `click_whatsapp` (the site-wide delegated listener) still fires on the same clicks: don't mark both as key events or campaign WhatsApp leads get counted twice.
6. **PT catalogs** — `/pt/` serves the English PDFs with a caveat under the subtitle. Replace with Portuguese editions when they exist (`catalogs.items[].file` + `.img`, and drop `catalogs.note`).
7. **EN / PT copy review** — the Spanish copy was reviewed against SEO targets; the English and Brazilian-Portuguese versions are professional translations the client should review before those locales are promoted.
8. **Final imagery review** — bullet photos and service photos are an evolving mix of real shots and AI renders. Replace anything still looking placeholder-y when better assets arrive. All paths live in `src/i18n/content.ts`.
9. **Tech section hero per-tech cover** — currently the bento's "hero" tile shows the first bullet's image, not the tech's `t.img` cover. The cover photos exist in `content.tech[i].img` but are unused in the current layout. Decide whether to surface them somewhere (e.g., on a future overview state) or remove from the schema.
10. **Hero LCP further** — the lazy video helps but a dedicated `<link rel="preload" as="image" href="/img/hero-poster.webp" fetchpriority="high">` would shave more time off the first paint.
