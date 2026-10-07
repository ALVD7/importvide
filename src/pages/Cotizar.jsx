import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { STATIC_PAGES, PRODUCTOS_COTIZABLES } from "../data/staticPages";
import { BUSINESS, whatsappUrl } from "../data/business";
import { breadcrumbJsonLd } from "../lib/structuredData";
import { origen, origenTexto, track } from "../lib/tracking";
import info from "./Info.module.css";
import styles from "./Cotizar.module.css";

const PAGE = STATIC_PAGES.cotizar;
const CRUMBS = [
  { name: "Inicio", path: "/" },
  { name: PAGE.h1, path: PAGE.path },
];

const hoy = () => new Date().toISOString().slice(0, 10);

const productoDesdeSlug = (slug) =>
  PRODUCTOS_COTIZABLES.find((p) => p.slugs.includes(slug))?.value ?? "";

// Mismo pedido en texto, para mandarlo por WhatsApp si el cliente lo prefiere
// o si el formulario falla.
function resumen(f) {
  return [
    "Hola IMPORTVIDE! Quiero una cotización:",
    `• Producto: ${f.producto || "—"}`,
    `• Cantidad: ${f.cantidad || "—"}`,
    f.fecha_requerida && `• Para el: ${f.fecha_requerida}`,
    `• Ciudad: ${f.ciudad || "—"}`,
    `• Nombre: ${f.nombre}${f.empresa ? ` (${f.empresa})` : ""}`,
    f.mensaje && `• Detalles: ${f.mensaje}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export default function Cotizar() {
  const [params] = useSearchParams();
  const [form, setForm] = useState(() => ({
    nombre: "",
    empresa: "",
    producto: productoDesdeSlug(params.get("producto")),
    cantidad: "",
    fecha_requerida: "",
    ciudad: "",
    contacto: "",
    mensaje: "",
    acepta: false,
    sitio_web: "",
  }));
  const [estado, setEstado] = useState("editando"); // editando | enviando | enviado | error

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const enviar = async (e) => {
    e.preventDefault();
    setEstado("enviando");
    try {
      const res = await fetch("/api/cotizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          origen: { ...origen(), resumen: origenTexto() },
          pagina: window.location.pathname + window.location.search,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      track("generate_lead", { producto: form.producto, origen: origenTexto() });
      setEstado("enviado");
    } catch {
      setEstado("error");
    }
  };

  const linkWhatsApp = whatsappUrl(resumen(form));

  return (
    <div className={info.page}>
      <Seo
        title={PAGE.title}
        description={PAGE.description}
        path={PAGE.path}
        jsonLd={[breadcrumbJsonLd(CRUMBS)]}
      />
      <Header />
      <main className={info.main}>
        <Breadcrumbs items={CRUMBS} />
        <h1 className={info.title}>{PAGE.h1}</h1>
        <p className={info.lead}>
          Cuéntanos qué necesitas y te respondemos con disponibilidad, precio por volumen y
          opciones de envío. ¿Lo quieres más
          rápido? Escríbenos directo por{" "}
          <a href={whatsappUrl("Hola IMPORTVIDE! Quiero una cotización.")} target="_blank" rel="noopener noreferrer" data-ubicacion="cotizar-intro">
            WhatsApp
          </a>.
        </p>

        {estado === "enviado" ? (
          <div className={info.card} role="status">
            <h2 className={info.sectionTitle}>¡Recibimos tu solicitud!</h2>
            <p className={info.text}>
              Te contactaremos al {form.contacto} en horario de atención. Si es urgente, envíanos
              el mismo pedido por WhatsApp:
            </p>
            <div className={info.actions}>
              <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" className={info.whatsappBtn} data-producto={form.producto} data-ubicacion="cotizar-enviado">
                <WhatsAppIcon />
                Enviar también por WhatsApp
              </a>
              <Link to="/" className={info.secondaryBtn}>Volver al inicio</Link>
            </div>
          </div>
        ) : (
          <form className={`${info.card} ${styles.form}`} onSubmit={enviar}>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Nombre *</span>
                <input name="nombre" value={form.nombre} onChange={cambiar} required minLength={2} maxLength={120} autoComplete="name" />
              </label>
              <label className={styles.field}>
                <span>Empresa o institución</span>
                <input name="empresa" value={form.empresa} onChange={cambiar} maxLength={160} autoComplete="organization" />
              </label>
              <label className={styles.field}>
                <span>Producto *</span>
                <select name="producto" value={form.producto} onChange={cambiar} required>
                  <option value="" disabled>Elige un producto</option>
                  {PRODUCTOS_COTIZABLES.map((p) => (
                    <option key={p.value} value={p.value}>{p.value}</option>
                  ))}
                </select>
              </label>
              <label className={styles.field}>
                <span>Cantidad aproximada *</span>
                <input name="cantidad" type="number" inputMode="numeric" min="1" max="10000000" value={form.cantidad} onChange={cambiar} required />
              </label>
              <label className={styles.field}>
                <span>¿Para cuándo lo necesitas?</span>
                <input name="fecha_requerida" type="date" min={hoy()} value={form.fecha_requerida} onChange={cambiar} />
              </label>
              <label className={styles.field}>
                <span>Ciudad de entrega *</span>
                <input name="ciudad" value={form.ciudad} onChange={cambiar} required minLength={2} maxLength={80} autoComplete="address-level2" />
              </label>
              <label className={`${styles.field} ${styles.full}`}>
                <span>WhatsApp o correo para responderte *</span>
                <input name="contacto" value={form.contacto} onChange={cambiar} required minLength={6} maxLength={120} placeholder="09XXXXXXXX o tu@empresa.com" />
              </label>
              <label className={`${styles.field} ${styles.full}`}>
                <span>Detalles (modelo, color, logo…)</span>
                <textarea name="mensaje" rows={3} value={form.mensaje} onChange={cambiar} maxLength={1000} />
              </label>
            </div>

            {/* Campo trampa para bots: oculto para las personas */}
            <label className={styles.trampa} aria-hidden="true">
              Sitio web
              <input name="sitio_web" value={form.sitio_web} onChange={cambiar} tabIndex={-1} autoComplete="off" />
            </label>

            <label className={styles.check}>
              <input type="checkbox" name="acepta" checked={form.acepta} onChange={cambiar} required />
              <span>
                Acepto que IMPORTVIDE use estos datos para responder mi cotización, según la{" "}
                <Link to="/privacidad">política de privacidad</Link>. *
              </span>
            </label>

            {estado === "error" && (
              <p className={styles.error} role="alert">
                No pudimos enviar el formulario. Para no perder tu pedido, envíalo por WhatsApp con
                el botón de abajo: ya va con tus datos.
              </p>
            )}

            <div className={info.actions}>
              <button type="submit" className={styles.submit} disabled={estado === "enviando"}>
                {estado === "enviando" ? "Enviando…" : "Enviar solicitud"}
              </button>
              {estado === "error" && (
                <a href={linkWhatsApp} target="_blank" rel="noopener noreferrer" className={info.whatsappBtn} data-producto={form.producto} data-ubicacion="cotizar-error">
                  <WhatsAppIcon />
                  Enviar por WhatsApp
                </a>
              )}
            </div>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
