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
  const [activeId, setActiveId] = useState<string | null>(null);

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

  useEffect(() => {
    const ids = ['tech', 'catalogs', 'process', 'services', 'industries', 'history', 'contact'];
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
            <svg viewBox="0 0 228 192" width="33" height="28" preserveAspectRatio="xMidYMid meet">
              <g transform="translate(-17 229) scale(0.1 -0.1)" fill="currentColor">
                <path d="M1341 2247 l-18 -43 -8 -33 -7 -32 -14 -27 -14 -27 0 -17 0 -17 -14 -33 -14 -33 -57 -180 -57 -180 -8 -20 -9 -20 -6 -25 -6 -25 -13 -35 -13 -35 -38 -120 -37 -120 -14 -33 -14 -33 0 -15 0 -16 -14 -31 -14 -32 -28 -88 -27 -89 -24 -9 -24 -9 -340 0 -339 0 2 -247 3 -248 565 0 565 0 17 37 18 37 9 38 10 38 15 50 15 50 10 30 10 30 22 75 21 75 13 35 12 35 16 55 16 55 22 75 21 75 13 35 13 35 22 75 22 75 13 35 12 35 7 38 7 38 15 6 15 6 10 -10 9 -9 9 -44 9 -45 12 -50 13 -50 17 -65 17 -65 13 -50 12 -50 8 -35 8 -35 22 -88 23 -89 24 -9 24 -9 252 0 252 0 14 9 14 9 -17 59 -17 58 -10 30 -10 30 -14 45 -13 45 -16 55 -17 55 -13 50 -14 50 -9 25 -10 25 -16 55 -16 55 -22 75 -21 75 -13 35 -13 35 -21 75 -22 75 -16 55 -15 55 -14 33 -14 33 0 12 0 12 -21 70 -22 70 -15 43 -15 42 -329 0 -329 0 -18 -43z" />
              </g>
            </svg>
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
