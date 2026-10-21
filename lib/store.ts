import { ANNUAL_FILTERS, TIERS, formatUSD } from './pricing';

// Store copy that other pages repeat. Edit here once.
export const STORE = {
  cta: 'Get Instant Price',
  secondary: 'Text us',
  payment: 'You pay the full price up front, by card, through Stripe.',
  refund: '100% refundable.',
  // VERIFY: exact refund terms (until when, how long it takes, anything not covered). Left empty on purpose; shown when filled in.
  refundTerms: '',
  from: formatUSD(Math.min(...TIERS.map((t) => t.price))),
  to: formatUSD(Math.max(...TIERS.map((t) => t.price))),
  // Owner-supplied company facts (install time and start year).
  installHours: '4',
  since: '2009',
  // Owner-supplied platform line. VERIFY: substantiation for "background-checked" and "50 states", and that Water Treatment Systems Inc is the legal entity.
  platform: 'Water Treatment Systems Inc',
  annualFilters: `${formatUSD(ANNUAL_FILTERS.low)}–${ANNUAL_FILTERS.high}`,
};
