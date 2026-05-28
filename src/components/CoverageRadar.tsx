type Country = { code: string; label: string; x: number; y: number; hq?: boolean };

// Sober coverage diagram — country dots on a faint reference grid. Positions
// are stylized (not a real projection); the intent is to read as "9 markets",
// not as a geo-accurate map.
const COUNTRIES: Country[] = [
  { code: 'AR', label: 'ARG', x: 64, y: 75, hq: true },
  { code: 'BR', label: 'BRA', x: 78, y: 68 },
  { code: 'CL', label: 'CHL', x: 58, y: 80 },
  { code: 'PE', label: 'PER', x: 56, y: 60 },
  { code: 'MX', label: 'MEX', x: 38, y: 42 },
  { code: 'UY', label: 'URY', x: 72, y: 78 },
  { code: 'BO', label: 'BOL', x: 60, y: 66 },
  { code: 'CO', label: 'COL', x: 52, y: 50 },
  { code: 'EC', label: 'ECU', x: 50, y: 55 },
];

type Props = {
  lang: 'es' | 'en';
};

export function CoverageRadar({ lang }: Props) {
  return (
    <div className="tf-radar" aria-hidden="true">
      <div className="tf-radar-meta">
        <span><b>09</b> · {lang === 'es' ? 'Países alcanzados' : 'Countries reached'}</span>
        <span>HQ · CÓRDOBA · AR</span>
      </div>
      <svg viewBox="0 0 200 100" preserveAspectRatio="none">
        <g className="tf-radar-grid">
          {[20, 40, 60, 80].map((y) => (
            <path key={`h${y}`} d={`M0 ${y} H200`} />
          ))}
          {[25, 50, 75, 100, 125, 150, 175].map((x) => (
            <path key={`v${x}`} d={`M${x} 0 V100`} />
          ))}
        </g>
        {COUNTRIES.map((c) => (
          <g key={c.code}>
            <circle
              cx={c.x}
              cy={c.y}
              r={c.hq ? 2.2 : 1.4}
              fill={c.hq ? 'var(--accent)' : 'var(--fg-2)'}
            />
            <text
              x={c.x + 3}
              y={c.y + 1.2}
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
