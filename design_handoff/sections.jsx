// sections.jsx — page-level sections for Trans-Fil. Each section reads
// `content` (current language) and any tweak-flagged variant flags.

const { useState: tfUseState, useMemo: tfUseMemo, useRef: tfUseRef, useEffect: tfUseEffect } = React;

// ── HERO ───────────────────────────────────────────────────────────────────
// Three variants, swappable via Tweaks:
//   "type"    — typography-led, full-bleed numbers + giant headline
//   "split"   — split: headline + technical photo
//   "video"   — video loop placeholder with overlay
function TFHero({ content, variant, bgUrl }) {
  const c = content.hero;
  const scrollY = useScrollY();
  // Parallax disabled on small / coarse-pointer devices — on phones the
  // sub-pixel translate fights the OS scroll and the headline feels janky.
  const enableParallax = typeof window !== 'undefined'
    && window.matchMedia && window.matchMedia('(min-width: 900px) and (pointer: fine)').matches;
  const parallax = enableParallax ? Math.min(scrollY * 0.18, 160) : 0;
  return (
    <section id="top" className="tf-hero" data-variant={variant} data-screen-label="01 Hero">
      {/* Background photo — only behind the type variant so split/video
          keep their own image-led layouts. URL pulled from tweaks so we can
          A/B different stock photos without touching the component. */}
      {variant === "type" && bgUrl && (
        <div className="tf-hero-bg" aria-hidden="true"
             style={{ transform: `translate3d(0, ${parallax}px, 0)` }}>
          <img src={bgUrl} alt="" />
        </div>
      )}
      {/* Top bar of meta — present in all variants */}
      <div className="tf-hero-meta">
        <span className="tf-mono">[ 01 — {content.chips.established} · {content.chips.argentina} ]</span>
        <span className="tf-mono tf-hero-status"><i className="tf-dot" /> Workshop · Active</span>
      </div>

      {variant === "type" && <TFHeroType c={c} chips={content.chips} />}
      {variant === "split" && <TFHeroSplit c={c} chips={content.chips} />}
      {variant === "video" && <TFHeroVideo c={c} chips={content.chips} />}
    </section>
  );
}

function TFHeroCTAs({ c }) {
  return (
    <div className="tf-hero-ctas">
      <a href="#tech" className="tf-btn tf-btn-primary"
         onClick={(e) => { e.preventDefault(); document.querySelector("#tech")?.scrollIntoView({ behavior: "smooth" }); }}>
        <span>{c.ctaPrimary}</span>
        <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
      </a>
      <a href="#contact" className="tf-btn tf-btn-ghost"
         onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}>
        {c.ctaSecondary}
      </a>
    </div>
  );
}

function TFStats({ c }) {
  const stats = [c.stat1, c.stat2, c.stat3, c.stat4];
  return (
    <dl className="tf-hero-stats">
      {stats.map((s, i) => (
        <TFStat key={i} idx={i} v={s.v} l={s.l} />
      ))}
    </dl>
  );
}

function TFStat({ idx, v, l }) {
  const [ref, display] = useCountUp(v, { duration: 1300 + idx * 120 });
  return (
    <div className="tf-stat" ref={ref}>
      <dt className="tf-mono">{`0${idx + 1}`}</dt>
      <dd>
        <span className="tf-stat-v">{display}</span>
        <span className="tf-stat-l">{l}</span>
      </dd>
    </div>
  );
}

function TFHeroType({ c, chips }) {
  return (
    <div className="tf-hero-type">
      <h1 className="tf-display">
        <span>{c.titleA}</span>
        <span className="tf-display-mid">{c.titleB}</span>
        <span className="tf-display-accent">{c.titleC}</span>
      </h1>
      <div className="tf-hero-bot">
        <p className="tf-hero-sub">{c.sub}</p>
        <div className="tf-hero-side">
          <TFHeroCTAs c={c} />
        </div>
      </div>
      <TFStats c={c} />
    </div>
  );
}

function TFHeroSplit({ c, chips }) {
  return (
    <div className="tf-hero-split">
      <div className="tf-hero-split-text">
        <h1 className="tf-display tf-display-split">
          <span>{c.titleA}</span>
          <span>{c.titleB}</span>
          <span className="tf-display-accent">{c.titleC}</span>
        </h1>
        <p className="tf-hero-sub">{c.sub}</p>
        <TFHeroCTAs c={c} />
        <div className="tf-hero-chips">
          <span className="tf-chip">{chips.established}</span>
          <span className="tf-chip">{chips.argentina}</span>
          <span className="tf-chip">{chips.iso}</span>
        </div>
      </div>
      <div className="tf-hero-split-media">
        <TFMedia kind="photo" src="img/conveyor-blue.avif" label="Línea de transportador en planta automotriz / Conveyor in automotive plant" ratio="3/4" />
        <div className="tf-hero-spec tf-mono">
          <div><span>REF</span><b>TF-CV-2024-118</b></div>
          <div><span>TYPE</span><b>HINGE BELT · 4500mm</b></div>
          <div><span>FLOW</span><b>820 kg/h chip</b></div>
          <div><span>SITE</span><b>CÓRDOBA · AR</b></div>
        </div>
      </div>
      <TFStats c={c} />
    </div>
  );
}

function TFHeroVideo({ c, chips }) {
  return (
    <div className="tf-hero-video">
      <div className="tf-hero-video-frame">
        <TFMedia kind="video" src="img/welding-line.avif" label="Loop de máquina en operación / Machine in operation" ratio="21/9" />
        <div className="tf-hero-video-overlay">
          <h1 className="tf-display tf-display-overlay">
            <span>{c.titleA} {c.titleB}</span>
            <span className="tf-display-accent">{c.titleC}</span>
          </h1>
          <p className="tf-hero-sub tf-hero-sub-overlay">{c.sub}</p>
          <TFHeroCTAs c={c} />
        </div>
        <div className="tf-hero-video-corners" aria-hidden="true">
          <i /><i /><i /><i />
        </div>
      </div>
      <TFStats c={c} />
    </div>
  );
}

// ── CAPABILITIES + TECH GRID ───────────────────────────────────────────────
function TFTechSection({ content }) {
  const c = content.capabilities;
  const items = content.tech;
  const [active, setActive] = tfUseState(items[0].id);
  const [hoverBullet, setHoverBullet] = tfUseState(null); // {tech, bullet}
  const bulletsRef = React.useRef(null);
  const [cardTop, setCardTop] = tfUseState(0);
  tfUseEffect(() => {
    if (!hoverBullet || !bulletsRef.current) return;
    const techEl = bulletsRef.current.closest(".tf-tech");
    const techRect = techEl.getBoundingClientRect();
    const listRect = bulletsRef.current.getBoundingClientRect();
    setCardTop(listRect.top - techRect.top);
  }, [hoverBullet]);
  // Close bullet card on outside tap (mobile)
  tfUseEffect(() => {
    if (!hoverBullet) return;
    const onDoc = (e) => {
      if (!e.target.closest('.tf-tech-bullet') && !e.target.closest('.tf-bullet-card')) {
        setHoverBullet(null);
      }
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [hoverBullet]);
  const activeItem = items.find((i) => i.id === active) || items[0];

  return (
    <TFSection id="tech" eyebrow={c.eyebrow} title={c.title} sub={c.sub} screenLabel="02 Technologies">
      <div className="tf-tech">
        <div className="tf-tech-list" role="tablist">
          {items.map((it) => {
            const on = it.id === active;
            return (
              <button key={it.id} role="tab" aria-selected={on}
                      data-on={on}
                      className="tf-tech-row"
                      onClick={() => setActive(it.id)}
                      onMouseEnter={() => setActive(it.id)}>
                <span className="tf-mono tf-tech-code">{it.code}</span>
                <span className="tf-tech-title">{it.title}</span>
                <span className="tf-tech-sub tf-mono">{it.sub}</span>
                <span className="tf-tech-arrow" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
                </span>
              </button>
            );
          })}
        </div>
        <div className="tf-tech-detail" key={activeItem.id}>
          <div className="tf-tech-detail-media">
            <TFMedia kind="photo" src={activeItem.img} label={activeItem.title} ratio="4/3" />
          </div>
          <div className="tf-tech-detail-body">
            <div className="tf-mono tf-tech-detail-code">{activeItem.code} / {activeItem.sub}</div>
            <h3 className="tf-h3">{activeItem.title}</h3>
            <p className="tf-tech-desc">{activeItem.desc}</p>
            <ul className="tf-tech-bullets" ref={bulletsRef} onMouseLeave={() => setHoverBullet(null)}>
              {activeItem.bullets.map((b, i) => {
                const isObj = typeof b === "object" && b !== null;
                const name = isObj ? b.name : b;
                const on = hoverBullet && hoverBullet.name === name;
                return (
                  <li key={i}
                      className={cx("tf-tech-bullet", on && "is-on")}
                      role="button"
                      tabIndex={isObj ? 0 : -1}
                      onMouseEnter={() => isObj && setHoverBullet(b)}
                      onClick={(e) => {
                        if (!isObj) return;
                        e.stopPropagation();
                        setHoverBullet(on ? null : b);
                      }}>
                    <span className="tf-mono">→</span> {name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <TFBulletCard bullet={hoverBullet} top={cardTop} />
      </div>
    </TFSection>
  );
}

function TFBulletCard({ bullet, top }) {
  // Keep last bullet so the card can fade out smoothly without going blank.
  const [last, setLast] = tfUseState(null);
  tfUseEffect(() => { if (bullet) setLast(bullet); }, [bullet]);
  const b = bullet || last;
  return (
    <aside className={cx("tf-bullet-card", bullet && "is-visible")}
           style={{ top: `${top}px` }}
           aria-hidden={!bullet}>
      {b && (
        <>
          <div className="tf-bullet-card-media">
            <TFMedia kind={b.kind || "photo"} src={b.img} label={b.name} ratio="4/3" />
          </div>
          <div className="tf-bullet-card-body">
            <div className="tf-mono tf-bullet-card-eyebrow">→ {b.name}</div>
            <p>{b.desc}</p>
          </div>
        </>
      )}
    </aside>
  );
}

// ── CATALOGS ─────────────────────────────────────────────────────────────
// Three downloadable PDFs as cover-like cards. Each card uses its line's
// accent color and shows page count + file size so the user knows what
// they're getting before they click.
function TFCatalogsSection({ content }) {
  const c = content.catalogs;
  return (
    <TFSection id="catalogs" eyebrow={c.eyebrow} title={c.title} sub={c.sub} screenLabel="03 Catalogs">
      <div className="tf-catalogs">
        {c.items.map((it, i) => (
          <a key={it.id}
             className="tf-catalog-card"
             href={it.file}
             download
             style={{ '--cat-c': it.color }}
             aria-label={`${c.cta} — ${it.title}`}>
            <div className="tf-catalog-cover" aria-hidden="true">
              <div className="tf-catalog-cover-grid" />
              <div className="tf-catalog-cover-tag">
                <span className="tf-mono">{`C0${i + 1}`}</span>
                <span className="tf-mono">{it.pages}p · {it.size}</span>
              </div>
              <div className="tf-catalog-cover-brand">
                <span className="tf-catalog-cover-mark">
                  <svg viewBox="0 0 32 32" width="36" height="36">
                    <rect x="1" y="1" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M6 16 L16 6 L26 16 L16 26 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="16" cy="16" r="2.4" fill="currentColor" />
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
                  <path d="M8 2 V12 M4 8 L8 12 L12 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 14 H13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          </a>
        ))}
      </div>
    </TFSection>
  );
}
function TFProcessStrip({ lang, variant = "minimal", bannerImg }) {
  const steps = lang === "es"
    ? [
        { n: "01", t: "Estudio de proceso", d: "Visita a planta y relevamiento del flujo.", img: "img/hf-welder.png", pos: { x: 18, y: 28 } },
        { n: "02", t: "Ingeniería", d: "Diseño mecánico, eléctrico y simulación.", img: "img/control-cabinet.avif", pos: { x: 42, y: 22 } },
        { n: "03", t: "Fabricación", d: "Construcción en taller propio en Córdoba.", img: "img/welding-line.avif", pos: { x: 58, y: 52 } },
        { n: "04", t: "Puesta en marcha", d: "Instalación, integración y entrenamiento.", img: "img/conveyor-blue.avif", pos: { x: 78, y: 38 } },
        { n: "05", t: "Soporte", d: "Mantenimiento y retrofitting durante toda su vida útil.", img: "img/gearbox-detail.avif", pos: { x: 35, y: 70 } },
      ]
    : [
        { n: "01", t: "Process study", d: "Plant visit and flow assessment.", img: "img/hf-welder.png", pos: { x: 18, y: 28 } },
        { n: "02", t: "Engineering", d: "Mechanical, electrical design and simulation.", img: "img/control-cabinet.avif", pos: { x: 42, y: 22 } },
        { n: "03", t: "Manufacturing", d: "Built in our own Córdoba workshop.", img: "img/welding-line.avif", pos: { x: 58, y: 52 } },
        { n: "04", t: "Commissioning", d: "Installation, integration and training.", img: "img/conveyor-blue.avif", pos: { x: 78, y: 38 } },
        { n: "05", t: "Support", d: "Maintenance and retrofit throughout its working life.", img: "img/gearbox-detail.avif", pos: { x: 35, y: 70 } },
      ];
  const eyebrow = lang === "es" ? "[ 03 — Cómo trabajamos ]" : "[ 03 — How we work ]";
  const title = lang === "es" ? "De la planta a la planta." : "Plant floor to plant floor.";
  return (
    <TFSection id="process" eyebrow={eyebrow} title={title} screenLabel="03 Process">
      {variant === "banner" && (
        <div className="tf-process-banner"
             style={{ backgroundImage: `url("${bannerImg || 'img/hf-welder.png'}")` }}
             aria-hidden="true">
          <div className="tf-process-banner-meta tf-mono">
            <span>HF WELDER · TUBE MILL</span>
            <span>FLUID TREATMENT</span>
          </div>
        </div>
      )}
      {variant === "hotspots" ? (
        <TFProcessHotspots steps={steps} img={bannerImg || 'img/hf-welder.png'} />
      ) : (
        <ol className={cx("tf-process", `is-${variant}`)}>
          {steps.map((s) => (
            <li key={s.n} className="tf-process-step">
              {variant === "perStep" && (
                <div className="tf-process-img" aria-hidden="true"
                     style={{ backgroundImage: `url("${s.img}")` }} />
              )}
              <div className="tf-process-num tf-mono">{s.n}</div>
              <div className="tf-process-line" aria-hidden="true" />
              <div className="tf-process-body">
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </TFSection>
  );
}

// Hotspot variant — one large photo with 5 numbered markers; hovering one
// raises a small card with the step copy. Each marker's `pos` is x/y in %
// inside the photo container.
function TFProcessHotspots({ steps, img }) {
  const [active, setActive] = tfUseState(null);
  // Close on outside click — keeps the tap-to-open UX clean on mobile.
  tfUseEffect(() => {
    if (active == null) return;
    const onDoc = (e) => {
      if (!e.target.closest('.tf-hotspot')) setActive(null);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [active]);
  return (
    <div className="tf-hotspots">
      <div className="tf-hotspots-frame">
        <img src={img} alt="" className="tf-hotspots-img" loading="lazy" />
        <div className="tf-hotspots-overlay" aria-hidden="true" />
        {steps.map((s) => {
          const on = active === s.n;
          return (
            <div key={s.n}
                 className={cx("tf-hotspot", on && "is-on")}
                 style={{ left: `${s.pos.x}%`, top: `${s.pos.y}%` }}
                 onMouseEnter={() => setActive(s.n)}
                 onMouseLeave={() => setActive(null)}>
              <button className="tf-hotspot-dot" aria-label={`${s.n} ${s.t}`}
                      onClick={(e) => { e.stopPropagation(); setActive(on ? null : s.n); }}>
                <span className="tf-hotspot-pulse" />
                <span className="tf-hotspot-num">{s.n}</span>
              </button>
              <div className="tf-hotspot-card"
                   data-side={s.pos.x > 60 ? "left" : "right"}
                   data-vside={s.pos.y > 60 ? "top" : "bottom"}>
                <div className="tf-mono tf-hotspot-card-eyebrow">/ {s.n}</div>
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </div>
            </div>
          );
        })}
      </div>
      <ol className="tf-hotspots-legend">
        {steps.map((s) => (
          <li key={s.n}
              className={cx("tf-hotspots-legend-item", active === s.n && "is-on")}
              onMouseEnter={() => setActive(s.n)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === s.n ? null : s.n)}>
            <span className="tf-mono">{s.n}</span>
            <span>{s.t}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── SERVICES ───────────────────────────────────────────────────────────────
function TFServicesSection({ content, variant = "grid" }) {
  const c = content.services;
  return (
    <TFSection id="services" eyebrow={c.eyebrow} title={c.title} sub={c.sub} dark={true} screenLabel="04 Services">
      <div className={cx("tf-services", `is-${variant}`)}>
        {c.items.map((s, i) => {
          const showBg = variant !== "clean" && s.img;
          return (
            <article key={s.code} className="tf-service"
                     style={showBg ? { '--svc-bg': `url("${s.img}")` } : undefined}
                     data-has-bg={showBg ? true : undefined}
                     data-row-flip={variant === "rows" && i % 2 === 1 ? true : undefined}>
              {variant === "rows" && s.img && (
                <div className="tf-service-row-img" aria-hidden="true"
                     style={{ backgroundImage: `url("${s.img}")` }} />
              )}
              <div className="tf-service-bg" aria-hidden="true" />
              <div className="tf-service-content">
                <div className="tf-service-hd">
                  <span className="tf-mono">{s.code}</span>
                  <span className="tf-service-rule" aria-hidden="true" />
                </div>
                <h3 className="tf-service-title">{s.title}</h3>
                <p className="tf-service-desc">{s.desc}</p>
              </div>
            </article>
          );
        })}
      </div>
    </TFSection>
  );
}

// ── INDUSTRIES + CLIENTS ───────────────────────────────────────────────────
function TFIndustriesSection({ content, clientsVariant }) {
  const c = content.industries;
  const [tab, setTab] = tfUseState(c.tabs[0].id);
  const items = window.TF_CLIENTS[tab] || [];
  return (
    <TFSection id="industries" eyebrow={c.eyebrow}
               title={<><span>{c.title}</span> <span className="tf-h2-accent">{c.title2}</span></>}
               sub={c.sub} screenLabel="05 Industries">
      <div className="tf-tabs" role="tablist">
        {c.tabs.map((t) => {
          const on = t.id === tab;
          const count = (window.TF_CLIENTS[t.id] || []).length;
          return (
            <button key={t.id} role="tab" aria-selected={on} data-on={on}
                    className="tf-tab" onClick={() => setTab(t.id)}>
              <span>{t.label}</span>
              <span className="tf-tab-count tf-mono">{String(count).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>
      {clientsVariant === "marquee" ? (
        <TFMarquee items={items} speed={60} />
      ) : (
        <TFClientsList items={items} />
      )}
    </TFSection>
  );
}

// ── HISTORY ────────────────────────────────────────────────────────────────
function TFHistorySection({ content }) {
  const c = content.history;
  return (
    <TFSection id="history" eyebrow={c.eyebrow} title={c.title} screenLabel="06 History">
      <div className="tf-history">
        <p className="tf-history-body">{c.body}</p>
        <ol className="tf-timeline">
          {c.milestones.map((m, i) => (
            <li key={m.y} className="tf-tl-item" style={{ ['--i']: i }}>
              <div className="tf-tl-year">{m.y}</div>
              <div className="tf-tl-dot" aria-hidden="true" />
              <div className="tf-tl-card">
                <h4>{m.t}</h4>
                <p>{m.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </TFSection>
  );
}

// ── CONTACT ────────────────────────────────────────────────────────────────
function TFContactSection({ content }) {
  const c = content.contact;
  const [data, setData] = tfUseState({
    name: "", company: "", email: "", phone: "", industry: c.form.industryOpts[0], message: "",
  });
  const [errors, setErrors] = tfUseState({});
  const [sent, setSent] = tfUseState(false);
  // Keep the dropdown's default option in sync when the user flips language
  // mid-fill, otherwise the localized label briefly mismatches the stored value.
  tfUseEffect(() => { setData((d) => ({ ...d, industry: c.form.industryOpts[0] })); }, [content]);

  const set = (k) => (e) => setData({ ...data, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!data.name) errs.name = c.form.required;
    if (!data.email) errs.email = c.form.required;
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) errs.email = c.form.emailErr;
    if (!data.message) errs.message = c.form.required;
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSent(true);
      setTimeout(() => setSent(false), 5000);
      setData({ name: "", company: "", email: "", phone: "", industry: c.form.industryOpts[0], message: "" });
    }
  };

  return (
    <TFSection id="contact" eyebrow={c.eyebrow} title={c.title} sub={c.sub} dark={true} screenLabel="07 Contact">
      <div className="tf-contact">
        <form className="tf-form" onSubmit={submit} noValidate>
          <div className="tf-form-grid">
            <Field label={c.form.name} err={errors.name} req>
              <input type="text" value={data.name} onChange={set("name")} />
            </Field>
            <Field label={c.form.company}>
              <input type="text" value={data.company} onChange={set("company")} />
            </Field>
            <Field label={c.form.email} err={errors.email} req>
              <input type="email" value={data.email} onChange={set("email")} />
            </Field>
            <Field label={c.form.phone}>
              <input type="tel" value={data.phone} onChange={set("phone")} />
            </Field>
            <Field label={c.form.industry} full>
              <select value={data.industry} onChange={set("industry")}>
                {c.form.industryOpts.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field label={c.form.message} err={errors.message} full req>
              <textarea rows={5} value={data.message} onChange={set("message")} />
            </Field>
          </div>
          <div className="tf-form-foot">
            <button type="submit" className="tf-btn tf-btn-primary tf-btn-lg">
              <span>{c.form.send}</span>
              <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
            </button>
            {sent && <span className="tf-form-sent">✓ {c.form.sent}</span>}
          </div>
        </form>
        <aside className="tf-contact-side">
          <div className="tf-contact-block">
            <div className="tf-mono tf-contact-h">{c.direct}</div>
            <a href="mailto:mantovanimariano@transfil.com.ar" className="tf-contact-link">
              mantovanimariano@transfil.com.ar
            </a>
            <a href="tel:+543514650687" className="tf-contact-link">+54 (351) 465 0687</a>
            <a href="tel:+5493513115838" className="tf-contact-link">+54 9 3513 11-5838</a>
          </div>
          <div className="tf-contact-block">
            <div className="tf-mono tf-contact-h">Address</div>
            <p className="tf-contact-addr">{c.addr}</p>
            <p className="tf-contact-coord tf-mono">31°24′17″S · 64°11′31″W</p>
          </div>
          <div className="tf-contact-map" aria-hidden="true">
            <svg viewBox="0 0 200 120" width="100%" height="100%" preserveAspectRatio="none">
              <defs>
                <pattern id="map-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M10 0H0v10" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="200" height="120" fill="url(#map-grid)" />
              <path d="M0 60 Q40 40 80 55 T160 50 L200 60" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
              <path d="M0 80 L60 70 L120 85 L200 75" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
              <circle cx="92" cy="62" r="3" fill="currentColor" />
              <circle cx="92" cy="62" r="8" fill="none" stroke="currentColor" strokeWidth="0.6">
                <animate attributeName="r" from="3" to="14" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.7" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="98" y="65" fontSize="6" fill="currentColor" fontFamily="monospace">CÓRDOBA</text>
            </svg>
          </div>
        </aside>
      </div>
    </TFSection>
  );
}

function Field({ label, children, err, req, full }) {
  return (
    <label className={cx("tf-field", full && "is-full", err && "is-err")}>
      <span className="tf-field-label">
        {label}
        {req && <i className="tf-req" aria-hidden="true">*</i>}
        {err && <em className="tf-field-err">{err}</em>}
      </span>
      {children}
    </label>
  );
}

Object.assign(window, {
  TFHero, TFTechSection, TFCatalogsSection, TFProcessStrip, TFServicesSection,
  TFIndustriesSection, TFHistorySection, TFContactSection,
});
