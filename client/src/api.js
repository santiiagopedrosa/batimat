const TOKEN_KEY = 'batimat_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });

  if (res.status === 401 && !path.includes('/auth/login')) {
    clearToken();
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Erro ${res.status}`);
  }
  return res.json();
}

export const api = {
  // auth
  login: (password) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ password }) }),

  // conteúdos
  getSettings: () => request('/api/settings'),
  saveSettings: (settings) =>
    request('/api/settings', { method: 'PUT', body: JSON.stringify(settings) }),

  // projetos — público
  getProjects: () => request('/api/projects'),
  getProject: (slug) => request(`/api/projects/${slug}`),

  // projetos — backoffice
  adminProjects: () => request('/api/admin/projects'),
  adminProject: (id) => request(`/api/admin/projects/${id}`),
  createProject: (data) =>
    request('/api/admin/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) =>
    request(`/api/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id) => request(`/api/admin/projects/${id}`, { method: 'DELETE' }),

  // upload
  upload: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return request('/api/admin/upload', { method: 'POST', body: fd });
  },

  // leads
  sendLead: (lead) => request('/api/leads', { method: 'POST', body: JSON.stringify(lead) }),
  getLeads: () => request('/api/admin/leads'),
  deleteLead: (id) => request(`/api/admin/leads/${id}`, { method: 'DELETE' }),
};
