#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {root, walkRoutes, urlFor, robotsNoindex, extractCanonical, extractMeta, collect} from './site-lib.mjs';

const file = path.join(root, 'sitemap.xml');
if (!fs.existsSync(file)) { console.error('Missing sitemap.xml'); process.exit(1); }
const xml = fs.readFileSync(file, 'utf8');
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
const urlSet = new Set(urls);
const problems = [];
const warnings = [];
if (urls.length !== urlSet.size) problems.push('Duplicate sitemap URL(s)');
const collected = collect();
problems.push(...collected.errors);
warnings.push(...collected.warnings);
const expected = new Set(collected.pages.map(p => p.url));
for (const url of expected) if (!urlSet.has(url)) problems.push('Indexable canonical missing from sitemap: ' + url);
for (const url of urlSet) if (!expected.has(url)) problems.push('Sitemap contains noindex, noncanonical, missing or obsolete URL: ' + url);
const titleByText = new Map();
for (const file of walkRoutes()) {
  const html = fs.readFileSync(file, 'utf8');
  const url = urlFor(file);
  const title = (html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1]?.trim();
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (!title) problems.push('Missing title: ' + url);
  if (!robotsNoindex(html) && !extractMeta(html, 'description')) warnings.push('No meta description: ' + url);
  if (!robotsNoindex(html) && h1Count !== 1) warnings.push('H1 count ' + h1Count + ': ' + url);
  if (title) { if (!titleByText.has(title)) titleByText.set(title, []); titleByText.get(title).push(url); }
  if (!robotsNoindex(html) && extractCanonical(html) !== url) problems.push('Canonical issue: ' + url);
}
for (const [title, pages] of titleByText) if (pages.length > 1) warnings.push('Repeated title [' + title + '] at ' + pages.join(', '));
for (const p of problems) console.error('ERROR:', p);
for (const w of warnings.slice(0, 35)) console.warn('WARN:', w);
console.log(`Audited ${walkRoutes().length} HTML route(s); sitemap ${urls.length}; ${problems.length} error(s); ${warnings.length} warning(s).`);
if (warnings.length > 35) console.log(`${warnings.length - 35} more warnings omitted; inspect title/meta templates.`);
if (problems.length) process.exitCode = 1;
