import { useEffect, useMemo, useRef, useState } from 'react';

export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
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
    return () => io.disconnect();
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
  const [val, setVal] = useState(0);
  const parsed = useMemo(() => {
    const m = String(target).match(/^(\d+)(.*)$/);
    if (!m) return { num: null as number | null, suffix: target };
    return { num: parseInt(m[1], 10), suffix: m[2] };
  }, [target]);
  useEffect(() => {
    if (!visible || parsed.num == null) return;
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
