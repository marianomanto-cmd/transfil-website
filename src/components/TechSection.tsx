import { cx } from '../lib/cx';
import { useReveal } from '../lib/hooks';
import type { Content } from '../i18n/content';

const TILE_POS = ['hero', 'a', 'b', 'c'] as const;

export function TechSection({ content }: { content: Content }) {
  const c = content.capabilities;
  const items = content.tech;
  const [sectionRef, vis] = useReveal(0.1);

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
        {items.map((t) => (
          <section
            className="tf-tech-bento-group"
            key={t.id}
            aria-labelledby={`tech-bento-${t.id}`}
          >
            <header className="tf-tech-bento-head">
              <span className="tf-mono tf-tech-bento-code">{t.code}</span>
              <h3 className="tf-tech-bento-title" id={`tech-bento-${t.id}`}>
                {t.title}
              </h3>
              <span className="tf-tech-bento-rule" aria-hidden="true" />
            </header>
            <div className="tf-tech-bento-row">
              {t.bullets.map((b, bi) => {
                const pos = TILE_POS[bi] ?? 'a';
                const showDesc = pos === 'hero' || pos === 'c';
                const isVideo = b.kind === 'video' && /\.(mp4|webm|mov)(\?|$)/i.test(b.img);
                return (
                  <article
                    className="tf-tech-tile"
                    data-pos={pos}
                    data-kind={b.kind}
                    key={b.name}
                  >
                    <div className="tf-tech-tile-media" aria-hidden="true">
                      {isVideo ? (
                        <video
                          src={b.img}
                          poster={b.poster}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <img src={b.img} alt="" loading="lazy" decoding="async" />
                      )}
                    </div>
                    <div className="tf-tech-tile-overlay" aria-hidden="true" />
                    <div className="tf-tech-tile-body">
                      <span className="tf-mono tf-tech-tile-code">
                        {t.code} · {String(bi + 1).padStart(2, '0')}
                      </span>
                      <h4 className="tf-tech-tile-name">{b.name}</h4>
                      {showDesc && (
                        <p className="tf-tech-tile-desc">{b.desc}</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
