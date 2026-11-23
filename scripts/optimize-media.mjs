// Step 4 of migration: build web-optimized copies of the archived originals into public/media
// and write src/data/media.json (original upload path -> local optimized files + dimensions).
// Usage: node scripts/optimize-media.mjs
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = path.resolve('_migration/originals');
const OUT = path.resolve('public/media');
const MAP = path.resolve('src/data/media.json');

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = await walk(SRC);
const map = {};
let i = 0;
const queue = [...files];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const file = queue.shift();
    const rel = path.relative(SRC, file).split(path.sep).join('/');
    const ext = path.extname(rel).toLowerCase();
    const base = rel.slice(0, -ext.length);
    if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
      const lg = path.join(OUT, `${base}.webp`);
      const sm = path.join(OUT, `${base}-sm.webp`);
      await fs.mkdir(path.dirname(lg), { recursive: true });
      try {
        if (!existsSync(lg)) await sharp(file).rotate().resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true }).webp({ quality: 78 }).toFile(lg);
        if (!existsSync(sm)) await sharp(file).rotate().resize({ width: 720, height: 720, fit: 'inside', withoutEnlargement: true }).webp({ quality: 70 }).toFile(sm);
        const meta = await sharp(lg).metadata();
        map[rel] = { src: `/media/${base}.webp`, sm: `/media/${base}-sm.webp`, w: meta.width, h: meta.height };
        if (ext === '.png') { // keep transparent PNG too (logo / favicon use)
          await fs.copyFile(file, path.join(OUT, rel));
          map[rel].png = `/media/${rel}`;
        }
      } catch (e) {
        console.log('FAIL', rel, e.message);
      }
    } else {
      const dest = path.join(OUT, rel);
      await fs.mkdir(path.dirname(dest), { recursive: true });
      if (!existsSync(dest)) await fs.copyFile(file, dest);
      map[rel] = { src: `/media/${rel}` };
    }
    if (++i % 50 === 0) console.log(i, '/', files.length);
  }
}));

await fs.mkdir(path.dirname(MAP), { recursive: true });
const sorted = Object.fromEntries(Object.keys(map).sort().map((k) => [k, map[k]]));
await fs.writeFile(MAP, JSON.stringify(sorted));
console.log('done', Object.keys(map).length, 'entries');
