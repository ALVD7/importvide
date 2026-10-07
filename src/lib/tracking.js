// Origen de la visita (UTM / referrer) y eventos de conversión de GA4.
//
// - capturarOrigen() se llama una vez al cargar la app: guarda de dónde vino
//   el visitante para enviarlo con el formulario y con los eventos de GA4.
//   El mensaje de WhatsApp no lo lleva: ese texto lo ve el cliente.
// - instalarSeguimientoDeClics() escucha todos los clics del documento: no hace
//   falta tocar cada botón.
//
// Eventos GA4 (marcarlos como "eventos clave" en GA4 para usarlos en Ads):
//   whatsapp_click  { producto, ubicacion, origen }
//   generate_lead   { producto, origen, currency, value }      (formulario /cotizar enviado)
//   phone_click     { ubicacion }
//   email_click     { ubicacion }
//   review_click    {}                          (botón "Déjanos tu reseña")

const CLAVE = "iv_origen";
const VIGENCIA_MS = 30 * 24 * 60 * 60 * 1000;
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];

// Buscadores y redes conocidos: un referrer de estos dominios es tráfico
// orgánico o social aunque no traiga UTM.
const FUENTES = [
  [/(^|\.)google\./, "google", "organic"],
  [/(^|\.)bing\.com$/, "bing", "organic"],
  [/(^|\.)duckduckgo\.com$/, "duckduckgo", "organic"],
  [/(^|\.)yahoo\./, "yahoo", "organic"],
  [/(^|\.)(facebook\.com|fb\.com)$/, "facebook", "social"],
  [/(^|\.)instagram\.com$/, "instagram", "social"],
  [/(^|\.)(t\.co|twitter\.com|x\.com)$/, "x", "social"],
  [/(^|\.)linkedin\.com$/, "linkedin", "social"],
  [/(^|\.)tiktok\.com$/, "tiktok", "social"],
  [/(^|\.)chatgpt\.com$/, "chatgpt", "referral"],
];

let actual = null;

function leer() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    if (guardado && Date.now() - new Date(guardado.fecha).getTime() < VIGENCIA_MS) return guardado;
  } catch {
    // localStorage bloqueado o vacío: se trata como visita directa
  }
  return null;
}

function guardar(origen) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(origen));
  } catch {
    // sin almacenamiento: el origen vale solo para esta carga de página
  }
}

function referrerExterno() {
  try {
    if (!document.referrer) return "";
    const ref = new URL(document.referrer);
    return ref.hostname === window.location.hostname ? "" : ref.hostname;
  } catch {
    return "";
  }
}

// Modelo "último clic no directo": una visita con UTM o desde otro sitio
// reemplaza el origen guardado; una visita directa conserva el anterior.
export function capturarOrigen() {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const utm = Object.fromEntries(
    PARAMS.map((p) => [p, url.searchParams.get(p)]).filter(([, v]) => v)
  );
  const referrer = referrerExterno();
  const previo = leer();

  if (Object.keys(utm).length || referrer || !previo) {
    actual = { ...utm, referrer, landing: url.pathname, fecha: new Date().toISOString() };
    guardar(actual);
  } else {
    actual = previo;
  }
  return actual;
}

export function origen() {
  return actual ?? leer() ?? {};
}

// Resumen legible: "google / organic / gbp", "instagram / social", "directo".
export function origenTexto(o = origen()) {
  if (o.utm_source) return [o.utm_source, o.utm_medium, o.utm_campaign].filter(Boolean).join(" / ");
  if (o.gclid) return "google / cpc";
  if (o.referrer) {
    const fuente = FUENTES.find(([re]) => re.test(o.referrer));
    return fuente ? `${fuente[1]} / ${fuente[2]}` : `${o.referrer} / referral`;
  }
  return "directo";
}

export function track(evento, params = {}) {
  const datos = { ...params, page_path: window.location.pathname };
  if (import.meta.env.DEV) console.debug("[GA4]", evento, datos);
  window.gtag?.("event", evento, datos);
}

function productoDeLaPagina() {
  if (window.location.pathname === "/") return "general";
  return document.querySelector("h1")?.textContent?.trim() || "general";
}

function alHacerClic(e) {
  const a = e.target.closest?.("a[href]");
  // Los enlaces del panel de admin (escribirle a un cliente) no son conversiones.
  if (!a || "sinMedir" in a.dataset) return;
  const href = a.getAttribute("href") ?? "";

  if (a.hostname === "wa.me") {
    track("whatsapp_click", {
      producto: a.dataset.producto || productoDeLaPagina(),
      ubicacion: a.dataset.ubicacion || "general",
      origen: origenTexto(),
    });
  } else if (href.startsWith("tel:")) {
    track("phone_click", { ubicacion: a.dataset.ubicacion || "general" });
  } else if (href.startsWith("mailto:")) {
    track("email_click", { ubicacion: a.dataset.ubicacion || "general" });
  } else if (a.dataset.evento) {
    track(a.dataset.evento);
  }
}

export function instalarSeguimientoDeClics() {
  // Fase de captura: corre antes de que el navegador siga el enlace. auxclick
  // cubre el clic con la rueda (abrir en pestaña nueva).
  document.addEventListener("click", alHacerClic, true);
  document.addEventListener("auxclick", alHacerClic, true);
}
