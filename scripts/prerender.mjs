// Renders every route to static HTML (dist/<path>/index.html) so each original WordPress URL
// exists as a real page: fast first paint, SEO-friendly, and works on any static host.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = path.resolve('dist');
const SITE_URL = (process.env.SITE_URL || 'https://willowvalleyrv.com').replace(/\/$/, '');
const template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');
const { render, routes, DEFAULT_DESCRIPTION, BASE } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
const ROOT = SITE_URL + BASE; // e.g. https://user.github.io/willowvalleyrv-react

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const OG_IMAGE = `${ROOT}/media/2025/12/IMG_4705-scaled.webp`;

function head(route) {
  const canonical = `${ROOT}${route.page === 'redirect' ? route.to : route.path}`;
  const tags = [
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(DEFAULT_DESCRIPTION)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Willow Valley RV" />`,
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(DEFAULT_DESCRIPTION)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ];
  if (route.page === 'redirect') tags.push(`<meta name="robots" content="noindex" />`, `<meta http-equiv="refresh" content="0; url=${BASE}${route.to}" />`);
  if (route.path === '/') {
    tags.push(`<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Campground',
      name: 'Willow Valley RV Resort',
      url: ROOT + '/',
      telephone: '+1-706-746-0078',
      email: 'willowvalleyrvresort@gmail.com',
      image: OG_IMAGE,
      address: { '@type': 'PostalAddress', streetAddress: '323 Yorkhouse Road', addressLocality: 'Rabun Gap', addressRegion: 'GA', postalCode: '30568', addressCountry: 'US' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '5.0', bestRating: '5', reviewCount: '4' },
    })}</script>`);
  }
  return tags.join('\n    ');
}

const strip = (html) => html.replace(/<title>.*?<\/title>\s*/s, '');
let ok = 0;
const failures = [];
for (const route of routes) {
  try {
    const app = route.page === 'redirect' ? '' : render(route.path);
    const html = strip(template).replace('<!--head-->', head(route)).replace('<!--app-->', app);
    const out = path.join(DIST, route.path, 'index.html');
    await fs.mkdir(path.dirname(out), { recursive: true });
    await fs.writeFile(out, html);
    ok++;
  } catch (e) {
    failures.push(`${route.path}: ${e.stack || e.message}`);
  }
}

// 404 page for hosts that support it (Netlify, Cloudflare Pages, Vercel, GitHub Pages).
const notFound = strip(template).replace('<!--head-->', `<title>Page not found – Willow Valley RV</title>\n    <meta name="robots" content="noindex" />`).replace('<!--app-->', render('/__not-found__/'));
await fs.writeFile(path.join(DIST, '404.html'), notFound);

// sitemap.xml + robots.txt
const urls = routes.filter((r) => r.page !== 'redirect').map((r) => `  <url><loc>${ROOT}${r.path}</loc></url>`).join('\n');
await fs.writeFile(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
await fs.writeFile(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${ROOT}/sitemap.xml\n`);
await fs.writeFile(path.join(DIST, '.nojekyll'), ''); // GitHub Pages: serve files as-is

await fs.rm(path.resolve('dist-ssr'), { recursive: true, force: true });
console.log(`Prerendered ${ok}/${routes.length} routes + 404.html, sitemap.xml, robots.txt`);
if (failures.length) { console.error('FAILED:\n' + failures.join('\n\n')); process.exit(1); }
