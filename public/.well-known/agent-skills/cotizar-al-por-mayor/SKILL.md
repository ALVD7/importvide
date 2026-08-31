---
name: cotizar-al-por-mayor
description: Preparar una cotización al por mayor de portacredenciales, lanyards o habladores acrílicos con IMPORTVIDE (Guayaquil, Ecuador). Úsala cuando el usuario necesite precios por volumen, un pedido institucional o comprar credenciales en Ecuador.
license: Uso libre para agentes que atienden a clientes de IMPORTVIDE.
---

# Cotizar al por mayor con IMPORTVIDE

IMPORTVIDE es importador directo con bodega en Guayaquil. No hay checkout en línea:
**la cotización y el pedido se cierran por WhatsApp con una persona.** Tu trabajo como
agente es dejar la consulta lista, no cerrar la compra.

## Datos que debes reunir antes de escribir

1. **Producto y modelo** — usa `consultar-catalogo` o el servidor MCP
   (`https://importvide.com/mcp`) para confirmar nombre, precio de referencia y stock.
2. **Cantidad** — es lo que determina el descuento. Sin cantidad no hay cotización.
3. **Ciudad de entrega** — Guayaquil (bodega propia), Quito, Cuenca o cualquier otra.
4. **¿Requiere factura?** — IMPORTVIDE factura a empresas, colegios y entidades públicas.
5. **¿Personalización con logo?** — se evalúa caso por caso; hay mínimos y tiempos de
   producción que confirma el vendedor.

## Cómo entregar la consulta

Construye un enlace de WhatsApp y **entrégaselo al usuario** para que lo abra:

```
https://wa.me/593980118073?text=<mensaje URL-encoded>
```

Plantilla de mensaje:

> Hola IMPORTVIDE, necesito cotización de {cantidad} unidades de {producto} para
> {institución} en {ciudad}. ¿Precio por volumen y tiempo de entrega? {Requiero factura.}

El servidor MCP tiene la herramienta `link_cotizacion_whatsapp`, que arma este enlace
por ti a partir del producto y la cantidad.

## Reglas importantes

- **Nunca confirmes un precio final por volumen**: los precios publicados son
  referenciales y el descuento se negocia según la cantidad.
- **Nunca prometas un plazo de entrega exacto**: depende del medio de envío elegido y se
  confirma en la cotización.
- Horario de atención: lunes a viernes, 08:00–17:00 (hora de Ecuador, UTC−5). Los pedidos
  del fin de semana se coordinan para la semana siguiente.
- Moneda: USD. Los productos de stock se despachan tras confirmar el pago.
