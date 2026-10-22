import { describe, expect, it } from 'vitest';
import crypto from 'node:crypto';
import { PRICING, TIERS, tierById } from './pricing';
import { isServedZip } from './serviceArea';
import { bookableRange, isoDay, validOrder } from './order';
import { verifyStripeSignature } from './stripeSig';

describe('tiers', () => {
  it('Complete is the flagship price; Essential sits $200 below; Iron-Free above', () => {
    expect(tierById('complete')!.price).toBe(PRICING.flagship.displayPrice);
    expect(tierById('essential')!.price).toBe(2799);
    expect(tierById('iron-free')!.price).toBe(3799);
    expect(TIERS.filter((t) => t.popular)).toHaveLength(1);
  });
  it('every card has four bullets and no cost or margin text', () => {
    for (const t of TIERS) { expect(t.bullets).toHaveLength(4); expect(JSON.stringify(t)).not.toMatch(/cost|margin|1,490|1,670|2,380/i); }
  });
});

describe('service area (Pierce County only)', () => {
  it('accepts Tacoma, Puyallup, Gig Harbor ZIPs', () => { for (const z of ['98402', '98406', '98371', '98335', '98388', '98499']) expect(isServedZip(z), z).toBe(true); });
  it('sends Kitsap, Thurston and junk to the waitlist', () => { for (const z of ['98310', '98366', '98501', '98503', '9840', 'abcde', '']) expect(isServedZip(z), z).toBe(false); });
});

describe('order validation', () => {
  const now = new Date('2026-10-20T10:00:00');
  const day = (n: number) => { const d = new Date(now); d.setDate(d.getDate() + n); return isoDay(d); };
  const ok = { tier: 'complete', date: day(5), window: 'Morning', address: '123 Main St, Tacoma 98402' } as const;
  it('accepts a good order', () => expect(validOrder({ ...ok, date: '2026-10-26' }, now)).toBe(true)); // a Monday, 6 days out
  it('rejects too soon, too far, Sundays, bad tier, short address', () => {
    expect(validOrder({ ...ok, date: day(1) }, now)).toBe(false);
    expect(validOrder({ ...ok, date: day(90) }, now)).toBe(false);
    expect(validOrder({ ...ok, date: '2026-10-25' }, now)).toBe(false); // Sunday
    expect(validOrder({ ...ok, tier: 'gold' as never, date: '2026-10-26' }, now)).toBe(false);
    expect(validOrder({ ...ok, address: '12', date: '2026-10-26' }, now)).toBe(false);
  });
  it('bookable range is 3 to 60 days out', () => { const r = bookableRange(now); expect(isoDay(r.min)).toBe('2026-10-23'); expect(isoDay(r.max)).toBe('2026-12-19'); });
});

describe('stripe webhook signature', () => {
  const secret = 'whsec_test', body = '{"type":"checkout.session.completed"}', t = 1_800_000_000;
  const sig = (s: string, ts = t) => `t=${ts},v1=${crypto.createHmac('sha256', s).update(`${ts}.${body}`).digest('hex')}`;
  it('accepts a good signature', () => expect(verifyStripeSignature(body, sig(secret), secret, t * 1000)).toBe(true));
  it('rejects a wrong secret, tampered body, stale timestamp and missing header', () => {
    expect(verifyStripeSignature(body, sig('other'), secret, t * 1000)).toBe(false);
    expect(verifyStripeSignature(body + ' ', sig(secret), secret, t * 1000)).toBe(false);
    expect(verifyStripeSignature(body, sig(secret), secret, (t + 3600) * 1000)).toBe(false);
    expect(verifyStripeSignature(body, '', secret, t * 1000)).toBe(false);
  });
});

import { AVG_UPLIFT, avgTotal } from './pricing';
describe('average total price line on /pricing', () => {
  it('adds 1%, 1.25% and 2% to the starting price, rounded to the dollar', () => {
    expect(AVG_UPLIFT).toEqual({ essential: 0.01, complete: 0.0125, 'iron-free': 0.02 });
    expect(avgTotal('essential')).toBe(2827);   // 2,799 x 1.01   = 2,826.99
    expect(avgTotal('complete')).toBe(3036);    // 2,999 x 1.0125 = 3,036.49
    expect(avgTotal('iron-free')).toBe(3875);   // 3,799 x 1.02   = 3,874.98
  });
});
