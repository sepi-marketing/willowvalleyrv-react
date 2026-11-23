import media from '../data/media.json';
import galleries from '../data/galleries.json';

// Site base path without trailing slash ('' at a domain root, '/willowvalleyrv-react' on GitHub Pages).
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const withBase = (u) => (u ? BASE + u : u);
const cache = {};

// Look up a migrated upload by its original WordPress path, e.g. '2025/12/IMG_4705-scaled.jpg'.
export function img(key) {
  if (cache[key]) return cache[key];
  const m = media[key];
  if (!m) {
    if (import.meta.env.DEV) console.warn('Missing media', key);
    return { src: '', sm: '', w: 1, h: 1 };
  }
  return (cache[key] = { ...m, src: withBase(m.src), sm: withBase(m.sm), png: withBase(m.png) });
}

export const mediaSrc = (key) => img(key).src;
export const gallery = (name) => galleries[name] || [];
export const eventGallery = (key) => galleries.events[key] || [];
