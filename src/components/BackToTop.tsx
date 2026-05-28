import { useEffect, useState } from 'react';
import { cx } from '../lib/cx';

type Props = { label: string };

export function BackToTop({ label }: Props) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      type="button"
      className={cx('tf-backtop', show && 'is-visible')}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          d="M8 13 V3 M4 7 L8 3 L12 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    </button>
  );
}
