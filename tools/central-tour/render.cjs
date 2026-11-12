/**
 * Renderiza el recorrido frame a frame en los tres idiomas.
 *   node render.cjs [fps] [desde_frame] [hasta_frame]
 * Retoma solo: si un frame ya existe en los tres idiomas, lo saltea.
 * El servidor estático va en el mismo proceso, así no depende de otro.
 */
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const FPS = Number(process.argv[2] || 25);
const ROOT = path.join(__dirname, 'src');
const OUT = path.join(__dirname, 'frames');
const LANGS = ['es', 'en', 'pt'];
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.woff2': 'font/woff2' };

const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});

(async () => {
  await new Promise((r) => server.listen(4410, r));
  for (const l of LANGS) fs.mkdirSync(path.join(OUT, l), { recursive: true });
  const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  p.on('pageerror', (e) => console.log('pageerror:', e.message));
  await p.goto('http://localhost:4410/index.html');
  await p.waitForFunction(() => window.tour && window.tour.renderAt, null, { timeout: 120000 });
  await p.evaluate(() => window.tour.ready);
  const dur = await p.evaluate(() => window.tour.DURATION);
  const total = Math.round(dur * FPS);
  const from = Number(process.argv[3] || 0);
  const to = Math.min(total, Number(process.argv[4] || total));
  const t0 = Date.now();
  let done = 0;
  for (let f = from; f < to; f++) {
    const name = 'f' + String(f).padStart(5, '0') + '.jpg';
    if (LANGS.every((l) => fs.existsSync(path.join(OUT, l, name)))) continue;
    const t = f / FPS;
    await p.evaluate((t) => window.tour.renderAt(t), t);
    for (const l of LANGS) {
      await p.evaluate(([l, t]) => window.tour.setLang(l, t), [l, t]);
      await p.screenshot({ path: path.join(OUT, l, name), type: 'jpeg', quality: 93, clip: { x: 0, y: 0, width: 1600, height: 900 } });
    }
    await p.evaluate(() => window.tour.setLang('es'));
    done++;
    if (done % 50 === 0) {
      const per = (Date.now() - t0) / done / 1000;
      console.log(`frame ${f + 1}/${to} · ${per.toFixed(2)} s/frame · faltan ~${Math.round(((to - f - 1) * per) / 60)} min`);
    }
  }
  console.log('listo', to - from, 'frames');
  await b.close();
  server.close();
})();
