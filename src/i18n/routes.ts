// Single source of truth for locales and URLs.
//
// Everything that needs to know "where does this page live in language X"
// reads from here: the language switcher, the hreflang block, canonicals,
// the logo link, the footer links and the landing pages. Adding a locale or
// a landing means editing this file only — no component hardcodes a path.

export const SITE = 'https://www.transfil.com.ar';

export const LOCALES = ['es', 'en', 'pt'] as const;
export type Lang = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Lang = 'es';

type LocaleMeta = {
  /** `<html lang>` value. */
  htmlLang: string;
  /** `og:locale` value. */
  ogLocale: string;
  /** hreflang attribute value. */
  hreflang: string;
  /** URL prefix — the default locale has none. */
  prefix: string;
  /** Language name used in schema.org `availableLanguage`. */
  schemaLanguage: string;
};

export const LOCALE_META: Record<Lang, LocaleMeta> = {
  es: { htmlLang: 'es-AR', ogLocale: 'es_AR', hreflang: 'es-AR', prefix: '', schemaLanguage: 'Spanish' },
  en: { htmlLang: 'en-US', ogLocale: 'en_US', hreflang: 'en-US', prefix: '/en', schemaLanguage: 'English' },
  pt: { htmlLang: 'pt-BR', ogLocale: 'pt_BR', hreflang: 'pt-BR', prefix: '/pt', schemaLanguage: 'Portuguese' },
};

/**
 * Every routable page, with its path per locale. Homes keep the trailing
 * slash (`/en/`, `/pt/`); landings are slug URLs without one. Add a landing
 * here and the switcher, hreflang and sitemap pick it up automatically.
 */
export type PageKey = 'home' | 'conformado';

export const PAGE_PATHS: Record<PageKey, Record<Lang, string>> = {
  home: { es: '/', en: '/en/', pt: '/pt/' },
  conformado: { es: '/conformado', en: '/en/conformado', pt: '/pt/conformado' },
};

/** Path of `page` in `lang`, e.g. `pathFor('conformado', 'pt') → '/pt/conformado'`. */
export const pathFor = (page: PageKey, lang: Lang): string => PAGE_PATHS[page][lang];

/** Absolute URL of `page` in `lang`. */
export const urlFor = (page: PageKey, lang: Lang): string => `${SITE}${pathFor(page, lang)}`;

export type Alternate = { lang: Lang; hreflang: string; href: string };

/**
 * The reciprocal hreflang set for a page: one entry per locale. `x-default`
 * is emitted separately by the layout and always points at the ES version.
 */
export const alternatesFor = (page: PageKey): Alternate[] =>
  LOCALES.map((lang) => ({
    lang,
    hreflang: LOCALE_META[lang].hreflang,
    href: urlFor(page, lang),
  }));

/** `og:locale:alternate` values — every locale except the current one. */
export const altOgLocales = (lang: Lang): string[] =>
  LOCALES.filter((l) => l !== lang).map((l) => LOCALE_META[l].ogLocale);

/** Locale of a request path, used by the 404 page. Falls back to ES. */
export const langFromPath = (pathname: string): Lang =>
  (LOCALES.find((l) => l !== DEFAULT_LOCALE && pathname.startsWith(`${LOCALE_META[l].prefix}/`)) ??
    LOCALES.find((l) => l !== DEFAULT_LOCALE && pathname === LOCALE_META[l].prefix) ??
    DEFAULT_LOCALE) as Lang;
