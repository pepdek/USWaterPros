import { describe, expect, it } from 'vitest';
import { DEFAULTS, DIAG_QUESTIONS, diagnose, estimateCosts, estimateGallons } from './costModel';
import { profileForZip } from './waterProfiles';
import { PRICING } from './pricing';

describe('profileForZip', () => {
  it('maps the four service areas', () => {
    expect(profileForZip('98402')?.id).toBe('tacoma');
    expect(profileForZip('98499')?.id).toBe('tacoma');
    expect(profileForZip('98371')?.id).toBe('puyallup');
    expect(profileForZip('98310')?.id).toBe('bremerton');
    expect(profileForZip('98366')?.id).toBe('port-orchard');
  });
  it('maps nearby Kitsap and Pierce ZIPs to their county profile', () => {
    expect(profileForZip('98383')?.id).toBe('kitsap');
    expect(profileForZip('98335')?.id).toBe('pierce');
  });
  it('returns null for bad or out-of-area ZIPs', () => {
    expect(profileForZip('9840')).toBeNull();
    expect(profileForZip('abcde')).toBeNull();
    expect(profileForZip('10001')).toBeNull();
  });
});

describe('Tacoma measured data (from the Tacoma Water 2025 report)', () => {
  const m = profileForZip('98406')?.measured;
  it('98406 resolves to Tacoma with a measured table', () => { expect(profileForZip('98406')?.id).toBe('tacoma'); expect(m?.rows.length).toBeGreaterThanOrEqual(8); });
  it('carries the published figures', () => {
    const get = (n: string) => m!.rows.find((r) => r.name.startsWith(n))!;
    expect(get('Total trihalomethanes').result).toContain('12.8 ppb');
    expect(get('Total trihalomethanes').limit).toContain('80 ppb');
    expect(get('Haloacetic').result).toContain('2.0 ppb');
    expect(get('Lead').result).toContain('0 of 51');
  });
  it('Puyallup, Bremerton and Port Orchard have measured data from their own reports', () => {
    const rows = (zip: string) => profileForZip(zip)!.measured!.rows;
    expect(profileForZip('98371')!.measured!.utility).toBe('City of Puyallup');
    expect(rows('98371').find((r) => r.name === 'Arsenic')!.result).toContain('7.9 ppb');
    expect(rows('98371').find((r) => r.name === 'Water hardness')!.result).toContain('89 ppm');
    expect(profileForZip('98310')!.measured!.utility).toBe('City of Bremerton');
    expect(rows('98310').find((r) => r.name.startsWith('Total trihalomethanes'))!.result).toContain('65 ppb');
    expect(profileForZip('98366')!.measured!.utility).toBe('City of Port Orchard');
    expect(rows('98366').find((r) => r.name.startsWith('PFOA'))!.result).toContain('3.67 ppt');
  });
  it('county-level profiles do not borrow a city utility’s numbers', () => {
    expect(profileForZip('98383')?.measured).toBeUndefined();
    expect(profileForZip('98335')?.measured).toBeUndefined();
  });
  it('every percent-of-limit is between 0 and 100 and every row names its limit', () => {
    for (const z of ['98402', '98371', '98310', '98366']) for (const r of profileForZip(z)!.measured!.rows) {
      if (r.pct !== undefined) { expect(r.pct).toBeGreaterThanOrEqual(0); expect(r.pct).toBeLessThanOrEqual(100); }
      expect(r.limit.length).toBeGreaterThan(0);
    }
  });
});

describe('estimateCosts', () => {
  it('estimates gallons from family size', () => { expect(estimateGallons(4)).toBe(119720); });

  it('softener + bottled water household: current costs more than ours, with a payback', () => {
    const r = estimateCosts({ hasSoftener: true, familySize: 4, drinking: 'bottled' });
    const bottled = r.current.find((l) => l.key === 'bottled')!;
    expect(bottled.amount).toBe(Math.round(4 * DEFAULTS.bottledGallonsPerPersonPerDay * 365 * DEFAULTS.bottledPricePerGallon));
    expect(r.currentTotal).toBe(r.current.reduce((s, l) => s + l.amount, 0));
    expect(r.savingsPerYear).toBe(r.currentTotal - r.oursTotal);
    expect(r.savingsPerYear).toBeGreaterThan(0);
    expect(r.paybackYears).toBeCloseTo(PRICING.flagship.displayPrice / r.savingsPerYear, 0);
    expect(r.oursTenYear).toBe(PRICING.flagship.displayPrice + r.oursTotal * 10);
  });

  it('a cheap current setup does not claim savings', () => {
    const r = estimateCosts({ hasSoftener: false, familySize: 2, drinking: 'tap' });
    expect(r.currentTotal).toBe(0);
    expect(r.savingsPerYear).toBeLessThanOrEqual(0);
    expect(r.paybackYears).toBeNull();
  });

  it('uses the visitor gallons when given, and custom assumptions', () => {
    const base = estimateCosts({ hasSoftener: true, familySize: 3, annualGallons: 50000, drinking: 'tap' });
    expect(base.gallons).toBe(50000);
    const pricey = estimateCosts({ hasSoftener: true, familySize: 3, annualGallons: 50000, drinking: 'tap' }, { ...DEFAULTS, saltBagPrice: 16 });
    expect(pricey.current[0].amount).toBe(base.current[0].amount * 2);
  });
});

describe('diagnose', () => {
  it('has 7 yes/no questions', () => { expect(DIAG_QUESTIONS).toHaveLength(7); });
  it('no answers is efficient with no waste', () => {
    expect(diagnose([])).toMatchObject({ score: 0, waste: 0, tier: 'efficient' });
  });
  it('bottled water alone is wasting money', () => {
    const d = diagnose(['bottled']);
    expect(d.tier).toBe('wasting');
    expect(d.waste).toBeGreaterThan(300);
    expect(d.headline).toContain(d.waste.toLocaleString('en-US'));
  });
  it('two non-cost issues is borderline', () => {
    expect(diagnose(['scale', 'taste']).tier).toBe('borderline');
  });
  it('four or more yes answers is wasting', () => {
    expect(diagnose(['scale', 'taste', 'old', 'repair']).tier).toBe('wasting');
  });
});
