import { COVERAGE_DOTS } from './coverage-dots';

type Country = {
  code: string;
  label: string;
  labelEn?: string;
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
  { code: 'BR', label: 'BRASIL',          labelEn: 'BRAZIL',        x: 83, y: 66, lx: 3.2, ly: 0.4, anchor: 'start' },
  { code: 'CL', label: 'CHILE',           x: 59, y: 83, lx: -3.2, ly: 0.4, anchor: 'end' },
  { code: 'PE', label: 'PERÚ',            labelEn: 'PERU',          x: 53, y: 62, lx: -3.2, ly: 0.4, anchor: 'end' },
  { code: 'BO', label: 'BOLIVIA',         x: 62, y: 67, lx: 3.2, ly: 0.4, anchor: 'start' },
  { code: 'PY', label: 'PARAGUAY',        x: 73, y: 75, lx: 3.2, ly: 0.4, anchor: 'start' },
  { code: 'UY', label: 'URUGUAY',         x: 74, y: 85, lx: 3.2, ly: 0.4, anchor: 'start' },
  { code: 'CO', label: 'COLOMBIA',        x: 56, y: 45, lx: -3.2, ly: 0.4, anchor: 'end' },
  { code: 'EC', label: 'ECUADOR',         x: 52, y: 50, lx: -3.2, ly: 0.4, anchor: 'end' },
  { code: 'MX', label: 'MÉXICO',          labelEn: 'MEXICO',        x: 31, y: 31, lx: -3.2, ly: 0.4, anchor: 'end' },
  { code: 'US', label: 'ESTADOS UNIDOS',  labelEn: 'UNITED STATES', x: 53, y: 11, lx: 3.2, ly: 0.4, anchor: 'start' },
  { code: 'DO', label: 'R. DOMINICANA',   labelEn: 'DOMINICAN REP.', x: 60, y: 32, lx: 3.2, ly: 0.4, anchor: 'start' },
  { code: 'PR', label: 'PUERTO RICO',     x: 66, y: 31, lx: 0, ly: 3.2, anchor: 'middle' },
  { code: 'ES', label: 'ESPAÑA',          labelEn: 'SPAIN',         x: 125, y: 10, lx: -3.2, ly: 0.4, anchor: 'end' },
];

// Quadratic-bezier arc from (x1,y1) to (x2,y2), curved perpendicular
// to the chord toward the "outside" of the map (upward, toward smaller y).
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
  // Pre-computed arcs HQ → destination, with a stagger for the draw-in + pulse.
  const links = COUNTRIES.filter((c) => !c.hq).map((c, i) => ({
    code: c.code,
    d: arc(hq.x, hq.y, c.x, c.y, c.code === 'ES' || c.code === 'US' ? 0.26 : 0.18),
    delay: 0.25 + i * 0.08,
  }));

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

        {/* Landmasses rendered as a halftone dot field (data in coverage-dots.ts) */}
        <g className="tf-radar-dots">
          {COVERAGE_DOTS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={0.52} />
          ))}
        </g>

        {/* Connector arcs from HQ to every destination — gradient stroke, drawn in */}
        <g className="tf-radar-links" stroke="url(#tf-arc-grad)" fill="none">
          {links.map((l) => (
            <path key={l.code} id={`tf-arc-${l.code}`} d={l.d} style={{ animationDelay: `${l.delay}s` }} />
          ))}
        </g>

        {/* Signal pulses travelling each arc from Córdoba outward */}
        <g className="tf-radar-pulses">
          {links.map((l) => (
            <circle key={l.code} r={0.55} className="tf-radar-pulse" opacity={0}>
              <animateMotion dur="3.4s" begin={`${l.delay + 1.4}s`} repeatCount="indefinite">
                <mpath href={`#tf-arc-${l.code}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.12;0.82;1"
                dur="3.4s"
                begin={`${l.delay + 1.4}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Compass rose top-left */}
        <g className="tf-radar-compass" transform="translate(8 8)">
          <circle cx="0" cy="0" r="5" />
          <line x1="0" y1="-5" x2="0" y2="5" />
          <line x1="-5" y1="0" x2="5" y2="0" />
          <polygon points="0,-5 -1.4,-1.8 1.4,-1.8" />
          <text x="0" y="-6.3" textAnchor="middle">N</text>
        </g>

        {/* Scale bar bottom-left */}
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
              {!c.hq && <circle cx={c.x} cy={c.y} r={2} className="tf-radar-dot-halo" />}
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
                {lang === 'en' && c.labelEn ? c.labelEn : c.label}
              </text>
            </g>
          ))}
        </g>
      </svg>

      <div className="tf-radar-meta">
        <span><b>14</b> · {lang === 'es' ? 'Países alcanzados' : 'Countries reached'}</span>
        <span>HQ · CÓRDOBA · AR</span>
      </div>
      <span className="tf-radar-stamp">
        {lang === 'es' ? 'COBERTURA' : 'COVERAGE'} · 2026
      </span>
    </div>
  );
}
