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

// The three systems sold online. Complete is the flagship price above; Essential and Iron-Free sit either side of it.
// Costs and margins never live in this repo.
export type TierId = 'essential' | 'complete' | 'iron-free';
export const TIERS: { id: TierId; name: string; subhead: string; price: number; icon: string; popular?: boolean; bullets: string[]; fit: string }[] = [
  {
    id: 'essential', name: 'Essential', subhead: 'Clean taste from every single tap', price: 2799, icon: 'drop',
    bullets: ['Whole-home carbon filtration', 'Reverse osmosis drinking-water faucet', 'Installed by a licensed local plumber', '1-year warranty'],
    fit: 'Soft-water city homes that mainly want taste and chlorine gone.',
  },
  {
    id: 'complete', name: 'Complete', subhead: 'The right fit for most homes', price: PRICING.flagship.displayPrice, icon: 'shield', popular: true,
    bullets: ['Water softener plus whole-home carbon', 'Reverse osmosis drinking-water faucet', 'Installed by a licensed local plumber', '1-year warranty'],
    fit: 'The default for most homes.',
  },
  {
    id: 'iron-free', name: 'Iron-Free', subhead: 'Complete, plus iron and stain removal', price: 3799, icon: 'layers',
    bullets: ['Everything in Complete', 'Iron and manganese filter', 'Installed by a licensed local plumber', '1-year warranty'],
    fit: 'Orange or brown staining and a metallic taste.',
  },
];
// "Avg total price" shown on /pricing: the starting price plus a small allowance (1%, 1.25%, 2%) for the extras some homes need.
// This is a formula, not an average of real orders. VERIFY and replace with real averages once there are completed installs.
export const AVG_UPLIFT: Record<TierId, number> = { essential: 0.01, complete: 0.0125, 'iron-free': 0.02 };
export const avgTotal = (id: TierId): number => { const t = TIERS.find((x) => x.id === id)!; return Math.round(t.price * (1 + AVG_UPLIFT[id])); };
export const tierById = (id: string) => TIERS.find((t) => t.id === id);

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
