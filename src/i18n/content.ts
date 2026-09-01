import type { Lang, PageKey } from './routes';

export type { Lang };

export type TechBullet = {
  name: string;
  img: string;
  desc: string;
  kind: 'photo' | 'video';
  poster?: string;
};

export type TechItem = {
  id: string;
  code: string;
  title: string;
  sub: string;
  img: string;
  desc: string;
  bullets: TechBullet[];
};

export type CatalogItem = {
  id: string;
  title: string;
  desc: string;
  pages: number;
  size: string;
  file: string;
  color: string;
  img: string;
};

export type ServiceItem = { code: string; title: string; desc: string; img: string };
export type Milestone = { y: string; t: string; d: string };
export type Tab = { id: 'steel' | 'auto' | 'tools'; label: string };

export type Content = {
  lang: Lang;
  htmlLang: string;
  ogLocale: string;
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogImageAlt: string;
    twitterDescription: string;
  };
  nav: {
    home: string; tech: string; applications: string; catalogs: string; services: string;
    industries: string; history: string; contact: string;
  };
  hero: {
    eyebrow: string;
    titleA: string; titleB: string; titleC: string;
    sub: string;
    ctaPrimary: string; ctaSecondary: string;
    stat1: { v: string; l: string };
    stat2: { v: string; l: string };
    stat3: { v: string; l: string };
    stat4: { v: string; l: string };
  };
  capabilities: { eyebrow: string; title: string; sub: string };
  tech: TechItem[];
  applications: {
    eyebrow: string;
    title: string;
    intro: string;
    symptoms: {
      title: string;
      items: string[];
      close: string;
    };
    cards: {
      code: string;
      title: string;
      problem: string;
      install: string;
      benefit: string;
      // Only set on cards that have a dedicated landing page (A01 →
      // /conformado). Renders a "Ver solución" link at the foot of the card.
      link?: { page: PageKey; label: string };
    }[];
    custom: { title: string; body: string };
    metrics: { items: { v: string; l: string }[]; note: string };
    cta: { text: string; button: string };
  };
  catalogs: {
    eyebrow: string; title: string; sub: string;
    items: CatalogItem[];
    cta: string;
    // Optional caveat under the section subtitle — used in PT, where the
    // downloadable PDFs are the English editions.
    note?: string;
  };
  process: {
    eyebrow: string; title: string; lead: string;
    steps: { n: string; t: string; d: string }[];
  };
  services: { eyebrow: string; title: string; sub: string; items: ServiceItem[] };
  industries: {
    eyebrow: string; title: string; title2: string; sub: string;
    tabs: Tab[];
    coverage: string[];
    hoverPause: string;
  };
  history: { eyebrow: string; title: string; body: string; milestones: Milestone[] };
  contact: {
    eyebrow: string; title: string; sub: string;
    form: {
      name: string; company: string; email: string; phone: string;
      industry: string; industryOpts: string[];
      linea: string; lineaOpts: string[]; message: string;
      send: string; sending: string; sent: string; sendErr: string;
      required: string; emailErr: string;
    };
    direct: string;
    addr: string;
    addressLabel: string;
  };
  footer: { tag: string; rights: string; built: string };
  chips: { established: string; argentina: string; iso: string };
  workshopActive: string;
  whatsappMessage: string;
  langSwitch: { es: string; en: string; pt: string };
  backToTop: string;
  // Chrome strings that used to be hardcoded ES/EN ternaries inside
  // components. They live here so a new locale never leaves Spanish
  // fragments behind.
  ui: {
    skipToContent: string;
    aboutHeading: string;
    faqHeading: string;
    symptom: string;
    solution: string;
    benefit: string;
    metricsTitle: string;
    download: string;
    close: string;
    coverage: string;
    countriesReached: string;
  };
  // Long-form 'About' paragraph used for AI/LLM search consumption and
  // surfaced as a visually-hidden section in <body> so it's indexed.
  about: string;
  // FAQ entries powering the FAQPage JSON-LD. Question + answer that map
  // to how users phrase queries to AI search.
  faq: { q: string; a: string }[];
};

export const TF_CLIENTS = {
  steel: ['ACINDAR', 'ALUAR', 'SIDERSA', 'TENARIS', 'GARIBALDI', 'ACEROS ZAPLA', 'TUBHIER', 'OTO MILLS', 'VOITH', 'ACEROS BORRONIS'],
  auto: ['RENAULT', 'VOLKSWAGEN', 'IVECO', 'FIAT', 'TOYOTA', 'CHRYSLER', 'CORVEN', 'BREMBO', 'SACHS', 'MWM', 'PERTRAK', 'WEG', 'WEATHERFORD', 'DANA', 'ALLADIO'],
  tools: ['MEPROMAES', 'COMAU', 'EMAG', 'MORI SEIKI', 'OKUMA', 'MAZAK', 'DOOSAN', 'HAAS'],
} as const;

export const CONTENT: Record<Lang, Content> = {
  es: {
    lang: 'es',
    htmlLang: 'es-AR',
    ogLocale: 'es_AR',
    meta: {
      title: 'Trans-Fil | Maquinaria Industrial Especializada · Córdoba, Argentina',
      description: 'Maquinaria industrial especializada en Córdoba desde 1989: transporte de viruta, lavado industrial, filtración de fluidos y maquinaria de corte.',
      ogTitle: 'Trans-Fil — Maquinaria industrial · Córdoba',
      ogDescription: 'Diseñamos, fabricamos y mantenemos maquinaria industrial desde 1989: transporte de viruta, lavado, filtración de fluidos y corte para metalurgia y automotriz.',
      ogImageAlt: 'Estación de transporte de viruta TRANS-FIL en taller industrial',
      twitterDescription: '36 años diseñando maquinaria industrial en Córdoba, Argentina. Procesos que no se detienen.',
    },
    nav: { home: 'Inicio', tech: 'Tecnologías', applications: 'Aplicaciones', catalogs: 'Catálogos', services: 'Servicios', industries: 'Industrias', history: 'Historia', contact: 'Contacto' },
    hero: {
      eyebrow: 'Maquinaria industrial · Córdoba, Argentina · Desde 1989',
      titleA: 'Procesos', titleB: 'que no', titleC: 'se detienen.',
      sub: 'Diseño, fabricación y mantenimiento de maquinaria industrial especializada para la industria metalúrgica.',
      ctaPrimary: 'Ver tecnologías', ctaSecondary: 'Contáctenos',
      stat1: { v: '36', l: 'Años de operación' },
      stat2: { v: '120+', l: 'Clientes industriales' },
      stat3: { v: '14', l: 'Países alcanzados' },
      stat4: { v: '24/7', l: 'Soporte de planta' },
    },
    capabilities: {
      eyebrow: '[ 02 — Capacidades ]',
      title: 'Cuatro líneas. Una sola ingeniería.',
      sub: 'Cada equipo se diseña sobre el proceso productivo real y se integra al flujo existente sin interrumpirlo.',
    },
    tech: [
      {
        id: 'conveyors', code: 'T01', title: 'Transporte', sub: 'Conveyors',
        img: '/img/t01-conveyors.webp',
        desc: 'Sistemas de evacuación de viruta metálica, piezas y residuos para líneas de producción, celdas de mecanizado, líneas transfer y centros CNC. Configurables en bisagra, raspador, magnéticos, cintas, cadenas plásticas o combinados.',
        bullets: [
          { name: 'Transporte de viruta', img: '/img/t01-chip-transport.webp', desc: 'Sistemas de transporte para todo tipo de viruta y procesos de mecanizado, desde celdas individuales hasta líneas de gran escala. Configurables en bisagra, raspador, cinta o cadena plástica según material y caudal. Construcción robusta para operación continua 24/7.', kind: 'photo' },
          { name: 'Líneas de secado continuo', img: '/img/t01-drying.webp', desc: 'Cintas con eslabones microperforados que separan sólidos y líquidos durante el transporte, garantizando la reducción de humedad que requieren procesos como tratamiento de residuos o secado de piezas pequeñas en serie.', kind: 'photo' },
          { name: 'Líneas centralizadas', img: '/img/t01-conveyors.webp', desc: 'Sistemas multi-máquina que evacúan la viruta de toda una nave hacia un único punto de descarga. Conectan decenas de máquinas-herramienta a un mismo circuito y eliminan el traslado manual entre estaciones, liberando al personal de tareas repetitivas y reduciendo el tiempo de paro por limpieza.', kind: 'photo' },
          { name: 'Diseño a medida', img: '/img/t01-custom.webp', desc: 'Geometría, ancho, altura, velocidades y demás características adaptadas a cada proceso y layout. Cada equipo se dimensiona a partir del relevamiento en planta y se valida con plano 3D antes de la fabricación. Materiales y componentes seleccionados según el tipo de viruta y el refrigerante.', kind: 'photo' },
        ],
      },
      {
        id: 'washing', code: 'T02', title: 'Lavado industrial', sub: 'Washing machinery',
        img: '/img/t02-washing.webp',
        desc: 'Lavadoras automáticas para piezas mecanizadas, fundición y forja. Desde celdas individuales hasta líneas continuas con secado y soplado.',
        bullets: [
          { name: 'Pasante y rotativas', img: '/img/t02-washing.webp', desc: 'Cabinas de paso continuo con cinta o mesa rotativa para producción en serie. Ciclo configurable de lavado, enjuague y secado. Se integran a la línea existente sincronizando carga, descarga y temperatura del baño con el ritmo de planta.', kind: 'photo' },
          { name: 'Lavadora de cabina individual', img: '/img/t02-cabin.webp', desc: 'Cabinas de carga y descarga manual para uso múltiple, aptas para piezas de geometría variada y lotes chicos donde no se justifica una línea continua. Programas seleccionables desde el HMI según el grado de limpieza requerido.', kind: 'photo' },
          { name: 'Filtración integrada', img: '/img/t02-filtration.webp', desc: 'Filtros de banda, ciclones y skimmers de aceite que mantienen el baño limpio y prolongan la vida del fluido. Reducen la frecuencia de cambio de detergente y el consumo de agua. Mantenimiento simple con acceso frontal a los consumibles.', kind: 'photo' },
          { name: 'Control PLC', img: '/img/t02-plc.webp', desc: 'Tableros con HMI táctil. Software integrado a la línea de producción y sistema de seguridad preparado para Industria 4.0. Trazabilidad de ciclos, alarmas y consumos en tiempo real, con soporte remoto a través de la red del cliente.', kind: 'photo' },
        ],
      },
      {
        id: 'filtration', code: 'T03', title: 'Tratamiento de fluidos', sub: 'Fluids treatment',
        img: '/img/t03-fluids-cover.webp',
        desc: 'Filtración de refrigerantes, separación magnética y centralización de fluidos. Recuperación de aceites y manejo responsable de residuos.',
        bullets: [
          { name: 'Filtros de banda', img: '/img/t02-band-filters.webp', desc: 'Filtración por gravedad con tela de papel o textil. Bajo costo operativo, ideal para refrigerantes solubles en mecanizado. Avance automático de la tela según el nivel del baño y rebobinado del residuo seco para disposición simple.', kind: 'photo' },
          { name: 'Separadores magnéticos', img: '/video/t02-magnetic-separator.mp4', poster: '/img/t02-magnetic-separator-poster.webp', desc: 'Tambores y barras imantadas que retiran partículas ferrosas finas antes del filtro principal, capturando la viruta micrométrica que de otro modo saturaría la tela. Extienden la vida del consumible y reducen la carga sólida que llega al sistema central.', kind: 'video' },
          { name: 'Filtración avanzada', img: '/img/t03-advanced-filtration.webp', desc: 'Estaciones centralizadas de bombeo, presurización y temperado del refrigerante para múltiples máquinas en paralelo. Mantienen caudal y temperatura estables independientemente del consumo individual de cada estación. Monitoreo de presión, conductividad y nivel con alarmas configurables.', kind: 'photo' },
          { name: 'Recuperación de aceite', img: '/img/t02-oil-recovery.webp', desc: 'Skimmers de banda y separadores coalescentes que retiran el aceite atrapado del refrigerante para reutilizar el fluido. Extienden varias veces la vida útil del refrigerante y bajan el costo de tratamiento de residuos. El aceite recuperado se separa para disposición o reúso.', kind: 'photo' },
        ],
      },
      {
        id: 'metalwork', code: 'T04', title: 'Metalúrgica general', sub: 'General metalwork',
        img: '/img/t04-metalwork-cover.webp',
        desc: 'Servicios metalúrgicos integrales: corte láser y plasma de alta precisión, plegado CNC y producción de piezas en serie con alta capacidad de respuesta.',
        bullets: [
          { name: 'Corte láser', img: '/video/t04-laser-cutting.mp4', poster: '/img/t04-laser-cutting-poster.webp', desc: 'Servicio de corte láser de alta precisión para chapa de hasta 12,7 mm (1/2 pulgada). Acero al carbono, inoxidable y aluminio. Tolerancias ajustadas y bordes limpios, listos para soldadura o plegado posterior.', kind: 'video' },
          { name: 'Corte plasma', img: '/video/t04-plasma-cutting.mp4', poster: '/img/t04-plasma-cutting-poster.webp', desc: 'Servicio de corte plasma para chapa de hasta 25,4 mm (1 pulgada). Especialmente eficiente en los espesores en los que el láser deja de ser rentable. Buena calidad de borde con alto rendimiento productivo.', kind: 'video' },
          { name: 'Plegado industrial', img: '/video/t04-industrial-bending.mp4', poster: '/img/t04-industrial-bending-poster.webp', desc: 'Plegadora CNC para plegados de hasta 3 m. Programación a partir de plano 3D y biblioteca de matrices para distintos espesores y radios. Repetibilidad alta para producción en serie.', kind: 'video' },
          { name: 'Producción en serie', img: '/img/t04-serial-production.webp', desc: 'Capacidad industrial, décadas de experiencia y una extensa red de proveedores nos permiten producir piezas metalúrgicas en lotes con alta capacidad de respuesta. Desde prototipos validados con el cliente hasta producciones recurrentes. Asumimos también ensamblado, soldadura y tratamientos superficiales cuando corresponde.', kind: 'photo' },
        ],
      },
    ],
    applications: {
      eyebrow: '[ 03 — Aplicaciones ]',
      title: 'El costo que no se ve.',
      intro: 'Muchas plantas descartan el refrigerante cuando se ensucia — después de que ya desgastó las herramientas, dañó la bomba y frenó la línea. La filtración, el transporte de viruta y el lavado no son accesorios: protegen los activos que ya pagó.',
      symptoms: {
        title: '¿Reconoce estos síntomas en su planta?',
        items: [
          'Cambia el soluble cada pocas semanas y paga para que se lo retiren.',
          'Las herramientas duran menos de lo que deberían.',
          'Detiene la máquina para sacar viruta a mano.',
          'El refrigerante despide olor o irrita al personal.',
          'La calidad superficial se cae sin una causa clara.',
          'La bomba o el husillo fallan antes de tiempo.',
        ],
        close: 'Si reconoce dos o más, no es mala suerte: es un costo oculto con solución de ingeniería.',
      },
      cards: [
        {
          code: 'A01',
          title: 'Conformado de tubos',
          problem: 'El lubricante se carga de finos metálicos y aceite atrapado. El fluido degradado lubrica peor y acelera el desgaste de rodillos y matrices; aparecen marcas en la superficie del tubo y aumenta el scrap.',
          install: 'Filtración centralizada + separación magnética + recuperación de aceite.',
          benefit: 'Protege el herramental de conformado · multiplica la vida del fluido.',
          link: { page: 'conformado', label: 'Ver solución' },
        },
        {
          code: 'A02',
          title: 'Mecanizado y torneado',
          problem: 'La viruta se acumula y los finos recirculan en el refrigerante; el aceite de guías lo contamina. El resultado: desgaste de herramienta, daño en bombas y husillos, y paros para limpiar a mano.',
          install: 'Transporte de viruta centralizado + filtro de banda + separador magnético.',
          benefit: 'Más vida de herramienta · menos paros · refrigerante limpio.',
        },
        {
          code: 'A03',
          title: 'Rectificado de precisión',
          problem: 'La viruta abrasiva fina es casi invisible, pero arruina el acabado y desgasta la muela si no se retira del fluido. La tolerancia se vuelve inestable lote a lote.',
          install: 'Filtración fina (banda o papel) + separación magnética de alta eficiencia.',
          benefit: 'Acabado estable · más vida de muela · refrigerante claro.',
        },
        {
          code: 'A04',
          title: 'Lavado y preparación de piezas',
          problem: 'Las piezas llegan con aceite y viruta al ensamble, la soldadura o el pintado. El lavado manual es inconsistente y se vuelve un cuello de botella en la línea.',
          install: 'Lavadora industrial (pasante, rotativa o cabina) con filtración integrada y control PLC.',
          benefit: 'Limpieza repetible · más throughput · baño de mayor vida.',
        },
      ],
      custom: {
        title: 'Cada equipo se dimensiona sobre su proceso.',
        body: 'Cada transportador de viruta, filtro y lavadora se dimensionan sobre el proceso real: tipo de viruta, refrigerante, caudal, layout y ritmo de línea. Validamos con diseño 3D antes de fabricar. Un transportador mal dimensionado se tapa; una lavadora genérica no alcanza el grado de limpieza que su próximo paso necesita. El diseño a medida es lo que hace que el equipo trabaje 24/7 durante décadas.',
      },
      metrics: {
        items: [
          { v: '2–4×', l: 'vida del refrigerante con remoción de aceite y finos' },
          { v: '−50/70%', l: 'frecuencia de recambio de soluble' },
          { v: '+10/30%', l: 'vida útil de herramienta' },
          { v: '↓', l: 'costo de disposición de residuos líquidos' },
          { v: '↓', l: 'paros por limpieza manual de viruta' },
        ],
        note: 'Rangos típicos en instalaciones con tratamiento adecuado. Los resultados dependen del proceso — los cuantificamos en el relevamiento en su planta.',
      },
      cta: {
        text: '¿No sabe por dónde empezar? Un relevamiento identifica dónde está el costo oculto y cuánto puede recuperar.',
        button: 'Solicitar relevamiento',
      },
    },
    catalogs: {
      eyebrow: '[ 04 — Descargas ]',
      title: 'Descargue nuestros catálogos.',
      sub: 'Especificaciones, esquemas de funcionamiento y modelos disponibles para cada línea. PDF imprimible.',
      items: [
        { id: 'general', title: 'Catálogo General', desc: 'Las tres líneas + servicios adicionales (corte láser/plasma, hornos, racks).', pages: 12, size: '7 MB', file: '/catalogs/Trans-Fil-Catalogo-General-ES.pdf', color: '#3a86ff', img: '/img/catalog-general.webp' },
        { id: 'filtration', title: 'Filtración', desc: 'Sistemas centralizados de tratamiento y filtración de líquidos refrigerantes.', pages: 8, size: '3 MB', file: '/catalogs/Trans-Fil-Catalogo-Filtracion-ES.pdf', color: '#ff6b1a', img: '/img/catalog-filtration.webp' },
        { id: 'washing', title: 'Lavado', desc: 'Líneas automatizadas de lavado y secado de piezas. Túnel, torre, cabina y especiales.', pages: 6, size: '3 MB', file: '/catalogs/Trans-Fil-Catalogo-Lavado-ES.pdf', color: '#4ade80', img: '/img/catalog-washing.webp' },
      ],
      cta: 'Ver catálogo',
    },
    process: {
      eyebrow: 'PROCESO',
      title: 'Diseñamos, fabricamos y acompañamos cada equipo.',
      lead: 'De la primera visita a tu planta al soporte continuo después de la puesta en marcha. Un solo equipo, un solo responsable.',
      steps: [
        { n: '01', t: 'Estudio de proceso', d: 'Relevamos su proceso productivo y su necesidad específica para diseñar una solución a medida.' },
        { n: '02', t: 'Ingeniería', d: 'Diseño customizado estructural, mecánico, eléctrico, hidráulico y de seguridad.' },
        { n: '03', t: 'Fabricación', d: 'Construcción completa en nuestro taller de Córdoba. Materiales trazables y pruebas en seco antes del despacho.' },
        { n: '04', t: 'Puesta en marcha', d: 'Instalación en sitio, ajuste de parámetros y capacitación del personal de operación y mantenimiento.' },
        { n: '05', t: 'Soporte', d: 'Repuestos, asistencia técnica y mejoras continuas. Las máquinas Trans-Fil de los \'90 todavía operan.' },
      ],
    },
    services: {
      eyebrow: '[ 05 — Servicios ]',
      title: 'Más allá de la entrega.',
      sub: 'Una máquina industrial dura décadas si recibe la atención adecuada. Acompañamos cada equipo durante toda su vida útil.',
      items: [
        { code: 'S01', title: 'Reparaciones', desc: 'Diagnóstico, repuestos y reacondicionamiento de equipos propios y de terceros.', img: '/img/s01-repairs.webp' },
        { code: 'S02', title: 'Retrofitting', desc: 'Modernización de máquinas existentes: PLC, automatización, eficiencia energética.', img: '/img/s02-retrofitting.webp' },
        { code: 'S03', title: 'Mantenimiento', desc: 'Planes preventivos y predictivos. Visitas programadas y soporte remoto continuo.', img: '/img/s03-maintenance.webp' },
        { code: 'S04', title: 'Ingeniería a medida', desc: 'Estudio de proceso, layout, simulación y diseño mecánico desde cero.', img: '/img/s04-engineering.webp' },
      ],
    },
    industries: {
      eyebrow: '[ 06 — Industrias ]',
      title: 'Donde se trabaja el metal,', title2: 'ahí estamos.',
      sub: 'Tres décadas integrando equipos en plantas siderúrgicas, automotrices, de oil & gas y de máquinas-herramienta en Argentina y la región.',
      tabs: [
        { id: 'steel', label: 'Siderurgia' },
        { id: 'auto', label: 'Automotriz, Oil & Línea Blanca' },
        { id: 'tools', label: 'Máquinas-Herramienta' },
      ],
      coverage: [
        'Argentina', 'Brasil', 'Chile', 'Perú',
        'Bolivia', 'Paraguay', 'Uruguay', 'Colombia',
        'Ecuador', 'México', 'Estados Unidos', 'R. Dominicana',
        'Puerto Rico', 'España',
      ],
      hoverPause: '← HOVER PARA PAUSAR →',
    },
    history: {
      eyebrow: '[ 07 — Historia ]',
      title: 'Desde 1989, en el mismo taller.',
      body: 'Trans-Fil nació en Córdoba como un taller especializado en filtración de refrigerantes para la industria metalúrgica. Tres generaciones después, continuamos diseñando cada máquina con la misma dedicación inicial.',
      milestones: [
        { y: '1989', t: 'Fundación', d: 'Inicio del taller en Córdoba con foco en filtración industrial.' },
        { y: '1998', t: 'Primera línea automotriz', d: 'Integración con planta Renault Argentina.' },
        { y: '2007', t: 'Línea Tenaris', d: 'Diseño de transportadores para línea de tubos sin costura.' },
        { y: '2015', t: 'Expansión regional', d: 'Proyectos en Brasil, Chile, Perú y México.' },
        { y: '2024', t: 'Nueva planta', d: 'Ampliación de capacidad de fabricación en Francisco de Arteaga 2895.' },
      ],
    },
    contact: {
      eyebrow: '[ 08 — Contacto ]',
      title: 'Cuéntenos sobre su proceso.',
      sub: 'Un asesor técnico responderá en menos de 24h hábiles. Si lo prefiere, escríbanos directamente.',
      form: {
        name: 'Nombre', company: 'Empresa', email: 'Email', phone: 'Teléfono',
        industry: 'Industria',
        industryOpts: ['Siderurgia', 'Automotriz', 'Oil & Gas', 'Máquinas-Herramienta', 'Línea Blanca', 'Otro'],
        linea: 'Línea de interés',
        lineaOpts: ['Filtración', 'Transporte de viruta', 'Lavado industrial', 'Corte y plegado', 'Otra'],
        message: '¿Qué proceso desea mejorar?',
        send: 'Enviar consulta',
        sending: 'Enviando…',
        sent: 'Consulta recibida. Nos pondremos en contacto.',
        sendErr: 'No se pudo enviar. Reintentá o escribinos a ventas@transfil.com.ar.',
        required: 'Campo requerido', emailErr: 'Email inválido',
      },
      direct: 'Contacto directo',
      addr: 'Francisco de Arteaga 2895, Córdoba, Argentina',
      addressLabel: 'Dirección',
    },
    footer: { tag: 'Maquinaria industrial especializada', rights: 'Todos los derechos reservados.', built: 'Trans-Fil S.R.L.' },
    chips: { established: 'EST. 1989', argentina: 'CÓRDOBA · ARGENTINA', iso: 'ISO 9001' },
    workshopActive: 'Taller · Activo',
    whatsappMessage: 'Hola, los contacto desde el sitio web de Trans-Fil.',
    langSwitch: { es: 'ES', en: 'EN', pt: 'PT' },
    backToTop: 'Volver arriba',
    ui: {
      skipToContent: 'Saltar al contenido',
      aboutHeading: 'Sobre Trans-Fil',
      faqHeading: 'Preguntas frecuentes',
      symptom: 'SÍNTOMA',
      solution: 'SOLUCIÓN',
      benefit: 'BENEFICIO',
      metricsTitle: 'Resultados típicos de la inversión',
      download: 'Descargar',
      close: 'Cerrar',
      coverage: 'COBERTURA',
      countriesReached: 'Países alcanzados',
    },
    about: 'Trans-Fil S.R.L. es un fabricante argentino de maquinaria industrial especializada, fundado en 1989 en Córdoba. Diseña, fabrica y mantiene transportadores de viruta, sistemas de lavado industrial, equipos de filtración y tratamiento de fluidos refrigerantes, y maquinaria de corte láser y plasma. Su planta está en Francisco de Arteaga 2895, Córdoba, Argentina. Atiende a más de 120 clientes industriales en 14 países —Argentina, Brasil, Chile, Perú, Bolivia, Paraguay, Uruguay, Colombia, Ecuador, México, Estados Unidos, República Dominicana, Puerto Rico y España— principalmente de los rubros siderúrgico, automotriz, oil & gas y máquinas-herramienta. Provee servicios complementarios de reparación, retrofitting, mantenimiento programado e ingeniería a medida.',
    faq: [
      {
        q: '¿Qué es Trans-Fil?',
        a: 'Trans-Fil S.R.L. es un fabricante argentino de maquinaria industrial fundado en 1989 en Córdoba. Diseña, fabrica y mantiene transportadores de viruta, sistemas de lavado industrial, filtración de fluidos y maquinaria de corte para los sectores siderúrgico, automotriz y de máquinas-herramienta.',
      },
      {
        q: '¿Dónde está ubicada Trans-Fil?',
        a: 'La planta de Trans-Fil está en Francisco de Arteaga 2895, Córdoba, Argentina (31°24′17″S · 64°11′31″W).',
      },
      {
        q: '¿Desde cuándo opera Trans-Fil?',
        a: 'Trans-Fil opera desde 1989, con más de 36 años diseñando y fabricando maquinaria industrial en el mismo taller de Córdoba.',
      },
      {
        q: '¿Qué productos fabrica Trans-Fil?',
        a: 'Trans-Fil fabrica cuatro líneas: (1) Transporte de viruta —en bisagra, raspador, magnético, banda o cadena plástica; (2) Lavado industrial —cabinas pasante, rotativas y de carga manual con filtración integrada y control PLC; (3) Tratamiento de fluidos —filtros de banda, separadores magnéticos, filtración avanzada con centrales presurizadas y recuperación de aceite; (4) Metalúrgica general —corte láser hasta 12,7 mm, corte plasma hasta 25,4 mm, plegado CNC hasta 3 m y producción de piezas en serie.',
      },
      {
        q: '¿A qué países exporta Trans-Fil?',
        a: 'Trans-Fil exporta a 14 países: Argentina, Brasil, Chile, Perú, Bolivia, Paraguay, Uruguay, Colombia, Ecuador, México, Estados Unidos, República Dominicana, Puerto Rico y España.',
      },
      {
        q: '¿Qué industrias atiende Trans-Fil?',
        a: 'Trans-Fil atiende principalmente a la industria siderúrgica (Acindar, Aluar, Tenaris, Sidersa), automotriz, oil & gas y línea blanca (Renault, Volkswagen, Iveco, Fiat, Toyota, Brembo, Weatherford) y al sector de máquinas-herramienta (Mepromaes, Comau, Emag, Mori Seiki, Mazak, Doosan).',
      },
      {
        q: '¿Trans-Fil ofrece servicios de corte láser y corte plasma?',
        a: 'Sí. Trans-Fil presta servicios de corte láser de alta precisión para chapa hasta 12,7 mm (1/2 pulgada) y de corte plasma hasta 25,4 mm (1 pulgada), en acero al carbono, acero inoxidable y aluminio.',
      },
      {
        q: '¿Trans-Fil hace mantenimiento y retrofitting de máquinas existentes?',
        a: 'Sí. Trans-Fil ofrece reparación y reacondicionamiento de equipos propios y de terceros, retrofitting (modernización de PLC, automatización y eficiencia energética de máquinas existentes), mantenimiento preventivo y predictivo con visitas programadas, e ingeniería a medida desde el relevamiento en planta.',
      },
      {
        q: '¿Por qué se degrada el refrigerante de mecanizado?',
        a: 'El refrigerante se degrada por la acumulación de finos metálicos, el aceite atrapado que proviene de guías y husillos, y el crecimiento bacteriano. El aceite atrapado es la causa principal: favorece las bacterias, baja el pH y genera olor. Removerlo y filtrar los finos multiplica la vida del fluido.',
      },
      {
        q: '¿Cómo se extiende la vida del soluble?',
        a: 'Con remoción de aceite atrapado (skimmers o separadores coalescentes) y filtración de partículas (filtros de banda y separadores magnéticos). En instalaciones con tratamiento adecuado, la vida del refrigerante suele multiplicarse de 2 a 4 veces, reduciendo el recambio y el costo de disposición de residuos.',
      },
      {
        q: '¿Cuándo conviene invertir en filtración de refrigerante?',
        a: 'Cuando se cambia el soluble con frecuencia, las herramientas duran menos de lo esperado, hay daño en bombas o husillos, o se detiene la máquina para retirar viruta a mano. Un relevamiento en planta cuantifica el costo oculto y el retorno de la inversión.',
      },
      {
        q: '¿Cómo contactar a Trans-Fil?',
        a: 'Por email a ventas@transfil.com.ar, por teléfono o WhatsApp al +54 9 3513 82-0321, o en la planta de Francisco de Arteaga 2895, Córdoba, Argentina. La empresa responde consultas técnicas en menos de 24 horas hábiles.',
      },
    ],
  },
  en: {
    lang: 'en',
    htmlLang: 'en-US',
    ogLocale: 'en_US',
    meta: {
      title: 'Trans-Fil | Specialized Industrial Machinery · Córdoba, Argentina',
      description: 'Specialized industrial machinery in Córdoba since 1989: chip conveyors, industrial washing, fluid filtration and cutting machinery.',
      ogTitle: 'Trans-Fil — Specialized industrial machinery',
      ogDescription: 'We design, build and maintain industrial machinery since 1989: chip conveyors, washing, fluid filtration and cutting for metallurgy and automotive.',
      ogImageAlt: 'TRANS-FIL chip conveyor station in industrial workshop',
      twitterDescription: '36 years designing industrial machinery in Córdoba, Argentina. Processes that don\'t stop.',
    },
    nav: { home: 'Home', tech: 'Technologies', applications: 'Applications', catalogs: 'Catalogs', services: 'Services', industries: 'Industries', history: 'History', contact: 'Contact' },
    hero: {
      eyebrow: 'Industrial machinery · Córdoba, Argentina · Since 1989',
      titleA: 'Processes', titleB: 'that don\'t', titleC: 'stop.',
      sub: 'Design, manufacturing and maintenance of specialized industrial machinery for the metalworking industry.',
      ctaPrimary: 'Explore technologies', ctaSecondary: 'Get in touch',
      stat1: { v: '36', l: 'Years of operation' },
      stat2: { v: '120+', l: 'Industrial clients' },
      stat3: { v: '14', l: 'Countries reached' },
      stat4: { v: '24/7', l: 'Plant support' },
    },
    capabilities: {
      eyebrow: '[ 02 — Capabilities ]',
      title: 'Four product lines. One engineering team.',
      sub: 'Each unit is engineered around the actual production process and slots into the existing line without disrupting it.',
    },
    tech: [
      {
        id: 'conveyors', code: 'T01', title: 'Conveyors', sub: 'Transporte',
        img: '/img/t01-conveyors.webp',
        desc: 'Evacuation systems for metal chips, parts and waste from production lines, machining cells, transfer lines and CNC centers. Configurable as hinge, scraper, magnetic, belt, plastic chain or combined.',
        bullets: [
          { name: 'Chip transport', img: '/img/t01-chip-transport.webp', desc: 'Transport systems for every chip type and machining setup, from single cells to plant-wide lines. Configurable as hinge, scraper, belt or plastic chain depending on material and flow rate. Heavy-duty build for 24/7 continuous operation.', kind: 'photo' },
          { name: 'Continuous drying lines', img: '/img/t01-drying.webp', desc: 'Conveyor belts with micro-perforated links that separate solids and liquids while parts travel, hitting the moisture-reduction targets that waste-handling and small-batch parts-drying processes require.', kind: 'photo' },
          { name: 'Centralized lines', img: '/img/t01-conveyors.webp', desc: 'Multi-machine systems that evacuate chips from an entire shop floor to a single discharge point. Dozens of machine tools share one transport circuit, eliminating manual handling between stations — frees the crew from repetitive trips and cuts cleanup downtime.', kind: 'photo' },
          { name: 'Custom design', img: '/img/t01-custom.webp', desc: 'Geometry, width, height, speeds and other parameters tailored to each process and layout. Every unit is sized from the on-site assessment and validated with a 3D drawing before manufacturing. Materials and components are chosen for the specific chip type and coolant.', kind: 'photo' },
        ],
      },
      {
        id: 'washing', code: 'T02', title: 'Industrial washing', sub: 'Lavado',
        img: '/img/t02-washing.webp',
        desc: 'Automatic washers for machined parts, castings and forgings. From single cells to continuous lines with drying and air-knife blow-off.',
        bullets: [
          { name: 'Pass-through & rotary', img: '/img/t02-washing.webp', desc: 'Continuous pass-through cabins with belt or rotary table for serial production. Configurable cycle of wash, rinse and dry. Integrates into the existing line, syncing load, unload and bath temperature with plant takt.', kind: 'photo' },
          { name: 'Single-cabin washer', img: '/img/t02-cabin.webp', desc: 'Multi-purpose manual load-and-unload cabins for parts with varied geometry and short runs where a continuous line isn\'t justified. Programs selectable from the HMI based on the cleanliness level required.', kind: 'photo' },
          { name: 'Built-in filtration', img: '/img/t02-filtration.webp', desc: 'Belt filters, cyclones and oil skimmers that keep the bath clean and extend fluid life. Cuts detergent-change frequency and water consumption. Simple maintenance with front access to consumables.', kind: 'photo' },
          { name: 'PLC control', img: '/img/t02-plc.webp', desc: 'Cabinets with touch HMI. Software integrated into the production line and safety system ready for Industry 4.0. Real-time tracking of cycles, alarms and consumption, with remote support over the customer\'s network.', kind: 'photo' },
        ],
      },
      {
        id: 'filtration', code: 'T03', title: 'Fluids treatment', sub: 'Filtración',
        img: '/img/t03-fluids-cover.webp',
        desc: 'Coolant filtration, magnetic separation and fluid centralization. Oil recovery and responsible waste handling.',
        bullets: [
          { name: 'Belt filters', img: '/img/t02-band-filters.webp', desc: 'Gravity filtration with paper or textile cloth. Low operating cost, ideal for water-soluble machining coolants. Automatic cloth advance driven by bath level and rewind of dry residue for simple disposal.', kind: 'photo' },
          { name: 'Magnetic separators', img: '/video/t02-magnetic-separator.mp4', poster: '/img/t02-magnetic-separator-poster.webp', desc: 'Drums and magnetic bars that remove fine ferrous particles before the main filter, catching the micrometric chips that would otherwise saturate the cloth. Extends consumable life and reduces the solids load reaching the central system.', kind: 'video' },
          { name: 'Advanced filtration', img: '/img/t03-advanced-filtration.webp', desc: 'Centralized pumping, pressurization and temperature-control stations that feed coolant to multiple machines in parallel. Keep flow and temperature stable regardless of how much each station draws. Pressure, conductivity and level monitoring with configurable alarms.', kind: 'photo' },
          { name: 'Oil recovery', img: '/img/t02-oil-recovery.webp', desc: 'Belt skimmers and coalescing separators that remove tramp oil from the coolant so the fluid can be reused. Extends coolant life several times over and lowers waste-treatment costs. Recovered oil is separated for disposal or reuse.', kind: 'photo' },
        ],
      },
      {
        id: 'metalwork', code: 'T04', title: 'General metalwork', sub: 'Metalúrgica general',
        img: '/img/t04-metalwork-cover.webp',
        desc: 'End-to-end metalworking services: high-precision laser and plasma cutting, CNC bending and serial parts production with fast turnaround.',
        bullets: [
          { name: 'Laser cutting', img: '/video/t04-laser-cutting.mp4', poster: '/img/t04-laser-cutting-poster.webp', desc: 'High-precision laser cutting service for sheet up to 12.7 mm (1/2 inch). Carbon steel, stainless steel and aluminum. Tight tolerances and clean edges, ready for downstream welding or bending.', kind: 'video' },
          { name: 'Plasma cutting', img: '/video/t04-plasma-cutting.mp4', poster: '/img/t04-plasma-cutting-poster.webp', desc: 'Plasma cutting service for sheet up to 25.4 mm (1 inch). Especially cost-effective at the thicknesses where laser is no longer the right tool. Good edge quality with high throughput.', kind: 'video' },
          { name: 'Industrial bending', img: '/video/t04-industrial-bending.mp4', poster: '/img/t04-industrial-bending-poster.webp', desc: 'CNC press brake for bends up to 3 m. Programmed from 3D drawings, with a die library covering varied thicknesses and radii. High repeatability for serial production.', kind: 'video' },
          { name: 'Serial production', img: '/img/t04-serial-production.webp', desc: 'Industrial capacity, decades of experience and an extensive supplier network let us produce metalworking parts in batches with fast turnaround. From customer-validated prototypes to recurring production runs. We also handle assembly, welding and surface treatments when required.', kind: 'photo' },
        ],
      },
    ],
    applications: {
      eyebrow: '[ 03 — Applications ]',
      title: 'The cost you don\'t see.',
      intro: 'Many plants discard coolant once it gets dirty — after it has already worn the tooling, damaged the pump and stopped the line. Filtration, chip transport and washing aren\'t accessories: they protect the assets you\'ve already paid for.',
      symptoms: {
        title: 'Do you recognize these symptoms on your plant floor?',
        items: [
          'You change the coolant every few weeks and pay to have it hauled away.',
          'Tooling lasts less than it should.',
          'You stop the machine to clear chips by hand.',
          'The coolant smells or irritates the operators.',
          'Surface finish drifts without a clear cause.',
          'Pumps or spindles fail earlier than expected.',
        ],
        close: 'If two or more of these ring true, it isn\'t bad luck — it\'s a hidden cost with an engineering fix.',
      },
      cards: [
        {
          code: 'A01',
          title: 'Tube forming',
          problem: 'The lubricant loads up with metal fines and tramp oil. The degraded fluid lubricates worse and accelerates roll and die wear; marks appear on the tube surface and scrap climbs.',
          install: 'Centralized filtration + magnetic separation + oil recovery.',
          benefit: 'Protects forming tooling · multiplies fluid life.',
          link: { page: 'conformado', label: 'See the solution' },
        },
        {
          code: 'A02',
          title: 'Machining and turning',
          problem: 'Chips build up and the fines recirculate in the coolant; way-lube contaminates it further. The result: tool wear, damage to pumps and spindles, and stoppages to clean by hand.',
          install: 'Centralized chip transport + belt filter + magnetic separator.',
          benefit: 'Longer tool life · fewer stoppages · clean coolant.',
        },
        {
          code: 'A03',
          title: 'Precision grinding',
          problem: 'Fine abrasive swarf is nearly invisible, but it ruins the finish and wears the wheel if it isn\'t taken out of the fluid. Tolerance drifts batch to batch.',
          install: 'Fine filtration (belt or paper) + high-efficiency magnetic separation.',
          benefit: 'Stable finish · longer wheel life · clear coolant.',
        },
        {
          code: 'A04',
          title: 'Parts washing and prep',
          problem: 'Parts reach assembly, welding or paint with oil and chips still on them. Manual washing is inconsistent and becomes a bottleneck on the line.',
          install: 'Industrial washer (pass-through, rotary or cabinet) with integrated filtration and PLC control.',
          benefit: 'Repeatable cleanliness · higher throughput · longer bath life.',
        },
      ],
      custom: {
        title: 'Every machine is sized for your process.',
        body: 'Every chip conveyor, filter and washer is sized against the real process: chip type, coolant, flow rate, layout and line cadence. We validate with a 3D design before we cut metal. An undersized conveyor jams; a generic washer doesn\'t hit the cleanliness grade your next step needs. Custom design is what lets the equipment run 24/7 for decades.',
      },
      metrics: {
        items: [
          { v: '2–4×', l: 'coolant life with oil and fines removal' },
          { v: '−50/70%', l: 'coolant-change frequency' },
          { v: '+10/30%', l: 'tool life' },
          { v: '↓', l: 'liquid-waste disposal cost' },
          { v: '↓', l: 'stoppages for manual chip cleanup' },
        ],
        note: 'Typical ranges in installations with proper treatment. Results depend on the process — we quantify them during the on-site assessment.',
      },
      cta: {
        text: 'Not sure where to start? An on-site assessment pinpoints where the hidden cost is and how much you can recover.',
        button: 'Request an assessment',
      },
    },
    catalogs: {
      eyebrow: '[ 04 — Downloads ]',
      title: 'Download our catalogs.',
      sub: 'Specifications, operating diagrams and available models for each line. Printable PDF.',
      items: [
        { id: 'general', title: 'General Catalog', desc: 'All three lines plus additional services (laser/plasma cutting, ovens, racks).', pages: 12, size: '9 MB', file: '/catalogs/Trans-Fil-Catalog-General-EN.pdf', color: '#3a86ff', img: '/img/catalog-general-en.webp' },
        { id: 'filtration', title: 'Filtration', desc: 'Centralized coolant treatment and filtration systems.', pages: 8, size: '3 MB', file: '/catalogs/Trans-Fil-Catalog-Filtration-EN.pdf', color: '#ff6b1a', img: '/img/catalog-filtration-en.webp' },
        { id: 'washing', title: 'Washing', desc: 'Automated washing and drying lines. Tunnel, tower, cabinet and special types.', pages: 6, size: '5 MB', file: '/catalogs/Trans-Fil-Catalog-Washing-EN.pdf', color: '#4ade80', img: '/img/catalog-washing-en.webp' },
      ],
      cta: 'View catalog',
    },
    process: {
      eyebrow: 'PROCESS',
      title: 'We design, build and support every machine.',
      lead: 'From the first plant visit to continuous support after commissioning. One team, one point of accountability.',
      steps: [
        { n: '01', t: 'Process study', d: 'We assess your production process and specific needs to design a custom solution.' },
        { n: '02', t: 'Engineering', d: 'Custom structural, mechanical, electrical, hydraulic and safety engineering.' },
        { n: '03', t: 'Manufacturing', d: 'Full build in our Córdoba workshop. Traceable materials and dry-run testing before dispatch.' },
        { n: '04', t: 'Commissioning', d: 'On-site installation, parameter tuning and training for operations and maintenance staff.' },
        { n: '05', t: 'Support', d: 'Spare parts, technical assistance and continuous improvements. Trans-Fil machines from the \'90s are still running.' },
      ],
    },
    services: {
      eyebrow: '[ 05 — Services ]',
      title: 'Beyond the delivery.',
      sub: 'Industrial machinery lasts decades when properly cared for. We support every unit throughout its working life.',
      items: [
        { code: 'S01', title: 'Repairs', desc: 'Diagnostics, spare parts and refurbishment of our own and third-party equipment.', img: '/img/s01-repairs.webp' },
        { code: 'S02', title: 'Retrofitting', desc: 'Modernization of existing machines: PLC, automation, energy efficiency.', img: '/img/s02-retrofitting.webp' },
        { code: 'S03', title: 'Maintenance', desc: 'Preventive and predictive plans. Scheduled visits and ongoing remote support.', img: '/img/s03-maintenance.webp' },
        { code: 'S04', title: 'Custom engineering', desc: 'Process study, layout, simulation and mechanical design from scratch.', img: '/img/s04-engineering.webp' },
      ],
    },
    industries: {
      eyebrow: '[ 06 — Industries ]',
      title: 'Wherever metal is worked,', title2: 'we\'re there.',
      sub: 'Three decades integrating equipment in steel mills, automotive plants, oil & gas facilities and machine-tool factories across Argentina and the region.',
      tabs: [
        { id: 'steel', label: 'Steel' },
        { id: 'auto', label: 'Automotive, Oil & Appliances' },
        { id: 'tools', label: 'Machine Tools' },
      ],
      coverage: [
        'Argentina', 'Brazil', 'Chile', 'Peru',
        'Bolivia', 'Paraguay', 'Uruguay', 'Colombia',
        'Ecuador', 'Mexico', 'United States', 'Dominican Rep.',
        'Puerto Rico', 'Spain',
      ],
      hoverPause: '← HOVER TO PAUSE →',
    },
    history: {
      eyebrow: '[ 07 — History ]',
      title: 'Since 1989, from the same workshop.',
      body: 'Trans-Fil started in Córdoba as a workshop specialized in coolant filtration for the metalworking industry. Three generations later, we still design every machine as if it were the first.',
      milestones: [
        { y: '1989', t: 'Founded', d: 'Workshop opens in Córdoba focused on industrial filtration.' },
        { y: '1998', t: 'First automotive line', d: 'Integration into Renault Argentina plant.' },
        { y: '2007', t: 'Tenaris line', d: 'Conveyor design for seamless tube line.' },
        { y: '2015', t: 'Regional expansion', d: 'Projects in Brazil, Chile, Peru and Mexico.' },
        { y: '2024', t: 'New facility', d: 'Manufacturing capacity expansion at Francisco de Arteaga 2895.' },
      ],
    },
    contact: {
      eyebrow: '[ 08 — Contact ]',
      title: 'Tell us about your process.',
      sub: 'A technical advisor will respond in under 24 business hours. Or write us directly.',
      form: {
        name: 'Name', company: 'Company', email: 'Email', phone: 'Phone',
        industry: 'Industry',
        industryOpts: ['Steel', 'Automotive', 'Oil & Gas', 'Machine Tools', 'Appliances', 'Other'],
        linea: 'Line of interest',
        lineaOpts: ['Filtration', 'Chip conveying', 'Industrial washing', 'Cutting & bending', 'Other'],
        message: 'What process do you want to improve?',
        send: 'Send inquiry',
        sending: 'Sending…',
        sent: 'Inquiry received. We\'ll get back to you.',
        sendErr: 'Could not send. Please retry or email ventas@transfil.com.ar.',
        required: 'Required', emailErr: 'Invalid email',
      },
      direct: 'Direct contact',
      addr: 'Francisco de Arteaga 2895, Córdoba, Argentina',
      addressLabel: 'Address',
    },
    footer: { tag: 'Specialized industrial machinery', rights: 'All rights reserved.', built: 'Trans-Fil S.R.L.' },
    chips: { established: 'EST. 1989', argentina: 'CÓRDOBA · ARGENTINA', iso: 'ISO 9001' },
    workshopActive: 'Workshop · Active',
    whatsappMessage: 'Hi, I\'m contacting you from the Trans-Fil website.',
    langSwitch: { es: 'ES', en: 'EN', pt: 'PT' },
    backToTop: 'Back to top',
    ui: {
      skipToContent: 'Skip to content',
      aboutHeading: 'About Trans-Fil',
      faqHeading: 'Frequently asked questions',
      symptom: 'SYMPTOM',
      solution: 'SOLUTION',
      benefit: 'BENEFIT',
      metricsTitle: 'Typical investment results',
      download: 'Download',
      close: 'Close',
      coverage: 'COVERAGE',
      countriesReached: 'Countries reached',
    },
    about: 'Trans-Fil S.R.L. is an Argentine manufacturer of specialized industrial machinery, founded in 1989 in Córdoba. It designs, builds and maintains chip conveyors, industrial washing systems, coolant filtration and fluid treatment equipment, and laser and plasma cutting machinery. Its workshop is located at Francisco de Arteaga 2895, Córdoba, Argentina. Trans-Fil serves over 120 industrial customers across 14 countries —Argentina, Brazil, Chile, Peru, Bolivia, Paraguay, Uruguay, Colombia, Ecuador, Mexico, United States, Dominican Republic, Puerto Rico and Spain— primarily in the steel, automotive, oil & gas and machine-tool sectors. The company also provides repairs, retrofitting, scheduled maintenance and custom engineering services.',
    faq: [
      {
        q: 'What is Trans-Fil?',
        a: 'Trans-Fil S.R.L. is an Argentine manufacturer of industrial machinery founded in 1989 in Córdoba. It designs, builds and maintains chip conveyors, industrial washing, fluid filtration and cutting machinery for the steel, automotive and machine-tool industries.',
      },
      {
        q: 'Where is Trans-Fil located?',
        a: 'The Trans-Fil workshop is at Francisco de Arteaga 2895, Córdoba, Argentina (31°24′17″S · 64°11′31″W).',
      },
      {
        q: 'How long has Trans-Fil been operating?',
        a: 'Trans-Fil has been operating since 1989 — over 36 years designing and building industrial machinery from the same Córdoba workshop.',
      },
      {
        q: 'What products does Trans-Fil manufacture?',
        a: 'Trans-Fil makes four product lines: (1) Chip transport — hinge, scraper, magnetic, belt or plastic-chain conveyors; (2) Industrial washing — pass-through, rotary and single-cabin washers with built-in filtration and PLC control; (3) Fluid treatment — belt filters, magnetic separators, pressurized advanced filtration and oil-recovery skimmers; (4) General metalwork — laser cutting up to 12.7 mm, plasma cutting up to 25.4 mm, CNC bending up to 3 m, and serial parts production.',
      },
      {
        q: 'What countries does Trans-Fil serve?',
        a: 'Trans-Fil exports to 14 countries: Argentina, Brazil, Chile, Peru, Bolivia, Paraguay, Uruguay, Colombia, Ecuador, Mexico, United States, Dominican Republic, Puerto Rico and Spain.',
      },
      {
        q: 'What industries does Trans-Fil serve?',
        a: 'Trans-Fil serves the steel industry (Acindar, Aluar, Tenaris, Sidersa), the automotive, oil & gas and appliance sectors (Renault, Volkswagen, Iveco, Fiat, Toyota, Brembo, Weatherford), and the machine-tool sector (Mepromaes, Comau, Emag, Mori Seiki, Mazak, Doosan).',
      },
      {
        q: 'Does Trans-Fil offer laser and plasma cutting services?',
        a: 'Yes. Trans-Fil offers high-precision laser cutting for sheet metal up to 12.7 mm (1/2 inch) and plasma cutting up to 25.4 mm (1 inch), in carbon steel, stainless steel and aluminum.',
      },
      {
        q: 'Does Trans-Fil do maintenance and retrofitting of existing machines?',
        a: 'Yes. Trans-Fil offers repairs and refurbishment of its own and third-party equipment, retrofitting (PLC modernization, automation and energy-efficiency upgrades on existing machines), preventive and predictive maintenance with scheduled plant visits, and custom engineering from on-site assessment.',
      },
      {
        q: 'Why does machining coolant degrade?',
        a: 'Coolant degrades from a build-up of metal fines, tramp oil from ways and spindles, and bacterial growth. Tramp oil is the main driver: it feeds the bacteria, lowers pH and generates odor. Removing it and filtering the fines multiplies fluid life.',
      },
      {
        q: 'How is coolant life extended?',
        a: 'By removing tramp oil (skimmers or coalescing separators) and filtering particles (belt filters and magnetic separators). In installations with proper treatment, coolant life is typically multiplied 2 to 4 times, cutting replacement frequency and waste-disposal cost.',
      },
      {
        q: 'When is it worth investing in coolant filtration?',
        a: 'When the coolant is changed often, tooling lasts less than expected, there is pump or spindle damage, or the machine is stopped to remove chips by hand. An on-site assessment quantifies the hidden cost and the return on investment.',
      },
      {
        q: 'How can I contact Trans-Fil?',
        a: 'Email ventas@transfil.com.ar, phone or WhatsApp +54 9 3513 82-0321, or visit the workshop at Francisco de Arteaga 2895, Córdoba, Argentina. The company replies to technical enquiries within 24 business hours.',
      },
    ],
  },
  pt: {
    lang: 'pt',
    htmlLang: 'pt-BR',
    ogLocale: 'pt_BR',
    meta: {
      title: 'Trans-Fil | Máquinas Industriais Especializadas · Córdoba, Argentina',
      description: 'Máquinas industriais especializadas em Córdoba desde 1989: transporte de cavaco, lavagem industrial, filtragem de fluidos e máquinas de corte.',
      ogTitle: 'Trans-Fil — Máquinas industriais · Córdoba',
      ogDescription: 'Projetamos, fabricamos e mantemos máquinas industriais desde 1989: transporte de cavaco, lavagem, filtragem de fluidos e corte para metalurgia e automotivo.',
      ogImageAlt: 'Estação de transporte de cavaco TRANS-FIL em oficina industrial',
      twitterDescription: '36 anos projetando máquinas industriais em Córdoba, Argentina. Processos que não param.',
    },
    nav: { home: 'Início', tech: 'Tecnologias', applications: 'Aplicações', catalogs: 'Catálogos', services: 'Serviços', industries: 'Setores', history: 'História', contact: 'Contato' },
    hero: {
      eyebrow: 'Máquinas industriais · Córdoba, Argentina · Desde 1989',
      titleA: 'Processos', titleB: 'que não', titleC: 'param.',
      sub: 'Projeto, fabricação e manutenção de máquinas industriais especializadas para a indústria metalmecânica.',
      ctaPrimary: 'Ver tecnologias', ctaSecondary: 'Fale conosco',
      stat1: { v: '36', l: 'Anos de operação' },
      stat2: { v: '120+', l: 'Clientes industriais' },
      stat3: { v: '14', l: 'Países atendidos' },
      stat4: { v: '24/7', l: 'Suporte em planta' },
    },
    capabilities: {
      eyebrow: '[ 02 — Capacidades ]',
      title: 'Quatro linhas. Uma só engenharia.',
      sub: 'Cada equipamento é projetado sobre o processo produtivo real e entra no fluxo existente sem interrompê-lo.',
    },
    tech: [
      {
        id: 'conveyors', code: 'T01', title: 'Transporte', sub: 'Conveyors',
        img: '/img/t01-conveyors.webp',
        desc: 'Sistemas de evacuação de cavaco metálico, peças e resíduos para linhas de produção, células de usinagem, linhas transfer e centros CNC. Configuráveis em esteira articulada, raspador, magnético, correia, corrente plástica ou combinados.',
        bullets: [
          { name: 'Transporte de cavaco', img: '/img/t01-chip-transport.webp', desc: 'Sistemas de transporte para todo tipo de cavaco e processo de usinagem, de células individuais a linhas de grande porte. Configuráveis em esteira articulada, raspador, correia ou corrente plástica conforme o material e a vazão. Construção robusta para operação contínua 24/7.', kind: 'photo' },
          { name: 'Linhas de secagem contínua', img: '/img/t01-drying.webp', desc: 'Esteiras com elos microperfurados que separam sólidos e líquidos durante o transporte, garantindo a redução de umidade exigida por processos como tratamento de resíduos ou secagem de peças pequenas em série.', kind: 'photo' },
          { name: 'Linhas centralizadas', img: '/img/t01-conveyors.webp', desc: 'Sistemas multimáquina que evacuam o cavaco de todo o galpão para um único ponto de descarga. Conectam dezenas de máquinas-ferramenta ao mesmo circuito e eliminam o transporte manual entre estações, liberando a equipe de tarefas repetitivas e reduzindo a parada por limpeza.', kind: 'photo' },
          { name: 'Projeto sob medida', img: '/img/t01-custom.webp', desc: 'Geometria, largura, altura, velocidades e demais características adaptadas a cada processo e layout. Cada equipamento é dimensionado a partir do levantamento em planta e validado com desenho 3D antes da fabricação. Materiais e componentes escolhidos conforme o tipo de cavaco e o fluido de corte.', kind: 'photo' },
        ],
      },
      {
        id: 'washing', code: 'T02', title: 'Lavagem industrial', sub: 'Washing machinery',
        img: '/img/t02-washing.webp',
        desc: 'Lavadoras automáticas para peças usinadas, fundidas e forjadas. De células individuais a linhas contínuas com secagem e sopro.',
        bullets: [
          { name: 'Passagem contínua e rotativas', img: '/img/t02-washing.webp', desc: 'Cabines de passagem contínua com esteira ou mesa rotativa para produção em série. Ciclo configurável de lavagem, enxágue e secagem. Integram-se à linha existente sincronizando carga, descarga e temperatura do banho com o ritmo da planta.', kind: 'photo' },
          { name: 'Lavadora de cabine individual', img: '/img/t02-cabin.webp', desc: 'Cabines de carga e descarga manual para uso múltiplo, adequadas a peças de geometria variada e lotes pequenos, onde uma linha contínua não se justifica. Programas selecionáveis pela IHM conforme o grau de limpeza exigido.', kind: 'photo' },
          { name: 'Filtragem integrada', img: '/img/t02-filtration.webp', desc: 'Filtros de esteira, ciclones e skimmers de óleo que mantêm o banho limpo e prolongam a vida do fluido. Reduzem a frequência de troca de detergente e o consumo de água. Manutenção simples, com acesso frontal aos consumíveis.', kind: 'photo' },
          { name: 'Controle CLP', img: '/img/t02-plc.webp', desc: 'Painéis com IHM sensível ao toque. Software integrado à linha de produção e sistema de segurança preparado para Indústria 4.0. Rastreabilidade de ciclos, alarmes e consumos em tempo real, com suporte remoto pela rede do cliente.', kind: 'photo' },
        ],
      },
      {
        id: 'filtration', code: 'T03', title: 'Tratamento de fluidos', sub: 'Fluids treatment',
        img: '/img/t03-fluids-cover.webp',
        desc: 'Filtragem de fluidos de corte, separação magnética e centralização de fluidos. Recuperação de óleos e destinação responsável de resíduos.',
        bullets: [
          { name: 'Filtros de esteira', img: '/img/t02-band-filters.webp', desc: 'Filtragem por gravidade com manta de papel ou têxtil (depurador a tecido). Baixo custo operacional, ideal para fluidos solúveis de usinagem. Avanço automático da manta conforme o nível do banho e rebobinamento do resíduo seco para destinação simples.', kind: 'photo' },
          { name: 'Separadores magnéticos', img: '/video/t02-magnetic-separator.mp4', poster: '/img/t02-magnetic-separator-poster.webp', desc: 'Tambores e barras magnéticas que retiram partículas ferrosas finas antes do filtro principal, capturando o cavaco micrométrico que de outro modo saturaria a manta. Prolongam a vida do consumível e reduzem a carga sólida que chega ao sistema central.', kind: 'video' },
          { name: 'Filtragem avançada', img: '/img/t03-advanced-filtration.webp', desc: 'Centrais de bombeamento, pressurização e controle de temperatura do fluido de corte para várias máquinas em paralelo. Mantêm vazão e temperatura estáveis independentemente do consumo de cada estação. Monitoramento de pressão, condutividade e nível com alarmes configuráveis.', kind: 'photo' },
          { name: 'Recuperação de óleo', img: '/img/t02-oil-recovery.webp', desc: 'Skimmers de esteira e separadores coalescentes que retiram o óleo tramp do fluido de corte para reaproveitar a emulsão. Multiplicam a vida útil do fluido e reduzem o custo de tratamento de resíduos. O óleo recuperado é separado para destinação ou reúso.', kind: 'photo' },
        ],
      },
      {
        id: 'metalwork', code: 'T04', title: 'Metalurgia geral', sub: 'General metalwork',
        img: '/img/t04-metalwork-cover.webp',
        desc: 'Serviços metalúrgicos completos: corte a laser e plasma de alta precisão, dobra CNC e produção de peças em série com alta capacidade de resposta.',
        bullets: [
          { name: 'Corte a laser', img: '/video/t04-laser-cutting.mp4', poster: '/img/t04-laser-cutting-poster.webp', desc: 'Serviço de corte a laser de alta precisão para chapas de até 12,7 mm (1/2 polegada). Aço-carbono, inoxidável e alumínio. Tolerâncias apertadas e bordas limpas, prontas para solda ou dobra posterior.', kind: 'video' },
          { name: 'Corte plasma', img: '/video/t04-plasma-cutting.mp4', poster: '/img/t04-plasma-cutting-poster.webp', desc: 'Serviço de corte plasma para chapas de até 25,4 mm (1 polegada). Especialmente eficiente nas espessuras em que o laser deixa de ser vantajoso. Boa qualidade de borda com alto rendimento produtivo.', kind: 'video' },
          { name: 'Dobra industrial', img: '/video/t04-industrial-bending.mp4', poster: '/img/t04-industrial-bending-poster.webp', desc: 'Dobradeira CNC para dobras de até 3 m. Programação a partir de desenho 3D e biblioteca de matrizes para diferentes espessuras e raios. Alta repetibilidade para produção em série.', kind: 'video' },
          { name: 'Produção em série', img: '/img/t04-serial-production.webp', desc: 'Capacidade industrial, décadas de experiência e uma ampla rede de fornecedores permitem produzir peças metalúrgicas em lotes com alta capacidade de resposta. De protótipos validados com o cliente a produções recorrentes. Assumimos também montagem, solda e tratamentos superficiais quando necessário.', kind: 'photo' },
        ],
      },
    ],
    applications: {
      eyebrow: '[ 03 — Aplicações ]',
      title: 'O custo que não se vê.',
      intro: 'Muitas plantas descartam o fluido de corte quando ele suja — depois de já ter desgastado as ferramentas, danificado a bomba e parado a linha. Filtragem, transporte de cavaco e lavagem não são acessórios: protegem os ativos que você já pagou.',
      symptoms: {
        title: 'Você reconhece estes sintomas na sua planta?',
        items: [
          'Troca o solúvel a cada poucas semanas e paga para que seja recolhido.',
          'As ferramentas duram menos do que deveriam.',
          'Para a máquina para retirar cavaco na mão.',
          'O fluido de corte exala odor ou irrita a equipe.',
          'O acabamento superficial cai sem causa clara.',
          'A bomba ou o eixo-árvore falham antes do previsto.',
        ],
        close: 'Se você reconhece dois ou mais, não é azar: é um custo oculto com solução de engenharia.',
      },
      cards: [
        {
          code: 'A01',
          title: 'Conformação de tubos',
          problem: 'O lubrificante se carrega de finos metálicos e óleo tramp. O fluido degradado lubrifica pior e acelera o desgaste de roletes e matrizes; aparecem marcas na superfície do tubo e a sucata aumenta.',
          install: 'Filtragem centralizada + separação magnética + recuperação de óleo.',
          benefit: 'Protege o ferramental de conformação · multiplica a vida do fluido.',
          link: { page: 'conformado', label: 'Ver a solução' },
        },
        {
          code: 'A02',
          title: 'Usinagem e torneamento',
          problem: 'O cavaco se acumula e os finos recirculam no fluido de corte; o óleo de barramento o contamina. O resultado: desgaste de ferramenta, dano em bombas e eixos-árvore, e paradas para limpeza manual.',
          install: 'Transporte de cavaco centralizado + filtro de esteira + separador magnético.',
          benefit: 'Mais vida de ferramenta · menos paradas · fluido limpo.',
        },
        {
          code: 'A03',
          title: 'Retificação de precisão',
          problem: 'O cavaco abrasivo fino é quase invisível, mas arruína o acabamento e desgasta o rebolo se não for retirado do fluido. A tolerância fica instável de lote a lote.',
          install: 'Filtragem fina (esteira ou papel) + separação magnética de alta eficiência.',
          benefit: 'Acabamento estável · mais vida de rebolo · fluido limpo.',
        },
        {
          code: 'A04',
          title: 'Lavagem e preparação de peças',
          problem: 'As peças chegam com óleo e cavaco à montagem, à solda ou à pintura. A lavagem manual é inconsistente e vira gargalo na linha.',
          install: 'Lavadora industrial (passagem contínua, rotativa ou cabine) com filtragem integrada e controle CLP.',
          benefit: 'Limpeza repetível · mais throughput · banho de maior vida.',
        },
      ],
      custom: {
        title: 'Cada equipamento é dimensionado sobre o seu processo.',
        body: 'Cada transportador de cavaco, filtro e lavadora é dimensionado sobre o processo real: tipo de cavaco, fluido de corte, vazão, layout e ritmo de linha. Validamos com projeto 3D antes de fabricar. Um transportador mal dimensionado entope; uma lavadora genérica não atinge o grau de limpeza que a próxima etapa exige. O projeto sob medida é o que faz o equipamento trabalhar 24/7 por décadas.',
      },
      metrics: {
        items: [
          { v: '2–4×', l: 'vida do fluido de corte com remoção de óleo e finos' },
          { v: '−50/70%', l: 'frequência de troca do solúvel' },
          { v: '+10/30%', l: 'vida útil de ferramenta' },
          { v: '↓', l: 'custo de destinação de resíduos líquidos' },
          { v: '↓', l: 'paradas por limpeza manual de cavaco' },
        ],
        note: 'Faixas típicas em instalações com tratamento adequado. Os resultados dependem do processo — nós os quantificamos no levantamento na sua planta.',
      },
      cta: {
        text: 'Não sabe por onde começar? Um levantamento identifica onde está o custo oculto e quanto dá para recuperar.',
        button: 'Solicitar levantamento',
      },
    },
    catalogs: {
      eyebrow: '[ 04 — Downloads ]',
      title: 'Baixe nossos catálogos.',
      sub: 'Especificações, esquemas de funcionamento e modelos disponíveis para cada linha. PDF para impressão.',
      note: 'Os PDFs estão em inglês. Precisa de material em português? Fale com a gente.',
      items: [
        { id: 'general', title: 'Catálogo Geral', desc: 'As três linhas + serviços adicionais (corte a laser/plasma, fornos, racks).', pages: 12, size: '9 MB', file: '/catalogs/Trans-Fil-Catalog-General-EN.pdf', color: '#3a86ff', img: '/img/catalog-general-en.webp' },
        { id: 'filtration', title: 'Filtragem', desc: 'Sistemas centralizados de tratamento e filtragem de fluidos de corte.', pages: 8, size: '3 MB', file: '/catalogs/Trans-Fil-Catalog-Filtration-EN.pdf', color: '#ff6b1a', img: '/img/catalog-filtration-en.webp' },
        { id: 'washing', title: 'Lavagem', desc: 'Linhas automatizadas de lavagem e secagem de peças. Túnel, torre, cabine e especiais.', pages: 6, size: '5 MB', file: '/catalogs/Trans-Fil-Catalog-Washing-EN.pdf', color: '#4ade80', img: '/img/catalog-washing-en.webp' },
      ],
      cta: 'Ver catálogo',
    },
    process: {
      eyebrow: 'PROCESSO',
      title: 'Projetamos, fabricamos e acompanhamos cada equipamento.',
      lead: 'Da primeira visita à sua planta ao suporte contínuo depois do start-up. Uma só equipe, um só responsável.',
      steps: [
        { n: '01', t: 'Estudo de processo', d: 'Levantamos seu processo produtivo e sua necessidade específica para projetar uma solução sob medida.' },
        { n: '02', t: 'Engenharia', d: 'Projeto customizado estrutural, mecânico, elétrico, hidráulico e de segurança.' },
        { n: '03', t: 'Fabricação', d: 'Construção completa na nossa oficina de Córdoba. Materiais rastreáveis e testes a seco antes do embarque.' },
        { n: '04', t: 'Start-up', d: 'Instalação no local, ajuste de parâmetros e treinamento da equipe de operação e manutenção.' },
        { n: '05', t: 'Suporte', d: 'Peças de reposição, assistência técnica e melhorias contínuas. As máquinas Trans-Fil dos anos 90 ainda operam.' },
      ],
    },
    services: {
      eyebrow: '[ 05 — Serviços ]',
      title: 'Além da entrega.',
      sub: 'Uma máquina industrial dura décadas se receber a atenção adequada. Acompanhamos cada equipamento durante toda a vida útil.',
      items: [
        { code: 'S01', title: 'Reparos', desc: 'Diagnóstico, peças de reposição e recondicionamento de equipamentos próprios e de terceiros.', img: '/img/s01-repairs.webp' },
        { code: 'S02', title: 'Retrofit', desc: 'Modernização de máquinas existentes: CLP, automação, eficiência energética.', img: '/img/s02-retrofitting.webp' },
        { code: 'S03', title: 'Manutenção', desc: 'Planos preventivos e preditivos. Visitas programadas e suporte remoto contínuo.', img: '/img/s03-maintenance.webp' },
        { code: 'S04', title: 'Engenharia sob medida', desc: 'Estudo de processo, layout, simulação e projeto mecânico do zero.', img: '/img/s04-engineering.webp' },
      ],
    },
    industries: {
      eyebrow: '[ 06 — Setores ]',
      title: 'Onde se trabalha o metal,', title2: 'lá estamos.',
      sub: 'Três décadas integrando equipamentos em siderúrgicas, montadoras, plantas de óleo e gás e fábricas de máquinas-ferramenta na Argentina e na região.',
      tabs: [
        { id: 'steel', label: 'Siderurgia' },
        { id: 'auto', label: 'Automotivo, Óleo & Linha Branca' },
        { id: 'tools', label: 'Máquinas-Ferramenta' },
      ],
      coverage: [
        'Argentina', 'Brasil', 'Chile', 'Peru',
        'Bolívia', 'Paraguai', 'Uruguai', 'Colômbia',
        'Equador', 'México', 'Estados Unidos', 'Rep. Dominicana',
        'Porto Rico', 'Espanha',
      ],
      hoverPause: '← PASSE O MOUSE PARA PAUSAR →',
    },
    history: {
      eyebrow: '[ 07 — História ]',
      title: 'Desde 1989, na mesma oficina.',
      body: 'A Trans-Fil nasceu em Córdoba como uma oficina especializada em filtragem de fluidos de corte para a indústria metalmecânica. Três gerações depois, seguimos projetando cada máquina com a mesma dedicação inicial.',
      milestones: [
        { y: '1989', t: 'Fundação', d: 'Início da oficina em Córdoba com foco em filtragem industrial.' },
        { y: '1998', t: 'Primeira linha automotiva', d: 'Integração com a planta da Renault Argentina.' },
        { y: '2007', t: 'Linha Tenaris', d: 'Projeto de transportadores para linha de tubos sem costura.' },
        { y: '2015', t: 'Expansão regional', d: 'Projetos no Brasil, Chile, Peru e México.' },
        { y: '2024', t: 'Nova planta', d: 'Ampliação da capacidade de fabricação em Francisco de Arteaga 2895.' },
      ],
    },
    contact: {
      eyebrow: '[ 08 — Contato ]',
      title: 'Conte para nós sobre o seu processo.',
      sub: 'Um consultor técnico responde em menos de 24 h úteis. Se preferir, fale direto com a gente.',
      form: {
        name: 'Nome', company: 'Empresa', email: 'E-mail', phone: 'Telefone',
        industry: 'Setor',
        industryOpts: ['Siderurgia', 'Automotivo', 'Óleo & Gás', 'Máquinas-Ferramenta', 'Linha Branca', 'Outro'],
        linea: 'Linha de interesse',
        lineaOpts: ['Filtragem', 'Transporte de cavaco', 'Lavagem industrial', 'Corte e dobra', 'Outra'],
        message: 'Que processo você quer melhorar?',
        send: 'Enviar consulta',
        sending: 'Enviando…',
        sent: 'Consulta recebida. Entraremos em contato.',
        sendErr: 'Não foi possível enviar. Tente de novo ou escreva para ventas@transfil.com.ar.',
        required: 'Campo obrigatório', emailErr: 'E-mail inválido',
      },
      direct: 'Contato direto',
      addr: 'Francisco de Arteaga 2895, Córdoba, Argentina',
      addressLabel: 'Endereço',
    },
    footer: { tag: 'Máquinas industriais especializadas', rights: 'Todos os direitos reservados.', built: 'Trans-Fil S.R.L.' },
    chips: { established: 'EST. 1989', argentina: 'CÓRDOBA · ARGENTINA', iso: 'ISO 9001' },
    workshopActive: 'Oficina · Ativa',
    whatsappMessage: 'Olá, contato vocês pelo site da Trans-Fil.',
    langSwitch: { es: 'ES', en: 'EN', pt: 'PT' },
    backToTop: 'Voltar ao topo',
    ui: {
      skipToContent: 'Ir para o conteúdo',
      aboutHeading: 'Sobre a Trans-Fil',
      faqHeading: 'Perguntas frequentes',
      symptom: 'SINTOMA',
      solution: 'SOLUÇÃO',
      benefit: 'BENEFÍCIO',
      metricsTitle: 'Resultados típicos do investimento',
      download: 'Baixar',
      close: 'Fechar',
      coverage: 'COBERTURA',
      countriesReached: 'Países atendidos',
    },
    about: 'A Trans-Fil S.R.L. é uma fabricante argentina de máquinas industriais especializadas, fundada em 1989 em Córdoba. Projeta, fabrica e mantém transportadores de cavaco, sistemas de lavagem industrial, equipamentos de filtragem e tratamento de fluidos de corte, e máquinas de corte a laser e plasma. Sua planta fica em Francisco de Arteaga 2895, Córdoba, Argentina. Atende mais de 120 clientes industriais em 14 países —Argentina, Brasil, Chile, Peru, Bolívia, Paraguai, Uruguai, Colômbia, Equador, México, Estados Unidos, República Dominicana, Porto Rico e Espanha— principalmente dos setores siderúrgico, automotivo, óleo e gás e de máquinas-ferramenta. Presta ainda serviços complementares de reparo, retrofit, manutenção programada e engenharia sob medida.',
    faq: [
      {
        q: 'O que é a Trans-Fil?',
        a: 'A Trans-Fil S.R.L. é uma fabricante argentina de máquinas industriais fundada em 1989 em Córdoba. Projeta, fabrica e mantém transportadores de cavaco, sistemas de lavagem industrial, filtragem de fluidos e máquinas de corte para os setores siderúrgico, automotivo e de máquinas-ferramenta.',
      },
      {
        q: 'Onde fica a Trans-Fil?',
        a: 'A planta da Trans-Fil fica em Francisco de Arteaga 2895, Córdoba, Argentina (31°24′17″S · 64°11′31″W).',
      },
      {
        q: 'Desde quando a Trans-Fil opera?',
        a: 'A Trans-Fil opera desde 1989, com mais de 36 anos projetando e fabricando máquinas industriais na mesma oficina de Córdoba.',
      },
      {
        q: 'Que produtos a Trans-Fil fabrica?',
        a: 'A Trans-Fil fabrica quatro linhas: (1) Transporte de cavaco —esteira articulada, raspador, magnético, correia ou corrente plástica; (2) Lavagem industrial —cabines de passagem contínua, rotativas e de carga manual, com filtragem integrada e controle CLP; (3) Tratamento de fluidos —filtros de esteira, separadores magnéticos, filtragem avançada com centrais pressurizadas e recuperação de óleo; (4) Metalurgia geral —corte a laser até 12,7 mm, corte plasma até 25,4 mm, dobra CNC até 3 m e produção de peças em série.',
      },
      {
        q: 'Para quais países a Trans-Fil exporta?',
        a: 'A Trans-Fil exporta para 14 países: Argentina, Brasil, Chile, Peru, Bolívia, Paraguai, Uruguai, Colômbia, Equador, México, Estados Unidos, República Dominicana, Porto Rico e Espanha.',
      },
      {
        q: 'Que setores a Trans-Fil atende?',
        a: 'A Trans-Fil atende principalmente a indústria siderúrgica (Acindar, Aluar, Tenaris, Sidersa), os setores automotivo, óleo e gás e linha branca (Renault, Volkswagen, Iveco, Fiat, Toyota, Brembo, Weatherford) e o setor de máquinas-ferramenta (Mepromaes, Comau, Emag, Mori Seiki, Mazak, Doosan).',
      },
      {
        q: 'A Trans-Fil presta serviços de corte a laser e corte plasma?',
        a: 'Sim. A Trans-Fil presta serviços de corte a laser de alta precisão para chapas de até 12,7 mm (1/2 polegada) e de corte plasma até 25,4 mm (1 polegada), em aço-carbono, aço inoxidável e alumínio.',
      },
      {
        q: 'A Trans-Fil faz manutenção e retrofit de máquinas existentes?',
        a: 'Sim. A Trans-Fil oferece reparo e recondicionamento de equipamentos próprios e de terceiros, retrofit (modernização de CLP, automação e eficiência energética de máquinas existentes), manutenção preventiva e preditiva com visitas programadas, e engenharia sob medida a partir do levantamento em planta.',
      },
      {
        q: 'Por que o fluido de corte se degrada?',
        a: 'O fluido de corte se degrada pelo acúmulo de finos metálicos, pelo óleo tramp que vem de barramentos e eixos-árvore, e pelo crescimento bacteriano. O óleo tramp é a causa principal: alimenta as bactérias, baixa o pH e gera odor. Removê-lo e filtrar os finos multiplica a vida do fluido.',
      },
      {
        q: 'Como se prolonga a vida do solúvel?',
        a: 'Com remoção de óleo tramp (skimmers ou separadores coalescentes) e filtragem de partículas (filtros de esteira e separadores magnéticos). Em instalações com tratamento adequado, a vida do fluido costuma se multiplicar de 2 a 4 vezes, reduzindo a troca e o custo de destinação de resíduos.',
      },
      {
        q: 'Quando vale a pena investir em filtragem de fluido de corte?',
        a: 'Quando o solúvel é trocado com frequência, as ferramentas duram menos do que o esperado, há dano em bombas ou eixos-árvore, ou a máquina é parada para retirar cavaco na mão. Um levantamento em planta quantifica o custo oculto e o retorno do investimento.',
      },
      {
        q: 'Como entrar em contato com a Trans-Fil?',
        a: 'Por e-mail em ventas@transfil.com.ar, por telefone ou WhatsApp no +54 9 3513 82-0321, ou na planta de Francisco de Arteaga 2895, Córdoba, Argentina. A empresa responde consultas técnicas em menos de 24 horas úteis.',
      },
    ],
  },
};
