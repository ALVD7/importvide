import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Header.module.css";

export default function Header() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Solo la portada tiene hero oscuro a pantalla completa: ahí la barra puede
  // arrancar transparente y volverse sólida al bajar.
  const overlay = pathname === "/" && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  // El logo siempre lleva al inicio de la portada, incluso si ya estamos en ella
  // (en ese caso React Router no navegaría y la página se quedaría donde está).
  const goHome = (e) => {
    e.preventDefault();
    closeMenu();
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  // Productos y Contacto viven en la portada: desde otra página se navega a "/"
  // con el hash y ScrollToTop se encarga de bajar a la sección.
  const goToSection = (e, id) => {
    e.preventDefault();
    closeMenu();
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <header className={`${styles.header} ${overlay ? styles.overlay : ""}`}>
      <div className={styles.inner}>

        {/* Logo */}
        <Link to="/" className={styles.logoLink} onClick={goHome}>
          <span className={styles.logoImport}>IMPORT</span>
          <span className={styles.logoVide}>VIDE</span>
        </Link>

        {/* Nav + Auth agrupados a la derecha */}
        <div className={styles.right}>
          <nav
            className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
            onClick={closeMenu}
          >
            <Link to="/portacredenciales" className={styles.navLink}>Portacredenciales</Link>
            <Link to="/lanyards-ecuador" className={styles.navLink}>Lanyards</Link>
            <Link to="/habladores-acrilicos" className={styles.navLink}>Habladores</Link>
            <a href="/#productos" className={styles.navLink} onClick={(e) => goToSection(e, "productos")}>Productos</a>
            <a href="/#contacto" className={styles.navLink} onClick={(e) => goToSection(e, "contacto")}>Contacto</a>
            {role === "admin" && (
              <Link to="/admin" className={styles.navLink} data-admin="true">
                ⚙ Admin
              </Link>
            )}
          </nav>

          {user ? (
            <div className={styles.userRow}>
              <span className={styles.userEmail}>{user.email}</span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Salir
              </button>
            </div>
          ) : (
            <div className={styles.loginWrap}>
              <Link to="/login" className={styles.loginBtn}>
                Ingresar
              </Link>
              <div className={styles.loginTooltip}>
                Entérate de nuestras nuevas ofertas creando tu cuenta!!!
              </div>
            </div>
          )}

          {/* Hamburguesa (solo móvil) */}
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
