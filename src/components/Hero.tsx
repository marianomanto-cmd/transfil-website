import { useEffect, useRef, useState } from 'react';
import { useScrollY, useCountUp } from '../lib/hooks';
import type { Content } from '../i18n/content';

type Props = {
  content: Content;
};

function Stat({ idx, v, l }: { idx: number; v: string; l: string }) {
  const [ref, display] = useCountUp(v, { duration: 1300 + idx * 120 });
  return (
    <div className="tf-stat" ref={ref as React.RefObject<HTMLDivElement>}>
      <dt className="tf-mono">{`0${idx + 1}`}</dt>
      <dd>
        <span className="tf-stat-v">{display}</span>
        <span className="tf-stat-l">{l}</span>
      </dd>
    </div>
  );
}

function HeroCTAs({ ctaPrimary, ctaSecondary }: { ctaPrimary: string; ctaSecondary: string }) {
  const scrollTo = (e: React.MouseEvent, sel: string) => {
    e.preventDefault();
    document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <div className="tf-hero-ctas">
      <a
        href="#tech"
        className="tf-btn tf-btn-primary tf-btn-magnetic"
        onClick={(e) => scrollTo(e, '#tech')}
      >
        <span>{ctaPrimary}</span>
        <svg viewBox="0 0 16 16" width="14" height="14">
          <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </a>
      <a href="#contact" className="tf-btn tf-btn-ghost" onClick={(e) => scrollTo(e, '#contact')}>
        {ctaSecondary}
      </a>
    </div>
  );
}

export function Hero({ content }: Props) {
  const c = content.hero;
  const scrollY = useScrollY();
  // Detect parallax-eligible environment on mount so SSR + first hydration
  // render are identical (was reading window during render → hydration warn).
  const [enableParallax, setEnableParallax] = useState(false);
  // Hero video src is deferred to after idle so the poster image becomes
  // the LCP element and the (multi-MB) video doesn't compete for the
  // critical path. <source media> isn't reliably honored by Safari/FF;
  // pick the right file in JS instead.
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause the hero video while the section is off-screen — the loop keeps
  // burning GPU on long pages otherwise. IO trigger is independent from
  // the idle-callback that decides the src.
  useEffect(() => {
    if (!videoSrc || !videoRef.current) return;
    const el = videoRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.pause();
    };
  }, [videoSrc]);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const big = window.matchMedia('(min-width: 900px) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateParallax = () => setEnableParallax(big.matches && !reduce.matches);
    updateParallax();
    big.addEventListener?.('change', updateParallax);
    reduce.addEventListener?.('change', updateParallax);
    const pick = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      setVideoSrc(isMobile ? '/video/hero-mobile.mp4' : '/video/hero-desktop.mp4');
    };
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
    let ricId: number | undefined;
    let toId: number | undefined;
    if (ric) {
      ricId = ric(pick, { timeout: 1500 });
    } else {
      toId = window.setTimeout(pick, 600);
    }
    return () => {
      big.removeEventListener?.('change', updateParallax);
      reduce.removeEventListener?.('change', updateParallax);
      if (ricId !== undefined) {
        const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
        cic?.(ricId);
      }
      if (toId !== undefined) window.clearTimeout(toId);
    };
  }, []);
  const parallax = enableParallax ? Math.min(scrollY * 0.18, 160) : 0;
  const stats = [c.stat1, c.stat2, c.stat3, c.stat4];

  return (
    <section id="top" className="tf-hero" data-variant="type" data-screen-label="01 Hero">
      <div
        className="tf-hero-bg"
        aria-hidden="true"
        style={{ transform: `translate3d(0, ${parallax}px, 0)` }}
      >
        <video
          ref={videoRef}
          className="tf-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/img/hero-poster.webp"
          aria-hidden="true"
          {...(videoSrc ? { src: videoSrc } : {})}
        />
      </div>
      <div className="tf-hero-meta">
        <span className="tf-mono tf-hero-meta-line">
          <span className="tf-hero-meta-num">01</span>
          <span className="tf-hero-meta-divider" aria-hidden="true" />
          <span className="tf-hero-meta-chip">{content.chips.established}</span>
          <span className="tf-hero-meta-sep" aria-hidden="true">·</span>
          <span className="tf-hero-meta-chip">{content.chips.argentina}</span>
        </span>
        <span className="tf-mono tf-hero-status">
          <i className="tf-dot" /> {content.workshopActive}
        </span>
      </div>

      <div className="tf-hero-type">
        <h1 className="tf-display">
          <span>{c.titleA}</span>
          <span className="tf-display-mid">{c.titleB}</span>
          <span className="tf-display-accent">{c.titleC}</span>
        </h1>
        <div className="tf-hero-bot">
          <p className="tf-hero-sub">{c.sub}</p>
          <div className="tf-hero-side">
            <HeroCTAs ctaPrimary={c.ctaPrimary} ctaSecondary={c.ctaSecondary} />
          </div>
        </div>
        <dl className="tf-hero-stats">
          {stats.map((s, i) => (
            <Stat key={i} idx={i} v={s.v} l={s.l} />
          ))}
        </dl>
      </div>
      <div className="tf-hero-scroll" aria-hidden="true">
        <span>SCROLL</span>
        <span className="tf-hero-scroll-line" />
      </div>
    </section>
  );
}

