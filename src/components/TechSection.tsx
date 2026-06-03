import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useReveal } from '../lib/hooks';
import type { Content } from '../i18n/content';

const TILE_POS = ['hero', 'a', 'b', 'c'] as const;
const VIDEO_EXT_RE = /\.(mp4|webm|mov)(\?|$)/i;

function TileMedia({ src, poster, kind, label }: { src: string; poster?: string; kind: 'photo' | 'video'; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = kind === 'video' && VIDEO_EXT_RE.test(src);

  // Only play the video while it's a fair chunk in the viewport — avoids
  // four simultaneous autoplay-loop streams downloading and decoding when
  // the user scrolls past the tech section quickly. Threshold 0.5 + a
  // rootMargin that contracts the viewport top/bottom keeps videos
  // paused unless the user actually stops on a tile.
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;
    const el = videoRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.5, rootMargin: '-10% 0px -10% 0px' }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.pause();
    };
  }, [isVideo]);

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
      />
    );
  }
  return <img src={src} alt={label} loading="lazy" decoding="async" />;
}

export function TechSection({ content }: { content: Content }) {
  const c = content.capabilities;
  const items = content.tech;
  const [sectionRef, vis] = useReveal(0.1);
  // Mobile accordion state: at most one tech expanded at a time + a remembered
  // bullet selection per tech (-1 = no selection, show the tech's default cover).
  const [expandedTech, setExpandedTech] = useState<number | null>(null);
  const [selectedBullets, setSelectedBullets] = useState<number[]>(items.map(() => -1));

  const toggleTech = (ti: number) => {
    setExpandedTech((prev) => (prev === ti ? null : ti));
  };

  const pickBullet = (ti: number, bi: number) => {
    setSelectedBullets((prev) => {
      const next = [...prev];
      next[ti] = bi;
      return next;
    });
    setExpandedTech(null);
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

      <div className="tf-tech-bento">
        {items.map((t, ti) => {
          const selectedIdx = selectedBullets[ti];
          const headerBullet = selectedIdx >= 0 ? t.bullets[selectedIdx] : null;
          const headerImg = headerBullet?.img || t.img;
          const headerPoster = headerBullet?.poster;
          const headerKind: 'photo' | 'video' = headerBullet?.kind ?? 'photo';
          const headerName = headerBullet?.name || t.title;
          const headerCode = headerBullet
            ? `${t.code} · ${String(selectedIdx + 1).padStart(2, '0')}`
            : t.code;
          const isExpanded = expandedTech === ti;

          return (
            <section
              id={`tech-${t.id}`}
              className="tf-tech-bento-group"
              key={t.id}
              aria-labelledby={`tech-bento-${t.id}`}
              style={{ scrollMarginTop: 'calc(var(--header-h) + 24px)' }}
            >
              <header className="tf-tech-bento-head">
                <span className="tf-mono tf-tech-bento-code">{t.code}</span>
                <h3 className="tf-tech-bento-title" id={`tech-bento-${t.id}`}>
                  {t.title}
                </h3>
                <span className="tf-tech-bento-rule" aria-hidden="true" />
              </header>

              {/* Desktop + tablet: 4-tile asymmetric bento */}
              <div className="tf-tech-bento-row">
                {t.bullets.map((b, bi) => {
                  const pos = TILE_POS[bi] ?? 'a';
                  return (
                    <article
                      className="tf-tech-tile"
                      data-pos={pos}
                      data-kind={b.kind}
                      key={b.name}
                    >
                      <div className="tf-tech-tile-media" aria-hidden="true">
                        <TileMedia src={b.img} poster={b.poster} kind={b.kind} label={b.name} />
                      </div>
                      <div className="tf-tech-tile-overlay" aria-hidden="true" />
                      <div className="tf-tech-tile-body">
                        <span className="tf-mono tf-tech-tile-code">
                          {t.code} · {String(bi + 1).padStart(2, '0')}
                        </span>
                        <h4 className="tf-tech-tile-name">{b.name}</h4>
                        <p className="tf-tech-tile-desc">{b.desc}</p>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Mobile only: collapsible accordion */}
              <div className={cx('tf-tech-acc', isExpanded && 'is-open', headerBullet && 'has-selection')}>
                <button
                  type="button"
                  className="tf-tech-acc-head"
                  aria-expanded={isExpanded}
                  aria-controls={`tech-acc-body-${t.id}`}
                  onClick={() => toggleTech(ti)}
                >
                  <div className="tf-tech-acc-head-media" aria-hidden="true">
                    <TileMedia src={headerImg} poster={headerPoster} kind={headerKind} label={headerName} />
                  </div>
                  <div className="tf-tech-acc-head-body">
                    <span className="tf-mono tf-tech-acc-head-code">{headerCode}</span>
                    <span className="tf-tech-acc-head-name">{headerName}</span>
                    {headerBullet && (
                      <p className="tf-tech-acc-head-desc">{headerBullet.desc}</p>
                    )}
                  </div>
                  <span className="tf-tech-acc-chev" aria-hidden="true">
                    <svg viewBox="0 0 16 16" width="14" height="14">
                      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                <div
                  className="tf-tech-acc-body"
                  id={`tech-acc-body-${t.id}`}
                  data-open={isExpanded}
                >
                  <div className="tf-tech-acc-body-inner">
                    {t.bullets.map((b, bi) => {
                      const isSel = selectedIdx === bi;
                      return (
                        <button
                          type="button"
                          key={b.name}
                          className={cx('tf-tech-acc-bullet', isSel && 'is-on')}
                          aria-current={isSel ? 'true' : undefined}
                          onClick={() => pickBullet(ti, bi)}
                        >
                          <div className="tf-tech-acc-bullet-media" aria-hidden="true">
                            <TileMedia src={b.img} poster={b.poster} kind={b.kind} label={b.name} />
                          </div>
                          <div className="tf-tech-acc-bullet-body">
                            <span className="tf-mono">
                              {t.code} · {String(bi + 1).padStart(2, '0')}
                            </span>
                            <span className="tf-tech-acc-bullet-name">{b.name}</span>
                            <p className="tf-tech-acc-bullet-desc">{b.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
