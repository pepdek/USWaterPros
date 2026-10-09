// Typical water profile by service area. This is NOT a lab test of any one tap: it summarizes how each area is supplied
// and what homeowners there should check. Exact numbers live in the utility's annual water quality report (linked below).
// Verify wording against each utility's current report before running ads.

export type Likelihood = 'Common' | 'Possible' | 'Less likely' | 'Check yours';
export type ProfileRow = { label: string; level: Likelihood; note: string };
// Real results copied from a utility's published annual report.
export type MeasuredRow = { name: string; result: string; limit: string; note?: string };
export type Measured = { source: string; year: number; url: string; rows: MeasuredRow[] };
export type Profile = { id: string; area: string; supply: string; rows: ProfileRow[]; links: [string, string][]; measured?: Measured };

const EPA_CCR: [string, string] = ['Find your utility’s annual water quality report (EPA)', 'https://www.epa.gov/ccr'];
export const ewgZipUrl = (zip: string) => `https://www.ewg.org/tapwater/search-results.php?zip5=${zip}&searchtype=zip`;
const LEAD: ProfileRow = { label: 'Older plumbing (lead)', level: 'Possible', note: 'Homes built before 1986 may have lead solder or fixtures. A water test shows whether lead is present.' };

const tacoma: Profile = {
  id: 'tacoma', area: 'Tacoma', supply: 'Most of Tacoma is served by Tacoma Water. The Green River provides most of the water, and Tacoma Water’s 24 groundwater wells supply about 4 to 11 percent of demand in a typical year.',
  rows: [
    { label: 'Hardness', level: 'Less likely', note: 'Surface-sourced water is generally soft. Your utility’s report has the exact figure.' },
    { label: 'Chlorine and disinfectant', level: 'Common', note: 'City water is disinfected. Chlorine taste and smell are the most common complaints.' },
    { label: 'Iron and manganese', level: 'Less likely', note: 'Not typical on the city supply. More likely on private wells.' },
    LEAD,
    { label: 'Private wells', level: 'Check yours', note: 'The Tacoma-Pierce County Health Department advises testing for bacteria yearly and nitrate every three years.' },
  ],
  links: [['Tacoma Public Utilities water quality', 'https://www.mytpu.org/about-tpu/services/water/water-quality/'], ['Tacoma-Pierce County Health Department: test your water', 'https://tpchd.org/homes/drinking-water/testing/']],
  // Source: Tacoma Water 2025 Water Quality Report, pages 4 and 5 (lead and copper sampled 2025; arsenic result is from 2021).
  measured: {
    source: 'Tacoma Water 2025 Water Quality Report', year: 2025, url: 'https://www.mytpu.org/about-tpu/services/water/water-quality/',
    rows: [
      { name: 'Total trihalomethanes (disinfection byproducts)', result: '12.8 ppb average (range 3.58 to 35.4)', limit: '80 ppb average', note: 'Formed when chlorine meets organic matter in water.' },
      { name: 'Haloacetic acids (disinfection byproducts)', result: '2.0 ppb average (range under 1 to 4.55)', limit: '60 ppb average' },
      { name: 'Chlorine residual', result: '0.27 to 1.66 ppm', limit: '4 ppm', note: 'The disinfectant you taste and smell.' },
      { name: 'Fluoride', result: 'up to 0.96 ppm', limit: '4 ppm', note: 'Added by city ordinance.' },
      { name: 'Lead at the tap', result: 'Not detected at the 90th percentile. 0 of 51 homes above the action level', limit: '15 ppb action level', note: 'Sampled in 2025. Lead from home plumbing can still vary house to house.' },
      { name: 'Copper at the tap', result: 'Not detected at the 90th percentile. 0 of 51 homes above the action level', limit: '1.3 ppm action level' },
      { name: 'PFAS', result: 'Not detected in the Green River supply. In groundwater: PFHxS up to 5.1 ppt and PFBS up to 3.3 ppt', limit: 'PFHxS 10 ppt (federal limit effective 2029, state action level 10 ppt since January 2026)', note: 'Tacoma Water says it operates only wells that meet the standards.' },
      { name: 'Arsenic (groundwater)', result: 'up to 1.7 ppb (2021)', limit: '10 ppb' },
      { name: 'Nitrate (groundwater)', result: 'up to 4.0 ppm', limit: '10 ppm' },
      { name: 'Trichloroethylene (groundwater)', result: 'up to 1.6 ppb', limit: '5 ppb', note: 'Treated at Well 12A with air-stripping towers.' },
    ],
  },
};
const puyallup: Profile = {
  id: 'puyallup', area: 'Puyallup', supply: 'Puyallup is served by a mix of local water systems and private wells, so your source depends on your address.',
  rows: [
    { label: 'Hardness', level: 'Check yours', note: 'Varies by source. Groundwater and wells can differ from one address to the next.' },
    { label: 'Chlorine and disinfectant', level: 'Common', note: 'On city or district water, chlorine taste and smell are the usual complaint.' },
    { label: 'Iron and manganese', level: 'Possible', note: 'South Sound groundwater commonly carries iron and manganese, which stain fixtures and laundry.' },
    LEAD,
    { label: 'Private wells', level: 'Check yours', note: 'The Puyallup Valley’s farmland is a reason for well owners to test for nitrate. Bacteria yearly, nitrate every three years.' },
  ],
  links: [['Tacoma-Pierce County Health Department: individual wells', 'https://tpchd.org/homes/drinking-water/individual-wells/'], EPA_CCR],
};
const bremerton: Profile = {
  id: 'bremerton', area: 'Bremerton', supply: 'Kitsap County relies heavily on groundwater. Bremerton homes are on city water or, outside the city system, private wells.',
  rows: [
    { label: 'Hardness', level: 'Check yours', note: 'Varies by aquifer. Many Kitsap homes have softer water than other parts of the country.' },
    { label: 'Chlorine and disinfectant', level: 'Common', note: 'On city water, chlorine taste and smell are the usual complaint.' },
    { label: 'Iron and manganese', level: 'Possible', note: 'Glacial groundwater commonly carries both. Staining is the sign. Kitsap Public Health’s “Kitsap 5” test checks them.' },
    { ...LEAD, note: 'Bremerton has a lot of older housing. Homes built before 1986 may have lead solder or fixtures.' },
    { label: 'Private wells', level: 'Check yours', note: 'Kitsap Public Health District recommends testing for bacteria yearly and nitrate every three years.' },
  ],
  links: [['Kitsap Public Health District: private wells', 'https://www.kitsappublichealth.org/dwos/privatewells'], EPA_CCR],
};
const portOrchard: Profile = {
  id: 'port-orchard', area: 'Port Orchard', supply: 'Port Orchard homes draw on a mix of city water and private wells, mostly from groundwater.',
  rows: [
    { label: 'Hardness', level: 'Check yours', note: 'Varies by source. Minerals can build up on fixtures and appliances over time.' },
    { label: 'Chlorine and disinfectant', level: 'Common', note: 'On city water, chlorine taste and smell are the usual complaint.' },
    { label: 'Iron and manganese', level: 'Possible', note: 'Staining on sinks, tubs and laundry is the sign. A well test confirms the levels.' },
    LEAD,
    { label: 'Private wells', level: 'Check yours', note: 'Near the shoreline, watch chloride. It is one of the five tests Kitsap Public Health requires on new wells.' },
  ],
  links: [['Kitsap Public Health District: private wells', 'https://www.kitsappublichealth.org/dwos/privatewells'], EPA_CCR],
};
const kitsap: Profile = { ...bremerton, id: 'kitsap', area: 'Kitsap County', supply: 'Kitsap County relies heavily on groundwater, through water districts, city systems and thousands of private wells.' };
const pierce: Profile = { ...puyallup, id: 'pierce', area: 'Pierce County', supply: 'Pierce County water comes from surface sources, groundwater and private wells. Tacoma Water draws mainly on the Green River; many other systems use groundwater or springs.' };

export const PROFILES = { tacoma, puyallup, bremerton, portOrchard, kitsap, pierce };
// One ZIP to try for each area we serve (fills the field when a visitor taps the area).
export const AREA_SHORTCUTS: [string, string][] = [['Tacoma', '98402'], ['Puyallup', '98371'], ['Bremerton', '98310'], ['Port Orchard', '98366']];

const inList = (zip: string, list: string[]) => list.includes(zip);

// Map a ZIP to its area profile. Unknown ZIPs return null (the caller shows a general next step).
export function profileForZip(zip: string): Profile | null {
  if (!/^\d{5}$/.test(zip)) return null;
  if (/^984\d\d$/.test(zip)) return tacoma;
  if (inList(zip, ['98371', '98372', '98373', '98374', '98375', '98390', '98391'])) return puyallup;
  if (inList(zip, ['98310', '98311', '98312', '98337'])) return bremerton;
  if (inList(zip, ['98366', '98367'])) return portOrchard;
  if (inList(zip, ['98110', '98310', '98315', '98322', '98340', '98345', '98346', '98364', '98370', '98380', '98383', '98392'])) return kitsap;
  if (inList(zip, ['98321', '98327', '98328', '98329', '98332', '98333', '98335', '98338', '98354', '98356', '98360', '98387', '98388', '98303', '98304'])) return pierce;
  return null;
}
