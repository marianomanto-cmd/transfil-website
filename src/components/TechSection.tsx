import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useReveal } from '../lib/hooks';
import { Media } from './Media';
import type { Content, TechBullet } from '../i18n/content';

export function TechSection({ content }: { content: Content }) {
  const c = content.capabilities;
  const items = content.tech;
  const [active, setActive] = useState(items[0].id);
  const [hoverBullet, setHoverBullet] = useState<TechBullet | null>(null);
  const bulletsRef = useRef<HTMLUListElement | null>(null);
  const [cardTop, setCardTop] = useState(0);
  const [sectionRef, vis] = useReveal(0.1);

  useEffect(() => {
    if (!hoverBullet || !bulletsRef.current) return;
    const techEl = bulletsRef.current.closest('.tf-tech') as HTMLElement | null;
    if (!techEl) return;
    const techRect = techEl.getBoundingClientRect();
    const listRect = bulletsRef.current.getBoundingClientRect();
    setCardTop(listRect.top - techRect.top);
  }, [hoverBullet]);

  useEffect(() => {
    if (!hoverBullet) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.tf-tech-bullet') && !target.closest('.tf-bullet-card')) {
        setHoverBullet(null);
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [hoverBullet]);

  const activeItem = items.find((i) => i.id === active) || items[0];

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
        <div className="tf-tech-detail" key={activeItem.id}>
          <div className="tf-tech-detail-media">
            <Media kind="photo" src={activeItem.img} label={activeItem.title} ratio="4/3" />
          </div>
          <div className="tf-tech-detail-body">
            <div className="tf-mono tf-tech-detail-code">
              {activeItem.code} / {activeItem.sub}
            </div>
            <h3 className="tf-h3">{activeItem.title}</h3>
            <p className="tf-tech-desc">{activeItem.desc}</p>
            <ul
              className="tf-tech-bullets"
              ref={bulletsRef}
              onMouseLeave={() => setHoverBullet(null)}
            >
              {activeItem.bullets.map((b, i) => {
                const on = !!hoverBullet && hoverBullet.name === b.name;
                return (
                  <li
                    key={i}
                    className={cx('tf-tech-bullet', on && 'is-on')}
                    role="button"
                    tabIndex={0}
                    onMouseEnter={() => setHoverBullet(b)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoverBullet(on ? null : b);
                    }}
                  >
                    <span className="tf-mono">→</span> {b.name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <BulletCard bullet={hoverBullet} top={cardTop} />
      </div>
    </section>
  );
}

function BulletCard({ bullet, top }: { bullet: TechBullet | null; top: number }) {
  const [last, setLast] = useState<TechBullet | null>(null);
  useEffect(() => {
    if (bullet) setLast(bullet);
  }, [bullet]);
  const b = bullet || last;
  return (
    <aside
      className={cx('tf-bullet-card', bullet && 'is-visible')}
      style={{ top: `${top}px` }}
      aria-hidden={!bullet}
    >
      {b && (
        <>
          <div className="tf-bullet-card-media">
            <Media kind={b.kind} src={b.img} label={b.name} ratio="4/3" />
          </div>
          <div className="tf-bullet-card-body">
            <div className="tf-mono tf-bullet-card-eyebrow">→ {b.name}</div>
            <p>{b.desc}</p>
          </div>
        </>
      )}
    </aside>
  );
}
