/* SpinWheelJoy Theme-Matched Thumbnails v1.4-adapted
 * Adapted for live DOM: targets .tool-card/.template-card with .tool-wheel-thumb/.template-art
 * Non-invasive, library-only. Reads colors/labels from the same tool registry as live wheels.
 * No app.js modifications, no frame loop, no storage, no network and no click interception.
 */
(function (scope) {
  'use strict';
  const registry = scope.SpinWheelTools;
  if (!registry || !registry.getBySlug) return;
  const doc = scope.document;
  const NS = 'http://www.w3.org/2000/svg';
  const wheelCards = Array.from(doc.querySelectorAll('a.tool-card[href*="/tools/"],a.template-card[href*="/tools/"]'));
  if (!wheelCards.length) return;

  function node(tag, attrs, parent, label) {
    const n = doc.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([key, value]) => n.setAttribute(key, String(value)));
    if (label != null) n.textContent = label;
    if (parent) parent.appendChild(n);
    return n;
  }
  function safeColor(value, fallback) {
    return /^#[0-9a-f]{6}$/i.test(String(value)) ? value : fallback;
  }
  function getSlug(card) {
    const match = (card.getAttribute('href') || '').match(/(?:^|\/)tools\/([a-z0-9-]+)\/?(?:[?#]|$)/i);
    return match ? match[1] : '';
  }
  function formatLabel(value) {
    const txt = String(value || '').trim();
    if (txt.length <= 4) return txt.toUpperCase();
    return txt.split(/\s+/)[0].slice(0, 4).toUpperCase();
  }
  function legibleInk(hex) {
    const n = parseInt(hex.slice(1), 16);
    const parts = [n >> 16, (n >> 8) & 255, n & 255].map(v => {
      const c = v / 255;
      return c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4);
    });
    return (parts[0] * .2126 + parts[1] * .7152 + parts[2] * .0722) > .44 ? '#172840' : '#ffffff';
  }
  function drawWheel(tool, isDark) {
    const colors = (registry.resolvedColors ? registry.resolvedColors(tool.id, isDark) : tool.colors)
      .map(c => safeColor(c, '#5977c7'));
    const count = Math.max(2, Math.min(32, tool.labels.length));
    const svg = node('svg', { viewBox: '0 0 112 112', 'aria-hidden': 'true', focusable: 'false', class: 'swj-thumb-svg' });
    node('circle', { cx:56, cy:58, r:52.5, fill:isDark ? '#292840' : '#ffffff', stroke: isDark ? '#746b8e' : '#e3e9f1', 'stroke-width': 1.5 }, svg);
    const radius = 48.5, cx=56, cy=58, sector=(Math.PI * 2)/count;
    // Use the number of real choices, not the number of palette colors.
    for (let i=0; i<count; i++) {
      const a1 = -Math.PI/2 + i*sector, a2 = a1 + sector;
      const x1=cx+radius*Math.cos(a1), y1=cy+radius*Math.sin(a1);
      const x2=cx+radius*Math.cos(a2), y2=cy+radius*Math.sin(a2);
      const fill=colors[i % colors.length];
      node('path', {
        d:`M ${cx} ${cy} L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${radius} ${radius} 0 ${sector>Math.PI?1:0} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`,
        fill, stroke:isDark?'#292840':'#ffffff', 'stroke-width':count>16?.5:.85
      }, svg);
      if (count<=8) {
        const am=(a1+a2)/2, rr = count===2?28:33;
        const tx = cx + rr * Math.cos(am), ty = cy + rr * Math.sin(am);
        const isShort=String(tool.labels[i]).length <= 10;
        // The thumb is decorative; use compact labels only where readable.
        if (isShort || count===2) node('text', {
          x:tx.toFixed(2), y:(ty+1.5).toFixed(2),
          'font-size': count===2?8:5.7,
          'font-weight':'800', 'text-anchor':'middle',
          'font-family':'system-ui, sans-serif', fill:legibleInk(fill)
        }, svg, formatLabel(tool.labels[i]));
      }
    }
    node('circle', { cx,cy,r:9.5,fill:isDark?'#f2edf8':'#ffffff',stroke:isDark?'#4f4869':'#dfe5ed','stroke-width':1.4 },svg);
    node('text',{x:cx,y:cy+2.5,'text-anchor':'middle','font-size':6.5,'font-weight':900,'font-family':'system-ui, sans-serif',fill:'#243047'},svg,tool.id==='numbers'?'#':tool.id==='colors'?'●':'✦');
    node('path',{d:'M 49.5 1.5 L 62.5 1.5 L 56 16 Z',fill:'#243147',stroke:isDark?'#241e33':'#ffffff','stroke-width':1.5,'stroke-linejoin':'round'},svg);
    return svg;
  }
  function drawSanta(isDark) {
    // Secret Santa is a gift-matching app, not a pretend wheel.
    const svg=node('svg',{viewBox:'0 0 112 112','aria-hidden':'true',focusable:'false',class:'swj-thumb-svg'});
    node('circle',{cx:56,cy:56,r:49,fill:isDark?'#244d42':'#e7f4ea'},svg);
    node('circle',{cx:30,cy:28,r:9,fill:'#f2c46a',opacity:.72},svg);
    node('circle',{cx:85,cy:31,r:6,fill:'#bb4657',opacity:.54},svg);
    node('rect',{x:26,y:47,width:60,height:41,rx:6,fill:'#ae3f53'},svg);
    node('rect',{x:22,y:41,width:68,height:14,rx:4,fill:'#d65a64'},svg);
    node('rect',{x:52,y:41,width:9,height:47,fill:'#f3c46b'},svg);
    node('path',{d:'M 56.5 43 C 28 43 33 17 48 26 C 54 29 56 39 56.5 43 Z M 56.5 43 C 85 43 80 17 65 26 C 59 29 57 39 56.5 43 Z',fill:'none',stroke:'#f3c46b','stroke-width':7,'stroke-linejoin':'round'},svg);
    node('path',{d:'M 47 96 Q 56 104 65 96',stroke:'#205e49','stroke-width':3,fill:'none','stroke-linecap':'round'},svg);
    return svg;
  }
  function render() {
    const isDark=doc.documentElement.dataset.theme==='dark';
    wheelCards.forEach(card=>{
      const slug=getSlug(card),tool=registry.getBySlug(slug);
      if (!tool) return;
      const target=card.querySelector('.tool-wheel-thumb,.template-art');
      if (!target) return;
      const accent=safeColor(tool.accent,'#546EF5');
      card.style.setProperty('--card-accent', accent);
      card.style.setProperty('--swj-theme-accent', accent);
      target.replaceChildren(tool.mode==='secret-santa'?drawSanta(isDark):drawWheel(tool,isDark));
      card.dataset.swjTheme=tool.id;
    });
  }
  render();
  // Attribute-only observer: never observe our own child replacements (avoids MutationObserver loops).
  if (scope.MutationObserver) {
    new scope.MutationObserver((records)=>{
      if (records.some(record=>record.attributeName==='data-theme')) render();
    }).observe(doc.documentElement,{attributes:true,attributeFilter:['data-theme']});
  }
})(window);
