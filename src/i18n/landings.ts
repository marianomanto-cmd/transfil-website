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

export type LandingSlug = 'conformado';

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
    blocks: { code: string; title: string; desc: string; media: LandingMedia }[];
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
} as const;

/** Masthead loop, shared by every locale of this landing. */
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
          'Centralized coolant filtration, magnetic separation and tramp-oil recovery for ERW / tube mills. Plant survey before we quote. Built in Córdoba, Argentina.',
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
        sub: 'Centralized filtration for tube-forming lines: magnetic separation, solids filtration and tramp-oil recovery. Built in our own workshop in Córdoba. A plant survey precedes every technical proposal.',
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
            desc: 'Belt skimmers and coalescing separators that remove tramp oil, the main cause of falling pH, odour and premature disposal of the emulsion. Its removal is the single variable with the greatest impact on fluid service life.',
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
      why: {
        eyebrow: '[ 03 — Why Trans-Fil ]',
        title: 'Manufactured in our own Córdoba workshop, serviced across the region.',
        items: [
          { t: 'In-house manufacturing', d: 'Own workshop in Córdoba: engineering, cutting, bending, assembly and control cabinet are all carried out in the same plant.' },
          { t: 'Spare parts available', d: 'Consumables and spare parts held regionally, without import lead times.' },
          { t: 'Sized to the installation', d: 'The station is sized around the existing tank, the flow rate and the floor space available at each site.' },
          { t: 'Integration with the process', d: 'The same engineering team that supplies chip conveying and parts washing: a single technical point of contact.' },
          { t: 'Continuity of service', d: 'Units installed in the 1990s remain in operation, with support and spare parts still available.' },
          { t: '36 years · 14 countries', d: 'Operating from the same workshop since 1989, with over 120 industrial customers across 14 countries.' },
        ],
      },
      proof: {
        eyebrow: '[ 04 — Track record ]',
        title: 'Plants operating with Trans-Fil equipment.',
        sub: 'Steel, tube, automotive and machine-tool plants across Argentina and the region.',
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
        successTitle: 'Enquiry received.',
        successBody: 'A technical advisor will be in touch within 24 business hours. If your enquiry is urgent, you can reach us on WhatsApp.',
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
            q: 'What is the response time?',
            a: 'Under 24 business hours. The reply is issued by a technical advisor and includes a defined next step: the additional information required, or a proposed date for the plant visit.',
          },
          {
            q: 'Form or WhatsApp?',
            a: 'Both channels reach the same technical team and carry the same response time. The form allows the line conditions to be described in detail; WhatsApp is quicker for a preliminary enquiry.',
          },
        ],
      },
      closing:
        'Process filtration for lines that cannot stop. Engineered on the plant floor, built in Córdoba, serviced across the region.',
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
  },
};
