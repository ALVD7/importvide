import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { buildWhatsAppLink } from "../data/products";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./ProductDetail.module.css";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setProduct(data ?? null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>Cargando producto...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.notFound}>
          <p>Producto no encontrado.</p>
          <Link to="/" className={styles.backLink}>← Volver al catálogo</Link>
        </div>
      </div>
    );
  }

  const allImages = product.images?.length
    ? product.images
    : product.image ? [product.image] : [];

  const prev = () => setCurrentIdx((i) => (i - 1 + allImages.length) % allImages.length);
  const next = () => setCurrentIdx((i) => (i + 1) % allImages.length);

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <Link to="/" className={styles.breadcrumb}>← Volver al catálogo</Link>

        <div className={styles.layout}>
          {/* Carrusel */}
          <div className={styles.imageCol}>
            <div className={styles.carousel}>
              {allImages.length > 0 ? (
                <>
                  <img
                    key={currentIdx}
                    src={allImages[currentIdx]}
                    alt={`${product.name} ${currentIdx + 1}`}
                    className={styles.mainImage}
                  />
                  {allImages.length > 1 && (
                    <>
                      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M8 5l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <div className={styles.dots}>
                        {allImages.map((_, i) => (
                          <button
                            key={i}
                            className={`${styles.dot} ${i === currentIdx ? styles.dotActive : ""}`}
                            onClick={() => setCurrentIdx(i)}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className={styles.imagePlaceholder}>Sin imagen</div>
              )}
            </div>

            {/* Miniaturas */}
            {allImages.length > 1 && (
              <div className={styles.thumbs}>
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === currentIdx ? styles.thumbActive : ""}`}
                    onClick={() => setCurrentIdx(i)}
                  >
                    <img src={src} alt={`thumb-${i}`} className={styles.thumbImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className={styles.infoCol}>
            {product.category && (
              <span className={styles.category}>{product.category}</span>
            )}
            <h1 className={styles.name}>{product.name}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>$ {Number(product.price).toFixed(2)}</span>
            </div>

            <div className={styles.stockWrap}>
              {product.stock > 0 ? (
                <span className={styles.inStock}>✔ {product.stock} disponibles</span>
              ) : (
                <span className={styles.outStock}>Sin stock</span>
              )}
            </div>

            {product.description && (
              <div className={styles.descWrap}>
                <h2 className={styles.descTitle}>Descripción</h2>
                <p className={styles.desc}>{product.description}</p>
              </div>
            )}

            <a
              href={buildWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
