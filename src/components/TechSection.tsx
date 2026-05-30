import { useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    if (!activeBullet) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest('.tf-tech-bullet') &&
        !target.closest('.tf-bullet-card') &&
        !target.closest('.tf-bullet-backdrop')
      ) {
        setActiveBullet(null);
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [activeBullet]);

  const activeItem = items.find((i) => i.id === active) || items[0];
  const close = () => setActiveBullet(null);

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
            <ul className="tf-tech-bullets">
              {activeItem.bullets.map((b, i) => {
                const on = !!activeBullet && activeBullet.name === b.name;
                return (
                  <li
                    key={i}
                    className={cx('tf-tech-bullet', on && 'is-on')}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveBullet(on ? null : b);
                    }}
                  >
                    <span className="tf-mono">→</span> {b.name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <BulletSheet bullet={activeBullet} onClose={close} />
      </div>
    </section>
  );
}

function BulletSheet({
  bullet,
  onClose,
}: {
  bullet: TechBullet | null;
  onClose: () => void;
}) {
  const [last, setLast] = useState<TechBullet | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const dragStart = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if (bullet) setLast(bullet);
  }, [bullet]);

  // Esc to close (all viewports) + body scroll lock while the sheet is open.
  useEffect(() => {
    if (!bullet) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [bullet, onClose]);

  // Swipe-down on the drag handle to dismiss (mobile only, but harmless
  // on desktop since the drag handle is display:none there).
  const onTouchStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientY;
    isDragging.current = true;
    if (sheetRef.current) sheetRef.current.style.transition = 'none';
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !sheetRef.current) return;
    const delta = e.touches[0].clientY - dragStart.current;
    if (delta > 0) sheetRef.current.style.transform = `translateY(${delta}px)`;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current || !sheetRef.current) return;
    isDragging.current = false;
    const delta = e.changedTouches[0].clientY - dragStart.current;
    sheetRef.current.style.transition = '';
    sheetRef.current.style.transform = '';
    if (delta > 100) onClose();
  };

  const b = bullet || last;
  return (
    <>
      <div
        className={cx('tf-bullet-backdrop', bullet && 'is-visible')}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={sheetRef}
        className={cx('tf-bullet-card', bullet && 'is-visible')}
        role="dialog"
        aria-modal="true"
        aria-hidden={!bullet}
      >
        <div
          className="tf-bullet-drag-handle"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          aria-hidden="true"
        />
        <button
          type="button"
          className="tf-bullet-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
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
    </>
  );
}
