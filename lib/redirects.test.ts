import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { loadRows, parseCsv, redirectRows } from './redirectMap';

const rows = loadRows();
const live = new Set(sitemap().map((s) => new URL(s.url).pathname));
const KNOWN = new Set([...live, '/thanks', '/llms.txt', '/robots.txt', '/sitemap.xml']);
const redirects = redirectRows(rows);
const sources = new Set(redirects.map((r) => r.old_url));
const path = (u: string) => u.split('#')[0];

describe('redirect inventory (docs/redirect-inventory.csv)', () => {
  it('parses quoted fields', () => expect(parseCsv('a,b\n"x, y","say ""hi"""\n')).toEqual([{ a: 'x, y', b: 'say "hi"' }]));
  it('has the columns and only known redirect types', () => {
    expect(Object.keys(rows[0])).toEqual(['old_url', 'status_today', 'has_traffic_or_links', 'new_destination', 'redirect_type', 'reason']);
    for (const r of rows) { expect(['keep', '301', '302', '404', '410'], r.old_url).toContain(r.redirect_type); expect(r.old_url.startsWith('/'), r.old_url).toBe(true); }
  });
  it('lists each old URL once', () => expect(new Set(rows.map((r) => r.old_url)).size).toBe(rows.length));
  it('every live sitemap URL is in the inventory', () => { for (const u of live) expect(rows.some((r) => r.old_url === u), u).toBe(true); });
  it('never redirects a page that is live in the sitemap', () => { for (const r of redirects) expect(live.has(r.old_url), r.old_url).toBe(false); });
  it('every destination is a real internal page (no external, no query string)', () => {
    for (const r of redirects) { expect(r.new_destination.startsWith('/') && !r.new_destination.includes('?'), r.old_url).toBe(true); expect(KNOWN.has(path(r.new_destination)), `${r.old_url} -> ${r.new_destination}`).toBe(true); }
  });
  it('no chains and no loops: a destination is never itself redirected', () => {
    for (const r of redirects) { expect(sources.has(path(r.new_destination)), `${r.old_url} -> ${r.new_destination}`).toBe(false); expect(path(r.new_destination)).not.toBe(r.old_url); }
  });
  it('404 and 410 rows are not live pages; keep rows are', () => {
    for (const r of rows.filter((x) => ['404', '410'].includes(x.redirect_type))) expect(KNOWN.has(r.old_url), r.old_url).toBe(false);
    for (const r of rows.filter((x) => x.redirect_type === 'keep')) expect(KNOWN.has(r.old_url), r.old_url).toBe(true);
  });
  it('no redirect goes to the homepage unless it is a booking-style URL', () => {
    for (const r of redirects.filter((x) => x.new_destination === '/')) expect(r.reason, r.old_url).toMatch(/GUESS/);
  });
});
