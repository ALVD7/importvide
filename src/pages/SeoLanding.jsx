import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import { productJsonLd, faqJsonLd, breadcrumbJsonLd } from "../lib/structuredData";
import { CATALOG, PENDING_SPEC, heroVideo } from "../data/seoPages";
import { WHATSAPP_NUMBER } from "../data/products";
import styles from "./SeoLanding.module.css";

export default function SeoLanding({ page }) {
  const products = page.products.map((key) => CATALOG[key]);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola IMPORTVIDE! Vi la página de ${page.h1} y quiero una cotización.`
  )}`;
  const video = heroVideo(page.slug);
  const [leadIntro, ...restIntro] = page.intro;

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

      <header className={styles.hero}>
        <video
          className={styles.heroVideo}
          src={video.src}
          poster={video.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          aria-hidden="true"
        />
        <div className={styles.heroScrim} aria-hidden="true" />
        <div className={styles.heroGrain} aria-hidden="true" />

        <div className={styles.heroInner}>
          <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
            <Link to="/">Inicio</Link> <span aria-hidden="true">›</span> {page.h1}
          </nav>

          <h1 className={styles.h1}>{page.h1}</h1>
          <p className={styles.heroIntro}>{leadIntro}</p>

          <div className={styles.heroActions}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryBtn}
              data-producto={page.h1}
              data-ubicacion="hero"
            >
              Cotizar por WhatsApp
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className={styles.ghostBtn} href="#productos">Ver productos</a>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {restIntro.map((p, i) => (
          <Reveal as="p" key={i} className={styles.lead}>{p}</Reveal>
        ))}

        <section className={styles.productsSection} id="productos">
          <Reveal as="h2" className={styles.h2}>Productos disponibles en stock</Reveal>
          <div className={styles.productGrid}>
            {products.map((p, i) => (
              <Reveal key={p.id} variant="blur" delay={(i % 4) * 80}>
                <Link to={`/product/${p.id}`} className={styles.productCard}>
                  <span className={styles.productImgWrap}>
                    <img
                      src={p.img}
                      alt={p.alt}
                      className={styles.productImg}
                      loading="lazy"
                      width="280"
                      height="280"
                    />
                  </span>
                  <span className={styles.productName}>{p.name}</span>
                  <span className={styles.productPrice}>$ {p.price.toFixed(2)}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {page.specs?.length > 0 && (
          <section className={styles.section}>
            <Reveal as="h2" className={styles.h2}>Ficha técnica</Reveal>
            <Reveal as="dl" delay={40} className={styles.specs}>
              {page.specs.map((spec) => (
                <div key={spec.label} className={styles.specRow}>
                  <dt>{spec.label}</dt>
                  <dd className={spec.value ? undefined : styles.specPending}>{spec.value ?? PENDING_SPEC}</dd>
                </div>
              ))}
            </Reveal>
          </section>
        )}

        {page.sections.map((s, i) => (
          <section key={i} className={styles.section}>
            <Reveal as="h2" className={styles.h2}>{s.h2}</Reveal>
            {s.paras.map((p, j) => (
              <Reveal as="p" key={j} delay={40} className={styles.para}>{p}</Reveal>
            ))}
            {s.bullets && (
              <Reveal as="ul" delay={60} className={styles.list}>
                {s.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </Reveal>
            )}
          </section>
        ))}

        {page.gallery?.length > 0 && (
          <section className={styles.section}>
            <div className={styles.gallery}>
              {page.gallery.map((g, i) => (
                <Reveal key={i} variant="scale" delay={(i % 3) * 90}>
                  <figure className={styles.galleryItem}>
                    <span className={styles.galleryImgWrap}>
                      <img src={g.src} alt={g.alt} loading="lazy" width="380" height="285" className={styles.galleryImg} />
                    </span>
                    <figcaption className={styles.caption}>{g.alt}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <Reveal as="h2" className={styles.h2}>Preguntas frecuentes</Reveal>
          <div className={styles.faqList}>
            {page.faqs.map((f, i) => (
              <Reveal key={i} delay={(i % 4) * 60}>
                <details className={styles.faq}>
                  <summary className={styles.faqQ}>
                    {f.q}
                    <svg className={styles.faqIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <p className={styles.faqA}>{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal as="section" variant="scale" className={styles.ctaBox}>
          <p className={styles.ctaTitle}>¿Listo para cotizar?</p>
          <p className={styles.ctaText}>
            Escríbenos con el modelo y la cantidad que necesitas.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.primaryBtn}
            data-producto={page.h1}
            data-ubicacion="cierre"
          >
            Cotizar por WhatsApp
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <p className={styles.ctaAlt}>
            ¿Prefieres un formulario?{" "}
            <Link to={`/cotizar?producto=${page.slug}`}>Pide tu cotización aquí</Link>
          </p>
        </Reveal>

        <nav className={styles.related} aria-label="Páginas relacionadas">
          <Reveal as="h2" className={styles.h2}>También te puede interesar</Reveal>
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
