// Diagnostic: tile a list of media keys into one labelled contact-sheet JPG. Usage: node scripts/contact-sheet.mjs out.jpg key1 key2 ...
import sharp from 'sharp';
import path from 'node:path';
const [out, ...keys] = process.argv.slice(2);
const W = 240, H = 180, COLS = 6;
const tiles = await Promise.all(keys.map(async (k, i) => {
  const file = path.resolve('public/media', k.replace(/\.\w+$/, '-sm.webp'));
  const img = await sharp(file).resize(W, H, { fit: 'cover' }).toBuffer();
  const label = Buffer.from(`<svg width="${W}" height="18"><rect width="100%" height="100%" fill="black" opacity=".7"/><text x="4" y="13" font-size="11" fill="white" font-family="Arial">${i}: ${k.slice(-30)}</text></svg>`);
  return [{ input: img, left: (i % COLS) * W, top: Math.floor(i / COLS) * H }, { input: label, left: (i % COLS) * W, top: Math.floor(i / COLS) * H + H - 18 }];
}));
await sharp({ create: { width: COLS * W, height: Math.ceil(keys.length / COLS) * H, channels: 3, background: '#222' } }).composite(tiles.flat()).jpeg({ quality: 70 }).toFile(out);
console.log('wrote', out);
