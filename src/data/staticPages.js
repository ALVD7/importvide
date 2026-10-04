// Metadatos de las páginas que no son landings de producto. Los usan tanto los
// componentes React como el prerender (scripts/prerender.mjs) y el sitemap,
// para que título, descripción y H1 sean idénticos en ambos lados.
import { seoPages } from "./seoPages.js";
import { BUSINESS } from "./business.js";

export const STATIC_PAGES = {
  cotizar: {
    path: "/cotizar",
    title: "Cotizar Portacredenciales, Cordones y Acrílicos | IMPORTVIDE",
    description:
      "Pide tu cotización de portacredenciales, cordones o soportes acrílicos al por mayor. Respuesta por WhatsApp en horario laboral. Envíos a todo Ecuador.",
    h1: "Cotiza tu pedido",
  },
  contacto: {
    path: "/contacto",
    title: "Contacto y Cotizaciones en Guayaquil | IMPORTVIDE",
    description:
      "Escríbenos por WhatsApp al +593 98 011 8073, lunes a viernes de 08:00 a 17:00. Operamos en línea desde Guayaquil con envíos a todo Ecuador.",
    h1: "Contacto",
  },
  faq: {
    path: "/preguntas-frecuentes",
    title: "Preguntas Frecuentes: Pedidos, Envíos y Factura | IMPORTVIDE",
    description:
      "Cómo cotizar, precios por volumen, envíos a todo Ecuador, factura, personalización y devoluciones de portacredenciales, cordones y acrílicos.",
    h1: "Preguntas frecuentes",
  },
  privacidad: {
    path: "/privacidad",
    title: "Política de Privacidad y Cookies | IMPORTVIDE",
    description:
      "Qué datos recoge IMPORTVIDE al cotizar, para qué los usa, cuánto tiempo los guarda y cómo ejercer tus derechos según la LOPDP del Ecuador.",
    h1: "Política de privacidad y cookies",
  },
  politicas: {
    path: "/politicas",
    title: "Política de Devoluciones | IMPORTVIDE",
    description:
      "Cuándo aplica una solución por pedido perdido o producto dañado, y cómo reportarlo por WhatsApp dentro de las 48 horas de recibido.",
    h1: "Política de Devoluciones",
  },
};

// ── Preguntas frecuentes ─────────────────────────────────────────────────
// Se reutilizan las respuestas ya publicadas en las landings (misma fuente de
// verdad); solo las de "Cómo comprar" se escriben aquí.
const todas = seoPages.flatMap((p) => p.faqs);
const pick = (q) => {
  const faq = todas.find((f) => f.q === q);
  if (!faq) throw new Error(`Pregunta frecuente no encontrada: ${q}`);
  return faq;
};

export const FAQ_GROUPS = [
  {
    title: "Cómo comprar",
    faqs: [
      {
        q: "¿Cómo hago un pedido?",
        a: `No hay compra en línea: la cotización y el pedido se cierran por WhatsApp al ${BUSINESS.phoneDisplay} o con el formulario de cotización de la web. Indícanos producto, modelo, color y cantidad, y te respondemos con disponibilidad, precio por volumen y opciones de envío. Atendemos ${BUSINESS.hours.label.toLowerCase()}.`,
      },
      {
        q: "¿Los precios de la web son finales?",
        a: "Los precios publicados son referenciales. Para compras al por mayor, el descuento por volumen se negocia directamente con el encargado de ventas según la cantidad.",
      },
      {
        q: "¿Cómo se paga?",
        a: "El pago se coordina por transferencia bancaria al confirmar la cotización. Los productos en stock se despachan tras confirmar el pago.",
      },
      pick("¿Venden portacredenciales al por mayor?"),
      pick("¿Emiten factura para empresas e instituciones?"),
    ],
  },
  {
    title: "Envíos y entregas",
    faqs: [
      pick("¿Hacen entregas en todo Ecuador?"),
      pick("¿Cuánto se demora mi pedido?"),
      pick("¿Tienen local o bodega en Guayaquil?"),
      pick("¿Hacen envíos a Quito?"),
    ],
  },
  {
    title: "Personalización",
    faqs: [
      pick("¿Puedo personalizar las credenciales o cintas con mi logo?"),
      pick("¿Pueden poner el logo de mi institución en los cordones?"),
    ],
  },
  {
    title: "Productos",
    faqs: [
      pick("¿Cuál es el portacredencial más resistente para niños?"),
      pick("¿Qué modelo recomiendan para un banco o institución financiera?"),
      pick("¿Qué colores de cordones tienen en stock?"),
      pick("¿Qué diferencia hay entre el hablador de escritorio y el tipo T?"),
      pick("¿Tienen otros tamaños además de A4?"),
    ],
  },
  {
    title: "Devoluciones",
    faqs: [
      {
        q: "¿Aceptan devoluciones?",
        a: "Por la naturaleza de las importaciones no hacemos devoluciones ni reembolsos una vez despachado el pedido, salvo si se pierde en tránsito o llega totalmente dañado o con un daño significativo. En esos casos, repórtalo por WhatsApp dentro de las 48 horas de recibido, con fotos del producto y del empaque.",
      },
    ],
  },
];
