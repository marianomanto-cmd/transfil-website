/**
 * Política de scroll de los visores 3D — Trans-Fil.
 *
 * OrbitControls, tal como viene, se queda con el gesto: pone
 * `touch-action: none` en el lienzo (un dedo orbita y la página no baja) y
 * hace preventDefault en cada `wheel` (la rueda encima del 3D nunca
 * scrollea). En una landing larga eso es una trampa: el visitante llega al
 * diagrama y la página se le traba.
 *
 * Acá se invierte la prioridad. La página manda; el visor toma el gesto
 * sólo cuando es evidente que el visitante lo quiso:
 *
 *   · Táctil — un dedo scrollea la página (`touch-action: pan-y`), dos
 *     dedos orbitan. El recorrido por etapas se maneja con el riel, que no
 *     depende del gesto.
 *   · Rueda — si hay un scroll de página en curso (la página se movió hace
 *     menos de GRACE ms) la rueda no se captura y el visitante atraviesa el
 *     diagrama sin frenos. Con la página quieta y el puntero encima, la
 *     rueda hace zoom.
 *   · Topes — al llegar al zoom mínimo o máximo la rueda se libera, así que
 *     seguir girando en la misma dirección devuelve el scroll a la página.
 *     Nunca se queda encerrada.
 *
 * Todo se hace conmutando `controls.enableZoom` ANTES de que corra el
 * handler de OrbitControls: cuando está en false, OrbitControls sale sin
 * hacer preventDefault y el navegador scrollea normal. De ahí el listener
 * en fase de captura sobre el host (el lienzo vive en su shadow root).
 */

/** Ventana durante la cual un scroll de página reciente inhibe el zoom. */
const GRACE = 420;

/**
 * @param {HTMLElement & { controls: any, camera: any }} stage  <three-d-stage> ya listo.
 * @param {typeof import('three')} THREE
 * @param {{ min?: number, max?: number, onEngage?: () => void }} [opt]
 *        Topes de zoom en metros, y aviso de que el visitante tomó la
 *        cámara: quien la esté animando tiene que soltarla, o el zoom de la
 *        rueda se deshace solo en el frame siguiente.
 * @returns {{ dispose: () => void, scrolling: (ms?: number) => boolean }}
 *        `dispose` baja los listeners; `scrolling()` dice si la página se
 *        movió recién, para distinguir un gesto del visitante de un efecto
 *        secundario del scroll.
 */
export function letPageScroll(stage, THREE, opt) {
  const controls = stage.controls;
  const canvas = stage.renderer && stage.renderer.domElement;
  const onEngage = (opt && opt.onEngage) || (() => {});

  controls.minDistance = (opt && opt.min) || 2.5;
  controls.maxDistance = (opt && opt.max) || 26;

  // Un dedo para la página, dos para el modelo.
  controls.touches.ONE = null;
  controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
  if (canvas) canvas.style.touchAction = 'pan-y';

  let lastScroll = 0;
  const onScroll = () => { lastScroll = performance.now(); };
  window.addEventListener('scroll', onScroll, { passive: true });

  const onWheel = (e) => {
    if (performance.now() - lastScroll < GRACE) {
      controls.enableZoom = false;
      return;
    }
    const d = stage.camera.position.distanceTo(controls.target);
    controls.enableZoom = e.deltaY > 0
      ? d < controls.maxDistance - 0.01   // alejando: hay recorrido
      : d > controls.minDistance + 0.01;  // acercando: idem
    if (controls.enableZoom) onEngage();
  };
  stage.addEventListener('wheel', onWheel, { capture: true, passive: true });

  return {
    dispose: () => {
      window.removeEventListener('scroll', onScroll);
      stage.removeEventListener('wheel', onWheel, { capture: true });
    },
    scrolling: (ms) => performance.now() - lastScroll < (ms || GRACE),
  };
}
