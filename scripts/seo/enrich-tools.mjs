#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {root} from './site-lib.mjs';

const check = process.argv.includes('--check');
const file = path.join(root, 'tools/index.html');
const registryFile = path.join(root, 'assets/tool-registry.js');
if (!fs.existsSync(file) || !fs.existsSync(registryFile)) {
  console.error('Expected SpinWheelJoy static root (tools/index.html and assets/tool-registry.js).');
  process.exit(1);
}
const sandbox = {window: {}};
vm.runInNewContext(fs.readFileSync(registryFile, 'utf8'), sandbox, {timeout: 3000});
const tools = sandbox.window.SpinWheelTools?.all;
if (!tools?.length) throw new Error('Tool registry missing');

const escape = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const featured = new Set(['random-name-picker','yes-or-no-wheel','number-wheel','student-picker','team-generator','color-wheel']);
const categories = [
  ['Classroom', 'Make participation and activities easier'],
  ['Groups', 'Organize people and start conversations'],
  ['Games', 'Fun, quick activities for people together'],
  ['Decisions', 'A simple answer when several options sound good'],
  ['Lifestyle', 'Choose what to do, cook, read, or watch'],
  ['Creative', 'Inspiration for music and art'],
  ['Holidays', 'Seasonal ideas and gift exchanges']
];
const cards = tools.filter(t => t.slug && !featured.has(t.slug) && fs.existsSync(path.join(root, 'tools', t.slug, 'index.html')));
const sections = categories.map(([category, subtitle], idx) => {
  const matches = cards.filter(t => t.category === category);
  if (!matches.length) return '';
  const content = matches.map(t => `<a class="seo-directory-card" href="../tools/${encodeURIComponent(t.slug)}/"><span class="seo-directory-icon" aria-hidden="true">${escape(t.icon)}</span><span class="seo-directory-copy"><strong>${escape(t.title)}</strong><span>${escape(t.description)}</span><span class="seo-directory-link">Open tool &rarr;</span></span></a>`).join('\n');
  return `<section class="seo-directory-group" aria-labelledby="seo-category-${idx}"><h3 id="seo-category-${idx}">${escape(category)}</h3><p>${escape(subtitle)}</p><div class="seo-directory-grid">${content}</div></section>`;
}).join('\n');
const block = `<!-- SEO_DIRECTORY_START: generated from assets/tool-registry.js -->
<section class="seo-directory" aria-labelledby="seo-all-wheel-tools">
  <div class="seo-directory-heading"><span class="eyebrow">More ways to choose</span><h2 id="seo-all-wheel-tools">Explore every random picker</h2><p>Find a wheel for classroom participation, games, groups, daily decisions, and creative prompts. Every link opens a real, free tool.</p></div>
  ${sections}
</section>
<section class="seo-directory seo-solutions" aria-labelledby="seo-use-cases">
  <div class="seo-directory-heading"><span class="eyebrow">Start with a goal</span><h2 id="seo-use-cases">Find tools for your next activity</h2><p>Use these practical guides to choose the best picker for your situation.</p></div>
  <div class="seo-directory-grid">
    <a class="seo-directory-card" href="../solutions/classroom/"><span class="seo-directory-icon" aria-hidden="true">&#127891;</span><span class="seo-directory-copy"><strong>Classroom Tools</strong><span>Fair participation, groups, rewards, and quick brain breaks.</span><span class="seo-directory-link">Explore classroom &rarr;</span></span></a>
    <a class="seo-directory-card" href="../solutions/giveaways/"><span class="seo-directory-icon" aria-hidden="true">&#127873;</span><span class="seo-directory-copy"><strong>Prize Picks &amp; Giveaways</strong><span>Organize casual prize draws with clear participation rules.</span><span class="seo-directory-link">Explore prize picks &rarr;</span></span></a>
    <a class="seo-directory-card" href="../solutions/livestream/"><span class="seo-directory-icon" aria-hidden="true">&#128250;</span><span class="seo-directory-copy"><strong>Livestream Games</strong><span>Show a random picker or race to viewers on a shared screen.</span><span class="seo-directory-link">Explore livestream &rarr;</span></span></a>
    <a class="seo-directory-card" href="../games/"><span class="seo-directory-icon" aria-hidden="true">&#127918;</span><span class="seo-directory-copy"><strong>Animated Race Games</strong><span>Duck Dash and Marble Rush for a visual winner reveal.</span><span class="seo-directory-link">View games &rarr;</span></span></a>
  </div>
</section>
<!-- SEO_DIRECTORY_END -->\n`;
let html = fs.readFileSync(file, 'utf8');
const original = html;
html = html.replace(/<!-- SEO_DIRECTORY_START:[\s\S]*?<!-- SEO_DIRECTORY_END -->\s*/,'');
if (!html.includes('</main>')) throw new Error('Expected closing </main> in tools index');
html = html.replace('</main>', block + '</main>');
const css = '<link rel="stylesheet" href="../assets/seo-sections.css">';
if (!html.includes('assets/seo-sections.css')) html = html.replace('</head>', css + '</head>');
if (check) {
  if (original !== html) {console.error('Tools directory is stale. Run: node scripts/seo/enrich-tools.mjs'); process.exitCode = 1;}
  else console.log('Tools directory matches current registry (' + tools.length + ' presets).');
} else {
  fs.writeFileSync(file, html, 'utf8');
  console.log(`Updated tools/index.html with ${cards.length} additional static tool links and 4 use-case links.`);
}
