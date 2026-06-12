import { useEffect, useState } from 'react';
import { api } from '../api.js';
import styles from './admin.module.css';

export default function AdminTextos() {
  const [settings, setSettings] = useState(null);
  const [status, setStatus] = useState({ state: 'idle', text: '' });

  useEffect(() => {
    api
      .getSettings()
      .then(setSettings)
      .catch((e) => setStatus({ state: 'error', text: e.message }));
  }, []);

  function set(path, value) {
    setSettings((s) => {
      const copy = structuredClone(s);
      const keys = path.split('.');
      let obj = copy;
      while (keys.length > 1) obj = obj[keys.shift()];
      obj[keys[0]] = value;
      return copy;
    });
  }

  async function save() {
    setStatus({ state: 'sending', text: '' });
    try {
      await api.saveSettings(settings);
      setStatus({ state: 'ok', text: 'Textos guardados com sucesso.' });
    } catch (e) {
      setStatus({ state: 'error', text: e.message });
    }
  }

  if (!settings) {
    return <div className={styles.empty}>A carregar…</div>;
  }

  return (
    <>
      <div className={styles.pageBar}>
        <div>
          <h1 className={styles.pageTitle}>Textos do site</h1>
          <p className={styles.pageHint}>
            Editar os conteúdos das páginas públicas. As alterações ficam
            visíveis de imediato.
          </p>
        </div>
        <button className="btn btn--yellow" onClick={save} disabled={status.state === 'sending'}>
          {status.state === 'sending' ? 'A guardar…' : 'Guardar alterações'}
        </button>
      </div>

      {status.state === 'ok' && (
        <div className="form-msg form-msg--ok" style={{ marginBottom: 20 }}>{status.text}</div>
      )}
      {status.state === 'error' && (
        <div className="form-msg form-msg--error" style={{ marginBottom: 20 }}>{status.text}</div>
      )}

      <div className={styles.form} style={{ marginBottom: 28 }}>
        <span className="eyebrow">Página inicial — topo</span>
        <div className="field">
          <label>Linha pequena (eyebrow)</label>
          <input value={settings.hero.eyebrow} onChange={(e) => set('hero.eyebrow', e.target.value)} />
        </div>
        <div className="field">
          <label>Título principal</label>
          <input value={settings.hero.title} onChange={(e) => set('hero.title', e.target.value)} />
        </div>
        <div className="field">
          <label>Subtítulo</label>
          <textarea
            value={settings.hero.subtitle}
            onChange={(e) => set('hero.subtitle', e.target.value)}
            style={{ minHeight: 80 }}
          />
        </div>
      </div>

      <div className={styles.form} style={{ marginBottom: 28 }}>
        <span className="eyebrow">Sobre nós</span>
        <div className="field">
          <label>Título da secção</label>
          <input value={settings.about.title} onChange={(e) => set('about.title', e.target.value)} />
        </div>
        <div className="field">
          <label>Texto (um parágrafo por linha em branco)</label>
          <textarea
            value={settings.about.paragraphs.join('\n\n')}
            onChange={(e) => set('about.paragraphs', e.target.value.split(/\n\s*\n/))}
            style={{ minHeight: 160 }}
          />
        </div>
        <div className="field">
          <label>Serviços (um por linha)</label>
          <textarea
            value={settings.about.services.join('\n')}
            onChange={(e) => set('about.services', e.target.value.split('\n').filter(Boolean))}
            style={{ minHeight: 140 }}
          />
        </div>
      </div>

      <div className={styles.form}>
        <span className="eyebrow">Contactos</span>
        <div className={styles.formRow}>
          <div className="field">
            <label>Telefone</label>
            <input value={settings.contacts.phone} onChange={(e) => set('contacts.phone', e.target.value)} />
          </div>
          <div className="field">
            <label>Telemóvel</label>
            <input value={settings.contacts.mobile} onChange={(e) => set('contacts.mobile', e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label>Email</label>
          <input value={settings.contacts.email} onChange={(e) => set('contacts.email', e.target.value)} />
        </div>
        <div className="field">
          <label>Morada</label>
          <textarea
            value={settings.contacts.address}
            onChange={(e) => set('contacts.address', e.target.value)}
            style={{ minHeight: 70 }}
          />
        </div>
        <div className="field">
          <label>Horário</label>
          <input value={settings.contacts.schedule} onChange={(e) => set('contacts.schedule', e.target.value)} />
        </div>
        <div className="field">
          <label>Tagline (rodapé)</label>
          <input value={settings.tagline} onChange={(e) => set('tagline', e.target.value)} />
        </div>
      </div>
    </>
  );
}
