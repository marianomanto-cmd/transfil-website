/**
 * Medición desde los componentes — ver docs/MEDICION.md.
 *
 * Todo evento del sitio sale por `window.tfTrack`, que define Base.astro en
 * el <head> antes de GTM y le suma página e idioma a cada uno. Acá solo hay
 * un envoltorio tipado para React, más el hash de los datos de contacto que
 * usan las conversiones avanzadas de Google Ads.
 */

type Params = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    tfTrack?: (event: string, params?: Params) => void;
  }
}

export function track(event: string, params: Params = {}): void {
  if (typeof window === 'undefined') return;
  if (window.tfTrack) {
    window.tfTrack(event, params);
    return;
  }
  // Base.astro no cargó (no debería pasar): el evento sale igual, sin contexto.
  (window.dataLayer = window.dataLayer || []).push({ event, ...params });
}

/* ── Conversiones avanzadas ──────────────────────────────────────────────
   Google recibe el mail (y el teléfono, si viene con código de país) ya
   hasheado con SHA-256, normalizado como pide su guía: sin espacios, en
   minúsculas y, en Gmail, sin los puntos del usuario. En el dataLayer nunca
   queda el dato en claro, así que ninguna otra etiqueta puede mandarlo. */

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

function normalizeEmail(raw: string): string {
  const email = raw.trim().toLowerCase();
  const at = email.lastIndexOf('@');
  if (at < 1) return '';
  let user = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (domain === 'gmail.com' || domain === 'googlemail.com') user = user.replace(/\./g, '');
  return `${user}@${domain}`;
}

/** E.164 solo si el visitante escribió el código de país; si no, no se adivina. */
function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('+')) return '';
  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : '';
}

/** `user_data` para el evento `generate_lead`, o undefined si no hay nada que mandar. */
export async function hashedUserData(
  email: string,
  phone: string,
): Promise<Record<string, string> | undefined> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) return undefined;
  const out: Record<string, string> = {};
  const e = normalizeEmail(email);
  if (e) out.sha256_email_address = await sha256(e);
  const p = normalizePhone(phone);
  if (p) out.sha256_phone_number = await sha256(p);
  return Object.keys(out).length ? out : undefined;
}
