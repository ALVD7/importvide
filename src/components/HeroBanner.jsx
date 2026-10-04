import { useEffect, useRef } from "react";
import { WHATSAPP_NUMBER } from "../data/products";
import { prefersReducedMotion } from "../hooks/useInView";
import styles from "./HeroBanner.module.css";

const LINE_1 = ["Todo", "lo", "que", "tu", "negocio", "necesita,"];
const LINE_2 = ["lo", "importamos", "por", "ti"];

const TRUST = [
  "Importación directa",
  "Stock en Guayaquil",
  "Envíos a todo Ecuador",
];

export default function HeroBanner() {
  const mediaRef = useRef(null);
  const contentRef = useRef(null);
  const glowRef = useRef(null);

  // Parallax de scroll: el video se acerca mientras el texto sube y se apaga.
  // Se escribe directo en el DOM para no re-renderizar React en cada frame.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const p = Math.min(window.scrollY / window.innerHeight, 1);
      const eased = p * p;
      if (mediaRef.current) {
        mediaRef.current.style.transform = `scale(${1 + eased * 0.22}) translate3d(0, ${p * 60}px, 0)`;
      }
      if (contentRef.current) {
        contentRef.current.style.transform = `translate3d(0, ${p * -90}px, 0)`;
        contentRef.current.style.opacity = String(Math.max(1 - p * 1.4, 0));
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // El resplandor naranja sigue al puntero (solo con ratón).
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const target = { x: 0.5, y: 0.45 };
    const current = { x: 0.5, y: 0.45 };
    let raf = 0;

    const onMove = (e) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${(current.x - 0.5) * 140}px, ${(current.y - 0.5) * 110}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Cada palabra entra 70 ms después de la anterior, contando las dos líneas
  // como una sola secuencia.
  const renderLine = (words, offset, highlight) =>
    words.map((w, i) => {
      const delay = 260 + (offset + i) * 70;
      return (
        <span className={styles.wordMask} key={`${w}-${offset + i}`}>
          <span
            className={`${styles.word} ${highlight ? styles.highlight : ""}`}
            style={{ animationDelay: `${delay}ms` }}
          >
            {w}
          </span>
        </span>
      );
    });

  return (
    <section className={styles.hero}>
      <div className={styles.media} ref={mediaRef} aria-hidden="true">
        <video
          className={styles.video}
          src="/video/hero-loop.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
        />
        <div className={styles.scrim} />
        <div className={styles.glow} ref={glowRef} />
        <div className={styles.grain} />
      </div>

      <div className={styles.content} ref={contentRef}>
        <span className={styles.eyebrow}>
          <span className={styles.dot} />
          Importador directo · Guayaquil, Ecuador
        </span>

        {/* El eslogan es el texto grande, pero el H1 es la frase con las palabras
            clave: es lo que Google usa para entender de qué trata la portada. */}
        <p className={styles.title}>
          <span className={styles.line}>{renderLine(LINE_1, 0, false)}</span>
          <span className={styles.line}>{renderLine(LINE_2, LINE_1.length, true)}</span>
        </p>

        <div className={styles.subtitle}>
          <h1 className={styles.subtitleH1}>
            Portacredenciales, cordones y soportes acrílicos al por mayor en Ecuador.
          </h1>{" "}
          Importamos el volumen, tú te quedas con el margen.
        </div>

        <div className={styles.actions}>
          <a
            className={styles.primaryBtn}
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Cotizar por WhatsApp</span>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <a className={styles.ghostBtn} href="#productos">
            Ver catálogo
          </a>
        </div>

        <ul className={styles.trust}>
          {TRUST.map((t) => (
            <li key={t} className={styles.trustItem}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {t}
            </li>
          ))}
        </ul>
      </div>

      <a className={styles.scrollCue} href="#productos" aria-label="Bajar al catálogo">
        <span className={styles.scrollTrack}>
          <span className={styles.scrollDot} />
        </span>
      </a>
    </section>
  );
}
