import { describe, expect, it } from 'vitest';
import { firstName, orderConfirmed } from './orderConfirmed';
import { confirmDeadline } from '../confirmBy';

const base = { name: 'jordan rivera', systemName: 'Complete', installDate: '2026-11-03', window: 'Morning', address: '1 Main St, Tacoma, WA 98402', chargedCents: 299900, confirmBy: confirmDeadline(new Date('2026-10-23T20:36:39Z')), supportEmail: 'support@uswaterpros.com' };

describe('order confirmed email', () => {
  it('greets by first name, names the day, the system and the real amount charged', () => {
    const m = orderConfirmed(base);
    expect(m.html).toContain('Clean water is on the way, Jordan.');
    expect(m.html).toContain('Tuesday, November 3'); expect(m.html).toContain('$2,999'); expect(m.html).toContain('Complete');
    expect(m.text).toContain('Install day: Tuesday, November 3 (morning)');
  });
  it('promises the text by the end of the NEXT business day (Friday order -> Monday)', () => expect(orderConfirmed(base).html).toContain('Monday, October 26'));
  it('shows a discounted charge, not the list price', () => expect(orderConfirmed({ ...base, chargedCents: 0 }).html).toContain('$0 installed'));
  it('escapes anything the customer typed', () => {
    const m = orderConfirmed({ ...base, name: '<script>x</script>', address: '"><img src=x>' });
    expect(m.html).not.toContain('<script>x'); expect(m.html).not.toContain('<img src=x>');
  });
  it('has a plain-text version, a preheader, and no fear language', () => {
    const m = orderConfirmed(base);
    expect(m.text.length).toBeGreaterThan(200); expect(m.html).toContain('display:none'); expect(m.html + m.text).not.toMatch(/danger|toxic|unsafe|poison/i);
  });
  it('falls back politely with no name', () => expect(firstName('  ')).toBe('there'));
});
