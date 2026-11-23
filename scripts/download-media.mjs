// Step 3 of migration: download every referenced upload (full-size original) into _migration/originals,
// mirroring the WordPress /wp-content/uploads/YYYY/MM/ structure.
// Usage: node scripts/download-media.mjs
import fs from 'node:fs/promises';
import { createWriteStream, existsSync } from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const OUT = path.resolve('_migration/originals');
const refs = JSON.parse(await fs.readFile('_migration/media.json', 'utf8'));

// Extra assets referenced outside widgets (lottie files on the old staging host, hosted videos, logo/favicon)
const extra = [
  'https://willowvalleyrv.com/wp-content/uploads/2022/12/winter-holidays-1.json',
  'https://willowvalleyrv.com/wp-content/uploads/2022/12/calendar-events.json',
  'https://willowvalleyrv.com/wp-content/uploads/2026/08/IMG_8127.mov',
  'https://willowvalleyrv.com/wp-content/uploads/2026/08/IMG_8105.mov',
  'https://willowvalleyrv.com/wp-content/uploads/2022/12/cropped-Willow-Valley-RV-Resort-logo.png',
  'https://willowvalleyrv.com/wp-content/uploads/2022/12/cropped-cropped-Willow-Valley-RV-Resort-logo.png',
];

const toOriginal = (u) => u.replace(/-\d+x\d+(?=\.(jpe?g|png|gif|webp)$)/i, '');
const urls = [...new Set([...refs, ...extra].map(toOriginal))].filter((u) => !/\/elementor\//.test(u));

const failed = [];
let done = 0;
async function get(url) {
  const rel = decodeURIComponent(url.split('/wp-content/uploads/')[1]);
  const dest = path.join(OUT, rel);
  if (existsSync(dest)) return done++;
  await fs.mkdir(path.dirname(dest), { recursive: true });
  let res = await fetch(url);
  if (!res.ok && url.includes('-scaled.')) res = await fetch(url.replace('-scaled.', '.'));
  if (!res.ok) { failed.push(`${res.status} ${url}`); return; }
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  done++;
}

const queue = [...urls];
await Promise.all(Array.from({ length: 8 }, async () => { while (queue.length) { const u = queue.shift(); try { await get(u); } catch (e) { failed.push(`ERR ${u} ${e.message}`); } } }));
console.log(`downloaded/present: ${done} / ${urls.length}`);
if (failed.length) console.log('FAILED:\n' + failed.join('\n'));
await fs.writeFile('_migration/media-manifest.json', JSON.stringify({ urls, failed }, null, 2));
