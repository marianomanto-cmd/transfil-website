/**
 * Recorrido en video de la central de filtración Trans-Fil.
 *
 * Una sola función, renderAt(t), deja la escena, la cámara y los textos en
 * el instante t y dibuja el frame. render.cjs la llama frame a frame desde
 * Playwright y captura la pantalla; no hay requestAnimationFrame.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { buildScene, COLORS } from './scene.js';
import { I18N } from './i18n.js';

const W = 1600;
const H = 900;
const params = new URLSearchParams(location.search);
// Valores por defecto medidos en SwiftShader (2 núcleos): sin mapa de
// entorno ni GTAO un frame tarda ~1 s; con ellos, entre 2 y 4,5 s.
const USE_AO = params.get('ao') === '1';
const SHADOW = Number(params.get('shadow') ?? 2048);
const AA = params.get('aa') !== '0';

/* ── Renderer, escena, luces ───────────────────────────────────────── */
const canvas = document.getElementById('gl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: AA, alpha: true, preserveDrawingBuffer: true });
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(1);
renderer.setSize(W, H, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = SHADOW > 0;
renderer.shadowMap.type = THREE.PCFShadowMap;

const scene = new THREE.Scene();
// Fondo: degradé por CSS detrás del lienzo; la niebla funde el piso con él.
scene.fog = new THREE.Fog(0xe4e9ee, 24, 52);
const pmrem = new THREE.PMREMGenerator(renderer);
if (params.get('env') === '1') scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;

scene.add(new THREE.HemisphereLight(0xf4f8ff, 0xb9b2a4, 1.15));
const key = new THREE.DirectionalLight(0xfff4e4, 2.9);
key.position.set(6, 12, 9);
key.castShadow = true;
key.shadow.mapSize.set(SHADOW || 1024, SHADOW || 1024);
key.shadow.camera.left = -11; key.shadow.camera.right = 12;
key.shadow.camera.top = 8; key.shadow.camera.bottom = -8;
key.shadow.camera.near = 1; key.shadow.camera.far = 40;
key.shadow.bias = -0.00025;
key.shadow.normalBias = 0.02;
key.shadow.radius = 4;
key.target.position.set(1, 0, 0);
scene.add(key, key.target);
const fill = new THREE.DirectionalLight(0xdfe8ff, 0.9);
fill.position.set(-8, 5, 7);
scene.add(fill);
const rim = new THREE.DirectionalLight(0xffffff, 0.8);
rim.position.set(2, 6, -10);
scene.add(rim);

const S = buildScene();
scene.add(S.unit);

const camera = new THREE.PerspectiveCamera(30, W / H, 0.1, 200);

let composer = null;
if (USE_AO) {
  const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: AA ? 4 : 0 });
  composer = new EffectComposer(renderer, rt);
  composer.setPixelRatio(1);
  composer.setSize(W, H);
  composer.addPass(new RenderPass(scene, camera));
  const ao = new GTAOPass(scene, camera, W, H);
  ao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.4, thickness: 1.2, scale: 1.0, samples: 12 });
  ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 });
  ao.blendIntensity = 0.85;
  composer.addPass(ao);
  composer.addPass(new OutputPass());
}

/* ── Línea de tiempo ───────────────────────────────────────────────── */
export const CHAPTERS = [
  { id: 'intro', t0: 0, t1: 8 },
  { id: 'f01', t0: 8, t1: 24 },
  { id: 'f02', t0: 24, t1: 41 },
  { id: 'f03', t0: 41, t1: 55 },
  { id: 'f04', t0: 55, t1: 71 },
  { id: 'outro', t0: 71, t1: 81 },
];
export const DURATION = 81;
const TRANS = 2.6; // segundos de vuelo de cámara al empezar cada capítulo

const v3 = (a) => new THREE.Vector3(...a);
// Pose de cámara al comienzo (A) y al final (B) de cada capítulo.
const SHOTS = {
  intro: { A: { p: [-6.8, 6.4, 12.6], t: [0.9, 1.4, 0], f: 34 }, B: { p: [2.6, 5.6, 14.6], t: [1.3, 1.5, 0], f: 33 } },
  f01: { A: { p: [-0.1, 4.3, 8.8], t: [-3.0, 2.2, 0], f: 34 }, B: { p: [-1.5, 3.9, 8.2], t: [-3.1, 2.1, 0], f: 34 } },
  f02: { A: { p: [1.5, 5.1, 4.7], t: [-0.1, 1.3, 0], f: 36 }, B: { p: [0.3, 4.9, 4.5], t: [-0.3, 1.3, 0], f: 36 } },
  f03: { A: { p: [1.9, 2.9, 4.7], t: [2.0, 0.95, 0.0], f: 34 }, B: { p: [0.7, 3.1, 4.4], t: [1.95, 0.95, 0.0], f: 34 } },
  f04: { A: { p: [2.9, 2.9, 6.6], t: [4.3, 1.1, 0.2], f: 36 }, B: { p: [6.6, 2.7, 6.4], t: [5.6, 1.4, 0.1], f: 36 } },
  outro: { A: { p: [4.6, 7.2, 17.6], t: [1.4, 1.7, 0], f: 33 }, B: { p: [5.4, 7.8, 19.2], t: [1.6, 1.8, 0], f: 33 } },
};

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
const smooth = (a, b, x) => { const k = clamp01((x - a) / (b - a)); return k * k * (3 - 2 * k); };
const lerp = (a, b, k) => a + (b - a) * k;

function chapterAt(t) {
  for (let i = CHAPTERS.length - 1; i >= 0; i--) if (t >= CHAPTERS[i].t0) return i;
  return 0;
}

const camPos = new THREE.Vector3();
const camTgt = new THREE.Vector3();
function poseAt(t) {
  const i = chapterAt(t);
  const c = CHAPTERS[i];
  const shot = SHOTS[c.id];
  let from; let to; let k;
  if (i > 0 && t < c.t0 + TRANS) {
    from = SHOTS[CHAPTERS[i - 1].id].B; to = shot.A; k = easeInOut((t - c.t0) / TRANS);
  } else {
    const s = i > 0 ? c.t0 + TRANS : c.t0;
    from = shot.A; to = shot.B; k = easeSine(clamp01((t - s) / (c.t1 - s)));
  }
  camPos.copy(v3(from.p)).lerp(v3(to.p), k);
  camTgt.copy(v3(from.t)).lerp(v3(to.t), k);
  camera.fov = lerp(from.f, to.f, k);
  camera.position.copy(camPos);
  camera.lookAt(camTgt);
  camera.updateProjectionMatrix();
}

/* ── Cortes: qué carcasas se abren en cada capítulo ────────────────── */
const OPEN = {
  intro: [],
  f01: ['centrifuge', 'magnetic'],
  f02: ['cloth'],
  f03: ['tank', 'level'],
  f04: ['tank', 'level', 'bags'],
  outro: ['centrifuge', 'magnetic', 'tank', 'level'],
};
const GHOST_OPACITY = { centrifuge: 0.13, magnetic: 0.13, cloth: 0.22, tank: 0.12, level: 0.42, bags: 0.16 };
function cutawayAt(t) {
  const i = chapterAt(t);
  const cur = OPEN[CHAPTERS[i].id];
  const prev = i > 0 ? OPEN[CHAPTERS[i - 1].id] : cur;
  const k = smooth(CHAPTERS[i].t0 + 0.4, CHAPTERS[i].t0 + 1.8, t);
  let tankOpen = 0;
  for (const [g, mats] of Object.entries(S.ghosts)) {
    const a = prev.includes(g) ? 1 : 0;
    const b = cur.includes(g) ? 1 : 0;
    const open = lerp(a, b, k);
    if (g === 'tank') tankOpen = open;
    const op = lerp(1, GHOST_OPACITY[g], open);
    for (const m of mats) {
      const tr = op < 0.999;
      if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; }
      m.opacity = op;
      m.depthWrite = !tr;
    }
  }
  return tankOpen;
}

/* ── Proceso: nivel, avance de tela, aceite ────────────────────────── */
const ADV0 = 31.5; const ADV1 = 36.5; // la tela avanza en este tramo de F02
function processAt(t) {
  const rise = smooth(26.5, ADV0, t) - smooth(ADV0, ADV1 + 1, t);
  const level = 0.76 + 0.075 * rise;
  const advancing = t >= ADV0 && t < ADV1;
  const beltDist = 0.012 * t + 0.62 * smooth(ADV0, ADV1, t);
  const oilLeft = 1 - 0.55 * smooth(43, 54, t);
  return { level, rise, advancing, beltDist, oilLeft };
}

/* ── HMI del tablero ───────────────────────────────────────────────── */
function drawHMI(t, P) {
  const c = S.hmiCanvas; const g = c.getContext('2d');
  g.fillStyle = '#0d1520'; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = '#1e5fd0'; g.fillRect(0, 0, c.width, 44);
  g.fillStyle = '#fff'; g.font = '600 24px sans-serif'; g.fillText('TRANS-FIL', 16, 30);
  g.font = '18px monospace'; g.fillStyle = '#cfe3ff'; g.fillText('AUTO', c.width - 72, 30);
  const rows = [['P1', 1], ['CF', 1], ['MAG', 1], ['BND', P.advancing ? 2 : 1], ['SKM', 1], ['P2', 1]];
  rows.forEach(([n, s], i) => {
    const x = 16 + (i % 3) * 160; const y = 70 + Math.floor(i / 3) * 44;
    g.fillStyle = s === 2 ? '#f5b301' : '#22c55e';
    g.beginPath(); g.arc(x + 8, y + 10, 8, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#dbe6f3'; g.font = '20px monospace'; g.fillText(n, x + 24, y + 17);
  });
  const bar = (y, label, v, col) => {
    g.fillStyle = '#8aa0b8'; g.font = '18px monospace'; g.fillText(label, 16, y + 16);
    g.fillStyle = '#22314a'; g.fillRect(110, y, 380, 20);
    g.fillStyle = col; g.fillRect(110, y, 380 * v, 20);
  };
  bar(178, 'LVL', 0.58 + 0.2 * P.rise, '#4ec3f0');
  bar(214, 'ΔP', 0.24 + 0.01 * Math.sin(t), '#22c55e');
  // Tendencia de nivel.
  g.strokeStyle = '#4ec3f0'; g.lineWidth = 2; g.beginPath();
  for (let i = 0; i <= 60; i++) {
    const tt = t - (60 - i) * 0.25;
    const r = smooth(26.5, ADV0, tt) - smooth(ADV0, ADV1 + 1, tt);
    const y = 300 - 40 * r - 4 * Math.sin(tt * 0.9);
    const x = 16 + i * 8;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.stroke();
  S.hmiTex.needsUpdate = true;
}

/* ── Escena en t ───────────────────────────────────────────────────── */
const Zax = new THREE.Vector3(0, 0, 1);
const tmpT = new THREE.Vector3();
function sceneAt(t) {
  const P = processAt(t);
  for (const s of S.spin) {
    let ang;
    if (s.fn === 'belt') ang = -P.beltDist / (s.obj.children[0].geometry.parameters.radiusTop || 0.2);
    else ang = s.speed * t;
    if (s.axis === 'x') s.obj.rotation.x = ang;
    else if (s.axis === 'y') s.obj.rotation.y = ang;
    else s.obj.rotation.z = ang;
  }
  for (const r of S.rings) {
    const u = (((r.u0 + (r.speed * t) / r.len) % 1) + 1) % 1;
    r.curve.getPointAt(u, r.mesh.position);
    r.curve.getTangentAt(u, tmpT);
    r.mesh.quaternion.setFromUnitVectors(Zax, tmpT.normalize());
  }
  for (const d of S.dots) {
    const u = (((d.u0 + d.speed * t) % 1) + 1) % 1;
    d.curve.getPointAt(u, d.mesh.position);
    const s = 0.6 + 0.4 * Math.sin(u * Math.PI);
    d.mesh.scale.setScalar(s);
  }
  // Barro sobre la tela: avanza con la tela hacia la polea de descarga.
  for (const c of S.cakes) {
    const span = 2.3;
    const x = -1.3 + ((((c.x0 + 1.3 - P.beltDist) % span) + span) % span);
    c.mesh.position.x = x;
    const fadeIn = smooth(1.0, 0.75, x);
    const fadeOut = smooth(-1.3, -1.1, x);
    c.mesh.scale.setScalar(Math.max(0.001, Math.min(fadeIn, fadeOut)));
  }
  S.level.position.y = P.level;
  S.floatBall.position.y = P.level + 0.03;
  S.film.position.y = P.level + 0.018;
  S.film.scale.x = P.oilLeft;
  S.film.scale.z = 0.6 + 0.4 * P.oilLeft;
  S.amberLight.material.emissiveIntensity = P.advancing ? 2.4 * (0.6 + 0.4 * Math.sin(t * 9)) : 0;
  const tankOpen = cutawayAt(t);
  S.bath.material.opacity = 0.3 * tankOpen;
  S.bath.scale.y = (P.level - 0.07) / 0.7;
  S.bath.position.y = 0.07 + (P.level - 0.07) / 2;
  drawHMI(t, P);
  return P;
}

/* ── Capa de textos ────────────────────────────────────────────────── */
// Referencias por capítulo: punto 3D, desplazamiento del rótulo en px.
const LABELS = [
  { k: 'inlet', at: [-5.6, 3.2, 0], ch: ['f01'], d: [-40, -80] },
  { k: 'wellPump', at: [-4.95, 0.45, 0], ch: ['f01'], d: [-150, 30] },
  { k: 'centrifuge', at: [-1.95, 4.1, 0.3], ch: ['f01', 'outro'], d: [120, -50] },
  { k: 'drum', at: [-1.95, 1.72, 0.62], ch: ['f01'], d: [190, 40] },
  { k: 'scraper', at: [-2.44, 1.9, 0.62], ch: ['f01'], d: [-210, -40] },
  { k: 'fines', at: [-3.3, 1.34, -0.3], ch: ['f01'], d: [-200, -60] },
  { k: 'waste', at: [-4.0, 0.78, 0.45], ch: ['f01', 'outro'], d: [-60, 90] },
  { k: 'nozzles', at: [-0.15, 1.85, 0.05], ch: ['f02'], d: [-60, -110] },
  { k: 'newCloth', at: [1.62, 1.95, 0.3], ch: ['f02'], d: [90, -80] },
  { k: 'sludge', at: [0.3, 1.62, 0.3], ch: ['f02'], d: [40, -150] },
  { k: 'cloth', at: [-0.7, 1.45, 0.66], ch: ['f02', 'outro'], d: [-170, 70] },
  { k: 'drip', at: [0.5, 1.0, 0], ch: ['f02'], d: [170, 110] },
  { k: 'usedCloth', at: [-1.9, 1.32, 0.4], ch: ['f02'], d: [-180, 40] },
  { k: 'skimmer', at: [2.15, 1.3, 0.5], ch: ['f03', 'outro'], d: [120, -90] },
  { k: 'oil', at: [1.45, 0.8, 0.25], ch: ['f03'], d: [-230, 40] },
  { k: 'oilOut', at: [2.8, 1.33, 0.45], ch: ['f03'], d: [150, 30] },
  { k: 'level', at: [2.45, 2.0, -0.72], ch: ['f03'], d: [60, -90] },
  { k: 'tank', at: [0.2, 0.5, 0.9], ch: ['f03', 'outro'], d: [-140, 80] },
  { k: 'pump', at: [3.3, 0.95, -0.45], ch: ['f04'], d: [-170, -90] },
  { k: 'exchanger', at: [3.6, 1.15, 0.6], ch: ['f04', 'outro'], d: [-120, 110] },
  { k: 'water', at: [4.4, 0.92, -0.8], ch: ['f04'], d: [40, -120] },
  { k: 'bags', at: [5.08, 1.25, 0.35], ch: ['f04', 'outro'], d: [60, 120] },
  { k: 'cabinet', at: [6.5, 1.75, 0.32], ch: ['f04', 'outro'], d: [130, 40] },
  { k: 'lp', at: [4.7, 2.3, 0.35], ch: ['f04', 'outro'], d: [-200, -40] },
  { k: 'hp', at: [5.45, 2.0, 0.35], ch: ['f04', 'outro'], d: [210, -60] },
];

const ov = document.getElementById('ov');
const svg = document.getElementById('leaders');
const labelEls = LABELS.map((l) => {
  const el = document.createElement('div');
  el.className = 'lbl';
  ov.appendChild(el);
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  dot.setAttribute('r', '5');
  svg.appendChild(line); svg.appendChild(dot);
  return { l, el, line, dot, p: new THREE.Vector3(...l.at) };
});

let lang = 'es';
const $ = (id) => document.getElementById(id);

function labelAlpha(t, l) {
  let a = 0;
  CHAPTERS.forEach((c) => {
    if (!l.ch.includes(c.id)) return;
    const s = c.t0 + (c.id === 'intro' ? 1 : TRANS + 0.2);
    a = Math.max(a, smooth(s, s + 0.7, t) * (1 - smooth(c.t1 - 0.5, c.t1, t)));
  });
  return a;
}

const ndc = new THREE.Vector3();
function overlayAt(t) {
  const L = I18N[lang];
  const i = chapterAt(t);
  const c = CHAPTERS[i];
  const P = processAt(t);

  // Capítulo.
  const ch = L.chapters[c.id];
  const cardA = smooth(c.t0 + (i ? 0.6 : 0.4), c.t0 + (i ? 1.4 : 1.2), t) * (1 - smooth(c.t1 - 0.45, c.t1 - 0.05, t));
  $('card').style.opacity = cardA;
  $('card-code').textContent = ch.code || '';
  $('card-code').style.display = ch.code ? '' : 'none';
  $('card-title').textContent = ch.title;
  $('card-desc').textContent = ch.desc;
  const segs = $('steps').children;
  for (let k = 0; k < segs.length; k++) {
    const cc = CHAPTERS[k];
    const f = k < i ? 1 : k > i ? 0 : clamp01((t - cc.t0) / (cc.t1 - cc.t0));
    segs[k].firstChild.style.width = (f * 100).toFixed(2) + '%';
  }

  // Marca.
  $('brand-sub').textContent = L.brand;

  // PLC.
  const hl = {
    f01: ['wellPump', 'centrifuge', 'magnetic'], f02: ['belt', 'level'], f03: ['skimmer', 'level'],
    f04: ['pump', 'dp'], intro: [], outro: [],
  }[c.id];
  const plcA = smooth(8.6, 9.6, t) * (1 - smooth(71.2, 72.2, t));
  $('plc').style.opacity = plcA;
  $('plc-title').textContent = L.plc.title;
  $('plc-mode').textContent = L.plc.mode;
  const rowsBox = $('plc-rows');
  const keys = ['wellPump', 'centrifuge', 'magnetic', 'belt', 'skimmer', 'pump'];
  rowsBox.innerHTML = '';
  for (const k of keys) {
    const row = document.createElement('div');
    row.className = 'row' + (hl.includes(k) ? ' on' : '');
    let state = L.plc.running; let cls = 'ok';
    if (k === 'belt') { state = P.advancing ? L.plc.advancing : L.plc.filtering; cls = P.advancing ? 'warn' : 'ok'; }
    row.innerHTML = `<span class="n"></span><span class="s ${cls}"><i></i><b></b></span>`;
    row.querySelector('.n').textContent = L.plc.rows[k];
    row.querySelector('b').textContent = state;
    rowsBox.appendChild(row);
  }
  const lvl = Math.round(58 + 20 * P.rise);
  $('plc-level-l').textContent = L.plc.level;
  $('plc-level-v').textContent = lvl + ' %';
  $('plc-level-bar').style.width = lvl + '%';
  $('plc-level').className = 'meter' + (hl.includes('level') ? ' on' : '');
  $('plc-dp-l').textContent = L.plc.dp;
  $('plc-dp-v').textContent = L.plc.dpOk;
  $('plc-dp').className = 'meter' + (hl.includes('dp') ? ' on' : '');

  // Clave de colores.
  const legend = $('legend');
  legend.innerHTML = '';
  for (const k of ['dirty', 'semi', 'clean', 'oil', 'ferrous', 'cloth']) {
    const r = document.createElement('div');
    r.innerHTML = '<i></i><span></span>';
    r.querySelector('i').style.background = COLORS[k];
    r.querySelector('span').textContent = L.legend[k];
    legend.appendChild(r);
  }
  legend.style.opacity = smooth(1.5, 2.5, t);

  // Rótulos con línea guía. Primero la caja que pide cada rótulo; después
  // se separan entre sí y de los paneles fijos, siempre en vertical, para
  // que ningún texto tape a otro.
  const boxes = [];
  for (const e of labelEls) {
    e.el.textContent = L.labels[e.l.k];
    const a = labelAlpha(t, e.l);
    ndc.copy(e.p).project(camera);
    e.x = (ndc.x * 0.5 + 0.5) * W;
    e.y = (-ndc.y * 0.5 + 0.5) * H;
    e.a = a > 0.01 && ndc.z < 1 ? a : 0;
    e.el.style.opacity = e.a; e.line.style.opacity = e.a; e.dot.style.opacity = e.a;
    if (!e.a) continue;
    const bw = e.el.offsetWidth; const bh = e.el.offsetHeight;
    const b = { e, w: bw, h: bh, x: e.x + e.l.d[0] - bw / 2, y: e.y + e.l.d[1] - bh / 2 };
    b.x = Math.min(Math.max(b.x, 24), W - bw - 24);
    boxes.push(b);
  }
  const fixed = [];
  const rectOf = (id) => {
    const el = $(id);
    if (Number(el.style.opacity || 1) < 0.05) return;
    fixed.push({ x: el.offsetLeft - 10, y: el.offsetTop - 10, w: el.offsetWidth + 20, h: el.offsetHeight + 20 });
  };
  ['brand', 'plc', 'card', 'legend'].forEach(rectOf);
  const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  for (let it = 0; it < 40; it++) {
    let moved = false;
    for (let i = 0; i < boxes.length; i++) {
      const a = boxes[i];
      for (let j = i + 1; j < boxes.length; j++) {
        const b = boxes[j];
        if (!hit(a, b)) continue;
        const up = a.y + a.h / 2 < b.y + b.h / 2 ? a : b;
        const dn = up === a ? b : a;
        const ov = up.y + up.h - dn.y + 8;
        up.y -= ov / 2; dn.y += ov / 2; moved = true;
      }
      for (const f of fixed) {
        if (!hit(a, f)) continue;
        // Se corre hacia el lado libre más cercano del panel.
        const toTop = a.y + a.h - f.y; const toBot = f.y + f.h - a.y;
        if (f.y > H / 2 || (f.y + f.h > H - 10)) a.y -= toTop; else a.y += toBot;
        moved = true;
      }
      a.y = Math.min(Math.max(a.y, 16), H - a.h - 16);
    }
    if (!moved) break;
  }
  for (const b of boxes) {
    const e = b.e;
    e.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
    const ex = Math.min(Math.max(e.x, b.x), b.x + b.w);
    const ey = Math.min(Math.max(e.y, b.y), b.y + b.h);
    e.line.setAttribute('x1', e.x); e.line.setAttribute('y1', e.y);
    e.line.setAttribute('x2', ex); e.line.setAttribute('y2', ey);
    e.dot.setAttribute('cx', e.x); e.dot.setAttribute('cy', e.y);
  }
}

function renderAt(t) {
  sceneAt(t);
  poseAt(t);
  if (composer) composer.render(); else renderer.render(scene, camera);
  overlayAt(t);
}

window.tour = {
  W, H, DURATION, CHAPTERS,
  renderAt,
  setLang(l, t) { lang = l; if (t !== undefined) { poseAt(t); overlayAt(t); } },
  ready: document.fonts.ready.then(() => true),
};

