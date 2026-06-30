import { useRef, useEffect, useState } from "react";
import styles from "./HeroBanner.module.css";

export default function HeroBanner() {
  const heroRef = useRef(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const currentRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const hero = heroRef.current;

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      targetRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    const onLeave = () => {
      targetRef.current = { x: 0.5, y: 0.5 };
    };

    // Smooth interpolation loop
    const lerp = (a, b, t) => a + (b - a) * t;
    const tick = () => {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.06);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.06);
      setMouse({ ...currentRef.current });
      rafRef.current = requestAnimationFrame(tick);
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const dx = mouse.x - 0.5; // -0.5 to 0.5
  const dy = mouse.y - 0.5;

  // 3D tilt for the whole scene
  const tiltX = -dy * 18;
  const tiltY = dx * 18;

  // Each orb moves at its own depth
  const o1 = { x: dx * -80, y: dy * -80 };
  const o2 = { x: dx * 100, y: dy * 100 };
  const o3 = { x: dx * -50, y: dy * -50 };
  const o4 = { x: dx * 140, y: dy * 140 };
  const gridShift = { x: dx * 30, y: dy * 30 };
  const contentShift = { x: dx * -12, y: dy * -12 };

  return (
    <section className={styles.hero} ref={heroRef}>
      {/* 3D scene wrapper */}
      <div
        className={styles.scene}
        style={{
          transform: `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        }}
      >
        <div className={styles.bg} aria-hidden="true">
          <div
            className={styles.grid}
            style={{ transform: `translate(${gridShift.x}px, ${gridShift.y}px)` }}
          />
          <span
            className={`${styles.orb} ${styles.orb1}`}
            style={{ transform: `translate(${o1.x}px, ${o1.y}px)` }}
          />
          <span
            className={`${styles.orb} ${styles.orb2}`}
            style={{ transform: `translate(${o2.x}px, ${o2.y}px)` }}
          />
          <span
            className={`${styles.orb} ${styles.orb3}`}
            style={{ transform: `translate(${o3.x}px, ${o3.y}px)` }}
          />
          <span
            className={`${styles.orb} ${styles.orb4}`}
            style={{ transform: `translate(${o4.x}px, ${o4.y}px)` }}
          />
          {/* Extra sparkle rings */}
          <span
            className={`${styles.ring} ${styles.ring1}`}
            style={{ transform: `translate(${dx * 60}px, ${dy * 60}px)` }}
          />
          <span
            className={`${styles.ring} ${styles.ring2}`}
            style={{ transform: `translate(${dx * -40}px, ${dy * -40}px)` }}
          />
        </div>

        <div
          className={styles.content}
          style={{ transform: `translate(${contentShift.x}px, ${contentShift.y}px)` }}
        >
          <h1 className={styles.title}>
            Todo lo que tu negocio necesita,<br />
            <span className={styles.highlight}>lo importamos por ti</span>
          </h1>
          <p className={styles.subtitle}>
            Artículos de identificación y señalización para tu negocio.
          </p>
        </div>
      </div>
    </section>
  );
}
