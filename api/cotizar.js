// Recibe el formulario de /cotizar: valida, guarda la cotización en Supabase
// (tabla `cotizaciones`, ver supabase/cotizaciones.sql) y avisa por correo.
//
// Variables de entorno en Vercel (Settings → Environment Variables):
//   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY  ya existen (las usa el build)
//   SUPABASE_SERVICE_ROLE_KEY  opcional: si está, se usa en vez de la anon key
//   RESEND_API_KEY             para el aviso por correo (resend.com)
//   NOTIFY_EMAIL               a quién llega el aviso
//   NOTIFY_FROM                remitente verificado en Resend (opcional)
import { PRODUCTOS_COTIZABLES } from "../src/data/staticPages.js";

const PRODUCTOS = new Set(PRODUCTOS_COTIZABLES.map((p) => p.value));

const texto = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function validar(body) {
  const fila = {
    nombre: texto(body.nombre, 120),
    empresa: texto(body.empresa, 160) || null,
    producto: texto(body.producto, 80),
    cantidad: Number.parseInt(body.cantidad, 10),
    fecha_requerida: /^\d{4}-\d{2}-\d{2}$/.test(body.fecha_requerida ?? "") ? body.fecha_requerida : null,
    ciudad: texto(body.ciudad, 80),
    contacto: texto(body.contacto, 120),
    mensaje: texto(body.mensaje, 1000) || null,
    origen: typeof body.origen === "object" && body.origen ? body.origen : {},
    pagina: texto(body.pagina, 200) || null,
  };

  const errores = [];
  if (fila.nombre.length < 2) errores.push("nombre");
  if (!PRODUCTOS.has(fila.producto)) errores.push("producto");
  if (!Number.isInteger(fila.cantidad) || fila.cantidad < 1 || fila.cantidad > 10_000_000) errores.push("cantidad");
  if (fila.ciudad.length < 2) errores.push("ciudad");
  if (fila.contacto.length < 6) errores.push("contacto");
  if (body.acepta !== true) errores.push("acepta");

  // El origen viene del navegador: solo se guardan claves conocidas y cortas.
  const CLAVES = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "referrer", "landing", "fecha", "resumen"];
  fila.origen = Object.fromEntries(
    CLAVES.filter((k) => typeof fila.origen[k] === "string").map((k) => [k, fila.origen[k].slice(0, 200)])
  );

  return { fila, errores };
}

async function guardar(fila) {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Faltan las credenciales de Supabase");

  const res = await fetch(`${url}/rest/v1/cotizaciones`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(fila),
  });
  if (!res.ok) throw new Error(`Supabase respondió ${res.status}: ${await res.text()}`);
}

async function notificar(fila) {
  const { RESEND_API_KEY, NOTIFY_EMAIL, NOTIFY_FROM } = process.env;
  if (!RESEND_API_KEY || !NOTIFY_EMAIL) return;

  const lineas = [
    `Nombre: ${fila.nombre}`,
    `Empresa: ${fila.empresa ?? "—"}`,
    `Producto: ${fila.producto}`,
    `Cantidad: ${fila.cantidad}`,
    `Fecha requerida: ${fila.fecha_requerida ?? "—"}`,
    `Ciudad: ${fila.ciudad}`,
    `Contacto: ${fila.contacto}`,
    `Detalles: ${fila.mensaje ?? "—"}`,
    "",
    `Origen: ${fila.origen.resumen ?? "—"}`,
    `Llegó por: ${fila.origen.landing ?? "—"} · Envió desde: ${fila.pagina ?? "—"}`,
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: NOTIFY_FROM || "IMPORTVIDE Web <onboarding@resend.dev>",
      to: [NOTIFY_EMAIL],
      subject: `Nueva cotización: ${fila.producto} × ${fila.cantidad} — ${fila.nombre}`,
      text: lineas.join("\n"),
    }),
  });
  if (!res.ok) throw new Error(`Resend respondió ${res.status}: ${await res.text()}`);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  let body = req.body ?? {};
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "json_invalido" });
    }
  }

  // Campo trampa: los bots lo rellenan, las personas no lo ven.
  if (body.sitio_web) return res.status(200).json({ ok: true });

  const { fila, errores } = validar(body);
  if (errores.length) return res.status(400).json({ error: "datos_invalidos", campos: errores });

  try {
    await guardar(fila);
  } catch (error) {
    console.error("cotizar: no se pudo guardar", error);
    return res.status(502).json({ error: "no_guardado" });
  }

  try {
    await notificar(fila);
  } catch (error) {
    // La cotización ya está guardada: un fallo del correo no se le muestra al cliente.
    console.error("cotizar: no se pudo enviar el aviso", error);
  }

  return res.status(201).json({ ok: true });
}
