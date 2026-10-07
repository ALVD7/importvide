import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { STATIC_PAGES } from "../data/staticPages";
import { BUSINESS, whatsappUrl } from "../data/business";
import { breadcrumbJsonLd, localBusinessJsonLd } from "../lib/structuredData";
import styles from "./Info.module.css";

const PAGE = STATIC_PAGES.contacto;
const CRUMBS = [
  { name: "Inicio", path: "/" },
  { name: PAGE.h1, path: PAGE.path },
];

export default function Contacto() {
  return (
    <div className={styles.page}>
      <Seo
        title={PAGE.title}
        description={PAGE.description}
        path={PAGE.path}
        jsonLd={[breadcrumbJsonLd(CRUMBS), localBusinessJsonLd()]}
      />
      <Header />
      <main className={styles.main}>
        <Breadcrumbs items={CRUMBS} />
        <h1 className={styles.title}>{PAGE.h1}</h1>
        <p className={styles.lead}>
          Cotizamos portacredenciales, cordones y soportes acrílicos al por mayor para colegios,
          bancos, empresas, entidades públicas y eventos. La forma más rápida de recibir tu
          cotización es WhatsApp.
        </p>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Cotiza por WhatsApp</h2>
          <p className={styles.text}>
            Indícanos producto, modelo, color, cantidad y la ciudad de entrega.
          </p>
          <div className={styles.actions}>
            <a
              href={whatsappUrl("Hola IMPORTVIDE! Quiero una cotización.")}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
              data-ubicacion="contacto"
            >
              <WhatsAppIcon />
              Escribir por WhatsApp
            </a>
            <Link to="/cotizar" className={styles.secondaryBtn}>
              Usar el formulario
            </Link>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Datos de contacto</h2>
          <dl className={styles.dataList}>
            <dt>Empresa</dt>
            <dd>{BUSINESS.name}</dd>
            <dt>WhatsApp y teléfono</dt>
            <dd>
              <a href={`tel:${BUSINESS.phone}`} data-ubicacion="contacto">{BUSINESS.phoneDisplay}</a>
            </dd>
            {BUSINESS.email && (
              <>
                <dt>Correo</dt>
                <dd>
                  <a href={`mailto:${BUSINESS.email}`} data-ubicacion="contacto">{BUSINESS.email}</a>
                </dd>
              </>
            )}
            <dt>Ubicación</dt>
            <dd>{BUSINESS.city}, {BUSINESS.region}, Ecuador.</dd>
            <dt>Cobertura</dt>
            <dd>Envíos a todo el país</dd>
            <dt>Instagram</dt>
            <dd>
              <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer">@importvide</a>
            </dd>
          </dl>
        </div>

        {(BUSINESS.googleBusinessUrl || BUSINESS.googleReviewUrl) && (
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Encuéntranos en Google</h2>
            <div className={styles.actions}>
              {BUSINESS.googleBusinessUrl && (
                <a href={BUSINESS.googleBusinessUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryBtn}>
                  Ver ficha en Google
                </a>
              )}
              {BUSINESS.googleReviewUrl && (
                <a href={BUSINESS.googleReviewUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryBtn} data-evento="review_click">
                  Déjanos tu reseña
                </a>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
