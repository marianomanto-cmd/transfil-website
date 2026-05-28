import { cx } from '../lib/cx';
import type { CSSProperties, ReactNode } from 'react';

type Props = {
  kind?: 'photo' | 'video';
  label?: string;
  ratio?: string;
  caption?: ReactNode;
  accent?: boolean;
  src?: string;
  objectPosition?: string;
  loading?: 'eager' | 'lazy';
};

let stripeId = 0;

export function Media({
  kind = 'photo',
  label,
  ratio = '4/3',
  caption,
  accent = false,
  src,
  objectPosition,
  loading = 'lazy',
}: Props) {
  const id = `stripe-${kind}-${++stripeId}`;
  const figureStyle: CSSProperties = { aspectRatio: ratio };
  return (
    <figure
      className={cx('tf-media', accent && 'is-accent', src && 'has-src')}
      style={figureStyle}
    >
      <div className="tf-media-inner" data-kind={kind}>
        {src ? (
          <img
            className="tf-media-img"
            src={src}
            alt={label || ''}
            style={objectPosition ? { objectPosition } : undefined}
            loading={loading}
          />
        ) : (
          <svg
            className="tf-media-stripes"
            aria-hidden="true"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <defs>
              <pattern id={id} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill={`url(#${id})`} />
          </svg>
        )}
        <div className="tf-media-corners" aria-hidden="true">
          <i /><i /><i /><i />
        </div>
        {!src && (
          <div className="tf-media-label">
            <span className="tf-media-kind">{kind === 'video' ? '▶ VIDEO' : '◧ PHOTO'}</span>
            <span className="tf-media-text">{label}</span>
          </div>
        )}
        {src && kind === 'video' && (
          <div className="tf-media-play" aria-hidden="true">
            <svg viewBox="0 0 48 48" width="48" height="48">
              <circle cx="24" cy="24" r="22" fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.9)" strokeWidth="1" />
              <path d="M20 16 L34 24 L20 32 Z" fill="#fff" />
            </svg>
          </div>
        )}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
