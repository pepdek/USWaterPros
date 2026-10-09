import { describe, expect, it } from 'vitest';
import { ANNUAL_FILTERS, MARKET, PRICING, costAnswer, formatRange, formatUSD } from './pricing';

describe('PRICING matches the spec', () => {
  it('flagship', () => {
    expect(PRICING.flagship.id).toBe('whole-home-system');
    expect(PRICING.flagship.label).toBe('Whole-Home Water System');
    expect(PRICING.flagship.displayPrice).toBe(2999);
    expect(PRICING.flagship.taxInclusive).toBe(true);
    expect(PRICING.flagship.includes).toEqual([
      'Water softening (resin + brine)', 'Carbon filtration', 'Reverse osmosis drinking water faucet', 'Licensed installation',
    ]);
  });
  it('add-ons', () => {
    expect(PRICING.addons.ro).toMatchObject({ id: 'ro-drinking', displayPrice: 699, taxInclusive: true });
    expect(PRICING.addons.carbon).toMatchObject({ id: 'carbon-filtration', displayPrice: 949, taxInclusive: true });
  });
  it('well tests are credited toward install', () => {
    expect(PRICING.wellTest.basic).toMatchObject({ id: 'well-test-basic', displayPrice: 149, creditTowardInstall: true });
    expect(PRICING.wellTest.full).toMatchObject({ id: 'well-test-full', displayPrice: 349, creditTowardInstall: true });
  });
  it('headline is built from the flagship price', () => {
    expect(PRICING.headline).toBe('Whole-home system from $2,999 installed, tax included.');
    expect(PRICING.headline).toContain(formatUSD(PRICING.flagship.displayPrice));
  });
});

describe('formatters and shared copy', () => {
  it('formatUSD', () => {
    expect(formatUSD(2999)).toBe('$2,999');
    expect(formatUSD(699)).toBe('$699');
    expect(formatUSD(149)).toBe('$149');
  });
  it('formatRange', () => { expect(formatRange(MARKET.premium.low, MARKET.premium.high)).toBe('$7,500–8,000'); });
  it('annual filter cost', () => { expect(ANNUAL_FILTERS).toEqual({ low: 150, high: 300 }); });
  it('cost answer carries the flagship price and both add-ons', () => {
    const a = costAnswer();
    expect(a).toContain('from $2,999 installed, tax included');
    expect(a).toContain('$699');
    expect(a).toContain('$949');
    expect(a).toContain('same visit as your whole-home system');
  });
});
