import express from 'express';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db, save, nextId, uniqueSlug } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const UPLOADS_DIR = path.join(ROOT, 'uploads');
const CLIENT_DIST = path.join(ROOT, '..', 'client', 'dist');

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'batimat-dev-secret-mudar-em-producao';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'batimat2026';

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// ---------- Uploads (fotos) ----------
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9.\-_]/g, '-')
      .toLowerCase();
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Apenas são aceites imagens.'));
  },
});

app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));

// ---------- Autenticação do backoffice ----------
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Sessão em falta. Inicie sessão.' });
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Sessão expirada. Inicie sessão novamente.' });
  }
}

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Palavra-passe incorreta.' });
  }
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token });
});

// ---------- Conteúdos do site (textos editáveis no BO) ----------
app.get('/api/settings', (_req, res) => res.json(db.settings));

app.put('/api/settings', requireAuth, (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  save();
  res.json(db.settings);
});

// ---------- Projetos (público) ----------
// Os projetos reservados saem "filtrados": só foto de capa, nome e descrição curta.
function publicView(p) {
  if (!p.exclusive) return p;
  const { id, title, slug, category, location, year, shortDescription, cover, exclusive } = p;
  return { id, title, slug, category, location, year, shortDescription, cover, exclusive };
}

function sortProjects(list) {
  return [...list].sort((a, b) => (b.featured - a.featured) || (b.year - a.year) || (b.id - a.id));
}

app.get('/api/projects', (_req, res) => {
  res.json(sortProjects(db.projects).map(publicView));
});

app.get('/api/projects/:slug', (req, res) => {
  const project = db.projects.find((p) => p.slug === req.params.slug);
  if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });
  res.json(publicView(project));
});

// ---------- Projetos (backoffice) ----------
app.get('/api/admin/projects', requireAuth, (_req, res) => {
  res.json(sortProjects(db.projects));
});

app.get('/api/admin/projects/:id', requireAuth, (req, res) => {
  const project = db.projects.find((p) => p.id === Number(req.params.id));
  if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });
  res.json(project);
});

app.post('/api/admin/projects', requireAuth, (req, res) => {
  const body = req.body || {};
  if (!body.title) return res.status(400).json({ error: 'O título é obrigatório.' });
  const project = {
    id: nextId(db.projects),
    title: body.title,
    slug: uniqueSlug(body.title),
    category: body.category || 'Construção nova',
    location: body.location || '',
    year: Number(body.year) || new Date().getFullYear(),
    area: body.area || '',
    shortDescription: body.shortDescription || '',
    description: body.description || '',
    cover: body.cover || '',
    gallery: Array.isArray(body.gallery) ? body.gallery : [],
    exclusive: Boolean(body.exclusive),
    featured: Boolean(body.featured),
    createdAt: new Date().toISOString(),
  };
  db.projects.push(project);
  save();
  res.status(201).json(project);
});

app.put('/api/admin/projects/:id', requireAuth, (req, res) => {
  const project = db.projects.find((p) => p.id === Number(req.params.id));
  if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });
  const body = req.body || {};
  if (body.title && body.title !== project.title) {
    project.slug = uniqueSlug(body.title, project.id);
  }
  Object.assign(project, {
    title: body.title ?? project.title,
    category: body.category ?? project.category,
    location: body.location ?? project.location,
    year: body.year !== undefined ? Number(body.year) : project.year,
    area: body.area ?? project.area,
    shortDescription: body.shortDescription ?? project.shortDescription,
    description: body.description ?? project.description,
    cover: body.cover ?? project.cover,
    gallery: Array.isArray(body.gallery) ? body.gallery : project.gallery,
    exclusive: body.exclusive !== undefined ? Boolean(body.exclusive) : project.exclusive,
    featured: body.featured !== undefined ? Boolean(body.featured) : project.featured,
  });
  save();
  res.json(project);
});

app.delete('/api/admin/projects/:id', requireAuth, (req, res) => {
  const index = db.projects.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Projeto não encontrado.' });
  db.projects.splice(index, 1);
  save();
  res.json({ ok: true });
});

// ---------- Upload de imagens ----------
app.post('/api/admin/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum ficheiro recebido.' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ---------- Leads (formulários de contacto) ----------
app.post('/api/leads', (req, res) => {
  const { name, email, phone, message, projectId, projectTitle } = req.body || {};
  if (!name || (!email && !phone)) {
    return res.status(400).json({ error: 'Indique o nome e um contacto (email ou telefone).' });
  }
  const lead = {
    id: nextId(db.leads),
    name,
    email: email || '',
    phone: phone || '',
    message: message || '',
    projectId: projectId || null,
    projectTitle: projectTitle || '',
    createdAt: new Date().toISOString(),
  };
  db.leads.push(lead);
  save();
  res.status(201).json({ ok: true });
});

app.get('/api/admin/leads', requireAuth, (_req, res) => {
  res.json([...db.leads].sort((a, b) => b.id - a.id));
});

app.delete('/api/admin/leads/:id', requireAuth, (req, res) => {
  const index = db.leads.findIndex((l) => l.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Lead não encontrada.' });
  db.leads.splice(index, 1);
  save();
  res.json({ ok: true });
});

// ---------- Erros do multer / genéricos ----------
app.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message || 'Pedido inválido.' });
});

// ---------- Produção: servir o build do cliente ----------
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`BATIMAT API a correr em http://localhost:${PORT}`);
});
