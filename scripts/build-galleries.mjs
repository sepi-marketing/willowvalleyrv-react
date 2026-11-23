// Step 5 of migration: write src/data/galleries.json — every gallery / carousel image list, in original order,
// as keys into src/data/media.json. Usage: node scripts/build-galleries.mjs
import fs from 'node:fs/promises';

const media = JSON.parse(await fs.readFile('src/data/media.json', 'utf8'));
const key = (u) => {
  const k = decodeURIComponent(u.split('/wp-content/uploads/')[1] || '').replace(/-\d+x\d+(?=\.(jpe?g|png|gif|webp)$)/i, '');
  if (!media[k]) throw new Error('missing media for ' + u);
  return k;
};
const load = async (slug) => JSON.parse(await fs.readFile(`_migration/content/${slug}.json`, 'utf8'));
// Elementor exposes each gallery image twice (full link + thumbnail); dedupe on the name without -scaled.
const dedupe = (keys) => { const seen = new Set(); return keys.filter((k) => { const b = k.replace(/-scaled(?=\.\w+$)/, ''); return !seen.has(b) && seen.add(b); }); };
const galleriesOf = async (slug) => (await load(slug)).blocks.filter((b) => b.type === 'gallery').map((g) => dedupe(g.items.map((i) => key(i.original))));
const imagesOf = async (slug) => (await load(slug)).blocks.filter((b) => b.type === 'image').map((b) => key(b.original));

const out = {
  homeHero: (await load('home')).blocks.find((b) => b.type === 'section' && b.bgSlideshow)?.bgSlideshow.map(key),
  homeCarousel: (await galleriesOf('home'))[0],
  rulesCarousel: (await galleriesOf('rules'))[0],
  rvLaredo: (await galleriesOf('rv-rentals'))[0],
  rvRockwood: (await galleriesOf('rv-rentals'))[1],
  galleryMain: (await galleriesOf('gallery-2'))[0],
  drone: await imagesOf('drone-video'),
  events: {},
};
for (const slug of ['gallery__labor-day-2019', 'gallery__halloween-2023', 'gallery__memorial-day', 'labor-day-2023', 'memorial-day-2024', 'halloween-2024', 'memorial-day-2025', '4th-of-july-2025', 'labor-day-2025', 'snow-days', 'halloween-2025']) {
  const g = await galleriesOf(slug);
  out.events[slug] = g.length ? g.flat() : await imagesOf(slug);
}
await fs.writeFile('src/data/galleries.json', JSON.stringify(out, null, 1));
console.log(Object.entries(out).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.length : Object.entries(v).map(([a, b]) => `${a}=${b.length}`).join(', ')}`).join('\n'));
