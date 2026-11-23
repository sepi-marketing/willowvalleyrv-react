// Step 1 of migration: download the rendered HTML of every page in the WordPress sitemap.
// Usage: node scripts/crawl.mjs
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = 'https://willowvalleyrv.com';
const OUT = path.resolve('_migration/raw');
await fs.mkdir(OUT, { recursive: true });

const sitemap = await (await fetch(`${ROOT}/wp-sitemap-posts-page-1.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

const slugOf = (u) => new URL(u).pathname.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'home';

for (const url of urls) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (site-migration)' } });
  const html = await res.text();
  await fs.writeFile(path.join(OUT, `${slugOf(url)}.html`), html);
  console.log(res.status, url);
}
await fs.writeFile(path.join(OUT, '_urls.json'), JSON.stringify(urls.map((u) => ({ url: u, slug: slugOf(u) })), null, 2));
