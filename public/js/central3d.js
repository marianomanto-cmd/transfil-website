/**
 * Central de filtración en 3D — recorrido F01 → F04.
 * Trans-Fil · sección 02 de las landings de aplicación (/conformado).
 *
 * Es la versión tridimensional del esquema de proceso: el equipo completo,
 * de la entrada de soluble contaminado a las dos salidas de soluble limpio.
 * Cada etapa tiene su zona; la cámara vuela hasta ella, un marco de foco la
 * encuadra, la carcasa del equipo se abre en corte y las trece referencias
 * de esa etapa pasan a tinta plena.
 *
 * Carga: import dinámico desde CentralDiagram3D.astro cuando el marco se
 * acerca al viewport. El import map pineado de three.js lo emite
 * Base.astro en el <head>; three-d-stage.js se inyecta antes que este
 * módulo. Todo el copy llega ya localizado en el bloque
 * <script type="application/json" id="central3d-copy"> — acá no hay ni un
 * string de contenido.
 *
 * Avance de etapa: sólo el riel F01–F04 (hover, foco o clic). El diagrama
 * no toca el scroll de la página; ver /js/stage-scroll.js.
 *
 * Metros, y arriba, apoyado en y = 0: el OBJ/GLB sale a escala real.
 */

import { letPageScroll } from '/js/stage-scroll.js';

/** El copy llega ya localizado desde Astro, en un bloque JSON. */
const T = JSON.parse(document.getElementById('central3d-copy').textContent);

const DIRTY = '#6b4a2a';   // soluble contaminado: marrón oscuro
const SEMI = '#c9b39a';    // ya sin finos ferrosos: beige
const CLEAN = '#4ec3f0';   // soluble limpio: celeste
const CLOTH = '#3cb878';   // tela filtrante y su descarga
const OIL = '#6f4a1f';     // aceite sobrenadante
const FERROUS = '#8f5c2d'; // finos ferrosos al depósito
const LP = '#7fd4ff';
const HP = '#16a3d8';

const root = document.querySelector('.tf-c3d');
const stage = root.querySelector('three-d-stage');
const { THREE } = await stage.ready;

/* ── Materiales ───────────────────────────────────────────────────────── */
const MAT = {
  transfil: new THREE.MeshStandardMaterial({ name: 'transfil-azul', color: 0x3579de, roughness: 0.46, metalness: 0.28 }),
  estructura: new THREE.MeshStandardMaterial({ name: 'estructura', color: 0x4d4d56, roughness: 0.66, metalness: 0.2 }),
  maquina: new THREE.MeshStandardMaterial({ name: 'maquina', color: 0x73737e, roughness: 0.58, metalness: 0.26 }),
  oscuro: new THREE.MeshStandardMaterial({ name: 'oscuro', color: 0x1c1c22, roughness: 0.85, metalness: 0.1 }),
  acero: new THREE.MeshStandardMaterial({ name: 'acero', color: 0x8d8d97, roughness: 0.35, metalness: 0.4 }),
  sucio: new THREE.MeshStandardMaterial({ name: 'soluble-sucio', color: 0x8f5c2d, roughness: 0.22, metalness: 0.12 }),
  limpio: new THREE.MeshStandardMaterial({ name: 'soluble-limpio', color: 0x2f7fb8, roughness: 0.18, metalness: 0.15 }),
  tela: new THREE.MeshStandardMaterial({ name: 'tela-filtrante', color: 0xbdb5a4, roughness: 0.9, metalness: 0.02 }),
  torta: new THREE.MeshStandardMaterial({ name: 'torta-de-barro', color: 0x9c7c4e, roughness: 0.85, metalness: 0.05 }),
  // Carcasas que se vuelven translúcidas en la vista en corte. Van con
  // material propio para poder abrirlas de a una sin tocar el resto.
  gCent: new THREE.MeshStandardMaterial({ name: 'carcasa-centrifuga', color: 0x3579de, roughness: 0.46, metalness: 0.28 }),
  gTela: new THREE.MeshStandardMaterial({ name: 'carcasa-tela', color: 0xbdb5a4, roughness: 0.9, metalness: 0.02 }),
  gMag: new THREE.MeshStandardMaterial({ name: 'carcasa-magnetico', color: 0x73737e, roughness: 0.58, metalness: 0.26 }),
  gCuba: new THREE.MeshStandardMaterial({ name: 'carcasa-cuba', color: 0x3579de, roughness: 0.46, metalness: 0.28 }),
  gNivel: new THREE.MeshStandardMaterial({ name: 'espejo-soluble-limpio', color: 0x4ec3f0, roughness: 0.18, metalness: 0.15 }),
  gBolsa: new THREE.MeshStandardMaterial({ name: 'carcasa-filtro-bolsa', color: 0x3579de, roughness: 0.46, metalness: 0.28 }),
};
const FLUID = {
  dirty: new THREE.MeshStandardMaterial({ name: 'fluido-contaminado', color: new THREE.Color(DIRTY), roughness: 0.3, metalness: 0.15, emissive: new THREE.Color(DIRTY), emissiveIntensity: 0.35 }),
  semi: new THREE.MeshStandardMaterial({ name: 'fluido-sin-finos', color: new THREE.Color(SEMI), roughness: 0.3, metalness: 0.15, emissive: new THREE.Color(SEMI), emissiveIntensity: 0.35 }),
  clean: new THREE.MeshStandardMaterial({ name: 'fluido-limpio', color: new THREE.Color(CLEAN), roughness: 0.26, metalness: 0.15, emissive: new THREE.Color(CLEAN), emissiveIntensity: 0.45 }),
  oil: new THREE.MeshStandardMaterial({ name: 'aceite-sobrenadante', color: new THREE.Color(OIL), roughness: 0.2, metalness: 0.1, emissive: new THREE.Color(OIL), emissiveIntensity: 0.3 }),
  ferrous: new THREE.MeshStandardMaterial({ name: 'finos-ferrosos', color: new THREE.Color(FERROUS), roughness: 0.4, metalness: 0.2, emissive: new THREE.Color(FERROUS), emissiveIntensity: 0.25 }),
  cloth: new THREE.MeshStandardMaterial({ name: 'tela-recorrido', color: new THREE.Color(CLOTH), roughness: 0.42, metalness: 0.1, emissive: new THREE.Color(CLOTH), emissiveIntensity: 0.16 }),
};
const PIPE = {
  dirty: new THREE.MeshStandardMaterial({ name: 'caneria-sucia', color: new THREE.Color(DIRTY), roughness: 0.42, metalness: 0.2 }),
  lp: new THREE.MeshStandardMaterial({ name: 'caneria-baja-presion', color: new THREE.Color(CLEAN), roughness: 0.42, metalness: 0.2 }),
  hp: new THREE.MeshStandardMaterial({ name: 'caneria-alta-presion', color: new THREE.Color(HP), roughness: 0.42, metalness: 0.2 }),
};

/* ── Primitivas ───────────────────────────────────────────────────────── */
const unit = new THREE.Group();
unit.name = 'central-filtracion';

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
function cone(name, rTop, rBot, h, x, y, z, m) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, 28), m);
  mesh.name = name;
  mesh.position.set(x, y, z);
  return mesh;
}
function pipe(name, pts, m, r) {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
  curve.curveType = 'catmullrom';
  curve.tension = 0.02;
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(40, pts.length * 20), r || 0.05, 12, false), m);
  mesh.name = name;
  return { mesh, curve };
}
const ARROW = new THREE.ConeGeometry(0.09, 0.24, 16);
const UP = new THREE.Vector3(0, 1, 0);
function arrowsOn(curve, m, group, us, name, sc) {
  us.forEach((u, k) => {
    const a = new THREE.Mesh(ARROW, m);
    a.name = name + '-flecha-' + (k + 1);
    if (sc) a.scale.setScalar(sc);
    a.position.copy(curve.getPointAt(u));
    a.quaternion.setFromUnitVectors(UP, curve.getTangentAt(u).normalize());
    group.add(a);
  });
}

/* ── Piso y grilla ───────────────────────────────────────────────────── */
unit.add(box('piso', 16, 0.08, 9, 0.6, -0.04, 0.2, MAT.oscuro));
const gpts = [];
for (let x = -7; x <= 8.4; x += 0.8) gpts.push(x, 0, -4.3, x, 0, 4.7);
for (let z = -4; z <= 4.7; z += 0.8) gpts.push(-7.4, 0, z, 8.6, 0, z);
const gGeo = new THREE.BufferGeometry();
gGeo.setAttribute('position', new THREE.Float32BufferAttribute(gpts, 3));
const grid = new THREE.LineSegments(gGeo, new THREE.LineBasicMaterial({ color: 0x3a86ff, transparent: true, opacity: 0.11 }));
grid.name = 'grilla';
grid.position.y = 0.002;
unit.add(grid);

/* ── F04 · cuba, bombeo, temperado, filtros bolsa y tablero ──────────── */
const tank = new THREE.Group();
tank.name = 'deposito-liquido';
tank.add(box('cuba-fondo', 5.2, 0.07, 1.8, 0, 0.035, 0, MAT.transfil));
tank.add(box('cuba-pared-oeste', 0.07, 1.0, 1.8, -2.565, 0.5, 0, MAT.transfil));
tank.add(box('cuba-pared-este', 0.07, 1.0, 1.8, 2.565, 0.5, 0, MAT.transfil));
tank.add(box('cuba-pared-fondo', 5.2, 1.0, 0.07, 0, 0.5, -0.865, MAT.transfil));
// La pared del frente es la que se abre en corte: deja ver el interior.
tank.add(box('cuba-pared-frente', 5.2, 1.0, 0.07, 0, 0.5, 0.865, MAT.gCuba));
// Baranda superior como marco, para no cerrar la boca de la cuba.
tank.add(box('cuba-baranda-frente', 5.34, 0.07, 0.09, 0, 1.0, 0.865, MAT.estructura));
tank.add(box('cuba-baranda-fondo', 5.34, 0.07, 0.09, 0, 1.0, -0.865, MAT.estructura));
tank.add(box('cuba-baranda-oeste', 0.09, 0.07, 1.84, -2.565, 1.0, 0, MAT.estructura));
tank.add(box('cuba-baranda-este', 0.09, 0.07, 1.84, 2.565, 1.0, 0, MAT.estructura));
tank.add(box('nivel-soluble-limpio', 5.06, 0.02, 1.66, 0, 0.76, 0, MAT.gNivel));
for (const lx of [-2.3, 2.3]) {
  tank.add(box('cuba-pata', 0.18, 0.1, 1.6, lx, 0.05, 0, MAT.estructura));
}
unit.add(tank);

const skid = new THREE.Group();
skid.name = 'bombeo-y-temperado';
skid.add(box('bomba-skid', 0.8, 0.7, 0.8, 3.3, 0.35, -0.45, MAT.estructura));
const pump = cyl('bomba', 0.2, 0.62, 3.3, 0.85, -0.45, MAT.maquina, 'x', 24);
skid.add(pump);
// Intercambiador de placas: bastidor fijo, paquete de placas, bastidor
// móvil, tensores y las cuatro bocas — como un placas real.
skid.add(box('intercambiador-cuna', 1.3, 0.14, 0.7, 3.6, 0.07, 0.55, MAT.estructura));
skid.add(box('intercambiador-soporte', 0.7, 0.16, 0.5, 3.6, 0.2, 0.55, MAT.estructura));
skid.add(cyl('intercambiador-bastidor-fijo', 0.5, 0.14, 3.05, 0.66, 0.55, MAT.transfil, 'x', 40));
skid.add(cyl('intercambiador-bastidor-movil', 0.5, 0.14, 4.15, 0.66, 0.55, MAT.transfil, 'x', 40));
for (let i = 0; i < 16; i++) {
  skid.add(cyl('intercambiador-placa-' + (i + 1), 0.46, 0.024, 3.16 + i * 0.058, 0.66, 0.55, MAT.acero, 'x', 36));
}
for (const [ty, tz] of [[1.0, 0.88], [1.0, 0.22], [0.32, 0.88], [0.32, 0.22]]) {
  skid.add(cyl('intercambiador-tensor', 0.026, 1.28, 3.6, ty, tz, MAT.estructura, 'x', 12));
}
for (const [ny, nz] of [[0.92, 0.55], [0.4, 0.55], [0.66, 0.83], [0.66, 0.27]]) {
  skid.add(cyl('intercambiador-boca', 0.075, 0.26, 2.9, ny, nz, MAT.maquina, 'x', 20));
  skid.add(cyl('intercambiador-brida', 0.1, 0.04, 2.78, ny, nz, MAT.estructura, 'x', 20));
}

// Filtros bolsa: cuerpos cilíndricos con tapa abovedada y purga.
function bagFilter(n, x) {
  const g = new THREE.Group();
  g.name = n;
  g.add(cyl(n + '-cuerpo', 0.28, 1.0, x, 0.56, 0.35, MAT.gBolsa, 'y', 36));
  g.add(cyl(n + '-brida', 0.32, 0.05, x, 1.06, 0.35, MAT.estructura, 'y', 36));
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 32, 14, 0, Math.PI * 2, 0, Math.PI / 2),
    MAT.estructura
  );
  dome.name = n + '-tapa';
  dome.position.set(x, 1.08, 0.35);
  g.add(dome);
  g.add(cyl(n + '-base', 0.3, 0.07, x, 0.09, 0.35, MAT.estructura, 'y', 36));
  g.add(cyl(n + '-purga', 0.05, 0.22, x, 0.2, 0.06, MAT.maquina, 'z', 16));
  g.add(cyl(n + '-manometro', 0.06, 0.05, x, 0.95, 0.08, MAT.maquina, 'z', 16));
  g.add(cyl(n + '-valvula', 0.09, 0.04, x, 0.62, -0.02, MAT.estructura, 'z', 20));
  g.add(cyl(n + '-brida-inferior', 0.2, 0.04, x, 0.16, 0.35, MAT.estructura, 'y', 24));
  return g;
}
skid.add(bagFilter('filtro-bolsa-1', 4.7));
skid.add(bagFilter('filtro-bolsa-2', 5.45));
skid.add(box('filtros-manifold', 0.78, 0.08, 0.1, 5.08, 0.78, 0.05, MAT.estructura));
skid.add(pipe('puente-filtros', [[4.7, 1.24, 0.1], [5.08, 1.36, 0.1], [5.45, 1.24, 0.1]], PIPE.lp, 0.042).mesh);
skid.add(box('tablero-tapa', 0.96, 0.07, 0.68, 6.5, 1.83, 0, MAT.estructura));
for (let i = 0; i < 4; i++) {
  skid.add(cyl('tablero-boton-' + (i + 1), 0.022, 0.03, 6.88, 1.5 - i * 0.14, 0.2, MAT.maquina, 'z', 12));
}

// Tablero: pantalla y luces al frente, que es por donde se entra.
skid.add(box('tablero', 0.9, 1.8, 0.62, 6.5, 0.9, 0, MAT.transfil));
skid.add(box('tablero-marco-pantalla', 0.66, 0.48, 0.03, 6.5, 1.36, 0.315, MAT.estructura));
skid.add(box('tablero-pantalla', 0.58, 0.4, 0.04, 6.5, 1.36, 0.325, MAT.oscuro));
skid.add(box('tablero-puerta', 0.78, 1.0, 0.02, 6.5, 0.6, 0.315, MAT.transfil));
skid.add(cyl('tablero-manija', 0.03, 0.16, 6.84, 0.6, 0.33, MAT.estructura, 'y', 12));
const statusLight = new THREE.Mesh(
  new THREE.SphereGeometry(0.045, 16, 12),
  new THREE.MeshStandardMaterial({ name: 'luz-estado', color: 0x4ade80, emissive: 0x4ade80, emissiveIntensity: 1.2, roughness: 0.4 })
);
statusLight.name = 'luz-estado';
statusLight.position.set(6.34, 1.04, 0.33);
skid.add(statusLight);
for (const lx of [6.5, 6.66]) {
  skid.add(cyl('tablero-luz', 0.035, 0.03, lx, 1.04, 0.33, MAT.oscuro, 'z', 16));
}
unit.add(skid);

/* ── F01 · entrada, centrífuga y separador magnético ─────────────────── */
const inlet = new THREE.Group();
inlet.name = 'entrada-y-separacion-magnetica';
// Entrada: columna de soluble contaminado que sube por el extremo
// izquierdo y entra por arriba a la centrífuga.
const inPipe = pipe('entrada-soluble-contaminado', [
  [-5.6, 0.35, 0], [-5.6, 3.55, 0], [-5.6, 3.9, 0], [-2.55, 3.9, 0], [-2.2, 3.78, 0],
], PIPE.dirty, 0.06);
inlet.add(inPipe.mesh);
arrowsOn(inPipe.curve, PIPE.dirty, inlet, [0.22, 0.48, 0.82], 'entrada');

// Centrífuga: apoyada sobre el bastidor del separador magnético.
inlet.add(box('centrifuga-plataforma', 1.3, 0.1, 1.3, -1.95, 2.45, 0, MAT.estructura));
inlet.add(cone('centrifuga-tolva', 0.48, 0.16, 0.6, -1.95, 2.8, 0, MAT.gCent));
const bowl = cyl('centrifuga-bol', 0.48, 1.0, -1.95, 3.6, 0, MAT.gCent, 'y', 44);
inlet.add(bowl);
// Boca de entrada lateral y nivel de soluble adentro, como el diagrama.
inlet.add(box('centrifuga-boca', 0.42, 0.3, 0.3, -2.42, 3.86, 0, MAT.estructura));
inlet.add(cyl('centrifuga-boca-brida', 0.19, 0.05, -2.64, 3.86, 0, MAT.maquina, 'x', 20));
inlet.add(cyl('centrifuga-nivel', 0.44, 0.55, -1.95, 3.42, 0, FLUID.semi, 'y', 40));
inlet.add(cyl('centrifuga-tolva-nivel', 0.4, 0.18, -1.95, 3.04, 0, FLUID.semi, 'y', 36));
inlet.add(cyl('centrifuga-aro', 0.51, 0.08, -1.95, 4.14, 0, MAT.estructura, 'y', 44));
inlet.add(box('centrifuga-motor', 0.4, 0.32, 0.4, -1.95, 4.34, 0, MAT.maquina));
// Descarga de la centrífuga al tambor magnético, justo debajo.
const outCent = pipe('centrifuga-a-magnetico', [
  [-1.95, 2.5, 0], [-1.95, 2.42, 0], [-1.95, 2.3, 0],
], PIPE.dirty, 0.055);
inlet.add(outCent.mesh);

inlet.add(box('magnetico-bastidor', 1.15, 0.1, 1.5, -1.95, 2.35, 0, MAT.estructura));
for (const sx of [-2.45, -1.45]) {
  inlet.add(box('magnetico-columna', 0.1, 0.9, 1.5, sx, 1.9, 0, MAT.estructura));
}
const drum = cyl('separador-magnetico-tambor', 0.42, 1.25, -1.95, 1.72, 0, MAT.maquina, 'z', 36);
inlet.add(drum);
inlet.add(cyl('tambor-eje', 0.07, 1.6, -1.95, 1.72, 0, MAT.acero, 'z', 16));
inlet.add(box('magnetico-rasqueta', 0.28, 0.1, 1.3, -2.44, 1.86, 0, MAT.estructura));
inlet.add(box('magnetico-carcasa', 1.24, 0.62, 1.42, -1.95, 1.9, 0, MAT.gMag));
inlet.add(box('magnetico-visor', 0.5, 0.3, 0.04, -1.95, 1.95, -0.73, MAT.oscuro));
const chuteBox = box('magnetico-canaleta', 0.95, 0.07, 0.62, -2.62, 1.52, -0.3, MAT.estructura);
chuteBox.rotation.z = 0.42;
inlet.add(chuteBox);
const chuteWall = box('magnetico-canaleta-borde', 0.95, 0.16, 0.05, -2.62, 1.58, -0.61, MAT.estructura);
chuteWall.rotation.z = 0.42;
inlet.add(chuteWall);
for (const px of [-2.42, -1.48]) {
  inlet.add(box('magnetico-pata', 0.1, 1.45, 0.14, px, 0.72, -0.62, MAT.estructura));
  inlet.add(box('magnetico-pata', 0.1, 1.45, 0.14, px, 0.72, 0.62, MAT.estructura));
}
inlet.add(box('magnetico-motor', 0.26, 0.26, 0.3, -1.95, 1.72, 0.82, MAT.estructura));
// Descarga de finos ferrosos: canaleta al depósito de residuos, que va
// al extremo izquierdo y alineado con la máquina.
// Bomba de pozo junto al depósito, como en el diagrama.
inlet.add(cyl('bomba-pozo', 0.2, 0.26, -4.95, 0.3, 0, MAT.maquina, 'x', 28));
inlet.add(cyl('bomba-pozo-brida', 0.23, 0.04, -4.8, 0.3, 0, MAT.estructura, 'x', 28));
inlet.add(box('bomba-pozo-base', 0.42, 0.14, 0.42, -4.95, 0.07, 0, MAT.estructura));
inlet.add(box('deposito-residuos', 0.9, 0.7, 0.9, -4.0, 0.42, 0, MAT.estructura));
inlet.add(box('deposito-residuos-asa', 0.06, 0.06, 0.4, -3.52, 0.62, 0, MAT.maquina));
inlet.add(box('residuos-nivel', 0.76, 0.02, 0.76, -4.0, 0.72, 0, MAT.sucio));
inlet.add(box('residuos-borde', 0.96, 0.06, 0.96, -4.0, 0.75, 0, MAT.maquina));
for (const wz of [-0.32, 0.32]) {
  inlet.add(cyl('residuos-rueda-' + (wz < 0 ? 1 : 2), 0.09, 0.08, -4.0, 0.09, wz, MAT.oscuro, 'z', 16));
}
unit.add(inlet);

/* ── F02 · filtro de banda por gravedad ──────────────────────────────── */
const belt = new THREE.Group();
belt.name = 'filtro-gravedad-banda';
belt.add(box('banda-bastidor', 2.5, 0.12, 1.55, -0.15, 1.34, 0, MAT.estructura));
belt.add(box('banda-tela', 2.36, 0.03, 1.3, -0.15, 1.42, 0, MAT.gTela));
const beltRolls = [];
for (const [n, rx] of [['banda-polea-entrada', -1.4], ['banda-polea-salida', 1.1]]) {
  const r = cyl(n, 0.17, 1.5, rx, 1.4, 0, MAT.acero, 'z', 24);
  belt.add(r);
  beltRolls.push(r);
  belt.add(cyl(n + '-buje', 0.07, 1.62, rx, 1.4, 0, MAT.estructura, 'z', 16));
}
belt.add(box('banda-torta', 2.24, 0.07, 1.06, -0.15, 1.47, 0, MAT.torta));
for (let i = 0; i < 6; i++) {
  belt.add(cyl('banda-rodillo-apoyo-' + (i + 1), 0.06, 1.24, -1.1 + i * 0.42, 1.33, 0, MAT.acero, 'z', 16));
}
// Los triángulos del diagrama: barro retenido, con la punta hacia abajo.
for (let i = 0; i < 5; i++) {
  for (const cz of [-0.28, 0.28]) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.17, 4), MAT.torta);
    c.name = 'banda-barro-' + (i + 1);
    c.rotation.x = Math.PI;
    c.rotation.y = Math.PI / 4;
    c.position.set(-0.95 + i * 0.48, 1.58, cz);
    belt.add(c);
  }
}
for (const bz of [-0.72, 0.72]) {
  belt.add(box('banda-baranda', 2.5, 0.16, 0.06, -0.15, 1.5, bz, MAT.estructura));
}
belt.add(box('banda-canal-boquillas', 2.2, 0.14, 0.18, -0.15, 1.78, 0, MAT.estructura));
for (let i = 0; i < 4; i++) {
  belt.add(box('boquilla-' + (i + 1), 0.09, 0.2, 0.09, -0.95 + i * 0.53, 1.62, 0, MAT.maquina));
}
const cloth = cyl('rollo-tela', 0.36, 1.35, 1.62, 1.62, 0, MAT.tela, 'z', 32);
belt.add(cloth);
belt.add(cyl('rollo-eje', 0.06, 1.55, 1.62, 1.62, 0, MAT.acero, 'z', 16));
for (const rr of [0.34, 0.26, 0.18]) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(rr, 0.012, 8, 40), FLUID.cloth);
  ring.name = 'rollo-tela-aro-' + rr;
  ring.position.set(1.62, 1.62, 0.69);
  belt.add(ring);
}
unit.add(belt);

/* ── F03 · skimmer y sensor de nivel ─────────────────────────────────── */
const oil = new THREE.Group();
oil.name = 'skimmer-y-nivel';
const disc = cyl('skimmer-disco', 0.52, 0.05, 2.15, 0.95, 0.45, MAT.oscuro, 'z', 44);
oil.add(disc);
oil.add(cyl('skimmer-disco-aro', 0.53, 0.06, 2.15, 0.95, 0.4499, MAT.estructura, 'z', 44));
oil.add(box('skimmer-cabezal', 0.5, 0.26, 0.34, 2.15, 1.42, 0.45, MAT.transfil));
oil.add(box('skimmer-canaleta', 0.6, 0.1, 0.16, 2.62, 1.3, 0.45, MAT.estructura));
oil.add(cyl('skimmer-eje', 0.05, 0.5, 2.15, 0.95, 0.45, MAT.acero, 'z', 12));
oil.add(box('film-aceite', 1.5, 0.008, 1.2, 1.9, 0.778, -0.2, MAT.sucio));
oil.add(cyl('skimmer-bandeja', 0.3, 0.06, 2.72, 1.0, 0.45, MAT.estructura, 'y', 32));
oil.add(box('skimmer-motor', 0.22, 0.22, 0.26, 2.15, 1.42, 0.72, MAT.maquina));
oil.add(box('sensor-nivel-mensula', 0.16, 0.1, 0.3, 2.45, 1.02, -0.86, MAT.estructura));
oil.add(box('sensor-nivel-columna', 0.1, 1.0, 0.1, 2.45, 1.4, -0.72, MAT.estructura));
oil.add(box('sensor-nivel-cabezal', 0.26, 0.14, 0.26, 2.45, 1.97, -0.72, MAT.maquina));
oil.add(cyl('sensor-nivel-flotante', 0.16, 0.1, 2.45, 0.79, -0.72, MAT.maquina, 'y', 20));
unit.add(oil);

/* ── Salidas de soluble limpio ───────────────────────────────────────── */
const outs = new THREE.Group();
outs.name = 'salidas-soluble-limpio';
const lpPipe = pipe('salida-baja-presion', [
  [4.7, 1.3, 0.35], [4.7, 2.85, 0.35], [4.7, 3.15, 0.35], [7.9, 3.15, 0.35],
], PIPE.lp, 0.07);
outs.add(lpPipe.mesh);
arrowsOn(lpPipe.curve, PIPE.lp, outs, [0.34, 0.82], 'baja-presion');
const hpPipe = pipe('salida-alta-presion', [
  [5.45, 1.3, 0.35], [5.45, 2.5, 0.35], [5.45, 2.8, -0.12], [5.45, 3.72, -0.12], [7.9, 3.72, -0.12],
], PIPE.hp, 0.045);
outs.add(hpPipe.mesh);
arrowsOn(hpPipe.curve, PIPE.hp, outs, [0.38, 0.84], 'alta-presion');
// Del intercambiador a los filtros bolsa.
const toBags = pipe('temperado-a-filtros', [
  [4.3, 0.88, 0.72], [4.5, 0.88, 0.5], [4.7, 0.88, 0.35],
], PIPE.lp, 0.05);
outs.add(pipe('filtro-a-filtro', [[4.7, 0.62, 0.05], [5.08, 0.62, 0.05], [5.45, 0.62, 0.05]], PIPE.lp, 0.045).mesh);
outs.add(toBags.mesh);
const fromTank = pipe('cuba-a-bomba', [
  [2.6, 0.6, -0.45], [2.95, 0.6, -0.45], [3.1, 0.7, -0.45],
], PIPE.lp, 0.05);
outs.add(fromTank.mesh);
const pumpToHx = pipe('bomba-a-temperado', [
  [3.55, 0.85, -0.45], [2.9, 0.85, -0.2], [2.9, 0.38, 0.38],
], PIPE.lp, 0.05);
outs.add(pumpToHx.mesh);
unit.add(outs);

/* ── Recorrido del fluido: un tramo por estado, y el estado cambia
   justo donde el equipo hace su trabajo ────────────────────────────── */
const flow = new THREE.Group();
flow.name = 'recorrido-fluido';
const flowDots = [];
function leg(name, pts, m, r, n, dotsOnly) {
  const p = pipe(name, pts, m, r || 0.038);
  if (!dotsOnly) {
    flow.add(p.mesh);
    arrowsOn(p.curve, m, flow, pts.length > 4 ? [0.22, 0.52, 0.82] : [0.55], name, 0.62);
  }
  for (let k = 0; k < (n || 3); k++) {
    const d = new THREE.Mesh(new THREE.SphereGeometry((r || 0.038) * (dotsOnly ? 2.4 : 1.6), 14, 10), m);
    d.name = name + '-gota-' + (k + 1);
    flow.add(d);
    flowDots.push({ mesh: d, curve: p.curve, t: k / (n || 3), sp: 0.16 });
  }
  return p;
}

// 1 · Soluble contaminado: baja por el eje de la centrífuga.
leg('flujo-contaminado-centrifuga', [
  [-1.95, 4.02, 0], [-1.95, 3.4, 0], [-1.95, 2.8, 0], [-1.95, 2.36, 0],
  [-1.95, 2.16, 0], [-1.74, 2.06, 0], [-1.58, 1.88, 0],
], FLUID.dirty, 0.044, 6);
// 2 · Sin finos ferrosos: una sola línea del tambor magnético hasta el
//     final del filtro de gravedad, sin cortes.
leg('flujo-sin-finos', [
  [-1.56, 1.84, 0], [-1.6, 1.66, 0], [-1.48, 1.58, 0],
  [-1.2, 1.6, 0], [-0.4, 1.6, 0], [0.4, 1.6, 0], [1.02, 1.6, 0],
], FLUID.semi, 0.04, 7);
// 4 · Limpio: atraviesa la tela y gotea a la cuba, como en el diagrama.
for (let i = 0; i < 5; i++) {
  const x = -1.0 + i * 0.5;
  leg('flujo-limpio-goteo-' + (i + 1), [[x, 1.3, 0], [x, 1.05, 0], [x, 0.79, 0]], FLUID.clean, 0.028, 2, true);
}
// 5 · Limpio: por dentro de la cuba hasta la aspiración, un solo tramo recto.
leg('flujo-limpio-en-cuba', [[-1.2, 0.42, -0.45], [0.6, 0.42, -0.45], [2.45, 0.42, -0.45]], FLUID.clean, 0.05, 5);
// 6 · Aceite sobrenadante: del espejo, sube con el disco y sale por la
//     canaleta — una sola línea.
leg('flujo-aceite', [
  [1.62, 0.82, 0.45], [2.05, 0.82, 0.45], [2.15, 1.05, 0.45],
  [2.28, 1.32, 0.45], [2.6, 1.32, 0.45], [2.88, 1.32, 0.45],
], FLUID.oil, 0.032, 5);
// 7 · Finos ferrosos: descarga del magnético al depósito de residuos.
leg('flujo-finos-al-deposito', [
  [-1.9, 1.31, 0], [-2.2, 1.38, 0], [-2.36, 1.62, 0], [-2.44, 1.82, 0],
  [-2.66, 1.68, -0.18], [-3.3, 1.34, -0.3], [-3.92, 0.96, -0.3], [-4.0, 0.84, -0.3],
], FLUID.ferrous, 0.032, 7);
// 8 · Tela filtrante: se desenrolla, avanza bajo el fluido y descarga el
//     residuo en el mismo depósito — la línea verde del diagrama.
leg('tela-recorrido', [
  [1.52, 1.76, 0.4], [1.18, 1.62, 0.4], [1.04, 1.5, 0.4],
  [-0.2, 1.5, 0.4], [-1.32, 1.5, 0.4], [-1.74, 1.36, 0.4],
  [-2.8, 1.1, 0.4], [-3.95, 0.88, 0.4],
], FLUID.cloth, 0.022, 8);
unit.add(flow);

/* ── Marco de foco: el equivalente 3D de los ticks del esquema 2D ────── */
const FOCUS = new THREE.LineSegments(
  new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
  new THREE.LineBasicMaterial({ color: 0x3a86ff, transparent: true, opacity: 0.34 })
);
FOCUS.name = 'foco-etapa';
unit.add(FOCUS);

stage.setObject(unit);
FOCUS.castShadow = false;
FOCUS.receiveShadow = false;

/* ── Luz para fondo oscuro ───────────────────────────────────────────── */
stage.scene.traverse((o) => {
  if (o.isHemisphereLight) o.intensity = 0.72;
  if (o.isDirectionalLight) o.intensity = o.castShadow ? 2.5 : 0.95;
});

/* ── La página manda el scroll; el visor sólo toma el gesto cuando el
      visitante lo pide. Los topes de zoom son además los que devuelven la
      rueda a la página. Va antes del primer encuadre, que los usa de tope.
      Ver /js/stage-scroll.js. ───────────────────────────────────────── */
// Con View Transitions este módulo se vuelve a importar con otro sufijo y
// convive un instante con el anterior: hay que bajarle los listeners de
// window al que se va, o cada navegación deja una escena entera viva.
if (window.__tfC3dCleanup) window.__tfC3dCleanup();
const pageScroll = letPageScroll(stage, THREE, { min: 3.2, max: 30, onEngage: () => { manual = true; } });
window.__tfC3dCleanup = pageScroll.dispose;

/* ── Etapas: zona de foco y encuadre de cámara ───────────────────────── */
const STAGES = [
  {
    zone: { min: [-6.0, 0, -1.0], max: [-1.2, 4.6, 1.0] },
    cam: [-1.6, 4.8, 7.2], tgt: [-3.4, 2.1, 0],
  },
  {
    zone: { min: [-1.6, 0.9, -1.0], max: [2.1, 2.0, 1.0] },
    cam: [0.6, 3.5, 5.2], tgt: [0.1, 1.45, 0],
  },
  {
    zone: { min: [1.3, 0.7, -1.1], max: [2.9, 2.2, 0.9] },
    cam: [4.3, 3.1, 4.6], tgt: [2.2, 1.3, -0.2],
  },
  {
    zone: { min: [-6.0, 0, -1.2], max: [8.0, 4.6, 1.3] },
    cam: [6.6, 6.2, 11.0], tgt: [0.9, 1.7, 0],
  },
];

/* ── Referencias, agrupadas por etapa ────────────────────────────────── */
const ANCHORS = [
  { key: 'dirty', at: [-5.6, 4.2, 0], s: 0, dot: DIRTY },
  { key: 'centrifuge', at: [-1.95, 4.62, 0], s: 0 },
  { key: 'magnetic', at: [-2.95, 1.95, 0], s: 0 },
  { key: 'waste', at: [-4.0, 1.05, 0], s: 0 },
  { key: 'gravity', at: [-0.15, 2.02, 0], s: 1 },
  { key: 'skimmer', at: [2.15, 1.68, 0.45], s: 2 },
  { key: 'level', at: [2.45, 2.28, -0.72], s: 2 },
  { key: 'tank', at: [-2.2, 0.32, 1.15], s: 3 },
  { key: 'exchanger', at: [3.6, 1.28, 1.05], s: 3 },
  { key: 'bag', at: [5.08, 1.62, 0.35], s: 3 },
  { key: 'cabinet', at: [6.5, 2.05, 0], s: 3 },
  { key: 'lowOut', at: [7.2, 3.3, 0.35], s: 3, dot: LP },
  { key: 'highOut', at: [7.2, 3.88, -0.12], s: 3, dot: HP },
];
const labelBox = root.querySelector('.tf-c3d-labels');
const labels = ANCHORS.map((a) => {
  const el = document.createElement('b');
  el.textContent = T.labels[a.key];
  if (a.dot) el.style.setProperty('--dot', a.dot);
  labelBox.appendChild(el);
  return { el, s: a.s, v: new THREE.Vector3(...a.at) };
});

/* ── Equipo de la etapa, en lista, para teléfonos ─────────────────────────
   En un lienzo de 350 px los rótulos proyectados tapan la central que
   nombran, así que ahí el CSS los apaga y muestra esta lista. Cambia con el
   riel, y de paso queda leíble por lector de pantalla. */
const eqBox = root.querySelector('.tf-c3d-eq');
function paintEq(i) {
  eqBox.textContent = '';
  ANCHORS.forEach((a) => {
    if (a.s !== i) return;
    const li = document.createElement('li');
    li.textContent = T.labels[a.key];
    if (a.dot) li.style.setProperty('--dot', a.dot);
    eqBox.appendChild(li);
  });
}

/* ── Riel de etapas ──────────────────────────────────────────────────────
   Tres formas de recorrerlo, ninguna atada al scroll: pasar el mouse por
   encima, tabular hasta el botón, o tocarlo. El hover espera un instante
   para que cruzar el riel de punta a punta no dispare cuatro vuelos de
   cámara seguidos; el clic y el foco entran sin demora. Al salir no se
   vuelve atrás: la etapa que el visitante miró último es la que queda. */
const rail = root.querySelector('.tf-c3d-rail');
const HOVER_DELAY = 130;
let hoverTimer = 0;
const buttons = T.stages.map((name, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.innerHTML = '<span class="sw"></span><span class="bd"><span class="cd"></span><span class="nm"></span></span>';
  b.querySelector('.cd').textContent = T.codes[i];
  b.querySelector('.nm').textContent = name;
  const go = () => { clearTimeout(hoverTimer); setStage(i, true); };
  b.addEventListener('click', go);
  b.addEventListener('focus', go);
  b.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse') return; // en táctil ya llega el clic
    // Bajando la página, el riel pasa por debajo de un mouse quieto y el
    // navegador manda un pointerenter que nadie pidió. Si la página se
    // acaba de mover, no es un gesto: se ignora.
    if (pageScroll.scrolling()) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => setStage(i, true), HOVER_DELAY);
  });
  b.addEventListener('pointerleave', () => clearTimeout(hoverTimer));
  rail.appendChild(b);
  return b;
});

/* ── Estado del recorrido ────────────────────────────────────────────── */
const camPos = new THREE.Vector3().fromArray(STAGES[0].cam);
const camTgt = new THREE.Vector3().fromArray(STAGES[0].tgt);
const zoneCtr = new THREE.Vector3();
const zoneSize = new THREE.Vector3(1, 1, 1);
let current = -1;
let manual = false;

/* Encuadre: el ángulo de cada etapa es el del diseño, pero la distancia se
   calcula. Los valores del prototipo están hechos para un marco 16/9; en el
   4/3 de un teléfono el mismo encaje recorta el equipo por los costados,
   porque el FOV de three.js es vertical. Acá se conserva la dirección de la
   cámara y se la aleja hasta que la zona de la etapa entra entera —por el
   lado que quede más ajustado, alto o ancho—. Así la etapa 4, que abarca la
   central completa, muestra también las dos salidas del extremo derecho. */
const FIT = 1.07;
const corner = new THREE.Vector3();
const dir = new THREE.Vector3();
const fwd = new THREE.Vector3();
const right = new THREE.Vector3();
const up = new THREE.Vector3();
const UP_AXIS = new THREE.Vector3(0, 1, 0);
function fitStage(i) {
  const st = STAGES[i];
  const { min, max } = st.zone;
  camTgt.fromArray(st.tgt);

  // Base de la cámara para la dirección de diseño de esta etapa.
  dir.fromArray(st.cam).sub(camTgt).normalize();
  fwd.copy(dir).negate();
  right.copy(fwd).cross(UP_AXIS).normalize();
  up.copy(right).cross(fwd).normalize();

  const cam = stage.camera;
  const tanV = Math.tan(((cam.fov * Math.PI) / 180) / 2) / FIT;
  const tanH = tanV * (cam.aspect || 16 / 9);

  // La distancia del prototipo es el piso: en 16/9 el encuadre es el que se
  // aprobó, tal cual. De ahí para atrás sólo se aleja, y sólo lo necesario
  // para que las ocho esquinas de la zona entren en el frustum —para cada
  // una, |lateral| ≤ tan · (profundidad + d)—. Así un marco angosto nunca
  // recorta el equipo y uno ancho nunca lo achica.
  let d = corner.fromArray(st.cam).distanceTo(camTgt);
  for (let c = 0; c < 8; c++) {
    corner.set(c & 1 ? max[0] : min[0], c & 2 ? max[1] : min[1], c & 4 ? max[2] : min[2]).sub(camTgt);
    const z = corner.dot(fwd);
    d = Math.max(d, Math.abs(corner.dot(right)) / tanH - z, Math.abs(corner.dot(up)) / tanV - z);
  }

  camPos.copy(camTgt).addScaledVector(
    dir,
    Math.min(Math.max(d, stage.controls.minDistance), stage.controls.maxDistance),
  );
}

/** Qué carcasa se abre en cada etapa para ver el fluido por dentro. */
const CUTAWAY = [
  [MAT.gCent, MAT.gMag],
  [MAT.gTela],
  [MAT.gCuba, MAT.gNivel],
  [MAT.gCuba, MAT.gNivel, MAT.gBolsa],
];
const ALL_GHOSTS = [MAT.gCent, MAT.gMag, MAT.gTela, MAT.gCuba, MAT.gNivel, MAT.gBolsa];
function cutaway(i) {
  const open = CUTAWAY[i];
  for (const m of ALL_GHOSTS) {
    const isOpen = open.indexOf(m) >= 0;
    m.transparent = isOpen;
    m.opacity = isOpen ? (m === MAT.gNivel ? 0.42 : 0.14) : 1;
    m.depthWrite = !isOpen;
    m.needsUpdate = true;
  }
}

stage.controls.addEventListener('start', () => { manual = true; });

function setStage(i, fly) {
  if (i === current && !fly) return;
  current = i;
  if (fly) manual = false;
  fitStage(i);
  const { min, max } = STAGES[i].zone;
  zoneCtr.set((min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2);
  zoneSize.set(max[0] - min[0], max[1] - min[1], max[2] - min[2]);
  cutaway(i);
  paintEq(i);
  buttons.forEach((b, n) => b.setAttribute('aria-current', n === i ? 'step' : 'false'));
  labels.forEach((l) => l.el.classList.toggle('is-on', l.s === i));
}
// Un pase por la etapa 4 deja materiales y foco inicializados; el visor
// abre en la 1, que es donde empieza el recorrido del fluido.
setStage(STAGES.length - 1, true);
setStage(0, true);

// Cambia el ancho del marco (rotar el teléfono, arrastrar la ventana) y el
// encaje se rehace. Si el visitante ya movió la cámara, no se le pisa.
window.addEventListener('resize', () => { if (!manual && current >= 0) fitStage(current); });

const COLOR_OF = { dirty: DIRTY, semi: SEMI, clean: CLEAN, oil: OIL, ferrous: FERROUS, cloth: CLOTH };
const keyBox = root.querySelector('.tf-c3d-key');
T.fluids.forEach((f) => {
  const row = document.createElement('div');
  row.innerHTML = '<i></i><span></span>';
  row.querySelector('i').style.background = COLOR_OF[f.k];
  row.querySelector('span').textContent = f.t;
  keyBox.appendChild(row);
});

/* ── Frame: vuelo de cámara, foco, giros y etiquetas ─────────────────── */
const v = new THREE.Vector3();

// Con «menos movimiento» la central queda quieta y la cámara no vuela: se
// planta en la etapa de una. Las flechas siguen diciendo el sentido del
// flujo y el corte sigue abriendo la carcasa, así que no se pierde nada de
// lo que el diagrama tiene para contar.
const still = window.matchMedia('(prefers-reduced-motion: reduce)');

// Marcos angostos: trece rótulos no entran sin taparse entre ellos ni tapar
// el equipo. Se muestran sólo los de la etapa activa —que es justo lo que el
// riel acaba de pedir— y el resto espera su turno. Por debajo de 560 px el
// CSS los apaga del todo y manda la lista de equipo.
const compactQuery = window.matchMedia('(max-width: 860px)');
let compact = compactQuery.matches;
compactQuery.addEventListener('change', (e) => { compact = e.matches; });

// Medidas propias de cada rótulo: sólo cambian con el idioma y con el ancho
// del marco. Leerlas por frame y por etiqueta forzaría un layout cada vez.
let lastW = 0;
let lastH = 0;

stage.addFrameHook((t) => {
  const cam = stage.camera;
  const ctl = stage.controls;
  const snap = still.matches;
  if (!manual) {
    cam.position.lerp(camPos, snap ? 1 : 0.055);
    ctl.target.lerp(camTgt, snap ? 1 : 0.055);
  }
  FOCUS.position.lerp(zoneCtr, snap ? 1 : 0.08);
  FOCUS.scale.lerp(zoneSize, snap ? 1 : 0.08);

  if (snap) {
    statusLight.material.emissiveIntensity = 1.1;
  } else {
    flowDots.forEach((d) => {
      d.curve.getPointAt((d.t + t * d.sp) % 1, v);
      d.mesh.position.copy(v);
    });
    bowl.rotation.y = t * 7;
    drum.rotation.y = -t * 1.4;
    beltRolls.forEach((r) => { r.rotation.y = -t * 0.9; });
    cloth.rotation.y = -t * 0.35;
    disc.rotation.y = t * 1.1;
    pump.rotation.x = t * 5;
    statusLight.material.emissiveIntensity = 0.5 + 0.9 * (0.5 + 0.5 * Math.sin(t * 2.2));
  }

  const w = labelBox.clientWidth;
  const h = labelBox.clientHeight;
  if (!w || !h) return;
  if (w !== lastW || h !== lastH) {
    lastW = w;
    lastH = h;
    labels.forEach((l) => { l.w = l.el.offsetWidth; l.h = l.el.offsetHeight; });
  }

  // El transform es translate(-50%, -100%): `left` es el centro y `top` el
  // borde inferior. Las que quedan más cerca de la cámara mandan; las de
  // atrás suben hasta despejar y, si arriba no hay lugar, bajan.
  //
  // La clave de colores entra como una caja más: así ningún rótulo termina
  // encima de ella. En un marco de teléfono es la mitad del alto útil, y sin
  // esto los dos bloques de texto se pisan.
  const placed = [];
  const kb = keyBox.getBoundingClientRect();
  if (kb.width) {
    const fb = labelBox.getBoundingClientRect();
    placed.push({
      x: kb.left - fb.left + kb.width / 2,
      y: kb.bottom - fb.top,
      w: kb.width + 8,
      h: kb.height + 8,
    });
  }
  labels
    .map((l) => {
      v.copy(l.v).project(cam);
      return { l, x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h, z: v.z };
    })
    .sort((a, b) => a.z - b.z)
    .forEach((p) => {
      const { l } = p;
      const on = l.s === current;
      const hidden = p.z >= 1 || Math.abs(p.x - w / 2) > w * 0.52 || (compact && !on);
      l.el.style.opacity = hidden ? '0' : on ? '1' : '0.42';
      if (hidden) return;

      const halfW = l.w / 2;
      const x = Math.min(Math.max(p.x, halfW + 4), w - halfW - 4);
      let y = Math.min(Math.max(p.y, l.h + 4), h - 4);

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
        y = up - l.h > 4 ? up : q.y + l.h + 6;
      }
      y = Math.min(Math.max(y, l.h + 4), h - 4);

      // Antes que dejar dos rótulos ilegibles encima, se oculta el de más
      // atrás: vuelve solo en cuanto la cámara se mueve, y la clave de
      // colores y el aria-label siguen nombrando todo.
      if (clashes(y)) {
        l.el.style.opacity = '0';
        return;
      }

      placed.push({ x, y, w: l.w, h: l.h });
      l.el.style.left = x.toFixed(1) + 'px';
      l.el.style.top = y.toFixed(1) + 'px';
    });
});
