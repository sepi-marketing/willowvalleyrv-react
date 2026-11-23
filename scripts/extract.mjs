// Step 2 of migration: turn each crawled page into an ordered list of content blocks (JSON).
// Usage: node scripts/extract.mjs  -> writes _migration/content/<slug>.json and _migration/media.json
import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const RAW = path.resolve('_migration/raw');
const OUT = path.resolve('_migration/content');
await fs.mkdir(OUT, { recursive: true });
const urls = JSON.parse(await fs.readFile(path.join(RAW, '_urls.json'), 'utf8'));

const media = new Set();
const addMedia = (u) => {
  if (!u) return u;
  u = u.trim().replace(/^http:\/\//, 'https://');
  if (u.startsWith('//')) u = 'https:' + u;
  if (/willowvalleyrv\.com\/wp-content\/uploads\//.test(u)) media.add(u.split('?')[0]);
  return u;
};
const bestFromSrcset = (srcset) => {
  if (!srcset) return null;
  const c = srcset.split(',').map((s) => s.trim().split(/\s+/)).map(([u, w]) => ({ u, w: parseInt(w) || 0 }));
  c.sort((a, b) => b.w - a.w);
  return c[0]?.u;
};
// strip WP size suffix to get the original upload (e.g. foo-300x200.jpg -> foo.jpg)
const original = (u) => (u ? u.replace(/-\d+x\d+(?=\.(jpe?g|png|gif|webp)$)/i, '') : u);
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

function cleanHtml($, el) {
  const c = $(el).clone();
  c.find('script,style,noscript').remove();
  c.find('*').each((_, n) => {
    const keep = ['href', 'src', 'alt', 'target'];
    for (const a of Object.keys(n.attribs || {})) if (!keep.includes(a)) $(n).removeAttr(a);
  });
  c.find('img').each((_, n) => addMedia($(n).attr('src')));
  return c.html()?.replace(/\s+\n/g, '\n').trim();
}

function widgetBlock($, w) {
  const type = ($(w).attr('data-widget_type') || '').replace('.default', '');
  const settings = (() => { try { return JSON.parse($(w).attr('data-settings') || '{}'); } catch { return {}; } })();
  const img = (i) => {
    const $i = $(i);
    const src = addMedia($i.attr('data-src') || $i.attr('src'));
    const big = addMedia(bestFromSrcset($i.attr('srcset')) || src);
    return { src: big, original: addMedia(original(big)), alt: $i.attr('alt') || '', w: +$i.attr('width') || undefined, h: +$i.attr('height') || undefined };
  };
  switch (type) {
    case 'heading': {
      const h = $(w).find('.elementor-heading-title');
      return { type, tag: h.prop('tagName')?.toLowerCase(), text: clean(h.text()), href: h.find('a').attr('href') || h.attr('href') };
    }
    case 'text-editor': return { type, html: cleanHtml($, $(w).find('.elementor-widget-container').length ? $(w).find('.elementor-widget-container') : w) };
    case 'button': { const a = $(w).find('a'); return { type, text: clean(a.text()), href: a.attr('href') }; }
    case 'image': {
      const a = $(w).find('a');
      const i = $(w).find('img').first();
      return { type, ...img(i), href: a.attr('href'), caption: clean($(w).find('figcaption').text()) };
    }
    case 'gallery': case 'image-carousel': case 'media-carousel': {
      const items = [];
      $(w).find('a[href], .elementor-carousel-image, img').each((_, n) => {
        const $n = $(n);
        if (n.tagName === 'a') {
          const href = $n.attr('href');
          if (/\.(jpe?g|png|gif|webp)$/i.test(href || '')) items.push({ original: addMedia(href), alt: $n.attr('data-elementor-lightbox-title') || '' });
        } else if ($n.hasClass('elementor-carousel-image')) {
          const bg = $n.attr('data-background') || ($n.attr('style') || '').match(/url\(['"]?(.*?)['"]?\)/)?.[1];
          if (bg) items.push({ original: addMedia(bg), alt: $n.attr('aria-label') || '' });
        } else {
          const i = img(n);
          items.push({ original: i.original, src: i.src, alt: i.alt });
        }
      });
      // also gallery data-thumbnail attrs (Elementor Pro gallery)
      $(w).find('[data-thumbnail]').each((_, n) => items.push({ original: addMedia($(n).attr('data-thumbnail')), alt: $(n).attr('alt') || '' }));
      const seen = new Set();
      const uniq = items.filter((i) => i.original && !seen.has(original(i.original)) && seen.add(original(i.original)));
      return { type: 'gallery', widget: type, items: uniq, captions: $(w).find('.elementor-image-carousel-caption').map((_, c) => clean($(c).text())).get() };
    }
    case 'video': return { type, settings: { youtube_url: settings.youtube_url, vimeo_url: settings.vimeo_url, hosted_url: addMedia(settings.hosted_url?.url), external_url: settings.external_url?.url, video_type: settings.video_type, autoplay: settings.autoplay, mute: settings.mute, loop: settings.loop, image_overlay: addMedia(settings.image_overlay?.url) }, html: $(w).find('video,iframe').toString() };
    case 'icon-list': return { type, items: $(w).find('li').map((_, li) => ({ text: clean($(li).text()), href: $(li).find('a').attr('href') })).get() };
    case 'star-rating': return { type, rating: clean($(w).find('.elementor-screen-only').text()) || settings, title: clean($(w).find('.elementor-star-rating__title').text()) };
    case 'progress': return { type, title: clean($(w).find('.elementor-title').text()), percent: $(w).find('[data-max]').attr('data-max'), inner: clean($(w).find('.elementor-progress-text').text()) };
    case 'google_maps': return { type, src: $(w).find('iframe').attr('src'), title: $(w).find('iframe').attr('title') };
    case 'form': return { type, name: $(w).find('form').attr('name'), fields: $(w).find('.elementor-field-group').map((_, g) => ({ label: clean($(g).find('label').text()), type: $(g).find('input,textarea,select').attr('type') || $(g).find('textarea,select').prop('tagName')?.toLowerCase(), name: $(g).find('input,textarea,select').attr('name'), placeholder: $(g).find('input,textarea').attr('placeholder'), required: $(g).find('[required]').length > 0, options: $(g).find('option').map((_, o) => clean($(o).text())).get() })).get(), submit: clean($(w).find('button[type=submit]').text()) };
    case 'reviews': case 'testimonial-carousel': return { type, items: $(w).find('.swiper-slide').map((_, s) => ({ name: clean($(s).find('.elementor-testimonial__name,.elementor-testimonial__cite').first().text()), title: clean($(s).find('.elementor-testimonial__title').text()), text: clean($(s).find('.elementor-testimonial__text,.elementor-testimonial__content').first().text()), rating: $(s).find('.elementor-star-rating, [class*=rating]').attr('title') || clean($(s).find('.elementor-screen-only').text()), image: addMedia($(s).find('img').attr('src') || $(s).find('img').attr('data-src')) })).get() };
    case 'toggle': return { type, items: $(w).find('.elementor-toggle-item').map((_, t) => ({ title: clean($(t).find('.elementor-toggle-title').text()), html: cleanHtml($, $(t).find('.elementor-tab-content')) })).get() };
    case 'lottie': return { type, src: settings.source_json?.url || settings.source_external_url?.url, settings };
    case 'html': return { type, html: $(w).find('.elementor-widget-container').html() || $(w).html() };
    case 'icon': { const a = $(w).find('a'); return { type, href: a.attr('href'), icon: $(w).find('i,svg').attr('class') }; }
    case 'divider': return { type };
    default: return { type, text: clean($(w).text()) };
  }
}

function extractDoc($, root) {
  const blocks = [];
  $(root).find('[data-widget_type], [data-element_type="container"], [data-element_type="section"]').each((_, el) => {
    const $el = $(el);
    if ($el.attr('data-widget_type')) blocks.push({ id: $el.attr('data-id'), container: $el.parents('[data-element_type="container"],[data-element_type="section"]').first().attr('data-id'), ...widgetBlock($, el) });
    else {
      let s = {}; try { s = JSON.parse($el.attr('data-settings') || '{}'); } catch {}
      const style = $el.attr('style') || '';
      const bg = s.background_slideshow_gallery?.map((g) => addMedia(g.url));
      blocks.push({ type: 'section', id: $el.attr('data-id'), parent: $el.parents('[data-element_type="container"],[data-element_type="section"]').first().attr('data-id'), bgVideo: s.background_video_link, bgSlideshow: bg, styleBg: style.match(/url\((.*?)\)/)?.[1] });
    }
  });
  return blocks;
}

// background images live in Elementor per-post CSS files
async function cssBackgrounds($) {
  const out = {};
  const hrefs = $('link[rel=stylesheet]').map((_, l) => $(l).attr('href')).get().filter((h) => /elementor\/css\/post-\d+\.css/.test(h));
  for (const h of hrefs) {
    const css = await (await fetch(h)).text();
    for (const m of css.matchAll(/\.elementor-element-([a-z0-9]+)[^{]*\{[^}]*?background-image:\s*url\(["']?(.*?)["']?\)/g)) {
      (out[m[1]] ||= []).push(addMedia(m[2]));
    }
  }
  return out;
}

const index = [];
for (const { url, slug } of urls) {
  const html = await fs.readFile(path.join(RAW, `${slug}.html`), 'utf8');
  const $ = cheerio.load(html);
  const meta = {
    url, slug,
    path: new URL(url).pathname,
    title: clean($('title').text()),
    description: $('meta[name=description]').attr('content') || $('meta[property="og:description"]').attr('content') || '',
    ogImage: addMedia($('meta[property="og:image"]').attr('content')),
  };
  const page = $('[data-elementor-type="wp-page"]').first();
  let blocks;
  if (page.length) blocks = extractDoc($, page);
  else {
    // classic / block-editor content
    const c = $('main .page-content, main .entry-content, .page-content, .entry-content').first();
    blocks = c.length ? [{ type: 'classic', html: cleanHtml($, c) }] : [];
  }
  const backgrounds = await cssBackgrounds($);
  const pageHeader = clean($('main .page-header, .page-header .entry-title').first().text());
  await fs.writeFile(path.join(OUT, `${slug}.json`), JSON.stringify({ ...meta, pageHeader, blocks, backgrounds }, null, 2));
  index.push({ ...meta, blocks: blocks.length });
  if (slug === 'home') {
    await fs.writeFile(path.join(OUT, `_header.json`), JSON.stringify(extractDoc($, $('[data-elementor-type="header"]').first()), null, 2));
    await fs.writeFile(path.join(OUT, `_footer.json`), JSON.stringify(extractDoc($, $('[data-elementor-type="footer"]').first()), null, 2));
    const nav = $('[data-elementor-type="header"] nav').first().find('a').map((_, a) => ({ text: clean($(a).text()), href: $(a).attr('href'), depth: $(a).parents('ul').length })).get();
    await fs.writeFile(path.join(OUT, `_nav.json`), JSON.stringify(nav, null, 2));
    $('link[rel*=icon]').each((_, l) => addMedia($(l).attr('href')));
    $('[data-elementor-type="header"] img, [data-elementor-type="footer"] img').each((_, i) => addMedia($(i).attr('src')));
  }
  console.log(slug, blocks.length);
}
await fs.writeFile(path.join(OUT, '_index.json'), JSON.stringify(index, null, 2));
await fs.writeFile(path.resolve('_migration/media.json'), JSON.stringify([...media].sort(), null, 2));
console.log('media refs:', media.size);
