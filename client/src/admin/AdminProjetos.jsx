import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import styles from './admin.module.css';

export default function AdminProjetos() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState('');

  function load() {
    api
      .adminProjects()
      .then(setProjects)
      .catch((e) => {
        setError(e.message);
        if (e.message.toLowerCase().includes('sessão')) navigate('/admin/login');
      });
  }

  useEffect(load, []);

  async function remove(project) {
    const ok = window.confirm(`Apagar o projeto "${project.title}"? Esta ação não pode ser anulada.`);
    if (!ok) return;
    try {
      await api.deleteProject(project.id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <div className={styles.pageBar}>
        <div>
          <h1 className={styles.pageTitle}>Projetos</h1>
          <p className={styles.pageHint}>
            Gerir as obras do portefólio. Projetos reservados aparecem no site
            apenas com foto, nome e descrição curta + formulário de contacto.
          </p>
        </div>
        <Link to="/admin/projetos/novo" className="btn btn--yellow">+ Novo projeto</Link>
      </div>

      {error && <div className="form-msg form-msg--error" style={{ marginBottom: 20 }}>{error}</div>}

      {!projects ? (
        <div className={styles.empty}>A carregar…</div>
      ) : projects.length === 0 ? (
        <div className={styles.empty}>Ainda não existem projetos. Crie o primeiro.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Projeto</th>
                <th>Categoria</th>
                <th>Ano</th>
                <th>Estado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.cover ? <img className={styles.thumb} src={p.cover} alt="" /> : '—'}
                  </td>
                  <td>
                    <strong>{p.title}</strong>
                    <div style={{ fontSize: 12, color: 'var(--aco)' }}>{p.location}</div>
                  </td>
                  <td>{p.category}</td>
                  <td>{p.year}</td>
                  <td>
                    {p.exclusive && <span className={styles.badge}>Reservado</span>}{' '}
                    {p.featured && <span className={styles.badge} style={{ background: 'var(--ink)', color: 'var(--amarelo)' }}>Destaque</span>}
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link to={`/admin/projetos/${p.id}`} className={styles.miniBtn}>Editar</Link>
                      <Link to={`/projetos/${p.slug}`} className={styles.miniBtn} target="_blank">Ver</Link>
                      <button
                        className={`${styles.miniBtn} ${styles.miniBtnDanger}`}
                        onClick={() => remove(p)}
                      >
                        Apagar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
