import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import styles from './admin.module.css';

const CATEGORIES = [
  'Construção nova',
  'Reabilitação',
  'Remodelação',
  'Industrial',
  'Turismo',
  'Outros',
];

const EMPTY = {
  title: '',
  category: CATEGORIES[0],
  location: '',
  year: new Date().getFullYear(),
  area: '',
  shortDescription: '',
  description: '',
  cover: '',
  gallery: [],
  exclusive: false,
  featured: false,
};

export default function ProjetoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ state: 'idle', text: '' });
  const coverInput = useRef(null);
  const galleryInput = useRef(null);

  useEffect(() => {
    if (isNew) {
      setForm(EMPTY);
      return;
    }
    api
      .adminProject(id)
      .then((p) => setForm({ ...EMPTY, ...p }))
      .catch((e) => setStatus({ state: 'error', text: e.message }));
  }, [id, isNew]);

  function update(field) {
    return (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
    };
  }

  async function uploadCover(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus({ state: 'sending', text: '' });
    try {
      const { url } = await api.upload(file);
      setForm((f) => ({ ...f, cover: url }));
      setStatus({ state: 'idle', text: '' });
    } catch (err) {
      setStatus({ state: 'error', text: err.message });
    } finally {
      e.target.value = '';
    }
  }

  async function uploadGallery(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setStatus({ state: 'sending', text: '' });
    try {
      const urls = [];
      for (const file of files) {
        const { url } = await api.upload(file);
        urls.push(url);
      }
      setForm((f) => ({ ...f, gallery: [...f.gallery, ...urls] }));
      setStatus({ state: 'idle', text: '' });
    } catch (err) {
      setStatus({ state: 'error', text: err.message });
    } finally {
      e.target.value = '';
    }
  }

  function removeGalleryItem(index) {
    setForm((f) => ({ ...f, gallery: f.gallery.filter((_, i) => i !== index) }));
  }

  async function submit() {
    if (!form.title) {
      setStatus({ state: 'error', text: 'O título é obrigatório.' });
      return;
    }
    setStatus({ state: 'sending', text: '' });
    try {
      if (isNew) {
        await api.createProject(form);
      } else {
        await api.updateProject(id, form);
      }
      navigate('/admin/projetos');
    } catch (err) {
      setStatus({ state: 'error', text: err.message });
    }
  }

  return (
    <>
      <div className={styles.pageBar}>
        <div>
          <h1 className={styles.pageTitle}>
            {isNew ? 'Novo projeto' : 'Editar projeto'}
          </h1>
          <p className={styles.pageHint}>
            Preencha a ficha da obra. Se marcar como «reservado», o site mostra
            apenas a foto de capa, o nome e a descrição curta, com um formulário
            de pedido de informação.
          </p>
        </div>
      </div>

      <div className={styles.form}>
        <div className="field">
          <label htmlFor="p-title">Título *</label>
          <input id="p-title" value={form.title} onChange={update('title')} placeholder="Ex.: Moradia Vale Real" />
        </div>

        <div className={styles.formRow3}>
          <div className="field">
            <label htmlFor="p-category">Categoria</label>
            <select id="p-category" value={form.category} onChange={update('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="p-year">Ano</label>
            <input id="p-year" type="number" value={form.year} onChange={update('year')} />
          </div>
          <div className="field">
            <label htmlFor="p-area">Área</label>
            <input id="p-area" value={form.area} onChange={update('area')} placeholder="Ex.: 240 m²" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="p-location">Localização</label>
          <input id="p-location" value={form.location} onChange={update('location')} placeholder="Ex.: Caldas da Rainha" />
        </div>

        <div className="field">
          <label htmlFor="p-short">Descrição curta (aparece nos cartões e nos projetos reservados)</label>
          <textarea
            id="p-short"
            value={form.shortDescription}
            onChange={update('shortDescription')}
            style={{ minHeight: 70 }}
          />
        </div>

        <div className="field">
          <label htmlFor="p-desc">Descrição completa (apenas visível em projetos públicos)</label>
          <textarea id="p-desc" value={form.description} onChange={update('description')} />
        </div>

        {/* Capa */}
        <div className={styles.uploadBox}>
          <span className="eyebrow">Foto de capa</span>
          <div className={styles.uploadRow}>
            {form.cover && <img className={styles.coverPreview} src={form.cover} alt="Capa" />}
            <input
              ref={coverInput}
              type="file"
              accept="image/*"
              onChange={uploadCover}
              style={{ display: 'none' }}
            />
            <button className={styles.miniBtn} onClick={() => coverInput.current?.click()}>
              {form.cover ? 'Substituir capa' : 'Carregar capa'}
            </button>
            {form.cover && (
              <button
                className={`${styles.miniBtn} ${styles.miniBtnDanger}`}
                onClick={() => setForm((f) => ({ ...f, cover: '' }))}
              >
                Remover
              </button>
            )}
          </div>
        </div>

        {/* Galeria */}
        <div className={styles.uploadBox}>
          <span className="eyebrow">Galeria de fotos</span>
          {form.gallery.length > 0 && (
            <div className={styles.galleryGrid}>
              {form.gallery.map((src, i) => (
                <div key={`${src}-${i}`} className={styles.galleryItem}>
                  <img src={src} alt={`Foto ${i + 1}`} />
                  <button
                    className={styles.galleryRemove}
                    onClick={() => removeGalleryItem(i)}
                    aria-label="Remover foto"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className={styles.uploadRow}>
            <input
              ref={galleryInput}
              type="file"
              accept="image/*"
              multiple
              onChange={uploadGallery}
              style={{ display: 'none' }}
            />
            <button className={styles.miniBtn} onClick={() => galleryInput.current?.click()}>
              + Adicionar fotos
            </button>
          </div>
        </div>

        {/* Flags */}
        <div className={styles.checkRow}>
          <label className={styles.check}>
            <input type="checkbox" checked={form.exclusive} onChange={update('exclusive')} />
            <span>
              Projeto reservado
              <span className={styles.checkHint}>Mostra só teaser + formulário de contacto</span>
            </span>
          </label>
          <label className={styles.check}>
            <input type="checkbox" checked={form.featured} onChange={update('featured')} />
            <span>
              Em destaque
              <span className={styles.checkHint}>Aparece na página inicial</span>
            </span>
          </label>
        </div>

        {status.state === 'error' && (
          <div className="form-msg form-msg--error">{status.text}</div>
        )}

        <div className={styles.formActions}>
          <button className="btn btn--yellow" onClick={submit} disabled={status.state === 'sending'}>
            {status.state === 'sending' ? 'A guardar…' : 'Guardar projeto'}
          </button>
          <button className="btn btn--ghost" onClick={() => navigate('/admin/projetos')}>
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
}
