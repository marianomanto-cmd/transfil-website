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
          'Filtración centralizada + separación magnética + recuperación de aceite para líneas ERW / HFW. Relevamiento en planta antes de cotizar.',
        ogImageAlt: 'Estación centralizada de filtración de refrigerante Trans-Fil',
        twitterDescription:
          'Filtración de proceso para líneas de conformado de tubos. Diseñada en planta, fabricada en Córdoba.',
      },
      breadcrumb: 'Conformado de tubos',
      service: {
        name: 'Filtración de fluido para líneas de conformado de tubos',
        description:
          'Filtración centralizada, separación magnética y recuperación de aceite tramp para líneas de conformado de tubos ERW / HFW, perfilado y trefilado.',
        serviceType: 'Filtración industrial de fluidos de proceso',
      },
      nav: { system: 'El sistema', why: 'Por qué acá', faq: 'Preguntas', contact: 'Relevamiento' },
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
          { v: '2–4×', l: 'vida del refrigerante' },
          { v: '−50/70%', l: 'recambio de soluble' },
          { v: '+10/30%', l: 'vida de herramienta' },
        ],
        note: 'Rangos típicos en instalaciones con tratamiento adecuado. Se cuantifican en el relevamiento en su planta.',
      },
      problem: {
        eyebrow: '[ 01 — El problema ]',
        title: 'No es la matriz. Es el fluido que la moja.',
        symptom:
          'El lubricante de la formadora se carga de finos metálicos y aceite atrapado. El fluido degradado lubrica peor y acelera el desgaste de rodillos y matrices; aparecen marcas en la superficie del tubo, sube el scrap y el soluble se cambia cada vez más seguido — con su costo de disposición atrás.',
        solution:
          'Filtración centralizada + separación magnética + recuperación de aceite, dimensionada sobre el caudal real de la línea y su layout. El fluido vuelve a la formadora limpio, a temperatura y presión estables.',
        benefit:
          'Protege el herramental de conformado, multiplica la vida del fluido y saca el recambio de soluble de la lista de paros programados.',
      },
      system: {
        eyebrow: '[ 02 — El sistema ]',
        title: 'Tres etapas y una central.',
        intro:
          'Cada etapa saca un contaminante distinto. Puestas en serie sobre la pileta de la línea, el fluido que vuelve a la formadora no arrastra ni finos ferrosos, ni sólidos, ni aceite tramp.',
        blocks: [
          {
            code: 'F01',
            title: 'Finos ferrosos → separación magnética',
            desc: 'Tambores y barras imantadas que retiran la partícula ferrosa micrométrica antes del filtro principal. Es la etapa que evita que la tela se sature en horas y la que más rápido se nota en el acabado del tubo.',
            media: { ...MEDIA.magnetic, alt: 'Separador magnético de tambor Trans-Fil en operación' },
          },
          {
            code: 'F02',
            title: 'Sólidos → filtro de banda',
            desc: 'Filtración por gravedad con tela de papel o textil, con avance automático según el nivel del baño. Bajo costo operativo y residuo seco rebobinado, listo para disposición sin manipuleo.',
            media: { ...MEDIA.band, alt: 'Filtro de banda por gravedad Trans-Fil' },
          },
          {
            code: 'F03',
            title: 'Aceite tramp → skimmer',
            desc: 'Skimmers de banda y separadores coalescentes que retiran el aceite atrapado, que es la causa principal de que la emulsión baje el pH, tome olor y haya que tirarla. Sacarlo es lo que multiplica la vida del fluido.',
            media: { ...MEDIA.oil, alt: 'Skimmer de recuperación de aceite Trans-Fil' },
          },
          {
            code: 'F04',
            title: 'Todo junto → central de filtración',
            desc: 'Estación de bombeo, presurización y temperado que alimenta la línea completa. Mantiene caudal y temperatura estables independientemente del consumo de cada puesto, con monitoreo de presión, nivel y alarmas configurables.',
            media: { ...MEDIA.central, alt: 'Central de filtración Trans-Fil: skid de bombeo, filtros, intercambiador y tanque' },
          },
        ],
      },
      why: {
        eyebrow: '[ 03 — Por qué acá ]',
        title: 'Taller propio en Córdoba, no un catálogo importado.',
        items: [
          { t: 'Fabricamos nosotros', d: 'Taller propio en Córdoba: diseño, corte, plegado, armado y tablero salen de la misma planta.' },
          { t: 'Repuestos en días', d: 'Consumibles y repuestos disponibles en la región, sin esperar un contenedor.' },
          { t: 'A medida del layout', d: 'La central se dimensiona sobre su pileta, su caudal y el espacio que hay — no al revés.' },
          { t: 'Se integra al resto', d: 'La misma ingeniería que hace el transporte de viruta y el lavado de piezas: un solo interlocutor.' },
          { t: 'Equipos de los 90 andando', d: 'Máquinas Trans-Fil instaladas en los 90 siguen operando. El soporte no se discontinúa.' },
          { t: '36 años · 14 países', d: 'Desde 1989 en el mismo taller, con más de 120 clientes industriales en 14 países.' },
        ],
      },
      proof: {
        eyebrow: '[ 04 — Antecedentes ]',
        title: 'Plantas que ya trabajan con nuestros equipos.',
        sub: 'Siderurgia, tubos, automotriz y máquinas-herramienta en Argentina y la región.',
      },
      form: {
        eyebrow: '[ 05 — Relevamiento ]',
        title: 'Antes de cotizar, vamos a ver la línea.',
        sub: 'Contanos qué línea es y qué fluido usa. Un técnico responde en menos de 24 h hábiles con el próximo paso concreto.',
        lineTypeLabel: 'Tipo de línea',
        lineTypeOpts: ['Tubos', 'Perfilado', 'Mecanizado', 'Rectificado', 'Otra'],
        defaultLinea: 'Filtración',
        waPrompt: '¿Preferís WhatsApp?',
        waCta: 'Escribir por WhatsApp',
        successTitle: 'Consulta recibida.',
        successBody: 'Un técnico se pone en contacto en menos de 24 h hábiles. Si es urgente, escribinos por WhatsApp.',
        successWa: 'Abrir WhatsApp',
      },
      faq: {
        eyebrow: '[ 06 — Preguntas ]',
        title: 'Lo que nos preguntan antes de la visita.',
        items: [
          {
            q: '¿Sirve para líneas ERW, HFW y perfiladoras?',
            a: 'Sí. El sistema se dimensiona sobre el caudal y el tipo de fluido, no sobre la marca de la formadora. Trabajamos sobre líneas ERW y HFW de tubo con costura, perfiladoras de conformado en frío y trefilado.',
          },
          {
            q: '¿Se puede retrofitear la pileta que ya tenemos?',
            a: 'En la mayoría de los casos sí. Es lo más común: se conserva la pileta y se agregan las etapas que faltan —magnético, banda o skimmer— más la central de bombeo. El relevamiento define si conviene retrofit o equipo nuevo.',
          },
          {
            q: '¿Qué se filtra exactamente?',
            a: 'Tres cosas distintas: finos ferrosos (separación magnética), sólidos no ferrosos y partícula gruesa (filtro de banda) y aceite atrapado (skimmer o separador coalescente). Cada uno necesita su etapa; ninguna reemplaza a la otra.',
          },
          {
            q: '¿Qué resultados son razonables?',
            a: 'En instalaciones con tratamiento adecuado, la vida del refrigerante se multiplica de 2 a 4 veces, el recambio de soluble baja entre 50% y 70% y la vida de herramienta sube entre 10% y 30%. Son rangos típicos: los números de su línea salen del relevamiento.',
          },
          {
            q: '¿Cuánto tardan en responder?',
            a: 'Menos de 24 horas hábiles. La respuesta es de un técnico, con el próximo paso concreto: qué datos faltan o cuándo podemos ir a la planta.',
          },
          {
            q: '¿Formulario o WhatsApp?',
            a: 'Los dos llegan al mismo equipo. El formulario sirve si querés adjuntar contexto de la línea; WhatsApp si preferís resolverlo hablando. Respondemos en el mismo plazo por cualquiera de los dos.',
          },
        ],
      },
      closing:
        'Filtración de proceso para líneas que no pueden parar. Diseñada en planta, fabricada en Córdoba, servicio en la región.',
      whatsapp:
        'Hola, los contacto desde la landing de conformado de Trans-Fil. Quiero un relevamiento para filtración de línea de tubos.',
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
          'Centralized filtration + magnetic separation + tramp-oil recovery for ERW / HFW tube mills. A plant survey comes before the quote.',
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
      nav: { system: 'The system', why: 'Why us', faq: 'FAQ', contact: 'Plant survey' },
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
          { v: '2–4×', l: 'coolant life' },
          { v: '−50/70%', l: 'coolant change frequency' },
          { v: '+10/30%', l: 'tool life' },
        ],
        note: 'Typical ranges in installations with proper treatment. We quantify them during the plant survey.',
      },
      problem: {
        eyebrow: '[ 01 — The problem ]',
        title: "It isn't the die. It's the fluid wetting it.",
        symptom:
          'Mill lubricant loads up with metal fines and tramp oil. The degraded fluid lubricates worse and accelerates roll and die wear; marks show up on the tube surface, scrap climbs and the coolant gets dumped more and more often — with the disposal bill behind it.',
        solution:
          'Centralized filtration + magnetic separation + tramp-oil recovery, sized against the line’s actual flow rate and layout. Fluid returns to the mill clean, at stable temperature and pressure.',
        benefit:
          'Protects forming tooling, multiplies fluid life and takes coolant changes off the planned-downtime list.',
      },
      system: {
        eyebrow: '[ 02 — The system ]',
        title: 'Three stages and one central station.',
        intro:
          'Each stage removes a different contaminant. Placed in series on the line’s tank, the fluid going back to the mill carries no ferrous fines, no solids and no tramp oil.',
        blocks: [
          {
            code: 'F01',
            title: 'Ferrous fines → magnetic separation',
            desc: 'Drums and magnetic bars that pull micrometric ferrous particles before the main filter. This is the stage that keeps the cloth from saturating in hours, and the one you notice fastest on tube surface finish.',
            media: { ...MEDIA.magnetic, alt: 'Trans-Fil magnetic drum separator running' },
          },
          {
            code: 'F02',
            title: 'Solids → belt filter',
            desc: 'Gravity filtration with paper or textile cloth, advanced automatically by bath level. Low operating cost and dry rewound residue, ready for disposal with no handling.',
            media: { ...MEDIA.band, alt: 'Trans-Fil gravity belt filter' },
          },
          {
            code: 'F03',
            title: 'Tramp oil → skimmer',
            desc: 'Belt skimmers and coalescing separators that remove tramp oil — the main reason an emulsion drops pH, turns rancid and gets dumped. Taking it out is what multiplies fluid life.',
            media: { ...MEDIA.oil, alt: 'Trans-Fil oil-recovery skimmer' },
          },
          {
            code: 'F04',
            title: 'All of it → central filtration station',
            desc: 'Pumping, pressurization and temperature-control station feeding the whole line. Keeps flow and temperature stable regardless of what each station draws, with pressure and level monitoring and configurable alarms.',
            media: { ...MEDIA.central, alt: 'Trans-Fil central filtration station: pump skid, filter housings, heat exchanger and tank' },
          },
        ],
      },
      why: {
        eyebrow: '[ 03 — Why us ]',
        title: 'Our own workshop in Córdoba, not an imported catalog.',
        items: [
          { t: 'We build it ourselves', d: 'Own workshop in Córdoba: design, cutting, bending, assembly and control cabinet all leave the same plant.' },
          { t: 'Spares in days', d: 'Consumables and spare parts available in the region — no waiting on a container.' },
          { t: 'Sized to your layout', d: 'The station is sized around your tank, your flow rate and the floor space you actually have.' },
          { t: 'Integrates with the rest', d: 'Same engineering team that does chip conveying and parts washing: one point of contact.' },
          { t: '90s units still running', d: 'Trans-Fil machines installed in the nineties are still in service. Support is not discontinued.' },
          { t: '36 years · 14 countries', d: 'Since 1989 in the same workshop, with 120+ industrial customers across 14 countries.' },
        ],
      },
      proof: {
        eyebrow: '[ 04 — Track record ]',
        title: 'Plants already running our equipment.',
        sub: 'Steel, tube, automotive and machine-tool plants across Argentina and the region.',
      },
      form: {
        eyebrow: '[ 05 — Plant survey ]',
        title: 'Before quoting, we look at the line.',
        sub: 'Tell us which line it is and what fluid it runs. A technical advisor replies in under 24 business hours with a concrete next step.',
        lineTypeLabel: 'Line type',
        lineTypeOpts: ['Tube mill', 'Roll forming', 'Machining', 'Grinding', 'Other'],
        defaultLinea: 'Filtration',
        waPrompt: 'Prefer WhatsApp?',
        waCta: 'Message us on WhatsApp',
        successTitle: 'Inquiry received.',
        successBody: 'A technical advisor will get back to you in under 24 business hours. If it is urgent, message us on WhatsApp.',
        successWa: 'Open WhatsApp',
      },
      faq: {
        eyebrow: '[ 06 — FAQ ]',
        title: 'What people ask before the visit.',
        items: [
          {
            q: 'Does it work on ERW, HFW and roll-forming lines?',
            a: 'Yes. The system is sized around flow rate and fluid type, not the mill brand. We work on ERW and HFW welded-tube lines, cold roll-forming lines and drawing lines.',
          },
          {
            q: 'Can you retrofit the tank we already have?',
            a: 'In most cases, yes — and it is the usual route: the tank stays and the missing stages are added (magnetic, belt or skimmer) plus the pumping station. The survey decides whether a retrofit or a new unit makes more sense.',
          },
          {
            q: 'What exactly gets filtered?',
            a: 'Three different things: ferrous fines (magnetic separation), non-ferrous and coarse solids (belt filter) and tramp oil (skimmer or coalescing separator). Each needs its own stage; none replaces the others.',
          },
          {
            q: 'What results are realistic?',
            a: 'In installations with proper treatment, coolant life is multiplied 2 to 4 times, coolant changes drop 50–70% and tool life rises 10–30%. Those are typical ranges — the numbers for your line come out of the survey.',
          },
          {
            q: 'How fast do you reply?',
            a: 'Under 24 business hours. The reply comes from a technical advisor with a concrete next step: what data is missing, or when we can visit the plant.',
          },
          {
            q: 'Form or WhatsApp?',
            a: 'Both reach the same team. Use the form if you want to attach context about the line; use WhatsApp if you would rather sort it out talking. Same response time either way.',
          },
        ],
      },
      closing:
        'Process filtration for lines that cannot stop. Engineered on the plant floor, built in Córdoba, serviced across the region.',
      whatsapp:
        "Hi, I'm contacting you from the Trans-Fil tube-forming landing. I'd like a plant survey for mill coolant filtration.",
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
          'Filtragem centralizada + separação magnética + recuperação de óleo tramp para linhas ERW / HFW. Levantamento em planta antes de orçar.',
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
      nav: { system: 'O sistema', why: 'Por que aqui', faq: 'Perguntas', contact: 'Levantamento' },
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
          { v: '2–4×', l: 'vida do fluido de corte' },
          { v: '−50/70%', l: 'troca de solúvel' },
          { v: '+10/30%', l: 'vida de ferramenta' },
        ],
        note: 'Faixas típicas em instalações com tratamento adequado. São quantificadas no levantamento na sua planta.',
      },
      problem: {
        eyebrow: '[ 01 — O problema ]',
        title: 'Não é a matriz. É o fluido que a molha.',
        symptom:
          'O lubrificante da formadora se carrega de finos metálicos e óleo tramp. O fluido degradado lubrifica pior e acelera o desgaste de roletes e matrizes; aparecem marcas na superfície do tubo, a sucata sobe e o solúvel é trocado cada vez mais cedo — com o custo de destinação junto.',
        solution:
          'Filtragem centralizada + separação magnética + recuperação de óleo, dimensionada sobre a vazão real da linha e o seu layout. O fluido volta à formadora limpo, com temperatura e pressão estáveis.',
        benefit:
          'Protege o ferramental de conformação, multiplica a vida do fluido e tira a troca de solúvel da lista de paradas programadas.',
      },
      system: {
        eyebrow: '[ 02 — O sistema ]',
        title: 'Três etapas e uma central.',
        intro:
          'Cada etapa retira um contaminante diferente. Em série sobre o tanque da linha, o fluido que volta à formadora não carrega finos ferrosos, nem sólidos, nem óleo tramp.',
        blocks: [
          {
            code: 'F01',
            title: 'Finos ferrosos → separação magnética',
            desc: 'Tambores e barras magnéticas que retiram a partícula ferrosa micrométrica antes do filtro principal. É a etapa que evita que a manta sature em horas e a que aparece mais rápido no acabamento do tubo.',
            media: { ...MEDIA.magnetic, alt: 'Separador magnético de tambor Trans-Fil em operação' },
          },
          {
            code: 'F02',
            title: 'Sólidos → filtro de esteira',
            desc: 'Filtragem por gravidade com manta de papel ou têxtil (depurador a tecido), com avanço automático conforme o nível do banho. Baixo custo operacional e resíduo seco rebobinado, pronto para destinação sem manuseio.',
            media: { ...MEDIA.band, alt: 'Filtro de esteira por gravidade Trans-Fil' },
          },
          {
            code: 'F03',
            title: 'Óleo tramp → skimmer',
            desc: 'Skimmers de esteira e separadores coalescentes que retiram o óleo tramp, causa principal de a emulsão baixar o pH, tomar odor e ir para descarte. Removê-lo é o que multiplica a vida do fluido.',
            media: { ...MEDIA.oil, alt: 'Skimmer de recuperação de óleo Trans-Fil' },
          },
          {
            code: 'F04',
            title: 'Tudo junto → central de filtragem',
            desc: 'Estação de bombeamento, pressurização e controle de temperatura que alimenta a linha inteira. Mantém vazão e temperatura estáveis independentemente do consumo de cada posto, com monitoramento de pressão, nível e alarmes configuráveis.',
            media: { ...MEDIA.central, alt: 'Central de filtragem Trans-Fil: skid de bombeamento, filtros, trocador e tanque' },
          },
        ],
      },
      why: {
        eyebrow: '[ 03 — Por que aqui ]',
        title: 'Oficina própria em Córdoba, não um catálogo importado.',
        items: [
          { t: 'Nós fabricamos', d: 'Oficina própria em Córdoba: projeto, corte, dobra, montagem e painel saem da mesma planta.' },
          { t: 'Peças em dias', d: 'Consumíveis e peças de reposição disponíveis na região, sem esperar um contêiner.' },
          { t: 'Sob medida do layout', d: 'A central é dimensionada sobre o seu tanque, a sua vazão e o espaço que existe — não o contrário.' },
          { t: 'Integra com o resto', d: 'A mesma engenharia que faz transporte de cavaco e lavagem de peças: um só interlocutor.' },
          { t: 'Equipamentos dos anos 90 rodando', d: 'Máquinas Trans-Fil instaladas nos anos 90 seguem operando. O suporte não é descontinuado.' },
          { t: '36 anos · 14 países', d: 'Desde 1989 na mesma oficina, com mais de 120 clientes industriais em 14 países.' },
        ],
      },
      proof: {
        eyebrow: '[ 04 — Histórico ]',
        title: 'Plantas que já operam com nossos equipamentos.',
        sub: 'Siderurgia, tubos, automotivo e máquinas-ferramenta na Argentina e na região.',
      },
      form: {
        eyebrow: '[ 05 — Levantamento ]',
        title: 'Antes de orçar, vamos ver a linha.',
        sub: 'Conte qual é a linha e qual fluido ela usa. Um técnico responde em menos de 24 h úteis com o próximo passo concreto.',
        lineTypeLabel: 'Tipo de linha',
        lineTypeOpts: ['Tubos', 'Perfilação', 'Usinagem', 'Retificação', 'Outra'],
        defaultLinea: 'Filtragem',
        waPrompt: 'Prefere WhatsApp?',
        waCta: 'Falar pelo WhatsApp',
        successTitle: 'Consulta recebida.',
        successBody: 'Um técnico entra em contato em menos de 24 h úteis. Se for urgente, fale com a gente pelo WhatsApp.',
        successWa: 'Abrir WhatsApp',
      },
      faq: {
        eyebrow: '[ 06 — Perguntas ]',
        title: 'O que perguntam antes da visita.',
        items: [
          {
            q: 'Serve para linhas ERW, HFW e perfiladeiras?',
            a: 'Sim. O sistema é dimensionado sobre a vazão e o tipo de fluido, não sobre a marca da formadora. Trabalhamos em linhas ERW e HFW de tubo com costura, perfiladeiras de conformação a frio e trefilação.',
          },
          {
            q: 'Dá para fazer retrofit do tanque que já temos?',
            a: 'Na maioria dos casos, sim — e é o caminho mais comum: mantém-se o tanque e acrescentam-se as etapas que faltam (magnético, esteira ou skimmer) mais a central de bombeamento. O levantamento define se compensa retrofit ou equipamento novo.',
          },
          {
            q: 'O que exatamente é filtrado?',
            a: 'Três coisas diferentes: finos ferrosos (separação magnética), sólidos não ferrosos e partícula grossa (filtro de esteira) e óleo tramp (skimmer ou separador coalescente). Cada um precisa da sua etapa; nenhuma substitui a outra.',
          },
          {
            q: 'Que resultados são razoáveis?',
            a: 'Em instalações com tratamento adequado, a vida do fluido de corte se multiplica de 2 a 4 vezes, a troca de solúvel cai entre 50% e 70% e a vida de ferramenta sobe entre 10% e 30%. São faixas típicas: os números da sua linha saem do levantamento.',
          },
          {
            q: 'Em quanto tempo vocês respondem?',
            a: 'Menos de 24 horas úteis. A resposta é de um técnico, com o próximo passo concreto: quais dados faltam ou quando podemos ir à planta.',
          },
          {
            q: 'Formulário ou WhatsApp?',
            a: 'Os dois chegam à mesma equipe. O formulário serve se você quiser anexar contexto da linha; o WhatsApp, se preferir resolver conversando. O prazo de resposta é o mesmo.',
          },
        ],
      },
      closing:
        'Filtragem de processo para linhas que não podem parar. Projetada em planta, fabricada em Córdoba, serviço na região.',
      whatsapp:
        'Olá, contato vocês pela landing de conformação da Trans-Fil. Quero um levantamento para filtragem de linha de tubos.',
    },
  },
};
