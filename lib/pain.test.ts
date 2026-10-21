import { describe, expect, it } from 'vitest';
import { PAIN, headline, painForCity, painForZip } from './pain';

describe('headline pain word by area', () => {
  it('Gig Harbor is metal, Puyallup is hard water, everyone else is chlorine', () => {
    expect(headline(painForCity('Gig Harbor'))).toBe('Metal taste gone.');
    expect(headline(painForCity('puyallup '))).toBe('Hard water gone.');
    expect(headline(painForCity('Tacoma'))).toBe('Chlorine taste gone.');
    expect(headline(painForCity(''))).toBe('Chlorine taste gone.');
  });
  it('ZIPs map the same way and ignore junk', () => {
    expect(painForZip('98335')).toBe('metal');
    expect(painForZip('98371')).toBe('hard');
    expect(painForZip('98402')).toBe('chlorine');
    expect(painForZip('984')).toBeNull();
  });
  it('metal area preselects the Iron-Free system; the rest preselect Complete', () => {
    expect(PAIN.metal.tier).toBe('iron-free');
    expect(PAIN.hard.tier).toBe('complete');
    expect(PAIN.chlorine.tier).toBe('complete');
  });
});
