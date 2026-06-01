import { useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useReveal } from '../lib/hooks';
import { Media } from './Media';
import type { Content } from '../i18n/content';

export function TechSection({ content }: { content: Content }) {
  const c = content.capabilities;
  const items = content.tech;
  const [active, setActive] = useState<{ techIdx: number; bulletIdx: number }>({ techIdx: 0, bulletIdx: 0 });
  const [sectionRef, vis] = useReveal(0.1);
  const detailRef = useRef<HTMLDivElement>(null);

  const activeTech = items[active.techIdx];
  const activeBullet = activeTech.bullets[active.bulletIdx];
  const mediaKey = `${activeTech.id}-${active.bulletIdx}`;

  const onPick = (techIdx: number, bulletIdx: number) => {
    setActive({ techIdx, bulletIdx });
    // On phones the rail sits below the detail; smooth-scroll up so the
    // user sees the new selection rather than the same rail they just tapped.
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 880px)').matches) {
      requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

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

      <div className="tf-tech-md">
        <nav className="tf-tech-rail" aria-label={c.title}>
          {items.map((t, ti) => {
            const groupActive = ti === active.techIdx;
            return (
              <div className={cx('tf-tech-rail-group', groupActive && 'is-active')} key={t.id}>
                <div className="tf-tech-rail-head">
                  <span className="tf-mono tf-tech-rail-code">{t.code}</span>
                  <span className="tf-tech-rail-title">{t.title}</span>
                </div>
                <ul className="tf-tech-rail-bullets" role="list">
                  {t.bullets.map((b, bi) => {
                    const on = groupActive && bi === active.bulletIdx;
                    return (
                      <li key={b.name}>
                        <button
                          type="button"
                          className={cx('tf-tech-rail-bullet', on && 'is-on')}
                          aria-current={on ? 'true' : undefined}
                          onClick={() => onPick(ti, bi)}
                        >
                          <span className="tf-mono" aria-hidden="true">→</span>
                          <span>{b.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="tf-tech-detail" ref={detailRef}>
          <div className="tf-mono tf-tech-detail-meta">
            {activeTech.code} / {activeTech.sub}
          </div>
          <div className="tf-tech-detail-media" key={mediaKey}>
            <Media
              kind={activeBullet.kind}
              src={activeBullet.img}
              poster={activeBullet.poster}
              label={activeBullet.name}
              ratio="4/3"
            />
          </div>
          <h3 className="tf-h3 tf-tech-detail-name">{activeBullet.name}</h3>
          <p className="tf-tech-detail-desc">{activeBullet.desc}</p>
        </div>
      </div>
    </section>
  );
}
