import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { Context } from '../../context/UserContext';
import styles from './Navbar.module.css';
import Logo from '../../assets/image/logo-placeholder-image.png';

//FIXME: logo is giant line:17

function Navbar() {
    const { authenticated, logout } = useContext(Context)

  return (
    <nav className={styles.navbar}>
        <Link to={authenticated ? '/dashboard' : '/'}>
            <div className={styles["navbar-logo"]}>
                {/* <img src={Logo} alt="Logo" /> */}
                <h2>TechCota</h2>
            </div>
        </Link>
      <ul className={styles["navbar-links"]}>
        {authenticated ? (
          <>
            <li>
              <Link to="/dashboard" className={styles["nav-link"]}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/budget/" className={styles["nav-link"]}>
                Orçamentos
              </Link>
            </li>
            <li>
              <Link to="/settings" className={styles["nav-link"]}>
                Configurações
              </Link>
            </li>
            <li>
              <span onClick={logout} className={styles["nav-link"]}>
                Sair
              </span>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className={styles["nav-link"]}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className={styles["nav-link"]}>
                Cadastrar
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
