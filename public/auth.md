# auth.md — IMPORTVIDE

Documento de descubrimiento de autenticación para agentes que interactúan con
importvide.com. Sigue el estándar [Auth.md](https://workos.com/auth-md).

## Audiencia

Agentes de IA y clientes automatizados que quieran leer el catálogo mayorista de
IMPORTVIDE (portacredenciales, lanyards, habladores acrílicos y credenciales para
eventos) o preparar una cotización para una persona.

## Recursos públicos: sin credenciales

Todos los recursos de lectura son públicos y **no requieren autenticación,
registro ni API key**. Se pueden consultar con una petición HTTP normal:

| Recurso | URL | Método |
| --- | --- | --- |
| Servidor MCP (catálogo) | `https://importvide.com/mcp` | `POST` (JSON-RPC 2.0, Streamable HTTP) |
| Resumen del negocio | `https://importvide.com/llms.txt` | `GET` |
| Contenido completo | `https://importvide.com/llms-full.txt` | `GET` |
| Manifiesto de capacidades | `https://importvide.com/.well-known/ai-catalog.json` | `GET` |
| Catálogo de APIs | `https://importvide.com/.well-known/api-catalog` | `GET` |
| Páginas en Markdown | cualquier URL con `Accept: text/markdown` | `GET` |

- Métodos de autenticación soportados: **ninguno** (`none`) para lectura.
- No hay endpoint de registro de agentes (`register_uri`) porque no existen
  recursos protegidos que lo necesiten.
- No publicamos metadatos OAuth (`/.well-known/oauth-authorization-server`,
  `/.well-known/oauth-protected-resource`) por el mismo motivo: no hay servidor
  de autorización ni resource server protegido.

## Zona privada (no destinada a agentes)

`/admin`, `/login` y `/register` son el panel interno de IMPORTVIDE. Usan sesiones
de Supabase Auth con email y contraseña, se otorgan solo a personal de la empresa
y están excluidos en `robots.txt`. No hay auto-registro ni emisión de credenciales
para agentes.

## Compras y cotizaciones

IMPORTVIDE no tiene checkout en línea: los pedidos se cierran por WhatsApp con una
persona. Un agente puede preparar el pedido y entregar el enlace al usuario, pero
**no puede completar una compra ni comprometer un pago** por su cuenta.

- WhatsApp: +593 98 011 8073 · `https://wa.me/593980118073`
- Horario de atención: lunes a viernes, 08:00–17:00 (hora de Ecuador, UTC−5)
- Moneda: USD · Se emite factura para empresas e instituciones

## Contacto

Para dudas sobre acceso automatizado o integraciones, escribir por WhatsApp al
+593 98 011 8073 o por Instagram a [@importvide](https://www.instagram.com/importvide/).
