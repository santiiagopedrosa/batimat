import { useOutletContext } from 'react-router-dom';
import LeadForm from '../components/LeadForm.jsx';
import styles from './pages.module.css';

export default function Contactos() {
  const { settings } = useOutletContext();
  const contacts = settings?.contacts || {};

  return (
    <>
      <section className={styles.pageHead}>
        <div className="container">
          <span className="eyebrow">Contactos</span>
          <h1 className={`display ${styles.pageTitle}`}>Fale connosco</h1>
          <p className={styles.pageLead}>
            Peça um orçamento sem compromisso ou tire dúvidas sobre o seu
            projeto. Respondemos em 1–2 dias úteis.
          </p>
        </div>
      </section>

      <section>
        <div className={`container ${styles.contactGrid}`}>
          <div className={styles.contactCard}>
            <div className="tape" />
            <div className={styles.contactBody}>
              {contacts.phone && (
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Telefone</span>
                  <a className={styles.contactValue} href={`tel:${contacts.phone.replace(/\s/g, '')}`}>
                    {contacts.phone}
                  </a>
                </div>
              )}
              {contacts.mobile && (
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Telemóvel</span>
                  <a className={styles.contactValue} href={`tel:${contacts.mobile.replace(/\s/g, '')}`}>
                    {contacts.mobile}
                  </a>
                </div>
              )}
              {contacts.email && (
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Email</span>
                  <a className={styles.contactValue} href={`mailto:${contacts.email}`}>
                    {contacts.email}
                  </a>
                </div>
              )}
              {contacts.address && (
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Morada</span>
                  <span className={styles.contactValue}>{contacts.address}</span>
                </div>
              )}
              {contacts.schedule && (
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Horário</span>
                  <span className={styles.contactValue}>{contacts.schedule}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
