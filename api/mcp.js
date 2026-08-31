// Servidor MCP (Model Context Protocol) de IMPORTVIDE — transporte Streamable HTTP.
// Publicado en https://importvide.com/mcp (rewrite en vercel.json) y anunciado en
// /.well-known/mcp/server-card.json, /.well-known/api-catalog y /.well-known/ai-catalog.json.
//
// Es de solo lectura y sin autenticación: un agente puede consultar el catálogo y armar
// el enlace de cotización, pero el pedido siempre lo cierra una persona por WhatsApp.
import {
  productos,
  CATEGORIAS,
  EMPRESA,
  buscarProductos,
  obtenerProducto,
  linkCotizacion,
  publico,
} from "../src/data/agentCatalog.js";

const PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];

const SERVER_INFO = {
  name: "importvide-catalogo",
  title: "IMPORTVIDE Catálogo",
  version: "1.0.0",
  websiteUrl: "https://importvide.com",
};

const INSTRUCTIONS = `Catálogo mayorista de IMPORTVIDE (Guayaquil, Ecuador): portacredenciales, lanyards, habladores acrílicos y credenciales para eventos.
Los precios están en USD y son referenciales: el precio final por volumen se negocia por WhatsApp. No confirmes precios por volumen ni plazos de entrega exactos.
IMPORTVIDE no tiene checkout en línea ni local físico; usa link_cotizacion_whatsapp para entregar al usuario el enlace con el que cierra el pedido.`;

const TOOLS = [
  {
    name: "buscar_productos",
    title: "Buscar productos",
    description:
      "Busca productos del catálogo de IMPORTVIDE por texto libre (nombre, tipo, color, medida o uso) y opcionalmente por categoría. Devuelve precio en USD, medidas, stock y URL de cada resultado.",
    inputSchema: {
      type: "object",
      properties: {
        consulta: {
          type: "string",
          description: "Texto a buscar, por ejemplo 'deslizable azul', 'lanyard' o 'hablador A4'.",
        },
        categoria: {
          type: "string",
          enum: Object.keys(CATEGORIAS),
          description: "Filtro opcional por categoría.",
        },
      },
      required: ["consulta"],
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "obtener_producto",
    title: "Ficha de un producto",
    description:
      "Devuelve la ficha completa de un producto de IMPORTVIDE a partir de su id o de su nombre.",
    inputSchema: {
      type: "object",
      properties: {
        referencia: {
          type: "string",
          description: "Id del producto (uuid) o su nombre, por ejemplo 'Cordones lanyard'.",
        },
      },
      required: ["referencia"],
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "listar_catalogo",
    title: "Listar el catálogo completo",
    description:
      "Devuelve todos los productos de IMPORTVIDE con precio de referencia en USD, medidas, stock y URL, junto con las categorías del sitio.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "informacion_empresa",
    title: "Información de IMPORTVIDE",
    description:
      "Datos de contacto, horario de atención, cobertura de envíos, facturación y forma de comprar de IMPORTVIDE.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: "link_cotizacion_whatsapp",
    title: "Armar enlace de cotización",
    description:
      "Genera el enlace de WhatsApp con el mensaje de cotización ya redactado para que el usuario lo abra y hable con un vendedor. No envía nada por sí solo.",
    inputSchema: {
      type: "object",
      properties: {
        producto: { type: "string", description: "Producto o productos que se cotizan." },
        cantidad: { type: "integer", minimum: 1, description: "Cantidad de unidades." },
        ciudad: { type: "string", description: "Ciudad de entrega en Ecuador." },
        institucion: {
          type: "string",
          description: "Colegio, empresa o entidad que hace el pedido.",
        },
      },
      required: ["producto"],
    },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
];

function ejecutar(nombre, args = {}) {
  switch (nombre) {
    case "buscar_productos": {
      const resultados = buscarProductos(args.consulta ?? "", args.categoria ?? "").map(publico);
      return {
        consulta: args.consulta ?? "",
        total: resultados.length,
        productos: resultados,
        nota: "Precios en USD referenciales; el precio por volumen se cotiza por WhatsApp.",
      };
    }
    case "obtener_producto": {
      const p = publico(obtenerProducto(args.referencia ?? ""));
      if (!p) return { error: `No se encontró ningún producto para "${args.referencia ?? ""}".` };
      return {
        ...p,
        nota: "Precio en USD referencial; el precio por volumen se cotiza por WhatsApp.",
      };
    }
    case "listar_catalogo":
      return {
        total: productos.length,
        productos: productos.map(publico),
        categorias: CATEGORIAS,
        nota: "Precios en USD referenciales; el precio por volumen se cotiza por WhatsApp.",
      };
    case "informacion_empresa":
      return EMPRESA;
    case "link_cotizacion_whatsapp":
      return {
        url: linkCotizacion(args),
        instruccion:
          "Entrega este enlace al usuario para que lo abra: el pedido lo cierra una persona por WhatsApp, en horario de lunes a viernes de 08:00 a 17:00 (UTC−5).",
      };
    default:
      return null;
  }
}

const rpcError = (id, code, message) => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });

function manejar(mensaje) {
  const { id, method, params } = mensaje ?? {};

  switch (method) {
    case "initialize": {
      const pedida = params?.protocolVersion;
      return {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: PROTOCOL_VERSIONS.includes(pedida) ? pedida : PROTOCOL_VERSIONS[0],
          capabilities: { tools: { listChanged: false } },
          serverInfo: SERVER_INFO,
          instructions: INSTRUCTIONS,
        },
      };
    }
    case "ping":
      return { jsonrpc: "2.0", id, result: {} };
    case "tools/list":
      return { jsonrpc: "2.0", id, result: { tools: TOOLS } };
    case "tools/call": {
      const nombre = params?.name;
      const salida = ejecutar(nombre, params?.arguments ?? {});
      if (salida === null) return rpcError(id, -32602, `Herramienta desconocida: ${nombre}`);
      const texto = JSON.stringify(salida, null, 2);
      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: texto }],
          structuredContent: salida,
          isError: Boolean(salida.error),
        },
      };
    }
    case "resources/list":
      return { jsonrpc: "2.0", id, result: { resources: [] } };
    case "prompts/list":
      return { jsonrpc: "2.0", id, result: { prompts: [] } };
    default:
      return rpcError(id, -32601, `Método no soportado: ${method}`);
  }
}

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Mcp-Session-Id, MCP-Protocol-Version");
  res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id, MCP-Protocol-Version");
  res.setHeader("MCP-Protocol-Version", PROTOCOL_VERSIONS[0]);

  if (req.method === "OPTIONS") return res.status(204).end();

  // El servidor es sin estado: no abre stream SSE para notificaciones del servidor.
  if (req.method === "GET" || req.method === "DELETE") {
    return res
      .status(405)
      .json(rpcError(null, -32000, "Este servidor MCP es stateless: usa POST con JSON-RPC 2.0."));
  }

  if (req.method !== "POST") return res.status(405).end();

  let cuerpo = req.body;
  if (typeof cuerpo === "string") {
    try {
      cuerpo = JSON.parse(cuerpo);
    } catch {
      return res.status(400).json(rpcError(null, -32700, "JSON inválido"));
    }
  }
  if (!cuerpo || typeof cuerpo !== "object") {
    return res.status(400).json(rpcError(null, -32600, "Petición JSON-RPC inválida"));
  }

  const lote = Array.isArray(cuerpo) ? cuerpo : [cuerpo];
  const respuestas = lote.filter((m) => m?.id !== undefined && m?.id !== null).map(manejar);

  // Solo notificaciones (initialized, cancelled…): no llevan respuesta.
  if (respuestas.length === 0) return res.status(202).end();

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json(Array.isArray(cuerpo) ? respuestas : respuestas[0]);
}
