import { useEffect, useMemo, useRef, useState } from 'react';

export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    // If the element is already past the viewport (e.g., user landed
    // on a deep-link anchor below it), IntersectionObserver won't fire
    // since isIntersecting is false. Reveal immediately in that case.
    const r = ref.current.getBoundingClientRect();
    if (r.bottom <= 0) { setVis(true); return; }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(ref.current);
    // Safety net: if the IO hasn't fired after 2s (slow JS, weird browser,
    // missed callback) just reveal so content isn't stuck at opacity 0.
    const fallback = window.setTimeout(() => setVis(true), 2000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [threshold]);
  return [ref, vis] as const;
}

export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setY(window.scrollY);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return y;
}

export function useCountUp(target: string, opts: { duration?: number } = {}) {
  const { duration = 1400 } = opts;
  const [ref, visible] = useReveal(0.4);
  const parsed = useMemo(() => {
    // Targets like "24/7" are literals (hours/days), not numbers to animate.
    if (/^\d+\s*\/\s*\d+$/.test(target)) {
      return { num: null as number | null, suffix: target };
    }
    const m = String(target).match(/^(\d+)(.*)$/);
    if (!m) return { num: null as number | null, suffix: target };
    return { num: parseInt(m[1], 10), suffix: m[2] };
  }, [target]);
  // SSR-safe initial state: render the final number so the page is correct
  // even when JS doesn't run (and so server-rendered HTML never says "0 Años").
  const [val, setVal] = useState(parsed.num ?? 0);
  useEffect(() => {
    if (!visible || parsed.num == null) return;
    if (typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setVal(parsed.num);
      return;
    }
    // Rewind to 0 and animate up to the target value.
    setVal(0);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(parsed.num! * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, parsed.num, duration]);
  const display = parsed.num == null ? parsed.suffix : `${val}${parsed.suffix}`;
  return [ref, display] as const;
}
