import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { whatsappUrl } from "../data/business";
import styles from "./Info.module.css";

// En producción Vercel sirve dist/404.html con status 404 (lo genera el
// prerender); este componente es lo que React pinta encima.
const SUGERENCIAS = [
  { to: "/portacredenciales", label: "Portacredenciales y porta carnets" },
  { to: "/cordones-personalizados", label: "Cordones personalizados" },
  { to: "/soportes-acrilicos-escritorio", label: "Soportes acrílicos de escritorio" },
  { to: "/soportes-acrilicos-pared", label: "Habladores de pared" },
  { to: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
];

export default function NotFound() {
  return (
    <div className={styles.page}>
      <Seo
        title="Página no encontrada | IMPORTVIDE"
        description="La página que buscas no existe. Revisa nuestros portacredenciales, cordones y soportes acrílicos o escríbenos por WhatsApp."
        path="/404"
        noindex
      />
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>No encontramos esta página</h1>
        <p className={styles.lead}>
          Puede que el enlace esté mal escrito o que la página ya no exista. Esto es lo que más
          buscan nuestros clientes:
        </p>
        <div className={styles.card}>
          <ul className={styles.list}>
            {SUGERENCIAS.map((s) => (
              <li key={s.to}><Link to={s.to}>{s.label}</Link></li>
            ))}
          </ul>
          <div className={styles.actions}>
            <Link to="/" className={styles.secondaryBtn}>Ir al inicio</Link>
            <a
              href={whatsappUrl("Hola IMPORTVIDE! Estaba buscando un producto en la web.")}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
              data-ubicacion="404"
            >
              <WhatsAppIcon />
              Preguntar por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
