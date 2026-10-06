import styles from "./Marquee.module.css";

const ITEMS = [
  "Porta credencial rígido",
  "Porta credencial de acrílico",
  "Porta credencial deslizable",
  "Porta credencial tipo caparazón",
  "Porta credencial flexible para eventos",
  "Porta credencial flexible para carnet",
  "Cordones en varios colores",
  "Habladores de acrílico para pared",
  "Habladores de acrílico para escritorio",
];

export default function Marquee() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.track}>
        {[0, 1].map((copy) => (
          <ul className={styles.list} key={copy}>
            {ITEMS.map((item) => (
              <li className={styles.item} key={item}>
                <span className={styles.star}>✳</span>
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
