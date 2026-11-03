#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {root} from './site-lib.mjs';

function digest(file) {return createHash('sha256').update(fs.readFileSync(file)).digest('hex');}
const homepage = path.join(root, 'index.html');
const originalHome = digest(homepage);
for (const program of ['enrich-tools.mjs', 'generate-sitemap.mjs', 'check-seo.mjs']) {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts/seo', program)], {cwd:root, stdio:'inherit'});
  if (result.status !== 0) process.exit(result.status || 1);
}
if (digest(homepage) !== originalHome) throw new Error('PROTECTION FAILURE: Homepage changed!');
console.log('PASS: Original homepage HTML remained byte-for-byte unchanged.');
console.log('Next: review `git diff`, run `node scripts/seo/generate-sitemap.mjs --check`, and QA on staging.');
