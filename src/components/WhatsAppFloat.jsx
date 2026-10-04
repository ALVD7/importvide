import { useLocation } from "react-router-dom";
import WhatsAppIcon from "./WhatsAppIcon";
import { whatsappUrl } from "../data/business";
import { seoPages } from "../data/seoPages";
import styles from "./WhatsAppFloat.module.css";

const OCULTO_EN = ["/login", "/register", "/admin"];

// El mensaje prellenado depende de la página: en una landing nombra el
// producto y en una ficha incluye el enlace. El origen de la visita lo añade
// tracking.js al hacer clic.
function mensaje(pathname) {
  const landing = seoPages.find((p) => `/${p.slug}` === pathname);
  if (landing) return { texto: `Hola IMPORTVIDE! Quiero cotizar: ${landing.h1}.`, producto: landing.h1 };
  if (pathname.startsWith("/product/")) {
    return { texto: `Hola IMPORTVIDE! Quiero cotizar este producto: https://importvide.com${pathname}`, producto: undefined };
  }
  return { texto: "Hola IMPORTVIDE! Quiero una cotización.", producto: undefined };
}

export default function WhatsAppFloat() {
  const { pathname } = useLocation();
  if (OCULTO_EN.includes(pathname)) return null;
  const { texto, producto } = mensaje(pathname);

  return (
    <a
      href={whatsappUrl(texto)}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.float}
      aria-label="Cotizar por WhatsApp"
      data-producto={producto}
      data-ubicacion="boton-flotante"
    >
      <WhatsAppIcon size={28} />
      <span className={styles.label}>Cotizar</span>
    </a>
  );
}
