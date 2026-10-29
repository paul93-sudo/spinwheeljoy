#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {root, walkRoutes, urlFor, extractMeta} from './site-lib.mjs';

let articleCount=0, svgPreviews=0, missingOG=0, missingSchemaImage=0, missingAlt=0;
const examples=[];
for (const file of walkRoutes()) {
  const rel=path.relative(root,file).split(path.sep).join('/');
  if (!/^blog\/[^/]+\/[^/]+\/index\.html$/.test(rel)) continue;
  const html=fs.readFileSync(file,'utf8');
  const url=urlFor(file);
  articleCount++;
  const og=extractMeta(html,'og:image','property');
  if (!og) {missingOG++;examples.push('No og:image: '+url);}
  else if (/\.svg(?:[?#]|$)/i.test(og)) {svgPreviews++;if (examples.length<15)examples.push('SVG social preview (consider tested 1200px+ raster): '+url);}
  const blocks=[...html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
  let withImage=false;
  for (const block of blocks) {
    try {const json=JSON.parse(block);const nodes=json['@graph']||[json];if (nodes.some(x=>['Article','BlogPosting','NewsArticle'].includes(x['@type']) && x.image)) withImage=true;}
    catch { /* Invalid schema should be reported by a separate schema parser. */ }
  }
  if (!withImage) missingSchemaImage++;
  for (const img of html.match(/<img\b[^>]*>/gi)||[]) {
    if (!/\balt\s*=\s*(["']).*?\1/i.test(img)) {missingAlt++;if(examples.length<15)examples.push('Image without alt: '+url);}
  }
}
console.log(JSON.stringify({articles:articleCount,svg_social_previews:svgPreviews,missing_og_image:missingOG,article_schema_without_image:missingSchemaImage,images_missing_alt:missingAlt},null,2));
if (examples.length) console.log('Review examples:\n'+examples.slice(0,15).join('\n'));
console.log('This is a read-only Discover/image SEO inventory; existing posts are NOT modified.');
