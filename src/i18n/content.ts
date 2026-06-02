export type Lang = 'es' | 'en';

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
  htmlLang: string;
  ogLocale: string;
  altLocale: string;
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogImageAlt: string;
    twitterDescription: string;
  };
  nav: {
    home: string; tech: string; catalogs: string; services: string;
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
  catalogs: {
    eyebrow: string; title: string; sub: string;
    items: CatalogItem[];
    cta: string;
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
      industry: string; industryOpts: string[]; message: string;
      send: string; sent: string; required: string; emailErr: string;
    };
    direct: string;
    addr: string;
    addressLabel: string;
  };
  footer: { tag: string; rights: string; built: string };
  chips: { established: string; argentina: string; iso: string };
  workshopActive: string;
  whatsappMessage: string;
  langSwitch: { es: string; en: string };
  backToTop: string;
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
    htmlLang: 'es-AR',
    ogLocale: 'es_AR',
    altLocale: 'en_US',
    meta: {
      title: 'Trans-Fil | Maquinaria Industrial Especializada · Córdoba, Argentina',
      description: 'Maquinaria industrial especializada en Córdoba desde 1989: transporte de viruta, lavado industrial, filtración de fluidos y maquinaria de corte.',
      ogTitle: 'Trans-Fil — Maquinaria industrial · Córdoba',
      ogDescription: 'Diseñamos, fabricamos y mantenemos maquinaria industrial desde 1989: transporte de viruta, lavado, filtración de fluidos y corte para metalurgia y automotriz.',
      ogImageAlt: 'Estación de transporte de viruta TRANS-FIL en taller industrial',
      twitterDescription: '36 años diseñando maquinaria industrial en Córdoba, Argentina. Procesos que no se detienen.',
    },
    nav: { home: 'Inicio', tech: 'Tecnologías', catalogs: 'Catálogos', services: 'Servicios', industries: 'Industrias', history: 'Historia', contact: 'Contacto' },
    hero: {
      eyebrow: 'Maquinaria industrial · Córdoba, Argentina · Desde 1989',
      titleA: 'Procesos', titleB: 'que no', titleC: 'se detienen.',
      sub: 'Diseñamos, fabricamos y mantenemos maquinaria a medida para metalurgia, automotriz y máquinas-herramienta.',
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
          { name: 'Recuperación de aceite', img: '/img/t02-oil-recovery.webp', desc: 'Skimmers de banda y separadores coalescentes que retiran el aceite tramposo del refrigerante para reutilizar el fluido. Extienden varias veces la vida útil del refrigerante y bajan el costo de tratamiento de residuos. El aceite recuperado se separa para disposición o reúso.', kind: 'photo' },
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
    catalogs: {
      eyebrow: '[ 03 — Descargas ]',
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
      eyebrow: '[ 04 — Servicios ]',
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
      eyebrow: '[ 05 — Industrias ]',
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
      eyebrow: '[ 06 — Historia ]',
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
      eyebrow: '[ 07 — Contacto ]',
      title: 'Cuéntenos sobre su proceso.',
      sub: 'Un asesor técnico responderá en menos de 24h hábiles. Si lo prefiere, escríbanos directamente.',
      form: {
        name: 'Nombre', company: 'Empresa', email: 'Email', phone: 'Teléfono',
        industry: 'Industria',
        industryOpts: ['Siderurgia', 'Automotriz', 'Oil & Gas', 'Máquinas-Herramienta', 'Línea Blanca', 'Otro'],
        message: '¿Qué proceso desea mejorar?',
        send: 'Enviar consulta',
        sent: 'Consulta recibida. Nos pondremos en contacto.',
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
    langSwitch: { es: 'ES', en: 'EN' },
    backToTop: 'Volver arriba',
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
        q: '¿Cómo contactar a Trans-Fil?',
        a: 'Por email a ventas@transfil.com.ar, por teléfono o WhatsApp al +54 9 3513 82-0321, o en la planta de Francisco de Arteaga 2895, Córdoba, Argentina. La empresa responde consultas técnicas en menos de 24 horas hábiles.',
      },
    ],
  },
  en: {
    htmlLang: 'en-US',
    ogLocale: 'en_US',
    altLocale: 'es_AR',
    meta: {
      title: 'Trans-Fil | Specialized Industrial Machinery · Córdoba, Argentina',
      description: 'Specialized industrial machinery in Córdoba since 1989: chip conveyors, industrial washing, fluid filtration and cutting machinery.',
      ogTitle: 'Trans-Fil — Specialized industrial machinery',
      ogDescription: 'We design, build and maintain industrial machinery since 1989: chip conveyors, washing, fluid filtration and cutting for metallurgy and automotive.',
      ogImageAlt: 'TRANS-FIL chip conveyor station in industrial workshop',
      twitterDescription: '36 years designing industrial machinery in Córdoba, Argentina. Processes that don\'t stop.',
    },
    nav: { home: 'Home', tech: 'Technologies', catalogs: 'Catalogs', services: 'Services', industries: 'Industries', history: 'History', contact: 'Contact' },
    hero: {
      eyebrow: 'Industrial machinery · Córdoba, Argentina · Since 1989',
      titleA: 'Processes', titleB: 'that don\'t', titleC: 'stop.',
      sub: 'We design, build and maintain made-to-measure machinery for the metalworking, automotive and machine-tool industries.',
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
    catalogs: {
      eyebrow: '[ 03 — Downloads ]',
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
      eyebrow: '[ 04 — Services ]',
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
      eyebrow: '[ 05 — Industries ]',
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
      eyebrow: '[ 06 — History ]',
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
      eyebrow: '[ 07 — Contact ]',
      title: 'Tell us about your process.',
      sub: 'A technical advisor will respond in under 24 business hours. Or write us directly.',
      form: {
        name: 'Name', company: 'Company', email: 'Email', phone: 'Phone',
        industry: 'Industry',
        industryOpts: ['Steel', 'Automotive', 'Oil & Gas', 'Machine Tools', 'Appliances', 'Other'],
        message: 'What process do you want to improve?',
        send: 'Send inquiry',
        sent: 'Inquiry received. We\'ll get back to you.',
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
    langSwitch: { es: 'ES', en: 'EN' },
    backToTop: 'Back to top',
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
        q: 'How can I contact Trans-Fil?',
        a: 'Email ventas@transfil.com.ar, phone or WhatsApp +54 9 3513 82-0321, or visit the workshop at Francisco de Arteaga 2895, Córdoba, Argentina. The company replies to technical enquiries within 24 business hours.',
      },
    ],
  },
};
