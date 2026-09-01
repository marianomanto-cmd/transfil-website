# Landings de campaña e idiomas

Cómo funcionan los tres idiomas del sitio y cómo se arma una landing de
aplicación como `/conformado`. Todo en un solo lugar para que la próxima
landing (lavado, transporte, hornos) sea llenar diccionarios, no reinventar
la página.

---

## 1. Locales: `es` / `en` / `pt`

| Locale | Prefijo | `html lang` | `og:locale` | Home |
|---|---|---|---|---|
| `es` (default) | — | `es-AR` | `es_AR` | `/` |
| `en` | `/en` | `en-US` | `en_US` | `/en/` |
| `pt` | `/pt` | `pt-BR` | `pt_BR` | `/pt/` |

Las homes llevan barra final (`/en/`, `/pt/`); las landings no
(`/conformado`, `/pt/conformado`). El sitemap respeta exactamente eso para
que cada URL coincida con su propio canonical.

### Dónde vive cada cosa

| Archivo | Qué contiene |
|---|---|
| `src/i18n/routes.ts` | **Única fuente de verdad de URLs.** Lista de locales, prefijos, `htmlLang` / `ogLocale` / hreflang, y `PAGE_PATHS` con la ruta de cada página en cada idioma. |
| `src/i18n/content.ts` | Todo el copy del sitio institucional, tipado con `Content`. `CONTENT.es`, `CONTENT.en`, `CONTENT.pt`. |
| `src/i18n/landings.ts` | El copy de las landings de campaña, tipado con `LandingContent`. |

Ningún componente hardcodea un path ni una cadena visible. El switcher, el
hreflang, el canonical, el logo, el footer y el sitemap salen todos de
`routes.ts`.

### Agregar o cambiar un string

1. Si es del sitio institucional → `src/i18n/content.ts`. El tipo `Content`
   obliga a que los tres locales tengan el campo; TypeScript avisa si falta.
2. Si es de una landing → `src/i18n/landings.ts`.
3. Si es una etiqueta de chrome (skip-link, `SÍNTOMA` / `SOLUCIÓN` /
   `BENEFICIO`, `Descargar`, `Cerrar`, `COBERTURA`…) → el bloque
   `content.ui`. **Nunca** un ternario `lang === 'es' ? … : …` dentro de un
   componente: eso es lo que dejaba fragmentos en español al agregar PT.

### Agregar un locale nuevo

1. `LOCALES` y `LOCALE_META` en `routes.ts`.
2. Un prefijo por página en `PAGE_PATHS`.
3. `CONTENT.<locale>` completo en `content.ts` (el tipo te va a listar todo
   lo que falta).
4. `LANDINGS.<slug>.<locale>` para cada landing existente.
5. `src/pages/<locale>/index.astro` y `src/pages/<locale>/<slug>.astro`
   (copias de 6 líneas de las que ya están).
6. `locales` en `astro.config.mjs`, tanto en `i18n` como en el sitemap.
7. Una rama en `COPY` de `src/pages/404.astro`.

El PT es **pt-BR industrial**, no español con "ão". Glosario mínimo:
filtro de banda → *filtro de esteira* / *depurador a tecido*; conformado →
*conformação*; viruta → *cavaco*; relevamiento → *levantamento em planta*;
emulsión → *emulsão*; scrap → *sucata*; mecanizado → *usinagem*;
rectificado → *retificação*; muela → *rebolo*; husillo → *eixo-árvore*;
aceite atrapado → *óleo tramp*.

---

## 2. `/conformado` es la primera landing de aplicación

Una landing de aplicación vende **una aplicación, no la empresa**: un
proceso que el cliente ya tiene y en el que ya está perdiendo plata.

`/conformado` = filtración centralizada + separación magnética +
recuperación de aceite para líneas de conformado de tubos (ERW / HFW /
perfilado / trefilado). Es el A01 del home, expandido.

**Los ads no van al home.** Google Ads y LinkedIn apuntan a
`/conformado`, `/en/conformado` o `/pt/conformado` según el idioma de la
campaña. El home es institucional: contesta "quiénes son", no "por qué me
está subiendo el scrap". Mandar tráfico pago al home tira la conversión y
mezcla la atribución.

Redirects 301 ya configurados en `astro.config.mjs` para las URLs viejas
de campaña:

```
/filtracion-conformado-tubos  → /conformado
/filtracao-conformacao-tubos  → /pt/conformado
```

---

## 3. El patrón a repetir

El orden de la página no es decorativo. Está en
`src/layouts/LandingLayout.astro` y se repite tal cual:

| # | Bloque | Qué hace |
|---|---|---|
| — | **Above the fold** | El **síntoma**, no la empresa. Una sola `<h1>`, subtítulo con la solución en una línea, CTA primario a `#contacto` + WhatsApp con prefill propio, y tres números con su disclaimer ("rangos típicos, se cuantifican en planta"). |
| 01 | **El problema** | Síntoma / solución / beneficio. Es la tarjeta A0X del home con más aire, no copy nuevo. |
| 02 | **El sistema** | Las etapas del equipo, cada una con un asset **real** de `/img` o `/video`. |
| 03 | **Por qué acá** | Taller propio, repuestos en días, a medida del layout, integrable con el resto, equipos viejos andando, años y países. Sin nombrar competidores. |
| 04 | **Prueba** | Nombres de clientes **ya publicados en el home** (`TF_CLIENTS`). Sin logos, sin inventar referencias. |
| 05 | **Form + WhatsApp** | El `ContactSection` de siempre, con la línea prefijada y "¿preferís WhatsApp?" abajo. |
| 06 | **FAQ** | `<h2>` visible + `FAQPage` propio de esa URL (no el del home). |
| — | **Cierre** | La frase de cierre + repetición del CTA primario. |

Reglas duras:

- Una sola `<h1>` por página.
- Nada de PDFs pesados como CTA: el CTA es el relevamiento.
- Nada fuera de tema (en `/conformado` no se habla de corte láser).
- Sin fotos de stock. Solo `/img` y `/video` que ya existen en el repo.
- Sin popups, chatbots ni píxeles nuevos. GTM ya está (`GTM-PV9STD3`).

---

## 4. Roadmap — **no implementar todavía**

Mismo patrón, un slug por categoría:

| Slug | Aplicación |
|---|---|
| `/lavado` | Lavado industrial de piezas (pasante, rotativa, cabina) |
| `/transporte` | Transporte y evacuación de viruta |
| `/hornos` | Hornos y tratamiento térmico |

Cuando toque, cada una entra como una entrada más de `LANDINGS` — no hace
falta tocar `LandingLayout.astro`.

---

## 5. Receta para una landing nueva

1. **Slug.** Agregalo a `PageKey` y a `PAGE_PATHS` en `src/i18n/routes.ts`,
   con las tres rutas (`/lavado`, `/en/lavado`, `/pt/lavado`).
2. **Diccionario.** Agregá el slug a `LandingSlug` y una entrada
   `LANDINGS.<slug>` con los tres locales en `src/i18n/landings.ts`.
   `LandingContent` marca todo lo obligatorio.
3. **Assets.** Elegí de `public/img` y `public/video`. Cada uno lleva su
   `alt` real en el diccionario. Nada de stock.
4. **Páginas.** Tres wrappers de 6 líneas:

   ```astro
   ---
   import LandingLayout from '../layouts/LandingLayout.astro';
   import { CONTENT } from '../i18n/content';
   import { LANDINGS } from '../i18n/landings';
   ---
   <LandingLayout lang="es" content={CONTENT.es} landing={LANDINGS.lavado.es} />
   ```

   en `src/pages/<slug>.astro`, `src/pages/en/<slug>.astro` y
   `src/pages/pt/<slug>.astro`.
5. **WhatsApp.** El campo `whatsapp` del diccionario es el prefill de
   *todos* los links de WA de esa página (hero, form, panel lateral, FAB).
   Escribilo mencionando la landing: así ventas sabe de dónde viene el chat.
6. **OG.** `LandingLayout` pasa `ogImage` a `Base.astro`. Poné una imagen
   coherente con la aplicación (no la del transporte de viruta) y su `alt`
   propio en `meta.ogImageAlt`.
7. **FAQ.** 5–7 preguntas reales de preventa. Se convierten solas en
   `FAQPage` con el `@id` de esa URL.
8. **Sitemap.** No hay que hacer nada: `@astrojs/sitemap` toma toda página
   prerenderizada y le agrega los tres `hreflang`.
9. **GTM.** Tampoco hay que tocar nada en el código: los eventos salen con
   `page: '<slug>'`. En GTM alcanza con que el trigger de
   `generate_lead` / `whatsapp_click` lea la variable `page`.
10. **Link desde el home.** Agregá `link: { page: '<slug>', label: '…' }` a
    la tarjeta A0X correspondiente en `content.ts`, en los tres idiomas.
    Eso rinde el botón "Ver solución" en la tarjeta **y** el link en el
    footer, automáticamente.
11. **Verificá:** `npm run check && npm run build`, y que las tres URLs
    salgan con canonical propio, hreflang recíproco y una sola `<h1>`.

### Eventos que empuja una landing

```js
// solo en submit exitoso del formulario
dataLayer.push({ event: 'generate_lead', page: 'conformado', locale: 'es', lead_type: 'form' });

// en cualquier click sobre [data-cta="whatsapp"] de la landing
dataLayer.push({ event: 'whatsapp_click', page: 'conformado', locale: 'es', lead_type: 'whatsapp' });
```

Ojo en GTM: el listener global de `src/layouts/Base.astro` sigue empujando
`click_whatsapp` (con `link_url`) en **todo** link `wa.me` del sitio. En
una landing conviven los dos eventos. Usá `whatsapp_click` para la
conversión de campaña y `click_whatsapp` para el volumen general; si
configurás los dos como key event vas a contar la misma sesión dos veces.

Los CTAs llevan `data-cta="relevamiento"` y `data-cta="whatsapp"`, y la
sección de contacto de la landing es `id="contacto"` (la del home sigue
siendo `id="contact"`).

---

## 6. A dónde llegan los leads

- **Formulario** → `POST /api/contact` → Resend → **ventas@transfil.com.ar**
  (`from: web@transfil.com.ar`, `reply-to` = el visitante). Detalle de la
  configuración y DNS en [`contacto-email.md`](./contacto-email.md).
- **WhatsApp** → `wa.me/5493513820321` (+54 9 351 382-0321).

Cuando el envío viene de una landing, el mail cambia de asunto:

```
[Conformado][es] Consulta web — {empresa}
```

y el cuerpo suma tres filas: **Tipo de línea**, **Origen** (`slug · locale`)
y las **UTMs** presentes en la URL (`utm_source`, `utm_medium`,
`utm_campaign`, `utm_term`, `utm_content`, `gclid`, `gbraid`, `wbraid`,
`fbclid`, `li_fat_id`).

Sin `page` — o sea, desde el home — el asunto y el cuerpo son exactamente
los de siempre (`Nueva consulta web · {línea} — {nombre}`). El mailer es
uno solo: **no agregues otro**.

---

## 7. Reglas de assets

- Solo imágenes y videos que ya están en `public/img` y `public/video`.
  Son equipos Trans-Fil reales.
- **Nada de stock photos.** Si no hay asset propio para algo, se cambia el
  bloque, no se compra una foto genérica.
- Los videos de las etapas se cargan recién cuando entran en viewport
  (`data-src` + IntersectionObserver en `LandingLayout.astro`). No le
  saques ese gating a una landing de pauta.
- Toda imagen lleva `width` / `height` y `alt` real desde el diccionario.
