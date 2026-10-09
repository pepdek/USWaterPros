import { describe, expect, it } from 'vitest';
import { PRICING } from './pricing';
import { addonsTotal, hasWell, quoteTotal, routeQuiz, type QuizAnswers } from './quizRouting';

const CONCERNS = ['Hard water spots', 'Chlorine taste', 'Dry skin', 'Scale buildup', 'Private well water', 'Multiple problems'];
const SOURCES = [undefined, 'municipal', 'private_well'] as const;
const PATHS = [undefined, 'Softness', 'Purity', 'Both'];

// Every non-empty subset of concerns x water source x Q4 answer.
const combos: QuizAnswers[] = [];
for (let mask = 1; mask < 1 << CONCERNS.length; mask++) {
  const waterConcerns = CONCERNS.filter((_, i) => mask & (1 << i));
  for (const waterSourceType of SOURCES) for (const servicePathA of PATHS) combos.push({ waterConcerns, waterSourceType, servicePathA });
}

describe('routeQuiz', () => {
  it('covers every answer combination', () => { expect(combos.length).toBe(63 * 3 * 4); });

  it('routes every combination to the flagship or the well-test path, nothing else', () => {
    for (const a of combos) expect(['whole-home', 'well-test']).toContain(routeQuiz(a).path);
  });

  it('private well answers go to the well-test flow with both tests, credited toward install', () => {
    for (const a of combos.filter((c) => hasWell(c) && c.waterSourceType === 'private_well')) {
      const r = routeQuiz(a);
      expect(r).toMatchObject({ path: 'well-test', tag: 'well-water-prospect', tests: ['basic', 'full'], creditTowardInstall: true });
    }
  });

  it('everything else goes to the flagship at the flagship price', () => {
    for (const a of combos.filter((c) => !(hasWell(c) && c.waterSourceType === 'private_well'))) {
      const r = routeQuiz(a);
      expect(r.path).toBe('whole-home');
      if (r.path === 'whole-home') {
        expect(r.id).toBe(PRICING.flagship.id);
        expect(r.label).toBe(PRICING.flagship.label);
        expect(r.price).toBe(PRICING.flagship.displayPrice);
      }
    }
  });

  it('no answer produces a removed standalone path (softener-only, carbon-only, RO-only)', () => {
    const ids = new Set(combos.map((a) => { const r = routeQuiz(a); return r.path === 'whole-home' ? r.id : r.path; }));
    expect([...ids].sort()).toEqual(['well-test', 'whole-home-system']);
  });

  it('suggests RO for purity answers and carbon for chlorine concerns, never changes the route', () => {
    const r = routeQuiz({ waterConcerns: ['Chlorine taste'], servicePathA: 'Purity' });
    expect(r.path === 'whole-home' && r.suggestedAddons).toEqual(['ro', 'carbon']);
  });

  it('add-on totals come from PRICING', () => {
    const r = routeQuiz({ waterConcerns: ['Dry skin'], servicePathA: 'Softness' });
    expect(addonsTotal(['ro', 'carbon'])).toBe(699 + 949);
    expect(quoteTotal(r, [])).toBe(2999);
    expect(quoteTotal(r, ['ro'])).toBe(2999 + 699);
    expect(quoteTotal(r, ['ro', 'carbon'])).toBe(2999 + 699 + 949);
  });

  it('municipal water with a well concern still gets the flagship', () => {
    expect(routeQuiz({ waterConcerns: ['Private well water'], waterSourceType: 'municipal' }).path).toBe('whole-home');
  });
});
