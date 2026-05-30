import { useEffect, useState } from 'react';
import { cx } from '../lib/cx';
import { useReveal } from '../lib/hooks';
import { Media } from './Media';
import type { Content, TechBullet } from '../i18n/content';

export function TechSection({ content }: { content: Content }) {
  const c = content.capabilities;
  const items = content.tech;
  const [active, setActive] = useState(items[0].id);
  const [activeBullet, setActiveBullet] = useState<TechBullet | null>(null);
  const [sectionRef, vis] = useReveal(0.1);

  // Reset the selected bullet whenever the user switches the tech line.
  useEffect(() => {
    setActiveBullet(null);
  }, [active]);

  const activeItem = items.find((i) => i.id === active) || items[0];
  const displayImg = activeBullet?.img || activeItem.img;
  const displayLabel = activeBullet?.name || activeItem.title;
  const mediaKey = `${active}-${activeBullet?.name ?? 'overview'}`;

  return (
    <section
      id="tech"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={cx('tf-section', vis && 'is-visible')}
      data-screen-label="02 Technologies"
    >
      <header className="tf-section-head" data-num="02">
        <div className="tf-eyebrow">{c.eyebrow}</div>
        <h2 className="tf-h2">{c.title}</h2>
        <p className="tf-section-sub">{c.sub}</p>
      </header>

      <div className="tf-tech">
        <div className="tf-tech-list" role="tablist">
          {items.map((it) => {
            const on = it.id === active;
            return (
              <button
                key={it.id}
                role="tab"
                aria-selected={on}
                data-on={on}
                className="tf-tech-row"
                onClick={() => setActive(it.id)}
                onMouseEnter={() => setActive(it.id)}
              >
                <span className="tf-mono tf-tech-code">{it.code}</span>
                <span className="tf-tech-title">{it.title}</span>
                <span className="tf-tech-sub tf-mono">{it.sub}</span>
                <span className="tf-tech-arrow" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="14" height="14">
                    <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
        <div className="tf-tech-detail">
          <div className="tf-tech-detail-media" key={mediaKey}>
            <Media kind="photo" src={displayImg} label={displayLabel} ratio="4/3" />
          </div>
          <div className="tf-tech-detail-body">
            <div className="tf-mono tf-tech-detail-code">
              {activeItem.code} / {activeItem.sub}
            </div>
            <h3 className="tf-h3">{activeItem.title}</h3>
            <p className="tf-tech-desc">{activeItem.desc}</p>
            <ul className="tf-tech-bullets" role="tablist" aria-label={activeItem.title}>
              {activeItem.bullets.map((b) => {
                const on = !!activeBullet && activeBullet.name === b.name;
                return (
                  <li key={b.name}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={on}
                      className={cx('tf-tech-bullet', on && 'is-on')}
                      onClick={() => setActiveBullet(on ? null : b)}
                    >
                      <span className="tf-mono">→</span>
                      <span>{b.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <div
              className={cx('tf-bullet-detail', activeBullet && 'is-open')}
              aria-hidden={!activeBullet}
            >
              <div className="tf-bullet-detail-inner">
                {activeBullet && (
                  <>
                    <div className="tf-mono tf-bullet-detail-eyebrow">
                      → {activeBullet.name}
                    </div>
                    <p className="tf-bullet-detail-caption">{activeBullet.desc}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
