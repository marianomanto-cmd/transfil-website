import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useReveal } from '../lib/hooks';
import type { Content } from '../i18n/content';

function Field({
  label, children, err, req, full, htmlFor,
}: {
  label: string;
  children: ReactNode;
  err?: string;
  req?: boolean;
  full?: boolean;
  htmlFor?: string;
}) {
  return (
    <label className={cx('tf-field', full && 'is-full', err && 'is-err')} htmlFor={htmlFor}>
      <span className="tf-field-label">
        {label}
        {req && <i className="tf-req" aria-hidden="true">*</i>}
        {err && <em className="tf-field-err" role="alert">{err}</em>}
      </span>
      {children}
    </label>
  );
}

type FormState = {
  name: string; company: string; email: string; phone: string;
  industry: string; message: string;
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function ContactSection({ content }: { content: Content }) {
  const c = content.contact;
  const [data, setData] = useState<FormState>({
    name: '', company: '', email: '', phone: '',
    industry: c.form.industryOpts[0], message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sectionRef, vis] = useReveal(0.1);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setData((d) => ({ ...d, industry: c.form.industryOpts[0] }));
  }, [content]);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  const validate = (d: FormState): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!d.name.trim()) errs.name = c.form.required;
    if (!d.email.trim()) errs.email = c.form.required;
    else if (!EMAIL_RE.test(d.email)) errs.email = c.form.emailErr;
    if (!d.message.trim()) errs.message = c.form.required;
    return errs;
  };

  // Surface a single field's error on blur — never on focus or first paint.
  const onBlur = (k: 'name' | 'email' | 'message') => () => {
    const errs = validate(data);
    setErrors((prev) => ({ ...prev, [k]: errs[k] || '' }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(data);
    setErrors(errs);
    const refMap = { name: nameRef, email: emailRef, message: messageRef };
    const firstInvalid = (['name', 'email', 'message'] as const).find((k) => errs[k]);
    if (firstInvalid) {
      refMap[firstInvalid].current?.focus();
      return;
    }
    const isEs = content.htmlLang.startsWith('es');
    const subject = `[Web${data.company ? ` · ${data.company}` : ''}] ${data.name}`;
    const lines = [
      `${c.form.name}: ${data.name}`,
      data.company ? `${c.form.company}: ${data.company}` : null,
      `${c.form.email}: ${data.email}`,
      data.phone ? `${c.form.phone}: ${data.phone}` : null,
      `${c.form.industry}: ${data.industry}`,
      '',
      `${c.form.message}:`,
      data.message,
      '',
      isEs ? '— Enviado desde transfil.com.ar' : '— Sent from transfil.com.ar',
    ].filter(Boolean) as string[];
    const href = `mailto:ventas@transfil.com.ar?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    window.location.href = href;
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setData({
      name: '', company: '', email: '', phone: '',
      industry: c.form.industryOpts[0], message: '',
    });
  };

  const errIds = {
    name: errors.name ? 'tf-err-name' : undefined,
    email: errors.email ? 'tf-err-email' : undefined,
    message: errors.message ? 'tf-err-message' : undefined,
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
            <Field label={c.form.name} err={errors.name} req htmlFor="tf-name">
              <input
                id="tf-name"
                type="text"
                value={data.name}
                onChange={set('name')}
                onBlur={onBlur('name')}
                autoComplete="name"
                aria-required="true"
                aria-invalid={!!errors.name}
                aria-describedby={errIds.name}
                ref={nameRef}
              />
            </Field>
            <Field label={c.form.company} htmlFor="tf-company">
              <input id="tf-company" type="text" value={data.company} onChange={set('company')} autoComplete="organization" />
            </Field>
            <Field label={c.form.email} err={errors.email} req htmlFor="tf-email">
              <input
                id="tf-email"
                type="email"
                value={data.email}
                onChange={set('email')}
                onBlur={onBlur('email')}
                autoComplete="email"
                inputMode="email"
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errIds.email}
                ref={emailRef}
              />
            </Field>
            <Field label={c.form.phone} htmlFor="tf-phone">
              <input id="tf-phone" type="tel" value={data.phone} onChange={set('phone')} autoComplete="tel" inputMode="tel" />
            </Field>
            <Field label={c.form.industry} full htmlFor="tf-industry">
              <select id="tf-industry" value={data.industry} onChange={set('industry')}>
                {c.form.industryOpts.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field label={c.form.message} err={errors.message} full req htmlFor="tf-message">
              <textarea
                id="tf-message"
                rows={5}
                value={data.message}
                onChange={set('message')}
                onBlur={onBlur('message')}
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errIds.message}
                ref={messageRef}
              />
            </Field>
          </div>
          <div className="tf-form-foot">
            <button type="submit" className="tf-btn tf-btn-primary tf-btn-lg">
              <span>{c.form.send}</span>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            <span className="tf-form-sent" role="status" aria-live="polite">
              {sent ? `✓ ${c.form.sent}` : ''}
            </span>
          </div>
        </form>
        <aside className="tf-contact-side">
          <div className="tf-contact-block">
            <div className="tf-mono tf-contact-h">{c.direct}</div>
            <a href="mailto:ventas@transfil.com.ar" className="tf-contact-link">
              ventas@transfil.com.ar
            </a>
            <a href="tel:+5493513820321" className="tf-contact-link">+54 9 3513 82-0321</a>
            <a
              className="tf-contact-wa"
              href={`https://wa.me/5493513820321?text=${encodeURIComponent(content.whatsappMessage)}`}
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
              title={`Trans-Fil · ${c.addr}`}
              src="https://maps.google.com/maps?q=Francisco+de+Arteaga+2895,+C%C3%B3rdoba,+Argentina&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}
