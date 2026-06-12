import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';
import ProjectCard from '../components/ProjectCard.jsx';
import styles from './pages.module.css';

export default function Projetos() {
  const [projects, setProjects] = useState(null);
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  const categories = useMemo(() => {
    if (!projects) return [];
    return ['Todos', ...new Set(projects.map((p) => p.category))];
  }, [projects]);

  const visible = useMemo(() => {
    if (!projects) return [];
    if (filter === 'Todos') return projects;
    return projects.filter((p) => p.category === filter);
  }, [projects, filter]);

  if (!projects) {
    return <div className={styles.loading}>A carregar projetos…</div>;
  }

  return (
    <>
      <section className={styles.pageHead}>
        <div className="container">
          <span className="eyebrow">Portefólio</span>
          <h1 className={`display ${styles.pageTitle}`}>Projetos</h1>
          <p className={styles.pageLead}>
            Obras concluídas e em curso. Os projetos assinalados como reservados
            estão disponíveis apenas em apresentação direta — peça-nos mais
            informação através do formulário de cada projeto.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className={styles.filters}>
            {categories.map((c) => (
              <button
                key={c}
                className={`${styles.filterBtn} ${filter === c ? styles.filterActive : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className={styles.empty}>
              Sem projetos nesta categoria, para já. Veja as restantes categorias.
            </div>
          ) : (
            <div className={styles.projectsGrid}>
              {visible.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
