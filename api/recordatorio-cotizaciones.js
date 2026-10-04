// Recordatorio diario por correo: cotizaciones sin contactar y seguimientos
// que vencen hoy. Lo dispara el cron de vercel.json todos los días a las
// 08:00 de Guayaquil (13:00 UTC); si no hay nada pendiente, no envía nada.
//
// Variables de entorno en Vercel:
//   SUPABASE_SERVICE_ROLE_KEY  clave secreta de Supabase (lee saltándose RLS)
//   CRON_SECRET                Vercel la manda en Authorization: solo el cron puede llamar
//   RESEND_API_KEY, NOTIFY_EMAIL  las mismas del aviso de cotizaciones
import { pendientes, ESTADOS_ABIERTOS } from "../src/lib/cotizaciones.js";

const PANEL = "https://importvide.com/admin/cotizaciones";

const linea = (c) =>
  `• ${c.nombre}${c.empresa ? ` (${c.empresa})` : ""}: ${c.producto} × ${c.cantidad}, ${c.ciudad} — ${c.contacto}`;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const { CRON_SECRET, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, NOTIFY_EMAIL, NOTIFY_FROM } = process.env;

  if (!CRON_SECRET || req.headers.authorization !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: "no_autorizado" });
  }
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  if (!url || !SUPABASE_SERVICE_ROLE_KEY || !RESEND_API_KEY || !NOTIFY_EMAIL) {
    return res.status(500).json({ error: "faltan_variables" });
  }

  const r = await fetch(
    `${url}/rest/v1/cotizaciones?select=*&estado=in.(${ESTADOS_ABIERTOS.join(",")})&order=created_at.asc`,
    { headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` } }
  );
  if (!r.ok) {
    console.error("recordatorio: Supabase", r.status, await r.text());
    return res.status(502).json({ error: "supabase" });
  }

  const { sinContactar, seguimientos } = pendientes(await r.json());
  if (!sinContactar.length && !seguimientos.length) return res.status(200).json({ enviado: false });

  const partes = [];
  if (sinContactar.length) partes.push(`Sin contactar hace más de 24 h (${sinContactar.length}):`, ...sinContactar.map(linea), "");
  if (seguimientos.length) {
    partes.push(
      `Seguimientos para hoy o atrasados (${seguimientos.length}):`,
      ...seguimientos.map((c) => `${linea(c)} [${c.estado}, tocaba el ${c.proximo_seguimiento}]`),
      ""
    );
  }
  partes.push(`Abrir el panel: ${PANEL}`);

  const envio = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: NOTIFY_FROM || "IMPORTVIDE Web <onboarding@resend.dev>",
      to: [NOTIFY_EMAIL],
      subject: `Seguimiento de hoy: ${sinContactar.length} sin contactar, ${seguimientos.length} por dar seguimiento`,
      text: partes.join("\n"),
    }),
  });
  if (!envio.ok) {
    console.error("recordatorio: Resend", envio.status, await envio.text());
    return res.status(502).json({ error: "correo" });
  }
  return res.status(200).json({ enviado: true, sinContactar: sinContactar.length, seguimientos: seguimientos.length });
}
