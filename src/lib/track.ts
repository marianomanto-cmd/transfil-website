/**
 * Medición desde los componentes — ver docs/MEDICION.md.
 *
 * Todo evento del sitio sale por `window.tfTrack`, que define Base.astro en
 * el <head> antes de GTM y le suma página e idioma a cada uno. Acá solo hay
 * un envoltorio tipado para React, el ID de cada lead y el hash de los datos
 * de contacto que usan las conversiones avanzadas de Google Ads.
 */

type Params = Record<string, unknown>;

/** Una llegada con UTM o click IDs, como la guarda Base.astro en `tf_attr`. */
export type Touch = {
  /** Los parámetros tal como venían en la URL. */
  p: Record<string, string>;
  /** Cuándo (ms). */
  t: number;
  /** Ruta en la que entró. */
  l: string;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    tfTrack?: (event: string, params?: Params) => void;
    /** Primer y último contacto con UTM o click IDs (90 días), o null. */
    tfAttribution?: () => { first: Touch | null; last: Touch | null } | null;
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

/**
 * ID único de cada lead del formulario. Sale en `generate_lead` (`lead_id`)
 * y en el mail a ventas, así una conversión de GA4 / Google Ads se puede
 * cruzar con el mail que la originó: sirve de ID de transacción para que
 * Google Ads no cuente dos veces el mismo lead y de ID de pedido en la
 * importación offline de "Lead calificado". `randomUUID` solo existe en
 * contextos seguros (https, localhost); si no está, se arma un UUID v4 igual.
 */
export function newLeadId(): string {
  const c = typeof crypto !== 'undefined' ? crypto : undefined;
  if (c?.randomUUID) return c.randomUUID();
  const b = new Uint8Array(16);
  if (c?.getRandomValues) c.getRandomValues(b);
  else for (let i = 0; i < b.length; i++) b[i] = Math.floor(Math.random() * 256);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
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
