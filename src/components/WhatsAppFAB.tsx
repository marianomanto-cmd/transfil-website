import { useEffect, useState } from 'react';
import { cx } from '../lib/cx';

type Props = {
  phone?: string;
  message: string;
};

export function WhatsAppFAB({ phone = '5493513115838', message }: Props) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return (
    <a
      className={cx('tf-wa-fab', show && 'is-visible')}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16 3C8.82 3 3 8.82 3 16c0 2.4.65 4.65 1.79 6.58L3 29l6.6-1.74A12.94 12.94 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm7.5 18.27c-.32.9-1.85 1.71-2.6 1.78-.66.07-1.5.1-2.43-.15-.56-.16-1.28-.4-2.2-.78-3.86-1.67-6.4-5.55-6.6-5.8-.2-.27-1.58-2.1-1.58-4.02 0-1.91 1-2.85 1.36-3.24.36-.4.78-.5 1.04-.5h.74c.24 0 .56-.09.87.66.32.78 1.1 2.7 1.2 2.9.1.2.16.42.03.68-.13.27-.2.43-.4.66-.2.23-.42.5-.6.68-.2.2-.4.42-.18.82.23.4 1 1.66 2.15 2.7 1.47 1.3 2.72 1.7 3.12 1.9.4.2.63.16.86-.1.23-.27.98-1.16 1.25-1.55.27-.4.54-.33.9-.2.36.14 2.3 1.1 2.7 1.3.4.2.66.3.76.46.1.16.1.94-.22 1.85z"
        />
      </svg>
      <span>WhatsApp</span>
    </a>
  );
}
