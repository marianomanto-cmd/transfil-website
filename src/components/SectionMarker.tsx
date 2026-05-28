import { useEffect, useState } from 'react';
import { cx } from '../lib/cx';

const SECTIONS = [
  { id: 'top', n: '01', l: 'Hero' },
  { id: 'tech', n: '02', l: 'Tech' },
  { id: 'catalogs', n: '03', l: 'Catalogs' },
  { id: 'process', n: '04', l: 'Process' },
  { id: 'services', n: '05', l: 'Services' },
  { id: 'industries', n: '06', l: 'Industries' },
  { id: 'history', n: '07', l: 'History' },
  { id: 'contact', n: '08', l: 'Contact' },
];

export function SectionMarker() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodes = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (v[0]) {
          const idx = SECTIONS.findIndex((s) => s.id === v[0].target.id);
          if (idx >= 0) setActive(idx);
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    nodes.forEach((n) => io.observe(n));

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      setProgress(p);
      setVisible(window.scrollY > 240);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const current = SECTIONS[active];
  const total = SECTIONS.length;

  return (
    <div
      className={cx('tf-section-chip', visible && 'is-visible')}
      style={{ ['--progress' as never]: progress }}
      aria-hidden="true"
    >
      <span className="tf-section-chip-num">{current.n}</span>
      <span className="tf-section-chip-bar" />
      <span>{String(total).padStart(2, '0')}</span>
    </div>
  );
}
