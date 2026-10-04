import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { STATIC_PAGES, FAQ_GROUPS } from "../data/staticPages";
import { faqJsonLd, breadcrumbJsonLd } from "../lib/structuredData";
import styles from "./Info.module.css";

const PAGE = STATIC_PAGES.faq;
const CRUMBS = [
  { name: "Inicio", path: "/" },
  { name: PAGE.h1, path: PAGE.path },
];

export default function PreguntasFrecuentes() {
  return (
    <div className={styles.page}>
      <Seo
        title={PAGE.title}
        description={PAGE.description}
        path={PAGE.path}
        jsonLd={[breadcrumbJsonLd(CRUMBS), faqJsonLd(FAQ_GROUPS.flatMap((g) => g.faqs))]}
      />
      <Header />
      <main className={styles.main}>
        <Breadcrumbs items={CRUMBS} />
        <h1 className={styles.title}>{PAGE.h1}</h1>
        <p className={styles.lead}>
          Lo que más nos preguntan colegios, empresas, bancos y organizadores de eventos antes de
          comprar portacredenciales, cordones y soportes acrílicos. ¿No encuentras tu respuesta?{" "}
          <Link to="/cotizar">Escríbenos</Link>.
        </p>

        {FAQ_GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className={styles.groupTitle}>{group.title}</h2>
            {group.faqs.map((f) => (
              <details key={f.q} className={styles.faq}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
