import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BUSINESS, whatsappUrl } from "../data/business";
import WhatsAppIcon from "./WhatsAppIcon";
import styles from "./Header.module.css";

// Íconos de trazo (heredan el color del texto)
const Icon = ({ children, size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const IconCarnet = () => <Icon><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M6.5 16c.5-1.3 1.4-2 2.5-2s2 .7 2.5 2M14 10h4M14 14h3" /></Icon>;
const IconCordon = () => <Icon><path d="M6 2l6 10 6-10" /><rect x="8.5" y="12" width="7" height="9" rx="1.5" /><path d="M12 12v-1" /></Icon>;
const IconAcrilico = () => <Icon><rect x="5" y="2.5" width="14" height="17" rx="1.5" /><path d="M8 7h8M8 11h8M8 15h5M4 21.5h16" /></Icon>;
const IconUsuario = () => <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6" /></Icon>;
const IconCotizar = () => <Icon><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></Icon>;
const IconTelefono = () => <Icon size={16}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></Icon>;
const IconReloj = () => <Icon size={16}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>;
const IconUbicacion = () => <Icon size={16}><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></Icon>;

// Enlaces del menú "⋯" (y del menú móvil, debajo de los principales)
const MAS_ENLACES = [
  { to: "/lanyards-ecuador", label: "Lanyards en stock" },
  { to: "/credenciales-para-eventos", label: "Credenciales para eventos" },
  { to: "/soportes-acrilicos-escritorio", label: "Soportes de escritorio" },
  { to: "/soportes-acrilicos-pared", label: "Habladores de pared" },
  { to: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { to: "/politicas", label: "Política de devoluciones" },
  { to: "/privacidad", label: "Privacidad" },
];

export default function Header() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [masOpen, setMasOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const masRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // El menú "⋯" se cierra al hacer clic fuera o con Escape.
  useEffect(() => {
    if (!masOpen) return;
    const fuera = (e) => {
      if (!masRef.current?.contains(e.target)) setMasOpen(false);
    };
    const escape = (e) => e.key === "Escape" && setMasOpen(false);
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", escape);
    };
  }, [masOpen]);

  const closeMenus = () => {
    setMenuOpen(false);
    setMasOpen(false);
  };

  const handleLogout = async () => {
    closeMenus();
    await signOut();
    navigate("/");
  };

  // El logo siempre lleva al inicio de la portada, incluso si ya estamos en ella
  // (en ese caso React Router no navegaría y la página se quedaría donde está).
  const goHome = (e) => {
    e.preventDefault();
    closeMenus();
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  // Productos vive en la portada: desde otra página se navega a "/" con el
  // hash y ScrollToTop se encarga de bajar a la sección.
  const goToSection = (e, id) => {
    e.preventDefault();
    closeMenus();
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`/#${id}`);
    }
  };

  const masEnlaces = [
    ...MAS_ENLACES,
    ...(role === "admin"
      ? [
          { to: "/admin/cotizaciones", label: "Cotizaciones (admin)", admin: true },
          { to: "/admin", label: "Panel de admin", admin: true },
        ]
      : []),
  ];

  return (
    <>
      {/* Franja superior con los datos de contacto */}
      <div className={styles.topbar}>
        <div className={styles.topInner}>
          <a href={`tel:${BUSINESS.phone}`} className={styles.topItem} data-ubicacion="barra-superior">
            <IconTelefono />
            <span>{BUSINESS.phoneDisplay}</span>
          </a>
          <a
            href={whatsappUrl("Hola IMPORTVIDE! Quiero una cotización.")}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.topItem}
            data-ubicacion="barra-superior"
          >
            <WhatsAppIcon size={16} />
            <span>Cotiza por WhatsApp</span>
          </a>
          <span className={`${styles.topItem} ${styles.topOptional}`}>
            <IconReloj />
            <span>Lun a vie, 08:00 a 17:00</span>
          </span>
          <Link to="/contacto" className={`${styles.topItem} ${styles.topOptional}`}>
            <IconUbicacion />
            <span>Guayaquil · Envíos a todo Ecuador</span>
          </Link>
        </div>
      </div>

      <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.inner}>
          <Link to="/" className={styles.logoLink} onClick={goHome} aria-label="IMPORTVIDE, ir al inicio">
            <img src="/img/marca/vd-blanco.png" alt="" className={styles.logoMark} width="562" height="295" />
          </Link>

          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Principal">
            <Link to="/portacredenciales" className={styles.pill} onClick={closeMenus}>
              <IconCarnet /><span>Portacredenciales</span>
            </Link>
            <Link to="/cordones-personalizados" className={styles.pill} onClick={closeMenus}>
              <IconCordon /><span>Cordones</span>
            </Link>
            <Link to="/habladores-acrilicos" className={styles.pill} onClick={closeMenus}>
              <IconAcrilico /><span>Acrílicos</span>
            </Link>
            <a href="/#productos" className={styles.pill} onClick={(e) => goToSection(e, "productos")}>
              Productos
            </a>
            <Link to="/contacto" className={styles.pill} onClick={closeMenus}>
              Contacto
            </Link>

            {user ? (
              <button type="button" className={styles.pill} onClick={handleLogout} title={user.email}>
                <IconUsuario /><span>Salir</span>
              </button>
            ) : (
              <Link to="/login" className={styles.pill} onClick={closeMenus} title="Entérate de nuestras nuevas ofertas creando tu cuenta">
                <IconUsuario /><span>Ingresar</span>
              </Link>
            )}

            {/* En móvil, el resto de enlaces va dentro del mismo panel */}
            <div className={styles.mobileMore}>
              {masEnlaces.map((l) => (
                <Link key={l.to} to={l.to} className={l.admin ? styles.mobileAdmin : undefined} onClick={closeMenus}>
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className={styles.actions}>
            <Link to="/cotizar" className={styles.pillWhite} onClick={closeMenus}>
              <IconCotizar /><span>Cotizar</span>
            </Link>

            <div className={styles.masWrap} ref={masRef}>
              <button
                type="button"
                className={styles.masBtn}
                onClick={() => setMasOpen((v) => !v)}
                aria-label="Más enlaces"
                aria-expanded={masOpen}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
                </svg>
              </button>
              {masOpen && (
                <div className={styles.masMenu} role="menu">
                  {user && <span className={styles.masUser}>{user.email}</span>}
                  {masEnlaces.map((l) => (
                    <Link key={l.to} to={l.to} role="menuitem" className={l.admin ? styles.masAdmin : undefined} onClick={closeMenus}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Hamburguesa (móvil y tablet) */}
            <button
              type="button"
              className={styles.menuBtn}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
