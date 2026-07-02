import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import { productJsonLd, faqJsonLd, breadcrumbJsonLd } from "../lib/structuredData";
import { CATALOG } from "../data/seoPages";
import { WHATSAPP_NUMBER } from "../data/products";
import styles from "./SeoLanding.module.css";

export default function SeoLanding({ page }) {
  const products = page.products.map((key) => CATALOG[key]);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola IMPORTVIDE! Vi la página de ${page.h1} y quiero una cotización.`
  )}`;

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Inicio", path: "/" },
      { name: page.h1, path: `/${page.slug}` },
    ]),
    faqJsonLd(page.faqs),
    ...products.map(productJsonLd),
  ];

  return (
    <div className={styles.page}>
      <Seo
        title={page.title}
        description={page.description}
        path={`/${page.slug}`}
        image={products[0]?.img}
        jsonLd={jsonLd}
      />
      <Header />

      <main className={styles.main}>
        <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
          <Link to="/">Inicio</Link> <span aria-hidden="true">›</span> {page.h1}
        </nav>

        <h1 className={styles.h1}>{page.h1}</h1>
        {page.intro.map((p, i) => (
          <p key={i} className={styles.intro}>{p}</p>
        ))}

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
          Cotizar por WhatsApp
        </a>

        {/* Productos del catálogo relacionados */}
        <section className={styles.productsSection}>
          <h2 className={styles.h2}>Productos disponibles en stock</h2>
          <div className={styles.productGrid}>
            {products.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className={styles.productCard}>
                <img
                  src={p.img}
                  alt={p.alt}
                  className={styles.productImg}
                  loading="lazy"
                  width="280"
                  height="280"
                />
                <span className={styles.productName}>{p.name}</span>
                <span className={styles.productPrice}>$ {p.price.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </section>

        {page.sections.map((s, i) => (
          <section key={i} className={styles.section}>
            <h2 className={styles.h2}>{s.h2}</h2>
            {s.paras.map((p, j) => (
              <p key={j} className={styles.para}>{p}</p>
            ))}
            {s.bullets && (
              <ul className={styles.list}>
                {s.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {page.gallery?.length > 0 && (
          <section className={styles.section}>
            <div className={styles.gallery}>
              {page.gallery.map((g, i) => (
                <figure key={i} className={styles.galleryItem}>
                  <img src={g.src} alt={g.alt} loading="lazy" width="380" height="285" className={styles.galleryImg} />
                  <figcaption className={styles.caption}>{g.alt}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.h2}>Preguntas frecuentes</h2>
          <div className={styles.faqList}>
            {page.faqs.map((f, i) => (
              <details key={i} className={styles.faq}>
                <summary className={styles.faqQ}>{f.q}</summary>
                <p className={styles.faqA}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.ctaBox}>
          <p className={styles.ctaText}>
            ¿Listo para cotizar? Escríbenos con el modelo y la cantidad que necesitas.
          </p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
            Cotizar por WhatsApp
          </a>
        </section>

        <nav className={styles.related} aria-label="Páginas relacionadas">
          <h2 className={styles.h2}>También te puede interesar</h2>
          <ul className={styles.relatedList}>
            {page.related.map((r, i) => (
              <li key={i}>
                <Link to={r.to} className={styles.relatedLink}>{r.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>

      <Footer />
    </div>
  );
}
