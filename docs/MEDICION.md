# Medición del sitio completo

Qué mide el sitio, cómo sale cada evento y qué hay que configurar en GTM,
GA4 y Google Ads. Vale para **todas las páginas y los tres idiomas** (home,
landings y 404), no solo para `/conformado`.

---

## 1. Cómo está armado

- **GTM `GTM-PV9STD3`** en todas las páginas (`src/layouts/Base.astro`). GA4
  vive adentro del contenedor. Solo carga en `www.transfil.com.ar` o con
  `gtm_debug` en la URL (la vista previa de GTM lo agrega): los previews de
  Vercel y el entorno local no mandan nada a GA4. Tampoco carga en
  navegadores automatizados (`navigator.webdriver`), headless ni en
  rastreadores conocidos por user agent: los escáneres de links de los
  mails de prospección (que además desordenan las UTM, p. ej.
  `cebfcfddvba / email`) y los robots de Google Ads entraban como visitas
  de pocos segundos atribuidas a la campaña.
- **`window.tfTrack(evento, parámetros)`** es el único punto por donde sale
  un evento. Lo define un script en el `<head>` de `Base.astro`, **antes de
  GTM**, y le suma a cada evento la página y el idioma.
- **Cada evento lleva solo sus parámetros.** GTM fusiona todo lo que entra
  al dataLayer en un modelo de datos: un parámetro que mandó un evento
  sigue ahí para los siguientes. `tfTrack` pone en `undefined` los
  parámetros del evento anterior que el actual no trae, así ninguna
  etiqueta lee un valor viejo (antes, el `state` de un circuito del
  diagrama aparecía en los eventos del video, y `user_data` quedaba en el
  modelo). En la vista previa de GTM se ven como `clave: undefined`.
- **Contexto:** `<html data-page="home|conformado|mecanizado|404" data-locale="es|en|pt">`.
  Con View Transitions Astro copia los atributos del `<html>` nuevo al
  navegar, así que el contexto siempre es el de la página que se ve. El
  script además empuja `{ page, locale }` solo (sin evento) antes de que
  cargue GTM, para que la configuración de GA4 ya lo tenga en el primer
  `page_view`.
- **Un listener delegado** en `document` (fase de captura) cubre todo link
  actual y futuro: WhatsApp, teléfono, mail, redes sociales, cambio de
  idioma y CTAs con `data-cta`. También escucha cuándo se copia el mail o
  el teléfono y cuándo se abre un `<details>` (preguntas frecuentes). No
  hay que tocar componentes para links nuevos.
- **Atribución:** el mismo script guarda en `localStorage` (`tf_attr`) las
  UTM y los click IDs con que llega cada visita, como último contacto y,
  si no había, como primero. Duran 90 días. El formulario los manda al
  mail de ventas aunque la URL ya no los tenga (§8).
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
| `generate_lead` | Formulario enviado **y confirmado por el servidor**. Nunca con el honeypot lleno (el servidor responde ok sin mandar el mail) | `lead_id`, `lead_type=form`, `linea`, `industria`, `tipo_linea` (landings), `user_data` | **Conversión principal** |
| `whatsapp_click` | Clic en cualquier link de WhatsApp (FAB, hero, formulario, footer…). Una vez por clic | `lead_type=whatsapp`, `cta_location`, `link_url` | **Conversión principal**. En **GA4** se llama `click_whatsapp`: así lo manda *GA4 - WhatsApp* al recibir `whatsapp_click` (§3 paso 3) |
| `click_phone` | Clic en `tel:` | `cta_location`, `link_url` | Conversión secundaria |
| `email_click` | Clic en `mailto:` | `cta_location`, `link_url` | Conversión secundaria |
| `contact_copy` | Copia el mail o el teléfono de ventas (selección de 200 caracteres o menos que lo contiene). No manda el texto | `method` (`email` / `phone`), `cta_location` | Conversión secundaria: en desktop mucha gente copia el mail en vez de hacer clic |
| `cta_click` | Clic en un CTA con `data-cta` | `cta`, `cta_location`, `link_url` | Micro-conversión |
| `social_click` | Clic en un link a LinkedIn, Instagram, Facebook, YouTube, TikTok o X | `network`, `cta_location`, `link_url` | Interés. Reemplaza a *GA4 - LinkedIn* (§3, v2) |
| `form_start` | Primer foco en el formulario (una vez) | — | Embudo |
| `form_error` | Validación, error del servidor o de red | `error_type` (`validation` / `send` / `network`), `error_fields`, `status` | Calidad del formulario |
| `form_abandon` | Empezó el formulario y se va (cierra, recarga o navega con View Transitions) sin un envío confirmado. Una vez por formulario | `last_field`, `fields_filled` | Embudo. Es un piso: algún navegador móvil cierra la pestaña sin avisar |
| `catalog_open` | Abre un catálogo PDF | `catalog`, `file_name`, `view` (`visor` / `pestana`) | Interés |
| `catalog_download` | Descarga desde el visor | `catalog`, `file_name` | Interés |
| `content_open` | Abre una pregunta frecuente, una tecnología (home), una tarjeta de aplicación (home, móvil) o una pestaña de industrias. Una vez por ítem y por página; la pestaña que ya está abierta al cargar no cuenta | `component`, `item`, `label` | Interés: qué preguntas, tecnologías y aplicaciones miran |
| `language_switch` | Cambio de idioma en el header | `from_locale`, `to_locale` | Navegación |
| `section_view` | Una sección con `id` entra al 60 % superior de la pantalla (una vez por página) | `section` | Lectura |
| `diagram_interaction` | Video de la central en /conformado (`item`: `play`, capítulo `F01`…`F04` o `inicio`, `50%`, `complete`; una vez cada uno) o circuito del diagrama de máquinas | `diagram` (`central` / `maquinas`), `item`, `state` (solo circuitos) | Interés técnico |
| `page_not_found` | Carga del 404, directa o con View Transitions | `missing_path`, `referrer`, `referrer_type` (`interno` / `externo` / `directo`) | Links rotos |

### Valores que conviene conocer

- **`cta`:** `contacto` (home → formulario), `relevamiento` (landing →
  formulario), `tecnologias` (hero del home), `ver_solucion` (home o footer →
  landing), `whatsapp` (links de WhatsApp de las landings: salen como
  `whatsapp_click`, no como `cta_click`), `volver_inicio` (los tres links
  del 404).
- **`cta_location`:** `header`, `footer`, `fab`, `hero`, `404`, o el `id` de
  la sección que contiene el link (`contact`, `contacto`, `applications`,
  …). Una zona se puede nombrar a mano con `data-track-zone="…"`.
- **`lead_id`** (solo en `generate_lead`): UUID v4 nuevo en cada envío. El
  mismo va al mail de ventas (fila *ID de lead*) y a los logs de Vercel
  (`[contact] sent <lead_id> <página>`). Sirve para cruzar una conversión
  con su mail, como ID de transacción en Google Ads (evita contar dos
  veces el mismo lead) y como ID de pedido en la importación offline (§5).
- **`content_open`:** `component` = `faq` (landings), `tecnologia` (home),
  `aplicacion` (home, tarjetas en móvil) o `industria` (pestañas del
  home). `item` = `q01`, `q02`… en las preguntas (la posición en la
  lista: las cuatro primeras son las mismas en los tres idiomas, después
  cambian porque EN tiene preguntas propias; para cruzar idiomas mirá
  `label` junto con `locale`), el `id` de la tecnología, `app-a01`… en las
  aplicaciones y `steel` / `auto` / `tools` en industrias. `label` = el
  texto visible (pregunta, título o pestaña), hasta 100 caracteres.
- **`form_abandon`:** `last_field` = último campo que tocó (`name`,
  `company`, `email`, `phone`, `industry`, `linea`, `line-type`, `message`
  o `ninguno`); `fields_filled` = los campos de texto con algo escrito,
  separados por coma (`name,email`), o `ninguno`. Nunca los valores.
- **`page_not_found`:** `missing_path` = la ruta pedida, sin la query (que
  puede traer datos) y hasta 100 caracteres. `referrer` = la ruta de la
  página del sitio que llevó ahí (`interno`; con View Transitions es la
  página anterior, porque `document.referrer` no cambia al navegar sin
  recargar), el dominio de afuera (`externo`) o nada (`directo`).
- **`social_click`:** `network` = `linkedin`, `instagram`, `facebook`,
  `youtube`, `tiktok`, `twitter` o `x`. Hoy el sitio solo tiene LinkedIn
  (footer).
- **`user_data`** (solo en `generate_lead`): `sha256_email_address` y, si el
  teléfono vino con código de país, `sha256_phone_number`. Normalizado como
  pide Google: sin espacios, minúsculas y, en Gmail, sin los puntos del
  usuario; teléfono en E.164.

### Ejemplos (lo que llega al dataLayer)

```js
{ event: 'generate_lead', page: 'conformado', locale: 'es', lead_id: '3f2b8c1e-9a4d-4e6f-8b2a-1c3d5e7f9a0b',
  lead_type: 'form', linea: 'Conformado de tubos', industria: 'Siderurgia', tipo_linea: '…',
  user_data: { sha256_email_address: '…', sha256_phone_number: '…' } }
{ event: 'page_not_found', page: '404', locale: 'es', missing_path: '/catalogo-viejo', referrer: 'www.google.com', referrer_type: 'externo' }
{ event: 'content_open', page: 'conformado', locale: 'pt', component: 'faq', item: 'q03', label: 'Quais contaminantes são removidos?' }
{ event: 'social_click', page: 'home', locale: 'es', network: 'linkedin', cta_location: 'footer', link_url: 'https://ar.linkedin.com/company/trans---fil' }
{ event: 'contact_copy', page: 'home', locale: 'en', method: 'email', cta_location: 'contact' }
{ event: 'form_abandon', page: 'mecanizado', locale: 'en', last_field: 'message', fields_filled: 'name,email' }
```

Más los parámetros del evento anterior en `undefined` (§1).

### Agregar un CTA o una landing nueva

- **CTA:** ponele `data-cta="nombre"` al link. Listo.
- **Landing:** no hay nada que hacer. La página nueva toma `data-page` de su
  `PageKey` y todos los eventos salen solos.
- **Algo que se abre y se cierra:** si es un `<details>`, ya sale como
  `content_open` con `component: 'faq'`. Si es otra cosa, llamá a
  `track('content_open', { component, item, label })` al abrirlo, una vez
  por ítem (ver `TechSection.tsx`). Mandá siempre los tres parámetros.

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
2. **Completar las constantes** de Google Ads: `CONST - ADS ID` (el ID de
   conversión: el número de `AW-…`, **sin** `AW-`) y
   `CONST - ADS Label Formulario` / `WhatsApp` / `Teléfono` (la etiqueta de
   cada acción). Los dos datos están en cada acción de conversión, en
   *Configuración de la etiqueta → Usar Google Tag Manager* (§5).
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

### Medición v2 (nov 2026)

**Estado (16/11/2026): hecho y publicado en la versión 18** ("Medición v2:
eventos nuevos, lead_id y errores de JS"), probado en la vista previa sin
disparar conversiones. Los pasos quedan como referencia por si hay que
rehacerlo. La versión 19 suma Microsoft Clarity (§10).

Lo que hace falta para los eventos y parámetros nuevos del §2. El
contenedor publicado (v17) ya tiene lo de arriba.

1. **Importar** [`gtm/transfil-medicion-v2.json`](./gtm/transfil-medicion-v2.json)
   igual que el primero (espacio de trabajo nuevo → **Combinar → Cambiar el
   nombre de los elementos en conflicto**). Entra en la carpeta
   *Trans-Fil · Medición v2*: 5 etiquetas de GA4 (*Página no encontrada*,
   *Contenido abierto*, *Red social*, *Copia de contacto*, *Formulario
   abandono*), 5 activadores `TR - ev …` y 10 variables `DLV - …`
   (`lead_id`, `missing_path`, `referrer`, `referrer_type`, `component`,
   `label`, `network`, `method`, `last_field`, `fields_filled`). Reusa
   `CONST - GA4 ID` y las `DLV - page` / `locale` / `item` /
   `cta_location` / `link_url` que ya existen. En la vista previa de la
   importación todo tiene que figurar como **nuevo**; si algo aparece en
   conflicto, cancelá y avisá.
2. **A mano, en etiquetas que ya existen:**
   - **ADS - Lead Formulario:** *ID de transacción* → `{{DLV - lead_id}}`.
     Google Ads no cuenta dos conversiones con el mismo ID.
   - **GA4 - Lead:** sumá el parámetro `lead_id` → `{{DLV - lead_id}}`.
   - **LinkedIn - conversión 32963617** (formulario), si algún día se usa
     la API de conversiones de LinkedIn: `event_id` → `{{DLV - lead_id}}`
     para deduplicar. Sin la API no hace falta.
   - **GA4 - LinkedIn** (`click_linkedin`, activador *Solo enlaces* de
     `linkedin.com`): pausala. `social_click` con `network: linkedin` la
     reemplaza y además trae página, idioma y zona. Antes, fijate en GA4
     que `click_linkedin` no sea un evento clave ni lo use un público; si
     querés la serie histórica, dejala un mes en paralelo y después
     pausala.
3. **Verificar que nada escuche `click_whatsapp`:** el sitio ya no empuja
   ese evento (cada WhatsApp sale una sola vez, como `whatsapp_click`).
   Buscá `click_whatsapp` en *Activadores*: no tiene que haber ninguno de
   tipo *Evento personalizado*. El nombre de evento de **GA4** de la
   etiqueta *GA4 - WhatsApp* sigue siendo `click_whatsapp`; eso no se toca.
4. **Errores de JavaScript (opcional):** si se quieren ver en GA4, no hace
   falta código: activador nativo *Error de JavaScript* con la condición
   *Error URL contiene `transfil.com.ar`* (así quedan afuera las
   extensiones) y una etiqueta de evento de GA4 `js_error` con
   `{{Error Message}}`, `{{Error URL}}` y `{{Error Line}}` (variables
   integradas, hay que activarlas).
5. **Vista previa** (§6) y **Publicar**. El orden con el deploy del sitio
   no importa: una etiqueta de un evento que todavía no sale no dispara, y
   `{{DLV - lead_id}}` vacío solo deja la conversión sin ID de transacción.

---

## 4. GA4

**Estado de la propiedad *Trans Fil - GA4* (311977639), al 16/11/2026:**

| Ajuste | Valor |
|---|---|
| Retención de datos de eventos | 14 meses (antes 2: las Exploraciones perdían la historia) |
| Search Console | Vinculada con `sc-domain:transfil.com.ar` |
| Google Ads | Vinculada con *Transfil* 607-988-5280 (y una cuenta vieja 182-210-7233 de 2022) |
| Eventos clave | `generate_lead` (cada evento), `click_whatsapp` y `click_phone` (una vez por sesión). `purchase` figura porque GA4 no deja desmarcarlo, pero no recibe datos |
| Filtro *Internal Traffic* | **Activo**: excluye `traffic_type = internal` (cookie `tf_internal`, se marca con `?interno=1`) |
| Públicos *More than 2 minutes* / *Visited more than 2 pages* | Sin activador de público: los eventos `more_than_2_minutes` y `visited_more_than_2_pages` creaban sesiones fantasma sin página ni hostname |
| Medición mejorada | Vistas de página (con cambios del historial), desplazamientos, clics salientes, búsqueda, video y descargas: encendidos. Interacciones con formularios: apagado |
| Dimensiones personalizadas | 26, todas las del sitio más `error_message` (*Mensaje de error JS*) |
| Señales de Google | Encendidas |
| Clarity | Vinculado (§10) |

Para que el filtro de tráfico interno funcione, **cada navegador del
equipo** tiene que abrir una vez `https://www.transfil.com.ar/?interno=1`
(dura 2 años; `?interno=0` lo borra). GA4 no tiene reglas por IP cargadas.

- **Eventos clave:** `generate_lead` y `click_whatsapp` (es el nombre con
  que *GA4 - WhatsApp* manda el evento `whatsapp_click` del sitio, §3 paso
  3). Opcional: `click_phone`, `email_click`, `contact_copy`. **No**
  `purchase` (herencia de Wix).
- **Dimensiones personalizadas** (Administrar → Definiciones
  personalizadas, alcance *Evento*): `page`, `locale`, `lead_type`, `cta`,
  `cta_location`, `linea`, `industria`, `tipo_linea`, `catalog`, `section`,
  `diagram`, `item`, `error_type`. De la v2: `component`, `label`,
  `network`, `method`, `missing_path`, `referrer`, `referrer_type`,
  `last_field`, `fields_filled` y, para buscar un lead puntual en
  Exploraciones, `lead_id` (tiene un valor por lead: en los informes
  estándar sale como *(other)*, en Exploraciones se ve bien). Sin
  registrarlas, GA4 recibe los parámetros pero no los muestra en los
  informes.
- **404:** *Informes → Interacción → Eventos → page_not_found*, con
  `missing_path` y `referrer` como dimensiones. Un `referrer_type: interno`
  es un link roto del propio sitio. El 404 además tiene título propio
  (*Página no encontrada (404) · Trans-Fil*), así que ya no se suma al
  home en el informe por título.
- **Medición mejorada:** *Vistas de página → cambios basados en el
  historial del navegador* tiene que estar **encendido** (cuenta las
  navegaciones internas). *Descargas de archivos* puede quedar, pero los
  catálogos ya salen como `catalog_open` / `catalog_download`.
  *Interacciones con formularios* conviene **apagarlo**: el sitio ya manda
  `form_start`, y el envío real es `generate_lead`.
- Si vinculás GA4 con Google Ads, **no importes** `generate_lead` de GA4
  como conversión primaria: las etiquetas de Ads ya la cuentan.

---

## 5. Google Ads

| Acción de conversión | Origen | Tipo | Conteo |
|---|---|---|---|
| Lead – Formulario | Sitio web, etiqueta `ADS - Lead Formulario` | Primaria | Una |
| Lead – WhatsApp | Sitio web, etiqueta `ADS - Lead WhatsApp` | Primaria | Una |
| Clic en teléfono | Sitio web, etiqueta `ADS - Teléfono (secundaria)` | Secundaria | Una |
| Lead calificado | Importación offline con el `gclid` del mail a ventas | Secundaria al inicio | Una |

- **Etiquetado automático** activado (Configuración de la cuenta).
- **ID de transacción:** *ADS - Lead Formulario* manda `lead_id` como ID de
  transacción (§3, v2). En la importación offline de *Lead calificado*
  usá el mismo `lead_id` del mail como *Order ID* y el `gclid` del mail
  como identificador del clic.
- **Conversiones avanzadas:** Objetivos → Configuración → activalas para
  clientes potenciales (y para la Web), método Google Tag Manager; el
  dato ya sale hasheado en `user_data`.
- El detalle de la campaña está en
  [`campanas/conformado-search.md`](./campanas/conformado-search.md) §2.

---

## 6. Verificación

Con **Vista previa** de GTM y Tag Assistant, en el home y en una landing:

- [ ] Al cargar: el dataLayer tiene `{ page, locale }` antes de `gtm.js`.
- [ ] Formulario enviado: `generate_lead` una vez, con `user_data`;
      disparan `ADS - Lead Formulario` y `GA4 - Lead`.
- [ ] Clic en WhatsApp (FAB y otro): `whatsapp_click` una vez por clic, con
      `cta_location`; disparan `ADS - Lead WhatsApp` y `GA4 - WhatsApp`.
- [ ] Navegar home → landing con "Ver solución": `cta_click` y después un
      `page_view` con `page: conformado`.
- [ ] Cambiar de idioma: `language_switch` y el `page_view` siguiente con el
      `locale` nuevo.
- [ ] Ninguna etiqueta de GA4 manda `user_data`.
- [ ] `generate_lead` trae `lead_id`, y es el mismo que la fila *ID de
      lead* del mail de prueba. *ADS - Lead Formulario* lo muestra como ID
      de transacción.
- [ ] Clic en WhatsApp: **no** aparece `click_whatsapp` en el dataLayer.
- [ ] Abrir `/ruta-que-no-existe`: `page_not_found` con
      `missing_path: '/ruta-que-no-existe'`; dispara *GA4 - Página no
      encontrada*.
- [ ] Abrir una pregunta frecuente en /conformado: `content_open` con
      `component: faq`, `item: q01`; abrirla de nuevo no repite.
- [ ] LinkedIn del footer: `social_click` con `network: linkedin`.
- [ ] Empezar el formulario y navegar a otra página: `form_abandon` antes
      del `page_view` siguiente.
- [ ] Entrar con `?utm_source=prueba&gclid=prueba`, navegar a otra página y
      mandar el formulario: el mail trae `utm_source`, `gclid` y
      `landing_page`.

Lo mismo se probó con Playwright al implementarlo: home y landing, los tres
idiomas, navegación con View Transitions, y el hash de `user_data`
comparado contra el SHA-256 esperado. La v2 sumó: `lead_id` igual en el
evento y en el cuerpo enviado a `/api/contact`, atribución guardada que
llega al mail después de navegar y en una visita posterior (primer y
último contacto), `page_not_found` directo y por View Transitions,
`content_open` (preguntas, tecnologías en desktop y móvil, aplicaciones
en móvil, industrias) sin repetir, `social_click`, `contact_copy`,
`form_abandon` (y que una isla vieja no lo repita en navegaciones
siguientes), que ningún evento herede parámetros de otro en un modelo de
datos fusionado como el de GTM, y que no haya nombre, mail, teléfono,
empresa ni mensaje en claro en el dataLayer ni en `localStorage`.

---

## 7. Privacidad

- En el dataLayer no hay mail ni teléfono en claro: solo hashes SHA-256 en
  `generate_lead`, y solo los usa la etiqueta de Google Ads. Desde la v2
  `user_data` además sale del modelo de datos de GTM en el evento
  siguiente (§1).
- `form_abandon` manda nombres de campos, nunca lo escrito;
  `contact_copy`, qué dato se copió, nunca el texto; `page_not_found`, la
  ruta sin la query y, si el origen es externo, solo el dominio.
- `localStorage` (`tf_attr`) guarda solo UTM, click IDs, la ruta de
  entrada y la fecha, 90 días. Nada del formulario.
- El sitio **no** tiene banner de consentimiento ni Consent Mode. Para
  Argentina y Latinoamérica no hace falta; si alguna vez se pauta en España
  u otro país del EEE, hay que agregarlo antes.

---

## 8. Atribución y click IDs al mail de ventas

El formulario manda al mail de ventas las UTM y los click IDs (`gclid`,
`gbraid`, `wbraid`, `fbclid`, `li_fat_id`, `msclkid`), junto con el
`lead_id` (§2). En este orden:

1. **La URL actual**, si los trae, más `landing_page` (la ruta).
2. Si no, **el último contacto guardado** en `localStorage` (`tf_attr`):
   cada vez que se carga una página con alguno de esos parámetros, el
   script de `Base.astro` guarda el juego completo con la ruta y la fecha.
   Así llegan aunque la persona haya entrado por un anuncio y escrito desde
   otra página, o vuelto otro día sin parámetros. Va con `landing_page` (la
   ruta donde entró) y `landing_date` si no fue hoy. Dura 90 días, la
   ventana de clic de Google Ads. Antes de la v2 las UTM se perdían apenas
   la persona navegaba.
3. **El primer contacto**, si es otro que el último, va en una fila aparte
   del mail (*Primer contacto*: `utm_source=… · gclid=… · /ruta · fecha`).

Si a pesar de eso falta algún click ID, lo busca en cookies:

- **Primero, una cookie con el mismo nombre del parámetro.** Es lo que
  puede dejar *UTIL - Capturar click IDs (cookie)* en GTM.
- **Después, las cookies de cada plataforma:**
  - `_gcl_aw` y `_gcl_gb` del vinculador de conversiones de Google Ads.
  - `_fbc` de Meta.
  - `_uetmsclkid` de Microsoft.

Así el `gclid` llega a ventas igual y la importación offline de "Lead
calificado" funciona. Si la etiqueta UTIL guarda las cookies con otros
nombres, hay que sumarlos en `CLICK_ID_COOKIES`
(`src/components/ContactSection.tsx`). Si se suma un parámetro a seguir,
va en `TRACKED_PARAMS` (`ContactSection.tsx`) **y** en `AP` (script de
medición de `Base.astro`).

En el servidor (`src/pages/api/contact.ts`) las claves de `utm` solo pasan
si tienen forma de parámetro (`a-z`, `0-9`, `_`): van tal cual como rótulo
de la fila del mail. El `lead_id` solo pasa si es un UUID.

---

## 9. Límites conocidos

- **El 404 sale siempre en español.** Es una página estática
  (`404.html`): `langFromPath` corre al compilar, con `/404`, y Vercel
  sirve ese archivo para cualquier ruta que no existe, también `/en/…` o
  `/pt/…`. Por eso en el 404 `locale` es siempre `es`; el idioma que
  buscaba la persona se ve en `missing_path`. Arreglarlo es elegir el
  texto en el navegador o renderizar el 404 en el servidor, no un cambio
  de medición.
- **Dominios:** `transfil.com.ar` redirige a `www.transfil.com.ar` en
  Vercel (con la ruta y la query, así que el `gclid` sobrevive) y GTM
  carga ahí. `trans-fil.com.ar` y `www.trans-fil.com.ar` también redirigen,
  pero con **307** (temporal); para SEO conviene 308 / 301 (Vercel →
  Domains).
- **Videos:** los del hero, las landings y las tecnologías son loops
  decorativos sin controles; solo el recorrido de la central lo inicia la
  persona, y ya se mide (`diagram_interaction`).
- **Scroll y tiempo:** no hay eventos propios. `section_view` dice hasta
  dónde leyó mejor que un porcentaje, GA4 suma el 90 % con la medición
  mejorada y el tiempo de interacción lo calcula GA4 solo.
- **El mapa de Google** del formulario es un iframe de otro dominio: los
  clics adentro no se pueden medir.



---

## 10. Microsoft Clarity

- Proyecto **Trans-Fil**, ID `zeosru5fyc`, en la misma cuenta de Clarity
  que el proyecto de Plasmart: son proyectos separados, cada uno con sus
  datos. Enmascarado: *Balanced* (no graba lo que se escribe en el
  formulario).
- Se carga desde GTM (versión 19), con la etiqueta *Clarity - Etiqueta*
  (*Initialization - All Pages*), y hereda los filtros de la carga de GTM:
  solo en `www.transfil.com.ar`, no en bots ni navegadores automatizados.
  Además lo bloquea el activador *EX - Tráfico interno (inicialización)*
  (cookie `tf_internal = 1`): el equipo no queda grabado.
- Cada sesión lleva las etiquetas personalizadas `page` y `locale`.
- *Clarity - Conversiones* marca en Clarity los eventos `generate_lead`,
  `whatsapp_click` y `click_phone` (`clarity('event')` y
  `clarity('upgrade')`): en *Grabaciones* se filtra por *Eventos
  personalizados* para ver solo las sesiones que terminaron en contacto, y
  esas sesiones se graban completas aunque Clarity muestree.
- Vinculado con GA4 *Trans Fil - GA4* (desde el panel de Clarity, con
  permiso de Google sobre esa propiedad sola).
- Las navegaciones con View Transitions las sigue solo: no hace falta nada
  en el código.
