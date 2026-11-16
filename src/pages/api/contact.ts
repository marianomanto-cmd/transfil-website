import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// On-demand route: keeps the rest of the site static while this endpoint
// runs as a Vercel serverless function.
export const prerender = false;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Escape user input before interpolating into the email HTML.
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Campaign landings send a `page` key; it becomes the subject tag so sales
// can filter paid-traffic leads out of the general web inbox.
const PAGE_TAG: Record<string, string> = {
  conformado: 'Conformado',
  mecanizado: 'Mecanizado',
};

const json = (ok: boolean, status = 200) =>
  new Response(JSON.stringify({ ok }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json(false, 400);
  }

  const get = (k: string) => (typeof body[k] === 'string' ? (body[k] as string).trim() : '');
  const nombre = get('nombre');
  const email = get('email');
  const mensaje = get('mensaje');
  const telefono = get('telefono');
  const empresa = get('empresa');
  const industria = get('industria');
  const linea = get('linea');
  const website = get('website'); // honeypot
  // Landing-only context. Absent on the home, where everything below keeps
  // behaving exactly as it did.
  // Both land in the subject line, so they're whitelisted rather than
  // escaped — only a known-shaped slug / locale code gets through.
  const page = /^[a-z0-9-]{1,32}$/.test(get('page')) ? get('page') : '';
  const locale = /^[a-z]{2}$/.test(get('locale')) ? get('locale') : '';
  const tipoLinea = get('tipoLinea');
  // Atribución (docs/MEDICION.md §8): UTM, click IDs y la página donde
  // entró. Las claves van tal cual como rótulo de la fila, así que solo
  // pasan las que tienen forma de parámetro; los valores se escapan abajo.
  const utm =
    body.utm && typeof body.utm === 'object' && !Array.isArray(body.utm)
      ? Object.entries(body.utm as Record<string, unknown>)
          .filter((e): e is [string, string] => /^[a-z0-9_]{1,32}$/.test(e[0]) && typeof e[1] === 'string' && e[1] !== '')
          .slice(0, 16)
          .map(([k, v]) => [k, v.slice(0, 200)] as [string, string])
      : [];
  const firstTouch = get('first_touch').slice(0, 500);
  // El mismo ID que lleva el evento generate_lead: cruza la conversión de
  // GA4 / Google Ads con este mail. Solo un UUID pasa.
  const leadId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(get('lead_id'))
    ? get('lead_id').toLowerCase()
    : '';

  // Honeypot: a real visitor never sees or fills this field. If it has a
  // value the request is a bot — pretend success and send nothing.
  if (website) return json(true);

  // Server-side validation mirrors the client guards.
  if (!nombre || !email || !EMAIL_RE.test(email) || !mensaje) {
    return json(false, 400);
  }

  // On Vercel the secret lives in the serverless runtime env (process.env);
  // import.meta.env covers local dev (.env). Reading both avoids Vite's
  // build-time inlining turning a runtime-only secret into `undefined`.
  const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set (check Vercel env vars + redeploy)');
    return json(false, 500);
  }

  const rows: [string, string][] = [
    ['Nombre', nombre],
    ['Email', email],
    ['Teléfono', telefono],
    ['Empresa', empresa],
    ['Industria', industria],
    ['Línea de interés', linea],
    ['Tipo de línea', tipoLinea],
    ['Origen', page ? `${page}${locale ? ` · ${locale}` : ''}` : ''],
    ...utm,
    ['Primer contacto', firstTouch],
    ['ID de lead', leadId],
  ];
  const detail = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:3px 14px 3px 0;color:#666;white-space:nowrap">${k}</td><td style="padding:3px 0"><strong>${esc(v)}</strong></td></tr>`,
    )
    .join('');
  const html = `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;font-size:15px;color:#1a1a1a;line-height:1.5">
      <h2 style="margin:0 0 14px;font-size:18px">Nueva consulta web</h2>
      <table style="border-collapse:collapse;margin-bottom:18px">${detail}</table>
      <div style="color:#666;margin-bottom:6px">Mensaje</div>
      <div style="white-space:pre-wrap;border-left:3px solid #ddd;padding:2px 0 2px 14px">${esc(mensaje)}</div>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: 'Web Trans-Fil <web@transfil.com.ar>',
      to: 'ventas@transfil.com.ar',
      replyTo: email,
      subject: page
        ? `[${PAGE_TAG[page] ?? page}]${locale ? `[${locale}]` : ''} Consulta web — ${empresa || nombre}`
        : `Nueva consulta web · ${linea || 'General'} — ${nombre}`,
      html,
    });
    if (error) {
      console.error('[contact] Resend error:', error, leadId ? `lead ${leadId}` : '');
      return json(false, 500);
    }
    // Sin datos personales: alcanza para cruzar el log con el mail.
    console.log('[contact] sent', leadId || '(sin lead_id)', page || 'home');
    return json(true);
  } catch (err) {
    console.error('[contact] send failed:', err);
    return json(false, 500);
  }
};
