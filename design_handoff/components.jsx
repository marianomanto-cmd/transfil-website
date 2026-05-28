// components.jsx — shared atoms & layout primitives for Trans-Fil site.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ── Tiny utilities ─────────────────────────────────────────────────────────
const cx = (...a) => a.filter(Boolean).join(" ");

// IntersectionObserver hook for reveal-on-scroll. Returns [ref, visible].
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, vis];
}

// Smooth scrollY tracker — raf-throttled and only stays active while the
// component using it is mounted. Used by the hero background parallax.
function useScrollY() {
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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return y;
}

// Count-up animation — animates 0→target over ~1.2s once the element
// enters view. Splits the input string into numeric + suffix so values
// like "120+" or "24/7" still work (suffix is appended as-is, prefix-only
// values like "24/7" just hold the number visible).
function useCountUp(target, opts = {}) {
  const { duration = 1400 } = opts;
  const [ref, visible] = useReveal(0.4);
  const [val, setVal] = useState(0);
  const parsed = useMemo(() => {
    const m = String(target).match(/^(\d+)(.*)$/);
    if (!m) return { num: null, suffix: target };
    return { num: parseInt(m[1], 10), suffix: m[2] };
  }, [target]);
  useEffect(() => {
    if (!visible || parsed.num == null) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic so the count decelerates near the end
      const e = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(parsed.num * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, parsed.num, duration]);
  const display = parsed.num == null ? parsed.suffix : `${val}${parsed.suffix}`;
  return [ref, display];
}

// ── Header ─────────────────────────────────────────────────────────────────
function TFHeader({ lang, setLang, content }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      // Progress = scroll / scrollable height. Clamps 0..1.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const items = [
    { href: "#tech", label: content.nav.tech },
    { href: "#catalogs", label: content.nav.catalogs },
    { href: "#services", label: content.nav.services },
    { href: "#industries", label: content.nav.industries },
    { href: "#history", label: content.nav.history },
    { href: "#contact", label: content.nav.contact },
  ];
  const onNav = (e, href) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <header className={cx("tf-header", scrolled && "is-scrolled")}>
      <div className="tf-header-inner">
        <a href="#top" className="tf-logo" onClick={(e) => onNav(e, "#top")} aria-label="Trans-Fil">
          <span className="tf-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <rect x="1" y="1" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6 16 L16 6 L26 16 L16 26 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="16" cy="16" r="2.4" fill="currentColor" />
            </svg>
          </span>
          <span className="tf-logo-text">
            <b>TRANS·FIL</b>
            <em>Industrial Machinery</em>
          </span>
        </a>
        <nav className="tf-nav" aria-label="Primary">
          {items.map((it) => (
            <a key={it.href} href={it.href} onClick={(e) => onNav(e, it.href)}>{it.label}</a>
          ))}
        </nav>
        <div className="tf-header-aside">
          <div className="tf-lang" role="group" aria-label="Language">
            <button data-on={lang === "es"} onClick={() => setLang("es")}>ES</button>
            <span aria-hidden="true">/</span>
            <button data-on={lang === "en"} onClick={() => setLang("en")}>EN</button>
          </div>
          <a href="#contact" className="tf-cta-mini" onClick={(e) => onNav(e, "#contact")}>
            <span>{content.nav.contact}</span>
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
            </svg>
          </a>
          <button className="tf-burger" aria-label="Menu" data-open={open} onClick={() => setOpen(!open)}>
            <i /><i /><i />
          </button>
        </div>
      </div>
      <div className="tf-mobile-nav" data-open={open}>
        {items.map((it) => (
          <a key={it.href} href={it.href} onClick={(e) => onNav(e, it.href)}>{it.label}</a>
        ))}
        <div className="tf-mobile-nav-foot">
          <div className="tf-lang tf-mobile-lang" role="group" aria-label="Language">
            <button data-on={lang === "es"} onClick={() => setLang("es")}>ES</button>
            <span aria-hidden="true">/</span>
            <button data-on={lang === "en"} onClick={() => setLang("en")}>EN</button>
          </div>
          <a href="#contact" className="tf-mobile-cta"
             onClick={(e) => onNav(e, "#contact")}>
            <span>{content.nav.contact}</span>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
            </svg>
          </a>
        </div>
      </div>
      <div className="tf-header-progress" aria-hidden="true"
           style={{ transform: `scaleX(${progress})` }} />
    </header>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────
function TFSection({ id, eyebrow, title, sub, children, dark = false, screenLabel }) {
  const [ref, vis] = useReveal(0.1);
  return (
    <section id={id} ref={ref}
             data-screen-label={screenLabel}
             className={cx("tf-section", dark && "is-dark", vis && "is-visible")}>
      {(eyebrow || title) && (
        <header className="tf-section-head">
          {eyebrow && <div className="tf-eyebrow">{eyebrow}</div>}
          {title && <h2 className="tf-h2">{title}</h2>}
          {sub && <p className="tf-section-sub">{sub}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

// ── Image / video placeholder slots ────────────────────────────────────────
// Subtle striped placeholder — never hand-draws machinery, just labels what
// should drop in.
function TFMedia({ kind = "photo", label, ratio = "4/3", caption, accent = false, src, objectPosition }) {
  return (
    <figure className={cx("tf-media", accent && "is-accent", src && "has-src")} style={{ aspectRatio: ratio }}>
      <div className="tf-media-inner" data-kind={kind}>
        {src ? (
          <img className="tf-media-img" src={src} alt={label || ""}
               style={objectPosition ? { objectPosition } : undefined} loading="lazy" />
        ) : (
          <svg className="tf-media-stripes" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <pattern id={`stripe-${kind}-${label}`} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill={`url(#stripe-${kind}-${label})`} />
          </svg>
        )}
        <div className="tf-media-corners" aria-hidden="true">
          <i /><i /><i /><i />
        </div>
        {!src && (
          <div className="tf-media-label">
            <span className="tf-media-kind">{kind === "video" ? "▶ VIDEO" : "◧ PHOTO"}</span>
            <span className="tf-media-text">{label}</span>
          </div>
        )}
        {src && kind === "video" && (
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

// ── Marquee (logos) ────────────────────────────────────────────────────────
function TFMarquee({ items, speed = 60 }) {
  // Duplicate the item list so the translate animation loops seamlessly.
  const doubled = [...items, ...items];
  return (
    <div className="tf-marquee" aria-hidden="false">
      <div className="tf-marquee-track" style={{ animationDuration: `${speed}s` }}>
        {doubled.map((name, i) => (
          <div key={i} className="tf-marquee-item">
            <span className="tf-logo-placeholder">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Typographic client list (alt variant)
function TFClientsList({ items }) {
  return (
    <ul className="tf-client-list">
      {items.map((name, i) => (
        <li key={i}>
          <span className="tf-client-num">{String(i + 1).padStart(2, "0")}</span>
          <span className="tf-client-name">{name}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Floating WhatsApp CTA ──────────────────────────────────────────────────
// Always visible at bottom-right on every device. The Argentine industrial
// B2B audience converts overwhelmingly through WA — having it one tap away
// matters more than visual restraint.
function TFWhatsAppFAB({ phone = "5493513115838", message = "Hola, los contacto desde el sitio web de Trans-Fil." }) {
  // Hide briefly when user is at the top of the page so the hero stays clean.
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return (
    <a className={cx("tf-wa-fab", show && "is-visible")}
       href={href}
       target="_blank"
       rel="noopener noreferrer"
       aria-label="Contactar por WhatsApp">
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
        <path fill="currentColor" d="M16 3C8.82 3 3 8.82 3 16c0 2.4.65 4.65 1.79 6.58L3 29l6.6-1.74A12.94 12.94 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm7.5 18.27c-.32.9-1.85 1.71-2.6 1.78-.66.07-1.5.1-2.43-.15-.56-.16-1.28-.4-2.2-.78-3.86-1.67-6.4-5.55-6.6-5.8-.2-.27-1.58-2.1-1.58-4.02 0-1.91 1-2.85 1.36-3.24.36-.4.78-.5 1.04-.5h.74c.24 0 .56-.09.87.66.32.78 1.1 2.7 1.2 2.9.1.2.16.42.03.68-.13.27-.2.43-.4.66-.2.23-.42.5-.6.68-.2.2-.4.42-.18.82.23.4 1 1.66 2.15 2.7 1.47 1.3 2.72 1.7 3.12 1.9.4.2.63.16.86-.1.23-.27.98-1.16 1.25-1.55.27-.4.54-.33.9-.2.36.14 2.3 1.1 2.7 1.3.4.2.66.3.76.46.1.16.1.94-.22 1.85z"/>
      </svg>
      <span>WhatsApp</span>
    </a>
  );
}
function TFFooter({ content }) {
  const year = new Date().getFullYear();
  return (
    <footer className="tf-footer">
      <div className="tf-footer-grid">
        <div className="tf-footer-brand">
          <div className="tf-logo-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="40" height="40">
              <rect x="1" y="1" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M6 16 L16 6 L26 16 L16 26 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="16" cy="16" r="2.4" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="tf-footer-name">TRANS·FIL S.R.L.</div>
            <div className="tf-footer-tag">{content.footer.tag}</div>
          </div>
        </div>
        <div className="tf-footer-col">
          <div className="tf-footer-h">{content.nav.tech}</div>
          <a href="#tech">{content.tech[0].title}</a>
          <a href="#tech">{content.tech[1].title}</a>
          <a href="#tech">{content.tech[2].title}</a>
          <a href="#tech">{content.tech[3].title}</a>
        </div>
        <div className="tf-footer-col">
          <div className="tf-footer-h">{content.nav.services}</div>
          {content.services.items.map((s) => (
            <a key={s.code} href="#services">{s.title}</a>
          ))}
        </div>
        <div className="tf-footer-col">
          <div className="tf-footer-h">{content.nav.contact}</div>
          <a href="mailto:mantovanimariano@transfil.com.ar">mantovanimariano@transfil.com.ar</a>
          <a href="tel:+543514650687">+54 (351) 465 0687</a>
          <span className="tf-footer-static">{content.contact.addr}</span>
        </div>
      </div>
      <div className="tf-footer-rule" aria-hidden="true" />
      <div className="tf-footer-bot">
        <span>© {year} {content.footer.built} — {content.footer.rights}</span>
        <span className="tf-mono">CÓRDOBA · AR · 31°24′S · 64°11′W</span>
      </div>
    </footer>
  );
}

Object.assign(window, {
  cx, useReveal, useScrollY, useCountUp,
  TFHeader, TFSection, TFMedia, TFMarquee, TFClientsList, TFFooter, TFWhatsAppFAB,
});
