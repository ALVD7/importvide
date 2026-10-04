import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { STATIC_PAGES } from "../data/staticPages";
import { BUSINESS } from "../data/business";
import { breadcrumbJsonLd } from "../lib/structuredData";
import styles from "./Info.module.css";

const PAGE = STATIC_PAGES.privacidad;
const CRUMBS = [
  { name: "Inicio", path: "/" },
  { name: PAGE.h1, path: PAGE.path },
];

// Texto base según la Ley Orgánica de Protección de Datos Personales (LOPDP)
// del Ecuador. Conviene que lo revise un abogado antes de darlo por final.
export default function Privacidad() {
  const contacto = BUSINESS.email
    ? `por WhatsApp al ${BUSINESS.phoneDisplay} o al correo ${BUSINESS.email}`
    : `por WhatsApp al ${BUSINESS.phoneDisplay}`;

  return (
    <div className={styles.page}>
      <Seo
        title={PAGE.title}
        description={PAGE.description}
        path={PAGE.path}
        jsonLd={[breadcrumbJsonLd(CRUMBS)]}
      />
      <Header />
      <main className={styles.main}>
        <Breadcrumbs items={CRUMBS} />
        <h1 className={styles.title}>{PAGE.h1}</h1>
        <p className={styles.updated}>Última actualización: octubre de 2026</p>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Quién es responsable de tus datos</h2>
          <p className={styles.text}>
            {BUSINESS.name}, con operación en {BUSINESS.city}, Ecuador. Puedes contactarnos {contacto},{" "}
            {BUSINESS.hours.label.toLowerCase()}.
          </p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Qué datos recogemos</h2>
          <ul className={styles.list}>
            <li>
              <strong>Formulario de cotización:</strong> nombre, empresa o institución, producto,
              cantidad, fecha requerida, ciudad, tu WhatsApp o correo y los detalles que escribas.
            </li>
            <li>
              <strong>Origen de la visita:</strong> de qué sitio o campaña llegaste (parámetros UTM o
              sitio de referencia) y la primera página que viste. Se guarda en tu navegador durante
              30 días y se envía con el formulario de cotización.
            </li>
            <li>
              <strong>WhatsApp:</strong> si nos escribes, recibimos tu número y tus mensajes. WhatsApp
              tiene su propia política de privacidad.
            </li>
            <li>
              <strong>Cuentas de usuario:</strong> si creas una cuenta, tu correo y una contraseña
              cifrada.
            </li>
            <li>
              <strong>Analítica:</strong> datos de navegación anónimos o seudónimos (páginas vistas,
              clics, dispositivo, ciudad aproximada) mediante Google Analytics.
            </li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Para qué los usamos</h2>
          <p className={styles.text}>
            Para responder tu cotización, preparar la proforma y la factura, coordinar el envío y dar
            seguimiento a tu pedido, y para entender cómo se usa el sitio y mejorarlo. No vendemos
            tus datos ni los usamos para fines distintos a estos. La base legal es tu consentimiento
            y la ejecución de las gestiones previas a una compra que tú solicitas.
          </p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Con quién se comparten</h2>
          <p className={styles.text}>
            Solo con los proveedores que necesitamos para operar el sitio, que tratan los datos por
            cuenta nuestra: Vercel (alojamiento web), Supabase (base de datos), Google (Analytics) y
            el servicio de correo con el que recibimos los avisos de cotización. Algunos de estos
            servidores están fuera del Ecuador.
          </p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Cuánto tiempo los guardamos</h2>
          <p className={styles.text}>
            El tiempo necesario para atender tu solicitud y dar seguimiento comercial, y el que
            exijan las obligaciones tributarias y contables cuando hay una venta. Puedes pedir que
            los eliminemos en cualquier momento.
          </p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Tus derechos</h2>
          <p className={styles.text}>
            Puedes pedir acceso, rectificación, actualización, eliminación, oposición, portabilidad
            o suspensión del tratamiento de tus datos, y retirar tu consentimiento, escribiéndonos{" "}
            {contacto}. Te responderemos en los plazos que establece la ley. Si no estás conforme,
            puedes acudir a la Superintendencia de Protección de Datos Personales.
          </p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Cookies y almacenamiento del navegador</h2>
          <ul className={styles.list}>
            <li>
              <strong>Google Analytics</strong> (_ga, _ga_*): mide visitas y clics. Duran hasta 2
              años.
            </li>
            <li>
              <strong>iv_origen</strong> (almacenamiento local): recuerda el origen de tu visita
              durante 30 días.
            </li>
            <li>
              <strong>Sesión</strong> (almacenamiento local): solo si inicias sesión con tu cuenta.
            </li>
          </ul>
          <p className={styles.text}>
            Puedes borrarlas o bloquearlas desde la configuración de tu navegador, o desactivar
            Google Analytics con el complemento oficial de inhabilitación de Google. El sitio sigue
            funcionando sin ellas.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
