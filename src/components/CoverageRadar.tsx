type Country = {
  code: string;
  label: string;
  xPct: number;
  yPct: number;
  hq?: boolean;
};

// Marker positions are percentages of the iframe area, calibrated
// against the Google Maps embed at zoom=3 centred on (-8, -65) which
// shows from northern Mexico down to southern Patagonia.
const COUNTRIES: Country[] = [
  { code: 'AR', label: 'Córdoba · Argentina', xPct: 50, yPct: 78, hq: true },
  { code: 'BR', label: 'Brasil',              xPct: 68, yPct: 56 },
  { code: 'CL', label: 'Chile',               xPct: 39, yPct: 78 },
  { code: 'PE', label: 'Perú',                xPct: 32, yPct: 51 },
  { code: 'BO', label: 'Bolivia',             xPct: 44, yPct: 60 },
  { code: 'UY', label: 'Uruguay',             xPct: 58, yPct: 80 },
  { code: 'CO', label: 'Colombia',            xPct: 33, yPct: 34 },
  { code: 'EC', label: 'Ecuador',             xPct: 28, yPct: 41 },
  { code: 'MX', label: 'México',              xPct: 17, yPct: 17 },
];

type Props = { lang: 'es' | 'en' };

export function CoverageRadar({ lang }: Props) {
  return (
    <div className="tf-radar">
      <iframe
        className="tf-radar-base"
        title="Trans-Fil · cobertura LATAM"
        src="https://maps.google.com/maps?ll=-8,-65&z=3&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        tabIndex={-1}
        aria-hidden="true"
      />
      <div className="tf-radar-overlay" aria-hidden="true">
        <div className="tf-radar-meta">
          <span><b>09</b> · {lang === 'es' ? 'Países alcanzados' : 'Countries reached'}</span>
          <span>HQ · CÓRDOBA · AR</span>
        </div>
        <div className="tf-radar-markers">
          {COUNTRIES.map((c) => (
            <span
              key={c.code}
              className={c.hq ? 'tf-radar-marker is-hq' : 'tf-radar-marker'}
              style={{ left: `${c.xPct}%`, top: `${c.yPct}%` }}
              data-label={c.label}
            />
          ))}
        </div>
        <span className="tf-radar-stamp">
          {lang === 'es' ? 'COBERTURA' : 'COVERAGE'} · 2026
        </span>
      </div>
    </div>
  );
}
