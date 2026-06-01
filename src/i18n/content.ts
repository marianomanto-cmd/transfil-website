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
    keywords: string;
    ogTitle: string;
    ogDescription: string;
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
      description: 'Diseñamos, fabricamos y mantenemos maquinaria industrial para la metalurgia, automotriz y máquinas-herramienta: transportadores de viruta, lavado industrial, filtración de fluidos y maquinaria de corte. Desde 1989, en Córdoba.',
      keywords: 'maquinaria industrial, transportadores de viruta, filtración de refrigerantes, lavado industrial, briquetadoras, retrofitting, Córdoba Argentina, Trans-Fil',
      ogTitle: 'Trans-Fil | Maquinaria Industrial Especializada',
      ogDescription: '36 años diseñando, fabricando y manteniendo maquinaria industrial en Córdoba, Argentina. Transportadores, lavado, filtración y corte para metalurgia y automotriz.',
      twitterDescription: '36 años diseñando maquinaria industrial en Córdoba, Argentina. Procesos que no se detienen.',
    },
    nav: { home: 'Inicio', tech: 'Tecnologías', catalogs: 'Catálogos', services: 'Servicios', industries: 'Industrias', history: 'Historia', contact: 'Contacto' },
    hero: {
      eyebrow: 'Maquinaria industrial · Córdoba, Argentina · Desde 1989',
      titleA: 'Procesos', titleB: 'que no', titleC: 'se detienen.',
      sub: 'Diseño, fabricación y mantenimiento de maquinaria especializada para metalurgia, automotriz y máquinas-herramienta.',
      ctaPrimary: 'Ver tecnologías', ctaSecondary: 'Contáctenos',
      stat1: { v: '36', l: 'Años de operación' },
      stat2: { v: '120+', l: 'Clientes industriales' },
      stat3: { v: '12', l: 'Países alcanzados' },
      stat4: { v: '24/7', l: 'Soporte de planta' },
    },
    capabilities: {
      eyebrow: '[ 02 — Capacidades ]',
      title: 'Cuatro líneas. Una misma ingeniería.',
      sub: 'Cada equipo se diseña sobre el proceso productivo real e integra al flujo existente.',
    },
    tech: [
      {
        id: 'conveyors', code: 'T01', title: 'Transportadores', sub: 'Conveyors',
        img: '/img/t01-conveyors.webp',
        desc: 'Sistemas de evacuación de viruta metálica, piezas y residuos para líneas de producción, celdas de mecanizado, líneas transfer y centros CNC. Configurables en bisagra, raspador, magnéticos, cintas, cadenas plásticas o combinados.',
        bullets: [
          { name: 'Transporte de viruta', img: '/img/t01-chip-transport.webp', desc: 'Sistemas de transporte para todo tipo de viruta y procesos de mecanizado individuales y de gran porte.', kind: 'photo' },
          { name: 'Líneas de secado continuo', img: '/img/t01-drying.webp', desc: 'Nuestras líneas de secado continuo utilizan cintas de transporte especiales con eslabones microperforados para separar partes sólidas y líquidas durante el secado, garantizando la reducción de humedad requerida por procesos como tratamiento de residuos, piezas, etc.', kind: 'photo' },
          { name: 'Líneas centralizadas', img: '/img/t01-centralized-lines.jpg', desc: 'Sistemas multi-máquina que evacúan viruta de toda una nave hacia un punto único de descarga. Reduce manipulación manual.', kind: 'photo' },
          { name: 'Diseño a medida', img: '/img/t01-custom.webp', desc: 'Geometría, ancho, altura, velocidades y otras características diseñadas y adaptadas a cada proceso y layout.', kind: 'photo' },
        ],
      },
      {
        id: 'washing', code: 'T02', title: 'Lavado industrial', sub: 'Washing machinery',
        img: '/img/t02-washing.webp',
        desc: 'Lavadoras automáticas para piezas mecanizadas, fundición y forja. Desde celdas individuales hasta líneas continuas con secado y soplado.',
        bullets: [
          { name: 'Pasante y rotativas', img: '/img/t02-pass-through.webp', desc: 'Cabinas de paso continuo con cinta o mesa rotativa para producción seriada. Ciclo configurable: lavado, enjuague, secado.', kind: 'photo' },
          { name: 'Lavadora de cabina individual', img: '/img/t02-cabin.webp', desc: 'Sistemas de lavado especiales para carga y descarga manual de uso múltiple.', kind: 'photo' },
          { name: 'Filtración integrada', img: '/img/t02-filtration.webp', desc: 'Filtros de banda, ciclones y skimmers de aceite que mantienen el baño limpio y prolongan la vida del fluido.', kind: 'photo' },
          { name: 'Control PLC', img: '/img/t02-plc.webp', desc: 'Tableros con HMI táctil. Software integrado a la línea de producción y sistema de seguridad adaptado para Industria 4.0.', kind: 'photo' },
        ],
      },
      {
        id: 'filtration', code: 'T03', title: 'Tratamiento de fluidos', sub: 'Fluids treatment',
        img: '/img/t03-fluids-cover.webp',
        desc: 'Filtración de refrigerantes, separación magnética y centralización de fluidos. Recuperación de aceites y manejo responsable de residuos.',
        bullets: [
          { name: 'Filtros de banda', img: '/img/t02-band-filters.webp', desc: 'Filtración por gravedad con tela de papel o textil. Bajo costo operativo, ideal para refrigerantes solubles en mecanizado.', kind: 'photo' },
          { name: 'Separadores magnéticos', img: '/video/t02-magnetic-separator.mp4', poster: '/img/t02-magnetic-separator-poster.webp', desc: 'Tambores y barras imantadas que retiran partículas ferrosas finas antes del filtro principal. Aumenta la vida del consumible.', kind: 'video' },
          { name: 'Filtración avanzada', img: '/img/t03-advanced-filtration.webp', desc: 'Estaciones de bombeo, presurización y temperado del refrigerante para múltiples máquinas en paralelo.', kind: 'photo' },
          { name: 'Recuperación de aceite', img: '/img/conveyor-blue.avif', desc: 'Skimmers de banda y separadores coalescentes que retiran el aceite tramposo del refrigerante para reusar el fluido.', kind: 'photo' },
        ],
      },
      {
        id: 'metalwork', code: 'T04', title: 'Metalúrgica general', sub: 'General metalwork',
        img: '/img/t04-metalwork-cover.webp',
        desc: 'Servicios metalúrgicos integrales: corte láser y plasma de alta precisión, plegado CNC y producción de piezas en serie con alta capacidad de respuesta.',
        bullets: [
          { name: 'Corte láser', img: '/img/welding-line.avif', desc: 'Prestamos servicios de corte por láser de alta precisión para la industria de hasta 12,7 mm (1/2 pulgada).', kind: 'photo' },
          { name: 'Corte plasma', img: '/img/hydraulic-station.avif', desc: 'Prestamos servicios de corte por plasma para la industria de hasta 25,4 mm (1 pulgada).', kind: 'photo' },
          { name: 'Plegado industrial', img: '/img/hydraulic-station-2.avif', desc: 'Plegadora CNC para plegados de hasta 3 m.', kind: 'photo' },
          { name: 'Producción en serie', img: '/img/gearbox-detail.avif', desc: 'Nuestra capacidad industrial, décadas de experiencia y extensa red de proveedores nos permiten producir piezas para la industria metalúrgica en lotes con alta capacidad de respuesta.', kind: 'photo' },
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
        { n: '03', t: 'Fabricación', d: 'Construcción íntegra en nuestro taller de Córdoba. Materiales trazables y pruebas en seco antes del despacho.' },
        { n: '04', t: 'Puesta en marcha', d: 'Instalación en sitio, ajuste de parámetros y capacitación del personal de operación y mantenimiento.' },
        { n: '05', t: 'Soporte', d: 'Repuestos, asistencia técnica y mejoras continuas. Las máquinas Trans-Fil de los \'90 todavía operan.' },
      ],
    },
    services: {
      eyebrow: '[ 04 — Servicios ]',
      title: 'Más allá de la entrega.',
      sub: 'Una máquina industrial dura décadas si recibe la atención correcta. Acompañamos cada equipo durante toda su vida útil.',
      items: [
        { code: 'S01', title: 'Reparaciones', desc: 'Diagnóstico, repuestos y reacondicionamiento de equipos propios y de terceros.', img: '/img/gearbox-detail.avif' },
        { code: 'S02', title: 'Retrofitting', desc: 'Modernización de máquinas existentes: PLC, automatización, eficiencia energética.', img: '/img/control-cabinet.avif' },
        { code: 'S03', title: 'Mantenimiento', desc: 'Planes preventivos y predictivos. Visitas programadas y soporte remoto continuo.', img: '/img/hydraulic-station.avif' },
        { code: 'S04', title: 'Ingeniería a medida', desc: 'Estudio de proceso, layout, simulación y diseño mecánico desde cero.', img: '/img/welding-line.avif' },
      ],
    },
    industries: {
      eyebrow: '[ 05 — Industrias ]',
      title: 'Donde se trabaja el metal,', title2: 'ahí estamos.',
      sub: 'Tres décadas integrando equipos en plantas siderúrgicas, automotrices, oil & gas y máquinas-herramienta de Argentina y la región.',
      tabs: [
        { id: 'steel', label: 'Siderurgia' },
        { id: 'auto', label: 'Automotriz, Oil & Línea Blanca' },
        { id: 'tools', label: 'Máquinas-Herramienta' },
      ],
      coverage: [
        'Argentina', 'Brasil', 'Chile', 'Perú',
        'Bolivia', 'Uruguay', 'Colombia', 'Ecuador',
        'México', 'Estados Unidos', 'R. Dominicana', 'España',
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
        { y: '2024', t: 'Nueva planta', d: 'Ampliación de capacidad de fabricación en Francisco de Arteaga 3043.' },
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
      addr: 'Francisco de Arteaga 3043, Córdoba, Argentina',
      addressLabel: 'Dirección',
    },
    footer: { tag: 'Maquinaria industrial especializada', rights: 'Todos los derechos reservados.', built: 'Trans-Fil S.R.L.' },
    chips: { established: 'EST. 1989', argentina: 'CÓRDOBA · ARGENTINA', iso: 'ISO 9001' },
    workshopActive: 'Taller · Activo',
    whatsappMessage: 'Hola, los contacto desde el sitio web de Trans-Fil.',
    langSwitch: { es: 'ES', en: 'EN' },
    backToTop: 'Volver arriba',
  },
  en: {
    htmlLang: 'en-US',
    ogLocale: 'en_US',
    altLocale: 'es_AR',
    meta: {
      title: 'Trans-Fil | Specialized Industrial Machinery · Córdoba, Argentina',
      description: 'We design, build and maintain industrial machinery for metallurgic, automotive and machine-tool industries: chip conveyors, industrial washing, fluid filtration and cutting machinery. Since 1989, in Córdoba.',
      keywords: 'industrial machinery, chip conveyors, coolant filtration, industrial washing, briquetters, retrofitting, Córdoba Argentina, Trans-Fil',
      ogTitle: 'Trans-Fil | Specialized Industrial Machinery',
      ogDescription: '36 years designing, building and maintaining industrial machinery in Córdoba, Argentina. Conveyors, washing, filtration and cutting for metallurgic and automotive.',
      twitterDescription: '36 years designing industrial machinery in Córdoba, Argentina. Processes that don\'t stop.',
    },
    nav: { home: 'Home', tech: 'Technologies', catalogs: 'Catalogs', services: 'Services', industries: 'Industries', history: 'History', contact: 'Contact' },
    hero: {
      eyebrow: 'Industrial machinery · Córdoba, Argentina · Since 1989',
      titleA: 'Processes', titleB: 'that don\'t', titleC: 'stop.',
      sub: 'Design, manufacturing and maintenance of specialized machinery for metallurgy, automotive and machine-tool industries.',
      ctaPrimary: 'Explore technologies', ctaSecondary: 'Get in touch',
      stat1: { v: '36', l: 'Years of operation' },
      stat2: { v: '120+', l: 'Industrial clients' },
      stat3: { v: '12', l: 'Countries reached' },
      stat4: { v: '24/7', l: 'Plant support' },
    },
    capabilities: {
      eyebrow: '[ 02 — Capabilities ]',
      title: 'Four product lines. One engineering team.',
      sub: 'Each unit is engineered around the actual production process and integrates with the existing line flow.',
    },
    tech: [
      {
        id: 'conveyors', code: 'T01', title: 'Conveyors', sub: 'Transportadores',
        img: '/img/t01-conveyors.webp',
        desc: 'Evacuation systems for metal chips, parts and waste from production lines, machining cells, transfer lines and CNC centers. Configurable as hinge, scraper, magnetic, belt, plastic chain or combined.',
        bullets: [
          { name: 'Chip transport', img: '/img/t01-chip-transport.webp', desc: 'Transport systems for all types of chips and machining processes, both individual and large-scale.', kind: 'photo' },
          { name: 'Continuous drying lines', img: '/img/t01-drying.webp', desc: 'Our continuous drying lines use special conveyor belts with micro-perforated links to separate solid and liquid parts during drying, guaranteeing the moisture reduction required by processes such as waste and parts treatment.', kind: 'photo' },
          { name: 'Centralized lines', img: '/img/t01-centralized-lines.jpg', desc: 'Multi-machine systems that evacuate chips from a whole shop floor to a single discharge point. Reduces manual handling.', kind: 'photo' },
          { name: 'Custom design', img: '/img/t01-custom.webp', desc: 'Geometry, width, height, speeds and other features designed and adapted to each process and layout.', kind: 'photo' },
        ],
      },
      {
        id: 'washing', code: 'T02', title: 'Industrial washing', sub: 'Lavado',
        img: '/img/t02-washing.webp',
        desc: 'Automatic washers for machined parts, casting and forging. From single cells to continuous lines with drying and air-knife.',
        bullets: [
          { name: 'Pass-through & rotary', img: '/img/t02-pass-through.webp', desc: 'Continuous pass-through cabins with belt or rotary table for serial production. Configurable cycle: wash, rinse, dry.', kind: 'photo' },
          { name: 'Single-cabin washer', img: '/img/t02-cabin.webp', desc: 'Special washing systems for multi-purpose manual loading and unloading.', kind: 'photo' },
          { name: 'Built-in filtration', img: '/img/t02-filtration.webp', desc: 'Belt filters, cyclones and oil skimmers that keep the bath clean and extend the working fluid\'s life.', kind: 'photo' },
          { name: 'PLC control', img: '/img/t02-plc.webp', desc: 'Cabinets with touch HMI. Software integrated into the production line and safety system tailored for Industry 4.0.', kind: 'photo' },
        ],
      },
      {
        id: 'filtration', code: 'T03', title: 'Fluids treatment', sub: 'Filtración',
        img: '/img/t03-fluids-cover.webp',
        desc: 'Coolant filtration, magnetic separation and fluid centralization. Oil recovery and responsible waste handling.',
        bullets: [
          { name: 'Belt filters', img: '/img/t02-band-filters.webp', desc: 'Gravity filtration with paper or textile cloth. Low operating cost, ideal for water-soluble coolants in machining.', kind: 'photo' },
          { name: 'Magnetic separators', img: '/video/t02-magnetic-separator.mp4', poster: '/img/t02-magnetic-separator-poster.webp', desc: 'Drums and magnetic bars that remove fine ferrous particles before the main filter. Extends consumable life.', kind: 'video' },
          { name: 'Advanced filtration', img: '/img/t03-advanced-filtration.webp', desc: 'Pumping, pressurization and tempering stations for coolant feeding multiple machines in parallel.', kind: 'photo' },
          { name: 'Oil recovery', img: '/img/conveyor-blue.avif', desc: 'Belt skimmers and coalescing separators that remove tramp oil from coolant to reuse the fluid.', kind: 'photo' },
        ],
      },
      {
        id: 'metalwork', code: 'T04', title: 'General metalwork', sub: 'Metalúrgica general',
        img: '/img/t04-metalwork-cover.webp',
        desc: 'End-to-end metalworking services: high-precision laser and plasma cutting, CNC bending and serial parts production with fast turnaround.',
        bullets: [
          { name: 'Laser cutting', img: '/img/welding-line.avif', desc: 'High-precision laser cutting services for industry, up to 12.7 mm (1/2 inch).', kind: 'photo' },
          { name: 'Plasma cutting', img: '/img/hydraulic-station.avif', desc: 'Plasma cutting services for industry, up to 25.4 mm (1 inch).', kind: 'photo' },
          { name: 'Industrial bending', img: '/img/hydraulic-station-2.avif', desc: 'CNC press brake for bends up to 3 m.', kind: 'photo' },
          { name: 'Serial production', img: '/img/gearbox-detail.avif', desc: 'Our industrial capacity, decades of experience and extensive supplier network let us produce metalworking parts in batches with fast turnaround.', kind: 'photo' },
        ],
      },
    ],
    catalogs: {
      eyebrow: '[ 03 — Downloads ]',
      title: 'Download our catalogs.',
      sub: 'Specifications, operating diagrams and available models for each line. Printable PDF.',
      items: [
        { id: 'general', title: 'General Catalog', desc: 'All three lines plus additional services (laser/plasma cutting, ovens, racks).', pages: 12, size: '9 MB', file: '/catalogs/Trans-Fil-Catalog-General-EN.pdf', color: '#3a86ff', img: '/img/catalog-general.webp' },
        { id: 'filtration', title: 'Filtration', desc: 'Centralized coolant treatment and filtration systems.', pages: 8, size: '3 MB', file: '/catalogs/Trans-Fil-Catalog-Filtration-EN.pdf', color: '#ff6b1a', img: '/img/catalog-filtration.webp' },
        { id: 'washing', title: 'Washing', desc: 'Automated washing and drying lines. Tunnel, tower, cabinet and special types.', pages: 6, size: '5 MB', file: '/catalogs/Trans-Fil-Catalog-Washing-EN.pdf', color: '#4ade80', img: '/img/catalog-washing.webp' },
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
        { code: 'S01', title: 'Repairs', desc: 'Diagnostics, spare parts and refurbishment of our own and third-party equipment.', img: '/img/gearbox-detail.avif' },
        { code: 'S02', title: 'Retrofitting', desc: 'Modernization of existing machines: PLC, automation, energy efficiency.', img: '/img/control-cabinet.avif' },
        { code: 'S03', title: 'Maintenance', desc: 'Preventive and predictive plans. Scheduled visits and ongoing remote support.', img: '/img/hydraulic-station.avif' },
        { code: 'S04', title: 'Custom engineering', desc: 'Process study, layout, simulation and mechanical design from scratch.', img: '/img/welding-line.avif' },
      ],
    },
    industries: {
      eyebrow: '[ 05 — Industries ]',
      title: 'Wherever metal is worked,', title2: 'we\'re there.',
      sub: 'Three decades integrating equipment in steel mills, automotive plants, oil & gas and machine-tool factories across Argentina and the region.',
      tabs: [
        { id: 'steel', label: 'Steel' },
        { id: 'auto', label: 'Automotive, Oil & Appliances' },
        { id: 'tools', label: 'Machine Tools' },
      ],
      coverage: [
        'Argentina', 'Brazil', 'Chile', 'Peru',
        'Bolivia', 'Uruguay', 'Colombia', 'Ecuador',
        'Mexico', 'United States', 'Dominican Rep.', 'Spain',
      ],
      hoverPause: '← HOVER TO PAUSE →',
    },
    history: {
      eyebrow: '[ 06 — History ]',
      title: 'Since 1989, from the same workshop.',
      body: 'Trans-Fil started in Córdoba as a workshop specialized in coolant filtration for the metallurgic industry. Three generations later, we still design every machine as if it were the first.',
      milestones: [
        { y: '1989', t: 'Founded', d: 'Workshop opens in Córdoba focused on industrial filtration.' },
        { y: '1998', t: 'First automotive line', d: 'Integration into Renault Argentina plant.' },
        { y: '2007', t: 'Tenaris line', d: 'Conveyor design for seamless tube line.' },
        { y: '2015', t: 'Regional expansion', d: 'Projects in Brazil, Chile, Peru and Mexico.' },
        { y: '2024', t: 'New facility', d: 'Manufacturing capacity expansion at Francisco de Arteaga 3043.' },
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
      addr: 'Francisco de Arteaga 3043, Córdoba, Argentina',
      addressLabel: 'Address',
    },
    footer: { tag: 'Specialized industrial machinery', rights: 'All rights reserved.', built: 'Trans-Fil S.R.L.' },
    chips: { established: 'EST. 1989', argentina: 'CÓRDOBA · ARGENTINA', iso: 'ISO 9001' },
    workshopActive: 'Workshop · Active',
    whatsappMessage: 'Hi, I\'m contacting you from the Trans-Fil website.',
    langSwitch: { es: 'ES', en: 'EN' },
    backToTop: 'Back to top',
  },
};
