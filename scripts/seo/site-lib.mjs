import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const SITE = 'https://spinwheeljoy.com';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function walkRoutes(dir = root) {
  const routes = [];
  function visit(d) {
    for (const e of fs.readdirSync(d, {withFileTypes: true})) {
      if (e.name.startsWith('.')) continue;
      if (['node_modules', 'scripts', '_astro', 'assets', 'src', 'dist', 'tests', 'backups'].includes(e.name) && e.isDirectory()) continue;
      const file = path.join(d, e.name);
      if (e.isDirectory()) visit(file);
      else if (e.isFile() && e.name === 'index.html') routes.push(file);
    }
  }
  visit(dir);
  return routes.sort();
}

export function extractMeta(html, key, attr = 'name') {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const attrs = Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)].map(m => [m[1].toLowerCase(), m[3]]));
    if ((attrs[attr] || '').toLowerCase() === key.toLowerCase()) return attrs.content || '';
  }
  return '';
}

export function extractCanonical(html) {
  for (const tag of html.match(/<link\b[^>]*>/gi) || []) {
    const rel = (tag.match(/\brel\s*=\s*(["'])(.*?)\1/i) || [])[2] || '';
    const href = (tag.match(/\bhref\s*=\s*(["'])(.*?)\1/i) || [])[2] || '';
    if (rel.toLowerCase().split(/\s+/).includes('canonical')) return href;
  }
  return '';
}

export function urlFor(file) {
  const rel = path.relative(root, file).split(path.sep).join('/');
  if (rel === 'index.html') return SITE + '/';
  if (!rel.endsWith('/index.html')) throw new Error('Not a directory index: ' + rel);
  return SITE + '/' + rel.slice(0, -'index.html'.length);
}

export function robotsNoindex(html) {
  return /(?:^|[,\s])noindex(?:$|[,\s])/i.test(extractMeta(html, 'robots'));
}

export function meaningfulLastmod(html, file) {
  // Use editorial/explicit dates only. Git commit dates change between precommit and CI,
  // and may reflect code formatting rather than a significant content update.
  const structured = html.match(/["']dateModified["']\s*:\s*["'](\d{4}-\d{2}-\d{2})/);
  const explicit = extractMeta(html, 'seo:lastmod') || extractMeta(html, 'article:modified_time', 'property');
  const date = structured?.[1] || explicit.slice(0, 10);
  // A missing lastmod is safer than a fabricated timestamp.
  return /^\d{4}-\d{2}-\d{2}$/.test(date || '') ? date : null;
}

export function xmlEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function collect() {
  const pages = [];
  const warnings = [];
  const errors = [];
  for (const file of walkRoutes()) {
    const html = fs.readFileSync(file, 'utf8');
    const url = urlFor(file);
    const canonical = extractCanonical(html);
    const excluded = robotsNoindex(html);
    if (!canonical) {
      if (!excluded) errors.push('Missing canonical: ' + url);
      else warnings.push('Noindex page has no canonical: ' + url);
    }
    if (canonical && canonical !== url) {
      if (!excluded) errors.push('Canonical mismatch: ' + url + ' -> ' + canonical);
      else warnings.push('Noindex page canonical differs: ' + url);
    }
    if (excluded) continue;
    if (canonical !== url) continue;
    pages.push({url, lastmod: meaningfulLastmod(html, file), file});
  }
  return {pages: pages.sort((a,b) => a.url.localeCompare(b.url)), errors, warnings};
}

export function generateSitemap(pages) {
  const body = pages.map(p => '<url><loc>' + xmlEscape(p.url) + '</loc>' +
    (p.lastmod ? '<lastmod>' + p.lastmod + '</lastmod>' : '') + '</url>').join('\n');
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + '\n</urlset>\n';
}
