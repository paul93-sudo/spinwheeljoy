#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {root, collect, generateSitemap} from './site-lib.mjs';

const check = process.argv.includes('--check');
const file = path.join(root, 'sitemap.xml');
const {pages, errors, warnings} = collect();
for (const w of warnings) console.warn('WARN:', w);
for (const e of errors) console.error('ERROR:', e);
if (errors.length) process.exit(1);
const content = generateSitemap(pages);
const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
const identical = previous === content;
if (check) {
  console.log(`Sitemap: ${pages.length} indexable canonical URLs; ${identical ? 'up-to-date' : 'out of date'}.`);
  if (!identical) {
    const old = new Set([...previous.matchAll(/<loc>(.*?)<\/loc>/g)].map(x => x[1]));
    const now = new Set(pages.map(x => x.url));
    const added = [...now].filter(x => !old.has(x));
    const removed = [...old].filter(x => !now.has(x));
    if (added.length) console.error('Missing URLs:', added.join(', '));
    if (removed.length) console.error('Remove noindex/obsolete URLs:', removed.join(', '));
    if (!added.length && !removed.length) console.error('Check lastmod dates or formatting. Run generator.');
    process.exitCode = 1;
  }
} else {
  fs.writeFileSync(file, content);
  console.log(`Generated sitemap.xml with ${pages.length} indexable canonical URLs (excluded noindex and previews).`);
}
