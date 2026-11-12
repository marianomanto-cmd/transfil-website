# Recorrido de la central de filtración (video)

Fuente del video que abre la sección 02 de `/conformado`
(`src/components/CentralTour.astro`). Es la misma central que mostraba el
visor 3D interactivo, renderizada como un recorrido guiado: seis capítulos,
cámara que vuela a cada etapa, cortes en las carcasas, rótulos con línea
guía, panel de estado del PLC y el fluido con el color de su estado.

Un MP4 por idioma, porque los textos están en la imagen.

## Archivos

| Archivo | Qué tiene |
|---|---|
| `src/scene.js` | La geometría (metros, y hacia arriba, apoyada en y = 0), materiales, piezas que giran y anillos de flujo. |
| `src/tour.js` | Cámara por capítulo (`SHOTS`), cortes (`OPEN`), proceso (nivel, avance de tela, aceite), rótulos (`LABELS`), panel PLC y `renderAt(t)`. |
| `src/i18n.js` | Todos los textos del video en es / en / pt. |
| `src/index.html` | Lienzo de 1600 × 900 y la capa HTML de textos. |
| `render.cjs` | Renderiza frame a frame con Playwright (Chromium headless, SwiftShader) y guarda `frames/<idioma>/fNNNNN.jpg`. Retoma solo si se corta. |
| `encode.sh` | Arma `public/video/central-tour-<idioma>.mp4` (H.264) y los pósters `public/img/central-tour-<idioma>.webp`. |

## Volver a renderizar

```bash
cd tools/central-tour
npm install            # Playwright (three.js sale de la raíz del sitio)
./prepare.sh           # copia three.js, addons, fuentes y logo a src/
node render.cjs 25     # ~35 min en 2 núcleos: ~0,9 s por frame, 2025 frames
./encode.sh 25
```

Para mirar un instante sin renderizar todo: servir `src/` con cualquier
servidor estático, abrir `index.html` y llamar `tour.renderAt(t)` y
`tour.setLang('en', t)` desde la consola.

## Si cambian los tiempos

Los capítulos están en `CHAPTERS` (`tour.js`). Si se mueven, hay que
actualizar `centralTour.chapters[].t` en `src/i18n/landings.ts` y la
duración que figura en `centralTour.eyebrow`.

## Calidad vs. tiempo

Sin GPU, el mapa de entorno (PMREM) y el GTAO cuestan entre 1 y 3,5 s más
por frame; por eso van apagados por defecto. Se encienden con
`index.html?env=1&ao=1` si se renderiza en una máquina con GPU.
