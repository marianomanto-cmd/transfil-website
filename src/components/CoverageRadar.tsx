type Country = {
  code: string;
  label: string;
  x: number;
  y: number;
  // Label offset from the dot (in viewBox units) and anchor side.
  lx?: number;
  ly?: number;
  anchor?: 'start' | 'end' | 'middle';
  hq?: boolean;
};

// Coordinate system: lon −117..−30 → x 0..100, lat 33..−57 → y 0..115.
// Dots placed on capital cities so they land on land, not in the ocean.
const COUNTRIES: Country[] = [
  // Córdoba (HQ) — Argentina
  { code: 'AR', label: 'ARGENTINA', x: 60.9, y: 81.8, lx: 3, ly: 0.8, anchor: 'start', hq: true },
  { code: 'BR', label: 'BRASIL',    x: 79.3, y: 62.6, lx: 3, ly: 0.8, anchor: 'start' },
  { code: 'CL', label: 'CHILE',     x: 52.9, y: 84.3, lx: -3, ly: 0.8, anchor: 'end' },
  { code: 'PE', label: 'PERÚ',      x: 46.0, y: 57.5, lx: -3, ly: 0.8, anchor: 'end' },
  { code: 'BO', label: 'BOLIVIA',   x: 58.6, y: 66.5, lx: 3, ly: 0.8, anchor: 'start' },
  { code: 'UY', label: 'URUGUAY',   x: 70.1, y: 86.9, lx: 3, ly: 0.8, anchor: 'start' },
  { code: 'CO', label: 'COLOMBIA',  x: 49.4, y: 35.7, lx: -3, ly: 0.8, anchor: 'end' },
  { code: 'EC', label: 'ECUADOR',   x: 44.8, y: 42.1, lx: -3, ly: 0.8, anchor: 'end' },
  { code: 'MX', label: 'MÉXICO',    x: 20.7, y: 17.9, lx: 3, ly: 0.8, anchor: 'start' },
];

// ── South America silhouette (≈35 vertices, coastlines from lat/lon) ──
const SOUTH_AMERICA =
  'M 52.9 26.8 L 57.5 29.4 L 64.4 29.4 L 71.3 35.7 L 77 42.1 L 84 43.5 L 90.8 46 ' +
  'L 94.3 52.4 L 89.7 58.8 L 88.5 67.7 L 85.1 71.6 L 81.6 72.8 L 78 76.5 L 75.9 80.5 ' +
  'L 71.3 86.9 L 69 90.7 L 63.2 92 L 59.8 97 L 57.5 100.9 L 55.2 108.6 L 59.8 111.1 ' +
  'L 51.7 111.1 L 50.6 108.6 L 48.3 100.9 L 50.6 95.8 L 50.6 89.4 L 51.7 84.3 ' +
  'L 53 78 L 54 71.6 L 54 66.5 L 50 60 L 46 57.5 L 43.7 52.4 L 42.5 46 L 41.4 43.5 ' +
  'L 43.7 40.9 L 45.5 36.5 L 46 33.2 L 44.8 31.9 L 46 31.9 L 48.3 29.4 L 49.4 28.1 Z';

// ── Mexico silhouette (with Baja + Yucatán) ──
const MEXICO =
  'M 34.5 14.1 L 34.5 17.9 L 33.3 19.2 L 31 21.7 L 28.7 24.3 L 25.3 21.7 ' +
  'L 19.5 20.4 L 14.9 17.9 L 12.6 12.8 L 8 12.8 L 5 8 L 0 1.3 L 12.6 1.3 ' +
  'L 19.5 1.3 L 23 9 L 21.8 14.1 L 24.1 17.9 L 26.4 19.2 L 29.9 17.9 ' +
  'L 31 15.4 L 34.5 15.4 Z';

// ── Central America / Panama isthmus connector (very thin) ──
const CENTRAL_AMERICA =
  'M 31 21.7 L 33 23 L 35 25 L 37 27 L 39 28.5 L 41 29.5 L 43 30.5 L 44.8 31.9';

// Caribbean + offshore islands (decorative — they read as realism cues)
const ISLANDS = [
  { cx: 39, cy: 22, r: 1.5 },   // Cuba (elongated, but rendered as oval)
  { cx: 44, cy: 25, r: 0.9 },   // Hispaniola
  { cx: 47, cy: 25, r: 0.6 },   // Puerto Rico
  { cx: 40.5, cy: 43, r: 0.5 }, // Galápagos (offshore EC)
  { cx: 62.5, cy: 97, r: 0.7 }, // Malvinas / Falkland
];

type Props = { lang: 'es' | 'en' };

export function CoverageRadar({ lang }: Props) {
  const hq = COUNTRIES.find((c) => c.hq)!;
  // Equator and Tropic lines (latitude reference)
  const equatorY = 33 / 90 * 115;
  const tropicCancerY = (33 - 23.5) / 90 * 115;
  const tropicCapricornY = (33 - -23.5) / 90 * 115;

  return (
    <div className="tf-radar" aria-hidden="true">
      <div className="tf-radar-meta">
        <span><b>09</b> · {lang === 'es' ? 'Países alcanzados' : 'Countries reached'}</span>
        <span>HQ · CÓRDOBA · AR</span>
      </div>
      <svg viewBox="0 0 100 115" preserveAspectRatio="xMidYMid meet">
        {/* Lat/lon reference grid (subtle) */}
        <g className="tf-radar-grid">
          {[20, 40, 60, 80, 100].map((y) => (
            <path key={`h${y}`} d={`M0 ${y} H100`} />
          ))}
          {[20, 40, 60, 80].map((x) => (
            <path key={`v${x}`} d={`M${x} 0 V115`} />
          ))}
        </g>
        {/* Equator + tropics (slightly stronger than the grid) */}
        <g className="tf-radar-parallels">
          <line x1={0} y1={equatorY} x2={100} y2={equatorY} />
          <line x1={0} y1={tropicCancerY} x2={100} y2={tropicCancerY} strokeDasharray="1 1" />
          <line x1={0} y1={tropicCapricornY} x2={100} y2={tropicCapricornY} strokeDasharray="1 1" />
          <text x={1.2} y={equatorY - 0.6} className="tf-radar-parallel-label">EQUATOR</text>
          <text x={1.2} y={tropicCancerY - 0.6} className="tf-radar-parallel-label">23.5°N</text>
          <text x={1.2} y={tropicCapricornY - 0.6} className="tf-radar-parallel-label">23.5°S</text>
        </g>
        {/* Central America connector — thin line, no fill */}
        <path d={CENTRAL_AMERICA} className="tf-radar-isthmus" />
        {/* Landmasses */}
        <g className="tf-radar-land">
          <path d={SOUTH_AMERICA} />
          <path d={MEXICO} />
        </g>
        {/* Offshore islands */}
        <g className="tf-radar-islands">
          {ISLANDS.map((i, idx) => (
            <circle key={idx} cx={i.cx} cy={i.cy} r={i.r} />
          ))}
        </g>
        {/* Dashed accent lines from HQ to every other market */}
        <g className="tf-radar-links">
          {COUNTRIES.filter((c) => !c.hq).map((c) => (
            <line key={c.code} x1={hq.x} y1={hq.y} x2={c.x} y2={c.y} />
          ))}
        </g>
        {/* Country dots + labels */}
        {COUNTRIES.map((c) => (
          <g key={c.code}>
            {c.hq && (
              <circle cx={c.x} cy={c.y} r={3} className="tf-radar-hq-ring" />
            )}
            <circle
              cx={c.x}
              cy={c.y}
              r={c.hq ? 1.6 : 0.9}
              fill={c.hq ? 'var(--accent)' : 'var(--fg)'}
            />
            <text
              x={c.x + (c.lx ?? 0)}
              y={c.y + (c.ly ?? 0)}
              textAnchor={c.anchor ?? 'start'}
              className={c.hq ? 'tf-radar-label is-hq' : 'tf-radar-label'}
            >
              {c.label}
            </text>
          </g>
        ))}
        {/* Compass rose top-right */}
        <g className="tf-radar-compass" transform="translate(92 8)">
          <circle cx={0} cy={0} r={4} />
          <line x1={0} y1={-4} x2={0} y2={4} />
          <line x1={-4} y1={0} x2={4} y2={0} />
          <polygon points="0,-4 -1.2,-1.5 1.2,-1.5" />
          <text x={0} y={-5} textAnchor="middle">N</text>
        </g>
      </svg>
      <span className="tf-radar-stamp">{lang === 'es' ? 'COBERTURA' : 'COVERAGE'} · 2026</span>
    </div>
  );
}
