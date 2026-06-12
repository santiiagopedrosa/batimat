import { useState } from 'react';
import { api } from '../api.js';
import styles from './components.module.css';

export default function LeadForm({ project = null, messagePlaceholder }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', text: '' });

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function submit() {
    if (!form.name || (!form.email && !form.phone)) {
      setStatus({ state: 'error', text: 'Indique o nome e pelo menos um contacto (email ou telefone).' });
      return;
    }
    setStatus({ state: 'sending', text: '' });
    try {
      await api.sendLead({
        ...form,
        projectId: project?.id || null,
        projectTitle: project?.title || '',
      });
      setStatus({ state: 'ok', text: 'Pedido enviado. Entraremos em contacto em breve.' });
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus({ state: 'error', text: err.message });
    }
  }

  return (
    <div className={styles.leadForm}>
      <div className="field">
        <label htmlFor={`lead-name-${project?.id || 'geral'}`}>Nome *</label>
        <input
          id={`lead-name-${project?.id || 'geral'}`}
          value={form.name}
          onChange={update('name')}
          placeholder="O seu nome"
        />
      </div>

      <div className={styles.leadRow}>
        <div className="field">
          <label htmlFor={`lead-email-${project?.id || 'geral'}`}>Email</label>
          <input
            id={`lead-email-${project?.id || 'geral'}`}
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="email@exemplo.pt"
          />
        </div>
        <div className="field">
          <label htmlFor={`lead-phone-${project?.id || 'geral'}`}>Telefone</label>
          <input
            id={`lead-phone-${project?.id || 'geral'}`}
            type="tel"
            value={form.phone}
            onChange={update('phone')}
            placeholder="+351 ..."
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor={`lead-msg-${project?.id || 'geral'}`}>Mensagem</label>
        <textarea
          id={`lead-msg-${project?.id || 'geral'}`}
          value={form.message}
          onChange={update('message')}
          placeholder={
            messagePlaceholder ||
            'Descreva o que pretende construir ou remodelar...'
          }
        />
      </div>

      {status.state === 'error' && (
        <div className="form-msg form-msg--error">{status.text}</div>
      )}
      {status.state === 'ok' && (
        <div className="form-msg form-msg--ok">{status.text}</div>
      )}

      <div>
        <button
          className="btn btn--yellow"
          onClick={submit}
          disabled={status.state === 'sending'}
        >
          {status.state === 'sending' ? 'A enviar…' : 'Enviar pedido'}
        </button>
      </div>
    </div>
  );
}
