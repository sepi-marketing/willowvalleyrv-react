// Prints a compact, readable outline of extracted page content. Usage: node scripts/dump.mjs <slug...>
import fs from 'node:fs/promises';
const short = (u) => (u || '').replace('https://willowvalleyrv.com/wp-content/uploads/', 'U/');
for (const slug of process.argv.slice(2)) {
  const p = JSON.parse(await fs.readFile(`_migration/content/${slug}.json`, 'utf8'));
  console.log(`\n===== ${p.path} | ${p.title} | desc: ${p.description} | hdr: ${p.pageHeader}`);
  for (const b of p.blocks || p) {
    if (b.type === 'section') { if (b.bgVideo || b.bgSlideshow || b.styleBg || p.backgrounds?.[b.id]) console.log(`[sec ${b.id}] bg:`, short(b.bgVideo), (b.bgSlideshow || []).map(short).join(' '), short(b.styleBg), (p.backgrounds?.[b.id] || []).map(short).join(' ')); continue; }
    const { id, container, type, ...rest } = b;
    if (type === 'gallery') { console.log(`- gallery(${rest.widget}) ${rest.items.length} items:`, rest.items.slice(0, 3).map((i) => short(i.original)).join(' '), rest.captions?.length ? 'caps:' + rest.captions.join('|') : ''); continue; }
    if (type === 'icon') { console.log(`- icon ${rest.href || ''} ${rest.icon || ''}`); continue; }
    if (type === 'divider') continue;
    const s = JSON.stringify(rest).replace(/https:\/\/willowvalleyrv\.com\/wp-content\/uploads\//g, 'U/');
    console.log(`- ${type}:`, s.length > 1500 ? s.slice(0, 1500) + '…' : s);
  }
}
