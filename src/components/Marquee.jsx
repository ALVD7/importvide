import styles from "./Marquee.module.css";

const ITEMS = [
  "Portacredenciales",
  "Lanyards y cintas",
  "Habladores acrílicos",
  "Clips metálicos",
  "Fundas de PVC",
  "Credenciales para eventos",
  "Porta carnet",
  "Acrílico A4",
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
