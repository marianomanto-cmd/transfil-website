import { useEffect, useState } from 'react';
import { useScrollY, useCountUp } from '../lib/hooks';
import type { Content } from '../i18n/content';

type Props = {
  content: Content;
  bgUrl?: string;
};

// Deterministic pseudo-random bar heights so SSR + client match.
function sparkHeights(seed: number, count = 12) {
  const out: number[] = [];
  let x = seed * 9301 + 49297;
  for (let i = 0; i < count; i++) {
    x = (x * 9301 + 49297) % 233280;
    const v = 0.35 + (x / 233280) * 0.65;
    out.push(Math.round(v * 100));
  }
  return out;
}

function Stat({ idx, v, l }: { idx: number; v: string; l: string }) {
  const [ref, display] = useCountUp(v, { duration: 1300 + idx * 120 });
  const bars = sparkHeights(idx + 1);
  return (
    <div className="tf-stat" ref={ref as React.RefObject<HTMLDivElement>}>
      <dt className="tf-mono">{`0${idx + 1}`}</dt>
      <dd>
        <span className="tf-stat-v">{display}</span>
        <span className="tf-stat-l">{l}</span>
        <span className="tf-stat-spark" aria-hidden="true">
          {bars.map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </span>
      </dd>
    </div>
  );
}

function HeroCTAs({ ctaPrimary, ctaSecondary }: { ctaPrimary: string; ctaSecondary: string }) {
  const scrollTo = (e: React.MouseEvent, sel: string) => {
    e.preventDefault();
    document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="tf-hero-ctas">
      <a
        href="#tech"
        className="tf-btn tf-btn-primary tf-btn-magnetic"
        onClick={(e) => scrollTo(e, '#tech')}
      >
        <span>{ctaPrimary}</span>
        <svg viewBox="0 0 16 16" width="14" height="14">
          <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </a>
      <a href="#contact" className="tf-btn tf-btn-ghost" onClick={(e) => scrollTo(e, '#contact')}>
        {ctaSecondary}
      </a>
    </div>
  );
}

function HUD({ lang }: { lang: 'es' | 'en' }) {
  // Live Córdoba (UTC-3) time. Format hh:mm:ss + DDMMM.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const tz = 'America/Argentina/Cordoba';
  const time = now
    ? new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: tz,
      }).format(now)
    : '--:--:--';
  const date = now
    ? new Intl.DateTimeFormat(lang === 'es' ? 'es-AR' : 'en-US', {
        day: '2-digit',
        month: 'short',
        timeZone: tz,
      })
        .format(now)
        .replace('.', '')
        .toUpperCase()
    : '— —';
  return (
    <aside className="tf-hero-hud" aria-hidden="true">
      <div className="tf-hero-hud-row">
        <span>{lang === 'es' ? 'TURNO' : 'SHIFT'}</span>
        <span className="tf-hero-hud-tick">
          <i /> <b>{lang === 'es' ? 'ACTIVO' : 'LIVE'}</b>
        </span>
      </div>
      <div className="tf-hero-hud-rule" />
      <div className="tf-hero-hud-row is-accent">
        <span>CRD · UTC−3</span>
        <b>{time}</b>
      </div>
      <div className="tf-hero-hud-row">
        <span>{lang === 'es' ? 'FECHA' : 'DATE'}</span>
        <b>{date}</b>
      </div>
      <div className="tf-hero-hud-rule" />
      <div className="tf-hero-hud-row">
        <span>{lang === 'es' ? 'PROYECTOS' : 'PROJECTS'}</span>
        <b>120+</b>
      </div>
      <div className="tf-hero-hud-row">
        <span>{lang === 'es' ? 'EXPORT' : 'EXPORT'}</span>
        <b>9 ISO</b>
      </div>
    </aside>
  );
}

export function Hero({ content, bgUrl = '/img/hf-welder.png' }: Props) {
  const c = content.hero;
  const scrollY = useScrollY();
  const enableParallax =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(min-width: 900px) and (pointer: fine)').matches;
  const parallax = enableParallax ? Math.min(scrollY * 0.18, 160) : 0;
  const stats = [c.stat1, c.stat2, c.stat3, c.stat4];
  const lang = content.htmlLang.startsWith('es') ? 'es' : 'en';

  return (
    <section id="top" className="tf-hero" data-variant="type" data-screen-label="01 Hero">
      {bgUrl && (
        <div
          className="tf-hero-bg"
          aria-hidden="true"
          style={{ transform: `translate3d(0, ${parallax}px, 0)` }}
        >
          <img src={bgUrl} alt="" fetchPriority="high" />
        </div>
      )}
      <div className="tf-hero-ruler" aria-hidden="true">
        <span className="tf-hero-ruler-tick is-major"><span>00</span><i /></span>
        <span className="tf-hero-ruler-tick"><span>10</span><i /></span>
        <span className="tf-hero-ruler-tick"><span>20</span><i /></span>
        <span className="tf-hero-ruler-tick is-major"><span>30</span><i /></span>
        <span className="tf-hero-ruler-tick"><span>40</span><i /></span>
        <span className="tf-hero-ruler-tick"><span>50</span><i /></span>
        <span className="tf-hero-ruler-tick is-major"><span>60</span><i /></span>
        <span className="tf-hero-ruler-tick"><span>70</span><i /></span>
        <span className="tf-hero-ruler-tick"><span>80</span><i /></span>
        <span className="tf-hero-ruler-tick is-major"><span>90</span><i /></span>
      </div>
      <HUD lang={lang} />
      <div className="tf-hero-meta">
        <span className="tf-mono">
          [ 01 — {content.chips.established} · {content.chips.argentina} ]
        </span>
        <span className="tf-mono tf-hero-status">
          <i className="tf-dot" /> {content.workshopActive}
        </span>
      </div>

      <div className="tf-hero-type">
        <h1 className="tf-display">
          <span>{c.titleA}</span>
          <span className="tf-display-mid">{c.titleB}</span>
          <span className="tf-display-accent">{c.titleC}</span>
        </h1>
        <div className="tf-hero-bot">
          <p className="tf-hero-sub">{c.sub}</p>
          <div className="tf-hero-side">
            <HeroCTAs ctaPrimary={c.ctaPrimary} ctaSecondary={c.ctaSecondary} />
          </div>
        </div>
        <dl className="tf-hero-stats">
          {stats.map((s, i) => (
            <Stat key={i} idx={i} v={s.v} l={s.l} />
          ))}
        </dl>
      </div>
      <div className="tf-hero-scroll" aria-hidden="true">
        <span>SCROLL</span>
        <span className="tf-hero-scroll-line" />
      </div>
    </section>
  );
}
