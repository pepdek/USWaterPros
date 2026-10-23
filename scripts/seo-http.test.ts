import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { loadRows, redirectRows } from '../lib/redirectMap';

// Real HTTP checks against the production build (`npm run build` first). Skipped when there is no build.
const ROOT = path.resolve(__dirname, '..');
const built = fs.existsSync(path.join(ROOT, '.next', 'BUILD_ID'));
const PORT = 3411, BASE = `http://localhost:${PORT}`;
let server: ChildProcess;
const get = (p: string) => fetch(BASE + p, { redirect: 'manual' });

beforeAll(async () => {
  if (!built) return;
  server = spawn(path.join(ROOT, 'node_modules', '.bin', 'next'), ['start', '-p', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
  for (let i = 0; i < 60; i++) { try { if ((await fetch(BASE + '/robots.txt')).ok) return; } catch { /* not up yet */ } await new Promise((r) => setTimeout(r, 500)); }
  throw new Error('next start did not come up');
}, 40_000);
afterAll(() => { server?.kill(); });

describe.skipIf(!built)('404 page over HTTP', () => {
  it('a bogus URL returns a real 404 (not 200, not a redirect)', async () => {
    for (const p of ['/this-page-does-not-exist', '/services/nope', '/locations/nope', '/cities/nope', '/admin', '/a/b/c/d']) {
      const r = await get(p); expect(r.status, p).toBe(404);
    }
  });
  it('shows the custom page, is noindex/follow, and has no canonical', async () => {
    const r = await get('/this-page-does-not-exist'); const html = await r.text();
    expect(html).toContain('This page went down the drain.');
    expect(html).toMatch(/<meta name="robots" content="noindex, follow"/);
    expect(html).not.toMatch(/rel="canonical"/);
    expect(html).toContain('Get Instant Price');
  });
  it('is not in the sitemap', async () => { expect(await (await get('/sitemap.xml')).text()).not.toMatch(/404|not-found/); });
});

describe.skipIf(!built)('every redirect row', () => {
  const rows = redirectRows(loadRows());
  it('is one 301 hop to the destination, and the destination is 200', async () => {
    for (const r of rows) {
      const a = await get(r.old_url);
      expect(a.status, r.old_url).toBe(r.redirect_type === '302' ? 302 : 301);
      expect(new URL(a.headers.get('location')!, BASE).pathname + new URL(a.headers.get('location')!, BASE).hash, r.old_url).toBe(r.new_destination);
      const dest = await get(r.new_destination.split('#')[0]);
      expect(dest.status, `${r.old_url} -> ${r.new_destination}`).toBe(200);
    }
  }, 60_000);
  it('forwards utm parameters', async () => {
    for (const r of rows.slice(0, 5)) {
      const a = await get(`${r.old_url}?utm_source=test&utm_campaign=x`);
      expect(a.headers.get('location'), r.old_url).toContain('utm_source=test');
    }
  });
});

describe.skipIf(!built)('keep rows still answer 200', () => {
  it('all of them', async () => { for (const r of loadRows().filter((x) => x.redirect_type === 'keep')) expect((await get(r.old_url)).status, r.old_url).toBe(200); }, 60_000);
});
