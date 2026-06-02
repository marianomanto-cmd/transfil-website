import { useEffect, useState } from 'react';
import { useScrollY, useCountUp } from '../lib/hooks';
import type { Content } from '../i18n/content';

type Props = {
  content: Content;
  bgUrl?: string;
};

function Stat({ idx, v, l }: { idx: number; v: string; l: string }) {
  const [ref, display] = useCountUp(v, { duration: 1300 + idx * 120 });
  return (
    <div className="tf-stat" ref={ref as React.RefObject<HTMLDivElement>}>
      <dt className="tf-mono">{`0${idx + 1}`}</dt>
      <dd>
        <span className="tf-stat-v">{display}</span>
        <span className="tf-stat-l">{l}</span>
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
      <a href="#tech" className="tf-btn tf-btn-primary" onClick={(e) => scrollTo(e, '#tech')}>
        <span>{ctaPrimary}</span>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </a>
      <a href="#contact" className="tf-btn tf-btn-ghost" onClick={(e) => scrollTo(e, '#contact')}>
        {ctaSecondary}
      </a>
    </div>
  );
}

export function Hero({ content, bgUrl = '/img/hf-welder.png' }: Props) {
  const c = content.hero;
  const scrollY = useScrollY();
  // Detect parallax-eligible environment on mount so SSR + first hydration
  // render are identical. Gates on viewport width, pointer type AND
  // prefers-reduced-motion — users who opted out of motion never get parallax.
  const [enableParallax, setEnableParallax] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const big = window.matchMedia('(min-width: 900px) and (pointer: fine)');
    const update = () => setEnableParallax(big.matches && !reduce.matches);
    update();
    reduce.addEventListener?.('change', update);
    big.addEventListener?.('change', update);
    return () => {
      reduce.removeEventListener?.('change', update);
      big.removeEventListener?.('change', update);
    };
  }, []);
  const parallax = enableParallax ? Math.min(scrollY * 0.18, 160) : 0;
  const stats = [c.stat1, c.stat2, c.stat3, c.stat4];

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
    </section>
  );
}
