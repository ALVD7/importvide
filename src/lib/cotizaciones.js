// Reglas de seguimiento de cotizaciones, compartidas por el panel
// (/admin/cotizaciones) y el recordatorio diario (api/recordatorio-cotizaciones.js).

export const ESTADOS = [
  { value: "nuevo", label: "Nuevo" },
  { value: "contactado", label: "Contactado" },
  { value: "cotizado", label: "Cotizado" },
  { value: "ganado", label: "Ganado" },
  { value: "perdido", label: "Perdido" },
];

export const ESTADOS_ABIERTOS = ["nuevo", "contactado", "cotizado"];

export const CANALES = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telefono", label: "Teléfono" },
  { value: "correo", label: "Correo" },
  { value: "formulario", label: "Formulario web" },
  { value: "otro", label: "Otro" },
];

// Días hasta el siguiente seguimiento al pasar a cada estado, si no hay fecha.
export const DIAS_SEGUIMIENTO = { contactado: 2, cotizado: 3 };

// Fecha de hoy en Guayaquil (UTC−5, sin horario de verano) como AAAA-MM-DD.
export function hoyGuayaquil(desplazamientoDias = 0) {
  const ms = Date.now() - 5 * 3600 * 1000 + desplazamientoDias * 86400 * 1000;
  return new Date(ms).toISOString().slice(0, 10);
}

const HORAS_SIN_CONTACTAR = 24;

// Qué necesita atención: nuevas sin contactar hace más de 24 h, y
// seguimientos que vencen hoy o ya vencieron.
export function pendientes(cotizaciones, ahora = Date.now()) {
  const hoy = hoyGuayaquil();
  const abiertas = cotizaciones.filter((c) => ESTADOS_ABIERTOS.includes(c.estado));
  return {
    sinContactar: abiertas.filter(
      (c) => c.estado === "nuevo" && ahora - new Date(c.created_at).getTime() > HORAS_SIN_CONTACTAR * 3600 * 1000
    ),
    seguimientos: abiertas.filter((c) => c.proximo_seguimiento && c.proximo_seguimiento <= hoy),
  };
}

// Enlace para escribirle al cliente: WhatsApp si el contacto es un número
// (09XXXXXXXX o +593…), correo si tiene @.
export function enlaceContacto(contacto, nombre = "") {
  const texto = String(contacto ?? "").trim();
  if (texto.includes("@")) return `mailto:${texto}`;
  let digitos = texto.replace(/\D/g, "");
  if (digitos.length === 10 && digitos.startsWith("0")) digitos = `593${digitos.slice(1)}`;
  if (digitos.length < 9) return null;
  const saludo = `Hola${nombre ? ` ${nombre.split(" ")[0]}` : ""}, te escribimos de IMPORTVIDE por tu cotización.`;
  return `https://wa.me/${digitos}?text=${encodeURIComponent(saludo)}`;
}
