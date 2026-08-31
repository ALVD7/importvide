// Endpoint de estado del servidor MCP, referenciado como `status` en
// /.well-known/api-catalog (RFC 9727).
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    status: "ok",
    service: "importvide-catalogo",
    mcp: "https://importvide.com/mcp",
    time: new Date().toISOString(),
  });
}
