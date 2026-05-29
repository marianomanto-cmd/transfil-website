import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useReveal } from '../lib/hooks';
import type { Content } from '../i18n/content';

function Field({
  label, children, err, req, full,
}: {
  label: string;
  children: ReactNode;
  err?: string;
  req?: boolean;
  full?: boolean;
}) {
  return (
    <label className={cx('tf-field', full && 'is-full', err && 'is-err')}>
      <span className="tf-field-label">
        {label}
        {req && <i className="tf-req" aria-hidden="true">*</i>}
        {err && <em className="tf-field-err">{err}</em>}
      </span>
      {children}
    </label>
  );
}

export function ContactSection({ content }: { content: Content }) {
  const c = content.contact;
  const [data, setData] = useState({
    name: '', company: '', email: '', phone: '',
    industry: c.form.industryOpts[0], message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sectionRef, vis] = useReveal(0.1);

  useEffect(() => {
    setData((d) => ({ ...d, industry: c.form.industryOpts[0] }));
  }, [content]);

  const set = (k: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setData({ ...data, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!data.name) errs.name = c.form.required;
    if (!data.email) errs.email = c.form.required;
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) errs.email = c.form.emailErr;
    if (!data.message) errs.message = c.form.required;
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      // TODO: wire up real submission endpoint (mailto/Formspree/API) — to be defined with client.
      console.log('contact form submission', data);
      setSent(true);
      setTimeout(() => setSent(false), 5000);
      setData({
        name: '', company: '', email: '', phone: '',
        industry: c.form.industryOpts[0], message: '',
      });
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={cx('tf-section', 'is-dark', vis && 'is-visible')}
      data-screen-label="07 Contact"
    >
      <header className="tf-section-head" data-num="07">
        <div className="tf-eyebrow">{c.eyebrow}</div>
        <h2 className="tf-h2">{c.title}</h2>
        <p className="tf-section-sub">{c.sub}</p>
      </header>
      <div className="tf-contact">
        <form className="tf-form" onSubmit={submit} noValidate>
          <div className="tf-form-grid">
            <Field label={c.form.name} err={errors.name} req>
              <input type="text" value={data.name} onChange={set('name')} autoComplete="name" />
            </Field>
            <Field label={c.form.company}>
              <input type="text" value={data.company} onChange={set('company')} autoComplete="organization" />
            </Field>
            <Field label={c.form.email} err={errors.email} req>
              <input type="email" value={data.email} onChange={set('email')} autoComplete="email" />
            </Field>
            <Field label={c.form.phone}>
              <input type="tel" value={data.phone} onChange={set('phone')} autoComplete="tel" />
            </Field>
            <Field label={c.form.industry} full>
              <select value={data.industry} onChange={set('industry')}>
                {c.form.industryOpts.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field label={c.form.message} err={errors.message} full req>
              <textarea rows={5} value={data.message} onChange={set('message')} />
            </Field>
          </div>
          <div className="tf-form-foot">
            <button type="submit" className="tf-btn tf-btn-primary tf-btn-lg">
              <span>{c.form.send}</span>
              <svg viewBox="0 0 16 16" width="14" height="14">
                <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
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
            <a
              className="tf-contact-wa"
              href={`https://wa.me/5493513115838?text=${encodeURIComponent(content.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                <path d="M2 14 3 11 A6 6 0 1 1 5.3 13L2 14Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              <span>WhatsApp</span>
            </a>
            <div className="tf-contact-hours" aria-hidden="true">
              <i />
              <span>24/7 · Workshop Active</span>
            </div>
          </div>
          <div className="tf-contact-block">
            <div className="tf-mono tf-contact-h">{c.addressLabel}</div>
            <p className="tf-contact-addr">{c.addr}</p>
            <p className="tf-contact-coord tf-mono">31°24′17″S · 64°11′31″W</p>
          </div>
          <div className="tf-contact-map" aria-hidden="true">
            <svg viewBox="0 0 200 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
              <defs>
                <pattern id="map-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M10 0H0v10" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.25" />
                </pattern>
              </defs>
              <rect width="200" height="120" fill="url(#map-grid)" />

              {/* Major avenues — Vélez Sarsfield (N-S), Colón / Sabattini (E-W),
                  Costanera following the river. Thin hairlines, faded. */}
              <g stroke="currentColor" strokeWidth="0.3" opacity="0.3" fill="none">
                <line x1="100" y1="22" x2="100" y2="98" />
                <line x1="42" y1="60" x2="158" y2="60" />
                <line x1="62" y1="30" x2="138" y2="90" />
                <line x1="62" y1="90" x2="138" y2="30" />
              </g>

              {/* Av. Circunvalación — irregular polygon (the ring isn't a true
                  ellipse: flatter east side, bulges N and S, slight indentations). */}
              <path
                d="M 100 20 L 124 23 L 144 32 L 156 46 L 160 60 L 156 76 L 148 88 L 130 95 L 108 98 L 88 96 L 68 90 L 52 78 L 44 64 L 42 50 L 48 38 L 60 28 L 80 22 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.85"
                opacity="0.7"
              />

              {/* Suquía river — meanders E-W through the city with realistic curves */}
              <path
                d="M 36 56 C 50 53, 60 60, 72 58 S 92 54, 100 58 S 122 64, 134 62 S 158 58, 172 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.6"
                opacity="0.5"
              />

              {/* Centre marker — faint diamond + CENTRO label */}
              <rect x="98" y="58" width="4" height="4" transform="rotate(45 100 60)"
                    fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.55" />
              <text x="100" y="68" textAnchor="middle" fontSize="3.2" fill="currentColor" opacity="0.5" fontFamily="monospace">CENTRO</text>

              {/* Cardinal markers placed inside the ring corners */}
              <text x="100" y="16" textAnchor="middle" fontSize="4.5" fill="currentColor" opacity="0.5" fontFamily="monospace">N</text>
              <text x="100" y="108" textAnchor="middle" fontSize="4.5" fill="currentColor" opacity="0.5" fontFamily="monospace">S</text>
              <text x="34" y="62" textAnchor="middle" fontSize="4.5" fill="currentColor" opacity="0.5" fontFamily="monospace">O</text>
              <text x="168" y="62" textAnchor="middle" fontSize="4.5" fill="currentColor" opacity="0.5" fontFamily="monospace">E</text>

              {/* Compass rose top-right corner */}
              <g transform="translate(186 14)">
                <circle cx="0" cy="0" r="6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="0.35" />
                <line x1="0" y1="-6" x2="0" y2="6" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
                <line x1="-6" y1="0" x2="6" y2="0" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
                <polygon points="0,-6 -1.6,-2.2 1.6,-2.2" fill="currentColor" />
                <text x="0" y="-7.5" textAnchor="middle" fontSize="2.2" fill="currentColor" fontFamily="monospace">N</text>
              </g>

              {/* Pin at the workshop location — NW quadrant, outside the ring */}
              <line x1="68" y1="38" x2="100" y2="60" stroke="currentColor" strokeWidth="0.4" opacity="0.5" strokeDasharray="1.5 1.5" />
              <circle cx="68" cy="38" r="2.8" fill="currentColor" />
              <circle cx="68" cy="38" r="6" fill="none" stroke="currentColor" strokeWidth="0.6">
                <animate attributeName="r" from="3" to="12" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.75" to="0" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <text x="74" y="38" fontSize="4.8" fill="currentColor" fontFamily="monospace" fontWeight="500">TRANS·FIL</text>
              <text x="74" y="44" fontSize="3.4" fill="currentColor" opacity="0.55" fontFamily="monospace">F. DE ARTEAGA 3043</text>

              {/* Scale + city stamp at bottom */}
              <g transform="translate(8 112)">
                <line x1="0" y1="0" x2="18" y2="0" stroke="currentColor" strokeWidth="0.4" />
                <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="currentColor" strokeWidth="0.4" />
                <line x1="9" y1="-1" x2="9" y2="1" stroke="currentColor" strokeWidth="0.3" />
                <line x1="18" y1="-1.5" x2="18" y2="1.5" stroke="currentColor" strokeWidth="0.4" />
                <text x="9" y="5.5" textAnchor="middle" fontSize="2.6" fill="currentColor" opacity="0.6" fontFamily="monospace">≈ 5 km</text>
              </g>
              <text x="192" y="116" textAnchor="end" fontSize="3" fill="currentColor" opacity="0.5" fontFamily="monospace">CÓRDOBA · AR · 31°24′S · 64°11′W</text>
            </svg>
          </div>
        </aside>
      </div>
    </section>
  );
}
