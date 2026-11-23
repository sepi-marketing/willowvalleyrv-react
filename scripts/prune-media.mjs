// Removes optimized files in public/media that no page references (e.g. duplicate "-scaled" copies
// WordPress kept). Full-size originals stay archived in _migration/originals.
// Usage: node scripts/prune-media.mjs [--dry]
import fs from 'node:fs/promises';
import path from 'node:path';

const dry = process.argv.includes('--dry');
const media = JSON.parse(await fs.readFile('src/data/media.json', 'utf8'));
const galleries = JSON.parse(await fs.readFile('src/data/galleries.json', 'utf8'));

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const used = new Set([...Object.values(galleries).flatMap((v) => (Array.isArray(v) ? v : Object.values(v).flat()))]);
const files = [...(await walk('src')).filter((f) => /\.(jsx?|css)$/.test(f)), 'index.html', 'scripts/prerender.mjs'];
const srcText = (await Promise.all(files.map((f) => fs.readFile(f, 'utf8')))).join('\n');
for (const [key, m] of Object.entries(media)) {
  if (srcText.includes(`'${key}'`) || srcText.includes(`"${key}"`) || [m.src, m.png].some((u) => u && srcText.includes(u.slice(1)))) used.add(key);
}

const keep = {};
const removeFiles = [];
for (const [key, m] of Object.entries(media)) {
  if (used.has(key)) keep[key] = m;
  else removeFiles.push(...[m.src, m.sm, m.png].filter(Boolean));
}
let bytes = 0;
for (const url of removeFiles) {
  const file = path.join('public', url);
  try { bytes += (await fs.stat(file)).size; if (!dry) await fs.rm(file); } catch {}
}
if (!dry) await fs.writeFile('src/data/media.json', JSON.stringify(keep));
if (dry) console.log(Object.keys(media).filter((k) => !keep[k]).join('\n'));
console.log(`${dry ? '[dry] ' : ''}kept ${Object.keys(keep).length} media, removed ${Object.keys(media).length - Object.keys(keep).length} unused (${(bytes / 1048576).toFixed(1)} MB)`);
