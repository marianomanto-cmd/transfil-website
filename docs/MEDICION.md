# Medición del sitio completo

Qué mide el sitio, cómo sale cada evento y qué hay que configurar en GTM,
GA4 y Google Ads. Vale para **todas las páginas y los tres idiomas** (home,
landings y 404), no solo para `/conformado`.

---

## 1. Cómo está armado

- **GTM `GTM-PV9STD3`** en todas las páginas (`src/layouts/Base.astro`). GA4
  vive adentro del contenedor.
- **`window.tfTrack(evento, parámetros)`** es el único punto por donde sale
  un evento. Lo define un script en el `<head>` de `Base.astro`, **antes de
  GTM**, y le suma a cada evento la página y el idioma.
- **Contexto:** `<html data-page="home|conformado|404" data-locale="es|en|pt">`.
  Con View Transitions Astro copia los atributos del `<html>` nuevo al
  navegar, así que el contexto siempre es el de la página que se ve. El
  script además empuja `{ page, locale }` solo (sin evento) antes de que
  cargue GTM, para que la configuración de GA4 ya lo tenga en el primer
  `page_view`.
- **Un listener delegado** en `document` (fase de captura) cubre todo link
  actual y futuro: WhatsApp, teléfono, mail, cambio de idioma y CTAs con
  `data-cta`. No hay que tocar componentes para links nuevos.
- Los componentes React usan `track()` de `src/lib/track.ts`; los scripts de
  `/public/js` (los 3D) llaman a `window.tfTrack` directo.
- Las navegaciones internas las cuenta GA4 solo, con la medición mejorada
  (§3, *Páginas vistas*).

**Ningún dato personal en claro llega al dataLayer.** Mail y teléfono del
formulario viajan solo hasheados (SHA-256) y solo para Google Ads (§5).

---

## 2. Eventos

Todos llevan **`page`** y **`locale`**.

| Evento | Cuándo sale | Parámetros propios | Uso |
|---|---|---|---|
| `page_view` | Navegación interna con View Transitions. Sin etiqueta: GA4 ya las cuenta con la medición mejorada (§3) | `page_path`, `page_title`, `page_location` | Respaldo |
| `generate_lead` | Formulario enviado **y confirmado por el servidor** | `lead_type=form`, `linea`, `industria`, `tipo_linea` (landings), `user_data` | **Conversión principal** |
| `whatsapp_click` | Clic en cualquier link de WhatsApp (FAB, hero, formulario, footer…) | `lead_type=whatsapp`, `cta_location`, `link_url` | **Conversión principal** |
| `click_whatsapp` | El mismo clic | `link_url` | Legado: **no** marcar como conversión |
| `click_phone` | Clic en `tel:` | `cta_location`, `link_url` | Conversión secundaria |
| `email_click` | Clic en `mailto:` | `cta_location`, `link_url` | Conversión secundaria |
| `cta_click` | Clic en un CTA con `data-cta` | `cta`, `cta_location`, `link_url` | Micro-conversión |
| `form_start` | Primer foco en el formulario (una vez) | — | Embudo |
| `form_error` | Validación, error del servidor o de red | `error_type` (`validation` / `send` / `network`), `error_fields`, `status` | Calidad del formulario |
| `catalog_open` | Abre un catálogo PDF | `catalog`, `file_name`, `view` (`visor` / `pestana`) | Interés |
| `catalog_download` | Descarga desde el visor | `catalog`, `file_name` | Interés |
| `language_switch` | Cambio de idioma en el header | `from_locale`, `to_locale` | Navegación |
| `section_view` | Una sección con `id` entra al 60 % superior de la pantalla (una vez por página) | `section` | Lectura |
| `diagram_interaction` | Etapa de la central 3D (una vez por etapa) o circuito del diagrama de máquinas | `diagram` (`central` / `maquinas`), `item`, `state` | Interés técnico |

### Valores que conviene conocer

- **`cta`:** `contacto` (home → formulario), `relevamiento` (landing →
  formulario), `tecnologias` (hero del home), `ver_solucion` (home o footer →
  landing).
- **`cta_location`:** `header`, `footer`, `fab`, `hero`, o el `id` de la
  sección que contiene el link (`contact`, `contacto`, `applications`, …).
  Una zona se puede nombrar a mano con `data-track-zone="…"`.
- **`user_data`** (solo en `generate_lead`): `sha256_email_address` y, si el
  teléfono vino con código de país, `sha256_phone_number`. Normalizado como
  pide Google: sin espacios, minúsculas y, en Gmail, sin los puntos del
  usuario; teléfono en E.164.

### Agregar un CTA o una landing nueva

- **CTA:** ponele `data-cta="nombre"` al link. Listo.
- **Landing:** no hay nada que hacer. La página nueva toma `data-page` de su
  `PageKey` y todos los eventos salen solos.

---

## 3. GTM (`GTM-PV9STD3`, cuenta Trans Fil 6001675203)

### Lo que ya tiene el contenedor (revisado en oct 2026)

| Elemento | Estado | Qué hacer |
|---|---|---|
| GA4 - Google Tag (config) · *Initialization - All Pages* | Bien | Nada |
| GA4 - Lead · `TR - Form success` (evento personalizado) | Bien si el activador escucha **`generate_lead`** | Verificar el nombre del evento; sumar parámetros (paso 3) |
| GA4 - WhatsApp · `TR - WhatsApp` (clic en link `wa.me`) | Cuenta, pero sin página, idioma ni botón | Pasar al evento `whatsapp_click` (paso 3) |
| GA4 - Teléfono · `TR - Teléfono` (clic en link `tel:`) | Ídem | Pasar al evento `click_phone` (paso 3) |
| GA4 - LinkedIn · `TR - Linkedin` | Bien | Nada |
| UTIL - Capturar click IDs (cookie) | Bien | Nada; el formulario ya lee esas cookies (§8) |
| Envío de Formulario de Contacto / Envío de formulario / Instagram | Sin etiquetas desde hace años; los de *Form Submission* no funcionan con el formulario actual (envía por `fetch`) | Borrar |
| Google Ads | **No existe** | Importar (paso 1) |

### Pasos

1. **Importar** [`gtm/transfil-medicion.json`](./gtm/transfil-medicion.json):
   Administrar → *Importar contenedor* → espacio de trabajo nuevo →
   **Combinar → Cambiar el nombre de los elementos en conflicto** (nunca
   "Reemplazar"). Entra todo en la carpeta *Trans-Fil · Medición del
   sitio*: 13 etiquetas, 12 activadores (`TR - ev …`) y 24 variables. Está
   hecho a medida: reusa `CONST - GA4 ID` y `DLV - linea` y no toca ninguna
   etiqueta existente.
2. **Completar las constantes** de Google Ads: `CONST - ADS ID` (el número
   de la cuenta, **sin** `AW-`) y `CONST - ADS Label Formulario` /
   `WhatsApp` / `Teléfono` (la etiqueta de cada acción de conversión, §5).
3. **Ajustar a mano las tres etiquetas de GA4 que ya existen.** Se
   conserva el nombre de evento que ya usan en GA4, así los informes no se
   cortan:
   - **GA4 - Lead:** activador → `TR - ev generate_lead` (o dejá
     `TR - Form success` si ya escucha `generate_lead`). Parámetros: sumá
     `page`, `locale`, `lead_type`, `industria`, `tipo_linea` con sus
     variables `DLV - …`; `linea` ya está.
   - **GA4 - WhatsApp:** activador `TR - WhatsApp` → `TR - ev
     whatsapp_click`. Parámetros: `page`, `locale`, `cta_location`.
   - **GA4 - Teléfono:** activador `TR - Teléfono` → `TR - ev click_phone`.
     Parámetros: `page`, `locale`, `cta_location`.
   - Después borrá `TR - WhatsApp` y `TR - Teléfono`, que quedan sin uso.
     **No** dejes las dos versiones activas: cada clic contaría dos veces.
4. **Borrar** los activadores viejos: *Envío de Formulario de Contacto*,
   *Envío de formulario*, *Instagram*.
5. **Conversiones avanzadas:** en *ADS - Lead Formulario* tildá *Incluir
   datos proporcionados por el usuario* → variable nueva *Datos
   proporcionados por el usuario* → *Código* → `{{DLV - user_data}}`.
6. **Vista previa** (§6) y recién ahí **Publicar**.

Si GTM rechazara el archivo, todo se puede cargar a mano con esta tabla:

| Tipo | Nombre | Configuración |
|---|---|---|
| Etiqueta | ADS - Vinculador de conversiones | *All Pages* |
| Etiqueta | ADS - Lead Formulario | Seguimiento de conversiones de Google Ads · `TR - ev generate_lead` |
| Etiqueta | ADS - Lead WhatsApp | Ídem · `TR - ev whatsapp_click` |
| Etiqueta | ADS - Teléfono (secundaria) | Ídem · `TR - ev click_phone` |
| Etiqueta | GA4 - Email / CTA / Formulario inicio / Formulario error / Catálogo abierto / Catálogo descarga / Cambio de idioma / Sección vista / Diagrama 3D | Evento de GA4 con el nombre del evento del sitio (§2), ID `{{CONST - GA4 ID}}`, parámetros `page`, `locale` + los propios |
| Activador | TR - ev `<evento>` (×12) | Evento personalizado, nombre exacto |
| Variable | DLV - `<parámetro>` (×20) | Variable de capa de datos, versión 2 |
| Variable | CONST - ADS … (×4) | Constantes del paso 2 |

### Páginas vistas

No hay ni hace falta una etiqueta para `page_view`: GA4 cuenta las
navegaciones internas por su cuenta con la **medición mejorada**
(*Vistas de página → Cambios de página basados en eventos del historial
del navegador*, encendido por defecto; verificalo en el flujo de datos).
El sitio igual empuja un evento `page_view` en cada navegación por si
alguna vez se apaga esa opción; si se crea una etiqueta para él con la
opción encendida, cada vista se cuenta dos veces.

---

## 4. GA4

- **Eventos clave:** `generate_lead` y `whatsapp_click`. Opcional:
  `click_phone`, `email_click`. **No** `click_whatsapp`.
- **Dimensiones personalizadas** (Administrar → Definiciones
  personalizadas, alcance *Evento*): `page`, `locale`, `lead_type`, `cta`,
  `cta_location`, `linea`, `industria`, `tipo_linea`, `catalog`, `section`,
  `diagram`, `item`, `error_type`. Sin registrarlas, GA4 recibe los
  parámetros pero no los muestra en los informes.
- **Medición mejorada:** *Vistas de página → cambios basados en el
  historial del navegador* tiene que estar **encendido** (cuenta las
  navegaciones internas). *Descargas de archivos* puede quedar, pero los
  catálogos ya salen como `catalog_open` / `catalog_download`.
- Si vinculás GA4 con Google Ads, **no importes** `generate_lead` de GA4
  como conversión primaria: las etiquetas de Ads ya la cuentan.

---

## 5. Google Ads

| Acción de conversión | Origen | Tipo | Conteo |
|---|---|---|---|
| Lead – Formulario | Sitio web, etiqueta "Ads - Conversión Formulario" | Primaria | Una |
| Lead – WhatsApp | Sitio web, etiqueta "Ads - Conversión WhatsApp" | Primaria | Una |
| Clic en teléfono | Sitio web, etiqueta "Ads - Conversión Teléfono" | Secundaria | Una |
| Lead calificado | Importación offline con el `gclid` del mail a ventas | Secundaria al inicio | Una |

- **Etiquetado automático** activado (Configuración de la cuenta).
- **Conversiones avanzadas para leads:** activalas en cada acción del
  sitio; el dato ya sale hasheado en `user_data`.
- El detalle de la campaña está en
  [`campanas/conformado-search.md`](./campanas/conformado-search.md) §2.

---

## 6. Verificación

Con **Vista previa** de GTM y Tag Assistant, en el home y en una landing:

- [ ] Al cargar: el dataLayer tiene `{ page, locale }` antes de `gtm.js`.
- [ ] Formulario enviado: `generate_lead` una vez, con `user_data`;
      disparan "Ads - Conversión Formulario" y "GA4 - generate_lead".
- [ ] Clic en WhatsApp (FAB y otro): `whatsapp_click` una vez por clic, con
      `cta_location`; dispara "Ads - Conversión WhatsApp".
- [ ] Navegar home → landing con "Ver solución": `cta_click` y después un
      `page_view` con `page: conformado`.
- [ ] Cambiar de idioma: `language_switch` y el `page_view` siguiente con el
      `locale` nuevo.
- [ ] Ninguna etiqueta de GA4 manda `user_data`.

Lo mismo se probó con Playwright al implementarlo: home y landing, los tres
idiomas, navegación con View Transitions, y el hash de `user_data`
comparado contra el SHA-256 esperado.

---

## 7. Privacidad

- En el dataLayer no hay mail ni teléfono en claro: solo hashes SHA-256 en
  `generate_lead`, y solo los usa la etiqueta de Google Ads.
- El sitio **no** tiene banner de consentimiento ni Consent Mode. Para
  Argentina y Latinoamérica no hace falta; si alguna vez se pauta en España
  u otro país del EEE, hay que agregarlo antes.

---

## 8. Click IDs al mail de ventas

El formulario manda al mail de ventas las UTM y los click IDs (`gclid`,
`gbraid`, `wbraid`, `fbclid`, `li_fat_id`, `msclkid`). Si la URL ya no los
tiene, porque la persona entró por un anuncio y escribió desde otra página
o volvió otro día, los busca en cookies:

- **Primero, una cookie con el mismo nombre del parámetro.** Es lo que
  puede dejar *UTIL - Capturar click IDs (cookie)* en GTM.
- **Después, las cookies de cada plataforma:**
  - `_gcl_aw` y `_gcl_gb` del vinculador de conversiones de Google Ads.
  - `_fbc` de Meta.
  - `_uetmsclkid` de Microsoft.

Así el `gclid` llega a ventas igual y la importación offline de "Lead
calificado" funciona. Si la etiqueta UTIL guarda las cookies con otros
nombres, hay que sumarlos en `CLICK_ID_COOKIES`
(`src/components/ContactSection.tsx`).

