import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Header.module.css";

export default function Header() {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* Logo */}
        <Link to="/" className={styles.logoLink}>
          <span className={styles.logoImport}>IMPORT</span>
          <span className={styles.logoVide}>VIDE</span>
        </Link>

        {/* Nav + Auth agrupados a la derecha */}
        <div className={styles.right}>
          <nav className={styles.nav}>
            <a href="#productos" className={styles.navLink}>Productos</a>
            <a href="#contacto" className={styles.navLink}>Contacto</a>
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
        </div>

      </div>
    </header>
  );
}
