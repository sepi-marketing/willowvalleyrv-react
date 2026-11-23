// Diagnostic: print context around regex matches in a raw page. Usage: node scripts/grep.mjs <slug> <regex> [ctx] [max]
import fs from 'node:fs';
const [slug, re, ctx = 200, max = 10] = process.argv.slice(2);
const s = fs.readFileSync(`_migration/raw/${slug}.html`, 'utf8');
let n = 0;
for (const m of s.matchAll(new RegExp(re, 'g'))) {
  console.log('---', m.index, s.slice(Math.max(0, m.index - ctx), m.index + +ctx).replace(/\s+/g, ' '));
  if (++n >= max) break;
}
console.log('matches shown:', n);
