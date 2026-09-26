// Generates the smaller copies behind every `srcset` on the site and the
// manifest the components read (src/lib/responsive-images.json).
//
//   npm run images
//
// Run it after adding or replacing an image listed below, and commit both the
// new files in public/img and the manifest. Output is WebP at the same
// settings the originals were encoded with (cwebp -q 78 -m 6). A width is only
// generated when it's smaller than the source; the source itself stays the
// largest candidate.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PUBLIC = path.join(ROOT, 'public');
const MANIFEST = path.join(ROOT, 'src/lib/responsive-images.json');

// Photos shown in content blocks (tech tiles, services, landing stages,
// applications backdrop). Posters stay single-file: <video poster> has no srcset.
const PHOTO_WIDTHS = [480, 800, 1200];
const GROUPS = [
  { match: /^(t0\d|s0\d)-.*\.webp$/, exclude: /-poster\.webp$/, widths: PHOTO_WIDTHS },
  { match: /^apps-custom-bg\.webp$/, widths: PHOTO_WIDTHS },
  // Catalog covers: 800px sources, down to an 88px thumbnail on phones.
  { match: /^catalog-.*\.webp$/, widths: [240, 480] },
  // Logo: a 265px PNG drawn at 34–48px.
  { match: /^logo-mark\.png$/, widths: [96] },
];
const VARIANT_RE = /-\d+\.webp$/;

const manifest = {};
const dir = path.join(PUBLIC, 'img');
for (const file of fs.readdirSync(dir).sort()) {
  if (VARIANT_RE.test(file)) continue;
  const group = GROUPS.find((g) => g.match.test(file) && !(g.exclude && g.exclude.test(file)));
  if (!group) continue;
  const src = path.join(dir, file);
  const { width } = await sharp(src).metadata();
  const base = file.replace(/\.[a-z]+$/, '');
  const variants = group.widths.filter((w) => w < width);
  for (const w of variants) {
    const out = path.join(dir, `${base}-${w}.webp`);
    await sharp(src).resize({ width: w }).webp({ quality: 78, effort: 6 }).toFile(out);
    console.log(`${file} → ${path.basename(out)} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
  }
  manifest[`/img/${file}`] = { w: width, variants };
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`manifest: ${Object.keys(manifest).length} images → ${path.relative(ROOT, MANIFEST)}`);
