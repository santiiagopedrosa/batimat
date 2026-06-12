import { Navigate, NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { isLoggedIn, clearToken } from '../api.js';
import styles from './admin.module.css';

const links = [
  { to: '/admin/projetos', label: 'Projetos' },
  { to: '/admin/textos', label: 'Textos do site' },
  { to: '/admin/leads', label: 'Pedidos de contacto' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  function logout() {
    clearToken();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sideBrand}>
          BATI<em>MAT</em>
          <span className={styles.sideBrandSub}>Backoffice</span>
        </div>

        <nav className={styles.sideNav}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `${styles.sideLink} ${isActive ? styles.sideLinkActive : ''}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sideFoot}>
          <Link to="/" className={styles.sideFootLink}>← Ver site</Link>
          <button className={styles.sideFootLink} onClick={logout}>
            Terminar sessão
          </button>
        </div>
      </aside>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
