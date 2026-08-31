// Catálogo en formato legible por máquinas: lo consumen el servidor MCP
// (api/mcp.js), las herramientas WebMCP del navegador (src/lib/webmcp.js) y la
// generación de Markdown del build (scripts/prerender.mjs).
// Los datos base (id, nombre, precio, stock, foto) salen de CATALOG para no
// duplicar la fuente de verdad; aquí solo se añaden categoría, medidas y
// sinónimos de búsqueda.
import { CATALOG, seoPages } from "./seoPages.js";

export const SITE_URL = "https://importvide.com";
export const WHATSAPP = "593980118073";

// Datos que un agente necesita y que la ficha de catálogo no tiene.
const DETALLE = {
  desliAzul:     { categoria: "portacredenciales", medidas: "11 × 7 cm (carnet de 8,5 × 5,5 cm)", keywords: "deslizable azul rigido porta carnet id" },
  desliNegro:    { categoria: "portacredenciales", medidas: "11 × 7 cm (carnet de 8,5 × 5,5 cm)", keywords: "deslizable negro rigido porta carnet id" },
  desliVerde:    { categoria: "portacredenciales", medidas: "11 × 7 cm (carnet de 8,5 × 5,5 cm)", keywords: "deslizable verde rigido porta carnet id" },
  caparazon:     { categoria: "portacredenciales", medidas: "11 × 7 cm (carnet de 8,5 × 5,5 cm)", keywords: "caparazon carcasa transparente rigido uso diario" },
  caraAbierta:   { categoria: "portacredenciales", medidas: "11 × 7 cm (carnet de 8,5 × 5,5 cm)", keywords: "cara abierta proximidad rfid lector azul blanco rojo" },
  acrilico:      { categoria: "portacredenciales", medidas: "para carnet de 8,5 × 5,5 cm",        keywords: "acrilico premium corporativo transparente cristalino" },
  flexCarnet:    { categoria: "portacredenciales", medidas: "6 × 9 cm vertical o 9 × 6 cm horizontal", keywords: "flexible funda pvc economico carnet colegio" },
  flexEventos:   { categoria: "credenciales-eventos", medidas: "formato amplio para acreditaciones", keywords: "evento congreso feria staff prensa acreditacion pvc" },
  cordones:      { categoria: "lanyards", medidas: "cordón con clip plástico", keywords: "lanyard cinta cordon verde negro azul cuello" },
  clip:          { categoria: "lanyards", medidas: "clip metálico con correa de vinilo", keywords: "clip metalico correa vinilo pinza sujetador" },
  habT:          { categoria: "habladores", medidas: "A4, doble cara", keywords: "hablador mesa tipo t menu restaurante señaletica" },
  habEscritorio: { categoria: "habladores", medidas: "A4, base en L", keywords: "hablador escritorio acrilico precios mostrador" },
  habPared:      { categoria: "habladores", medidas: "A4", keywords: "hablador pared afiche poster señalizacion" },
};

export const CATEGORIAS = {
  portacredenciales: {
    nombre: "Portacredenciales y porta carnets",
    url: `${SITE_URL}/portacredenciales`,
  },
  lanyards: {
    nombre: "Lanyards, cintas y clips",
    url: `${SITE_URL}/lanyards-ecuador`,
  },
  habladores: {
    nombre: "Habladores y exhibidores acrílicos",
    url: `${SITE_URL}/habladores-acrilicos`,
  },
  "credenciales-eventos": {
    nombre: "Credenciales para eventos",
    url: `${SITE_URL}/credenciales-para-eventos`,
  },
};

export const productos = Object.entries(CATALOG).map(([clave, p]) => {
  const d = DETALLE[clave] ?? {};
  return {
    id: p.id,
    nombre: p.name,
    categoria: d.categoria ?? "portacredenciales",
    precio_usd: p.price,
    precio_referencial: true,
    medidas: d.medidas ?? "",
    descripcion: p.alt,
    en_stock: p.inStock,
    url: `${SITE_URL}/product/${p.id}`,
    imagen: `${SITE_URL}${p.img}`,
    _busqueda: `${p.name} ${p.alt} ${d.keywords ?? ""} ${d.categoria ?? ""}`.toLowerCase(),
  };
});

export const EMPRESA = {
  nombre: "IMPORTVIDE",
  descripcion:
    "Importador directo y distribuidor mayorista de portacredenciales, lanyards y habladores acrílicos, con bodega en Guayaquil, Ecuador.",
  ciudad: "Guayaquil, Ecuador",
  local_fisico: false,
  nota_local: "Operación 100 % en línea: no hay local de atención al público.",
  whatsapp: "+593 98 011 8073",
  whatsapp_url: `https://wa.me/${WHATSAPP}`,
  instagram: "https://www.instagram.com/importvide/",
  horario: "Lunes a viernes, 08:00–17:00 (hora de Ecuador, UTC−5)",
  moneda: "USD",
  factura: "Se emite factura para empresas, colegios, cooperativas, bancos y entidades públicas.",
  envios:
    "Envíos a Quito, Cuenca y todo Ecuador. El tiempo de entrega depende del medio de envío elegido y se confirma en la cotización.",
  pedidos:
    "No hay checkout en línea: la cotización y el pedido se cierran por WhatsApp. Los precios publicados son referenciales y el descuento por volumen se negocia según la cantidad.",
  politicas: `${SITE_URL}/politicas`,
  categorias: seoPages.map((p) => ({ nombre: p.h1, url: `${SITE_URL}/${p.slug}` })),
};

// Búsqueda por palabras: un producto entra si contiene todos los términos.
export function buscarProductos(consulta = "", categoria = "") {
  const terminos = consulta.toLowerCase().split(/\s+/).filter(Boolean);
  return productos.filter((p) => {
    if (categoria && p.categoria !== categoria) return false;
    return terminos.every((t) => p._busqueda.includes(t));
  });
}

export function obtenerProducto(referencia = "") {
  const r = referencia.toLowerCase().trim();
  return (
    productos.find((p) => p.id === referencia) ??
    productos.find((p) => p.nombre.toLowerCase() === r) ??
    buscarProductos(referencia)[0] ??
    null
  );
}

export function linkCotizacion({ producto = "", cantidad = 0, ciudad = "", institucion = "" }) {
  const partes = [
    "Hola IMPORTVIDE, necesito una cotización",
    cantidad ? ` de ${cantidad} unidades` : "",
    producto ? ` de ${producto}` : "",
    institucion ? ` para ${institucion}` : "",
    ciudad ? ` en ${ciudad}` : "",
    ". ¿Cuál es el precio por volumen y el tiempo de entrega?",
  ];
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(partes.join(""))}`;
}

// Se quita el campo interno de búsqueda antes de responder a un agente.
export const publico = (p) => {
  if (!p) return null;
  const resto = { ...p };
  delete resto._busqueda;
  return resto;
};
