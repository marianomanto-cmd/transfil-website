# Handoff: Trans-Fil — Sitio Institucional (Single-Page)

> **Idioma del documento:** español. El código y los nombres de clase están en inglés.
> **Audiencia:** desarrollador/a que implementará este diseño en un codebase real usando Claude Code.

---

## 1. Overview

Trans-Fil S.R.L. es una empresa de **maquinaria industrial** de Córdoba, Argentina (fundada en 1989), especializada en transporte de viruta, filtración de refrigerantes, lavado industrial y maquinaria de corte para la industria metalúrgica y automotriz.

Este es el rediseño completo de su sitio: una **single-page** institucional, bilingüe (ES/EN), con estética **industrial oscura** ("sobrio, industrial, moderno"). El sitio presenta las líneas de producto, permite descargar catálogos en PDF, muestra el proceso de trabajo, clientes, historia y un formulario de contacto.

La navegación es por anclas con scroll suave. Hay un panel de "Tweaks" (solo herramienta de diseño/preview) que permite alternar variantes — **no es parte del producto final**, ver §11.

---

## 2. Sobre los archivos de este bundle

⚠️ **Los archivos HTML/CSS/JSX de este bundle son REFERENCIAS DE DISEÑO**, no código de producción para copiar y pegar. Son un prototipo de alta fidelidad construido en React + Babel standalone (transpilado en el browser) que muestra el aspecto y comportamiento **exactos** que debe tener el sitio.

**La tarea es recrear este diseño en el entorno del codebase destino** (Next.js, Astro, Vite + React, Vue, WordPress, etc.), usando sus patrones y librerías establecidos. Si no existe un entorno todavía, elegí el framework más apropiado — para un sitio institucional estático bilingüe **recomiendo Astro o Next.js (static export)** por SEO y performance.

El prototipo usa `<script type="text/babel">` y JSX inline solo porque es la forma de prototipar rápido en este entorno; **no replicar ese setup en producción.**

---

## 3. Fidelidad

**Alta fidelidad (hi-fi).** Colores, tipografía, espaciado, animaciones e interacciones son finales y deben recrearse **pixel-perfect**. Este documento + los archivos CSS son la fuente de verdad. Ante cualquier duda de medida/color/timing, leer `styles.css`.

---

## 4. Imágenes — IMPORTANTE

🔴 **El cliente irá entregando las imágenes y videos DEFINITIVOS de cada sección/página a medida que avance el desarrollo y se vayan necesitando.** No usar las imágenes actuales como definitivas.

Las imágenes que están hoy en `/img/` son **placeholders de trabajo** (stock + algunas fotos reales que el cliente subió). Sirven para validar el layout y los recortes, pero serán reemplazadas. Implementar los componentes de imagen de forma que **cambiar el `src` sea trivial** (idealmente un mapa de assets central o un CMS/JSON).

Consideraciones al integrar las imágenes finales:
- Usar `<picture>` con sources responsive (crop más ajustado al sujeto en mobile — ver §9 "recorte").
- Mantener `object-fit: cover` y permitir `object-position` configurable por imagen.
- `loading="lazy"` en todo lo que no sea el hero.
- El hero admite **foto o video loop**; hoy es foto. Si el cliente entrega un video del HF welder, la variante "video" del hero ya está contemplada (§6).
- Generar un `og-image.jpg` **1200×630** dedicado para previews sociales.

Assets actuales en `/img/` (placeholders): `hf-welder.png` (hero actual + paso 01 proceso), `welding-line.avif`, `conveyor-blue.avif`, `washing-line.avif`, `hydraulic-station.avif`, `hydraulic-station-2.avif`, `control-cabinet.avif`, `gearbox-detail.avif`.

Catálogos PDF reales en `/catalogs/`: `Trans-Fil-Catalogo-General.pdf`, `Trans-Fil-Catalogo-Filtracion.pdf`, `Trans-Fil-Catalogo-Lavado.pdf`. Estos **sí son definitivos** (los entregó el cliente).

---

## 5. Design Tokens

Definidos como CSS custom properties en `:root` (ver tope de `styles.css`).

### Colores
| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#0e0e10` | Fondo principal (grafito casi negro) |
| `--bg-2` | `#15151a` | Fondo de secciones "dark", cards |
| `--bg-3` | `#1c1c22` | Hover de cards, superficies elevadas |
| `--fg` | `#f4f1ec` | Texto principal (off-white) |
| `--fg-2` | `#c9c6c0` | Texto secundario |
| `--fg-3` | `#8a8780` | Texto terciario / labels |
| `--fg-4` | `#4d4a45` | Texto muy tenue / placeholders |
| `--line` | `#2a2a2e` | Hairlines, bordes |
| `--line-strong` | `#3a3a3f` | Bordes más marcados |
| `--accent` | `#3a86ff` | Azul industrial — CTAs, eyebrows, focus, keylines |
| `--accent-2` | `#1f4fb3` | Azul oscuro (hover) |
| `--accent-soft` | `rgba(58,134,255,0.12)` | Fondos translúcidos del acento |
| `--warn` | `#ff6b1a` | Errores de formulario (naranja) |
| Verde "activo" | `#4ade80` | Punto de status "Workshop · Active", check de form enviado |
| WhatsApp | `#25d366` / hover `#1faa53` | FAB de WhatsApp |

> **Nota:** el acento es configurable por Tweak en el prototipo, pero el valor de marca es **`#3a86ff`**. Implementar como token único reutilizado en todos lados.

### Tipografía (Google Fonts)
- **Display:** `'Space Grotesk'`, pesos 400/500/600/700. Titulares, h2, h3, stats, botones.
- **Body:** `'Inter'`, pesos 400/500/600. Párrafos, descripciones, inputs.
- **Mono:** `'JetBrains Mono'`, pesos 400/500/600. Labels técnicos, códigos (`T01`, `/01`), eyebrows, datos.

Import actual:
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

Escala (todas con `clamp()` para fluid type):
- Display hero: `clamp(44px, 11vw, 180px)`, line-height `0.92`, letter-spacing `-0.035em`, weight 500
- h2 sección: `clamp(36px, 5vw, 64px)`, line-height `1.04`, letter-spacing `-0.02em`, weight 500
- h3: `clamp(24px, 2.4vw, 32px)`, weight 500
- Eyebrow (mono): `11px`, letter-spacing `0.12em`, uppercase, color `--accent`
- Body: `16px`, line-height `1.55`
- Mono label: `11px`, letter-spacing `0.08em`, uppercase

### Espaciado y layout
- Ancho máximo de contenido: `--maxw: 1440px`
- Padding horizontal: `--pad-x: clamp(20px, 4vw, 64px)`
- Gutter de grilla: `24px`
- Altura del header: `--header-h: 72px`
- Padding vertical de sección: `clamp(72px, 10vw, 140px)`

### Bordes / sombras / radios
- **El sistema es de esquinas DURAS.** `border-radius: 0` en casi todo (botones, cards, media). Excepciones: pills (`--cta-mini`, chips, tabs marquee usan `999px`), FAB de WhatsApp (`999px`), inputs no (cuadrados).
- Hairline estándar: `1px solid var(--line)`
- Sombra de cards al hover: `0 18px 40px -20px rgba(0,0,0,0.5)`
- Sombra de cards flotantes: `0 24px 48px -16px rgba(0,0,0,0.5)`

### Curva de easing maestra
**`cubic-bezier(0.2, 0.7, 0.2, 1)`** — se usa en casi todas las transiciones y reveals. Es la "firma" de movimiento del sitio: arranque rápido, desaceleración suave. Memorizarla.

---

## 6. Estructura de la página (orden de secciones)

1. **Header** (fixed) — `01` implícito
2. **Hero / Masthead** — `#top`
3. **Tecnologías** — `#tech` — `[ 02 ]`
4. **Catálogos** — `#catalogs` — `[ 03 ]`
5. **Proceso ("De la planta a la planta")** — `#process` — `[ 03/cómo trabajamos ]`
6. **Servicios ("Más allá de la entrega")** — `#services` — `[ 04 ]` — fondo dark
7. **Industrias / Clientes** — `#industries` — `[ 05 ]`
8. **Historia** — `#history` — `[ 06 ]`
9. **Contacto** — `#contact` — `[ 07 ]` — fondo dark
10. **Footer**
11. **FAB WhatsApp** (flotante, fixed)

Detalle de cada una abajo.

### Header
- Fixed top, altura 72px, fondo `rgba(14,14,16,0.6)` con `backdrop-filter: blur(20px) saturate(140%)`.
- Al scrollear >24px: agrega borde inferior `--line` y sube opacidad del fondo a `0.85`. (clase `.is-scrolled`)
- Izquierda: logo (diamante SVG + "TRANS·FIL" / "Industrial Machinery").
- Centro: nav con 6 links (Tecnologías, Catálogos, Servicios, Industrias, Historia, Contacto). Underline animado al hover (`scaleX` 0→1, origin-left, 0.3s).
- Derecha: toggle idioma ES/EN, CTA pill "Contacto", botón hamburguesa (solo mobile).
- **Barra de progreso de scroll:** línea de 2px en el borde inferior, color `--accent`, `transform: scaleX(progress)` donde progress = scrollY / altura scrolleable. Origin-left. Transición `0.05s linear`.

### Hero / Masthead
- Min-height `100vh`, flex column.
- **3 variantes** (Tweak `heroVariant`): `type` (default), `split`, `video`.
  - `type`: titular tipográfico gigante (3 líneas: "Procesos" / "que no" / "se detienen.") con foto de fondo + stats abajo.
  - `split`: titular a la izquierda + foto vertical con ficha técnica a la derecha.
  - `video`: frame de video con overlay de texto.
- **Solo la variante `type` lleva foto de fondo** (`bgUrl`, hoy `img/hf-welder.png`).
- La tercera línea del titular usa `--accent` en itálica.
- Meta superior: `[ 01 — EST. 1989 · CÓRDOBA · ARGENTINA ]` + status "Workshop · Active" con punto verde pulsante.
- **Stats:** 4 columnas con números que hacen **count-up** al entrar en viewport (36 años, 120+ clientes, 9 países, 24/7 soporte). Separadas por hairlines verticales.

### Tecnologías (`#tech`)
- Layout 2 columnas: **lista de 4 líneas** (izq) + **panel de detalle sticky** (der).
- Las 4 líneas: T01 Transportadores, T02 Lavado, T03 Tratamiento de fluidos, T04 Maquinaria de corte.
- Hover/click en una línea cambia el panel de detalle (foto + descripción + 4 bullets de productos).
- **Bullets interactivos:** cada bullet (ej. "Cizallas hidráulicas") al hover (desktop) o tap (mobile) abre un **cuadro flotante** arriba a la izquierda con foto/video + descripción breve de ese sub-producto. El cuadro se ancla por encima de la lista de bullets (calcula `top` con getBoundingClientRect) y cierra al tocar fuera (mobile).

### Catálogos (`#catalogs`)
- 3 cards de descarga: General (azul `#3a86ff`), Filtración (naranja `#ff6b1a`), Lavado (verde `#4ade80`).
- Cada card = "tapa" de catálogo estilizada (diamante mark, grilla técnica sutil, stripe diagonal, page count + size) + body (título, descripción, CTA "Descargar PDF").
- Hover: card sube 3px, borde toma el color de la línea, CTA se pinta del color.
- `<a download href="catalogs/...pdf">`.

### Proceso "De la planta a la planta" (`#process`)
- **4 variantes** (Tweak `processVariant`): `minimal`, `hotspots` (default), `banner`, `perStep`.
- **Variante default = `hotspots`:** una foto industrial grande (16:9) con **5 marcadores numerados** (01–05) posicionados en % sobre la foto. Hover (desktop) o tap (mobile) en un marcador levanta una card con título + descripción del paso. Debajo, una **leyenda** de 5 items que también responde a hover/tap. El marcador tiene un anillo "pulse" animado. La foto tiene efecto **Ken Burns** sutil (zoom lento infinito).
- Pasos: 01 Estudio de proceso, 02 Ingeniería, 03 Fabricación, 04 Puesta en marcha, 05 Soporte.

### Servicios "Más allá de la entrega" (`#services`)
- Fondo dark (`--bg-2`), se extiende full-bleed.
- **3 variantes** (Tweak `servicesVariant`): `grid`, `rows` (default), `clean`.
- **Default = `rows`:** 4 filas alternadas (imagen a un lado, texto al otro; alterna izq/der). Servicios: S01 Reparaciones, S02 Retrofitting, S03 Mantenimiento, S04 Ingeniería a medida.
- Las imágenes de fondo de servicio llevan el **mismo fade lateral** que el masthead (oscuro del lado del texto, foto respira del otro). Filtro `saturate(0.7) contrast(1.05) brightness(0.85)`.

### Industrias / Clientes (`#industries`)
- Tabs por industria: Siderurgia / Automotriz-Oil-Línea Blanca / Máquinas-Herramienta. Cada tab muestra su count.
- **2 variantes** (Tweak `clientsVariant`): `marquee` (default) o `list`.
- `marquee`: logos (wordmarks tipográficos) en escala de grises desplazándose; **pausa al hover**. Máscara de fade en los bordes.
- Clientes reales en el data: ACINDAR, ALUAR, TENARIS, RENAULT, VOLKSWAGEN, IVECO, FIAT, TOYOTA, etc. (ver `i18n.jsx` → `TF_CLIENTS`).

### Historia (`#history`)
- Texto introductorio + **timeline vertical**. Hitos: 1989 fundación, 1998 primera línea automotriz, 2007 línea Tenaris, 2015 expansión regional, 2024 nueva planta.
- La línea vertical del timeline se "dibuja" al entrar en viewport (`scaleY` 0→1, 1.4s). Cada hito aparece con stagger (delay incremental `var(--i) * 0.12s`).

### Contacto (`#contact`)
- Fondo dark. Form (2 columnas) + sidebar con datos directos + mini-mapa SVG animado de Córdoba.
- **Validación:** nombre, email (regex), mensaje requeridos. Email valida formato. Error en naranja `--warn`, borde del input en naranja. Al enviar OK: mensaje "✓ Consulta recibida..." en verde, se limpia el form (hoy NO envía a backend — implementar endpoint real: mailto / Formspree / API).
- Datos: email `mantovanimariano@transfil.com.ar`, tel `+54 (351) 465 0687` / `+54 9 3513 11-5838`, dirección **Francisco de Arteaga 3043, Córdoba** (¡ojo, no "Av. Circunvalación" — corregir si aparece), IG @TransFilSrl.

### Footer
- 4 columnas (marca, tecnologías, servicios, contacto) + barra inferior con copyright y coordenadas.

### FAB WhatsApp
- Fixed bottom-right, z-index 90, color `#25d366`, pill con icono + "WhatsApp".
- Aparece al scrollear >120px (fade + slide up). En mobile (<640px) se contrae a círculo solo-icono.
- `href="https://wa.me/5493513115838?text=..."` con mensaje pre-llenado, abre en nueva pestaña.

---

## 7. ANIMACIONES Y EFECTOS — ESPECIFICACIÓN COMPLETA

> 🎯 **Esta es la sección crítica.** El sitio debe quedar **tal cual diseñado**. Cada animación abajo con su trigger, propiedades, duración y easing exactos. Easing maestro = `cubic-bezier(0.2, 0.7, 0.2, 1)` salvo donde se indique otro.

### 7.1 Reveal de secciones al scroll (IntersectionObserver)
- **Trigger:** sección entra en viewport (threshold ~0.1). Se dispara una sola vez (disconnect después).
- **Efecto:** `opacity 0→1` + `transform: translateY(16px)→0`.
- **Timing:** `0.7s` opacity (ease) + `0.7s` transform (easing maestro).
- **Implementación:** hook `useReveal(threshold)` agrega clase `.is-visible`. Cada sección tiene su propio observer.

### 7.2 Reveal interno escalonado (dentro de cada sección visible)
Cuando la sección toma `.is-visible`, sus hijos aparecen con stagger:
- **Eyebrow:** `translateY(12px)→0` + fade, `0.6s ease`, delay `0.05s`.
- **h2 (title):** las líneas/spans suben desde `translateY(110%)` con overflow oculto (efecto "máscara"), `0.8s` easing maestro, delay `0.2s`.
- **Sub:** `translateY(20px)→0` + fade, `0.7s` easing maestro, delay `0.1s`.

### 7.3 Hero — entrada del titular display
- **Trigger:** al cargar la página.
- **Efecto:** cada una de las 3 líneas del `.tf-display` sube desde `translateY(40px)` + fade, `0.9s` easing maestro, `forwards`.
- **Stagger:** línea 1 delay `0.05s`, línea 2 `0.2s`, línea 3 `0.35s`.
- Keyframe `tf-display-in`.

### 7.4 Hero — parallax del fondo
- **Trigger:** scroll. **Solo desktop** (`min-width: 900px and pointer: fine`). En mobile/touch DESACTIVADO (se siente como bug).
- **Efecto:** la imagen de fondo se mueve hacia abajo a `scrollY * 0.18`, cap a `160px`. `translate3d(0, Ypx, 0)`.
- **Implementación:** hook `useScrollY()` (raf-throttled).

### 7.5 Hero — skeleton de carga + fade-in de la imagen
- Mientras carga la imagen pesada: shimmer de fondo (gradiente que se desplaza, `tf-skel` 1.6s linear infinite).
- La imagen entra con `tf-fade-in-img` (`opacity 0 → 0.55`, 0.5s ease, `backwards`, delay 0.05s). **Nota:** la opacidad final de la imagen del hero es `0.55` (va sombreada por gradiente encima).

### 7.6 Hero — gradiente / sombreado del fondo
La foto del hero lleva un **fade lateral**: oscuro fuerte del lado del texto (izquierda) desvaneciendo hacia la derecha, más vignette arriba/abajo. Es el mismo tratamiento que reciben las imágenes de servicios. Garantiza legibilidad del titular sobre cualquier foto. (Ver `.tf-hero-bg` / gradientes en CSS.)

### 7.7 Stats — count-up numérico
- **Trigger:** los stats entran en viewport (threshold 0.4).
- **Efecto:** número cuenta de 0 al target con ease-out cubic. Duración base `1300ms` + `idx * 120ms` (stagger por columna).
- **Parsing:** separa número de sufijo ("120+" → cuenta 120, mantiene "+"; "24/7" → no numérico, se muestra tal cual).
- **Implementación:** hook `useCountUp(target, {duration})`.

### 7.8 Punto de status "Active" (hero meta)
- Punto verde `#4ade80` con `box-shadow` que pulsa: `tf-pulse` 2s ease-in-out infinite (el spread del shadow late de 3px a 5px).

### 7.9 Header — barra de progreso de scroll
- Línea 2px abajo del header, `scaleX(0→1)` según progreso de scroll, origin-left, `0.05s linear`. Color `--accent`.

### 7.10 Header — underline de nav links
- Hover: pseudo-elemento `::after` (1px, color accent) hace `scaleX(0→1)` origin-left, `0.3s` easing maestro.

### 7.11 Botón primario — shine sweep
- Hover en `.tf-btn-primary`: un gradiente diagonal (`120deg, transparent→rgba(255,255,255,0.18)→transparent`) barre de izq a der (`translateX(-100%)→100%`), `0.7s` easing maestro. Además el botón sube `translateY(-1px)`.

### 7.12 Tecnologías — cambio de detalle
- Al cambiar la línea activa, el panel de detalle se re-monta (React `key`) y la media hace `tf-soft-fade` (`opacity 0→1` + `scale(1.03)→1`), `0.5s` easing maestro.
- La fila activa de la lista: el texto se aclara, padding-left aumenta (`0→16px`, `0.3s`) y la flecha se desplaza + toma color accent.

### 7.13 Tecnologías — cuadro flotante de bullet
- Hover/tap en bullet: card aparece con `opacity 0→1` + `translateY(8px)→0`, `0.25s` (opacity ease / transform easing maestro). Se posiciona absolutamente, anclada por encima de la lista de bullets (top calculado por JS).
- Para que no parpadee al salir, mantiene el último bullet renderizado mientras hace fade-out.

### 7.14 Catálogos — hover de card
- Card sube `translateY(-3px)`, borde toma color de línea, sombra aparece. Transición `0.3s` easing maestro (transform) + `0.25s` (border) + `0.3s` (shadow).
- La "tapa" cambia su gradiente de fondo (mezcla más color de línea) en `0.4s`. CTA se rellena del color.

### 7.15 Proceso (hotspots) — marcadores + Ken Burns
- **Foto:** efecto Ken Burns `tf-kenburns` — `scale(1.02)→1.12` + leve translate, `24s` ease-in-out infinite alternate, origin `60% 50%`.
- **Marcadores:** al entrar la sección en viewport, cada marcador aparece con `opacity 0→1` + `scale(0.6)→1`, easing **`cubic-bezier(0.34, 1.56, 0.64, 1)`** (overshoot/bounce), `0.5s`.
- **Anillo pulse:** `tf-hotspot-pulse` — `scale(0.85→2)` + `opacity 0.9→0`, `2.4s` ease-out infinite.
- **Dot activo:** `scale(1.15)` + fondo accent, `0.2s` easing maestro.
- **Card del hotspot:** `opacity 0→1` + `translateY(6px)→0`, `0.2s`. Se posiciona a izquierda/derecha y arriba/abajo del dot según su posición en la foto (data-side / data-vside).

### 7.16 Servicios — imágenes de fondo
- La imagen de fondo de cada servicio: `opacity 0→0.55` al estar presente, sube a `0.7` + `scale(1.04)` al hover de la fila/card. Transición `0.4s` (opacity) / `0.6s` (transform, easing maestro).

### 7.17 Industrias — marquee de logos
- Desplazamiento infinito `tf-scroll` (`translateX(0→-50%)`, linear infinite, ~60s). La lista se duplica para loop continuo.
- **Pausa al hover** (`animation-play-state: paused`). Logos en grayscale + opacity 0.65; al hover del item individual: full color + opacity 1.

### 7.18 Historia — timeline
- Línea vertical: `scaleY(0→1)` origin-top, `1.4s` easing maestro, delay `0.3s`, al entrar en viewport.
- Cada hito: `translateX(-12px)→0` + fade, `0.6s`, con delay escalonado `calc(var(--i) * 0.12s + 0.5s)`.

### 7.19 Contacto — mini-mapa
- SVG de Córdoba con un punto que emite un anillo expansivo (animate SMIL: `r` crece, opacity decae, 2s infinite).

### 7.20 Burger menu (mobile)
- Las 2 barras del ícono rotan a X al abrir (`translateY` + `rotate(±45deg)`, `0.25s`).
- El drawer despliega los links + (al pie) toggle ES/EN + CTA "Contacto".

### 7.21 FAB WhatsApp
- Aparece al scrollear >120px: `opacity 0→1` + `translateY(16px)→0` + `scale(0.96)→1`, `0.3s` easing maestro.
- Hover: `translateY(-2px)` + fondo más oscuro.

### 7.22 ♿ prefers-reduced-motion (OBLIGATORIO)
Hay un bloque `@media (prefers-reduced-motion: reduce)` que **desactiva** Ken Burns, parallax, skeleton y transiciones costosas (`animation: none !important; transition: none !important; opacity/transform reset`). **Mantener esto.** Todo reveal debe degradar a "contenido visible inmediatamente" sin movimiento.

### Resumen de keyframes (nombres en CSS)
`tf-pulse`, `tf-fade-in`, `tf-scroll`, `tf-display-in`, `tf-kenburns`, `tf-hotspot-pulse`, `tf-soft-fade`, `tf-skel`, `tf-fade-in-img`.

---

## 8. Estado (state management)

El prototipo maneja todo con `useState` local. En producción, el estado relevante:
- **`lang`** ('es' | 'en') — idioma activo. Persistir (localStorage o routing `/es` `/en`). Todo el copy sale de `i18n.jsx` → `TF_CONTENT[lang]`.
- **`heroVariant`, `clientsVariant`, `servicesVariant`, `processVariant`** — variantes de layout. **En producción NO son toggles de usuario** — son decisiones de diseño ya tomadas (defaults: hero `type`, clients `marquee`, services `rows`, process `hotspots`). Hardcodear los defaults; el panel de Tweaks no va a producción.
- **Tech:** `active` (línea seleccionada), `hoverBullet` (bullet con card abierta).
- **Process hotspots:** `active` (marcador seleccionado).
- **Industries:** `tab` activo.
- **Contacto:** estado del form (campos, errores, enviado).
- **Header:** `scrolled`, `progress`, `open` (menú mobile).

---

## 9. Responsive

- Breakpoints: `1080px` (tablet/colapso de nav → hamburguesa) y `640px` (mobile), más un ajuste extra a `400px` para los stats.
- A `1080px`: nav se oculta, aparece hamburguesa; grids 2-col pasan a 1-col; tech detail deja de ser sticky; hotspots 4:3.
- A `640px`: todo a 1 columna; display hero más chico; bullets con tap-target ≥44px; FAB se contrae a círculo.
- A `400px`: stats del hero pasan a **1 columna grande** (no 2 chicas).
- **Hit targets:** mínimo 44px en touch (toggle ES/EN, tabs, bullets).
- **Recorte de imágenes en mobile:** pendiente al recibir las imágenes finales — usar `<picture>` con crops dedicados o `object-position` por imagen para que el sujeto no quede cortado.
- Hay un archivo `mobile.html` que muestra el sitio dentro de un marco de iPhone (3 tamaños) — es **herramienta de preview**, no parte del sitio.

---

## 10. SEO (ya implementado en `index.html`)

Mantener / portar al framework destino:
- `<title>` con keyword + ubicación, meta description (~160 chars), keywords, canonical.
- **Open Graph** completo (og:title/description/image/url/locale es_AR + alternate en_US).
- **Twitter Card** summary_large_image.
- **JSON-LD** `Organization` schema (nombre, dirección, teléfono, países, ofertas/productos).
- `theme-color`, favicon SVG (`favicon.svg`), apple-touch-icon.
- `robots.txt` y `sitemap.xml` en la raíz.
- `<html lang>` dinámico según idioma.
- ⚠️ Generar `og-image.jpg` 1200×630 dedicado cuando lleguen las imágenes finales.
- ⚠️ Generar favicons PNG (32, 180) además del SVG para navegadores viejos.

---

## 11. Lo que NO va a producción

- **Panel de Tweaks** (`tweaks-panel.jsx` y los `<TweaksPanel>` en `index.html`): herramienta de preview/diseño. Las variantes ya fueron elegidas — hardcodear los defaults indicados en §8.
- **`mobile.html`** y **`ios-frame.jsx`**: preview de responsive.
- **React + Babel standalone**: solo para prototipar. Usar el toolchain del proyecto destino.
- Versiones alternativas de diseño (`v2/`, `v3/`, `index-v1.html`, `index-perStep.html`): exploraciones descartadas. **La versión aprobada es `index.html` (v1 Industrial Dark).**

---

## 12. Archivos de referencia en este bundle

| Archivo | Qué es |
|---|---|
| `index.html` | Página principal — estructura, SEO, wiring de componentes, defaults de variantes |
| `styles.css` | **Fuente de verdad de todo el diseño y las animaciones** |
| `components.jsx` | Átomos: Header, Footer, Section, Media, Marquee, ClientsList, WhatsApp FAB + hooks (`useReveal`, `useScrollY`, `useCountUp`) |
| `sections.jsx` | Secciones: Hero (3 variantes), Tech, Catalogs, Process (4 variantes), Services (3 variantes), Industries, History, Contact |
| `i18n.jsx` | Todo el copy ES/EN (`TF_CONTENT`) + lista de clientes (`TF_CLIENTS`) |
| `favicon.svg`, `robots.txt`, `sitemap.xml` | SEO / assets |
| `/img/*` | Imágenes placeholder (SERÁN REEMPLAZADAS — ver §4) |
| `/catalogs/*.pdf` | Catálogos PDF definitivos |

**Orden de carga de scripts** (ver `index.html`): React → ReactDOM → Babel → `tweaks-panel.jsx` → `i18n.jsx` → `components.jsx` → `sections.jsx` → app inline. En producción esto se reemplaza por el sistema de módulos del framework.

---

## 13. Checklist de implementación sugerido

1. [ ] Elegir framework (recomendado: Astro o Next.js static).
2. [ ] Portar design tokens a CSS vars / config del framework.
3. [ ] Cargar las 3 fuentes de Google.
4. [ ] Maquetar estructura semántica (header, main con 8 secciones, footer).
5. [ ] Implementar i18n (ES/EN) con el copy de `i18n.jsx`.
6. [ ] Componentes estáticos primero, luego animaciones (§7) una por una.
7. [ ] IntersectionObserver para reveals + `prefers-reduced-motion`.
8. [ ] Hotspots, bullets flotantes y marquee con soporte hover (desktop) + tap (mobile).
9. [ ] Form de contacto con validación + **endpoint real** (definir con cliente: mailto/Formspree/API).
10. [ ] SEO completo (§10) + og-image dedicada.
11. [ ] Responsive + hit targets + recortes de imagen mobile.
12. [ ] Integrar imágenes/videos finales **a medida que el cliente los entregue** (§4).
13. [ ] QA contra este prototipo, sección por sección, animación por animación.
