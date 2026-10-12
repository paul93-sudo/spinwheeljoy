// make-sitemap.mjs — runs after `astro build`.
// Scans dist/ for index.html files and writes dist/sitemap.xml covering
// every page (existing static pages from public/ + generated /blog/**).
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const SITE = 'https://spinwheeljoy.com';
const TODAY = new Date().toISOString().split('T')[0];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name === 'index.html') out.push(p);
  }
  return out;
}

const pages = walk(DIST);
const urls = pages
  .map((p) => {
    const rel = relative(DIST, p).split(sep).join('/');
    const route = rel.replace(/index\.html$/, '');
    return `${SITE}/${route}`;
  })
  .filter((u) => !u.includes('/blog/admin/')) // Decap CMS admin: not public content
  .sort();

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `<url><loc>${u}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n') +
  `\n</urlset>\n`;

writeFileSync(join(DIST, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${urls.length} URLs`);
