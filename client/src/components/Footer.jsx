import { Link } from 'react-router-dom';
import styles from './components.module.css';

export default function Footer({ settings }) {
  const contacts = settings?.contacts || {};
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="tape" />
      <div className={`container ${styles.footerGrid}`}>
        <div>
          <div className={styles.footerBrand}>
            BATI<em>MAT</em>
          </div>
          <div className={styles.footerTagline}>
            {settings?.tagline || 'Construção civil e reabilitação'}
          </div>
        </div>

        <div>
          <div className={styles.footerTitle}>Navegação</div>
          <ul className={styles.footerList}>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/projetos">Projetos</Link></li>
            <li><Link to="/contactos">Contactos</Link></li>
          </ul>
        </div>

        <div>
          <div className={styles.footerTitle}>Contactos</div>
          <ul className={styles.footerList}>
            {contacts.phone && (
              <li><a href={`tel:${contacts.phone.replace(/\s/g, '')}`}>{contacts.phone}</a></li>
            )}
            {contacts.mobile && (
              <li><a href={`tel:${contacts.mobile.replace(/\s/g, '')}`}>{contacts.mobile}</a></li>
            )}
            {contacts.email && (
              <li><a href={`mailto:${contacts.email}`}>{contacts.email}</a></li>
            )}
            {contacts.address && (
              <li style={{ whiteSpace: 'pre-line' }}>{contacts.address}</li>
            )}
          </ul>
        </div>
      </div>

      <div className="container">
        <div className={styles.footerBottom}>
          <span>© {year} BATIMAT — Todos os direitos reservados</span>
          <Link to="/admin/login">Área de gestão</Link>
        </div>
      </div>
    </footer>
  );
}
