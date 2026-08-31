// 404 real para rutas /.well-known/ que no existen.
//
// El SPA reescribe cualquier ruta desconocida a index.html, así que un agente que
// probaba /.well-known/lo-que-sea recibía un HTML con status 200 (soft-404) y no
// podía distinguir "no lo implementamos" de "algo salió mal". Los archivos
// .well-known reales siguen sirviéndose porque el sistema de archivos se evalúa
// antes que los rewrites.
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(404).json({
    error: "not_found",
    message: `IMPORTVIDE no publica ${req.url ?? "este recurso"}.`,
    discovery: {
      llms_txt: "https://importvide.com/llms.txt",
      api_catalog: "https://importvide.com/.well-known/api-catalog",
      mcp_server_card: "https://importvide.com/.well-known/mcp/server-card.json",
      ai_catalog: "https://importvide.com/.well-known/ai-catalog.json",
      agent_skills: "https://importvide.com/.well-known/agent-skills/index.json",
      auth: "https://importvide.com/auth.md",
    },
  });
}
