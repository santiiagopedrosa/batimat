import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import LeadForm from '../components/LeadForm.jsx';
import styles from './pages.module.css';

export default function ProjetoDetalhe() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setProject(null);
    setError('');
    api.getProject(slug).then(setProject).catch((e) => setError(e.message));
  }, [slug]);

  if (error) {
    return (
      <div className="container">
        <div className={styles.pageHead}>
          <h1 className={`display ${styles.pageTitle}`}>Projeto não encontrado</h1>
          <p className={styles.pageLead}>{error}</p>
          <p style={{ marginTop: 24 }}>
            <Link to="/projetos" className="btn">Voltar aos projetos</Link>
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return <div className={styles.loading}>A carregar projeto…</div>;
  }

  return (
    <>
      <section className={styles.pageHead}>
        <div className="container">
          <span className="eyebrow">
            {project.category} · {project.year}
          </span>
          <h1 className={`display ${styles.pageTitle}`}>{project.title}</h1>
        </div>
      </section>

      <div className="container">
        {project.cover && (
          <div className={styles.detailCover}>
            <img src={project.cover} alt={project.title} />
          </div>
        )}

        {project.exclusive ? (
          /* ---------- Projeto reservado: teaser + formulário ---------- */
          <div className={styles.detailGrid}>
            <div className={styles.reservedBox}>
              <div className="tape" />
              <div className={styles.reservedBody}>
                <h2 className={styles.reservedTitle}>Projeto reservado</h2>
                <p className={styles.reservedText}>
                  {project.shortDescription}
                </p>
                <p className={styles.reservedText}>
                  Por compromisso com o cliente, os detalhes desta obra não são
                  publicados. Deixe-nos os seus dados e enviamos a apresentação
                  completa do projeto, com fotografias e ficha técnica.
                </p>
                <LeadForm
                  project={project}
                  messagePlaceholder="Gostaria de receber mais informação sobre este projeto…"
                />
              </div>
            </div>

            <aside className={styles.specSheet}>
              <div className={styles.specHead}>Ficha de obra</div>
              <Spec label="Categoria" value={project.category} />
              <Spec label="Localização" value={project.location} />
              <Spec label="Ano" value={project.year} />
            </aside>
          </div>
        ) : (
          /* ---------- Projeto público: descrição completa + galeria ---------- */
          <>
            <div className={styles.detailGrid}>
              <div className={styles.detailText}>
                <p>{project.description}</p>
              </div>
              <aside className={styles.specSheet}>
                <div className={styles.specHead}>Ficha de obra</div>
                <Spec label="Categoria" value={project.category} />
                <Spec label="Localização" value={project.location} />
                <Spec label="Ano" value={project.year} />
                <Spec label="Área" value={project.area} />
              </aside>
            </div>

            {project.gallery?.length > 0 && (
              <div className={styles.gallery}>
                {project.gallery.map((src, i) => (
                  <img key={i} src={src} alt={`${project.title} — fotografia ${i + 1}`} loading="lazy" />
                ))}
              </div>
            )}
          </>
        )}

        <p style={{ marginTop: 56 }}>
          <Link to="/projetos" className="btn btn--ghost">← Todos os projetos</Link>
        </p>
      </div>
    </>
  );
}

function Spec({ label, value }) {
  if (!value) return null;
  return (
    <div className={styles.specRow}>
      <span className={styles.specLabel}>{label}</span>
      <span className={styles.specValue}>{value}</span>
    </div>
  );
}
