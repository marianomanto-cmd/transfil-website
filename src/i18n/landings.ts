// Campaign landing pages.
//
// One landing = one application (a process the customer already has and is
// losing money on), NOT the company. Paid traffic from Google Ads and
// LinkedIn lands here instead of on the home, so the page has to carry the
// whole argument on its own: symptom → system → proof → form/WhatsApp → FAQ.
//
// `/conformado` is the first one. The shape below is meant to be filled in
// again for /lavado, /transporte and /hornos — see docs/LANDINGS.md.

import type { Lang, PageKey } from './routes';

export type LandingSlug = 'conformado' | 'mecanizado';

export type LandingMedia = {
  src: string;
  kind: 'photo' | 'video';
  poster?: string;
  alt: string;
};

export type LandingContent = {
  /** Routing key — drives canonical, hreflang and the language switcher. */
  page: PageKey;
  /** `page` value pushed to the dataLayer with every landing event. */
  event: string;
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogImageAlt: string;
    twitterDescription: string;
  };
  /** Label of this page inside the BreadcrumbList. */
  breadcrumb: string;
  /** schema.org Service node for this application. */
  service: { name: string; description: string; serviceType: string };
  nav: { system: string; why: string; faq: string; contact: string };
  hero: {
    eyebrow: string;
    h1: string;
    sub: string;
    ctaPrimary: string;
    ctaSecondary: string;
    /**
     * Decorative masthead loop. The poster is what paints first (and is the
     * LCP); the video is attached after idle. Same footage the home hero
     * uses, cut to the coolant shot and made seamless.
     */
    media: { video: string; poster: string };
  };
  numbers: { items: { v: string; l: string }[]; note: string };
  /** A01 from the home, expanded — same argument, more room. */
  problem: {
    eyebrow: string;
    title: string;
    symptom: string;
    solution: string;
    benefit: string;
  };
  system: {
    eyebrow: string;
    title: string;
    intro: string;
    /** The four stages of the station, in process order. They name the
        rail of the 3D viewer above and the cards below it. */
    blocks: { code: string; title: string; desc: string; media: LandingMedia }[];
  };
  /** Rendered walkthrough of the filtration station that opens section 02
      (tools/central-tour/). One file per locale: the labels are burned into
      the picture. `chapters[].t` are seconds into the video. Optional: only
      the landings whose station it shows carry it. */
  centralTour?: {
    eyebrow: string;
    /** Different advice with a mouse than with a finger: the component
        shows one or the other by pointer type. */
    hint: { pointer: string; touch: string };
    /** Screen-reader description of what the video shows. */
    alt: string;
    goTo: string;
    src: string;
    poster: string;
    chapters: { t: number; code: string; label: string }[];
  };
  /** Copy for the 3D machine diagram that closes the section. Every string
      is on screen, so all three locales carry their own. The `\n` in `tags`
      is the label's line break — keep it in every translation. Optional,
      like `centralTour`: it draws a tube-forming plant. */
  machineDiagram?: {
    caption: string;
    /** Same idea as `centralTour.hint`: one variant per pointer type. */
    hint: { pointer: string; touch: string };
    /** Screen-reader description of the whole installation. */
    alt: string;
    eq: {
      back: string; centrifuge: string; line: string;
      appl: string; central: string; tower: string;
    };
    tags: { lp: string; hp: string };
    circuits: { name: string; sub: string }[];
  };
  why: {
    eyebrow: string;
    title: string;
    items: { t: string; d: string }[];
  };
  proof: { eyebrow: string; title: string; sub: string };
  form: {
    eyebrow: string;
    title: string;
    sub: string;
    /** Extra select shown only on the landing. */
    lineTypeLabel: string;
    lineTypeOpts: string[];
    /** Line of interest the form starts pre-filled with. */
    defaultLinea: string;
    waPrompt: string;
    waCta: string;
    successTitle: string;
    successBody: string;
    successWa: string;
  };
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
  /** Closing line — same sentence in every landing of this family. */
  closing: string;
  /** WhatsApp prefill for every WA link on this page. */
  whatsapp: string;
};

/** Assets are real Trans-Fil equipment — no stock photography, ever. */
const MEDIA = {
  magnetic: {
    src: '/video/t02-magnetic-separator.mp4',
    poster: '/img/t02-magnetic-separator-poster.webp',
    kind: 'video',
  },
  band: { src: '/img/t02-band-filters.webp', kind: 'photo' },
  oil: { src: '/img/t02-oil-recovery.webp', kind: 'photo' },
  // The full centralized skid — pumps, filter housings, heat exchanger,
  // tank and control cabinet. It used to sit behind the masthead, where the
  // detail was lost; it earns its place illustrating F04.
  central: { src: '/img/t03-fluids-cover.webp', kind: 'photo' },
  // Mecanizado: transportador de viruta de bisagra y línea centralizada.
  chips: { src: '/img/t01-chip-transport.webp', kind: 'photo' },
  chipLine: { src: '/img/t01-conveyors.webp', kind: 'photo' },
} as const;

/** Masthead loop (coolant on the tool), shared by both landings and every
    locale: it reads as machining as much as forming. */
const HERO_MEDIA = {
  video: '/video/hero-coolant.mp4',
  poster: '/img/hero-coolant-poster.webp',
} as const;

export const LANDINGS: Record<LandingSlug, Record<Lang, LandingContent>> = {
  conformado: {
    es: {
      page: 'conformado',
      event: 'conformado',
      meta: {
        title: 'Filtración para líneas de conformado de tubos | Trans-Fil',
        description:
          'Filtración centralizada, separación magnética y recuperación de aceite para formadoras ERW. Relevamiento en planta. Fabricado en Córdoba.',
        ogTitle: 'Filtración para líneas de conformado de tubos',
        ogDescription:
          'Filtración centralizada, separación magnética y recuperación de aceite para líneas ERW / HFW. Relevamiento en planta previo a la propuesta técnica.',
        ogImageAlt: 'Central de filtración de refrigerante Trans-Fil',
        twitterDescription:
          'Filtración de proceso para líneas de conformado de tubos. Diseñada en planta, fabricada en Córdoba.',
      },
      breadcrumb: 'Conformado de tubos',
      service: {
        name: 'Filtración de fluido para líneas de conformado de tubos',
        description:
          'Filtración centralizada, separación magnética y recuperación de aceite atrapado para líneas de conformado de tubos ERW / HFW, perfilado y trefilado.',
        serviceType: 'Filtración industrial de fluidos de proceso',
      },
      nav: { system: 'El sistema', why: 'Por qué Trans-Fil', faq: 'Consultas', contact: 'Relevamiento' },
      hero: {
        eyebrow: '[ Filtración de proceso · Conformado de tubos · ERW / HFW / Perfilado / Trefilado ]',
        h1: 'El fluido contaminado reduce la vida útil del herramental y aumenta el scrap.',
        sub: 'Filtración centralizada para líneas de conformado de tubos: separación magnética, filtrado de sólidos y recuperación de aceite. Fabricación propia en Córdoba. Realizamos un relevamiento en planta antes de presentar la propuesta técnica.',
        ctaPrimary: 'Solicitar relevamiento en planta',
        ctaSecondary: 'WhatsApp',
        media: HERO_MEDIA,
      },
      numbers: {
        items: [
          { v: '2–4×', l: 'vida útil del refrigerante' },
          { v: '−50/70%', l: 'frecuencia de recambio de soluble' },
          { v: '+10/30%', l: 'vida útil de herramienta' },
        ],
        note: 'Rangos típicos en instalaciones con tratamiento adecuado. Los valores de cada línea se determinan durante el relevamiento en planta.',
      },
      problem: {
        eyebrow: '[ 01 — El problema ]',
        title: 'El estado del fluido determina la vida útil del herramental.',
        symptom:
          'El lubricante de la formadora acumula finos metálicos y aceite atrapado. El fluido degradado pierde capacidad lubricante y acelera el desgaste de rodillos y matrices: aparecen marcas en la superficie del tubo, se incrementa el scrap y aumenta la frecuencia de recambio de soluble, con el consiguiente costo de disposición.',
        solution:
          'Filtración centralizada, separación magnética y recuperación de aceite, dimensionadas sobre el caudal real de la línea y su layout. El fluido retorna a la formadora limpio, con temperatura y presión estables.',
        benefit:
          'Protege el herramental de conformado, prolonga varias veces la vida útil del fluido y reduce las paradas programadas por recambio de soluble.',
      },
      system: {
        eyebrow: '[ 02 — El sistema ]',
        title: 'Tres etapas de filtración y una central de proceso.',
        intro:
          'Cada etapa remueve un contaminante distinto. Instaladas en serie sobre la pileta de la línea, el fluido que retorna a la formadora no arrastra finos ferrosos, sólidos ni aceite atrapado.',
        blocks: [
          {
            code: 'F01',
            title: 'Finos ferrosos → separación magnética',
            desc: 'Tambores y barras imantadas que retiran la partícula ferrosa micrométrica antes del filtro principal. Es la etapa que evita la saturación prematura de la tela filtrante y la de mayor incidencia sobre el acabado superficial del tubo.',
            media: { ...MEDIA.magnetic, alt: 'Separador magnético de tambor Trans-Fil en operación' },
          },
          {
            code: 'F02',
            title: 'Sólidos → filtro de banda',
            desc: 'Filtración por gravedad con tela de papel o textil, con avance automático según el nivel del baño. Bajo costo operativo y residuo seco rebobinado, apto para disposición sin manipulación adicional.',
            media: { ...MEDIA.band, alt: 'Filtro de banda por gravedad Trans-Fil' },
          },
          {
            code: 'F03',
            title: 'Aceite atrapado → skimmer',
            desc: 'Skimmers de banda y separadores coalescentes que retiran el aceite atrapado, principal responsable de la caída de pH, la aparición de olor y el descarte anticipado de la emulsión. Su remoción es la variable de mayor impacto sobre la vida útil del fluido.',
            media: { ...MEDIA.oil, alt: 'Skimmer de recuperación de aceite Trans-Fil' },
          },
          {
            code: 'F04',
            title: 'Integración → central de filtración',
            desc: 'Estación de bombeo, presurización y temperado que alimenta la línea completa. Mantiene caudal y temperatura estables con independencia del consumo de cada puesto, con monitoreo de presión y nivel y alarmas configurables.',
            media: { ...MEDIA.central, alt: 'Central de filtración Trans-Fil: skid de bombeo, filtros, intercambiador y tanque' },
          },
        ],
      },
      centralTour: {
        eyebrow: 'Recorrido 3D · 1 min 21 s',
        hint: {
          pointer: 'Elija un capítulo para ir directo a esa etapa',
          touch: 'Pantalla completa para leer los rótulos',
        },
        alt: 'Video: recorrido tridimensional de la central de filtración Trans-Fil. El soluble contaminado entra a la centrífuga y al tambor magnético, que retira los finos ferrosos; atraviesa la tela del filtro de banda, que avanza sola cuando sube el nivel; el skimmer retira el aceite atrapado de la cuba; y la bomba, el intercambiador de placas y los filtros bolsa entregan soluble limpio a baja y a alta presión. Un panel muestra el estado del PLC en cada etapa.',
        goTo: 'Ir a',
        src: '/video/central-tour-es.mp4',
        poster: '/img/central-tour-es.webp',
        chapters: [
          { t: 0, code: '', label: 'La central completa' },
          { t: 8, code: 'F01', label: 'Separación magnética' },
          { t: 24, code: 'F02', label: 'Filtro de banda' },
          { t: 41, code: 'F03', label: 'Skimmer' },
          { t: 55, code: 'F04', label: 'Bombeo y temperatura' },
          { t: 71, code: '', label: 'Salidas de soluble limpio' },
        ],
      },
      machineDiagram: {
        caption: 'Diagrama de máquinas / Operación de conformado de tubos',
        hint: {
          pointer: 'Arrastre para orbitar · rueda para acercar · clic en un circuito para aislarlo',
          touch: 'Toque un circuito para aislarlo · dos dedos para orbitar',
        },
        alt: 'Diagrama tridimensional de una operación de conformado de tubos con filtración Trans-Fil: la línea de conformado devuelve el soluble a filtrar al back de transferencia, que lo impulsa a la centrífuga montada sobre la central de filtración; de la central salen el soluble filtrado de baja presión hacia las estaciones de conformado y el soluble doble filtrado de alta presión hacia el aplicador protectivo y el calibrado, y un circuito de agua la conecta con la torre de enfriamiento.',
        eq: {
          back: 'Back de Transferencia',
          centrifuge: 'Centrífuga',
          line: 'Línea de conformado',
          appl: 'Aplicador protectivo',
          central: 'Central de filtración',
          tower: 'Torre de enfriamiento',
        },
        tags: { lp: 'Soluble filtrado\nBaja presión', hp: 'Soluble doble filtrado\nAlta presión' },
        circuits: [
          { name: 'Soluble a filtrar', sub: 'Retorno de cada estación a la central' },
          { name: 'Soluble filtrado — baja presión', sub: 'Caño grueso, caudal lento — riega las estaciones de conformado' },
          { name: 'Soluble doble filtrado — alta presión', sub: 'Caño fino, caudal rápido — aplicador protectivo y calibrado' },
          { name: 'Agua de enfriamiento', sub: 'Circuito central ↔ torre' },
        ],
      },
      why: {
        eyebrow: '[ 03 — Por qué Trans-Fil ]',
        title: 'Fabricación propia en Córdoba y servicio en la región.',
        items: [
          { t: 'Fabricación propia', d: 'Taller propio en Córdoba: ingeniería, corte, plegado, armado y tablero se ejecutan en la misma planta.' },
          { t: 'Repuestos disponibles', d: 'Consumibles y repuestos con disponibilidad regional, sin los plazos de una importación.' },
          { t: 'Dimensionado a medida', d: 'La central se dimensiona sobre la pileta, el caudal y el espacio disponible de cada instalación.' },
          { t: 'Integración con el proceso', d: 'La misma ingeniería que provee transporte de viruta y lavado de piezas: un único interlocutor técnico.' },
          { t: 'Continuidad de servicio', d: 'Equipos instalados en la década del 90 continúan en operación, con soporte y repuestos vigentes.' },
          { t: '36 años · 14 países', d: 'Desde 1989 en el mismo taller, con más de 120 clientes industriales en 14 países.' },
        ],
      },
      proof: {
        eyebrow: '[ 04 — Antecedentes ]',
        title: 'Plantas que operan con equipos Trans-Fil.',
        sub: 'Siderurgia, tubos, automotriz y máquinas-herramienta en Argentina y la región.',
      },
      form: {
        eyebrow: '[ 05 — Relevamiento ]',
        title: 'El relevamiento en planta precede a la propuesta.',
        sub: 'Indíquenos de qué línea se trata y qué fluido utiliza. Un asesor técnico responde en menos de 24 horas hábiles con el siguiente paso concreto.',
        lineTypeLabel: 'Tipo de línea',
        lineTypeOpts: ['Tubos', 'Perfilado', 'Mecanizado', 'Rectificado', 'Otra'],
        defaultLinea: 'Filtración',
        waPrompt: '¿Prefiere WhatsApp?',
        waCta: 'Escribir por WhatsApp',
        successTitle: 'Consulta recibida.',
        successBody: 'Un asesor técnico se pondrá en contacto en menos de 24 horas hábiles. Si su consulta es urgente, puede escribirnos por WhatsApp.',
        successWa: 'Abrir WhatsApp',
      },
      faq: {
        eyebrow: '[ 06 — Consultas frecuentes ]',
        title: 'Consultas habituales previas al relevamiento.',
        items: [
          {
            q: '¿Es aplicable a líneas ERW, HFW y perfiladoras?',
            a: 'Sí. El sistema se dimensiona sobre el caudal y el tipo de fluido, no sobre la marca de la formadora. Trabajamos sobre líneas ERW y HFW de tubo con costura, perfiladoras de conformado en frío y líneas de trefilado.',
          },
          {
            q: '¿Es posible adaptar la pileta existente?',
            a: 'En la mayoría de los casos sí, y es la alternativa más habitual: se conserva la pileta y se incorporan las etapas faltantes —separación magnética, filtro de banda o skimmer— junto con la central de bombeo. El relevamiento determina si corresponde una adaptación o un equipo nuevo.',
          },
          {
            q: '¿Qué contaminantes se retiran?',
            a: 'Tres, mediante etapas independientes: finos ferrosos por separación magnética, sólidos no ferrosos y partícula gruesa por filtro de banda, y aceite atrapado por skimmer o separador coalescente. Ninguna etapa sustituye a las otras.',
          },
          {
            q: '¿Qué resultados es razonable esperar?',
            a: 'En instalaciones con tratamiento adecuado, la vida útil del refrigerante se multiplica entre 2 y 4 veces, el recambio de soluble se reduce entre un 50% y un 70% y la vida útil de herramienta aumenta entre un 10% y un 30%. Son rangos típicos: los valores de cada línea se determinan durante el relevamiento.',
          },
          {
            q: '¿Cuál es el plazo de respuesta?',
            a: 'Menos de 24 horas hábiles. La respuesta la emite un asesor técnico e incluye el siguiente paso concreto: la información adicional requerida o la fecha propuesta para la visita a planta.',
          },
          {
            q: '¿Conviene el formulario o WhatsApp?',
            a: 'Ambos canales llegan al mismo equipo técnico y tienen el mismo plazo de respuesta. El formulario permite detallar las condiciones de la línea; WhatsApp resulta más ágil para una consulta preliminar.',
          },
        ],
      },
      closing:
        'Filtración de proceso para líneas que no pueden parar. Diseñada en planta, fabricada en Córdoba, servicio en la región.',
      whatsapp:
        'Hola. Los contacto desde la página de conformado de Trans-Fil. Quisiera solicitar un relevamiento en planta para filtración de una línea de tubos.',
    },

    en: {
      page: 'conformado',
      event: 'conformado',
      meta: {
        title: 'Filtration for tube-forming lines | Trans-Fil',
        description:
          'Centralized coolant filtration, magnetic separation and tramp-oil recovery for ERW and HFW tube mills. Engineered for each line, installed and commissioned at your plant.',
        ogTitle: 'Filtration for tube-forming lines',
        ogDescription:
          'Centralized filtration, magnetic separation and tramp-oil recovery for ERW / HFW tube mills. A plant survey precedes the technical proposal.',
        ogImageAlt: 'Trans-Fil centralized coolant filtration station',
        twitterDescription:
          'Process filtration for lines that cannot stop. Engineered on the plant floor, built in Córdoba.',
      },
      breadcrumb: 'Tube forming',
      service: {
        name: 'Coolant filtration for tube-forming lines',
        description:
          'Centralized filtration, magnetic separation and tramp-oil recovery for ERW / HFW tube mills, roll forming and wire drawing lines.',
        serviceType: 'Industrial process-fluid filtration',
      },
      nav: { system: 'The system', why: 'Why Trans-Fil', faq: 'FAQ', contact: 'Plant survey' },
      hero: {
        eyebrow: '[ Process filtration · Tube forming · ERW / HFW / Roll forming / Drawing ]',
        h1: 'Contaminated fluid shortens tooling life and drives up scrap.',
        sub: 'Centralized filtration for tube-forming lines: magnetic separation, solids filtration and tramp-oil recovery. Engineered and manufactured in-house by Trans-Fil since 1989. A plant survey precedes every technical proposal.',
        ctaPrimary: 'Request a plant survey',
        ctaSecondary: 'WhatsApp',
        media: HERO_MEDIA,
      },
      numbers: {
        items: [
          { v: '2–4×', l: 'coolant service life' },
          { v: '−50/70%', l: 'coolant change frequency' },
          { v: '+10/30%', l: 'tool service life' },
        ],
        note: 'Typical ranges in installations with adequate treatment. Figures for each line are established during the plant survey.',
      },
      problem: {
        eyebrow: '[ 01 — The problem ]',
        title: 'Fluid condition determines tooling service life.',
        symptom:
          'Mill lubricant accumulates metal fines and tramp oil. The degraded fluid loses lubricating capacity and accelerates roll and die wear: marks appear on the tube surface, scrap increases and coolant is replaced more frequently, with the associated disposal cost.',
        solution:
          'Centralized filtration, magnetic separation and tramp-oil recovery, sized against the line’s actual flow rate and layout. Fluid returns to the mill clean, at stable temperature and pressure.',
        benefit:
          'Protects forming tooling, extends fluid service life several times over and reduces scheduled downtime for coolant changes.',
      },
      system: {
        eyebrow: '[ 02 — The system ]',
        title: 'Three filtration stages and one process station.',
        intro:
          'Each stage removes a different contaminant. Installed in series on the line’s tank, the fluid returning to the mill carries no ferrous fines, solids or tramp oil.',
        blocks: [
          {
            code: 'F01',
            title: 'Ferrous fines → magnetic separation',
            desc: 'Drums and magnetic bars that remove micrometric ferrous particles ahead of the main filter. This is the stage that prevents premature saturation of the filter cloth, and the one with the greatest effect on tube surface finish.',
            media: { ...MEDIA.magnetic, alt: 'Trans-Fil magnetic drum separator in operation' },
          },
          {
            code: 'F02',
            title: 'Solids → belt filter',
            desc: 'Gravity filtration with paper or textile cloth, advanced automatically according to bath level. Low operating cost and dry rewound residue, suitable for disposal without further handling.',
            media: { ...MEDIA.band, alt: 'Trans-Fil gravity belt filter' },
          },
          {
            code: 'F03',
            title: 'Tramp oil → skimmer',
            desc: 'Belt skimmers and coalescing separators that remove tramp oil, the main cause of falling pH, odor and premature disposal of the emulsion. Its removal is the single variable with the greatest impact on fluid service life.',
            media: { ...MEDIA.oil, alt: 'Trans-Fil oil-recovery skimmer' },
          },
          {
            code: 'F04',
            title: 'Integration → central filtration station',
            desc: 'Pumping, pressurization and temperature-control station feeding the entire line. Maintains stable flow and temperature regardless of demand at each position, with pressure and level monitoring and configurable alarms.',
            media: { ...MEDIA.central, alt: 'Trans-Fil central filtration station: pump skid, filter housings, heat exchanger and tank' },
          },
        ],
      },
      centralTour: {
        eyebrow: '3D walkthrough · 1 min 21 s',
        hint: {
          pointer: 'Pick a chapter to jump to that stage',
          touch: 'Go full screen to read the labels',
        },
        alt: 'Video: three-dimensional walkthrough of the Trans-Fil central filtration station. Contaminated coolant enters the centrifuge and the magnetic drum, which removes ferrous fines; it passes through the belt filter media, which advances automatically when the level rises; the skimmer removes tramp oil from the tank; and the pump, the plate heat exchanger and the bag filters deliver clean coolant at low and high pressure. A panel shows the PLC status at each stage.',
        goTo: 'Go to',
        src: '/video/central-tour-en.mp4',
        poster: '/img/central-tour-en.webp',
        chapters: [
          { t: 0, code: '', label: 'The complete station' },
          { t: 8, code: 'F01', label: 'Magnetic separation' },
          { t: 24, code: 'F02', label: 'Belt filter' },
          { t: 41, code: 'F03', label: 'Skimmer' },
          { t: 55, code: 'F04', label: 'Pumping and temperature' },
          { t: 71, code: '', label: 'Clean-coolant outlets' },
        ],
      },
      machineDiagram: {
        caption: 'Machine diagram / Tube forming operation',
        hint: {
          pointer: 'Drag to orbit · scroll to zoom · click a circuit to isolate it',
          touch: 'Tap a circuit to isolate it · two fingers to orbit',
        },
        alt: 'Three-dimensional diagram of a tube-forming operation with Trans-Fil filtration: the forming line returns coolant to the transfer back, which pumps it to the centrifuge mounted on the central filtration station; the station feeds low-pressure filtered coolant to the forming stations and high-pressure double-filtered coolant to the protective applicator and the sizing section, and a water loop connects it to the cooling tower.',
        eq: {
          back: 'Transfer back',
          centrifuge: 'Centrifuge',
          line: 'Forming line',
          appl: 'Protective applicator',
          central: 'Central filtration station',
          tower: 'Cooling tower',
        },
        tags: { lp: 'Filtered coolant\nLow pressure', hp: 'Double-filtered coolant\nHigh pressure' },
        circuits: [
          { name: 'Coolant to filter', sub: 'Return from every station to the central unit' },
          { name: 'Filtered coolant — low pressure', sub: 'Wide pipe, slow flow — floods the forming stations' },
          { name: 'Double-filtered coolant — high pressure', sub: 'Narrow pipe, fast flow — applicator and sizing section' },
          { name: 'Cooling water', sub: 'Central unit ↔ tower loop' },
        ],
      },
      why: {
        eyebrow: '[ 03 — Why Trans-Fil ]',
        title: 'Engineered and built in-house. Installed and commissioned at your plant.',
        items: [
          { t: 'In-house manufacturing', d: 'Engineering, cutting, bending, assembly and control panels are all done at our own plant in Córdoba, Argentina. One company is responsible for the complete system.' },
          { t: 'Built to your electrical standard', d: 'Control panels are designed for 480 V / 60 Hz, or your plant’s own supply, and built to the electrical standard you specify.' },
          { t: 'Sized to the installation', d: 'The station is sized around the existing tank, the flow rate and the floor space available at each site.' },
          { t: 'On-site commissioning', d: 'Trans-Fil technicians travel to your plant for installation and commissioning. After start-up, the same engineering team supports you remotely.' },
          { t: 'Integration with the process', d: 'The same engineering team that supplies chip conveying and parts washing: a single technical point of contact.' },
          { t: '36 years · 14 countries', d: 'Since 1989, with over 120 industrial customers in 14 countries, including the United States. Units installed in the 1990s are still in operation.' },
        ],
      },
      proof: {
        eyebrow: '[ 04 — Track record ]',
        title: 'Plants operating with Trans-Fil equipment.',
        sub: 'Steel, tube, automotive and machine-tool plants in 14 countries.',
      },
      form: {
        eyebrow: '[ 05 — Plant survey ]',
        title: 'The plant survey precedes the proposal.',
        sub: 'Tell us which line is involved and which fluid it runs. A technical advisor replies within 24 business hours with a defined next step.',
        lineTypeLabel: 'Line type',
        lineTypeOpts: ['Tube mill', 'Roll forming', 'Machining', 'Grinding', 'Other'],
        defaultLinea: 'Filtration',
        waPrompt: 'Would you prefer WhatsApp?',
        waCta: 'Message us on WhatsApp',
        successTitle: 'Inquiry received.',
        successBody: 'A technical advisor will be in touch within 24 business hours. If your inquiry is urgent, you can also reach us on WhatsApp.',
        successWa: 'Open WhatsApp',
      },
      faq: {
        eyebrow: '[ 06 — Frequently asked ]',
        title: 'Questions we are commonly asked before the survey.',
        items: [
          {
            q: 'Is it applicable to ERW, HFW and roll-forming lines?',
            a: 'Yes. The system is sized around flow rate and fluid type, not around the mill manufacturer. We work on ERW and HFW welded-tube lines, cold roll-forming lines and drawing lines.',
          },
          {
            q: 'Can the existing tank be adapted?',
            a: 'In most cases yes, and it is the more common route: the tank is retained and the missing stages are added — magnetic separation, belt filter or skimmer — together with the pumping station. The survey determines whether an adaptation or a new unit is appropriate.',
          },
          {
            q: 'Which contaminants are removed?',
            a: 'Three, through independent stages: ferrous fines by magnetic separation, non-ferrous and coarse solids by belt filter, and tramp oil by skimmer or coalescing separator. No stage substitutes for the others.',
          },
          {
            q: 'What results can reasonably be expected?',
            a: 'In installations with adequate treatment, coolant service life increases by a factor of 2 to 4, coolant changes fall by 50% to 70% and tool service life rises by 10% to 30%. These are typical ranges: figures for each line are established during the survey.',
          },
          {
            q: 'Who installs and supports the system?',
            a: 'Trans-Fil technicians travel to your plant for installation and commissioning. After start-up, support continues remotely with the same engineering team that designed the station.',
          },
          {
            q: 'Is the control panel built for US plants?',
            a: 'Yes. The panel is designed for 480 V / 60 Hz, or your plant’s own supply, and built to the electrical standard you specify.',
          },
          {
            q: 'What are the lead time and shipping terms?',
            a: 'Both are quoted per project, together with the technical proposal. They depend on the scope (a new station or an adaptation of the existing tank) and on the destination.',
          },
          {
            q: 'What is the response time?',
            a: 'Under 24 business hours. A technical advisor replies with a defined next step: the additional information required, or a proposed date for the plant visit.',
          },
        ],
      },
      closing:
        'Process filtration for lines that cannot stop. Engineered on the plant floor, built in-house, commissioned at your plant.',
      whatsapp:
        'Hello. I am contacting you from the Trans-Fil tube-forming page. I would like to request a plant survey for mill coolant filtration.',
    },

    pt: {
      page: 'conformado',
      event: 'conformado',
      meta: {
        title: 'Filtragem para linhas de conformação de tubos | Trans-Fil',
        description:
          'Filtragem centralizada, separação magnética e recuperação de óleo tramp para formadoras ERW. Levantamento em planta. Fabricação em Córdoba.',
        ogTitle: 'Filtragem para linhas de conformação de tubos',
        ogDescription:
          'Filtragem centralizada, separação magnética e recuperação de óleo tramp para linhas ERW / HFW. Levantamento em planta antes da proposta técnica.',
        ogImageAlt: 'Central de filtragem de fluido de corte Trans-Fil',
        twitterDescription:
          'Filtragem de processo para linhas que não podem parar. Projetada em planta, fabricada em Córdoba.',
      },
      breadcrumb: 'Conformação de tubos',
      service: {
        name: 'Filtragem de fluido para linhas de conformação de tubos',
        description:
          'Filtragem centralizada, separação magnética e recuperação de óleo tramp para linhas de conformação de tubos ERW / HFW, perfilação e trefilação.',
        serviceType: 'Filtragem industrial de fluidos de processo',
      },
      nav: { system: 'O sistema', why: 'Por que a Trans-Fil', faq: 'Dúvidas', contact: 'Levantamento' },
      hero: {
        eyebrow: '[ Filtragem de processo · Conformação de tubos · ERW / HFW / Perfilação / Trefilação ]',
        h1: 'O fluido contaminado reduz a vida útil do ferramental e aumenta a sucata.',
        sub: 'Filtragem centralizada para linhas de conformação de tubos: separação magnética, filtragem de sólidos e recuperação de óleo tramp. Fabricação própria em Córdoba. Realizamos um levantamento em planta antes de apresentar a proposta técnica.',
        ctaPrimary: 'Solicitar levantamento em planta',
        ctaSecondary: 'WhatsApp',
        media: HERO_MEDIA,
      },
      numbers: {
        items: [
          { v: '2–4×', l: 'vida útil do fluido de corte' },
          { v: '−50/70%', l: 'frequência de troca do solúvel' },
          { v: '+10/30%', l: 'vida útil de ferramenta' },
        ],
        note: 'Faixas típicas em instalações com tratamento adequado. Os valores de cada linha são determinados durante o levantamento em planta.',
      },
      problem: {
        eyebrow: '[ 01 — O problema ]',
        title: 'A condição do fluido determina a vida útil do ferramental.',
        symptom:
          'O lubrificante da formadora acumula finos metálicos e óleo tramp. O fluido degradado perde capacidade lubrificante e acelera o desgaste de roletes e matrizes: aparecem marcas na superfície do tubo, a sucata aumenta e a frequência de troca do solúvel cresce, com o consequente custo de destinação.',
        solution:
          'Filtragem centralizada, separação magnética e recuperação de óleo, dimensionadas sobre a vazão real da linha e o seu layout. O fluido retorna à formadora limpo, com temperatura e pressão estáveis.',
        benefit:
          'Protege o ferramental de conformação, multiplica a vida útil do fluido e reduz as paradas programadas para troca de solúvel.',
      },
      system: {
        eyebrow: '[ 02 — O sistema ]',
        title: 'Três etapas de filtragem e uma central de processo.',
        intro:
          'Cada etapa remove um contaminante diferente. Instaladas em série sobre o tanque da linha, o fluido que retorna à formadora não carrega finos ferrosos, sólidos nem óleo tramp.',
        blocks: [
          {
            code: 'F01',
            title: 'Finos ferrosos → separação magnética',
            desc: 'Tambores e barras magnéticas que retiram a partícula ferrosa micrométrica antes do filtro principal. É a etapa que evita a saturação prematura da manta filtrante e a de maior incidência sobre o acabamento superficial do tubo.',
            media: { ...MEDIA.magnetic, alt: 'Separador magnético de tambor Trans-Fil em operação' },
          },
          {
            code: 'F02',
            title: 'Sólidos → filtro de esteira',
            desc: 'Filtragem por gravidade com manta de papel ou têxtil (depurador a tecido), com avanço automático conforme o nível do banho. Baixo custo operacional e resíduo seco rebobinado, apto para destinação sem manuseio adicional.',
            media: { ...MEDIA.band, alt: 'Filtro de esteira por gravidade Trans-Fil' },
          },
          {
            code: 'F03',
            title: 'Óleo tramp → skimmer',
            desc: 'Skimmers de esteira e separadores coalescentes que retiram o óleo tramp, principal responsável pela queda de pH, pelo odor e pelo descarte antecipado da emulsão. Sua remoção é a variável de maior impacto sobre a vida útil do fluido.',
            media: { ...MEDIA.oil, alt: 'Skimmer de recuperação de óleo Trans-Fil' },
          },
          {
            code: 'F04',
            title: 'Integração → central de filtragem',
            desc: 'Estação de bombeamento, pressurização e controle de temperatura que alimenta a linha inteira. Mantém vazão e temperatura estáveis independentemente do consumo de cada posto, com monitoramento de pressão e nível e alarmes configuráveis.',
            media: { ...MEDIA.central, alt: 'Central de filtragem Trans-Fil: skid de bombeamento, filtros, trocador e tanque' },
          },
        ],
      },
      centralTour: {
        eyebrow: 'Percurso 3D · 1 min 21 s',
        hint: {
          pointer: 'Escolha um capítulo para ir direto à etapa',
          touch: 'Tela cheia para ler os rótulos',
        },
        alt: 'Vídeo: percurso tridimensional da central de filtragem Trans-Fil. O fluido contaminado entra na centrífuga e no tambor magnético, que retira os finos ferrosos; atravessa a manta do filtro de esteira, que avança sozinha quando o nível sobe; o skimmer retira o óleo tramp do tanque; e a bomba, o trocador de placas e os filtros de saco entregam fluido limpo em baixa e alta pressão. Um painel mostra o status do CLP em cada etapa.',
        goTo: 'Ir para',
        src: '/video/central-tour-pt.mp4',
        poster: '/img/central-tour-pt.webp',
        chapters: [
          { t: 0, code: '', label: 'A central completa' },
          { t: 8, code: 'F01', label: 'Separação magnética' },
          { t: 24, code: 'F02', label: 'Filtro de esteira' },
          { t: 41, code: 'F03', label: 'Skimmer' },
          { t: 55, code: 'F04', label: 'Bombeamento e temperatura' },
          { t: 71, code: '', label: 'Saídas de fluido limpo' },
        ],
      },
      machineDiagram: {
        caption: 'Diagrama de máquinas / Operação de conformação de tubos',
        hint: {
          pointer: 'Arraste para orbitar · role para aproximar · clique em um circuito para isolá-lo',
          touch: 'Toque em um circuito para isolá-lo · dois dedos para orbitar',
        },
        alt: 'Diagrama tridimensional de uma operação de conformação de tubos com filtragem Trans-Fil: a linha de conformação devolve o fluido a filtrar ao back de transferência, que o bombeia para a centrífuga montada sobre a central de filtragem; da central saem o fluido filtrado de baixa pressão para as estações de conformação e o fluido duplamente filtrado de alta pressão para o aplicador protetor e a calibragem, e um circuito de água a conecta à torre de resfriamento.',
        eq: {
          back: 'Back de transferência',
          centrifuge: 'Centrífuga',
          line: 'Linha de conformação',
          appl: 'Aplicador protetor',
          central: 'Central de filtragem',
          tower: 'Torre de resfriamento',
        },
        tags: { lp: 'Fluido filtrado\nBaixa pressão', hp: 'Fluido duplamente filtrado\nAlta pressão' },
        circuits: [
          { name: 'Fluido a filtrar', sub: 'Retorno de cada estação à central' },
          { name: 'Fluido filtrado — baixa pressão', sub: 'Tubo grosso, vazão lenta — rega as estações de conformação' },
          { name: 'Fluido duplamente filtrado — alta pressão', sub: 'Tubo fino, vazão rápida — aplicador protetor e calibragem' },
          { name: 'Água de resfriamento', sub: 'Circuito central ↔ torre' },
        ],
      },
      why: {
        eyebrow: '[ 03 — Por que a Trans-Fil ]',
        title: 'Fabricação própria em Córdoba e serviço na região.',
        items: [
          { t: 'Fabricação própria', d: 'Oficina própria em Córdoba: engenharia, corte, dobra, montagem e painel são executados na mesma planta.' },
          { t: 'Peças disponíveis', d: 'Consumíveis e peças de reposição com disponibilidade regional, sem os prazos de uma importação.' },
          { t: 'Dimensionamento sob medida', d: 'A central é dimensionada sobre o tanque, a vazão e o espaço disponível de cada instalação.' },
          { t: 'Integração com o processo', d: 'A mesma engenharia que fornece transporte de cavaco e lavagem de peças: um único interlocutor técnico.' },
          { t: 'Continuidade de serviço', d: 'Equipamentos instalados na década de 1990 seguem em operação, com suporte e peças de reposição vigentes.' },
          { t: '36 anos · 14 países', d: 'Desde 1989 na mesma oficina, com mais de 120 clientes industriais em 14 países.' },
        ],
      },
      proof: {
        eyebrow: '[ 04 — Histórico ]',
        title: 'Plantas que operam com equipamentos Trans-Fil.',
        sub: 'Siderurgia, tubos, automotivo e máquinas-ferramenta na Argentina e na região.',
      },
      form: {
        eyebrow: '[ 05 — Levantamento ]',
        title: 'O levantamento em planta precede a proposta.',
        sub: 'Informe de qual linha se trata e qual fluido ela utiliza. Um consultor técnico responde em menos de 24 horas úteis com o próximo passo definido.',
        lineTypeLabel: 'Tipo de linha',
        lineTypeOpts: ['Tubos', 'Perfilação', 'Usinagem', 'Retificação', 'Outra'],
        defaultLinea: 'Filtragem',
        waPrompt: 'Prefere WhatsApp?',
        waCta: 'Falar pelo WhatsApp',
        successTitle: 'Consulta recebida.',
        successBody: 'Um consultor técnico entrará em contato em menos de 24 horas úteis. Se a sua consulta for urgente, fale com a gente pelo WhatsApp.',
        successWa: 'Abrir WhatsApp',
      },
      faq: {
        eyebrow: '[ 06 — Dúvidas frequentes ]',
        title: 'Dúvidas habituais anteriores ao levantamento.',
        items: [
          {
            q: 'É aplicável a linhas ERW, HFW e perfiladeiras?',
            a: 'Sim. O sistema é dimensionado sobre a vazão e o tipo de fluido, não sobre a marca da formadora. Trabalhamos em linhas ERW e HFW de tubo com costura, perfiladeiras de conformação a frio e linhas de trefilação.',
          },
          {
            q: 'É possível adaptar o tanque existente?',
            a: 'Na maioria dos casos sim, e é a alternativa mais habitual: mantém-se o tanque e incorporam-se as etapas faltantes — separação magnética, filtro de esteira ou skimmer — junto com a central de bombeamento. O levantamento determina se cabe uma adaptação ou um equipamento novo.',
          },
          {
            q: 'Quais contaminantes são removidos?',
            a: 'Três, por meio de etapas independentes: finos ferrosos por separação magnética, sólidos não ferrosos e partícula grossa por filtro de esteira, e óleo tramp por skimmer ou separador coalescente. Nenhuma etapa substitui as outras.',
          },
          {
            q: 'Que resultados é razoável esperar?',
            a: 'Em instalações com tratamento adequado, a vida útil do fluido de corte se multiplica de 2 a 4 vezes, a troca de solúvel se reduz entre 50% e 70% e a vida útil de ferramenta aumenta entre 10% e 30%. São faixas típicas: os valores de cada linha são determinados durante o levantamento.',
          },
          {
            q: 'Qual é o prazo de resposta?',
            a: 'Menos de 24 horas úteis. A resposta é emitida por um consultor técnico e inclui o próximo passo definido: a informação adicional necessária ou a data proposta para a visita à planta.',
          },
          {
            q: 'Formulário ou WhatsApp?',
            a: 'Os dois canais chegam à mesma equipe técnica e têm o mesmo prazo de resposta. O formulário permite detalhar as condições da linha; o WhatsApp é mais ágil para uma consulta preliminar.',
          },
        ],
      },
      closing:
        'Filtragem de processo para linhas que não podem parar. Projetada em planta, fabricada em Córdoba, serviço na região.',
      whatsapp:
        'Olá. Entro em contato pela página de conformação da Trans-Fil. Gostaria de solicitar um levantamento em planta para filtragem de uma linha de tubos.',
    },
  },  mecanizado: {
    es: {
      page: 'mecanizado',
      event: 'mecanizado',
      meta: {
        title: 'Transporte de viruta y filtración de refrigerante para mecanizado CNC | Trans-Fil',
        description:
          'Transportadores de viruta y filtración de refrigerante para tornos y centros de mecanizado CNC: filtro de banda, separador magnético y skimmer. Relevamiento en planta.',
        ogTitle: 'Transporte de viruta y filtración para mecanizado CNC',
        ogDescription:
          'Transportadores de viruta y filtración de refrigerante diseñados como un solo sistema para tornos y centros de mecanizado CNC. Relevamiento en planta previo a la propuesta técnica.',
        ogImageAlt: 'Transportador de viruta Trans-Fil',
        twitterDescription:
          'Viruta afuera y refrigerante limpio: transporte de viruta y filtración para mecanizado CNC, con fabricación propia.',
      },
      breadcrumb: 'Mecanizado CNC',
      service: {
        name: 'Transporte de viruta y filtración de refrigerante para mecanizado',
        description:
          'Transportadores de viruta por máquina y líneas centralizadas, con filtración de refrigerante por filtro de banda, separación magnética y recuperación de aceite de guías, para tornos y centros de mecanizado CNC.',
        serviceType: 'Manejo de viruta y filtración de refrigerante',
      },
      nav: { system: 'El sistema', why: 'Por qué Trans-Fil', faq: 'Consultas', contact: 'Relevamiento' },
      hero: {
        eyebrow: '[ Mecanizado CNC · Tornos · Centros de mecanizado · Rectificado ]',
        h1: 'La viruta acumulada y el refrigerante contaminado detienen la máquina y desgastan la herramienta.',
        sub: 'Transportadores de viruta y filtración de refrigerante para tornos y centros de mecanizado CNC, diseñados como un solo sistema: la viruta sale de la máquina y el refrigerante vuelve limpio. Fabricación propia. Realizamos un relevamiento en planta antes de presentar la propuesta técnica.',
        ctaPrimary: 'Solicitar relevamiento en planta',
        ctaSecondary: 'WhatsApp',
        media: HERO_MEDIA,
      },
      numbers: {
        items: [
          { v: '2–4×', l: 'vida útil del refrigerante' },
          { v: '+10/30%', l: 'vida útil de herramienta' },
          { v: '24/7', l: 'evacuación continua de viruta, sin paros para limpiar' },
        ],
        note: 'Rangos típicos en instalaciones con tratamiento adecuado. Los valores de cada planta se determinan durante el relevamiento.',
      },
      problem: {
        eyebrow: '[ 01 — El problema ]',
        title: 'La viruta y el refrigerante se resuelven juntos.',
        symptom:
          'La viruta se acumula en la bandeja de la máquina y los finos recirculan con el refrigerante; el aceite de guías lo contamina. El resultado: paros para sacar viruta a mano, desgaste prematuro de herramienta, bombas y husillos dañados y recambios frecuentes de soluble.',
        solution:
          'Un transportador de viruta en cada máquina, o una línea centralizada para toda la nave, y la filtración del refrigerante con filtro de banda, separación magnética y skimmer. Se dimensionan juntos sobre el tipo de viruta, el refrigerante, el caudal y el layout.',
        benefit:
          'La máquina no se detiene por viruta, la herramienta dura más y el refrigerante se reutiliza varias veces antes de descartarlo.',
      },
      system: {
        eyebrow: '[ 02 — El sistema ]',
        title: 'Transporte de viruta y filtración, en un solo sistema.',
        intro:
          'El transportador saca la viruta de la máquina y el refrigerante que escurre de ella pasa al filtro antes de volver. Por eso se diseñan juntos: un transportador que arrastra finos satura el filtro, y un filtro sin transportador se llena de viruta.',
        blocks: [
          {
            code: 'V01',
            title: 'Viruta → transportador en la máquina',
            desc: 'Transportadores de bisagra, raspador, magnéticos o de cinta, según el tipo de viruta y el caudal. Sacan la viruta de la bandeja de forma continua y la descargan en el contenedor, sin detener la máquina.',
            media: { ...MEDIA.chips, alt: 'Transportador de viruta de bisagra Trans-Fil' },
          },
          {
            code: 'V02',
            title: 'Varias máquinas → línea centralizada',
            desc: 'Una línea que evacúa la viruta de toda la nave hacia un único punto de descarga. Conecta decenas de máquinas-herramienta al mismo circuito y elimina el traslado manual entre estaciones.',
            media: { ...MEDIA.chipLine, alt: 'Línea centralizada de transporte de viruta Trans-Fil' },
          },
          {
            code: 'F01',
            title: 'Finos y sólidos → separador magnético y filtro de banda',
            desc: 'El separador magnético retira la partícula ferrosa fina y el filtro de banda retiene el resto, por gravedad, con tela de papel o textil. La tela avanza sola según el nivel del baño y descarga el residuo seco.',
            media: { ...MEDIA.magnetic, alt: 'Separador magnético de tambor Trans-Fil en operación' },
          },
          {
            code: 'F02',
            title: 'Aceite de guías → skimmer y central de refrigerante',
            desc: 'El skimmer retira el aceite de guías que sobrenada en el tanque, principal causa de olor y de descarte anticipado de la emulsión. Una central de refrigerante puede alimentar varias máquinas con caudal y temperatura estables.',
            media: { ...MEDIA.oil, alt: 'Skimmer de recuperación de aceite Trans-Fil' },
          },
        ],
      },
      why: {
        eyebrow: '[ 03 — Por qué Trans-Fil ]',
        title: 'Un solo proveedor para la viruta y el refrigerante.',
        items: [
          { t: 'Diseñados juntos', d: 'El transportador y el filtro se dimensionan como un sistema: el mismo equipo de ingeniería resuelve por dónde sale la viruta y a dónde va el refrigerante.' },
          { t: 'Según la viruta', d: 'Bisagra para viruta larga o enredada, raspador para viruta corta y finos, magnético para viruta ferrosa pequeña. Se elige sobre la viruta real de cada proceso.' },
          { t: 'Sobre la máquina existente', d: 'Altura de descarga, bandeja y tanque se relevan en planta, y cada equipo se valida con diseño 3D antes de fabricarlo.' },
          { t: 'Fabricación propia', d: 'Ingeniería, corte, plegado, montaje y tablero en nuestra planta de Córdoba: una sola empresa responde por el sistema completo.' },
          { t: 'Para operar 24/7', d: 'Construcción robusta para operación continua, con repuestos y asistencia técnica. Equipos instalados en los años 90 siguen en marcha.' },
          { t: '36 años · 14 países', d: 'Desde 1989, con más de 120 clientes industriales en 14 países, en automotriz, máquinas-herramienta y siderurgia.' },
        ],
      },
      proof: {
        eyebrow: '[ 04 — Antecedentes ]',
        title: 'Plantas que operan con equipos Trans-Fil.',
        sub: 'Automotriz, máquinas-herramienta, siderurgia y tubos, en 14 países.',
      },
      form: {
        eyebrow: '[ 05 — Relevamiento ]',
        title: 'El relevamiento en planta precede a la propuesta.',
        sub: 'Indíquenos qué máquinas tiene, qué viruta generan y qué refrigerante usan. Un asesor técnico responde en menos de 24 horas hábiles con el siguiente paso concreto.',
        lineTypeLabel: 'Proceso',
        lineTypeOpts: ['Torneado', 'Centros de mecanizado', 'Rectificado', 'Línea transfer', 'Otro'],
        defaultLinea: 'Transporte de viruta',
        waPrompt: '¿Prefiere WhatsApp?',
        waCta: 'Escribir por WhatsApp',
        successTitle: 'Consulta recibida.',
        successBody: 'Un asesor técnico se pondrá en contacto en menos de 24 horas hábiles. Si su consulta es urgente, puede escribirnos por WhatsApp.',
        successWa: 'Abrir WhatsApp',
      },
      faq: {
        eyebrow: '[ 06 — Consultas frecuentes ]',
        title: 'Consultas habituales previas al relevamiento.',
        items: [
          {
            q: '¿Sirve para tornos y centros de mecanizado de cualquier marca?',
            a: 'Sí. El transportador y el filtro se dimensionan sobre la máquina, la viruta y el refrigerante, no sobre la marca. En el relevamiento se miden la altura de descarga, la bandeja y el tanque de cada máquina.',
          },
          {
            q: '¿Qué transportador corresponde a mi viruta?',
            a: 'Depende de la forma y del material: bisagra para viruta larga o enredada, raspador para viruta corta y finos, magnético para viruta ferrosa pequeña. En muchos casos se combina con un filtro para el refrigerante que escurre de la viruta.',
          },
          {
            q: '¿Se pueden centralizar la viruta y el refrigerante de varias máquinas?',
            a: 'Sí. Una línea centralizada lleva la viruta de toda la nave a un único punto de descarga, y una central de refrigerante alimenta varias máquinas con fluido filtrado, a caudal y temperatura estables.',
          },
          {
            q: '¿Qué resultados es razonable esperar?',
            a: 'Con tratamiento adecuado, la vida útil del refrigerante se multiplica entre 2 y 4 veces y la de la herramienta aumenta entre un 10% y un 30%; el transporte de viruta elimina los paros por limpieza manual. Son rangos típicos: los valores de cada planta se determinan durante el relevamiento.',
          },
          {
            q: '¿Cuál es el plazo de respuesta?',
            a: 'Menos de 24 horas hábiles. La respuesta la emite un asesor técnico e incluye el siguiente paso concreto: la información adicional requerida o la fecha propuesta para la visita a planta.',
          },
          {
            q: '¿Conviene el formulario o WhatsApp?',
            a: 'Ambos canales llegan al mismo equipo técnico y tienen el mismo plazo de respuesta. El formulario permite detallar las máquinas y el proceso; WhatsApp resulta más ágil para una consulta preliminar.',
          },
        ],
      },
      closing: 'Viruta afuera, refrigerante limpio. Diseñado en planta, fabricado por Trans-Fil.',
      whatsapp:
        'Hola. Los contacto desde la página de mecanizado de Trans-Fil. Quisiera solicitar un relevamiento en planta para transporte de viruta y filtración de refrigerante.',
    },

    en: {
      page: 'mecanizado',
      event: 'mecanizado',
      meta: {
        title: 'Chip conveyors and coolant filtration for CNC machining | Trans-Fil',
        description:
          'Chip conveyors and coolant filtration for CNC lathes and machining centers: belt filters, magnetic separators and skimmers, engineered as one system. Plant survey first.',
        ogTitle: 'Chip conveyors and coolant filtration for CNC machining',
        ogDescription:
          'Chip conveyors and coolant filtration engineered as one system for CNC lathes and machining centers. A plant survey precedes the technical proposal.',
        ogImageAlt: 'Trans-Fil chip conveyor',
        twitterDescription:
          'Chips out, clean coolant back: chip conveying and coolant filtration for CNC machining, built in-house by Trans-Fil.',
      },
      breadcrumb: 'CNC machining',
      service: {
        name: 'Chip conveying and coolant filtration for machining',
        description:
          'Per-machine chip conveyors and centralized chip lines, with coolant filtration by belt filter, magnetic separation and way-oil removal, for CNC lathes and machining centers.',
        serviceType: 'Chip handling and coolant filtration',
      },
      nav: { system: 'The system', why: 'Why Trans-Fil', faq: 'FAQ', contact: 'Plant survey' },
      hero: {
        eyebrow: '[ CNC machining · Lathes · Machining centers · Grinding ]',
        h1: 'Chip buildup and dirty coolant stop the machine and wear out the tooling.',
        sub: 'Chip conveyors and coolant filtration for CNC lathes and machining centers, engineered as one system: chips leave the machine and coolant comes back clean. Designed and built in-house by Trans-Fil since 1989. A plant survey precedes every technical proposal.',
        ctaPrimary: 'Request a plant survey',
        ctaSecondary: 'WhatsApp',
        media: HERO_MEDIA,
      },
      numbers: {
        items: [
          { v: '2–4×', l: 'coolant service life' },
          { v: '+10/30%', l: 'tool service life' },
          { v: '24/7', l: 'continuous chip removal, no stops to clean out' },
        ],
        note: 'Typical ranges in installations with adequate treatment. Figures for each plant are established during the survey.',
      },
      problem: {
        eyebrow: '[ 01 — The problem ]',
        title: 'Chips and coolant are solved together.',
        symptom:
          'Chips pile up in the machine pan and fines recirculate with the coolant, while way oil contaminates it. The result: stops to clear chips by hand, premature tool wear, damaged pumps and spindles, and frequent coolant changes.',
        solution:
          'A chip conveyor on each machine, or a centralized line for the whole shop, plus coolant filtration by belt filter, magnetic separation and skimmer. Both are sized together around the chip type, the coolant, the flow rate and the layout.',
        benefit:
          'The machine no longer stops for chips, tools last longer and the coolant is reused several times over before disposal.',
      },
      system: {
        eyebrow: '[ 02 — The system ]',
        title: 'Chip conveying and filtration, as one system.',
        intro:
          'The conveyor takes chips out of the machine, and the coolant that drains from them goes through the filter before it returns. That is why they are engineered together: a conveyor that carries fines overloads the filter, and a filter without a conveyor fills up with chips.',
        blocks: [
          {
            code: 'V01',
            title: 'Chips → conveyor at the machine',
            desc: 'Hinged-belt, scraper, magnetic or belt conveyors, chosen by chip type and volume. They remove chips from the pan continuously and discharge them into the hopper without stopping the machine.',
            media: { ...MEDIA.chips, alt: 'Trans-Fil hinged-belt chip conveyor' },
          },
          {
            code: 'V02',
            title: 'Several machines → centralized line',
            desc: 'A line that carries chips from the whole shop floor to a single discharge point. It connects dozens of machine tools to one circuit and removes manual handling between stations.',
            media: { ...MEDIA.chipLine, alt: 'Trans-Fil centralized chip conveying line' },
          },
          {
            code: 'F01',
            title: 'Fines and solids → magnetic separator and belt filter',
            desc: 'The magnetic separator removes fine ferrous particles and the belt filter retains the rest by gravity, on paper or textile media. The media advances automatically with the bath level and discharges dry residue.',
            media: { ...MEDIA.magnetic, alt: 'Trans-Fil magnetic drum separator in operation' },
          },
          {
            code: 'F02',
            title: 'Way oil → skimmer and central coolant system',
            desc: 'The skimmer removes the way oil floating on the tank, the main cause of odor and early disposal of the emulsion. A central coolant system can feed several machines at stable flow and temperature.',
            media: { ...MEDIA.oil, alt: 'Trans-Fil oil-recovery skimmer' },
          },
        ],
      },
      why: {
        eyebrow: '[ 03 — Why Trans-Fil ]',
        title: 'One supplier for chips and coolant.',
        items: [
          { t: 'Engineered together', d: 'Conveyor and filter are sized as one system: the same engineering team decides where the chips go and where the coolant goes.' },
          { t: 'Matched to the chip', d: 'Hinged belt for long or stringy chips, scraper for short chips and fines, magnetic for small ferrous chips. The choice is made on the actual chips of each process.' },
          { t: 'Fits existing machines', d: 'Discharge height, chip pan and tank are measured on site, and every unit is validated in 3D before it is built.' },
          { t: 'Built to your electrical standard', d: 'Control panels are designed for 480 V / 60 Hz, or your plant’s own supply, and built to the electrical standard you specify.' },
          { t: 'On-site commissioning', d: 'Trans-Fil technicians travel to your plant for installation and commissioning. After start-up, the same engineering team supports you remotely.' },
          { t: '36 years · 14 countries', d: 'Since 1989, with over 120 industrial customers in 14 countries, including the United States. Units installed in the 1990s are still in operation.' },
        ],
      },
      proof: {
        eyebrow: '[ 04 — Track record ]',
        title: 'Plants operating with Trans-Fil equipment.',
        sub: 'Automotive, machine-tool, steel and tube plants in 14 countries.',
      },
      form: {
        eyebrow: '[ 05 — Plant survey ]',
        title: 'The plant survey precedes the proposal.',
        sub: 'Tell us which machines you run, what chips they produce and which coolant you use. A technical advisor replies within 24 business hours with a defined next step.',
        lineTypeLabel: 'Process',
        lineTypeOpts: ['Turning', 'Machining centers', 'Grinding', 'Transfer line', 'Other'],
        defaultLinea: 'Chip conveying',
        waPrompt: 'Would you prefer WhatsApp?',
        waCta: 'Message us on WhatsApp',
        successTitle: 'Inquiry received.',
        successBody: 'A technical advisor will be in touch within 24 business hours. If your inquiry is urgent, you can also reach us on WhatsApp.',
        successWa: 'Open WhatsApp',
      },
      faq: {
        eyebrow: '[ 06 — Frequently asked ]',
        title: 'Questions we are commonly asked before the survey.',
        items: [
          {
            q: 'Does it work with any brand of lathe or machining center?',
            a: 'Yes. Conveyor and filter are sized around the machine, the chips and the coolant, not the brand. During the survey we measure the discharge height, the chip pan and the tank of each machine.',
          },
          {
            q: 'Which conveyor suits my chips?',
            a: 'It depends on chip shape and material: hinged belt for long or stringy chips, scraper for short chips and fines, magnetic for small ferrous chips. It is often combined with a filter for the coolant that drains from the chips.',
          },
          {
            q: 'Can chips and coolant from several machines be centralized?',
            a: 'Yes. A centralized line takes chips from the whole shop floor to a single discharge point, and a central coolant system feeds several machines with filtered coolant at stable flow and temperature.',
          },
          {
            q: 'What results can reasonably be expected?',
            a: 'With adequate treatment, coolant service life increases by a factor of 2 to 4 and tool life rises by 10% to 30%, while chip conveying removes stops for manual clean-out. These are typical ranges: figures for each plant are established during the survey.',
          },
          {
            q: 'Is the control panel built for US plants?',
            a: 'Yes. The panel is designed for 480 V / 60 Hz, or your plant’s own supply, and built to the electrical standard you specify.',
          },
          {
            q: 'What are the lead time and shipping terms?',
            a: 'Both are quoted per project, together with the technical proposal. They depend on the scope and on the destination.',
          },
        ],
      },
      closing: 'Chips out, clean coolant back. Engineered on the plant floor, built in-house by Trans-Fil.',
      whatsapp:
        'Hello. I am contacting you from the Trans-Fil machining page. I would like to request a plant survey for chip conveying and coolant filtration.',
    },

    pt: {
      page: 'mecanizado',
      event: 'mecanizado',
      meta: {
        title: 'Transportador de cavacos e filtragem de fluido de corte para usinagem CNC | Trans-Fil',
        description:
          'Transportadores de cavacos e filtragem de fluido de corte para tornos e centros de usinagem CNC: filtro de esteira, separador magnético e skimmer. Levantamento na planta.',
        ogTitle: 'Transportador de cavacos e filtragem para usinagem CNC',
        ogDescription:
          'Transportadores de cavacos e filtragem de fluido de corte projetados como um único sistema para tornos e centros de usinagem CNC. Levantamento na planta antes da proposta técnica.',
        ogImageAlt: 'Transportador de cavacos Trans-Fil',
        twitterDescription:
          'Cavaco fora e fluido de corte limpo: transporte de cavacos e filtragem para usinagem CNC, com fabricação própria.',
      },
      breadcrumb: 'Usinagem CNC',
      service: {
        name: 'Transporte de cavacos e filtragem de fluido de corte para usinagem',
        description:
          'Transportadores de cavacos por máquina e linhas centralizadas, com filtragem de fluido de corte por filtro de esteira, separação magnética e remoção de óleo de barramento, para tornos e centros de usinagem CNC.',
        serviceType: 'Manuseio de cavacos e filtragem de fluido de corte',
      },
      nav: { system: 'O sistema', why: 'Por que a Trans-Fil', faq: 'Dúvidas', contact: 'Levantamento' },
      hero: {
        eyebrow: '[ Usinagem CNC · Tornos · Centros de usinagem · Retificação ]',
        h1: 'Cavaco acumulado e fluido de corte contaminado param a máquina e desgastam a ferramenta.',
        sub: 'Transportadores de cavacos e filtragem de fluido de corte para tornos e centros de usinagem CNC, projetados como um único sistema: o cavaco sai da máquina e o fluido volta limpo. Fabricação própria. Fazemos um levantamento na planta antes de apresentar a proposta técnica.',
        ctaPrimary: 'Solicitar levantamento na planta',
        ctaSecondary: 'WhatsApp',
        media: HERO_MEDIA,
      },
      numbers: {
        items: [
          { v: '2–4×', l: 'vida útil do fluido de corte' },
          { v: '+10/30%', l: 'vida útil da ferramenta' },
          { v: '24/7', l: 'remoção contínua de cavaco, sem paradas para limpar' },
        ],
        note: 'Faixas típicas em instalações com tratamento adequado. Os valores de cada planta são definidos no levantamento.',
      },
      problem: {
        eyebrow: '[ 01 — O problema ]',
        title: 'Cavaco e fluido de corte se resolvem juntos.',
        symptom:
          'O cavaco se acumula na bandeja da máquina e os finos recirculam com o fluido de corte, que ainda é contaminado pelo óleo de barramento. O resultado: paradas para tirar cavaco à mão, desgaste prematuro da ferramenta, bombas e fusos danificados e trocas frequentes de fluido.',
        solution:
          'Um transportador de cavacos em cada máquina, ou uma linha centralizada para toda a fábrica, e a filtragem do fluido com filtro de esteira, separação magnética e skimmer. São dimensionados juntos a partir do tipo de cavaco, do fluido, da vazão e do layout.',
        benefit:
          'A máquina não para por causa do cavaco, a ferramenta dura mais e o fluido é reutilizado várias vezes antes do descarte.',
      },
      system: {
        eyebrow: '[ 02 — O sistema ]',
        title: 'Transporte de cavacos e filtragem, em um único sistema.',
        intro:
          'O transportador retira o cavaco da máquina e o fluido que escorre dele passa pelo filtro antes de voltar. Por isso são projetados juntos: um transportador que arrasta finos satura o filtro, e um filtro sem transportador se enche de cavaco.',
        blocks: [
          {
            code: 'V01',
            title: 'Cavaco → transportador na máquina',
            desc: 'Transportadores de esteira articulada, raspador, magnéticos ou de correia, conforme o tipo de cavaco e o volume. Retiram o cavaco da bandeja de forma contínua e o descarregam na caçamba, sem parar a máquina.',
            media: { ...MEDIA.chips, alt: 'Transportador de cavacos de esteira articulada Trans-Fil' },
          },
          {
            code: 'V02',
            title: 'Várias máquinas → linha centralizada',
            desc: 'Uma linha que leva o cavaco de toda a fábrica até um único ponto de descarga. Conecta dezenas de máquinas-ferramenta ao mesmo circuito e elimina o transporte manual entre estações.',
            media: { ...MEDIA.chipLine, alt: 'Linha centralizada de transporte de cavacos Trans-Fil' },
          },
          {
            code: 'F01',
            title: 'Finos e sólidos → separador magnético e filtro de esteira',
            desc: 'O separador magnético retira a partícula ferrosa fina e o filtro de esteira retém o restante por gravidade, com manta de papel ou tecido. A manta avança sozinha conforme o nível do banho e descarrega o resíduo seco.',
            media: { ...MEDIA.magnetic, alt: 'Separador magnético de tambor Trans-Fil em operação' },
          },
          {
            code: 'F02',
            title: 'Óleo de barramento → skimmer e central de fluido',
            desc: 'O skimmer retira o óleo de barramento que flutua no tanque, principal causa de mau cheiro e de descarte antecipado da emulsão. Uma central de fluido pode alimentar várias máquinas com vazão e temperatura estáveis.',
            media: { ...MEDIA.oil, alt: 'Skimmer de recuperação de óleo Trans-Fil' },
          },
        ],
      },
      why: {
        eyebrow: '[ 03 — Por que a Trans-Fil ]',
        title: 'Um único fornecedor para o cavaco e o fluido de corte.',
        items: [
          { t: 'Projetados juntos', d: 'Transportador e filtro são dimensionados como um sistema: a mesma equipe de engenharia define por onde sai o cavaco e para onde vai o fluido.' },
          { t: 'De acordo com o cavaco', d: 'Esteira articulada para cavaco longo ou emaranhado, raspador para cavaco curto e finos, magnético para cavaco ferroso pequeno. A escolha é feita sobre o cavaco real de cada processo.' },
          { t: 'Sobre a máquina existente', d: 'Altura de descarga, bandeja e tanque são medidos na planta, e cada equipamento é validado em 3D antes da fabricação.' },
          { t: 'Fabricação própria', d: 'Engenharia, corte, dobra, montagem e painel na nossa planta de Córdoba, Argentina: uma única empresa responde pelo sistema completo.' },
          { t: 'Para operar 24/7', d: 'Construção robusta para operação contínua, com peças de reposição e assistência técnica. Equipamentos instalados nos anos 90 seguem em operação.' },
          { t: '36 anos · 14 países', d: 'Desde 1989, com mais de 120 clientes industriais em 14 países, incluindo projetos no Brasil.' },
        ],
      },
      proof: {
        eyebrow: '[ 04 — Referências ]',
        title: 'Plantas que operam com equipamentos Trans-Fil.',
        sub: 'Automotivo, máquinas-ferramenta, siderurgia e tubos, em 14 países.',
      },
      form: {
        eyebrow: '[ 05 — Levantamento ]',
        title: 'O levantamento na planta vem antes da proposta.',
        sub: 'Conte quais máquinas você tem, que cavaco geram e qual fluido de corte usam. Um consultor técnico responde em até 24 horas úteis com o próximo passo definido.',
        lineTypeLabel: 'Processo',
        lineTypeOpts: ['Torneamento', 'Centros de usinagem', 'Retificação', 'Linha transfer', 'Outro'],
        defaultLinea: 'Transporte de cavaco',
        waPrompt: 'Prefere WhatsApp?',
        waCta: 'Escrever pelo WhatsApp',
        successTitle: 'Consulta recebida.',
        successBody: 'Um consultor técnico entrará em contato em até 24 horas úteis. Se a sua consulta for urgente, você pode nos escrever pelo WhatsApp.',
        successWa: 'Abrir WhatsApp',
      },
      faq: {
        eyebrow: '[ 06 — Dúvidas frequentes ]',
        title: 'Dúvidas comuns antes do levantamento.',
        items: [
          {
            q: 'Serve para tornos e centros de usinagem de qualquer marca?',
            a: 'Sim. Transportador e filtro são dimensionados a partir da máquina, do cavaco e do fluido, não da marca. No levantamento medimos a altura de descarga, a bandeja e o tanque de cada máquina.',
          },
          {
            q: 'Qual transportador serve para o meu cavaco?',
            a: 'Depende da forma e do material: esteira articulada para cavaco longo ou emaranhado, raspador para cavaco curto e finos, magnético para cavaco ferroso pequeno. Em muitos casos é combinado com um filtro para o fluido que escorre do cavaco.',
          },
          {
            q: 'É possível centralizar o cavaco e o fluido de várias máquinas?',
            a: 'Sim. Uma linha centralizada leva o cavaco de toda a fábrica a um único ponto de descarga, e uma central de fluido alimenta várias máquinas com fluido filtrado, com vazão e temperatura estáveis.',
          },
          {
            q: 'Que resultados é razoável esperar?',
            a: 'Com tratamento adequado, a vida útil do fluido de corte se multiplica de 2 a 4 vezes e a da ferramenta aumenta de 10% a 30%; o transporte de cavacos elimina as paradas para limpeza manual. São faixas típicas: os valores de cada planta são definidos no levantamento.',
          },
          {
            q: 'Qual é o prazo de resposta?',
            a: 'Até 24 horas úteis. A resposta vem de um consultor técnico e inclui o próximo passo definido: as informações adicionais necessárias ou a data proposta para a visita à planta.',
          },
          {
            q: 'Quais são o prazo de entrega e o frete?',
            a: 'Os dois são cotados por projeto, junto com a proposta técnica. Dependem do escopo e do destino.',
          },
        ],
      },
      closing: 'Cavaco fora, fluido de corte limpo. Projetado na planta, fabricado pela Trans-Fil.',
      whatsapp:
        'Olá. Entro em contato pela página de usinagem da Trans-Fil. Gostaria de solicitar um levantamento na planta para transporte de cavacos e filtragem de fluido de corte.',
    },
  },
};
