// Local stand-in for GitHub Pages: serves dist/ under /<prefix>/ (default /willowvalleyrv-react/).
// Usage: node scripts/serve-subpath.mjs [port] [prefix]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const port = +(process.argv[2] || 4174);
const prefix = (process.argv[3] || '/willowvalleyrv-react/').replace(/\/?$/, '/');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', 'dist');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mov': 'video/quicktime', '.xml': 'application/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml' };

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (!url.startsWith(prefix)) { res.writeHead(302, { Location: prefix }); return res.end(); }
  let file = path.join(root, url.slice(prefix.length));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) {
    if (!url.endsWith('/') && fs.existsSync(path.join(root, url.slice(prefix.length), 'index.html'))) { res.writeHead(301, { Location: url + '/' }); return res.end(); }
    res.writeHead(404, { 'Content-Type': types['.html'] }); return fs.createReadStream(path.join(root, '404.html')).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`Serving dist at http://localhost:${port}${prefix}`));
