// SINGLE SOURCE OF TRUTH for every price on the site, in the quiz, in structured data and in the API.
// To change a price: edit this file only, then see docs/PRICING.md.

export const PRICING = {
  flagship: {
    id: 'whole-home-system',
    label: 'Whole-Home Water System',
    displayPrice: 2999, // tax-inclusive, installed
    taxInclusive: true,
    includes: [
      'Water softening (resin + brine)',
      'Carbon filtration',
      'Reverse osmosis drinking water faucet',
      'Licensed installation',
    ],
  },
  addons: {
    ro: { id: 'ro-drinking', label: 'Reverse Osmosis Drinking Water', displayPrice: 699, taxInclusive: true },
    carbon: { id: 'carbon-filtration', label: 'Carbon Filtration', displayPrice: 949, taxInclusive: true },
  },
  wellTest: {
    basic: { id: 'well-test-basic', label: 'Basic Well Water Test (nitrate + coliform)', displayPrice: 149, creditTowardInstall: true },
    full: { id: 'well-test-full', label: 'Full Well Water Panel (metals, minerals, nitrate)', displayPrice: 349, creditTowardInstall: true },
  },
  headline: 'Whole-home system from $2,999 installed, tax included.',
} as const;

export const formatUSD = (n: number): string => '$' + Math.round(n).toLocaleString('en-US');

// Market context used in the flagship comparison table (typical local ranges, not our prices).
export const MARKET = {
  premium: { low: 7500, high: 8000 },
  budget: { price: 900 },
} as const;
export const formatRange = (low: number, high: number) => `${formatUSD(low)}–${formatUSD(high).slice(1)}`;

// Annual cartridge cost quoted in maintenance Q&A.
export const ANNUAL_FILTERS = { low: 150, high: 300 } as const;

export const TAX_NOTE = 'installed, tax included';
export const flagshipPrice = formatUSD(PRICING.flagship.displayPrice);
export const roPrice = formatUSD(PRICING.addons.ro.displayPrice);
export const carbonPrice = formatUSD(PRICING.addons.carbon.displayPrice);
export const wellCredit = 'The test fee is credited toward your install if you purchase.';

// Same sentence everywhere a cost question is answered (home FAQ, city FAQs, and their FAQPage schema).
export const costAnswer = (): string =>
  `${PRICING.headline} Add reverse osmosis drinking water for ${roPrice} or carbon filtration for ${carbonPrice}. Both are installed on the same visit as your whole-home system.`;
