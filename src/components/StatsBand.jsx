import { useEffect, useRef, useState } from "react";
import { useInView, prefersReducedMotion } from "../hooks/useInView";
import styles from "./StatsBand.module.css";

function Counter({ to, prefix = "", suffix = "" }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [reduced] = useState(() => prefersReducedMotion());
  const [value, setValue] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    if (!inView || reduced || done.current) return;
    done.current = true;

    const duration = 1500;
    const start = performance.now();
    let raf = 0;

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduced]);

  return (
    <span ref={ref} className={styles.number}>
      {prefix}
      {reduced ? to : value}
      {suffix}
    </span>
  );
}

export default function StatsBand({ productCount = 0 }) {
  const stats = [
    { to: productCount, suffix: "", label: "Productos en catálogo" },
    { to: 3, suffix: "", label: "Líneas: credenciales, lanyards y acrílicos" },
    { to: 24, suffix: "", label: "Provincias con cobertura de envío" },
  ];

  return (
    <section className={styles.band}>
      <div className={styles.inner}>
        {stats.map((s, i) => (
          <div className={styles.stat} key={s.label} style={{ transitionDelay: `${i * 80}ms` }}>
            <Counter to={s.to} suffix={s.suffix} />
            <span className={styles.label}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
