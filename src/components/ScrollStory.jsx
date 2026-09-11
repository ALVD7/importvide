import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks/useInView";
import styles from "./ScrollStory.module.css";

const STEPS = [
  {
    n: "01",
    title: "Importación directa",
    text: "Traemos el contenedor desde fábrica. Sin intermediarios que inflen el precio antes de que llegue a tus manos.",
  },
  {
    n: "02",
    title: "Stock real en bodega",
    text: "No esperas noventa días por una importación: la mercadería ya está en Guayaquil, lista para despacho inmediato.",
  },
  {
    n: "03",
    title: "Precio por volumen",
    text: "Cotización escalonada por cantidad. Mientras más unidades pides, mejor es el margen que te queda a ti.",
  },
  {
    n: "04",
    title: "Envío a todo Ecuador",
    text: "Quito, Cuenca, Manta o donde estés. Coordinamos la entrega y facturamos para empresas e instituciones.",
  },
];

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

export default function ScrollStory() {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const stepRef = useRef(0);
  const [step, setStep] = useState(0);
  const [reduced] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (reduced) return;

    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    let raf = 0;
    let running = false;
    let smoothed = 0;

    // Safari en iOS no decodifica el video hasta el primer play(): se dispara
    // uno silencioso y se pausa al instante para dejarlo listo para hacer seek.
    const primeVideo = () => {
      const played = video.play();
      if (played && typeof played.then === "function") {
        played.then(() => video.pause()).catch(() => {});
      } else {
        video.pause();
      }
    };

    const frame = () => {
      const rect = wrap.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;

      wrap.style.setProperty("--progress", progress.toFixed(4));

      const idx = clamp(Math.floor(progress * STEPS.length), 0, STEPS.length - 1);
      if (idx !== stepRef.current) {
        stepRef.current = idx;
        setStep(idx);
      }

      const { duration } = video;
      if (duration && Number.isFinite(duration)) {
        // Se persigue el tiempo objetivo con interpolación: el seek del video
        // llega con retraso y sin esto el scrub se ve a tirones.
        const target = progress * (duration - 0.06);
        smoothed += (target - smoothed) * 0.14;
        if (Math.abs(target - smoothed) < 0.004) smoothed = target;
        if (Math.abs(video.currentTime - smoothed) > 0.012) {
          video.currentTime = smoothed;
        }
      }

      raf = requestAnimationFrame(frame);
    };

    // El bucle solo corre mientras la sección está en pantalla.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          primeVideo();
          raf = requestAnimationFrame(frame);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "120px 0px" }
    );

    io.observe(wrap);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section className={`${styles.wrap} ${reduced ? styles.static : ""}`} ref={wrapRef}>
      <div className={styles.sticky}>
        <video
          className={styles.video}
          ref={videoRef}
          src="/video/orbit-scrub.mp4"
          muted
          playsInline
          preload="auto"
          tabIndex={-1}
          aria-hidden="true"
        />
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />

        <div className={styles.inner}>
          <header className={styles.head}>
            <span className={styles.kicker}>Cómo trabajamos</span>
            <h2 className={styles.heading}>
              De la fábrica a tu bodega,
              <br />
              <em className={styles.em}>sin escalas</em>
            </h2>
          </header>

          <div className={styles.steps}>
            {STEPS.map((s, i) => (
              <article
                key={s.n}
                className={`${styles.step} ${i === step ? styles.stepActive : ""}`}
              >
                <span className={styles.stepN}>{s.n}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepText}>{s.text}</p>
              </article>
            ))}
          </div>

          <ol className={styles.rail} aria-hidden="true">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                className={`${styles.railItem} ${i <= step ? styles.railDone : ""}`}
              >
                <span className={styles.railBar} />
                <span className={styles.railLabel}>{s.n}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
