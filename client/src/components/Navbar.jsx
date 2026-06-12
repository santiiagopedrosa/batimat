import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styles from './components.module.css';

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/projetos', label: 'Projetos' },
  { to: '/contactos', label: 'Contactos' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <Link to="/" className={styles.logo} onClick={() => setOpen(false)}>
          <span className={styles.logoMark}>
            BATI<span>MAT</span>
          </span>
          <span className={styles.logoSub}>Construção civil</span>
        </Link>

        <button
          className={styles.burger}
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span /><span /><span />
        </button>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/contactos" className={styles.navCta} onClick={() => setOpen(false)}>
            Pedir orçamento
          </Link>
        </nav>
      </div>
    </header>
  );
}
