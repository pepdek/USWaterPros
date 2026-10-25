// Renders scripts/og/og.html to a 1200x630 PNG with headless Chrome (needs internet for the Google Fonts). Run: node scripts/og/render.mjs
// Then copy the result over app/opengraph-image.png and app/twitter-image.png. Dollar amounts are left off the card on purpose so it never goes stale.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9600 + Math.floor(Math.random() * 300);
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, '--disable-gpu', `--user-data-dir=/tmp/chrome-og-${port}`, 'about:blank'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const tabs = await (await fetch(`http://localhost:${port}/json`)).json();
const ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map(); ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d.result); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'file://' + path.join(here, 'og.html') });
await new Promise((r) => setTimeout(r, 5000));
await send('Runtime.evaluate', { expression: 'document.fonts.ready', awaitPromise: true });
const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
fs.writeFileSync(path.join(here, 'og.png'), Buffer.from(shot.data, 'base64'));
chrome.kill(); process.exit(0);
