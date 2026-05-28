import { useEffect, useState } from 'react';
import { cx } from '../lib/cx';
import { useReveal } from '../lib/hooks';
import type { Content } from '../i18n/content';

export function ProcessSection({ content }: { content: Content }) {
  const c = content.process;
  const steps = c.steps;
  const img = '/img/hf-welder.png';
  const [active, setActive] = useState<string | null>(null);
  const [sectionRef, vis] = useReveal(0.1);

  useEffect(() => {
    if (active == null) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.tf-hotspot') && !target.closest('.tf-hotspots-legend-item')) {
        setActive(null);
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [active]);

  return (
    <section
      id="process"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={cx('tf-section', vis && 'is-visible')}
      data-screen-label="03 Process"
    >
      <header className="tf-section-head">
        <div className="tf-eyebrow">{c.eyebrow}</div>
        <h2 className="tf-h2">{c.title}</h2>
      </header>
      <div className="tf-hotspots">
        <div className="tf-hotspots-frame">
          <img src={img} alt="" className="tf-hotspots-img" loading="lazy" />
          <div className="tf-hotspots-overlay" aria-hidden="true" />
          <svg
            className="tf-hotspots-connectors"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={steps
                .map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.pos.x} ${s.pos.y}`)
                .join(' ')}
            />
          </svg>
          {steps.map((s) => {
            const on = active === s.n;
            return (
              <div
                key={s.n}
                className={cx('tf-hotspot', on && 'is-on')}
                style={{ left: `${s.pos.x}%`, top: `${s.pos.y}%` }}
                onMouseEnter={() => setActive(s.n)}
                onMouseLeave={() => setActive(null)}
              >
                <button
                  className="tf-hotspot-dot"
                  aria-label={`${s.n} ${s.t}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(on ? null : s.n);
                  }}
                >
                  <span className="tf-hotspot-pulse" />
                  <span className="tf-hotspot-num">{s.n}</span>
                </button>
                <div
                  className="tf-hotspot-card"
                  data-side={s.pos.x > 60 ? 'left' : 'right'}
                  data-vside={s.pos.y > 60 ? 'top' : 'bottom'}
                >
                  <div className="tf-mono tf-hotspot-card-eyebrow">/ {s.n}</div>
                  <h4>{s.t}</h4>
                  <p>{s.d}</p>
                </div>
              </div>
            );
          })}
        </div>
        <ol className="tf-hotspots-legend">
          {steps.map((s) => (
            <li
              key={s.n}
              className={cx('tf-hotspots-legend-item', active === s.n && 'is-on')}
              onMouseEnter={() => setActive(s.n)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === s.n ? null : s.n)}
            >
              <span className="tf-mono">{s.n}</span>
              <span>{s.t}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
