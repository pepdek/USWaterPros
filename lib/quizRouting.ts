// Pure quiz routing: answers in, recommendation out. No React, no I/O, so it can be unit tested.
import { PRICING } from './pricing';

export type QuizAnswers = {
  waterConcerns: string[];
  waterSourceType?: 'private_well' | 'municipal';
  servicePathA?: string; // Softness | Purity | Both
  [k: string]: unknown;
};
export type AddonId = keyof typeof PRICING.addons;
export type WellTestId = keyof typeof PRICING.wellTest;

export type Recommendation =
  | { path: 'whole-home'; id: string; label: string; price: number; includes: readonly string[]; suggestedAddons: AddonId[] }
  | { path: 'well-test'; tag: 'well-water-prospect'; tests: WellTestId[]; creditTowardInstall: true };

export const hasWell = (a: QuizAnswers) => (a.waterConcerns ?? []).includes('Private well water');
// Private-well prospects go to the well-test flow. Everyone else (softener, carbon, RO, city water, mixed, not sure) gets the flagship.
export const isWellProspect = (a: QuizAnswers) => hasWell(a) && a.waterSourceType === 'private_well';

export function routeQuiz(a: QuizAnswers): Recommendation {
  if (isWellProspect(a)) return { path: 'well-test', tag: 'well-water-prospect', tests: ['basic', 'full'], creditTowardInstall: true };
  const suggestedAddons: AddonId[] = [];
  if (a.servicePathA === 'Purity' || a.servicePathA === 'Both') suggestedAddons.push('ro');
  if ((a.waterConcerns ?? []).includes('Chlorine taste')) suggestedAddons.push('carbon');
  const f = PRICING.flagship;
  return { path: 'whole-home', id: f.id, label: f.label, price: f.displayPrice, includes: f.includes, suggestedAddons };
}

export const addonsTotal = (selected: AddonId[]) => selected.reduce((sum, id) => sum + PRICING.addons[id].displayPrice, 0);
export const quoteTotal = (rec: Recommendation, selected: AddonId[]) => (rec.path === 'whole-home' ? rec.price + addonsTotal(selected) : 0);
