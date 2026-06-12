import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { api, setToken, isLoggedIn } from '../api.js';
import styles from './admin.module.css';

export default function Login() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  if (isLoggedIn()) {
    return <Navigate to="/admin/projetos" replace />;
  }

  async function submit() {
    if (!password) return;
    setSending(true);
    setError('');
    try {
      const { token } = await api.login(password);
      setToken(token);
      navigate('/admin/projetos', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginBox}>
        <div className="tape" />
        <div className={styles.loginBody}>
          <div>
            <div className={styles.loginTitle}>
              BATI<em>MAT</em>
            </div>
            <div className={styles.loginSub}>Área de gestão</div>
          </div>

          <div className="field">
            <label htmlFor="admin-pass">Palavra-passe</label>
            <input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="••••••••"
              autoFocus
            />
          </div>

          {error && <div className="form-msg form-msg--error">{error}</div>}

          <button className="btn btn--yellow" onClick={submit} disabled={sending}>
            {sending ? 'A entrar…' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
