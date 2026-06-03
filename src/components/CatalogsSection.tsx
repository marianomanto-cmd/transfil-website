import { useEffect, useState } from 'react';
import { cx } from '../lib/cx';
import { useReveal } from '../lib/hooks';
import type { CatalogItem, Content } from '../i18n/content';

const LOGO_PATH =
  'M1341 2247 l-18 -43 -8 -33 -7 -32 -14 -27 -14 -27 0 -17 0 -17 -14 -33 -14 -33 -57 -180 -57 -180 -8 -20 -9 -20 -6 -25 -6 -25 -13 -35 -13 -35 -38 -120 -37 -120 -14 -33 -14 -33 0 -15 0 -16 -14 -31 -14 -32 -28 -88 -27 -89 -24 -9 -24 -9 -340 0 -339 0 2 -247 3 -248 565 0 565 0 17 37 18 37 9 38 10 38 15 50 15 50 10 30 10 30 22 75 21 75 13 35 12 35 16 55 16 55 22 75 21 75 13 35 13 35 22 75 22 75 13 35 12 35 7 38 7 38 15 6 15 6 10 -10 9 -9 9 -44 9 -45 12 -50 13 -50 17 -65 17 -65 13 -50 12 -50 8 -35 8 -35 22 -88 23 -89 24 -9 24 -9 252 0 252 0 14 9 14 9 -17 59 -17 58 -10 30 -10 30 -14 45 -13 45 -16 55 -17 55 -13 50 -14 50 -9 25 -10 25 -16 55 -16 55 -22 75 -21 75 -13 35 -13 35 -21 75 -22 75 -16 55 -15 55 -14 33 -14 33 0 12 0 12 -21 70 -22 70 -15 43 -15 42 -329 0 -329 0 -18 -43z';

export function CatalogsSection({ content }: { content: Content }) {
  const c = content.catalogs;
  const [active, setActive] = useState<CatalogItem | null>(null);
  const [sectionRef, vis] = useReveal(0.1);
  const lang: 'es' | 'en' = content.htmlLang.startsWith('es') ? 'es' : 'en';
  const downloadLabel = lang === 'es' ? 'Descargar' : 'Download';
  const closeLabel = lang === 'es' ? 'Cerrar' : 'Close';

  return (
    <section
      id="catalogs"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={cx('tf-section', vis && 'is-visible')}
      data-screen-label="04 Catalogs"
    >
      <header className="tf-section-head" data-num="04">
        <div className="tf-eyebrow">{c.eyebrow}</div>
        <h2 className="tf-h2">{c.title}</h2>
        <p className="tf-section-sub">{c.sub}</p>
      </header>
      <div className="tf-catalogs">
        {c.items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            className="tf-catalog-card"
            style={{ ['--cat-c' as never]: it.color }}
            onClick={() => setActive(it)}
            aria-label={`${c.cta} — ${it.title}`}
          >
            <span className="tf-catalog-spine" aria-hidden="true">
              TRANS·FIL · {it.title.toUpperCase()}
            </span>
            <div className="tf-catalog-cover" aria-hidden="true">
              <img className="tf-catalog-cover-img" src={it.img} alt={`${it.title} — Trans-Fil`} width="800" height="1131" loading="lazy" decoding="async" />
              <div className="tf-catalog-cover-grid" />
              <div className="tf-catalog-cover-tag">
                <span className="tf-mono">{`C0${i + 1}`}</span>
                <span className="tf-mono">{it.pages}p · {it.size}</span>
              </div>
              <div className="tf-catalog-cover-brand">
                <span className="tf-catalog-cover-mark">
                  <svg viewBox="0 0 228 192" width="42" height="36" preserveAspectRatio="xMidYMid meet">
                    <g transform="translate(-17 229) scale(0.1 -0.1)" fill="currentColor">
                      <path d={LOGO_PATH} />
                    </g>
                  </svg>
                </span>
                <span className="tf-catalog-cover-title">{it.title}</span>
                <span className="tf-catalog-cover-sub">TRANS·FIL / 2026</span>
              </div>
              <div className="tf-catalog-cover-stripe" />
            </div>
            <div className="tf-catalog-body">
              <div className="tf-catalog-meta">
                <span className="tf-mono tf-catalog-num">{`/0${i + 1}`}</span>
                <h3 className="tf-catalog-title">{it.title}</h3>
              </div>
              <p className="tf-catalog-desc">{it.desc}</p>
              <span className="tf-catalog-cta">
                <span>{c.cta}</span>
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="square"
                  />
                </svg>
              </span>
            </div>
          </button>
        ))}
      </div>

      {active && (
        <CatalogViewer
          catalog={active}
          downloadLabel={downloadLabel}
          closeLabel={closeLabel}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  );
}

function CatalogViewer({
  catalog,
  downloadLabel,
  closeLabel,
  onClose,
}: {
  catalog: CatalogItem;
  downloadLabel: string;
  closeLabel: string;
  onClose: () => void;
}) {
  // Lock body scroll + Esc-to-close while the viewer is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="tf-catalog-viewer is-open"
      role="dialog"
      aria-modal="true"
      aria-label={catalog.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="tf-catalog-viewer-panel" style={{ ['--cat-c' as never]: catalog.color }}>
        <header className="tf-catalog-viewer-head">
          <div className="tf-catalog-viewer-id">
            <span className="tf-mono">{catalog.id.toUpperCase()}</span>
            <span className="tf-catalog-viewer-title">{catalog.title}</span>
          </div>
          <div className="tf-catalog-viewer-actions">
            <span className="tf-mono tf-catalog-viewer-meta">
              {catalog.pages}p · {catalog.size}
            </span>
            <a
              className="tf-catalog-viewer-btn"
              href={catalog.file}
              download
              aria-label={downloadLabel}
              title={downloadLabel}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path
                  d="M8 2 V12 M4 8 L8 12 L12 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 14 H13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <span className="tf-catalog-viewer-btn-text">{downloadLabel}</span>
            </a>
            <button
              type="button"
              className="tf-catalog-viewer-close"
              onClick={onClose}
              aria-label={closeLabel}
              title={closeLabel}
            >
              <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">
                <path
                  d="M3 3 L13 13 M13 3 L3 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </header>
        <iframe
          className="tf-catalog-viewer-frame"
          src={`${catalog.file}#toolbar=1&view=FitH&pagemode=none`}
          title={catalog.title}
        />
      </div>
    </div>
  );
}
