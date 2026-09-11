import { useInView } from "../hooks/useInView";
import styles from "./Reveal.module.css";

// Envoltorio de aparición al hacer scroll. `delay` en ms escalona hermanos.
export default function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${styles[variant]} ${inView ? styles.in : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
