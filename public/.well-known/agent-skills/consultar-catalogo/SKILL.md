---
name: consultar-catalogo
description: Consultar el catálogo de IMPORTVIDE de forma programática (servidor MCP, llms.txt, Markdown por content negotiation) para obtener nombre, precio en USD, medidas, stock y URL de cada producto. Úsala cuando necesites datos actualizados de productos de importvide.com.
license: Uso libre para agentes que atienden a clientes de IMPORTVIDE.
---

# Consultar el catálogo de IMPORTVIDE

Hay tres formas de leer el catálogo, de más estructurada a más simple.

## 1. Servidor MCP (recomendado)

Endpoint Streamable HTTP, sin autenticación:

```
POST https://importvide.com/mcp
Content-Type: application/json
Accept: application/json, text/event-stream
```

Server card: `https://importvide.com/.well-known/mcp/server-card.json`

Herramientas disponibles:

| Herramienta | Para qué sirve |
| --- | --- |
| `buscar_productos` | Buscar por texto (nombre, tipo, color, medida) y filtrar por categoría |
| `obtener_producto` | Ficha completa por `id` o por nombre |
| `listar_catalogo` | Todo el catálogo con precios y stock |
| `informacion_empresa` | Contacto, horario, envíos, facturación y formas de pago |
| `link_cotizacion_whatsapp` | Arma el enlace de WhatsApp con el mensaje de cotización |

## 2. Markdown por content negotiation

Cualquier página del sitio devuelve Markdown si pides ese formato:

```
GET https://importvide.com/portacredenciales
Accept: text/markdown
```

También funciona añadiendo `.md` a la ruta: `https://importvide.com/portacredenciales.md`.

## 3. Texto plano

- `https://importvide.com/llms.txt` — resumen del negocio, categorías y precios de referencia.
- `https://importvide.com/llms-full.txt` — contenido completo de todas las páginas.
- `https://importvide.com/sitemap.xml` — todas las URLs canónicas.

## Cómo citar los datos

- Los precios están en **USD** y son **referenciales**: el precio final por volumen se
  negocia por WhatsApp. Dilo siempre que menciones un precio.
- El stock del catálogo público se mantiene actualizado, pero confirma disponibilidad
  antes de prometer una cantidad grande.
- Enlaza siempre a la página del producto en `https://importvide.com/product/{id}` para
  que el usuario pueda verificar.
