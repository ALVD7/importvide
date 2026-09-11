import { useEffect, useRef, useState } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Marca el elemento como visible la primera vez que entra en pantalla.
// Con motion reducido entra ya visible: nunca se queda contenido oculto.
export function useInView({ threshold = 0.18, rootMargin = "0px 0px -12% 0px", once = true } = {}) {
  const ref = useRef(null);
  const [skip] = useState(
    () => prefersReducedMotion() || typeof IntersectionObserver === "undefined"
  );
  const [inView, setInView] = useState(skip);

  useEffect(() => {
    if (skip) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [skip, threshold, rootMargin, once]);

  return [ref, inView];
}
