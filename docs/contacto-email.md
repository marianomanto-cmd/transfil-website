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
- **dataLayer:** al envío exitoso dispara `generate_lead` con un `lead_id` (UUID)
- **ID de lead:** el mismo `lead_id` va en el mail (fila *ID de lead*) y en el log de
  Vercel (`[contact] sent <lead_id> <página>`), para cruzar la conversión con el mail
- **Atribución:** UTM, click IDs, página de entrada y primer contacto, aunque la persona
  haya navegado o vuelto otro día (ver [`MEDICION.md`](./MEDICION.md) §8)

## Eventos (GTM / GA4)

El catálogo completo de eventos, parámetros y la configuración de GTM / GA4 / Google
Ads está en [`MEDICION.md`](./MEDICION.md). Todos salen por `window.tfTrack`
(`src/layouts/Base.astro`). Para **dispararlos a mano** y verificarlos en GTM Preview /
GA4 DebugView, pegá en la consola del navegador (en producción, o con `?gtm_debug=x`):

```js
tfTrack('generate_lead', { lead_id: crypto.randomUUID(), lead_type: 'form', linea: 'test' });
tfTrack('whatsapp_click', { lead_type: 'whatsapp', cta_location: 'test', link_url: 'test' });
tfTrack('click_phone', { cta_location: 'test', link_url: 'test' });
```

> Ojo: `generate_lead` y `whatsapp_click` disparan también las conversiones de Google Ads
> y LinkedIn. Probalos con `?interno=1` (marca el tráfico como interno en GA4) y, para
> Google Ads, mejor con la vista previa de Tag Assistant sin publicar.

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
