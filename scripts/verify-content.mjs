// Migration QA: confirms every text snippet extracted from the WordPress pages exists in the new site.
// Checks the prerendered page first, then the app source (content shown in modals/accordions/carousels).
// Usage (after `npm run build`): node scripts/verify-content.mjs
import fs from 'node:fs/promises';
import path from 'node:path';

const norm = (s) => s
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;|&#39;|&rsquo;|’/g, "'").replace(/&quot;|“|”/g, '"').replace(/–|—/g, '-')
  .replace(/\\'/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p))); else out.push(p);
  }
  return out;
}
const srcText = norm((await Promise.all((await walk('src')).filter((f) => /\.jsx?$/.test(f)).map((f) => fs.readFile(f, 'utf8')))).join('\n'));

// Known, intentional differences
const ignore = [/^\[email/, /^costumer review$/, /^all amentities$/, /^gallery$/, /^about us$/];
const index = JSON.parse(await fs.readFile('_migration/content/_index.json', 'utf8'));
let total = 0, inPage = 0, inSource = 0;
const missing = [];

for (const p of index) {
  const page = JSON.parse(await fs.readFile(`_migration/content/${p.slug}.json`, 'utf8'));
  const snippets = [];
  for (const b of page.blocks) {
    if (b.type === 'heading' || b.type === 'button') snippets.push(b.text);
    if (b.type === 'text-editor' || b.type === 'classic') snippets.push(...norm(b.html || '').split(/(?<=[.!?])\s+/));
    if (b.type === 'icon-list') snippets.push(...b.items.map((i) => i.text));
    if (b.type === 'toggle') b.items.forEach((t) => snippets.push(t.title, ...norm(t.html).split(/(?<=[.!?])\s+/)));
    if (b.type === 'reviews' || b.type === 'testimonial-carousel') b.items.forEach((r) => snippets.push(r.text));
    if (b.type === 'progress') snippets.push(b.title);
    if (b.type === 'form') b.fields.forEach((f) => f.label && snippets.push(f.label));
  }
  if (p.slug === 'sample-page') continue; // WordPress placeholder, redirected to home
  let html = '';
  try { html = norm(await fs.readFile(path.join('dist', p.path, 'index.html'), 'utf8')); } catch {}
  for (const raw of snippets) {
    const s = norm(raw || '').replace(/^"|"$/g, '');
    if (s.length < 3 || ignore.some((r) => r.test(s))) continue;
    total++;
    if (html.includes(s)) inPage++;
    else if (srcText.includes(s)) inSource++;
    else missing.push(`${p.path}  →  "${s.slice(0, 110)}"`);
  }
}
console.log(`Checked ${total} text snippets: ${inPage} in the static page, ${inSource} in interactive content (modals/accordions/carousels), ${missing.length} missing.`);
if (missing.length) console.log(missing.join('\n'));
