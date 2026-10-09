// True cost model for the calculator and the savings diagnostic. Every number is a typical-cost ASSUMPTION the visitor can change.
// Health costs are deliberately not priced: nobody can honestly put a dollar figure on them.
import { ANNUAL_FILTERS, PRICING } from './pricing';

export type Assumptions = {
  gallonsPerPersonPerDay: number;   // EPA WaterSense: the average American uses about 82 gallons a day at home
  waterPricePerGallon: number;      // water + sewer, typical
  softenerWastePct: number;         // share of softened water used by regeneration
  gallonsPerSaltBag: number;        // one 40-lb bag per about 10,000 gallons softened
  saltBagPrice: number;
  softenerServicePerYear: number;   // service, repairs and resin, averaged
  pitcherFiltersPerYear: number;
  bottledGallonsPerPersonPerDay: number;
  bottledPricePerGallon: number;
  cartridgesPerYear: number;        // separate filter system cartridges
};
export const DEFAULTS: Assumptions = {
  gallonsPerPersonPerDay: 82, waterPricePerGallon: 0.012, softenerWastePct: 0.04, gallonsPerSaltBag: 10000, saltBagPrice: 8,
  softenerServicePerYear: 100, pitcherFiltersPerYear: 120, bottledGallonsPerPersonPerDay: 0.4, bottledPricePerGallon: 1.25, cartridgesPerYear: 200,
};

export type Drinking = 'tap' | 'pitcher' | 'bottled' | 'cartridge_filter';
export type CostInput = { hasSoftener: boolean; familySize: number; annualGallons?: number; drinking: Drinking };
export type Line = { key: string; label: string; amount: number; note: string };
export type CostResult = {
  gallons: number; current: Line[]; currentTotal: number; ours: Line[]; oursTotal: number;
  savingsPerYear: number; paybackYears: number | null; currentTenYear: number; oursTenYear: number;
};

const r = (n: number) => Math.round(n);
export const estimateGallons = (familySize: number, a: Assumptions = DEFAULTS) => r(familySize * a.gallonsPerPersonPerDay * 365);
// Midpoint of our published annual filter range.
export const OUR_FILTERS_PER_YEAR = (ANNUAL_FILTERS.low + ANNUAL_FILTERS.high) / 2;

export function estimateCosts(i: CostInput, a: Assumptions = DEFAULTS): CostResult {
  const people = Math.max(1, Math.min(12, Math.round(i.familySize) || 1));
  const gallons = i.annualGallons && i.annualGallons > 0 ? i.annualGallons : estimateGallons(people, a);
  const salt = (gallons / a.gallonsPerSaltBag) * a.saltBagPrice;
  const waste = gallons * a.softenerWastePct * a.waterPricePerGallon;
  const current: Line[] = [];
  if (i.hasSoftener) {
    current.push({ key: 'salt', label: 'Softener salt', amount: r(salt), note: `About ${Math.ceil(gallons / a.gallonsPerSaltBag)} bags a year` });
    current.push({ key: 'waste', label: 'Water wasted by regeneration', amount: r(waste), note: `About ${r(gallons * a.softenerWastePct).toLocaleString('en-US')} gallons a year` });
    current.push({ key: 'service', label: 'Softener service and repairs', amount: r(a.softenerServicePerYear), note: 'Averaged over the life of the system' });
  }
  if (i.drinking === 'pitcher') current.push({ key: 'pitcher', label: 'Pitcher or faucet filters', amount: r(a.pitcherFiltersPerYear), note: 'Replacement cartridges' });
  if (i.drinking === 'bottled') current.push({ key: 'bottled', label: 'Bottled water', amount: r(people * a.bottledGallonsPerPersonPerDay * 365 * a.bottledPricePerGallon), note: `About ${r(people * a.bottledGallonsPerPersonPerDay * 365).toLocaleString('en-US')} gallons a year` });
  if (i.drinking === 'cartridge_filter') current.push({ key: 'cartridges', label: 'Filter cartridges', amount: r(a.cartridgesPerYear), note: 'Replacement cartridges' });
  const currentTotal = current.reduce((s, l) => s + l.amount, 0);

  // Our system softens too, so salt and regeneration water still apply. Service is included, drinking water is covered by the RO faucet.
  const ours: Line[] = [
    { key: 'salt', label: 'Softener salt', amount: r(salt), note: 'Same as any softener' },
    { key: 'waste', label: 'Water used by regeneration', amount: r(waste), note: 'Same as any softener' },
    { key: 'filters', label: 'Annual filter replacements', amount: r(OUR_FILTERS_PER_YEAR), note: `${ANNUAL_FILTERS.low}–${ANNUAL_FILTERS.high} a year` },
  ];
  const oursTotal = ours.reduce((s, l) => s + l.amount, 0);
  const savingsPerYear = currentTotal - oursTotal;
  const price = PRICING.flagship.displayPrice;
  return {
    gallons, current, currentTotal, ours, oursTotal, savingsPerYear,
    paybackYears: savingsPerYear > 0 ? Math.round((price / savingsPerYear) * 10) / 10 : null,
    currentTenYear: currentTotal * 10, oursTenYear: price + oursTotal * 10,
  };
}

// Savings diagnostic: seven yes/no checks. "cost" answers carry a typical annual dollar figure for a household of three.
export type DiagQuestion = { id: string; text: string; cost: (a: Assumptions) => number };
const HOUSEHOLD = 3;
export const DIAG_QUESTIONS: DiagQuestion[] = [
  { id: 'old', text: 'Is your softener or water filter more than 10 years old?', cost: (a) => a.softenerServicePerYear },
  { id: 'bottled', text: 'Do you buy bottled water at least once a week?', cost: (a) => HOUSEHOLD * a.bottledGallonsPerPersonPerDay * 365 * a.bottledPricePerGallon },
  { id: 'pitcher', text: 'Do you keep buying replacement filters for a pitcher or faucet filter?', cost: (a) => a.pitcherFiltersPerYear },
  { id: 'salt', text: 'Do you refill softener salt about once a month?', cost: (a) => (estimateGallons(HOUSEHOLD, a) / a.gallonsPerSaltBag) * a.saltBagPrice },
  { id: 'repair', text: 'Have you paid for a water-system repair or service call in the last two years?', cost: () => 75 },
  { id: 'scale', text: 'Do you see white scale, spots or orange staining on fixtures and glass?', cost: () => 0 },
  { id: 'taste', text: 'Do you notice a chlorine taste or smell in your tap water?', cost: () => 0 },
];
export type Diagnosis = { score: number; waste: number; tier: 'wasting' | 'borderline' | 'efficient'; headline: string; detail: string };

export function diagnose(yes: string[], a: Assumptions = DEFAULTS): Diagnosis {
  const hit = DIAG_QUESTIONS.filter((q) => yes.includes(q.id));
  const score = hit.length;
  const waste = r(hit.reduce((s, q) => s + q.cost(a), 0));
  const tier = waste >= 300 || score >= 4 ? 'wasting' : score >= 2 || waste >= 100 ? 'borderline' : 'efficient';
  const headline = tier === 'wasting' ? `You’re likely wasting about $${waste.toLocaleString('en-US')} a year.`
    : tier === 'borderline' ? 'Your setup is borderline. It needs monitoring.' : 'Your setup looks efficient.';
  const detail = tier === 'wasting' ? 'That adds up from the items you checked, using typical costs for a household of three. A system built for your exact water can replace most of them.'
    : tier === 'borderline' ? 'A few signs point to extra cost or a water issue. A short call tells you whether it is worth changing anything.'
    : 'Few warning signs. If you still have questions about what is in your water, a free consultation is the next step.';
  return { score, waste, tier, headline, detail };
}
