// Diagnostic: dump WPForms field structure from the pool waiver page, plus classic-editor pages and header logo.
import fs from 'node:fs';
import * as cheerio from 'cheerio';
const $ = cheerio.load(fs.readFileSync('_migration/raw/willow-valley-rv-resort-pool-membership-form.html', 'utf8'));
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
$('.wpforms-field').each((_, f) => {
  const $f = $(f);
  console.log(JSON.stringify({
    cls: ($f.attr('class') || '').split(' ').find((c) => c.startsWith('wpforms-field-') && c !== 'wpforms-field-container'),
    label: clean($f.find('.wpforms-field-label').first().text()),
    sub: $f.find('.wpforms-field-sublabel').map((_, s) => clean($(s).text())).get(),
    inputs: $f.find('input,textarea,select').map((_, i) => `${$(i).attr('type') || i.tagName}:${$(i).attr('name')}${$(i).attr('required') !== undefined ? '*' : ''}`).get(),
    choices: $f.find('li label, option').map((_, s) => clean($(s).text())).get(),
    html: clean($f.find('.wpforms-field-description, .wpforms-field-html, .wpforms-field-content').text()).slice(0, 3000),
  }));
});
console.log('submit:', clean($('.wpforms-submit').text()));
console.log('text before form:', clean($('.elementor-widget-text-editor').text()));
for (const s of ['12-spies-winery', 'black-rock-mountain-state-park', 'tallulah-gorge-state-park', 'dillard-house', 'calendar', 'sample-page', 'test']) {
  const p = JSON.parse(fs.readFileSync(`_migration/content/${s}.json`, 'utf8'));
  console.log(`\n== ${s} | ${p.title} | hdr:${p.pageHeader}\n`, p.blocks.map((b) => b.html).join('').slice(0, 2500));
}
const h = cheerio.load(fs.readFileSync('_migration/raw/home.html', 'utf8'));
console.log('\nlogo:', h('[data-elementor-type="header"] img').map((_, i) => h(i).attr('src')).get());
console.log('footer imgs:', h('[data-elementor-type="footer"] img').map((_, i) => h(i).attr('src')).get());
console.log('fonts/colors kit:', [...fs.readFileSync('_migration/raw/home.html', 'utf8').matchAll(/--e-global-color-[a-z0-9]+:\s*#[0-9A-Fa-f]+/g)].map((m) => m[0]).slice(0, 12));
