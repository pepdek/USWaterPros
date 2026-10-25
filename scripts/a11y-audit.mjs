// Accessibility audit: runs axe-core (WCAG 2.0/2.1/2.2 A+AA and best-practice rules) in real Chrome against a running site.
// Usage: node scripts/a11y-audit.mjs [baseUrl]   (default http://localhost:3500; start `next start -p 3500` first)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv.find((a) => a.startsWith('http')) || 'http://localhost:3500';
// --flat: swap gradients, grain and translucency for their WORST-CASE flat colors so axe can compute contrast it otherwise reports as "incomplete".
const FLAT = process.argv.includes('--flat');
const FLAT_CSS = `body{background-image:none!important;background-color:#fbf8f1!important}.orbs{background:#cfe4f4!important}.bg-surge{background:#0b2545!important}.glass{background:#fffdf7!important;backdrop-filter:none!important}body:has(main > .bg-surge:first-child) header>.glass{background:#1b3a63!important}.card{background:#fff!important}.bg-surge .card{background:#16345c!important}*{animation:none!important;transition:none!important}.rv-on [data-rv]:not(.in){opacity:1!important;transform:none!important}`;
const AXE = fs.readFileSync(path.join(root, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PAGES = ['/', '/pricing', '/services/whole-home-water-filtration', '/services/whole-home-water-filtration-tacoma', '/locations/pierce-county', '/quiz', '/tools', '/support', '/privacy', '/terms', '/thanks', '/zzz-missing'];
const VIEWS = [['desktop', 1440, 900], ['mobile', 390, 844]];

const port = 9800 + Math.floor(Math.random() * 100);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, '--disable-gpu', `--user-data-dir=/tmp/chrome-a11y-${port}`, 'about:blank'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const tabs = await (await fetch(`http://localhost:${port}/json`)).json();
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map(); ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d.result); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.value;
await send('Page.enable'); await send('Runtime.enable');

const run = `(async()=>{ const r = await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']},resultTypes:['violations','incomplete']});
  const pick=(x)=>x.map(v=>({id:v.id,impact:v.impact,help:v.help,n:v.nodes.length,ex:v.nodes.slice(0,3).map(n=>({t:n.target.join(' '),h:(n.html||'').slice(0,110),m:(n.any[0]||n.all[0]||n.none[0]||{}).message}))}));
  return JSON.stringify({v:pick(r.violations),i:pick(r.incomplete)}); })()`;

// Interactive states: [name, page, view (or 'both'), script run before the scan].
const W = (ms) => `await new Promise(r=>setTimeout(r,${ms}));`;
const CLICK = (txt) => `[...document.querySelectorAll('button,a')].find(x=>x.innerText.trim().startsWith(${JSON.stringify(txt)}))?.click();`;
const STATES = [
  ['wizard: start', '/pricing', 'both', `window.dispatchEvent(new CustomEvent('open-wizard',{detail:{}}));${W(1200)}`],
  ['wizard: pick a system', '/pricing', 'both', `window.dispatchEvent(new CustomEvent('open-wizard',{detail:{zip:'98402'}}));${W(1500)}`],
  ['header dropdown open', '/', 'desktop', `document.querySelector('header button[aria-haspopup]')?.click();${W(400)}`],
  ['mobile menu open', '/', 'mobile', `document.querySelector('button[aria-label="Open menu"]')?.click();${W(500)}`],
  ['quiz: concerns step', '/quiz', 'both', `${CLICK('Get Started')}${W(300)}${CLICK('Tacoma')}${W(200)}${CLICK('Next')}${W(300)}${CLICK('Frustrated')}${W(200)}${CLICK('Next')}${W(300)}${CLICK('Continue')}${W(300)}${CLICK('Chlorine')}${W(300)}`],
  ['tools: report result', '/tools', 'both', `(()=>{const i=document.querySelector('#report input');const s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;s.call(i,'98402');i.dispatchEvent(new Event('input',{bubbles:true}));})();${W(200)}${CLICK('Check my area')}${W(800)}`],
  ['faq open', '/', 'both', `document.querySelector('#faq details summary')?.click();${W(400)}`],
];
const out = {};
for (const [vn, w, h] of VIEWS) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 });
  for (const p of PAGES) {
    await send('Page.navigate', { url: BASE + p }); await new Promise((r) => setTimeout(r, 2800));
    await ev(`(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}scrollTo(0,0);await new Promise(r=>setTimeout(r,1400));})()`); // let reveal animations finish so axe does not read half-faded text
    if (FLAT) await ev(`(()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(FLAT_CSS)};document.head.appendChild(s);})()`);
    await ev(AXE);
    out[`${vn} ${p}`] = JSON.parse(await ev(run));
    const hs = await ev(`JSON.stringify({h1:document.querySelectorAll('h1').length, overflow:document.documentElement.scrollWidth>innerWidth})`);
    out[`${vn} ${p}`].meta = JSON.parse(hs);
  }
}
for (const [vn, w, h] of VIEWS) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 });
  for (const [name, page, view, setup] of STATES) {
    if (view !== 'both' && view !== vn) continue;
    await send('Page.navigate', { url: BASE + page }); await new Promise((r) => setTimeout(r, 2800));
    if (FLAT) await ev(`(()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(FLAT_CSS)};document.head.appendChild(s);})()`);
    await ev(`(async()=>{${setup}})()`);
    await ev(AXE);
    out[`${vn} [${name}]`] = JSON.parse(await ev(run)); out[`${vn} [${name}]`].meta = { h1: 1, overflow: false };
  }
}
fs.writeFileSync('/tmp/a11y.json', JSON.stringify(out, null, 1));
const agg = {};
for (const [k, r] of Object.entries(out)) for (const v of r.v) { (agg[v.id] ||= { impact: v.impact, help: v.help, pages: new Set(), n: 0, ex: v.ex[0] }).pages.add(k); agg[v.id].n += v.n; }
console.log('VIOLATIONS (unique rules):', Object.keys(agg).length);
for (const [id, a] of Object.entries(agg).sort((x, y) => y[1].n - x[1].n)) console.log(`- ${id} [${a.impact}] x${a.n} on ${a.pages.size} page-views: ${a.help}\n    e.g. ${a.ex.t} :: ${a.ex.h}\n    ${a.ex.m ?? ''}`);
console.log('PAGE META (h1 count / overflow):', Object.entries(out).filter(([, r]) => r.meta.h1 !== 1 || r.meta.overflow).map(([k, r]) => `${k}: h1=${r.meta.h1} overflow=${r.meta.overflow}`).join(' | ') || 'all pages: exactly one h1, no horizontal overflow');
chrome.kill(); process.exit(0);
