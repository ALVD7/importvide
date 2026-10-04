import { Link } from "react-router-dom";
import styles from "./Breadcrumbs.module.css";

// Migas de pan visibles. Recibe los mismos items que breadcrumbJsonLd() para
// que lo que ve el usuario y lo que lee Google coincidan siempre.
export default function Breadcrumbs({ items }) {
  return (
    <nav className={styles.nav} aria-label="Ruta de navegación">
      <ol className={styles.list}>
        {items.map((it, i) => (
          <li key={it.path} className={styles.item}>
            {i < items.length - 1 ? (
              <Link to={it.path}>{it.name}</Link>
            ) : (
              <span aria-current="page">{it.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
