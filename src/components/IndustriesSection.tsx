import { useState } from 'react';
import { cx } from '../lib/cx';
import { useReveal } from '../lib/hooks';
import { TF_CLIENTS, type Content, type Lang } from '../i18n/content';
import { CoverageRadar } from './CoverageRadar';

function Marquee({ items, speed = 60, paused }: { items: readonly string[]; speed?: number; paused: boolean }) {
  // The track runs the list twice so the loop is seamless; the second copy
  // is only visual, so screen readers get each name once. Under reduced
  // motion CSS stops the track and wraps the first copy into a static grid.
  return (
    <div className="tf-marquee" data-paused={paused}>
      <div className="tf-marquee-track" style={{ animationDuration: `${speed}s` }}>
        {items.map((name, i) => (
          <div key={i} className="tf-marquee-item">
            <span className="tf-logo-placeholder">{name}</span>
          </div>
        ))}
        {items.map((name, i) => (
          <div key={`dup-${i}`} className="tf-marquee-item is-dup" aria-hidden="true">
            <span className="tf-logo-placeholder">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = {
  // Narrow props, like Header and ContactSection: an island serialises
  // everything it receives into the page's HTML, and the whole `Content`
  // dictionary is ~32 KB per island.
  industries: Content['industries'];
  lang: Lang;
  ui: Pick<Content['ui'], 'coverage' | 'countriesReached'>;
};

export function IndustriesSection({ industries: c, lang, ui }: Props) {
  const [tab, setTab] = useState<'steel' | 'auto' | 'tools'>(c.tabs[0].id);
  const items = TF_CLIENTS[tab];
  const [sectionRef, vis] = useReveal(0.1);
  const [paused, setPaused] = useState(false);

  return (
    <section
      id="industries"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={cx('tf-section', vis && 'is-visible')}
      data-screen-label="06 Industries"
    >
      <span className="tf-industries-watermark" aria-hidden="true">{c.coverage.length}</span>
      <div className="tf-industries-top">
        <header className="tf-section-head" data-num="06">
          <div className="tf-eyebrow">{c.eyebrow}</div>
          <h2 className="tf-h2">
            <span>{c.title}</span> <span className="tf-h2-accent">{c.title2}</span>
          </h2>
          <p className="tf-section-sub">{c.sub}</p>
          <ul className="tf-coverage-list" aria-hidden="true">
            {c.coverage.map((name) => (
              <li key={name} className="tf-coverage-list-item">
                <span className="tf-mono">→</span> {name}
              </li>
            ))}
          </ul>
        </header>
        <CoverageRadar
          lang={lang}
          coverageLabel={ui.coverage}
          countriesLabel={ui.countriesReached}
        />
      </div>
      <div className="tf-tabs" role="tablist">
        {c.tabs.map((t) => {
          const on = t.id === tab;
          const count = TF_CLIENTS[t.id].length;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={on}
              data-on={on}
              className="tf-tab"
              onClick={() => setTab(t.id)}
            >
              <span>{t.label}</span>
              <span className="tf-tab-count tf-mono">{String(count).padStart(2, '0')}</span>
            </button>
          );
        })}
      </div>
      <div className="tf-industries-meta">
        <span className="tf-industries-count">
          <b>{String(items.length).padStart(2, '0')}</b> · {c.tabs.find((t) => t.id === tab)?.label}
        </span>
        <button
          type="button"
          className="tf-mono tf-marquee-toggle"
          onClick={() => setPaused((p) => !p)}
        >
          <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
            {paused ? <path d="M2 1 L9 5 L2 9 Z" fill="currentColor" /> : <path d="M2 1 H4 V9 H2 Z M6 1 H8 V9 H6 Z" fill="currentColor" />}
          </svg>
          {paused ? c.play : c.pause}
        </button>
      </div>
      <Marquee items={items} speed={60} paused={paused} />
    </section>
  );
}
