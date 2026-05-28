import { useEffect, useState } from 'react';
import { cx } from '../lib/cx';
import type { Content, Lang } from '../i18n/content';

type Props = {
  lang: Lang;
  content: Content;
};

export function Header({ lang, content }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const items = [
    { href: '#tech', label: content.nav.tech },
    { href: '#catalogs', label: content.nav.catalogs },
    { href: '#services', label: content.nav.services },
    { href: '#industries', label: content.nav.industries },
    { href: '#history', label: content.nav.history },
    { href: '#contact', label: content.nav.contact },
  ];

  const onNav = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={cx('tf-header', scrolled && 'is-scrolled')}>
      <div className="tf-header-inner">
        <a
          href={lang === 'es' ? '/' : '/en/'}
          className="tf-logo"
          aria-label="Trans-Fil"
        >
          <span className="tf-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <rect x="1" y="1" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6 16 L16 6 L26 16 L16 26 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="16" cy="16" r="2.4" fill="currentColor" />
            </svg>
          </span>
          <span className="tf-logo-text">
            <b>TRANS·FIL</b>
            <em>Industrial Machinery</em>
          </span>
        </a>
        <nav className="tf-nav" aria-label="Primary">
          {items.map((it) => (
            <a key={it.href} href={it.href} onClick={(e) => onNav(e, it.href)}>
              {it.label}
            </a>
          ))}
        </nav>
        <div className="tf-header-aside">
          <div className="tf-lang" role="group" aria-label="Language">
            <a data-on={lang === 'es'} href="/" hrefLang="es-AR">ES</a>
            <span aria-hidden="true">/</span>
            <a data-on={lang === 'en'} href="/en/" hrefLang="en-US">EN</a>
          </div>
          <a href="#contact" className="tf-cta-mini" onClick={(e) => onNav(e, '#contact')}>
            <span>{content.nav.contact}</span>
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
            </svg>
          </a>
          <button
            className="tf-burger"
            aria-label="Menu"
            data-open={open}
            onClick={() => setOpen(!open)}
          >
            <i /><i /><i />
          </button>
        </div>
      </div>
      <div className="tf-mobile-nav" data-open={open}>
        {items.map((it) => (
          <a key={it.href} href={it.href} onClick={(e) => onNav(e, it.href)}>
            {it.label}
          </a>
        ))}
        <div className="tf-mobile-nav-foot">
          <div className="tf-lang tf-mobile-lang" role="group" aria-label="Language">
            <a data-on={lang === 'es'} href="/" hrefLang="es-AR">ES</a>
            <span aria-hidden="true">/</span>
            <a data-on={lang === 'en'} href="/en/" hrefLang="en-US">EN</a>
          </div>
          <a href="#contact" className="tf-mobile-cta" onClick={(e) => onNav(e, '#contact')}>
            <span>{content.nav.contact}</span>
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
