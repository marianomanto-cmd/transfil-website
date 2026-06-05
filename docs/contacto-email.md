# Formulario de contacto — Email (Resend + Vercel)

Cómo está configurado el envío de mails del formulario de contacto del sitio.

## Flujo
`src/components/ContactSection.tsx` → `POST /api/contact` (función serverless en
Vercel, `src/pages/api/contact.ts`) → envía el mail con **Resend** a
`ventas@transfil.com.ar`.

- **from:** `Web Trans-Fil <web@transfil.com.ar>`
- **to:** `ventas@transfil.com.ar`
- **reply-to:** el email del visitante (se responde directo desde la casilla)
- **honeypot:** campo oculto `website`; si llega con valor, se descarta (bot)
- **dataLayer:** al envío exitoso dispara `{ event: 'generate_lead', linea }` para GTM/GA4

## Key events (GTM / GA4)

El código empuja estos eventos al `dataLayer`; en GTM se capturan con triggers de
*Custom Event* (mismo nombre) y se envían a GA4 como key events.

| Evento | Cuándo se dispara | Params |
|---|---|---|
| `generate_lead` | Envío exitoso del formulario de contacto | `linea` |
| `click_whatsapp` | Clic en cualquier link de WhatsApp (FAB, footer, contacto) | `link_url` |
| `click_phone` | Clic en cualquier link `tel:` (footer, contacto) | `link_url` |

Los clics se capturan con un listener delegado en `document` (en `src/layouts/Base.astro`),
así que cubren todos los links actuales y futuros. Para **dispararlos a mano** y verificarlos
en GTM Preview / GA4 DebugView, pegá en la consola del navegador (en producción):

```js
dataLayer.push({ event: 'generate_lead', linea: 'test' });
dataLayer.push({ event: 'click_whatsapp', link_url: 'test' });
dataLayer.push({ event: 'click_phone', link_url: 'test' });
```

## Variable de entorno — el secreto NO va en el repo

| Variable | Dónde | Valor |
|---|---|---|
| `RESEND_API_KEY` | **Vercel** → Settings → Environment Variables (Production) | `re_…` |
| `RESEND_API_KEY` | **`.env` local** (está en `.gitignore`) | el mismo `re_…` |

> ⚠️ La API key **no se commitea**. Se obtiene en **resend.com → API Keys** y vive
> solo en Vercel y en el `.env` local. Si se pierde o se filtra, se genera una nueva
> en Resend y se actualiza en Vercel (Settings → Environment Variables → editar →
> Redeploy). El código la lee con `import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY`.

## Resend — dominio verificado

- Dominio: **`transfil.com.ar`** · región de envío: **`sa-east-1`** (São Paulo)

### Registros DNS cargados para la verificación

| Type | Name / Host | Value | Priority |
|---|---|---|---|
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3f78axsnuaQzvPSnU5FfuxPC1j3/7w7eUwPMrvLTpXjOeNUkR08RuJm4ytlw51BR3IaF+kN2rjdrLbQ7mSJ4O+WoPN3U/SHwhN7tX9hr23AEsPsQ63zbU7lJ42GtfQ1HRLM1RMqOzd7gPqJlF8khhuYJGDhxZZmenBSTW8xHwbwIDAQAB` | — |
| MX | `send` | `feedback-smtp.sa-east-1.amazonses.com` | 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | — |

> Resend usa el subdominio `send` y el selector DKIM `resend._domainkey`, así que
> **no afecta al correo existente** de `@transfil.com.ar`. Estos registros son
> públicos por naturaleza (DKIM/SPF/MX), por eso sí se pueden versionar acá.

## Probar el envío

1. Confirmar que `RESEND_API_KEY` está en Vercel (Production) y hacer **Redeploy**.
2. Enviar el formulario en `https://www.transfil.com.ar`.
3. Debe llegar el mail a `ventas@transfil.com.ar` (con Reply-To del visitante).
4. Si falla: **Vercel → Deployments → último → Logs**, buscar la línea `[contact] …`:
   - `RESEND_API_KEY is not set` → falta la key / faltó Redeploy.
   - `Resend error: …domain is not verified` → el DNS todavía no verificó.
   - `Resend error: …API key is invalid` → key mal copiada.

## Reenvío interno de ventas@ (Google Workspace)

Todo lo que llega a `ventas@transfil.com.ar` se **copia automáticamente a 3
casillas internas** del equipo, y además **conserva la copia en ventas@**.

- **Dónde se configura:** Google Admin (`admin.google.com`) → Apps → Google
  Workspace → **Settings for Gmail → Routing** → regla **«Reenvío ventas@ → equipo»**.
- **Cómo está armada la regla:**
  - *Email messages to affect:* **Inbound** + **Internal - Receiving**.
  - *Action:* **Modify message → Also deliver to** con las 3 casillas.
  - *Envelope filter:* **Only affect specific envelope recipients → Exactly matches**
    `ventas@transfil.com.ar` (así la regla afecta solo lo dirigido a esa casilla,
    no al resto del dominio).
- **Para agregar/quitar destinatarios:** editar esa misma regla de Routing.
- No depende del sitio ni de Resend; es configuración del correo de Workspace.
