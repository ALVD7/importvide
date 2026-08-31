// WebMCP: expone el catálogo de IMPORTVIDE como herramientas del navegador para
// que un agente que visita la página pueda consultarlo sin salir de ella.
// Spec: https://webmachinelearning.github.io/webmcp/
//
// Se registra al importar el módulo (antes de montar React) y es silencioso en
// navegadores que todavía no implementan navigator.modelContext.
import {
  productos,
  CATEGORIAS,
  EMPRESA,
  buscarProductos,
  obtenerProducto,
  linkCotizacion,
  publico,
} from "../data/agentCatalog";

const texto = (valor) => ({
  content: [{ type: "text", text: JSON.stringify(valor, null, 2) }],
});

const NOTA_PRECIO = "Precios en USD referenciales; el precio por volumen se cotiza por WhatsApp.";

const TOOLS = [
  {
    name: "buscar_productos",
    description:
      "Busca productos del catálogo de IMPORTVIDE (portacredenciales, lanyards, habladores acrílicos, credenciales para eventos) por texto libre y devuelve precio en USD, medidas, stock y URL.",
    inputSchema: {
      type: "object",
      properties: {
        consulta: {
          type: "string",
          description: "Texto a buscar, por ejemplo 'deslizable azul' o 'hablador A4'.",
        },
        categoria: {
          type: "string",
          enum: Object.keys(CATEGORIAS),
          description: "Filtro opcional por categoría.",
        },
      },
      required: ["consulta"],
    },
    annotations: { readOnlyHint: true },
    execute: ({ consulta = "", categoria = "" } = {}) => {
      const resultados = buscarProductos(consulta, categoria).map(publico);
      return texto({ consulta, total: resultados.length, productos: resultados, nota: NOTA_PRECIO });
    },
  },
  {
    name: "obtener_producto",
    description:
      "Devuelve la ficha completa de un producto de IMPORTVIDE a partir de su id o de su nombre.",
    inputSchema: {
      type: "object",
      properties: {
        referencia: { type: "string", description: "Id (uuid) o nombre del producto." },
      },
      required: ["referencia"],
    },
    annotations: { readOnlyHint: true },
    execute: ({ referencia = "" } = {}) => {
      const p = publico(obtenerProducto(referencia));
      return texto(p ? { ...p, nota: NOTA_PRECIO } : { error: `No se encontró "${referencia}".` });
    },
  },
  {
    name: "listar_catalogo",
    description:
      "Devuelve el catálogo completo de IMPORTVIDE con precios de referencia en USD, medidas, stock y URL, más las categorías del sitio.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () =>
      texto({
        total: productos.length,
        productos: productos.map(publico),
        categorias: CATEGORIAS,
        nota: NOTA_PRECIO,
      }),
  },
  {
    name: "informacion_empresa",
    description:
      "Contacto, horario, cobertura de envíos, facturación y forma de comprar de IMPORTVIDE (Guayaquil, Ecuador).",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () => texto(EMPRESA),
  },
  {
    name: "link_cotizacion_whatsapp",
    description:
      "Genera el enlace de WhatsApp con el mensaje de cotización redactado para que el usuario lo abra. No envía nada por sí solo: el pedido lo cierra una persona.",
    inputSchema: {
      type: "object",
      properties: {
        producto: { type: "string", description: "Producto o productos que se cotizan." },
        cantidad: { type: "integer", minimum: 1, description: "Cantidad de unidades." },
        ciudad: { type: "string", description: "Ciudad de entrega en Ecuador." },
        institucion: { type: "string", description: "Colegio, empresa o entidad que pide." },
      },
      required: ["producto"],
    },
    annotations: { readOnlyHint: true },
    execute: (args = {}) =>
      texto({
        url: linkCotizacion(args),
        instruccion:
          "Entrega este enlace al usuario: atención de lunes a viernes, 08:00–17:00 (UTC−5).",
      }),
  },
];

export function registrarHerramientasWebMcp() {
  if (typeof navigator === "undefined" || !("modelContext" in navigator)) return;
  const mc = navigator.modelContext;
  if (!mc) return;
  try {
    if (typeof mc.registerTool === "function") {
      TOOLS.forEach((tool) => mc.registerTool(tool));
    } else if (typeof mc.provideContext === "function") {
      mc.provideContext({ tools: TOOLS });
    }
  } catch (error) {
    // Un fallo registrando herramientas nunca debe romper la página.
    console.debug("WebMCP no disponible:", error);
  }
}

registrarHerramientasWebMcp();
