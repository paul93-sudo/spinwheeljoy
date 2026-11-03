#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {extractCanonical, extractMeta, robotsNoindex, xmlEscape} from './site-lib.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
function makeFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'spinwheeljoy-seo-'));
  fs.mkdirSync(path.join(dir, 'scripts/seo'), {recursive:true});
  for (const script of ['site-lib.mjs','enrich-tools.mjs','generate-sitemap.mjs','check-seo.mjs','apply-p0.mjs'])
    fs.copyFileSync(path.join(here, script), path.join(dir, 'scripts/seo', script));
  fs.mkdirSync(path.join(dir, 'assets'), {recursive:true});
  fs.writeFileSync(path.join(dir,'assets/tool-registry.js'), `window.SpinWheelTools={all:[{slug:'random-name-picker',title:'Random Name Picker',category:'Classroom',description:'Pick names',icon:'X'},{slug:'book-picker',title:'Book Picker',category:'Lifestyle',description:'Choose a book',icon:'B'}]};`);
  const mk = (route, robots = '', body = 'Hello') => {
    const dest = path.join(dir, route, 'index.html');
    fs.mkdirSync(path.dirname(dest), {recursive:true});
    const url = 'https://spinwheeljoy.com/' + (route ? route.replaceAll(path.sep,'/') + '/' : '');
    fs.writeFileSync(dest, `<html><head><title>${body}</title><meta name="description" content="${body}"><link rel="canonical" href="${url}">${robots ? `<meta name="robots" content="${robots}">` : ''}</head><body><h1>${body}</h1></body></html>`);
  };
  mk('', '', 'Spin the Wheel');
  mk('tools', '', 'All Free Random Wheel Tools');
  mk('tools/random-name-picker', '', 'Random Name Picker');
  mk('tools/book-picker', '', 'Book Picker');
  mk('tools/marble-rush-v6', 'noindex,nofollow', 'Private Test Race');
  mk('about', 'noindex,nofollow', 'Draft about page');
  fs.writeFileSync(path.join(dir,'tools/index.html'), fs.readFileSync(path.join(dir,'tools/index.html'),'utf8').replace('</body>','<main>Featured tools</main></body>'));
  return {dir,mk};
}
function run(dir, script, ...args) {
  return spawnSync(process.execPath, [path.join(dir,'scripts/seo',script),...args], {cwd:dir,encoding:'utf8',timeout:15000});
}

test('robots and canonical parsing', () => {
  assert.equal(robotsNoindex('<meta content="noindex,nofollow" name="robots">'), true);
  assert.equal(robotsNoindex('<meta name="robots" content="index,follow,max-image-preview:large">'), false);
  assert.equal(extractMeta('<meta content="a &amp; b" name="description">', 'description'), 'a &amp; b');
  assert.equal(extractCanonical('<link href="https://spinwheeljoy.com/" rel="canonical">'), 'https://spinwheeljoy.com/');
  assert.equal(xmlEscape('Fish & Chips'), 'Fish &amp; Chips');
});

test('P0 patch is idempotent; homepage is preserved; noindex pages leave sitemap', () => {
  const {dir, mk} = makeFixture();
  try {
    const home = fs.readFileSync(path.join(dir,'index.html'),'utf8');
    const a = run(dir,'apply-p0.mjs');
    assert.equal(a.status,0,a.stdout+a.stderr);
    const sitemap = fs.readFileSync(path.join(dir,'sitemap.xml'),'utf8');
    assert.ok(sitemap.includes('https://spinwheeljoy.com/tools/book-picker/'));
    assert.ok(!sitemap.includes('https://spinwheeljoy.com/about/'));
    assert.ok(!sitemap.includes('https://spinwheeljoy.com/tools/marble-rush-v6/'));
    assert.equal(fs.readFileSync(path.join(dir,'index.html'),'utf8'),home);
    assert.equal(run(dir,'generate-sitemap.mjs','--check').status,0);
    assert.equal(run(dir,'enrich-tools.mjs','--check').status,0);
    assert.equal(run(dir,'check-seo.mjs').status,0);
    const b = run(dir,'apply-p0.mjs');
    assert.equal(b.status,0,b.stdout+b.stderr);
    assert.equal(fs.readFileSync(path.join(dir,'sitemap.xml'),'utf8'),sitemap);
    const tools = fs.readFileSync(path.join(dir,'tools/index.html'),'utf8');
    assert.equal((tools.match(/SEO_DIRECTORY_START/g)||[]).length,1);
    mk('blog/classroom/new-post','','New useful article');
    assert.equal(run(dir,'generate-sitemap.mjs','--check').status,1);
    assert.equal(run(dir,'generate-sitemap.mjs').status,0);
    assert.ok(fs.readFileSync(path.join(dir,'sitemap.xml'),'utf8').includes('/blog/classroom/new-post/'));
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});

test('Indexable missing canonical fails safe instead of silently publishing a bad sitemap', () => {
  const {dir,mk} = makeFixture();
  try {
    mk('guides','','Guide page');
    const file = path.join(dir,'guides/index.html');
    fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace(/<link rel="canonical"[^>]*>/,''));
    const p=run(dir,'generate-sitemap.mjs');
    assert.equal(p.status,1,p.stdout+p.stderr);
    assert.ok((p.stderr+p.stdout).includes('Missing canonical'));
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
