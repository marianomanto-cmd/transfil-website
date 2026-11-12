/**
 * Central de filtración Trans-Fil — escena para el recorrido en video.
 *
 * Misma geometría que public/js/central3d.js del sitio (metros, apoyada en
 * y = 0, el proceso se lee de izquierda a derecha), con lo que un video
 * necesita y un diagrama interactivo no: materiales con reflejos, piezas
 * que giran (tambor, disco, rodillos, rollo de tela), anillos que corren
 * por los caños con el color del fluido, una pantalla en el tablero, el
 * piso de una nave y un operario para la escala.
 *
 * Todo lo que se mueve depende sólo de `t` (segundos): cada frame se puede
 * renderizar suelto, en cualquier orden.
 */
import * as THREE from 'three';

export const COLORS = {
  dirty: '#6b4a2a',   // soluble contaminado
  semi: '#c9b39a',    // sin finos ferrosos
  clean: '#4ec3f0',   // soluble limpio
  cloth: '#3cb878',   // tela filtrante
  oil: '#7a5220',     // aceite atrapado
  ferrous: '#8f5c2d', // finos ferrosos
  lp: '#7fd4ff',
  hp: '#16a3d8',
};

export function buildScene() {
  const C = COLORS;
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const phys = (o) => new THREE.MeshPhysicalMaterial(o);

  const MAT = {
    transfil: phys({ name: 'transfil-azul', color: 0x2d6fd8, roughness: 0.38, metalness: 0.2, clearcoat: 0.35, clearcoatRoughness: 0.4 }),
    estructura: std({ name: 'estructura', color: 0x454a54, roughness: 0.55, metalness: 0.15 }),
    maquina: std({ name: 'maquina', color: 0x868b95, roughness: 0.45, metalness: 0.2 }),
    oscuro: std({ name: 'oscuro', color: 0x1a1c21, roughness: 0.7, metalness: 0.15 }),
    acero: std({ name: 'acero', color: 0xc3c8cf, roughness: 0.3, metalness: 0.25 }),
    sucio: std({ name: 'soluble-sucio', color: 0x7d5530, roughness: 0.15, metalness: 0.1 }),
    tela: std({ name: 'tela', color: 0xd9d2c0, roughness: 0.92, metalness: 0.0 }),
    torta: std({ name: 'torta', color: 0x8a6a3e, roughness: 0.9, metalness: 0.05 }),
    amarillo: std({ name: 'amarillo-seguridad', color: 0xf2c230, roughness: 0.55, metalness: 0.1 }),
    gCent: phys({ name: 'carcasa-centrifuga', color: 0x2d6fd8, roughness: 0.38, metalness: 0.2, clearcoat: 0.35 }),
    gTela: std({ name: 'carcasa-tela', color: 0xd9d2c0, roughness: 0.9, metalness: 0.0 }),
    gMag: std({ name: 'carcasa-magnetico', color: 0x868b95, roughness: 0.45, metalness: 0.2 }),
    gCuba: phys({ name: 'carcasa-cuba', color: 0x2d6fd8, roughness: 0.38, metalness: 0.2, clearcoat: 0.35 }),
    gNivel: std({ name: 'espejo-soluble', color: 0x4ec3f0, roughness: 0.08, metalness: 0.05, emissive: 0x1d6f93, emissiveIntensity: 0.35 }),
    gBolsa: phys({ name: 'carcasa-filtro-bolsa', color: 0x2d6fd8, roughness: 0.38, metalness: 0.2, clearcoat: 0.35 }),
  };
  const fluidMat = (hex, e) => std({
    color: new THREE.Color(hex), roughness: 0.25, metalness: 0.05,
    emissive: new THREE.Color(hex), emissiveIntensity: e ?? 0.45,
  });
  const FLUID = {
    dirty: fluidMat(C.dirty, 0.35), semi: fluidMat(C.semi, 0.4), clean: fluidMat(C.clean, 0.55),
    oil: fluidMat(C.oil, 0.35), ferrous: fluidMat(C.ferrous, 0.3), cloth: fluidMat(C.cloth, 0.3),
    lp: fluidMat(C.lp, 0.5), hp: fluidMat(C.hp, 0.5),
  };
  // Anillos de flujo: un tono más claro y más brillante que el fluido.
  const ringMat = (hex) => new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).lerp(new THREE.Color('#ffffff'), 0.45) });
  const RING = {
    dirty: ringMat('#a8784a'), semi: ringMat(C.semi), clean: ringMat(C.clean), oil: ringMat('#a8742e'),
    ferrous: ringMat('#b07a45'), cloth: ringMat(C.cloth), lp: ringMat(C.lp), hp: ringMat('#3fc1f0'),
  };
  const PIPE = {
    dirty: std({ name: 'caneria-sucia', color: new THREE.Color('#7a5532'), roughness: 0.4, metalness: 0.15 }),
    lp: std({ name: 'caneria-baja', color: new THREE.Color('#5cbfe9'), roughness: 0.35, metalness: 0.1 }),
    hp: std({ name: 'caneria-alta', color: new THREE.Color(C.hp), roughness: 0.35, metalness: 0.1 }),
  };

  const unit = new THREE.Group();
  const spin = []; // { obj, axis, speed(rad/s) | fn(t) }
  const rings = []; // { mesh, curve, len, u0, speed }
  const dots = [];

  function box(name, w, h, d, x, y, z, m) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.name = name; mesh.position.set(x, y, z); return mesh;
  }
  function cyl(name, r, len, x, y, z, m, axis, seg) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, seg || 32), m);
    mesh.name = name; mesh.position.set(x, y, z);
    if (axis === 'x') mesh.rotation.z = Math.PI / 2;
    if (axis === 'z') mesh.rotation.x = Math.PI / 2;
    return mesh;
  }
  function cone(name, rTop, rBot, h, x, y, z, m) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, 40), m);
    mesh.name = name; mesh.position.set(x, y, z); return mesh;
  }
  function curveOf(pts) {
    const c = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
    c.curveType = 'catmullrom'; c.tension = 0.02; return c;
  }
  function pipe(name, pts, m, r) {
    const curve = curveOf(pts);
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, Math.max(60, pts.length * 24), r || 0.05, 16, false), m);
    mesh.name = name;
    return { mesh, curve };
  }
  const Z = new THREE.Vector3(0, 0, 1);
  function ringsOn(curve, r, kind, group, spacing, speed) {
    const len = curve.getLength();
    const n = Math.max(2, Math.round(len / (spacing || 0.55)));
    const geo = new THREE.TorusGeometry(r * 1.18, r * 0.32, 8, 28);
    for (let k = 0; k < n; k++) {
      const mesh = new THREE.Mesh(geo, RING[kind]);
      mesh.name = 'anillo-' + kind;
      group.add(mesh);
      rings.push({ mesh, curve, len, u0: k / n, speed: speed || 0.55, kind });
    }
  }

  /* ── Piso de nave ─────────────────────────────────────────────────── */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    std({ name: 'piso-nave', color: 0xcfd4da, roughness: 0.85, metalness: 0.0 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  unit.add(floor);
  // Juntas del piso de hormigón, cada 2 m.
  const jp = [];
  for (let x = -30; x <= 30; x += 2) jp.push(x, 0.003, -30, x, 0.003, 30);
  for (let z = -30; z <= 30; z += 2) jp.push(-30, 0.003, z, 30, 0.003, z);
  const jg = new THREE.BufferGeometry();
  jg.setAttribute('position', new THREE.Float32BufferAttribute(jp, 3));
  unit.add(new THREE.LineSegments(jg, new THREE.LineBasicMaterial({ color: 0xa9b0b8, transparent: true, opacity: 0.55 })));
  // Senda peatonal amarilla alrededor de la central.
  const lane = (x1, z1, x2, z2) => {
    const w = 0.1;
    const dx = x2 - x1; const dz = z2 - z1;
    const l = Math.hypot(dx, dz);
    const m = box('senda', dx === 0 ? w : l, 0.006, dz === 0 ? w : l, (x1 + x2) / 2, 0.004, (z1 + z2) / 2, MAT.amarillo);
    m.receiveShadow = true; unit.add(m);
  };
  lane(-6.4, -1.9, 8.4, -1.9); lane(-6.4, 1.9, 8.4, 1.9); lane(-6.4, -1.9, -6.4, 1.9); lane(8.4, -1.9, 8.4, 1.9);

  /* ── F04 · cuba, bombeo, temperado, filtros bolsa y tablero ─────── */
  const tank = new THREE.Group();
  tank.add(box('cuba-fondo', 5.2, 0.07, 1.8, 0, 0.035, 0, MAT.transfil));
  tank.add(box('cuba-pared-oeste', 0.07, 1.0, 1.8, -2.565, 0.5, 0, MAT.transfil));
  tank.add(box('cuba-pared-este', 0.07, 1.0, 1.8, 2.565, 0.5, 0, MAT.transfil));
  tank.add(box('cuba-pared-fondo', 5.2, 1.0, 0.07, 0, 0.5, -0.865, MAT.transfil));
  tank.add(box('cuba-pared-frente', 5.2, 1.0, 0.07, 0, 0.5, 0.865, MAT.gCuba));
  tank.add(box('cuba-baranda-frente', 5.34, 0.07, 0.09, 0, 1.0, 0.865, MAT.estructura));
  tank.add(box('cuba-baranda-fondo', 5.34, 0.07, 0.09, 0, 1.0, -0.865, MAT.estructura));
  tank.add(box('cuba-baranda-oeste', 0.09, 0.07, 1.84, -2.565, 1.0, 0, MAT.estructura));
  tank.add(box('cuba-baranda-este', 0.09, 0.07, 1.84, 2.565, 1.0, 0, MAT.estructura));
  // Refuerzos verticales de la pared del frente, como una cuba soldada.
  for (let i = 0; i < 6; i++) tank.add(box('cuba-refuerzo', 0.06, 0.9, 0.05, -2.2 + i * 0.88, 0.5, 0.91, MAT.gCuba));
  const level = box('nivel-soluble-limpio', 5.06, 0.02, 1.66, 0, 0.76, 0, MAT.gNivel);
  tank.add(level);
  // Cuerpo del soluble dentro de la cuba (se ve con la pared abierta).
  const bath = box('soluble-en-cuba', 5.06, 0.7, 1.66, 0, 0.41, 0, std({
    color: 0x4ec3f0, roughness: 0.1, metalness: 0, transparent: true, opacity: 0.0, depthWrite: false,
    emissive: 0x1d6f93, emissiveIntensity: 0.25,
  }));
  tank.add(bath);
  for (const lx of [-2.3, 2.3]) tank.add(box('cuba-pata', 0.18, 0.1, 1.6, lx, 0.05, 0, MAT.estructura));
  unit.add(tank);

  const skid = new THREE.Group();
  skid.add(box('bomba-skid', 0.8, 0.7, 0.8, 3.3, 0.35, -0.45, MAT.estructura));
  skid.add(cyl('bomba', 0.2, 0.62, 3.3, 0.85, -0.45, MAT.maquina, 'x', 32));
  skid.add(cyl('bomba-motor', 0.17, 0.42, 3.78, 0.85, -0.45, MAT.transfil, 'x', 32));
  // Acople a la vista: gira con la bomba.
  const coupling = new THREE.Group();
  coupling.position.set(3.58, 0.85, -0.45);
  for (let i = 0; i < 4; i++) {
    const b = box('acople', 0.05, 0.22, 0.04, 0, 0, 0, MAT.amarillo);
    b.rotation.x = (i * Math.PI) / 4; coupling.add(b);
  }
  skid.add(coupling);
  spin.push({ obj: coupling, axis: 'x', speed: 9 });
  skid.add(box('intercambiador-cuna', 1.3, 0.14, 0.7, 3.6, 0.07, 0.55, MAT.estructura));
  skid.add(box('intercambiador-soporte', 0.7, 0.16, 0.5, 3.6, 0.2, 0.55, MAT.estructura));
  skid.add(cyl('intercambiador-bastidor-fijo', 0.5, 0.14, 3.05, 0.66, 0.55, MAT.transfil, 'x', 48));
  skid.add(cyl('intercambiador-bastidor-movil', 0.5, 0.14, 4.15, 0.66, 0.55, MAT.transfil, 'x', 48));
  for (let i = 0; i < 16; i++) skid.add(cyl('placa', 0.46, 0.024, 3.16 + i * 0.058, 0.66, 0.55, MAT.acero, 'x', 40));
  for (const [ty, tz] of [[1.0, 0.88], [1.0, 0.22], [0.32, 0.88], [0.32, 0.22]]) {
    skid.add(cyl('tensor', 0.026, 1.28, 3.6, ty, tz, MAT.estructura, 'x', 12));
  }
  for (const [ny, nz] of [[0.92, 0.55], [0.4, 0.55], [0.66, 0.83], [0.66, 0.27]]) {
    skid.add(cyl('boca', 0.075, 0.26, 2.9, ny, nz, MAT.maquina, 'x', 20));
    skid.add(cyl('brida', 0.1, 0.04, 2.78, ny, nz, MAT.estructura, 'x', 20));
  }
  function bagFilter(n, x) {
    const g = new THREE.Group();
    g.add(cyl(n + '-cuerpo', 0.28, 1.0, x, 0.56, 0.35, MAT.gBolsa, 'y', 48));
    g.add(cyl(n + '-brida', 0.32, 0.05, x, 1.06, 0.35, MAT.estructura, 'y', 48));
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.28, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2), MAT.estructura);
    dome.position.set(x, 1.08, 0.35); g.add(dome);
    g.add(cyl(n + '-base', 0.3, 0.07, x, 0.09, 0.35, MAT.estructura, 'y', 48));
    g.add(cyl(n + '-purga', 0.05, 0.22, x, 0.2, 0.06, MAT.maquina, 'z', 16));
    g.add(cyl(n + '-manometro', 0.06, 0.05, x, 0.95, 0.08, MAT.acero, 'z', 20));
    g.add(cyl(n + '-valvula', 0.09, 0.04, x, 0.62, -0.02, MAT.estructura, 'z', 20));
    // Bolsa filtrante adentro: se ve cuando la carcasa se abre.
    g.add(cyl(n + '-bolsa', 0.2, 0.78, x, 0.6, 0.35, std({ color: 0xf1ede2, roughness: 0.95 }), 'y', 32));
    return g;
  }
  skid.add(bagFilter('filtro-bolsa-1', 4.7));
  skid.add(bagFilter('filtro-bolsa-2', 5.45));
  skid.add(box('filtros-manifold', 0.78, 0.08, 0.1, 5.08, 0.78, 0.05, MAT.estructura));
  const bridge = pipe('puente-filtros', [[4.7, 1.24, 0.1], [5.08, 1.36, 0.1], [5.45, 1.24, 0.1]], PIPE.lp, 0.042);
  skid.add(bridge.mesh);

  // Tablero con PLC y pantalla.
  skid.add(box('tablero', 0.9, 1.8, 0.62, 6.5, 0.9, 0, MAT.transfil));
  skid.add(box('tablero-tapa', 0.96, 0.07, 0.68, 6.5, 1.83, 0, MAT.estructura));
  skid.add(box('tablero-zocalo', 0.94, 0.1, 0.66, 6.5, 0.05, 0, MAT.estructura));
  skid.add(box('tablero-marco-pantalla', 0.66, 0.48, 0.03, 6.5, 1.36, 0.315, MAT.estructura));
  const hmiCanvas = document.createElement('canvas');
  hmiCanvas.width = 512; hmiCanvas.height = 320;
  const hmiTex = new THREE.CanvasTexture(hmiCanvas);
  hmiTex.colorSpace = THREE.SRGBColorSpace;
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.58, 0.4),
    new THREE.MeshBasicMaterial({ map: hmiTex, toneMapped: false })
  );
  screen.position.set(6.5, 1.36, 0.333);
  skid.add(screen);
  skid.add(box('tablero-puerta', 0.78, 1.0, 0.02, 6.5, 0.6, 0.315, MAT.transfil));
  skid.add(cyl('tablero-manija', 0.03, 0.16, 6.84, 0.6, 0.33, MAT.acero, 'y', 12));
  const statusLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0x4ade80, emissive: 0x4ade80, emissiveIntensity: 2.2, roughness: 0.4 })
  );
  statusLight.position.set(6.34, 1.04, 0.33);
  skid.add(statusLight);
  const amberLight = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0xf5b301, emissive: 0xf5b301, emissiveIntensity: 0, roughness: 0.4 })
  );
  amberLight.position.set(6.5, 1.04, 0.33);
  skid.add(amberLight);
  skid.add(cyl('tablero-luz-roja', 0.035, 0.03, 6.66, 1.04, 0.33, std({ color: 0x5a1d1d, roughness: 0.4 }), 'z', 16));
  for (let i = 0; i < 4; i++) skid.add(cyl('tablero-boton', 0.022, 0.03, 6.88, 1.5 - i * 0.14, 0.2, MAT.maquina, 'z', 12));
  unit.add(skid);

  /* ── F01 · entrada, centrífuga y separador magnético ───────────────── */
  const inlet = new THREE.Group();
  const inPipe = pipe('entrada-soluble-contaminado', [
    [-5.6, 0.35, 0], [-5.6, 3.55, 0], [-5.6, 3.9, 0], [-2.55, 3.9, 0], [-2.2, 3.78, 0],
  ], PIPE.dirty, 0.06);
  inlet.add(inPipe.mesh);
  ringsOn(inPipe.curve, 0.06, 'dirty', inlet, 0.6, 0.9);
  // Soportes del caño de entrada.
  inlet.add(box('soporte-entrada', 0.08, 3.9, 0.08, -5.6, 1.95, -0.16, MAT.estructura));
  inlet.add(box('soporte-entrada-pie', 0.4, 0.04, 0.4, -5.6, 0.02, -0.16, MAT.estructura));

  inlet.add(box('centrifuga-plataforma', 1.3, 0.1, 1.3, -1.95, 2.45, 0, MAT.estructura));
  inlet.add(cone('centrifuga-tolva', 0.48, 0.16, 0.6, -1.95, 2.8, 0, MAT.gCent));
  inlet.add(cyl('centrifuga-bol', 0.48, 1.0, -1.95, 3.6, 0, MAT.gCent, 'y', 56));
  inlet.add(box('centrifuga-boca', 0.42, 0.3, 0.3, -2.42, 3.86, 0, MAT.estructura));
  inlet.add(cyl('centrifuga-boca-brida', 0.19, 0.05, -2.64, 3.86, 0, MAT.maquina, 'x', 24));
  const centFluid = std({ color: 0x8a6440, roughness: 0.2, transparent: true, opacity: 0.55, emissive: 0x3a2412, emissiveIntensity: 0.3, depthWrite: false });
  inlet.add(cyl('centrifuga-nivel', 0.44, 0.55, -1.95, 3.42, 0, centFluid, 'y', 48));
  inlet.add(cyl('centrifuga-tolva-nivel', 0.4, 0.18, -1.95, 3.04, 0, centFluid, 'y', 40));
  inlet.add(cyl('centrifuga-aro', 0.51, 0.08, -1.95, 4.14, 0, MAT.estructura, 'y', 56));
  inlet.add(box('centrifuga-motor', 0.4, 0.32, 0.4, -1.95, 4.34, 0, MAT.maquina));
  // Rotor de la centrífuga: gira; se ve cuando la carcasa se abre.
  const rotor = new THREE.Group();
  rotor.position.set(-1.95, 3.55, 0);
  rotor.add(cyl('rotor-eje', 0.05, 1.1, 0, 0, 0, MAT.acero, 'y', 16));
  for (let i = 0; i < 6; i++) {
    const v = box('rotor-paleta', 0.36, 0.7, 0.03, 0, -0.05, 0, MAT.acero);
    v.rotation.y = (i * Math.PI) / 6; rotor.add(v);
  }
  inlet.add(rotor);
  spin.push({ obj: rotor, axis: 'y', speed: 8 });

  inlet.add(pipe('centrifuga-a-magnetico', [[-1.95, 2.5, 0], [-1.95, 2.42, 0], [-1.95, 2.3, 0]], PIPE.dirty, 0.055).mesh);
  inlet.add(box('magnetico-bastidor', 1.15, 0.1, 1.5, -1.95, 2.35, 0, MAT.estructura));
  for (const sx of [-2.45, -1.45]) inlet.add(box('magnetico-columna', 0.1, 0.9, 1.5, sx, 1.9, 0, MAT.estructura));
  // Tambor magnético con costillas: así se lee que gira.
  const drum = new THREE.Group();
  drum.position.set(-1.95, 1.72, 0);
  const drumBody = cyl('tambor', 0.42, 1.25, 0, 0, 0, MAT.acero, 'z', 48);
  drum.add(drumBody);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const rib = box('tambor-iman', 0.06, 0.035, 1.22, Math.cos(a) * 0.43, Math.sin(a) * 0.43, 0, MAT.oscuro);
    rib.rotation.z = a; drum.add(rib);
  }
  inlet.add(drum);
  spin.push({ obj: drum, axis: 'z', speed: -1.4 });
  inlet.add(cyl('tambor-eje', 0.07, 1.6, -1.95, 1.72, 0, MAT.acero, 'z', 16));
  inlet.add(box('magnetico-rasqueta', 0.28, 0.1, 1.3, -2.44, 1.86, 0, MAT.amarillo));
  inlet.add(box('magnetico-carcasa', 1.24, 0.62, 1.42, -1.95, 1.9, 0, MAT.gMag));
  const chuteBox = box('magnetico-canaleta', 0.95, 0.07, 0.62, -2.62, 1.52, -0.3, MAT.estructura);
  chuteBox.rotation.z = 0.42; inlet.add(chuteBox);
  const chuteWall = box('magnetico-canaleta-borde', 0.95, 0.16, 0.05, -2.62, 1.58, -0.61, MAT.estructura);
  chuteWall.rotation.z = 0.42; inlet.add(chuteWall);
  for (const px of [-2.42, -1.48]) {
    inlet.add(box('magnetico-pata', 0.1, 1.45, 0.14, px, 0.72, -0.62, MAT.estructura));
    inlet.add(box('magnetico-pata', 0.1, 1.45, 0.14, px, 0.72, 0.62, MAT.estructura));
  }
  inlet.add(box('magnetico-motor', 0.26, 0.26, 0.3, -1.95, 1.72, -0.82, MAT.transfil));
  inlet.add(cyl('bomba-pozo', 0.2, 0.26, -4.95, 0.3, 0, MAT.maquina, 'x', 32));
  inlet.add(cyl('bomba-pozo-motor', 0.16, 0.3, -5.22, 0.3, 0, MAT.transfil, 'x', 32));
  inlet.add(cyl('bomba-pozo-brida', 0.23, 0.04, -4.8, 0.3, 0, MAT.estructura, 'x', 32));
  inlet.add(box('bomba-pozo-base', 0.62, 0.14, 0.42, -5.05, 0.07, 0, MAT.estructura));
  inlet.add(pipe('pozo-a-columna', [[-4.95, 0.3, 0], [-5.3, 0.33, 0.0], [-5.6, 0.35, 0]], PIPE.dirty, 0.06).mesh);
  inlet.add(box('deposito-residuos', 0.9, 0.7, 0.9, -4.0, 0.42, 0, MAT.estructura));
  inlet.add(box('deposito-residuos-asa', 0.06, 0.06, 0.4, -3.52, 0.62, 0, MAT.maquina));
  inlet.add(box('residuos-nivel', 0.76, 0.02, 0.76, -4.0, 0.72, 0, MAT.torta));
  inlet.add(box('residuos-borde', 0.96, 0.06, 0.96, -4.0, 0.75, 0, MAT.maquina));
  for (const wz of [-0.32, 0.32]) inlet.add(cyl('residuos-rueda', 0.09, 0.08, -4.0, 0.09, wz, MAT.oscuro, 'z', 20));
  unit.add(inlet);

  /* ── F02 · filtro de banda por gravedad ────────────────────────────── */
  const belt = new THREE.Group();
  belt.add(box('banda-bastidor', 2.5, 0.12, 1.55, -0.15, 1.34, 0, MAT.estructura));
  belt.add(box('banda-tela', 2.36, 0.03, 1.3, -0.15, 1.42, 0, MAT.gTela));
  for (const rx of [-1.4, 1.1]) {
    const roll = new THREE.Group();
    roll.position.set(rx, 1.4, 0);
    roll.add(cyl('polea', 0.17, 1.5, 0, 0, 0, MAT.acero, 'z', 32));
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const s = box('polea-raya', 0.03, 0.02, 1.48, Math.cos(a) * 0.17, Math.sin(a) * 0.17, 0, MAT.oscuro);
      s.rotation.z = a; roll.add(s);
    }
    belt.add(roll);
    spin.push({ obj: roll, axis: 'z', fn: 'belt' });
    belt.add(cyl('polea-buje', 0.07, 1.62, rx, 1.4, 0, MAT.estructura, 'z', 16));
  }
  belt.add(box('banda-torta', 2.24, 0.07, 1.06, -0.15, 1.47, 0, MAT.torta));
  for (let i = 0; i < 6; i++) belt.add(cyl('rodillo-apoyo', 0.06, 1.24, -1.1 + i * 0.42, 1.33, 0, MAT.acero, 'z', 16));
  // Barro retenido sobre la tela: avanza con la tela.
  const cakes = [];
  for (let i = 0; i < 6; i++) {
    for (const cz of [-0.28, 0.28]) {
      const c = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.17, 4), MAT.torta);
      c.rotation.x = Math.PI; c.rotation.y = Math.PI / 4;
      c.position.set(-0.95 + i * 0.42, 1.58, cz);
      belt.add(c); cakes.push({ mesh: c, x0: -0.95 + i * 0.42 });
    }
  }
  for (const bz of [-0.72, 0.72]) belt.add(box('banda-baranda', 2.5, 0.16, 0.06, -0.15, 1.5, bz, MAT.estructura));
  belt.add(box('canal-boquillas', 2.2, 0.14, 0.18, -0.15, 1.78, 0, MAT.estructura));
  for (let i = 0; i < 4; i++) belt.add(box('boquilla', 0.09, 0.2, 0.09, -0.95 + i * 0.53, 1.62, 0, MAT.maquina));
  const clothRoll = new THREE.Group();
  clothRoll.position.set(1.62, 1.62, 0);
  clothRoll.add(cyl('rollo-tela', 0.36, 1.35, 0, 0, 0, MAT.tela, 'z', 48));
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const s = box('rollo-raya', 0.02, 0.02, 1.36, Math.cos(a) * 0.36, Math.sin(a) * 0.36, 0, std({ color: 0xbfb6a0, roughness: 0.9 }));
    s.rotation.z = a; clothRoll.add(s);
  }
  for (const rr of [0.34, 0.26, 0.18]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(rr, 0.012, 8, 48), FLUID.cloth);
    ring.position.set(0, 0, 0.69); clothRoll.add(ring);
  }
  belt.add(clothRoll);
  spin.push({ obj: clothRoll, axis: 'z', fn: 'belt' });
  belt.add(cyl('rollo-eje', 0.06, 1.55, 1.62, 1.62, 0, MAT.acero, 'z', 16));
  unit.add(belt);

  /* ── F03 · skimmer y sensor de nivel ───────────────────────────────── */
  const oil = new THREE.Group();
  const disc = new THREE.Group();
  disc.position.set(2.15, 0.95, 0.45);
  disc.add(cyl('skimmer-disco', 0.52, 0.05, 0, 0, 0, MAT.acero, 'z', 64));
  for (let i = 0; i < 6; i++) {
    const s = box('skimmer-rayo', 0.82, 0.025, 0.056, 0, 0, 0, MAT.maquina);
    s.rotation.z = (i * Math.PI) / 6; disc.add(s);
  }
  oil.add(disc);
  spin.push({ obj: disc, axis: 'z', speed: -0.9 });
  oil.add(box('skimmer-cabezal', 0.5, 0.26, 0.34, 2.15, 1.42, 0.45, MAT.transfil));
  oil.add(box('skimmer-canaleta', 0.6, 0.1, 0.16, 2.62, 1.3, 0.45, MAT.amarillo));
  oil.add(cyl('skimmer-eje', 0.05, 0.5, 2.15, 0.95, 0.45, MAT.acero, 'z', 12));
  const film = box('film-aceite', 1.5, 0.008, 1.2, 1.9, 0.778, -0.2, std({ color: 0x6b4518, roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.85 }));
  oil.add(film);
  oil.add(cyl('skimmer-bandeja', 0.3, 0.06, 2.72, 1.0, 0.45, MAT.estructura, 'y', 32));
  oil.add(box('skimmer-motor', 0.22, 0.22, 0.26, 2.15, 1.42, 0.72, MAT.maquina));
  oil.add(box('sensor-nivel-mensula', 0.16, 0.1, 0.3, 2.45, 1.02, -0.86, MAT.estructura));
  oil.add(box('sensor-nivel-columna', 0.1, 1.0, 0.1, 2.45, 1.4, -0.72, MAT.estructura));
  oil.add(box('sensor-nivel-cabezal', 0.26, 0.14, 0.26, 2.45, 1.97, -0.72, MAT.maquina));
  const floatBall = cyl('sensor-nivel-flotante', 0.16, 0.1, 2.45, 0.79, -0.72, MAT.amarillo, 'y', 24);
  oil.add(floatBall);
  unit.add(oil);

  /* ── Salidas de soluble limpio ─────────────────────────────────────── */
  const outs = new THREE.Group();
  const lpPipe = pipe('salida-baja-presion', [[4.7, 1.3, 0.35], [4.7, 2.85, 0.35], [4.7, 3.15, 0.35], [9.6, 3.15, 0.35]], PIPE.lp, 0.07);
  outs.add(lpPipe.mesh);
  ringsOn(lpPipe.curve, 0.07, 'lp', outs, 0.6, 0.8);
  const hpPipe = pipe('salida-alta-presion', [[5.45, 1.3, 0.35], [5.45, 2.5, 0.35], [5.45, 2.8, -0.12], [5.45, 3.72, -0.12], [9.6, 3.72, -0.12]], PIPE.hp, 0.045);
  outs.add(hpPipe.mesh);
  ringsOn(hpPipe.curve, 0.045, 'hp', outs, 0.45, 1.3);
  // Soportes de las salidas.
  for (const sx of [7.0, 8.6]) {
    outs.add(box('soporte-salida', 0.08, 3.72, 0.08, sx, 1.86, -0.4, MAT.estructura));
    outs.add(box('soporte-salida-brazo', 0.08, 0.06, 0.9, sx, 3.05, 0.0, MAT.estructura));
    outs.add(box('soporte-salida-brazo', 0.08, 0.06, 0.6, sx, 3.62, -0.12, MAT.estructura));
  }
  const toBags = pipe('temperado-a-filtros', [[4.3, 0.88, 0.72], [4.5, 0.88, 0.5], [4.7, 0.88, 0.35]], PIPE.lp, 0.05);
  outs.add(toBags.mesh);
  ringsOn(toBags.curve, 0.05, 'clean', outs, 0.3, 0.6);
  const f2f = pipe('filtro-a-filtro', [[4.7, 0.62, 0.05], [5.08, 0.62, 0.05], [5.45, 0.62, 0.05]], PIPE.lp, 0.045);
  outs.add(f2f.mesh);
  const fromTank = pipe('cuba-a-bomba', [[2.6, 0.6, -0.45], [2.95, 0.6, -0.45], [3.1, 0.7, -0.45]], PIPE.lp, 0.05);
  outs.add(fromTank.mesh);
  ringsOn(fromTank.curve, 0.05, 'clean', outs, 0.25, 0.6);
  const pumpToHx = pipe('bomba-a-temperado', [[3.55, 0.85, -0.45], [2.9, 0.85, -0.2], [2.9, 0.38, 0.38]], PIPE.lp, 0.05);
  outs.add(pumpToHx.mesh);
  ringsOn(pumpToHx.curve, 0.05, 'clean', outs, 0.3, 0.6);
  // Agua de la torre al intercambiador (circuito cerrado), saliendo por detrás.
  const water = std({ color: 0x3aa36b, roughness: 0.4, metalness: 0.3 });
  outs.add(pipe('agua-torre-ida', [[4.15, 0.92, 0.55], [4.4, 0.92, 0.55], [4.4, 0.92, -1.4], [4.4, 0.06, -1.4]], water, 0.04).mesh);
  outs.add(pipe('agua-torre-vuelta', [[4.15, 0.4, 0.55], [4.25, 0.4, 0.55], [4.25, 0.4, -1.55], [4.25, 0.06, -1.55]], water, 0.04).mesh);
  unit.add(outs);

  /* ── Recorrido del fluido dentro de los equipos ────────────────────── */
  const flow = new THREE.Group();
  function leg(name, pts, kind, r, ringSpacing, speed) {
    const p = pipe(name, pts, FLUID[kind], r);
    flow.add(p.mesh);
    ringsOn(p.curve, r, kind, flow, ringSpacing || 0.35, speed || 0.45);
    return p;
  }
  leg('flujo-contaminado-centrifuga', [
    [-1.95, 4.02, 0], [-1.95, 3.4, 0], [-1.95, 2.8, 0], [-1.95, 2.36, 0],
    [-1.95, 2.16, 0], [-1.74, 2.06, 0], [-1.58, 1.88, 0],
  ], 'dirty', 0.044, 0.32, 0.5);
  leg('flujo-sin-finos', [
    [-1.56, 1.84, 0], [-1.6, 1.66, 0], [-1.48, 1.58, 0],
    [-1.2, 1.6, 0], [-0.4, 1.6, 0], [0.4, 1.6, 0], [1.02, 1.6, 0],
  ], 'semi', 0.04, 0.32, 0.45);
  for (let i = 0; i < 5; i++) {
    const x = -1.0 + i * 0.5;
    const c = curveOf([[x, 1.3, 0], [x, 1.05, 0], [x, 0.79, 0]]);
    for (let k = 0; k < 3; k++) {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), FLUID.clean);
      flow.add(d);
      dots.push({ mesh: d, curve: c, u0: k / 3 + i * 0.13, speed: 1.4 });
    }
  }
  leg('flujo-limpio-en-cuba', [[-1.2, 0.42, -0.45], [0.6, 0.42, -0.45], [2.45, 0.42, -0.45]], 'clean', 0.05, 0.4, 0.5);
  leg('flujo-aceite', [
    [1.62, 0.82, 0.45], [2.05, 0.82, 0.45], [2.15, 1.05, 0.45],
    [2.28, 1.32, 0.45], [2.6, 1.32, 0.45], [2.88, 1.32, 0.45],
  ], 'oil', 0.032, 0.25, 0.3);
  leg('flujo-finos-al-deposito', [
    [-1.9, 1.31, 0], [-2.2, 1.38, 0], [-2.36, 1.62, 0], [-2.44, 1.82, 0],
    [-2.66, 1.68, -0.18], [-3.3, 1.34, -0.3], [-3.92, 0.96, -0.3], [-4.0, 0.84, -0.3],
  ], 'ferrous', 0.032, 0.3, 0.35);
  leg('tela-recorrido', [
    [1.52, 1.76, 0.4], [1.18, 1.62, 0.4], [1.04, 1.5, 0.4],
    [-0.2, 1.5, 0.4], [-1.32, 1.5, 0.4], [-1.74, 1.36, 0.4],
    [-2.8, 1.1, 0.4], [-3.95, 0.88, 0.4],
  ], 'cloth', 0.022, 0.3, 0.12);
  unit.add(flow);

  /* ── Operario, para la escala ──────────────────────────────────────── */
  function person(x, z, ry) {
    const g = new THREE.Group();
    const skin = std({ color: 0xd9a77f, roughness: 0.7 });
    const pants = std({ color: 0x2b3a55, roughness: 0.8 });
    const vest = std({ color: 0xf06a1a, roughness: 0.6, emissive: 0x401400, emissiveIntensity: 0.2 });
    const shirt = std({ color: 0x41526e, roughness: 0.8 });
    const helmet = std({ color: 0xf5f5f2, roughness: 0.35 });
    for (const lx of [-0.1, 0.1]) {
      const leg1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.72, 6, 12), pants);
      leg1.position.set(lx, 0.45, 0); g.add(leg1);
      const boot = box('bota', 0.13, 0.08, 0.24, lx, 0.04, 0.04, MAT.oscuro); g.add(boot);
    }
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.46, 8, 16), shirt);
    torso.position.set(0, 1.18, 0); torso.scale.set(1, 1, 0.68); g.add(torso);
    const v = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.36, 8, 16), vest);
    v.position.set(0, 1.2, 0); v.scale.set(1.02, 1, 0.72); g.add(v);
    for (const ax of [-0.25, 0.25]) {
      const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.52, 6, 12), shirt);
      arm.position.set(ax, 1.12, 0.02); arm.rotation.z = ax > 0 ? -0.08 : 0.08; g.add(arm);
    }
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), skin);
    head.position.set(0, 1.6, 0); g.add(head);
    const hat = new THREE.Mesh(new THREE.SphereGeometry(0.135, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), helmet);
    hat.position.set(0, 1.63, 0); g.add(hat);
    const brim = cyl('ala', 0.16, 0.015, 0, 1.635, 0.02, helmet, 'y', 24); g.add(brim);
    g.position.set(x, 0, z); g.rotation.y = ry;
    return g;
  }
  unit.add(person(7.55, 0.95, -0.9));

  unit.traverse((o) => {
    if (o.isMesh && o !== floor) { o.castShadow = true; o.receiveShadow = true; }
  });
  // Los anillos y gotas no proyectan sombra: ensuciarían el piso.
  for (const r of rings) r.mesh.castShadow = false;
  for (const d of dots) d.mesh.castShadow = false;

  return {
    unit, MAT, FLUID, spin, rings, dots, cakes, level, bath, film, floatBall,
    statusLight, amberLight, hmiCanvas, hmiTex,
    ghosts: { centrifuge: [MAT.gCent], magnetic: [MAT.gMag], cloth: [MAT.gTela], tank: [MAT.gCuba], level: [MAT.gNivel], bags: [MAT.gBolsa] },
  };
}
