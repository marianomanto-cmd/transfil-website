type Country = { code: string; label: string; x: number; y: number; hq?: boolean };

// Country dots placed at approximate centroid coordinates, mapped from
// real lon/lat into the viewBox 0..100 (lon -117..-30) × 0..120 (lat 33..-57).
// Mexico is included because TF's areaServed in the schema includes MX.
const COUNTRIES: Country[] = [
  { code: 'AR', label: 'ARG', x: 62, y: 87, hq: true },  // Córdoba ≈ −31°S −64°W
  { code: 'BR', label: 'BRA', x: 80, y: 53 },             // central Brazil
  { code: 'CL', label: 'CHL', x: 54, y: 80 },             // central Chile
  { code: 'PE', label: 'PER', x: 48, y: 53 },             // Peru
  { code: 'BO', label: 'BOL', x: 58, y: 65 },             // Bolivia
  { code: 'UY', label: 'URY', x: 70, y: 81 },             // Uruguay
  { code: 'CO', label: 'COL', x: 50, y: 34 },             // Colombia
  { code: 'EC', label: 'ECU', x: 44, y: 41 },             // Ecuador
  { code: 'MX', label: 'MEX', x: 18, y: 13 },             // Mexico
];

// Simplified South America silhouette, ~28 vertices. Coordinates picked
// from the same lon/lat → viewBox mapping as the country dots so the dots
// land where they belong.
const SOUTH_AMERICA =
  'M 52 26 L 60 28 L 65 28 L 70 32 L 76 35 L 84 43 L 91 45 L 94 50 L 91 57 ' +
  'L 85 68 L 75 79 L 72 82 L 69 86 L 60 93 L 58 99 L 56 105 L 52 108 ' +
  'L 49 105 L 49 96 L 51 89 L 51 85 L 52 80 L 54 68 L 53 62 L 46 55 L 41 48 ' +
  'L 41 43 L 42 40 L 45 34 L 43 30 Z';

// Simplified Mexico silhouette at upper-left of the viewBox.
const MEXICO =
  'M 8 12 L 0 2 L 13 1 L 19 5 L 23 9 L 24 17 L 31 13 L 33 17 L 33 19 L 32 21 ' +
  'L 28 22 L 25 20 L 19 19 L 14 17 L 12 12 Z';

type Props = {
  lang: 'es' | 'en';
};

export function CoverageRadar({ lang }: Props) {
  const hq = COUNTRIES.find((c) => c.hq)!;
  return (
    <div className="tf-radar" aria-hidden="true">
      <div className="tf-radar-meta">
        <span><b>09</b> · {lang === 'es' ? 'Países alcanzados' : 'Countries reached'}</span>
        <span>HQ · CÓRDOBA · AR</span>
      </div>
      <svg viewBox="0 0 100 115" preserveAspectRatio="xMidYMid meet">
        {/* Faint lat/lon reference grid */}
        <g className="tf-radar-grid">
          {[20, 40, 60, 80, 100].map((y) => (
            <path key={`h${y}`} d={`M0 ${y} H100`} />
          ))}
          {[20, 40, 60, 80].map((x) => (
            <path key={`v${x}`} d={`M${x} 0 V115`} />
          ))}
        </g>
        {/* Continent silhouettes */}
        <g className="tf-radar-land">
          <path d={SOUTH_AMERICA} />
          <path d={MEXICO} />
        </g>
        {/* Dashed lines connecting HQ to every other market */}
        <g className="tf-radar-links">
          {COUNTRIES.filter((c) => !c.hq).map((c) => (
            <line key={c.code} x1={hq.x} y1={hq.y} x2={c.x} y2={c.y} />
          ))}
        </g>
        {/* Country dots + labels */}
        {COUNTRIES.map((c) => (
          <g key={c.code}>
            <circle
              cx={c.x}
              cy={c.y}
              r={c.hq ? 1.6 : 1}
              fill={c.hq ? 'var(--accent)' : 'var(--fg)'}
            />
            <text
              x={c.x + 2.2}
              y={c.y + 0.9}
              className={c.hq ? 'tf-radar-label is-hq' : 'tf-radar-label'}
            >
              {c.label}
            </text>
          </g>
        ))}
      </svg>
      <span className="tf-radar-stamp">{lang === 'es' ? 'COBERTURA' : 'COVERAGE'} · 2026</span>
    </div>
  );
}
