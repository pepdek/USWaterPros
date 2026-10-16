import { PRICING, TAX_NOTE, ANNUAL_FILTERS, MARKET, formatUSD, formatRange } from './pricing';
import { PHONE, PHONE_HREF, SMS_HREF } from './constants';

// Single place for the facts every conversion page repeats. Prices come from lib/pricing.ts, never typed here.
export const SITE = {
  name: 'US Water Pros',
  phoneDisplay: PHONE,
  phoneTel: '+12537770901',
  phoneHref: PHONE_HREF,
  textHref: SMS_HREF,
  priceInstalled: formatUSD(PRICING.flagship.displayPrice),
  priceNote: TAX_NOTE,
  warrantyYears: 1,
  installHours: 'about 4',
  callbackWindow: '10 minutes',
  cta: 'Get My Fixed Price',
  serviceAreas: ['Tacoma', 'Puyallup', 'Bremerton', 'Port Orchard', 'Olympia', 'Lacey'],
  annualFilters: `${formatUSD(ANNUAL_FILTERS.low)}–${ANNUAL_FILTERS.high}`,
  premiumRange: formatRange(MARKET.premium.low, MARKET.premium.high),
  budgetPrice: formatUSD(MARKET.budget.price),
};

// The three pages that use the direct-response layout (the header CTA label follows).
export const CRO_PATHS = ['/', '/services/whole-home-water-filtration', '/services/whole-home-water-filtration-tacoma', '/cities/tacoma'];
