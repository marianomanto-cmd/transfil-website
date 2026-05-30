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
              <span>24/7 · {content.workshopActive}</span>
            </div>
          </div>
          <div className="tf-contact-block">
            <div className="tf-mono tf-contact-h">{c.addressLabel}</div>
            <p className="tf-contact-addr">{c.addr}</p>
            <p className="tf-contact-coord tf-mono">31°24′17″S · 64°11′31″W</p>
          </div>
          <div className="tf-contact-map">
            <iframe
              title="Trans-Fil · Francisco de Arteaga 3043, Córdoba"
              src="https://maps.google.com/maps?q=Francisco+de+Arteaga+3043,+C%C3%B3rdoba,+Argentina&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
