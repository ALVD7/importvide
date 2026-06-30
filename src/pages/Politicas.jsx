import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./Politicas.module.css";

export default function Politicas() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <Link to="/" className={styles.breadcrumb}>← Volver al inicio</Link>

        <h1 className={styles.title}>Política de Devoluciones</h1>
        <p className={styles.updated}>Última actualización: mayo 2026</p>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Política general</h2>
          <p className={styles.text}>
            En <strong>IMPORTVIDE</strong> nos esforzamos por ofrecer productos de calidad. Sin embargo, debido a la naturaleza de las importaciones, <strong>no realizamos devoluciones ni reembolsos</strong> una vez que el pedido ha sido despachado, salvo en los casos específicos detallados a continuación.
          </p>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Casos en los que sí aplica una solución</h2>
          <div className={styles.caseItem}>
            <span className={styles.caseIcon}>📦</span>
            <div>
              <p className={styles.caseTitle}>Pedido perdido en tránsito</p>
              <p className={styles.text}>Si tu pedido no llega y se confirma que se perdió durante el envío, coordinamos contigo una solución (reenvío o reembolso según el caso).</p>
            </div>
          </div>
          <div className={styles.caseItem}>
            <span className={styles.caseIcon}>🚨</span>
            <div>
              <p className={styles.caseTitle}>Producto totalmente dañado o con daño significativo</p>
              <p className={styles.text}>Si el producto llega totalmente dañado o con una parte significativa dañada que lo haga inservible, también aplicamos una solución. Daños menores de empaque durante el transporte no califican.</p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>¿Cómo reportar un problema?</h2>
          <p className={styles.text}>
            Escríbenos por <strong>WhatsApp</strong> dentro de las <strong>48 horas</strong> de recibido el pedido (o de haber detectado la pérdida), adjuntando:
          </p>
          <ul className={styles.list}>
            <li>Foto o video del producto dañado</li>
            <li>Foto del empaque tal como llegó</li>
            <li>Número de pedido o comprobante de compra</li>
          </ul>
          <p className={styles.text}>Revisaremos tu caso y te daremos una respuesta en menos de 24 horas hábiles.</p>
          <a
            href="https://wa.me/593980118073"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Contactar por WhatsApp
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
