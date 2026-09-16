/**
 * Diagrama de máquinas en 3D — operación de conformado de tubos.
 * Trans-Fil · sección 03 de las landings de aplicación (/conformado).
 *
 * Carga: <script type="module" is:inline src="/js/plant3d.js"> después del
 * import map pineado de three.js y de three-d-stage.js. Lee el copy ya
 * localizado del bloque <script type="application/json" id="plant3d-copy">
 * que imprime SystemDiagram3D.astro — acá no hay ni un string de contenido.
 *
 * Unidades en metros, y arriba, la planta apoyada en y = 0: el exportador
 * OBJ/GLB del stage entrega un modelo usable en Blender tal cual.
 */
/**
 * Diagrama de máquinas en 3D — operación de conformado de tubos.
 *
 * Toda la planta es geometría: back de transferencia, línea de conformado,
 * aplicador protectivo, central de filtración y torre de enfriamiento, más
 * los cuatro circuitos de fluido como cañería real (TubeGeometry sobre
 * curvas Catmull-Rom). El fluido se ve: esferas emisivas recorren cada
 * circuito en la dirección correcta.
 *
 * Unidades en metros, y arriba, la planta apoyada en y = 0 — así el
 * exportador OBJ/GLB del stage entrega un modelo usable en Blender.
 */

/** El copy llega ya localizado desde Astro, en un bloque JSON. */
const T = JSON.parse(document.getElementById('plant3d-copy').textContent);

const CIRCUIT_COLORS = ['#8f5c2d', '#7fd4ff', '#16a3d8', '#8a8780'];

const root = document.querySelector('.tf-p3d');
const stage = root.querySelector('three-d-stage');
const { THREE } = await stage.ready;

/* ── Materiales: paleta corta, compartida por toda la planta ─────────── */
const MAT = {
  maquina: new THREE.MeshStandardMaterial({ name: 'maquina', color: 0x73737e, roughness: 0.58, metalness: 0.26 }),
  estructura: new THREE.MeshStandardMaterial({ name: 'estructura', color: 0x4d4d56, roughness: 0.66, metalness: 0.2 }),
  transfil: new THREE.MeshStandardMaterial({ name: 'transfil-azul', color: 0x3579de, roughness: 0.46, metalness: 0.28 }),
  oscuro: new THREE.MeshStandardMaterial({ name: 'oscuro', color: 0x1c1c22, roughness: 0.85, metalness: 0.1 }),
  tubo: new THREE.MeshStandardMaterial({ name: 'tubo-acero', color: 0x8d8d97, roughness: 0.35, metalness: 0.4 }),
  soluble: new THREE.MeshStandardMaterial({ name: 'soluble-sucio', color: 0x8f5c2d, roughness: 0.22, metalness: 0.12 }),
};
const CIRC_MAT = CIRCUIT_COLORS.map((c, i) => new THREE.MeshStandardMaterial({
  name: 'circuito-' + i,
  color: new THREE.Color(c),
  roughness: 0.42,
  metalness: 0.2,
  transparent: true,
  opacity: 1,
}));

/* ── Primitivas ──────────────────────────────────────────────────────── */
const plant = new THREE.Group();
plant.name = 'planta-conformado';

function box(name, w, h, d, x, y, z, m) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.name = name;
  mesh.position.set(x, y, z);
  return mesh;
}
function cyl(name, r, len, x, y, z, m, axis, seg) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg || 24), m);
  mesh.name = name;
  mesh.position.set(x, y, z);
  if (axis === 'x') mesh.rotation.z = Math.PI / 2;
  if (axis === 'z') mesh.rotation.x = Math.PI / 2;
  return mesh;
}
function cone(name, rTop, rBot, h, x, y, z, m, seg) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg || 28), m);
  mesh.name = name;
  mesh.position.set(x, y, z);
  return mesh;
}
function pipe(name, pts, m, r) {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
  curve.curveType = 'catmullrom';
  curve.tension = 0.02;
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(40, pts.length * 20), r || 0.055, 12, false), m);
  mesh.name = name;
  return { mesh, curve };
}

const ARROW_GEO = new THREE.ConeGeometry(0.105, 0.28, 16);
const UP = new THREE.Vector3(0, 1, 0);
/** Puntas de flecha orientadas por la tangente: marcan el sentido del flujo. */
function arrowsOn(curve, m, group, us, name) {
  us.forEach((u, k) => {
    const a = new THREE.Mesh(ARROW_GEO, m);
    a.name = name + '-flecha-' + (k + 1);
    a.position.copy(curve.getPointAt(u));
    a.quaternion.setFromUnitVectors(UP, curve.getTangentAt(u).normalize());
    group.add(a);
  });
}

/* ── Piso y grilla de referencia ─────────────────────────────────────── */
// El piso se arma en cuatro paños para dejar el hueco del pozo
// (x −9.6…−7.2, z −1.6…0.8): el back de transferencia está hundido y
// separado de la línea, no alineado con ella.
plant.add(box('piso-oeste', 8.4, 0.08, 14, -10.0, -0.04, 0.75, MAT.oscuro));
plant.add(box('piso-este', 13.2, 0.08, 14, 3.2, -0.04, 0.75, MAT.oscuro));
plant.add(box('piso-sur', 2.4, 0.08, 5.95, -4.6, -0.04, -3.275, MAT.oscuro));
plant.add(box('piso-norte', 2.4, 0.08, 5.65, -4.6, -0.04, 4.925, MAT.oscuro));

// Huella de cada elemento — leen como cinco estaciones distintas.
function pad(name, w, d, x, z) {
  const g = new THREE.Group();
  g.name = name;
  g.add(box(name + '-borde', w, 0.03, d, x, 0.016, z, MAT.estructura));
  g.add(box(name + '-piso', w - 0.24, 0.03, d - 0.24, x, 0.032, z, MAT.oscuro));
  return g;
}
plant.add(pad('huella-linea', 17.2, 2.4, -0.4, -3));
plant.add(pad('huella-central', 7.4, 2.6, 1.2, 4.6));
plant.add(pad('huella-torre', 4.4, 2.3, -6.4, 4.6));

const pit = new THREE.Group();
pit.name = 'pozo-back-transferencia';
pit.add(box('pozo-fondo', 2.4, 0.08, 2.4, -4.6, -0.92, 0.9, MAT.estructura));
pit.add(box('pozo-pared-oeste', 0.1, 0.9, 2.4, -5.75, -0.45, 0.9, MAT.estructura));
pit.add(box('pozo-pared-este', 0.1, 0.9, 2.4, -3.45, -0.45, 0.9, MAT.estructura));
pit.add(box('pozo-pared-sur', 2.4, 0.9, 0.1, -4.6, -0.45, -0.25, MAT.estructura));
pit.add(box('pozo-pared-norte', 2.4, 0.9, 0.1, -4.6, -0.45, 2.05, MAT.estructura));
// Back de transferencia: depósito cilíndrico enterrado, de fabricación
// propia — de ahí el azul Trans-Fil. Sobresale apenas del piso.
// Sobresale medio metro del piso, con brocal y el soluble sucio a la vista.
pit.add(cyl('back-transferencia', 0.95, 1.6, -4.6, -0.14, 0.9, MAT.transfil, 'y', 44));
pit.add(cyl('back-aro-refuerzo', 0.99, 0.08, -4.6, -0.62, 0.9, MAT.estructura, 'y', 44));
pit.add(cyl('back-nivel-soluble', 0.9, 0.02, -4.6, 0.672, 0.9, MAT.soluble, 'y', 44));
const backRim = new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.05, 12, 48), MAT.estructura);
backRim.name = 'back-brida';
backRim.rotation.x = Math.PI / 2;
backRim.position.set(-4.6, 0.65, 0.9);
pit.add(backRim);
pit.add(box('back-bomba-skid', 0.5, 0.3, 0.5, -4.6, 0.8, 0.48, MAT.estructura));
pit.add(cyl('back-bomba', 0.16, 0.44, -4.6, 1.0, 0.48, MAT.maquina, 'x', 20));
// Brocal del pozo: delimita el elemento igual que las huellas de los otros.
pit.add(box('brocal-oeste', 0.16, 0.14, 2.7, -5.83, 0.07, 0.9, MAT.transfil));
pit.add(box('brocal-este', 0.16, 0.14, 2.7, -3.37, 0.07, 0.9, MAT.transfil));
pit.add(box('brocal-sur', 2.7, 0.14, 0.16, -4.6, 0.07, -0.33, MAT.transfil));
pit.add(box('brocal-norte', 2.7, 0.14, 0.16, -4.6, 0.07, 2.13, MAT.transfil));
// Rejilla del pozo, como en cualquier pileta de planta.
for (let i = 0; i < 3; i++) {
  pit.add(box('pozo-rejilla-s-' + (i + 1), 2.4, 0.04, 0.07, -4.6, 0.03, -0.18 + i * 0.15, MAT.estructura));
  pit.add(box('pozo-rejilla-n-' + (i + 1), 2.4, 0.04, 0.07, -4.6, 0.03, 1.98 - i * 0.15, MAT.estructura));
}
plant.add(pit);
const gpts = [];
for (let x = -14; x <= 9.8; x += 1) gpts.push(x, 0, -6.25, x, 0, 7.75);
for (let z = -6; z <= 7.75; z += 1) gpts.push(-14.2, 0, z, 9.8, 0, z);
const gGeo = new THREE.BufferGeometry();
gGeo.setAttribute('position', new THREE.Float32BufferAttribute(gpts, 3));
const grid = new THREE.LineSegments(gGeo, new THREE.LineBasicMaterial({ color: 0x3a86ff, transparent: true, opacity: 0.12 }));
grid.name = 'grilla';
grid.position.y = 0.002;
plant.add(grid);

/* ── Línea de conformado (z = −3) ────────────────────────────────────── */
const line = new THREE.Group();
line.name = 'linea-conformado';
line.add(box('bancada', 15.8, 0.18, 1.6, -0.4, 0.9, -3, MAT.estructura));
for (const lx of [-7.8, -4, -0.4, 3.2, 6.9]) {
  line.add(box('pata-bancada', 0.22, 0.81, 1.2, lx, 0.405, -3, MAT.estructura));
}
line.add(cyl('tubo-en-proceso', 0.085, 16.2, -0.4, 1.16, -3, MAT.tubo, 'x', 20));

// Entrada de fleje a la primera conformadora.
line.add(box('entrada-fleje', 0.5, 0.72, 1.3, -8.15, 1.35, -3, MAT.estructura));

// Estaciones de conformado y de calibrado: cuerpo, rodillos y motor.
const rolls = [];
function stand(name, x) {
  const g = new THREE.Group();
  g.name = name;
  g.add(box(name + '-cuerpo', 0.42, 0.95, 1.2, x, 1.465, -3, MAT.maquina));
  g.add(box(name + '-motor', 0.3, 0.26, 0.5, x, 2.07, -3.1, MAT.estructura));
  const a = cyl(name + '-rodillo-inf', 0.17, 1.32, x, 1.03, -3, MAT.tubo, 'z', 20);
  const b = cyl(name + '-rodillo-sup', 0.17, 1.32, x, 1.29, -3, MAT.tubo, 'z', 20);
  rolls.push([a, 1], [b, -1]);
  g.add(a, b);
  return g;
}
[-7.6, -6.8, -6.0, -5.2, -4.4].forEach((x, i) => line.add(stand('conformadora-' + (i + 1), x)));
[-1.2, -0.4, 0.4, 1.2].forEach((x, i) => line.add(stand('calibradora-' + (i + 1), x)));

// Soldadora / mill.
line.add(box('soldadora', 2.0, 1.5, 1.5, -2.8, 1.74, -3, MAT.maquina));
line.add(box('soldadora-cabezal', 0.9, 0.36, 0.72, -2.8, 2.67, -3, MAT.estructura));
line.add(box('soldadora-tablero', 0.5, 0.6, 0.06, -2.8, 1.9, -3.78, MAT.oscuro));

// Aplicador protectivo.
const appl = new THREE.Group();
appl.name = 'aplicador-protectivo';
appl.add(box('aplicador-cuerpo', 0.86, 1.5, 1.05, 3.0, 1.74, -3, MAT.transfil));
appl.add(box('aplicador-columna', 0.34, 0.6, 0.34, 3.0, 2.79, -3, MAT.transfil));
appl.add(box('aplicador-cabezal', 1.16, 0.3, 0.96, 3.0, 2.64, -3, MAT.estructura));
appl.add(box('aplicador-boquilla', 0.2, 0.34, 0.2, 3.0, 2.32, -3, MAT.maquina));
appl.add(box('aplicador-tablero', 0.44, 0.52, 0.06, 3.0, 1.8, -3.56, MAT.oscuro));
line.add(appl);

// Corte y salida.
line.add(box('cortadora', 1.7, 1.0, 1.3, 5.2, 1.49, -3, MAT.maquina));
const saw = cyl('disco-corte', 0.44, 0.06, 5.2, 2.1, -3, MAT.tubo, 'z', 40);
line.add(saw);
line.add(box('mesa-salida', 2.4, 0.12, 1.2, 7.0, 1.05, -3, MAT.estructura));
for (let i = 0; i < 5; i++) {
  line.add(cyl('rodillo-salida-' + (i + 1), 0.11, 1.1, 6.1 + i * 0.44, 1.18, -3, MAT.tubo, 'z', 16));
}
line.add(box('pata-salida', 0.18, 0.99, 0.9, 7.0, 0.495, -3, MAT.estructura));
plant.add(line);

/* ── Central de filtración (z = 2.4) ─────────────────────────────────── */
const central = new THREE.Group();
central.name = 'central-filtracion';
central.add(box('cuba', 4.8, 1.1, 1.7, 1.2, 0.55, 2.4, MAT.transfil));
// Centrífuga de entrada — montada SOBRE la cuba, en la punta oeste, que es
// por donde llega el soluble del back. Descarga el clarificado adentro de la
// cuba; recién ahí entran el filtro de banda y el resto del tren.
// La tapa de la cuba está en y = 1.1 y su punta oeste en x = −1.2, así que
// todo el conjunto se escribe apoyado sobre esa cota.
central.add(box('centrifuga-skid', 0.78, 0.29, 0.78, -0.78, 1.245, 2.4, MAT.estructura));
central.add(cone('centrifuga-tolva', 0.345, 0.11, 0.41, -0.78, 1.59, 2.4, MAT.transfil));
const centrifugeBowl = cyl('centrifuga-bol', 0.345, 0.82, -0.78, 2.21, 2.4, MAT.transfil, 'y', 40);
central.add(centrifugeBowl);
central.add(cyl('centrifuga-aro', 0.37, 0.06, -0.78, 2.59, 2.4, MAT.estructura, 'y', 40));
central.add(box('centrifuga-motor', 0.3, 0.25, 0.3, -0.78, 2.74, 2.4, MAT.maquina));
// El filtro de banda se corre al este para dejarle la punta a la centrífuga,
// sin llegar al montante de baja presión que sale de la cuba en x = 1.7.
central.add(box('filtro-banda', 1.7, 0.5, 1.5, 0.55, 1.35, 2.4, MAT.transfil));
central.add(box('filtro-banda-tapa', 1.4, 0.06, 1.2, 0.55, 1.63, 2.4, MAT.estructura));
central.add(box('bomba-skid', 1.0, 0.8, 1.2, 2.9, 1.5, 2.4, MAT.estructura));
central.add(cyl('bomba', 0.22, 0.6, 2.9, 1.62, 2.4, MAT.maquina, 'x', 20));
central.add(box('tablero', 0.8, 1.5, 0.7, 4.0, 0.75, 2.4, MAT.transfil));
central.add(box('tablero-pantalla', 0.52, 0.36, 0.05, 4.0, 1.16, 2.06, MAT.oscuro));
const statusLight = new THREE.Mesh(
  new THREE.SphereGeometry(0.05, 16, 12),
  new THREE.MeshStandardMaterial({ name: 'luz-estado', color: 0x4ade80, emissive: 0x4ade80, emissiveIntensity: 1.2, roughness: 0.4 })
);
statusLight.name = 'luz-estado';
statusLight.position.set(4.0, 0.76, 2.04);
central.add(statusLight);
central.position.z += 2.2;
plant.add(central);

/* ── Torre de enfriamiento (x = −6.4, z = 2.4) ───────────────────────── */
const tower = new THREE.Group();
tower.name = 'torre-enfriamiento';
tower.add(box('torre-base', 3.9, 0.16, 1.9, -6.4, 0.08, 2.4, MAT.estructura));
const fans = [];
[-7.3, -5.5].forEach((x, i) => {
  const n = 'torre-modulo-' + (i + 1);
  tower.add(box(n, 1.7, 2.0, 1.7, x, 1.16, 2.4, MAT.maquina));
  tower.add(cyl(n + '-plenum', 0.64, 0.14, x, 2.22, 2.4, MAT.oscuro, 'y', 32));
  const hub = new THREE.Group();
  hub.name = n + '-ventilador';
  hub.position.set(x, 2.28, 2.4);
  for (let b = 0; b < 4; b++) {
    const blade = box(n + '-pala-' + (b + 1), 0.56, 0.035, 0.17, 0.3, 0, 0, MAT.estructura);
    const arm = new THREE.Group();
    arm.rotation.y = (b * Math.PI) / 2;
    arm.add(blade);
    hub.add(arm);
  }
  tower.add(hub);
  fans.push(hub);
  for (let l = 0; l < 3; l++) {
    tower.add(box(n + '-persiana-' + (l + 1), 1.5, 0.1, 0.05, x, 0.55 + l * 0.34, 1.57, MAT.estructura));
  }
});
tower.position.z += 2.2;
plant.add(tower);

/* ── Circuitos de fluido ─────────────────────────────────────────────── */
const circuits = CIRCUIT_COLORS.map((_c, i) => ({
  group: new THREE.Group(),
  mat: CIRC_MAT[i],
  flow: [],
  curve: null,
  // Los circuitos 0 y 3 tienen un segundo tramo; los otros lo dejan en null.
  curve2: null,
  speed: 0.06,
}));
circuits.forEach((c, i) => {
  c.group.name = 'circuito-' + (i + 1);
  plant.add(c.group);
});

// 0 · soluble a filtrar: bajadas de cada estación y colector hasta la cuba.
{
  const c = circuits[0];
  // Leg A · de cada estación de la línea al back de transferencia.
  const main = pipe('colector-retorno', [
    [3.0, 0.34, -1.2], [-3.4, 0.34, -1.2], [-4.6, 0.34, -1.2], [-4.6, 0.34, -0.62], [-4.6, 0.64, -0.06], [-4.6, 0.84, 0.5], [-4.6, 0.84, 0.9],
  ], c.mat);
  c.curve = main.curve;
  c.group.add(main.mesh);
  // Leg B · impulsión del back hasta la tolva de la centrífuga, que ahora
  // está arriba de la cuba. Sube a y = 2.05 y corre al norte por x = −4.2,
  // que pasa raspando el módulo este de la torre (termina en x = −4.65).
  const feed = pipe('impulsion-back-centrifuga', [
    [-4.6, 1.15, 0.48], [-4.6, 2.05, 0.6], [-4.2, 2.05, 1.4], [-4.2, 2.05, 4.6], [-1.75, 2.05, 4.6], [-1.0, 1.7, 4.6],
  ], c.mat);
  c.curve2 = feed.curve;
  c.group.add(feed.mesh);
  // Leg C · descarga del clarificado: bajante corto por la cara frontal de
  // la cuba (la cara sur está en z = 3.75).
  c.group.add(pipe('centrifuga-a-cuba', [
    [-0.78, 1.22, 4.2], [-0.78, 1.22, 3.66], [-0.78, 0.82, 3.66],
  ], c.mat, 0.045).mesh);
  [-7.0, -5.2, -2.8, -0.4, 2.4].forEach((x, i) => {
    const d = pipe('bajada-retorno-' + (i + 1), [
      [x, 0.78, -3], [x, 0.46, -2.2], [x, 0.34, -1.35],
    ], c.mat, 0.048);
    c.group.add(d.mesh);
    arrowsOn(d.curve, c.mat, c.group, [0.86], 'retorno-' + (i + 1));
  });
  arrowsOn(main.curve, c.mat, c.group, [0.2, 0.52, 0.8], 'colector');
  arrowsOn(feed.curve, c.mat, c.group, [0.35, 0.72], 'impulsion');
}

// 1 · soluble filtrado, baja presión: sube de la cuba y alimenta las estaciones.
{
  const c = circuits[1];
  const main = pipe('linea-baja-presion', [
    [1.7, 1.12, 4.2], [1.7, 3.0, 4.2], [1.7, 3.0, -3], [-7.8, 3.0, -3],
  ], c.mat, 0.07);
  c.curve = main.curve;
  c.speed = 0.055;
  c.group.add(main.mesh);
  arrowsOn(main.curve, c.mat, c.group, [0.3, 0.62, 0.9], 'baja-presion');
  [-7.0, -5.2, -3.6, -1.2, 0.4].forEach((x, i) => {
    const d = pipe('bajada-baja-presion-' + (i + 1), [
      [x, 2.98, -3], [x, 2.4, -3], [x, 1.98, -3],
    ], c.mat, 0.055);
    c.group.add(d.mesh);
    arrowsOn(d.curve, c.mat, c.group, [0.85], 'baja-presion-' + (i + 1));
  });
}

// 2 · soluble doble filtrado, alta presión: cuba → aplicador protectivo.
{
  const c = circuits[2];
  // Lazo por el lado derecho y colector adelantado (z = −4.4): así no se
  // confunde nunca con el de baja presión, que corre sobre el eje.
  const main = pipe('linea-alta-presion', [
    [4.2, 1.12, 4.6], [4.2, 3.55, 4.6], [7.6, 3.55, 4.6], [7.6, 3.55, -4.4], [1.0, 3.55, -4.4],
  ], c.mat, 0.042);
  c.curve = main.curve;
  c.speed = 0.15;
  c.group.add(main.mesh);
  arrowsOn(main.curve, c.mat, c.group, [0.22, 0.5, 0.78], 'alta-presion');
  [[3.0, 2.62], [1.2, 2.02]].forEach(([x, yEnd], i) => {
    const d = pipe('bajada-alta-presion-' + (i + 1), [
      [x, 3.53, -4.4], [x, 3.4, -3.5], [x, 3.0, -3], [x, yEnd, -3],
    ], c.mat, 0.038);
    c.group.add(d.mesh);
    arrowsOn(d.curve, c.mat, c.group, [0.88], 'alta-presion-' + (i + 1));
  });
}

// 3 · agua de enfriamiento: central ↔ torre, ida y vuelta.
{
  const c = circuits[3];
  const main = pipe('agua-ida', [[-1.25, 0.55, 4.1], [-4.6, 0.55, 4.1]], c.mat, 0.05);
  c.curve = main.curve;
  c.speed = 0.05;
  c.group.add(main.mesh);
  arrowsOn(main.curve, c.mat, c.group, [0.35, 0.72], 'agua-ida');
  const back2 = pipe('agua-retorno', [[-4.6, 0.55, 5.1], [-1.25, 0.55, 5.1]], c.mat, 0.05);
  c.curve2 = back2.curve;
  c.group.add(back2.mesh);
  arrowsOn(back2.curve, c.mat, c.group, [0.35, 0.72], 'agua-retorno');
}

// Esferas emisivas: el fluido corriendo por cada circuito.
circuits.forEach((c, i) => {
  const m = new THREE.MeshStandardMaterial({
    name: 'fluido-' + i,
    color: new THREE.Color(CIRCUIT_COLORS[i]),
    emissive: new THREE.Color(CIRCUIT_COLORS[i]),
    emissiveIntensity: 1.4,
    roughness: 0.3,
    transparent: true,
  });
  c.flowMat = m;
  const n = [6, 5, 9, 4][i];
  const rad = [0.085, 0.1, 0.062, 0.075][i];
  const twin = !!c.curve2;
  for (let k = 0; k < n; k++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(rad, 14, 10), m);
    s.name = 'fluido-' + i + '-' + k;
    s.castShadow = false;
    c.group.add(s);
    c.flow.push({ mesh: s, t: k / n });
    if (twin) {
      const s2 = new THREE.Mesh(new THREE.SphereGeometry(rad, 14, 10), m);
      s2.name = 'fluido-' + i + '-r' + k;
      c.group.add(s2);
      c.flow.push({ mesh: s2, t: k / n, alt: true });
    }
  }
});

stage.setObject(plant);

/* ── Luz: el estudio por defecto es claro; acá la planta es oscura ───── */
stage.scene.traverse((o) => {
  if (o.isHemisphereLight) o.intensity = 0.72;
  if (o.isDirectionalLight) o.intensity = o.castShadow ? 2.5 : 0.95;
});
// Vista por defecto: tres cuartos alto, FOV corto para que lea axonométrica.
stage.camera.fov = 32;
stage.camera.updateProjectionMatrix();
stage.controls.minDistance = 8;
stage.controls.maxDistance = 60;
stage.controls.maxPolarAngle = Math.PI * 0.49;

// El encuadre aprobado está calculado sobre un marco 16/9. En uno más
// angosto —el 4/3 de los teléfonos— el mismo encaje recorta la planta por
// los costados, porque el FOV es vertical. Se conserva la dirección de la
// cámara y se la aleja en proporción al ancho que falta.
const HOME_TARGET = new THREE.Vector3(-0.4, 1.0, 0.9);
const HOME_DIR = new THREE.Vector3(7.4, 17.0, 21.8).sub(HOME_TARGET);
const HOME_DIST = HOME_DIR.length();
HOME_DIR.normalize();
let touched = false;
const frameHome = () => {
  if (touched) return;
  const a = stage.camera.aspect || 16 / 9;
  const k = a < 1.62 ? 1.62 / a : 1;
  stage.camera.position.copy(HOME_TARGET).addScaledVector(HOME_DIR, HOME_DIST * k);
  stage.controls.target.copy(HOME_TARGET);
  stage.controls.update();
};
// Una vez que el visitante mueve la cámara, el reencuadre no vuelve a
// pisarle la vista.
stage.controls.addEventListener('start', () => { touched = true; });
frameHome();
window.addEventListener('resize', frameHome);

/* ── Etiquetas de equipo, proyectadas cada frame ─────────────────────── */
const ANCHORS = [
  { key: 'back', at: [-4.6, 1.75, 0.9] },
  { key: 'centrifuge', at: [-0.78, 3.05, 4.6] },
  { key: 'line', at: [-8.2, 0.95, -4.9] },
  { key: 'appl', at: [3.0, 2.95, -3] },
  { key: 'central', at: [2.2, 2.05, 5.3] },
  { key: 'tower', at: [-7.3, 2.75, 4.6] },
  { key: 'lp', at: [-1.4, 3.45, -3], color: CIRCUIT_COLORS[1] },
  { key: 'hp', at: [6.4, 3.68, -4.4], color: CIRCUIT_COLORS[2] },
];
const labelBox = root.querySelector('.tf-p3d-labels');
// En un marco de teléfono ningún rótulo proyectado entra sin tapar la
// planta: con ocho cajas de texto sobre 348 px no queda dibujo que mirar.
// Abajo de 860 px no se proyecta ninguno y los nombres de los equipos
// pasan a una lista fija bajo el lienzo (la imprime el .astro).
const compactQuery = window.matchMedia('(max-width: 860px)');
let compact = compactQuery.matches;
compactQuery.addEventListener('change', (e) => { compact = e.matches; });
let lastW = 0;
let lastH = 0;
const labels = ANCHORS.map((a) => {
  const el = document.createElement('b');
  const txt = a.key === 'lp' || a.key === 'hp' ? T.tags[a.key] : T.eq[a.key];
  el.innerHTML = '<u>' + txt.split('\n').map((l) => '<span>' + l + '</span>').join('') + '</u>';
  if (a.color) el.style.setProperty('--dot', a.color);
  labelBox.appendChild(el);
  return { el, key: a.key, v: new THREE.Vector3(...a.at), w: 0, h: 0 };
});

/* ── Leyenda: aislar un circuito ─────────────────────────────────────── */
let iso = null;
let hov = null;
const legend = root.querySelector('.tf-p3d-legend');
const buttons = T.circuits.map((c, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.innerHTML =
    '<span class="sw"></span><span class="bd"><span class="nm"></span><span class="sb"></span></span>';
  b.setAttribute('aria-pressed', 'false');
  b.querySelector('.sw').style.background = CIRCUIT_COLORS[i];
  b.querySelector('.nm').textContent = c.name;
  b.querySelector('.sb').textContent = c.sub;
  b.addEventListener('mouseenter', () => { hov = i; paint(); });
  b.addEventListener('mouseleave', () => { hov = null; paint(); });
  b.addEventListener('click', () => { iso = iso === i ? null : i; paint(); });
  legend.appendChild(b);
  return b;
});

function paint() {
  const act = hov !== null ? hov : iso;
  circuits.forEach((c, i) => {
    const on = act === null || act === i;
    c.mat.opacity = on ? 1 : 0.1;
    c.flowMat.opacity = on ? 1 : 0.08;
    c.flow.forEach((f) => { f.mesh.visible = on; });
  });
  buttons.forEach((b, i) => {
    b.style.background = iso === i ? '#15151a' : '#0e0e10';
    b.style.opacity = iso === null || iso === i ? '1' : '0.45';
    b.setAttribute('aria-pressed', iso === i ? 'true' : 'false');
  });
}
paint();

/* ── Frame: flujo, giros y reposición de etiquetas ───────────────────── */
const v = new THREE.Vector3();
// Con menos movimiento la planta queda quieta: las puntas de flecha siguen
// diciendo el sentido del flujo. Las etiquetas sí se siguen reposicionando,
// porque orbitar es un gesto del visitante, no una animación.
const still = window.matchMedia('(prefers-reduced-motion: reduce)');
let settled = false;
stage.addFrameHook((t) => {
  if (still.matches) {
    if (!settled) {
      settled = true;
      statusLight.material.emissiveIntensity = 1.1;
    }
  } else {
  settled = false;
  circuits.forEach((c) => {
    c.flow.forEach((f) => {
      const curve = f.alt && c.curve2 ? c.curve2 : c.curve;
      const u = (f.t + t * c.speed) % 1;
      curve.getPointAt(u, v);
      f.mesh.position.copy(v);
    });
  });
  rolls.forEach(([r, dir]) => { r.rotation.y = t * 2.4 * dir; });
  fans.forEach((f, i) => { f.rotation.y = t * (2.1 + i * 0.3); });
  saw.rotation.y = t * 6;
  centrifugeBowl.rotation.y = t * 7;
  statusLight.material.emissiveIntensity = 0.5 + 0.9 * (0.5 + 0.5 * Math.sin(t * 2.2));
  }

  const cam = stage.camera;
  const w = labelBox.clientWidth;
  const h = labelBox.clientHeight;
  if (!w || !h) return;

  // Medidas propias: sólo cambian con el idioma y con el ancho del marco,
  // así que se leen una vez y se revalidan cuando el marco cambia de
  // tamaño. Leerlas por frame forzaría un layout por etiqueta.
  if (w !== lastW || h !== lastH) {
    lastW = w;
    lastH = h;
    labels.forEach((l) => { l.w = l.el.offsetWidth; l.h = l.el.offsetHeight; });
  }

  // El transform es translate(-50%, -100%): `left` es el centro y `top` el
  // borde inferior.
  const placed = [];
  labels
    .map((l) => {
      v.copy(l.v).project(cam);
      return { l, x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, z: v.z };
    })
    .sort((a, b) => a.z - b.z)
    .forEach((p) => {
      const { l } = p;
      const hidden = p.z >= 1 || compact;
      l.el.style.opacity = hidden ? '0' : '1';
      if (hidden) return;

      const halfW = l.w / 2;
      let x = Math.min(Math.max(p.x, halfW + 4), w - halfW - 4);
      let y = Math.min(Math.max(p.y, l.h + 4), h - 4);

      // Las que quedan más cerca de la cámara mandan; las de atrás suben
      // hasta despejar, y si arriba no hay lugar bajan por debajo.
      const clashes = (yy) =>
        placed.find(
          (q) =>
            x - halfW < q.x + q.w / 2 + 6 &&
            x + halfW > q.x - q.w / 2 - 6 &&
            yy - l.h < q.y + 4 &&
            yy > q.y - q.h - 4,
        );
      for (let pass = 0; pass < 8; pass++) {
        const q = clashes(y);
        if (!q) break;
        const up = q.y - q.h - 6;
        // Si arriba no entra, baja — y vuelve a revisar, porque abajo
        // puede haber otra ya colocada.
        y = up - l.h > 4 ? up : q.y + l.h + 6;
      }
      y = Math.min(Math.max(y, l.h + 4), h - 4);

      // En un marco angosto hay ángulos donde no entran todas. Antes que
      // superponer dos rótulos ilegibles, se oculta el de más atrás: vuelve
      // solo en cuanto la cámara se mueve, y la leyenda y el aria-label
      // siguen nombrando todo.
      if (clashes(y)) {
        l.el.style.opacity = '0';
        return;
      }

      placed.push({ x, y, w: l.w, h: l.h });
      l.el.style.left = x.toFixed(1) + 'px';
      l.el.style.top = y.toFixed(1) + 'px';
    });
});
