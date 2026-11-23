// Lists the Elementor widget types used on each crawled page (diagnostic).
import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const dir = path.resolve(process.argv[2] || '_migration/raw');
const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.html'));
const total = {};
for (const f of files) {
  const $ = cheerio.load(await fs.readFile(path.join(dir, f), 'utf8'));
  const types = {};
  $('[data-widget_type]').each((_, el) => {
    const t = $(el).attr('data-widget_type');
    types[t] = (types[t] || 0) + 1;
    total[t] = (total[t] || 0) + 1;
  });
  const docs = $('[data-elementor-type]').map((_, el) => `${$(el).attr('data-elementor-type')}#${$(el).attr('data-elementor-id')}`).get();
  console.log(f, docs.join(' '), JSON.stringify(types));
}
console.log('TOTAL', JSON.stringify(total, null, 1));
