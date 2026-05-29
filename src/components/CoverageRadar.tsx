type Country = {
  code: string;
  label: string;
  x: number;
  y: number;
  hq?: boolean;
  lx?: number;
  ly?: number;
  anchor?: 'start' | 'end' | 'middle';
};

// Coordinate system: lng −130..0 → x 0..130, lat 50..−55 → y 0..105.
// Dots placed on capital cities (or HQ city for AR).
const COUNTRIES: Country[] = [
  { code: 'AR', label: 'CÓRDOBA',         x: 66, y: 81, hq: true, lx: 3.2, ly: 0.4, anchor: 'start' },
  { code: 'BR', label: 'BRASIL',          x: 83, y: 66, lx: 3.2, ly: 0.4, anchor: 'start' },
  { code: 'CL', label: 'CHILE',           x: 59, y: 83, lx: -3.2, ly: 0.4, anchor: 'end' },
  { code: 'PE', label: 'PERÚ',            x: 53, y: 62, lx: -3.2, ly: 0.4, anchor: 'end' },
  { code: 'BO', label: 'BOLIVIA',         x: 62, y: 67, lx: 3.2, ly: 0.4, anchor: 'start' },
  { code: 'UY', label: 'URUGUAY',         x: 74, y: 85, lx: 3.2, ly: 0.4, anchor: 'start' },
  { code: 'CO', label: 'COLOMBIA',        x: 56, y: 45, lx: -3.2, ly: 0.4, anchor: 'end' },
  { code: 'EC', label: 'ECUADOR',         x: 52, y: 50, lx: -3.2, ly: 0.4, anchor: 'end' },
  { code: 'MX', label: 'MÉXICO',          x: 31, y: 31, lx: -3.2, ly: 0.4, anchor: 'end' },
  { code: 'US', label: 'ESTADOS UNIDOS',  x: 53, y: 11, lx: 3.2, ly: 0.4, anchor: 'start' },
  { code: 'DO', label: 'R. DOMINICANA',   x: 60, y: 32, lx: 3.2, ly: 0.4, anchor: 'start' },
  { code: 'ES', label: 'ESPAÑA',          x: 125, y: 10, lx: -3.2, ly: 0.4, anchor: 'end' },
];

// Simplified continent silhouettes ---------------------------------------------------
const SOUTH_AMERICA =
  'M 58 38 L 62 40 L 66 40 L 71 42 L 75 44 L 78 47 L 80 50 L 88 54 L 95 58 ' +
  'L 91 64 L 90 70 L 87 73 L 85 74 L 78 80 L 74 84 L 72 88 L 66 89 L 63 95 ' +
  'L 60 99 L 58 105 L 54 105 L 52 100 L 53 95 L 55 90 L 55 87 L 56 84 ' +
  'L 58 74 L 58 68 L 52 62 L 49 58 L 48 53 L 47 50 L 49 47 L 51 44 L 50 41 ' +
  'L 52 41 L 54 39 L 55 38 Z';

const NORTH_AMERICA =
  'M 5 0 L 63 0 L 60 6 L 55 12 L 53 17 L 50 23 L 48 25 L 45 25 L 40 24 ' +
  'L 35 24 L 30 19 L 24 18 L 13 18 L 9 9 Z';

const MEXICO =
  'M 24 18 L 30 19 L 35 24 L 40 26 L 43 30 L 43 33 L 40 35 L 36 35 L 35 33 ' +
  'L 30 33 L 28 30 L 24 24 L 22 22 Z';

const CENTRAL_AMERICA =
  'M 38 35 L 41 36 L 44 37 L 47 39 L 50 41';

const IBERIA =
  'M 119 7 L 127 5 L 130 7 L 130 12 L 128 14 L 121 14 L 118 11 Z';

const N_AFRICA =
  'M 121 16 L 128 14 L 130 18 L 130 28 L 125 30 L 121 28 L 119 20 Z';

const ISLANDS = [
  { cx: 52, cy: 29, rx: 3.2, ry: 1.3 },   // Cuba (elongated)
  { cx: 59.5, cy: 32, rx: 1.7, ry: 0.9 }, // Hispaniola
  { cx: 63, cy: 32.5, rx: 0.8, ry: 0.5 }, // Puerto Rico
  { cx: 53, cy: 33, rx: 1.1, ry: 0.5 },   // Jamaica
];

// Quadratic-bezier arc from (x1,y1) to (x2,y2), curved perpendicular
// to the chord toward the "outside" of the map (upward, toward smaller y).
// liftFactor controls how dramatic the arc is.
function arc(x1: number, y1: number, x2: number, y2: number, liftFactor = 0.22): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.5) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const perpX = -dy / len;
  const perpY = dx / len;
  const sign = perpY < 0 ? 1 : -1; // arc bows upward
  const lift = len * liftFactor;
  const cx = mx + sign * perpX * lift;
  const cy = my + sign * perpY * lift;
  return `M ${x1} ${y1} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${x2} ${y2}`;
}

type Props = { lang: 'es' | 'en' };

export function CoverageRadar({ lang }: Props) {
  const hq = COUNTRIES.find((c) => c.hq)!;
  return (
    <div className="tf-radar">
      <svg viewBox="0 0 140 105" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Radial gradient that fades the arcs outward from Córdoba */}
          <radialGradient id="tf-arc-grad" cx={hq.x} cy={hq.y} r="90" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3a86ff" stopOpacity="0.95" />
            <stop offset="0.55" stopColor="#3a86ff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#3a86ff" stopOpacity="0.18" />
          </radialGradient>
          {/* Gradient for landmasses — subtle blue tint, darker at south */}
          <linearGradient id="tf-land-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a86ff" stopOpacity="0.07" />
            <stop offset="1" stopColor="#3a86ff" stopOpacity="0.03" />
          </linearGradient>
          {/* Glow filter for the HQ marker */}
          <filter id="tf-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background grid (faint) */}
        <g className="tf-radar-grid">
          {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((y) => (
            <path key={`h${y}`} d={`M0 ${y} H140`} />
          ))}
          {[20, 40, 60, 80, 100, 120].map((x) => (
            <path key={`v${x}`} d={`M${x} 0 V105`} />
          ))}
        </g>

        {/* Equator + Tropics */}
        <g className="tf-radar-parallels">
          <line x1="0" y1="50" x2="140" y2="50" />
          <line x1="0" y1="26.5" x2="140" y2="26.5" strokeDasharray="1 1.2" />
          <line x1="0" y1="73.5" x2="140" y2="73.5" strokeDasharray="1 1.2" />
        </g>

        {/* Central America connector (thin line, no fill) */}
        <path d={CENTRAL_AMERICA} className="tf-radar-isthmus" />

        {/* Landmasses */}
        <g className="tf-radar-land">
          <path d={NORTH_AMERICA} />
          <path d={MEXICO} />
          <path d={SOUTH_AMERICA} />
          <path d={IBERIA} />
          <path d={N_AFRICA} />
        </g>

        {/* Caribbean islands */}
        <g className="tf-radar-islands">
          {ISLANDS.map((i, idx) => (
            <ellipse key={idx} cx={i.cx} cy={i.cy} rx={i.rx} ry={i.ry} />
          ))}
        </g>

        {/* Connector arcs from HQ to every other destination — gradient stroke */}
        <g className="tf-radar-links" stroke="url(#tf-arc-grad)" fill="none">
          {COUNTRIES.filter((c) => !c.hq).map((c, i) => {
            const longHaul = c.code === 'ES' || c.code === 'US';
            return (
              <path
                key={c.code}
                d={arc(hq.x, hq.y, c.x, c.y, longHaul ? 0.26 : 0.18)}
                style={{ animationDelay: `${0.25 + i * 0.08}s` }}
              />
            );
          })}
        </g>

        {/* Compass rose top-left */}
        <g className="tf-radar-compass" transform="translate(8 8)">
          <circle cx="0" cy="0" r="5" />
          <line x1="0" y1="-5" x2="0" y2="5" />
          <line x1="-5" y1="0" x2="5" y2="0" />
          <polygon points="0,-5 -1.4,-1.8 1.4,-1.8" />
          <text x="0" y="-6.3" textAnchor="middle">N</text>
        </g>

        {/* Scale bar bottom-left — 1000 km ≈ ~9 viewBox units at this projection */}
        <g className="tf-radar-scale" transform="translate(8 100)">
          <line x1="0" y1="0" x2="18" y2="0" />
          <line x1="0" y1="-1.2" x2="0" y2="1.2" />
          <line x1="9" y1="-0.8" x2="9" y2="0.8" />
          <line x1="18" y1="-1.2" x2="18" y2="1.2" />
          <text x="9" y="-2.4" textAnchor="middle">2000 KM</text>
        </g>

        {/* Country dots + labels */}
        <g className="tf-radar-markers">
          {COUNTRIES.map((c) => (
            <g key={c.code}>
              {c.hq && (
                <>
                  <circle cx={c.x} cy={c.y} r={3.5} className="tf-radar-hq-pulse" />
                  <circle cx={c.x} cy={c.y} r={5} className="tf-radar-hq-pulse" style={{ animationDelay: '0.5s' }} />
                </>
              )}
              <circle
                cx={c.x}
                cy={c.y}
                r={c.hq ? 1.7 : 1.1}
                className={c.hq ? 'tf-radar-dot is-hq' : 'tf-radar-dot'}
                filter={c.hq ? 'url(#tf-glow)' : undefined}
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
        </g>
      </svg>

      <div className="tf-radar-meta">
        <span><b>12</b> · {lang === 'es' ? 'Países alcanzados' : 'Countries reached'}</span>
        <span>HQ · CÓRDOBA · AR</span>
      </div>
      <span className="tf-radar-stamp">
        {lang === 'es' ? 'COBERTURA' : 'COVERAGE'} · 2026
      </span>
    </div>
  );
}
