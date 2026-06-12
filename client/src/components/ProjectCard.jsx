import { Link } from 'react-router-dom';
import styles from './components.module.css';

export default function ProjectCard({ project }) {
  const reserved = project.exclusive;

  return (
    <Link
      to={`/projetos/${project.slug}`}
      className={`${styles.card} ${reserved ? styles.cardReserved : ''}`}
    >
      <div className={styles.cardMedia}>
        {project.cover && <img src={project.cover} alt={project.title} loading="lazy" />}
        {reserved && (
          <div className={styles.cardTape}>
            <span>Projeto reservado</span>
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className="plate plate--outline">{project.category}</span>
          <span className={styles.cardYear}>{project.year}</span>
        </div>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        {project.shortDescription && (
          <p className={styles.cardDesc}>{project.shortDescription}</p>
        )}
        {project.location && (
          <div className={styles.cardLocation}>📍 {project.location}</div>
        )}
      </div>
    </Link>
  );
}
