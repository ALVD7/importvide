// Páginas SEO de IMPORTVIDE. Precios y stock provienen del catálogo real
// (tabla products de Supabase). Medidas confirmadas en fotos de producto.
// Operación 100% en línea, sin local físico. Horario: lunes a viernes 08:00-17:00.

const IMG = "/img/productos";

// Productos reales del catálogo (ids de Supabase, precios publicados en la web)
export const CATALOG = {
  clip: {
    id: "6dd12d50-8fd1-4756-8795-b4c364f90d07",
    name: "Clips para credenciales",
    price: 12.0,
    inStock: true,
    img: `${IMG}/clips-metalicos-para-credenciales-correa-vinilo.webp`,
    alt: "Clips metálicos con correa de vinilo transparente para colgar credenciales",
  },
  acrilico: {
    id: "55ef5871-3a87-4c99-a252-eb10034e1b88",
    name: "Portacredencial de acrílico",
    price: 35.0,
    inStock: true,
    img: `${IMG}/portacredencial-acrilico-rigido-vertical-cinta-naranja.webp`,
    alt: "Portacredencial de acrílico rígido vertical transparente con cinta lanyard naranja",
  },
  flexCarnet: {
    id: "67761edd-6b8e-4fbc-99da-54001a3f0514",
    name: "Portacredencial flexible tipo carnet",
    price: 17.0,
    inStock: true,
    img: `${IMG}/portacredencial-flexible-pvc-cordones-colores.webp`,
    alt: "Portacredenciales flexibles de PVC verticales con cordones azul, verde y negro",
  },
  flexEventos: {
    id: "04cb6136-f205-4fa7-bff5-288aab8a6524",
    name: "Portacredencial flexible para eventos",
    price: 24.0,
    inStock: true,
    img: `${IMG}/credenciales-para-eventos-pvc-por-mayor.webp`,
    alt: "Credenciales para eventos de PVC flexible con cordón, paquetes al por mayor",
  },
  cordones: {
    id: "c401a7d2-b3d0-4527-9616-b185a668b322",
    name: "Cordones lanyard",
    price: 27.0,
    inStock: true,
    img: `${IMG}/lanyards-cintas-verde-negro-azul-clip.webp`,
    alt: "Cintas lanyard verde, negra y azul con clip plástico para credenciales",
  },
  habEscritorio: {
    id: "d8a5f83e-16d5-4a79-b6b8-52db19d5bc2c",
    name: "Hablador de escritorio A4",
    price: 5.99,
    inStock: true,
    img: `${IMG}/hablador-acrilico-escritorio-a4-transparente.webp`,
    alt: "Hablador de escritorio acrílico A4 vertical transparente con base en L",
  },
  habT: {
    id: "702d5d15-68ba-424a-8138-3d8cc8fbb4cf",
    name: "Hablador tipo T A4",
    price: 6.7,
    inStock: true,
    img: `${IMG}/hablador-tipo-t-a4-vertical-doble-cara.webp`,
    alt: "Hablador de mesa acrílico tipo T tamaño A4 de doble cara",
  },
  caraAbierta: {
    id: "ae2d4362-a0a7-4888-b158-8f9ddfa53b41",
    name: "Portacredencial cara abierta",
    price: 20.0,
    inStock: true,
    img: `${IMG}/portacredencial-rigido-cara-abierta-colores.webp`,
    alt: "Portacredenciales rígidos de cara abierta en azul, blanco translúcido y rojo",
  },
  habPared: {
    id: "fae1562f-a397-439c-9cd3-9dd3df704e4f",
    name: "Hablador de pared A4",
    price: 3.0,
    inStock: true,
    img: `${IMG}/hablador-pared-a4-afiche-instalado.webp`,
    alt: "Hablador de pared acrílico A4 instalado con afiche publicitario",
  },
  caparazon: {
    id: "8fb078a8-d0ae-4812-bdc9-4fa26a957591",
    name: "Portacredencial tipo caparazón",
    price: 20.0,
    inStock: true,
    img: `${IMG}/portacredencial-caparazon-transparente-vertical.webp`,
    alt: "Portacredencial tipo caparazón transparente vertical de 11 x 7 cm",
  },
  desliVerde: {
    id: "db0e5685-3b22-462b-8c84-c7fb824ffb93",
    name: "Portacredencial deslizable verde",
    price: 35.0,
    inStock: true,
    img: `${IMG}/portacredencial-deslizable-verde-vertical.webp`,
    alt: "Portacredencial deslizable verde vertical para carnet de 8,5 x 5,5 cm",
  },
  desliNegro: {
    id: "f82f4976-0ca2-4ed8-9844-4226c1e10f9d",
    name: "Portacredencial deslizable negro",
    price: 35.0,
    inStock: true,
    img: `${IMG}/portacredencial-deslizable-negro-vertical.webp`,
    alt: "Portacredencial deslizable negro vertical para carnet de 8,5 x 5,5 cm",
  },
  desliAzul: {
    id: "ec4afa6b-f4eb-47c9-931f-d93a017fadf6",
    name: "Portacredencial deslizable azul",
    price: 35.0,
    inStock: true,
    img: `${IMG}/portacredencial-deslizable-azul-vertical.webp`,
    alt: "Portacredencial deslizable azul vertical para carnet de 8,5 x 5,5 cm",
  },
};

const FAQ_MAYOREO = {
  q: "¿Venden portacredenciales al por mayor?",
  a: "Sí. IMPORTVIDE es importador directo y trabajamos principalmente venta al por mayor para colegios, bancos, entidades públicas, empresas y organizadores de eventos. Mantenemos stock permanente por miles de unidades. Escríbenos por WhatsApp al +593 98 011 8073 con la cantidad que necesitas y te enviamos una cotización con precio por volumen.",
};
const FAQ_ENTREGAS = {
  q: "¿Hacen entregas en todo Ecuador?",
  a: "Sí. Operamos 100% en línea desde Guayaquil y realizamos envíos a Quito, Cuenca y todo el Ecuador. El tiempo de entrega depende del medio de envío que elijas: al cotizar por WhatsApp te confirmamos las opciones disponibles y el tiempo exacto según tu ciudad.",
};
const FAQ_PERSONALIZACION = {
  q: "¿Puedo personalizar las credenciales o cintas con mi logo?",
  a: "Consultamos cada caso: escríbenos por WhatsApp con tu diseño o logo y la cantidad requerida, y te confirmamos opciones de personalización, cantidades mínimas y tiempos de producción.",
};
const FAQ_TIEMPOS = {
  q: "¿Cuánto se demora mi pedido?",
  a: "Los productos de stock se despachan tras confirmar el pago; el tiempo de entrega depende del medio de envío elegido. Atendemos de lunes a viernes de 08:00 a 17:00; los pedidos del fin de semana se coordinan para entrega la semana siguiente. Escríbenos por WhatsApp y te confirmamos todo en la cotización.",
};
const FAQ_FACTURA = {
  q: "¿Emiten factura para empresas e instituciones?",
  a: "Sí, emitimos factura. Trabajamos con colegios, bancos, empresas privadas y entidades públicas de todo el Ecuador.",
};

export const seoPages = [
  // ── PILAR ──────────────────────────────────────────────
  {
    slug: "portacredenciales",
    title: "Portacredenciales en Ecuador — Venta por Mayor | IMPORTVIDE",
    description:
      "Portacredenciales rígidos, deslizables, de acrílico y flexibles tipo carnet. Stock por miles de unidades en Guayaquil con envío a todo Ecuador. Cotiza por WhatsApp.",
    h1: "Portacredenciales en Ecuador",
    intro: [
      "En IMPORTVIDE importamos y distribuimos portacredenciales al por mayor para colegios, bancos, empresas, entidades públicas y organizadores de eventos en todo el Ecuador. Somos importadores directos con bodega en Guayaquil, por lo que mantenemos stock permanente por miles de unidades y precios competitivos por volumen.",
      "Un portacredencial (también llamado porta carnet o porta ID) protege la credencial de tu personal o estudiantes y proyecta una imagen institucional ordenada. Elegir el modelo correcto depende del uso: no es lo mismo un carnet que se usa a diario en un banco que una credencial de un evento de tres días.",
    ],
    sections: [
      {
        h2: "Tipos de portacredenciales que manejamos",
        paras: [
          "Nuestro catálogo cubre los formatos más pedidos por instituciones ecuatorianas:",
        ],
        bullets: [
          "Portacredencial deslizable (11 × 7 cm, para carnet de 8,5 × 5,5 cm): cuerpo plástico rígido con mecanismo deslizante que protege la credencial por ambas caras. Disponible en azul, negro y verde.",
          "Portacredencial tipo caparazón (11 × 7 cm): carcasa rígida transparente que deja visible el carnet completo. Ideal para uso diario intensivo.",
          "Portacredencial rígido de cara abierta: plástico resistente con frente abierto para acceso rápido a la tarjeta (lectores de proximidad). Colores azul, blanco translúcido y rojo.",
          "Portacredencial de acrílico: cristalino y elegante, pensado para imagen corporativa premium.",
          "Portacredencial flexible tipo carnet: funda de PVC en 6 × 9 cm (vertical) o 9 × 6 cm (horizontal), la opción más económica para volúmenes grandes.",
        ],
      },
      {
        h2: "Precios por volumen y disponibilidad",
        paras: [
          "Los precios publicados en nuestro catálogo en línea son referenciales; para compras institucionales el descuento por volumen se negocia directamente con el encargado de ventas por WhatsApp, según la cantidad. Mantenemos inventario real —más de 40.000 unidades solo en el modelo caparazón— para abastecer pedidos grandes sin esperas de importación.",
          "Complementa tu pedido con cordones lanyard en verde, negro o azul y clips metálicos con correa de vinilo, que también tenemos en stock.",
        ],
      },
      {
        h2: "¿Por qué comprar a un importador directo?",
        paras: [
          "Al comprar directamente al importador evitas intermediarios: mejor precio unitario, stock disponible de inmediato y reposición garantizada del mismo modelo para tus siguientes pedidos. Atendemos desde Guayaquil con envíos a Quito y todo el país.",
        ],
      },
    ],
    products: ["desliAzul", "caparazon", "caraAbierta", "acrilico", "flexCarnet", "cordones"],
    gallery: [
      { src: `${IMG}/portacredencial-deslizable-azul-medidas-11x7cm.webp`, alt: "Medidas del portacredencial deslizable: 11 x 7 cm exterior, carnet de 8,5 x 5,5 cm" },
      { src: `${IMG}/portacredencial-cara-abierta-paquetes-mayor.webp`, alt: "Paquetes de portacredenciales rígidos de cara abierta al por mayor" },
      { src: `${IMG}/funda-portacarnet-pvc-medidas-6x9-9x6.webp`, alt: "Medidas de fundas portacarnet de PVC: vertical 6 x 9 cm y horizontal 9 x 6 cm" },
    ],
    faqs: [FAQ_MAYOREO, FAQ_ENTREGAS, FAQ_PERSONALIZACION, FAQ_TIEMPOS, FAQ_FACTURA],
    related: [
      { to: "/portacredenciales-guayaquil", label: "Portacredenciales en Guayaquil" },
      { to: "/portacredenciales-quito", label: "Portacredenciales en Quito" },
      { to: "/lanyards-ecuador", label: "Lanyards y cintas portacredenciales" },
      { to: "/credenciales-para-eventos", label: "Credenciales para eventos" },
    ],
  },

  // ── CIUDAD: GUAYAQUIL ──────────────────────────────────
  {
    slug: "portacredenciales-guayaquil",
    title: "Portacredenciales en Guayaquil — Entrega Inmediata | IMPORTVIDE",
    description:
      "Compra portacredenciales en Guayaquil directo al importador: deslizables, caparazón, cara abierta y fundas PVC. Stock local y entrega rápida. Cotiza por WhatsApp.",
    h1: "Portacredenciales en Guayaquil",
    intro: [
      "¿Buscas portacredenciales en Guayaquil con entrega rápida? IMPORTVIDE tiene su bodega en la ciudad, así que tu pedido no depende de tiempos de importación ni de envíos desde otras provincias: el stock está aquí, listo para despachar al confirmar tu pedido.",
      "Atendemos a colegios y unidades educativas, bancos y cooperativas, hospitales, empresas privadas y entidades públicas de Guayaquil y toda la provincia del Guayas que necesitan identificar a su personal, estudiantes o visitantes.",
    ],
    sections: [
      {
        h2: "Stock disponible en Guayaquil",
        paras: [
          "Mantenemos inventario permanente por miles de unidades de los modelos más usados por instituciones:",
        ],
        bullets: [
          "Deslizables en azul, negro y verde (11 × 7 cm, para carnet estándar de 8,5 × 5,5 cm).",
          "Tipo caparazón transparente: nuestro modelo con mayor stock (más de 40.000 unidades).",
          "Rígidos de cara abierta en azul, blanco y rojo, ideales para tarjetas de proximidad.",
          "Fundas flexibles de PVC tipo carnet en formato vertical (6 × 9 cm) y horizontal (9 × 6 cm).",
          "Cordones lanyard y clips metálicos para completar el kit de identificación.",
        ],
      },
      {
        h2: "Ventajas de comprar en Guayaquil directo al importador",
        paras: [
          "Comprar localmente al importador significa precio de primera mano, entrega rápida dentro de la ciudad y reposición inmediata cuando ingresa personal nuevo. Si tu institución maneja compras recurrentes, te conviene un proveedor con bodega en la ciudad y stock estable del mismo modelo.",
          "Para compras al por mayor, el descuento se negocia directamente con el encargado de ventas por WhatsApp según la cantidad. Emitimos factura y trabajamos con procesos de compra institucionales.",
        ],
      },
      {
        h2: "¿Cómo cotizar?",
        paras: [
          "Escríbenos por WhatsApp al +593 98 011 8073 indicando modelo, color y cantidad. Te respondemos con disponibilidad exacta, precio por volumen y tiempo de entrega en Guayaquil. También puedes visitar nuestro catálogo en línea y consultar directamente desde cada producto.",
        ],
      },
    ],
    products: ["desliNegro", "caparazon", "caraAbierta", "flexCarnet"],
    gallery: [
      { src: `${IMG}/portacredencial-deslizable-negro-cordon.webp`, alt: "Portacredencial deslizable negro con cordón lanyard, disponible en Guayaquil" },
      { src: `${IMG}/portacredencial-cara-abierta-azul-por-mayor.webp`, alt: "Lote de portacredenciales cara abierta azules al por mayor en bodega de Guayaquil" },
    ],
    faqs: [
      {
        q: "¿Tienen local o bodega en Guayaquil?",
        a: "Nuestra operación está en Guayaquil, pero trabajamos 100% en línea, sin local de atención al público. Todas las ventas y entregas se coordinan por WhatsApp de lunes a viernes de 08:00 a 17:00.",
      },
      FAQ_MAYOREO,
      {
        q: "¿En cuánto tiempo entregan dentro de Guayaquil?",
        a: "Para productos en stock, el despacho se coordina de inmediato tras confirmar el pedido; el tiempo exacto depende del medio de entrega que acordemos por WhatsApp.",
      },
      FAQ_PERSONALIZACION,
      FAQ_FACTURA,
    ],
    related: [
      { to: "/portacredenciales", label: "Ver todos los portacredenciales" },
      { to: "/portacredenciales-quito", label: "Portacredenciales en Quito" },
      { to: "/lanyards-ecuador", label: "Lanyards y cordones" },
      { to: "/habladores-acrilicos", label: "Habladores acrílicos" },
    ],
  },

  // ── CIUDAD: QUITO ──────────────────────────────────────
  {
    slug: "portacredenciales-quito",
    title: "Portacredenciales en Quito — Envío a Domicilio | IMPORTVIDE",
    description:
      "Portacredenciales para empresas e instituciones de Quito: deslizables, rígidos y fundas PVC con envío por courier a todo Pichincha. Cotiza por WhatsApp.",
    h1: "Portacredenciales en Quito",
    intro: [
      "Si tu empresa o institución está en Quito y necesita portacredenciales al por mayor, IMPORTVIDE te los envía directamente desde su bodega de importación en Guayaquil. Despachamos por courier a Quito y todo Pichincha; el tiempo de entrega depende del medio de envío y te lo confirmamos al cotizar.",
      "Trabajamos con ministerios y entidades públicas, bancos, universidades, colegios y organizadores de congresos y ferias en la capital. Al comprar al importador directo, obtienes mejor precio que en distribuidores locales y garantía de reposición del mismo modelo.",
    ],
    sections: [
      {
        h2: "Modelos más pedidos por instituciones de Quito",
        paras: [
          "Estos son los formatos que más despachamos a la capital:",
        ],
        bullets: [
          "Portacredencial deslizable (azul, negro o verde): protección total del carnet de 8,5 × 5,5 cm, el preferido de bancos y entidades públicas.",
          "Portacredencial tipo caparazón transparente: rígido y económico para dotaciones grandes de personal.",
          "Portacredencial de cara abierta: acceso rápido a la tarjeta, compatible con controles de acceso por proximidad.",
          "Fundas flexibles de PVC (6 × 9 cm y 9 × 6 cm): la opción más económica para congresos y eventos masivos.",
          "Cordones lanyard en verde, negro y azul con clip plástico.",
        ],
      },
      {
        h2: "Compra corporativa e institucional",
        paras: [
          "Cotizamos por volumen con factura: indícanos modelo, cantidad y datos de facturación por WhatsApp (+593 98 011 8073) y recibirás la proforma el mismo día hábil. Para licitaciones o compras públicas podemos confirmar stock por escrito antes de tu proceso.",
          "El pago se coordina por transferencia bancaria y el envío llega a tu oficina en Quito por courier con guía de rastreo.",
        ],
      },
      {
        h2: "¿Evento en Quito?",
        paras: [
          "Si organizas un congreso, feria o seminario en Quito, revisa también nuestras credenciales flexibles para eventos y cordones al por mayor: mantenemos miles de unidades listas para despacho inmediato, sin mínimos de importación.",
        ],
      },
    ],
    products: ["desliVerde", "desliAzul", "caparazon", "flexEventos"],
    gallery: [
      { src: `${IMG}/portacredencial-deslizable-verde-anverso-reverso.webp`, alt: "Portacredencial deslizable verde, anverso y reverso con carnet de muestra" },
      { src: `${IMG}/cordones-lanyard-azul-por-mayor.webp`, alt: "Cordones lanyard azules al por mayor listos para envío a Quito" },
    ],
    faqs: [
      {
        q: "¿Hacen envíos a Quito?",
        a: "Sí, enviamos a Quito y todo Pichincha por courier con guía de rastreo. El tiempo de entrega depende del medio de envío elegido y se confirma al momento de cotizar por WhatsApp.",
      },
      FAQ_MAYOREO,
      {
        q: "¿Cuál es el costo del envío a Quito?",
        a: "Depende del volumen del pedido y del medio de envío elegido; se confirma en la cotización por WhatsApp junto con el tiempo de entrega.",
      },
      FAQ_PERSONALIZACION,
      FAQ_TIEMPOS,
    ],
    related: [
      { to: "/portacredenciales", label: "Ver todos los portacredenciales" },
      { to: "/portacredenciales-guayaquil", label: "Portacredenciales en Guayaquil" },
      { to: "/credenciales-para-eventos", label: "Credenciales para eventos" },
      { to: "/lanyards-ecuador", label: "Lanyards Ecuador" },
    ],
  },

  // ── LANYARDS ───────────────────────────────────────────
  {
    slug: "lanyards-ecuador",
    title: "Lanyards y Cintas Portacredenciales en Ecuador | IMPORTVIDE",
    description:
      "Cordones lanyard y cintas portacredenciales al por mayor en Ecuador: verde, negro y azul con clip plástico. Más de 20.000 unidades en stock. Cotiza por WhatsApp.",
    h1: "Lanyards y cintas portacredenciales en Ecuador",
    intro: [
      "Los lanyards —también llamados cintas portacredenciales o cordones para carnet— son el complemento indispensable de cualquier sistema de identificación. En IMPORTVIDE los importamos al por mayor y mantenemos más de 20.000 unidades en stock en Guayaquil, listas para despachar a todo el Ecuador.",
      "Manejamos cordones de cinta con terminación en clip plástico blanco, disponibles en verde, negro y azul, compatibles con todos nuestros portacredenciales: deslizables, caparazón, cara abierta y fundas flexibles de PVC.",
    ],
    sections: [
      {
        h2: "Características de nuestros lanyards",
        paras: ["Cordones pensados para uso institucional diario:"],
        bullets: [
          "Cinta textil resistente con costura reforzada.",
          "Clip plástico blanco de enganche rápido: la credencial se coloca y retira en segundos.",
          "Colores disponibles en stock: verde, negro y azul.",
          "Compatibles con portacredenciales rígidos, deslizables y fundas de PVC.",
          "Venta al por mayor: el precio por volumen se negocia directamente por WhatsApp según la cantidad.",
        ],
      },
      {
        h2: "¿Quiénes los usan?",
        paras: [
          "Colegios y universidades para carnets estudiantiles, bancos y cooperativas para identificación del personal, hospitales y clínicas, empresas con control de acceso, y organizadores de eventos que necesitan cientos de credenciales colgadas de forma uniforme. Si tu equipo usa uniforme institucional, elegir el color correcto del cordón refuerza la imagen corporativa.",
          "¿Necesitas lanyards personalizados con el logo de tu institución? Escríbenos con tu diseño y cantidad: te confirmamos opciones de personalización, cantidad mínima y tiempo de producción.",
        ],
      },
      {
        h2: "Arma tu kit de identificación completo",
        paras: [
          "Combina los cordones con el portacredencial adecuado y ahorra en un solo pedido: fundas flexibles de PVC para eventos, portacredenciales deslizables para uso diario o clips metálicos con correa de vinilo si tu personal prefiere llevar la credencial en el bolsillo. Todo sale de la misma bodega en un solo envío.",
        ],
      },
    ],
    products: ["cordones", "clip", "flexCarnet", "flexEventos"],
    gallery: [
      { src: `${IMG}/cordones-lanyard-verde-por-mayor.webp`, alt: "Lote de lanyards verdes con clip plástico, venta al por mayor en Ecuador" },
      { src: `${IMG}/cordones-lanyard-negro-por-mayor.webp`, alt: "Cordones lanyard negros al por mayor para credenciales" },
      { src: `${IMG}/cordones-lanyard-azul-por-mayor.webp`, alt: "Cintas portacredenciales azules con clip, stock por mayor" },
    ],
    faqs: [
      {
        q: "¿Qué colores de lanyards tienen en stock?",
        a: "Mantenemos stock permanente en verde, negro y azul, con clip plástico blanco. Para otros colores o cintas personalizadas con logo, consúltanos cantidades mínimas y tiempos por WhatsApp.",
      },
      FAQ_MAYOREO,
      FAQ_ENTREGAS,
      FAQ_PERSONALIZACION,
    ],
    related: [
      { to: "/portacredenciales", label: "Portacredenciales" },
      { to: "/credenciales-para-eventos", label: "Credenciales para eventos" },
      { to: "/portacredenciales-guayaquil", label: "Portacredenciales Guayaquil" },
      { to: "/portacredenciales-quito", label: "Portacredenciales Quito" },
    ],
  },

  // ── HABLADORES ─────────────────────────────────────────
  {
    slug: "habladores-acrilicos",
    title: "Habladores Acrílicos y Exhibidores en Ecuador | IMPORTVIDE",
    description:
      "Habladores acrílicos de mesa, escritorio y pared tamaño A4 desde $3,00. Exhibidores y porta precios de acrílico con stock en Guayaquil. Cotiza por WhatsApp.",
    h1: "Habladores acrílicos y exhibidores en Ecuador",
    intro: [
      "Los habladores acrílicos (también conocidos como exhibidores acrílicos, porta afiches o porta precios) son la forma más profesional de mostrar menús, precios, promociones e información en mostradores, mesas y paredes. En IMPORTVIDE los importamos y vendemos con stock en Guayaquil y envío a todo el Ecuador.",
      "Trabajamos con restaurantes y cafeterías, hoteles, bancos (señalización de ventanillas), farmacias, retail y organizadores de eventos que necesitan señalizar espacios con una imagen limpia y durable.",
    ],
    sections: [
      {
        h2: "Modelos disponibles en tamaño A4",
        paras: ["Tres formatos cubren la mayoría de usos en punto de venta:"],
        bullets: [
          "Hablador tipo T A4 — $6,70 c/u: de mesa, doble cara, con inserción lateral de la lámina. Perfecto para menús y promociones que se ven desde ambos lados. Disponible en vertical y horizontal.",
          "Hablador de escritorio A4 — $5,99 c/u: base en L con ligera inclinación, ideal para mostradores, recepciones y ventanillas.",
          "Hablador de pared A4 — $3,00 c/u: se fija a la pared y permite cambiar el afiche en segundos. La opción más económica para señalización permanente.",
        ],
      },
      {
        h2: "Ventajas del acrílico frente a otros materiales",
        paras: [
          "El acrílico transparente deja todo el protagonismo al contenido impreso, no se oxida ni amarillenta como otros plásticos económicos, se limpia con un paño húmedo y resiste el uso diario en ambientes de alto tráfico. Cambiar la información es tan simple como reemplazar la hoja A4 impresa: no necesitas reimprimir señalización rígida cada vez que cambia un precio o promoción.",
          "Para cadenas y franquicias que necesitan equipar varios locales, cotizamos por volumen: el descuento se negocia directamente con el encargado de ventas por WhatsApp según la cantidad de tu pedido.",
        ],
      },
      {
        h2: "¿Cómo elegir el hablador correcto?",
        paras: [
          "Si el cliente ve la pieza desde ambos lados (mesas de restaurante, mostradores centrales), elige el tipo T de doble cara. Si va sobre un mostrador contra la pared o en recepción, el de escritorio con base en L es más estable y económico. Para información permanente en pasillos, ascensores o puertas, el de pared es la solución de menor costo. ¿Dudas? Envíanos una foto del espacio por WhatsApp y te recomendamos el modelo.",
        ],
      },
    ],
    products: ["habT", "habEscritorio", "habPared"],
    gallery: [
      { src: `${IMG}/hablador-tipo-t-a4-horizontal-acrilico.webp`, alt: "Hablador acrílico tipo T A4 horizontal con afiche, inserción lateral" },
      { src: `${IMG}/hablador-mesa-acrilico-menu-cafeteria.webp`, alt: "Hablador de mesa acrílico A4 exhibiendo menú en cafetería" },
      { src: `${IMG}/hablador-pared-a4-afiche-instalado.webp`, alt: "Hablador de pared acrílico A4 con afiche instalado" },
      { src: `${IMG}/hablador-acrilico-escritorio-perfil-lateral.webp`, alt: "Perfil lateral del hablador de escritorio acrílico con base en L" },
    ],
    faqs: [
      {
        q: "¿Venden habladores acrílicos al por mayor?",
        a: "Sí, es nuestro fuerte. Cotizamos por volumen para restaurantes, cadenas, bancos y eventos. Los precios unitarios de catálogo son $6,70 (tipo T A4), $5,99 (escritorio A4) y $3,00 (pared A4); por cantidad aplican descuentos que se negocian directamente con el encargado de ventas por WhatsApp.",
      },
      {
        q: "¿Tienen otros tamaños además de A4?",
        a: "El stock permanente es en tamaño A4. Si necesitas A5, A6 u otro formato, consúltanos disponibilidad y tiempos de importación por WhatsApp.",
      },
      FAQ_ENTREGAS,
      FAQ_TIEMPOS,
      FAQ_FACTURA,
    ],
    related: [
      { to: "/portacredenciales", label: "Portacredenciales" },
      { to: "/lanyards-ecuador", label: "Lanyards y cordones" },
      { to: "/portacredenciales-guayaquil", label: "Productos en Guayaquil" },
      { to: "/credenciales-para-eventos", label: "Credenciales para eventos" },
    ],
  },

  // ── VERTICAL: EVENTOS ──────────────────────────────────
  {
    slug: "credenciales-para-eventos",
    title: "Credenciales para Eventos en Ecuador — Staff y Prensa | IMPORTVIDE",
    description:
      "Credenciales PVC flexibles para congresos, ferias y conciertos: staff, prensa y organizadores. Con cordones de colores y stock por miles. Cotiza por WhatsApp.",
    h1: "Credenciales para eventos en Ecuador",
    intro: [
      "Organizar un congreso, feria, concierto o seminario implica identificar a cientos de personas en pocos días: staff, prensa, organizadores, expositores y asistentes. En IMPORTVIDE tenemos las credenciales para eventos que necesitas, con stock por miles de unidades en Guayaquil y despacho inmediato a todo el Ecuador.",
      "Nuestra credencial flexible para eventos es una funda de PVC transparente resistente que protege la acreditación impresa y se cuelga con cordón lanyard. El asistente la recibe lista en el registro y la lleva visible durante todo el evento.",
    ],
    sections: [
      {
        h2: "El kit completo para tu acreditación",
        paras: ["Todo sale de una sola bodega, en un solo pedido:"],
        bullets: [
          "Credencial flexible para eventos (funda PVC): formato amplio para acreditaciones impresas con nombre, cargo y código QR.",
          "Cordones lanyard en verde, negro y azul: usa un color por tipo de acceso (staff, prensa, VIP) para control visual inmediato.",
          "Portacredencial flexible tipo carnet (6 × 9 cm): alternativa compacta para eventos corporativos.",
          "Clips metálicos con correa: para quienes prefieren enganchar la credencial al bolsillo.",
        ],
      },
      {
        h2: "¿Por qué los organizadores nos eligen?",
        paras: [
          "Porque los eventos no esperan: si el congreso es el viernes, las credenciales deben llegar antes. Al ser importadores con stock local, despachamos de inmediato sin mínimos de importación ni esperas de tránsito internacional. Un pedido típico de evento (200 a 2.000 credenciales con cordones) se cotiza el mismo día por WhatsApp y se despacha al confirmar el pago.",
          "La funda es reutilizable: si organizas eventos recurrentes, tu inversión sirve para las siguientes ediciones cambiando solo la acreditación impresa.",
        ],
      },
      {
        h2: "Colores por tipo de acceso",
        paras: [
          "Un truco de acreditación profesional: asigna un color de cordón por perfil (por ejemplo, azul para staff, negro para prensa, verde para expositores). El personal de seguridad identifica cada perfil de un vistazo sin leer la credencial. Con nuestros tres colores en stock puedes montar este sistema sin costo adicional.",
        ],
      },
    ],
    products: ["flexEventos", "cordones", "flexCarnet", "clip"],
    gallery: [
      { src: `${IMG}/credencial-evento-staff-prensa-cordon.webp`, alt: "Credenciales de evento para staff, prensa y organizadores con cordones" },
      { src: `${IMG}/credenciales-eventos-personalizadas-cordones.webp`, alt: "Credenciales de eventos personalizadas con cordones verde, negro y azul" },
      { src: `${IMG}/credencial-evento-flexible-pvc-mano.webp`, alt: "Credencial de evento de PVC flexible, material resistente y liviano" },
    ],
    faqs: [
      {
        q: "Necesito credenciales para un evento este mes, ¿llegan a tiempo?",
        a: "Sí, siempre que haya stock (mantenemos miles de unidades). El despacho se hace al confirmar el pago y el tiempo de entrega depende del medio de envío. Escríbenos por WhatsApp con la fecha del evento y coordinamos para que llegue a tiempo.",
      },
      FAQ_MAYOREO,
      {
        q: "¿Imprimen también las acreditaciones con los datos de los asistentes?",
        a: "Nuestro fuerte es el insumo físico (fundas, cordones y clips). Sobre impresión de acreditaciones, consúltanos tu caso por WhatsApp.",
      },
      FAQ_PERSONALIZACION,
    ],
    related: [
      { to: "/lanyards-ecuador", label: "Lanyards y cintas de colores" },
      { to: "/portacredenciales", label: "Portacredenciales" },
      { to: "/portacredenciales-quito", label: "Envíos a Quito" },
      { to: "/habladores-acrilicos", label: "Habladores para señalizar tu evento" },
    ],
  },

  // ── VERTICAL: COLEGIOS ─────────────────────────────────
  {
    slug: "portacredenciales-para-colegios",
    title: "Portacredenciales para Colegios y Estudiantes | IMPORTVIDE Ecuador",
    description:
      "Porta carnets estudiantiles resistentes para colegios y universidades: fundas PVC, rígidos de colores y cordones. Precios por volumen para instituciones educativas.",
    h1: "Portacredenciales para colegios y estudiantes",
    intro: [
      "Los carnets estudiantiles viven una vida dura: mochilas, recreos, lluvia y uso diario durante todo el año lectivo. En IMPORTVIDE proveemos a colegios, escuelas y universidades del Ecuador portacredenciales resistentes que protegen el carnet del estudiante desde la matrícula hasta el fin de año.",
      "Somos importadores directos con bodega en Guayaquil: manejamos los volúmenes que una institución educativa necesita (cientos o miles de unidades por año lectivo) con precio por volumen y reposición garantizada del mismo modelo para estudiantes nuevos.",
    ],
    sections: [
      {
        h2: "Opciones recomendadas para uso estudiantil",
        paras: ["Según edad de los estudiantes y presupuesto de la institución:"],
        bullets: [
          "Funda flexible de PVC tipo carnet (6 × 9 cm vertical o 9 × 6 cm horizontal): la opción más económica para dotar a todo el alumnado.",
          "Portacredencial rígido de cara abierta (azul, blanco o rojo): mayor protección y colores que pueden coincidir con los de la institución.",
          "Portacredencial tipo caparazón transparente: carcasa rígida que soporta el trato de los más pequeños; nuestro modelo con mayor stock.",
          "Cordones lanyard en verde, negro o azul, a juego con el uniforme.",
        ],
      },
      {
        h2: "Un color por nivel o jornada",
        paras: [
          "Muchas instituciones asignan un color de portacredencial o cordón por nivel (inicial, básica, bachillerato) o por jornada. El personal de la puerta identifica al estudiante de un vistazo y el control de ingreso se agiliza. Con nuestros colores en stock (azul, rojo, blanco, verde y negro entre portas y cordones) puedes montar este sistema sin sobrecostos.",
        ],
      },
      {
        h2: "Cotización para instituciones educativas",
        paras: [
          "Envíanos por WhatsApp (+593 98 011 8073) el número de estudiantes y el modelo que te interesa: te preparamos una proforma con precio por volumen (negociado según la cantidad) y factura a nombre de la institución. Atendemos de lunes a viernes de 08:00 a 17:00 y enviamos a todo el país; el tiempo de entrega depende del medio de envío elegido.",
        ],
      },
    ],
    products: ["flexCarnet", "caraAbierta", "caparazon", "cordones"],
    gallery: [
      { src: `${IMG}/portacredencial-flexible-tipo-carnet-cordon.webp`, alt: "Portacredenciales flexibles tipo carnet con cordones de colores para estudiantes" },
      { src: `${IMG}/portacredencial-cara-abierta-rojo-vertical.webp`, alt: "Portacredencial rígido rojo de cara abierta para carnet estudiantil" },
      { src: `${IMG}/portacredencial-caparazon-anverso-reverso.webp`, alt: "Portacredencial tipo caparazón, anverso y reverso con carnet" },
    ],
    faqs: [
      {
        q: "¿Cuál es el portacredencial más resistente para niños?",
        a: "El tipo caparazón: es una carcasa rígida transparente que protege el carnet por ambas caras y soporta caídas y manipulación diaria. Para presupuestos ajustados, la funda de PVC flexible es la alternativa económica y también protege de agua y roce.",
      },
      FAQ_MAYOREO,
      {
        q: "¿Pueden abastecer a un colegio de más de 1.000 estudiantes?",
        a: "Sí. Mantenemos stock por miles de unidades (solo del modelo caparazón hay más de 40.000) precisamente para dotaciones institucionales completas, con reposición del mismo modelo durante el año lectivo.",
      },
      FAQ_ENTREGAS,
      FAQ_FACTURA,
    ],
    related: [
      { to: "/portacredenciales", label: "Todos los portacredenciales" },
      { to: "/lanyards-ecuador", label: "Cordones para carnets" },
      { to: "/portacredenciales-para-empresas", label: "Portacredenciales para empresas" },
      { to: "/portacredenciales-guayaquil", label: "Stock en Guayaquil" },
    ],
  },

  // ── VERTICAL: EMPRESAS / BANCOS ────────────────────────
  {
    slug: "portacredenciales-para-empresas",
    title: "Portacredenciales para Empresas y Bancos | IMPORTVIDE Ecuador",
    description:
      "Identificación corporativa: portacredenciales deslizables, de acrílico y cara abierta para bancos, empresas y entidades públicas. Cotización con factura.",
    h1: "Portacredenciales para empresas y bancos",
    intro: [
      "La credencial del personal es parte de la imagen de tu empresa: un banco, una aseguradora o una entidad pública no pueden llevar el carnet en una funda deteriorada. En IMPORTVIDE proveemos portacredenciales corporativos a empresas privadas, instituciones financieras y entidades del sector público en todo el Ecuador.",
      "Manejamos formatos pensados para uso profesional diario, compatibles con el carnet corporativo estándar de 8,5 × 5,5 cm y con tarjetas de proximidad para control de acceso.",
    ],
    sections: [
      {
        h2: "Formatos corporativos disponibles",
        paras: ["Los tres modelos que más piden las áreas de talento humano y seguridad:"],
        bullets: [
          "Portacredencial deslizable (azul, negro o verde): cuerpo rígido de 11 × 7 cm con mecanismo deslizante; protege la credencial por ambas caras y proyecta imagen ejecutiva. El negro es el clásico corporativo.",
          "Portacredencial de acrílico transparente: acabado cristalino premium para gerencias, atención al cliente y personal de imagen.",
          "Portacredencial de cara abierta: frente descubierto para usar la tarjeta en lectores de proximidad sin sacarla del porta; clave para edificios con torniquetes o control de acceso.",
        ],
      },
      {
        h2: "Compras corporativas con factura",
        paras: [
          "Cotizamos dotaciones completas con factura; el precio por volumen se negocia directamente con el encargado de ventas por WhatsApp. Para áreas de compras y proveeduría podemos confirmar stock por escrito y sostener el mismo modelo en el tiempo, de modo que las reposiciones por ingreso de personal no generen credenciales mezcladas de distintos formatos.",
          "Completa el kit con cordones lanyard en el color de tu marca (verde, negro o azul en stock) o clips metálicos con correa de vinilo para quienes usan la credencial en el bolsillo de la camisa.",
        ],
      },
      {
        h2: "¿Control de acceso por proximidad?",
        paras: [
          "Si tu edificio usa tarjetas RFID/proximidad, elige el modelo de cara abierta: el colaborador acerca la credencial al lector sin retirarla del portacredencial, lo que reduce el desgaste y la pérdida de tarjetas. Lo tenemos en azul, blanco translúcido y rojo, con más de 25.000 unidades en stock.",
        ],
      },
    ],
    products: ["desliNegro", "acrilico", "caraAbierta", "clip"],
    gallery: [
      { src: `${IMG}/portacredencial-deslizable-negro-anverso-reverso.webp`, alt: "Portacredencial deslizable negro corporativo, anverso y reverso" },
      { src: `${IMG}/portacredencial-acrilico-transparente-carnet-vertical.webp`, alt: "Portacredencial de acrílico transparente premium con carnet corporativo" },
      { src: `${IMG}/portacredencial-cara-abierta-blanco-translucido.webp`, alt: "Portacredencial de cara abierta blanco translúcido para tarjetas de proximidad" },
    ],
    faqs: [
      {
        q: "¿Qué modelo recomiendan para un banco o institución financiera?",
        a: "El deslizable negro es el estándar corporativo: protege la credencial por ambas caras, se ve profesional y resiste el uso diario. Si el personal usa tarjetas de proximidad para puertas y torniquetes, combínalo con el modelo de cara abierta para las áreas operativas.",
      },
      FAQ_MAYOREO,
      FAQ_FACTURA,
      {
        q: "¿Pueden mantener el mismo modelo para reposiciones futuras?",
        a: "Sí. Al ser importadores directos, reponemos los mismos modelos de forma continua, para que las credenciales de personal nuevo sean idénticas a las existentes.",
      },
      FAQ_ENTREGAS,
    ],
    related: [
      { to: "/portacredenciales", label: "Todos los portacredenciales" },
      { to: "/portacredenciales-quito", label: "Entrega en Quito" },
      { to: "/portacredenciales-guayaquil", label: "Entrega en Guayaquil" },
      { to: "/habladores-acrilicos", label: "Señalización acrílica para oficinas" },
    ],
  },
];

export function getSeoPage(slug) {
  return seoPages.find((p) => p.slug === slug);
}
