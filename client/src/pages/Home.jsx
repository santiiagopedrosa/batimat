import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { api } from '../api.js';
import ProjectCard from '../components/ProjectCard.jsx';
import styles from './pages.module.css';

export default function Home() {
  const { settings } = useOutletContext();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  const featured = projects.filter((p) => !p.exclusive).slice(0, 3);
  const hero = settings?.hero || {};
  const about = settings?.about || {};

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <span className={`eyebrow ${styles.heroEyebrow}`}>
            {hero.eyebrow || 'Construção civil'}
          </span>
          <div className={styles.heroGrid}>
            <h1 className={`display ${styles.heroTitle}`}>
              {hero.title || 'Construímos com obra feita.'}
            </h1>
            <div className={styles.heroSide}>
              <p className={styles.heroSubtitle}>{hero.subtitle}</p>
              <div className={styles.heroActions}>
                <Link to="/projetos" className="btn">Ver projetos</Link>
                <Link to="/contactos" className="btn btn--ghost">Pedir orçamento</Link>
              </div>
            </div>
          </div>

          <div className={styles.heroChainage} aria-hidden="true">
            <div className={styles.heroChainageLabels}>
              <span>Km 0+000 · Levantamento</span>
              <span>Orçamento</span>
              <span>Execução</span>
              <span>Entrega · Km final</span>
            </div>
            <div className="chainage" />
          </div>
        </div>
      </section>

      {/* Sobre nós */}
      <section className={styles.section} id="sobre">
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={`display ${styles.sectionTitle}`}>
              <span className={`eyebrow ${styles.sectionEyebrow}`}>Sobre nós</span>
              {about.title || 'Uma equipa de obra'}
            </h2>
          </div>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              {(about.paragraphs || []).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className={styles.servicesBoard}>
              <div className={styles.servicesHead}>O que fazemos</div>
              <ul className={styles.servicesList}>
                {(about.services || []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projetos em destaque */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <h2 className={`display ${styles.sectionTitle}`}>
              <span className={`eyebrow ${styles.sectionEyebrow}`}>Portefólio</span>
              Projetos em destaque
            </h2>
            <Link to="/projetos" className="btn btn--ghost">Ver todos</Link>
          </div>
          <div className={styles.projectsGrid}>
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className="tape" />
        <div className={`container ${styles.ctaInner}`}>
          <h2 className={`display ${styles.ctaTitle}`}>
            Tem uma obra em mente? <em>Fale connosco.</em>
          </h2>
          <Link to="/contactos" className="btn btn--yellow">Pedir orçamento</Link>
        </div>
      </section>
    </>
  );
}
