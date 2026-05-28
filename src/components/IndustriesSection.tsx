import { useState } from 'react';
import { cx } from '../lib/cx';
import { useReveal } from '../lib/hooks';
import { TF_CLIENTS, type Content } from '../i18n/content';

function Marquee({ items, speed = 60 }: { items: readonly string[]; speed?: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="tf-marquee">
      <div className="tf-marquee-track" style={{ animationDuration: `${speed}s` }}>
        {doubled.map((name, i) => (
          <div key={i} className="tf-marquee-item">
            <span className="tf-logo-placeholder">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function IndustriesSection({ content }: { content: Content }) {
  const c = content.industries;
  const [tab, setTab] = useState<'steel' | 'auto' | 'tools'>(c.tabs[0].id);
  const items = TF_CLIENTS[tab];
  const [sectionRef, vis] = useReveal(0.1);

  return (
    <section
      id="industries"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={cx('tf-section', vis && 'is-visible')}
      data-screen-label="05 Industries"
    >
      <header className="tf-section-head">
        <div className="tf-eyebrow">{c.eyebrow}</div>
        <h2 className="tf-h2">
          <span>{c.title}</span> <span className="tf-h2-accent">{c.title2}</span>
        </h2>
        <p className="tf-section-sub">{c.sub}</p>
      </header>
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
        <span className="tf-mono" style={{ color: 'var(--fg-4)' }}>
          ← HOVER TO PAUSE →
        </span>
      </div>
      <Marquee items={items} speed={60} />
    </section>
  );
}
