import { describe, expect, it } from 'vitest';
import { contrast, TEAL_ON_WHITE } from './contrast';

describe('accessible brand teal', () => {
  it('the plain brand teal fails 4.5:1 on white (so we darken it)', () => expect(contrast('#00a0bf', '#ffffff')).toBeLessThan(4.5));
  it('the darkened teal passes 4.5:1 on white', () => expect(contrast(TEAL_ON_WHITE, '#ffffff')).toBeGreaterThanOrEqual(4.5));
  it('ink labels pass on white', () => expect(contrast('#1a1a1a', '#ffffff')).toBeGreaterThanOrEqual(7));
});
