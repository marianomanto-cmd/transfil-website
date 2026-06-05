import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// On-demand route: keeps the rest of the site static while this endpoint
// runs as a Vercel serverless function.
export const prerender = false;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Escape user input before interpolating into the email HTML.
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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

  // Honeypot: a real visitor never sees or fills this field. If it has a
  // value the request is a bot — pretend success and send nothing.
  if (website) return json(true);

  // Server-side validation mirrors the client guards.
  if (!nombre || !email || !EMAIL_RE.test(email) || !mensaje) {
    return json(false, 400);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set');
    return json(false, 500);
  }

  const rows: [string, string][] = [
    ['Nombre', nombre],
    ['Email', email],
    ['Teléfono', telefono],
    ['Empresa', empresa],
    ['Industria', industria],
    ['Línea de interés', linea],
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
      subject: `Nueva consulta web · ${linea || 'General'} — ${nombre}`,
      html,
    });
    if (error) {
      console.error('[contact] Resend error:', error);
      return json(false, 500);
    }
    return json(true);
  } catch (err) {
    console.error('[contact] send failed:', err);
    return json(false, 500);
  }
};
