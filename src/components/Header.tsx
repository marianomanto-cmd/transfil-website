import { Fragment, useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import type { Content, Lang } from '../i18n/content';
import { LOCALES, LOCALE_META, pathFor, type PageKey } from '../i18n/routes';

type NavItem = { href: string; label: string };

type Props = {
  lang: Lang;
  /**
   * Only the two branches the header reads. Passing the whole `Content`
   * would serialise the entire site dictionary into the island's props —
   * ~30 KB of unrelated copy on every page.
   */
  nav: Content['nav'];
  langSwitch: Content['langSwitch'];
  /**
   * Which routable page this header sits on. The language switcher jumps to
   * the same page in the target locale (home ↔ home, landing ↔ landing) and
   * the logo goes to that locale's home.
   */
  page?: PageKey;
  /**
   * Section links. Defaults to the home's eight anchors; a campaign landing
   * passes its own (or `[]` for a bare header with just logo + switcher + CTA).
   */
  navItems?: NavItem[];
  /** Header CTA. Defaults to the contact section of the home. */
  cta?: { href: string; label: string };
};

function LangSwitch({ lang, labels, page, className }: {
  lang: Lang;
  labels: Content['langSwitch'];
  page: PageKey;
  className?: string;
}) {
  return (
    <div className={cx('tf-lang', className)} role="group" aria-label="Language">
      {LOCALES.map((l, i) => (
        <Fragment key={l}>
          {i > 0 && <span aria-hidden="true">/</span>}
          <a data-on={lang === l} href={pathFor(page, l)} hrefLang={LOCALE_META[l].hreflang}>
            {labels[l]}
          </a>
        </Fragment>
      ))}
    </div>
  );
}

export function Header({ lang, nav, langSwitch, page = 'home', navItems, cta }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile drawer: trap focus, close on Escape, lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusables = () =>
      Array.from(
        drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      ).filter((el) => el.offsetParent !== null);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    const ids = ['tech', 'applications', 'catalogs', 'process', 'services', 'industries', 'history', 'contact'];
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const items: NavItem[] =
    navItems ?? [
      { href: '#tech', label: nav.tech },
      { href: '#applications', label: nav.applications },
      { href: '#catalogs', label: nav.catalogs },
      { href: '#services', label: nav.services },
      { href: '#industries', label: nav.industries },
      { href: '#history', label: nav.history },
      { href: '#contact', label: nav.contact },
    ];
  const headerCta = cta ?? { href: '#contact', label: nav.contact };

  const onNav = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={cx('tf-header', scrolled && 'is-scrolled')}>
      <div className="tf-header-inner">
        <a href={pathFor('home', lang)} className="tf-logo" aria-label="Trans-Fil">
          <span className="tf-logo-mark" aria-hidden="true">
            <img src="/img/logo-mark.png" width="34" height="28" alt="" />
          </span>
          <span className="tf-logo-text">
            <b>TRANS·FIL</b>
            <em>Industrial Machinery</em>
          </span>
        </a>
        <nav className="tf-nav" aria-label="Primary">
          {items.map((it) => {
            const id = it.href.slice(1);
            return (
              <a
                key={it.href}
                href={it.href}
                data-active={activeId === id}
                onClick={(e) => onNav(e, it.href)}
              >
                {it.label}
              </a>
            );
          })}
        </nav>
        <div className="tf-header-aside">
          <LangSwitch lang={lang} labels={langSwitch} page={page} />
          <a href={headerCta.href} className="tf-cta-mini" onClick={(e) => onNav(e, headerCta.href)}>
            <span>{headerCta.label}</span>
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
            </svg>
          </a>
          <button
            ref={burgerRef}
            type="button"
            className="tf-burger"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="tf-mobile-nav"
            data-open={open}
            onClick={() => setOpen(!open)}
          >
            <i /><i /><i />
          </button>
        </div>
      </div>
      <div
        id="tf-mobile-nav"
        ref={drawerRef}
        className="tf-mobile-nav"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        {items.map((it) => (
          <a key={it.href} href={it.href} onClick={(e) => onNav(e, it.href)}>
            {it.label}
          </a>
        ))}
        <div className="tf-mobile-nav-foot">
          <LangSwitch lang={lang} labels={langSwitch} page={page} className="tf-mobile-lang" />
          <a href={headerCta.href} className="tf-mobile-cta" onClick={(e) => onNav(e, headerCta.href)}>
            <span>{headerCta.label}</span>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
            </svg>
          </a>
        </div>
      </div>
      <div
        className="tf-header-progress"
        aria-hidden="true"
        style={{ transform: `scaleX(${progress})` }}
      />
    </header>
  );
}
