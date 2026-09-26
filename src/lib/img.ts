import manifest from './responsive-images.json';

type Entry = { w: number; variants: number[] };
const MANIFEST = manifest as Record<string, Entry>;

/**
 * `srcset` for an image under /public/img, from the smaller copies that
 * `npm run images` generated (name-480.webp, name-800.webp…) plus the
 * original as the widest candidate. Undefined when the image has no copies
 * (videos, posters, anything not in the manifest), so callers can spread it
 * straight onto an <img>.
 */
export function srcSet(src: string | undefined): string | undefined {
  const entry = src ? MANIFEST[src] : undefined;
  if (!src || !entry || entry.variants.length === 0) return undefined;
  const base = src.replace(/\.[a-z]+$/, '');
  return [...entry.variants.map((w) => `${base}-${w}.webp ${w}w`), `${src} ${entry.w}w`].join(', ');
}
