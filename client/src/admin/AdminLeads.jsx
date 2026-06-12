import { useEffect, useState } from 'react';
import { api } from '../api.js';
import styles from './admin.module.css';

export default function AdminLeads() {
  const [leads, setLeads] = useState(null);
  const [error, setError] = useState('');

  function load() {
    api.getLeads().then(setLeads).catch((e) => setError(e.message));
  }

  useEffect(load, []);

  async function remove(lead) {
    const ok = window.confirm(`Apagar o pedido de "${lead.name}"?`);
    if (!ok) return;
    try {
      await api.deleteLead(lead.id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <>
      <div className={styles.pageBar}>
        <div>
          <h1 className={styles.pageTitle}>Pedidos de contacto</h1>
          <p className={styles.pageHint}>
            Mensagens recebidas pelo formulário geral e pelos formulários dos
            projetos reservados.
          </p>
        </div>
      </div>

      {error && <div className="form-msg form-msg--error" style={{ marginBottom: 20 }}>{error}</div>}

      {!leads ? (
        <div className={styles.empty}>A carregar…</div>
      ) : leads.length === 0 ? (
        <div className={styles.empty}>
          Ainda não há pedidos de contacto. Quando alguém preencher um
          formulário no site, aparece aqui.
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Nome</th>
                <th>Contactos</th>
                <th>Projeto</th>
                <th>Mensagem</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(l.createdAt)}</td>
                  <td><strong>{l.name}</strong></td>
                  <td>
                    {l.email && <div><a href={`mailto:${l.email}`}>{l.email}</a></div>}
                    {l.phone && <div><a href={`tel:${l.phone.replace(/\s/g, '')}`}>{l.phone}</a></div>}
                  </td>
                  <td>
                    {l.projectTitle ? (
                      <span className={styles.badge}>{l.projectTitle}</span>
                    ) : (
                      <span style={{ color: 'var(--aco)' }}>Geral</span>
                    )}
                  </td>
                  <td className={styles.leadMsg}>{l.message || '—'}</td>
                  <td>
                    <button
                      className={`${styles.miniBtn} ${styles.miniBtnDanger}`}
                      onClick={() => remove(l)}
                    >
                      Apagar
                    </button>
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
