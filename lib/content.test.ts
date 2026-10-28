import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Guard rails from the positioning cleanup: claims we cannot back up must not come back into the source.
const ROOT = path.resolve(__dirname, '..');
const walk = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? (['node_modules', '.next'].includes(e.name) ? [] : walk(p)) : /\.(ts|tsx)$/.test(e.name) && !/\.test\.ts$/.test(e.name) ? [p] : [];
});
const files = ['app', 'components', 'lib'].flatMap((d) => walk(path.join(ROOT, d)));

const BANNED: [RegExp, string][] = [
  [/toxic cocktail|infrastructure is breaking|tap water is contaminated/i, 'fear headline'],
  [/\bcancer\b|fertility|hormone disruption|child development/i, 'health-outcome claim'],
  [/join the families/i, 'unsupported social proof'],
  [/top.?rated/i, 'rating claim'],
  [/since 2009|17 years|5,000\+/i, 'unsupported history claim'],
  [/licensed technician|our technicians/i, 'wording: plumbers install, not our technicians'],
  [/100% satisfaction guarantee|same-day quote|within 1 hour/i, 'retired promise'],
  [/better business bureau|certified contractors/i, 'undocumented credential'],
  [/emergency repair/i, 'unconfirmed service'],
  [/dry skin|softer skin|skin and hair/i, 'skin / hair claim'],
  [/aggregateRating|ratingValue/i, 'rating schema'],
  [/own your health|family.s health|exposing your family|protect your family|health guarantee|health costs/i, 'health / fear wording'],
];

describe('positioning guard rails', () => {
  for (const [rx, why] of BANNED) {
    it(`no "${why}" in the source`, () => {
      const hits = files.filter((f) => rx.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(ROOT, f));
      expect(hits).toEqual([]);
    });
  }
});
