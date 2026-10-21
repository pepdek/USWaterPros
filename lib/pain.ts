// The one word a homeowner uses for their water, by area. Each one rests on that utility's own 2025 report (see lib/waterProfiles.ts):
// Gig Harbor: iron and manganese above the state's aesthetic limits. Puyallup: hardness averages 89 ppm. Elsewhere: city water is chlorinated.
export type PainKey = 'metal' | 'hard' | 'chlorine';
export const PAIN: Record<PainKey, { label: string; tier: 'iron-free' | 'complete' | 'essential' }> = {
  metal: { label: 'Metal taste', tier: 'iron-free' },
  hard: { label: 'Hard water', tier: 'complete' },
  chlorine: { label: 'Chlorine taste', tier: 'complete' },
};
export const DEFAULT_PAIN: PainKey = 'chlorine';

const GIG_HARBOR_ZIPS = new Set(['98335', '98332', '98329']);
const PUYALLUP_ZIPS = new Set(['98371', '98372', '98373', '98374', '98375']);
const CITY: Record<string, PainKey> = { 'gig harbor': 'metal', puyallup: 'hard' };

export const painForZip = (zip: string): PainKey | null =>
  GIG_HARBOR_ZIPS.has(zip) ? 'metal' : PUYALLUP_ZIPS.has(zip) ? 'hard' : /^\d{5}$/.test(zip) ? DEFAULT_PAIN : null;

export const painForCity = (city: string): PainKey => CITY[city.trim().toLowerCase()] ?? DEFAULT_PAIN;

export const headline = (k: PainKey) => `${PAIN[k].label} gone.`;
