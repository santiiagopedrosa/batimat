import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

export const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

export function save() {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function nextId(list) {
  return list.length ? Math.max(...list.map((x) => x.id)) + 1 : 1;
}

export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function uniqueSlug(title, excludeId = null) {
  const base = slugify(title) || 'projeto';
  let slug = base;
  let i = 2;
  while (db.projects.some((p) => p.slug === slug && p.id !== excludeId)) {
    slug = `${base}-${i++}`;
  }
  return slug;
}
