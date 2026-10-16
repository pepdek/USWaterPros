import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { UAQ_SHARED, SERVICES } from './services';
import { CRO_FAQ, AREA_FAQ } from './croFaq';
import { SITE } from './site';
import { localBusiness, flagshipService } from './schema';
import reviews from '../data/reviews.json';

const ROOT = path.resolve(__dirname, '..');
const walk = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? (['node_modules', '.next', 'e2e'].includes(e.name) ? [] : walk(p)) : /\.(ts|tsx)$/.test(e.name) && !e.name.endsWith('.test.ts') ? [p] : [];
});
const sources = ['app', 'components', 'lib'].flatMap((d) => walk(path.join(ROOT, d)));
const words = (s: string) => s.trim().split(/\s+/).length;

describe('conversion pass', () => {
  it('every VERIFY marker has an entry in REVIEW.md', () => {
    const review = fs.readFileSync(path.join(ROOT, 'REVIEW.md'), 'utf8').replace(/\*\*/g, '');
    const missing: string[] = [];
    for (const f of sources) {
      const rel = path.relative(ROOT, f);
      for (const m of fs.readFileSync(f, 'utf8').matchAll(/VERIFY:\s*([^*\n]*?)(?:\s*\*\/|\s*\}|$)/gm)) {
        const key = m[1].trim().replace(/\.$/, '').slice(0, 38);
        if (!key || !review.includes(rel) || !review.includes(key)) missing.push(`${rel}: ${key}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('ships no reviews and no aggregateRating', () => {
    expect(reviews).toEqual([]);
    for (const s of [localBusiness(), flagshipService('https://example.com', 'x')]) expect(JSON.stringify(s)).not.toContain('aggregateRating');
  });

  it('the schema carries the fixed price and the phone number', () => {
    expect(flagshipService('https://example.com', 'x').offers).toMatchObject({ price: 2999, priceCurrency: 'USD' });
    expect(localBusiness().telephone).toBe(SITE.phoneTel);
  });

  it('plumber wording: nothing says US Water Pros employs the installer', () => {
    const bad = /licensed technician|our technicians|our licensed installers/i;
    const hits = sources.filter((f) => bad.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(ROOT, f));
    expect(hits).toEqual([]);
  });

  it('no add-on prices or retired claims in the conversion-page components or FAQ data', () => {
    const files = [...walk(path.join(ROOT, 'components/cro')), path.join(ROOT, 'lib/croFaq.ts'), path.join(ROOT, 'lib/site.ts'), path.join(ROOT, 'lib/schema.ts')];
    for (const f of files) {
      const t = fs.readFileSync(f, 'utf8');
      for (const bad of ['$699', '$949', '$2,699', 'Join the families', 'toxic cocktail', 'crumbling', '100% satisfaction guarantee', 'same-day quote', 'within 1 hour', 'Get Free Water Report']) {
        expect(t, `${path.relative(ROOT, f)} contains ${bad}`).not.toContain(bad);
      }
    }
  });

  it('"Questions People Rarely Ask" answers are under 60 words', () => {
    const all = [...UAQ_SHARED, ...SERVICES.flatMap((s) => (s.uaq ? [s.uaq] : []))];
    for (const [q, a] of all) expect(words(a), q).toBeLessThan(60);
  });

  it('FAQ answers use the confirmed facts', () => {
    expect(SITE.callbackWindow).toBe('10 minutes');
    expect(CRO_FAQ[0][1]).toContain('$2,999');
    expect(AREA_FAQ[1]).toContain('Tacoma');
  });
});
