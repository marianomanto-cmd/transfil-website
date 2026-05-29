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
                  <path d="M10 0H0v10" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.35" />
                </pattern>
              </defs>
              <rect width="200" height="120" fill="url(#map-grid)" />
              {/* Av. Circunvalación — the ring road that wraps Córdoba */}
              <ellipse cx="100" cy="60" rx="58" ry="38" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.65" />
              {/* Suquía river crossing the city east-west, roughly */}
              <path d="M30 55 Q60 62 100 58 T172 64" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
              {/* Cardinal markers on the ring */}
              <text x="100" y="20" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.5" fontFamily="monospace">N</text>
              <text x="100" y="106" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.5" fontFamily="monospace">S</text>
              <text x="36" y="62" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.5" fontFamily="monospace">O</text>
              <text x="164" y="62" textAnchor="middle" fontSize="5" fill="currentColor" opacity="0.5" fontFamily="monospace">E</text>
              {/* Pin at the workshop location — NW of city centre, just outside the ring on Fco. de Arteaga */}
              <line x1="70" y1="42" x2="100" y2="60" stroke="currentColor" strokeWidth="0.4" opacity="0.5" strokeDasharray="1.5 1.5" />
              <circle cx="70" cy="42" r="2.6" fill="currentColor" />
              <circle cx="70" cy="42" r="6" fill="none" stroke="currentColor" strokeWidth="0.6">
                <animate attributeName="r" from="2.8" to="12" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.7" to="0" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <text x="76" y="44" fontSize="5" fill="currentColor" fontFamily="monospace">TRANS·FIL</text>
              <text x="76" y="50" fontSize="3.6" fill="currentColor" opacity="0.55" fontFamily="monospace">F. ARTEAGA 3043</text>
              <text x="100" y="115" textAnchor="middle" fontSize="3.6" fill="currentColor" opacity="0.45" fontFamily="monospace">CÓRDOBA · AV. CIRCUNVALACIÓN</text>
            </svg>
          </div>
        </aside>
      </div>
    </section>
  );
}
