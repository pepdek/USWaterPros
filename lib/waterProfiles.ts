// Typical water profile by service area. This is NOT a lab test of any one tap: it summarizes how each area is supplied
// and what homeowners there should check. Exact numbers live in the utility's annual water quality report (linked below).
// Verify wording against each utility's current report before running ads.

export type Likelihood = 'Common' | 'Possible' | 'Less likely' | 'Check yours';
export type ProfileRow = { label: string; level: Likelihood; note: string };
// Real results copied from a utility's published annual report.
// pct = the highest result as a share of the legal limit (computed from the report's own numbers).
export type MeasuredRow = { name: string; result: string; limit: string; note?: string; pct?: number };
export type Measured = { utility: string; source: string; year: number; url: string; rows: MeasuredRow[]; note?: string };
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
    utility: 'Tacoma Water', source: 'Tacoma Water 2025 Water Quality Report', year: 2025, url: 'https://www.mytpu.org/about-tpu/services/water/water-quality/',
    rows: [
      { name: 'Total trihalomethanes (disinfection byproducts)', pct: 16, result: '12.8 ppb average (range 3.58 to 35.4)', limit: '80 ppb average', note: 'Formed when chlorine meets organic matter in water.' },
      { name: 'Haloacetic acids (disinfection byproducts)', pct: 3, result: '2.0 ppb average (range under 1 to 4.55)', limit: '60 ppb average' },
      { name: 'Chlorine residual', pct: 42, result: '0.27 to 1.66 ppm', limit: '4 ppm', note: 'The disinfectant you taste and smell.' },
      { name: 'Fluoride', pct: 24, result: 'up to 0.96 ppm', limit: '4 ppm', note: 'Added by city ordinance.' },
      { name: 'Lead at the tap', pct: 0, result: 'Not detected at the 90th percentile. 0 of 51 homes above the action level', limit: '15 ppb action level', note: 'Sampled in 2025. Lead from home plumbing can still vary house to house.' },
      { name: 'Copper at the tap', pct: 0, result: 'Not detected at the 90th percentile. 0 of 51 homes above the action level', limit: '1.3 ppm action level' },
      { name: 'PFAS', pct: 51, result: 'Not detected in the Green River supply. In groundwater: PFHxS up to 5.1 ppt and PFBS up to 3.3 ppt', limit: 'PFHxS 10 ppt (federal limit effective 2029, state action level 10 ppt since January 2026)', note: 'Tacoma Water says it operates only wells that meet the standards.' },
      { name: 'Arsenic (groundwater)', pct: 17, result: 'up to 1.7 ppb (2021)', limit: '10 ppb' },
      { name: 'Nitrate (groundwater)', pct: 40, result: 'up to 4.0 ppm', limit: '10 ppm' },
      { name: 'Trichloroethylene (groundwater)', pct: 32, result: 'up to 1.6 ppb', limit: '5 ppb', note: 'Treated at Well 12A with air-stripping towers.' },
    ],
  },
};
const puyallup: Profile = {
  id: 'puyallup', area: 'Puyallup', supply: 'The City of Puyallup gets about 99 percent of its water from underground: two natural springs, four deep wells and a small intertie with Tacoma. Other parts of Puyallup are served by other water systems or private wells, so your source depends on your address.',
  rows: [
    { label: 'Hardness', level: 'Possible', note: 'The City of Puyallup reports its water averages 89 ppm, which is moderately hard. Other systems and wells differ.' },
    { label: 'Chlorine and disinfectant', level: 'Common', note: 'On city or district water, chlorine taste and smell are the usual complaint.' },
    { label: 'Iron and manganese', level: 'Possible', note: 'South Sound groundwater commonly carries iron and manganese, which stain fixtures and laundry.' },
    LEAD,
    { label: 'Private wells', level: 'Check yours', note: 'The Puyallup Valley’s farmland is a reason for well owners to test for nitrate. Bacteria yearly, nitrate every three years.' },
  ],
  links: [['Tacoma-Pierce County Health Department: individual wells', 'https://tpchd.org/homes/drinking-water/individual-wells/'], EPA_CCR],
  // Source: City of Puyallup 2025 Water Quality Report (testing December 2024 through December 2025).
  measured: {
    utility: 'City of Puyallup', source: 'City of Puyallup 2025 Water Quality Report', year: 2025, url: 'https://www.puyallupwa.gov/DocumentCenter/View/25752/2025-Water-Quality-Report',
    note: 'Puyallup gets about 50% of its water from Salmon Springs, 27% from Maplewood Springs and 22% from wells, and chlorinates all of it. Iron and manganese are filtered at Well 17.',
    rows: [
      { name: 'Water hardness', result: 'Averages 89 ppm', limit: 'No limit. On the common USGS scale, 61 to 120 ppm is moderately hard', note: 'The city’s own report asks “Is my water hard?”', },
      { name: 'Arsenic', pct: 79, result: 'up to 7.9 ppb (not detected in some sources)', limit: '10 ppb', note: 'Naturally occurring. The report says low levels are present.' },
      { name: 'Copper at the tap', pct: 90, result: '90th percentile 1.17 ppm. 0 of 35 homes above the action level', limit: '1.3 ppm action level' },
      { name: 'Lead at the tap', pct: 0, result: '90th percentile below 15 ppb. 0 of 35 homes above the action level', limit: '15 ppb action level' },
      { name: 'Chlorine', pct: 33, result: '0.2 to 1.3 ppm', limit: '4 ppm', note: 'The disinfectant you taste and smell.' },
      { name: 'Nitrate', pct: 32, result: 'up to 3.16 ppm', limit: '10 ppm' },
      { name: 'Total trihalomethanes (disinfection byproducts)', pct: 5, result: '2.53 to 3.83 ppb', limit: '80 ppb' },
      { name: 'Sodium', result: '6 to 28 ppm', limit: 'No limit set' },
      { name: 'PFOA (PFAS)', pct: 83, result: '3.3 ppt', limit: '4 ppt federal limit effective 2029 (the report lists a 10 ppt state action level at sampling)', note: 'Below the limit, but close to the new one.' },
      { name: 'PFOS (PFAS)', pct: 73, result: '2.9 ppt', limit: '4 ppt federal limit effective 2029 (the report lists a 15 ppt state action level at sampling)' },
      { name: 'PFBS, PFHxS and PFHxA (PFAS)', result: '4.4 ppt, 2.1 ppt and 2.8 ppt', limit: 'State action levels 345 ppt (PFBS) and 65 ppt (PFHxS) at sampling' },
    ],
  },
};
const bremerton: Profile = {
  id: 'bremerton', area: 'Bremerton', supply: 'Bremerton city water blends Union River surface water with groundwater from 14 wells. Homes outside the city system rely on private wells.',
  rows: [
    { label: 'Hardness', level: 'Check yours', note: 'Varies by aquifer. Many Kitsap homes have softer water than other parts of the country.' },
    { label: 'Chlorine and disinfectant', level: 'Common', note: 'On city water, chlorine taste and smell are the usual complaint.' },
    { label: 'Iron and manganese', level: 'Possible', note: 'Glacial groundwater commonly carries both. Staining is the sign. Kitsap Public Health’s “Kitsap 5” test checks them.' },
    { ...LEAD, note: 'Bremerton has a lot of older housing. Homes built before 1986 may have lead solder or fixtures.' },
    { label: 'Private wells', level: 'Check yours', note: 'Kitsap Public Health District recommends testing for bacteria yearly and nitrate every three years.' },
  ],
  links: [['Kitsap Public Health District: private wells', 'https://www.kitsappublichealth.org/dwos/privatewells'], EPA_CCR],
  // Source: City of Bremerton Annual Drinking Water Quality Report (data collected January to December 2025).
  measured: {
    utility: 'City of Bremerton', source: 'City of Bremerton Drinking Water Quality Report (2025 data)', year: 2025, url: 'https://www.bremertonwa.gov/Archive.aspx?ADID=1320',
    note: 'Bremerton blends Union River surface water (chlorine and UV, not filtered) with 14 wells (chlorine). The city reports no lead service lines in its system, and raises pH to about 8 to keep lead out of home plumbing.',
    rows: [
      { name: 'Total trihalomethanes (disinfection byproducts)', pct: 81, result: 'Highest 65 ppb locational running average (range 9.1 to 81)', limit: '80 ppb locational running average', note: 'Formed when chlorine meets organic matter. The compliance figure is the running average, not a single sample.' },
      { name: 'Haloacetic acids (disinfection byproducts)', pct: 67, result: 'Highest 40 ppb locational running average (range 0 to 59)', limit: '60 ppb locational running average' },
      { name: 'Chlorine', pct: 18, result: '0.73 ppm annual average (range 0.17 to 1.40)', limit: '4 ppm' },
      { name: 'Arsenic (groundwater)', pct: 30, result: 'up to 3 ppb (sampled 2021)', limit: '10 ppb' },
      { name: 'Lead at the tap', pct: 27, result: '90th percentile 4 ppb (sampled 2023). One sample site exceeded the action level', limit: '15 ppb action level', note: 'The system still meets the rule, which allows up to 10% of sites above.' },
      { name: 'Copper at the tap', pct: 5, result: '90th percentile 60 ppb (sampled 2023)', limit: '1,300 ppb action level' },
      { name: 'Nitrate', pct: 6, result: 'up to 0.62 ppm', limit: '10 ppm' },
      { name: 'Sodium', result: 'up to 11.7 ppm (sampled 2021)', limit: 'No limit set' },
      { name: 'PFAS', result: 'Only 1 of 29 detected: PFBS 5.1 ppt in one well. The rest not detected', limit: 'PFBS state action level 345 ppt at sampling; PFOA and PFOS limits 4 ppt', note: 'PFOA and PFOS were not detected.' },
    ],
  },
};
const portOrchard: Profile = {
  id: 'port-orchard', area: 'Port Orchard', supply: 'The City of Port Orchard’s system is four deep groundwater wells. Some addresses are on other water systems or private wells.',
  rows: [
    { label: 'Hardness', level: 'Check yours', note: 'Varies by source. Minerals can build up on fixtures and appliances over time.' },
    { label: 'Chlorine and disinfectant', level: 'Common', note: 'On city water, chlorine taste and smell are the usual complaint.' },
    { label: 'Iron and manganese', level: 'Possible', note: 'Staining on sinks, tubs and laundry is the sign. A well test confirms the levels.' },
    LEAD,
    { label: 'Private wells', level: 'Check yours', note: 'Near the shoreline, watch chloride. It is one of the five tests Kitsap Public Health requires on new wells.' },
  ],
  links: [['Kitsap Public Health District: private wells', 'https://www.kitsappublichealth.org/dwos/privatewells'], EPA_CCR],
  // Source: City of Port Orchard 2025 Water Quality Report (Port Orchard Water System). Lead and copper sampled 2024.
  measured: {
    utility: 'City of Port Orchard', source: 'City of Port Orchard 2025 Water Quality Report', year: 2025, url: 'https://storage.googleapis.com/proudcity/portorchardwa/2026/04/570cab8f-ccr-port-orchard-2025.pdf',
    note: 'The Port Orchard Water System draws from four deep groundwater wells (240 to 806 feet) and adds chlorine and fluoride. Some addresses are served by other water systems, so check your bill.',
    rows: [
      { name: 'PFOA (PFAS)', pct: 92, result: '3.67 ppt. The only PFAS detected, 1 of 29 tested', limit: '4 ppt (state action level since January 2026, federal limit effective 2029)', note: 'Below the limit, but close to it. The old state action level was 10 ppt.' },
      { name: 'Arsenic', pct: 36, result: '1.7 to 3.6 ppb', limit: '10 ppb', note: 'Naturally occurring.' },
      { name: 'Total trihalomethanes (disinfection byproducts)', pct: 31, result: 'up to 24.5 ppb', limit: '80 ppb' },
      { name: 'Lead at the tap', pct: 27, result: '90th percentile 4 ppb. 0 sites above the action level (2024)', limit: '15 ppb action level' },
      { name: 'Copper at the tap', pct: 4, result: '90th percentile 0.05 ppm (2024)', limit: '1.3 ppm action level' },
      { name: 'Fluoride', pct: 23, result: '0.38 to 0.92 ppm', limit: '4 ppm', note: 'Added to the supply.' },
      { name: 'Gross alpha radioactivity', pct: 16, result: 'up to 2.47 ppb (2023)', limit: '15 ppb' },
      { name: 'Radium 228', pct: 16, result: 'up to 0.777 ppb (2023)', limit: '5 ppb' },
      { name: 'Turbidity (cloudiness)', result: 'up to 0.65 NTU', limit: 'Treatment technique' },
    ],
  },
};
const kitsap: Profile = { ...bremerton, measured: undefined, id: 'kitsap', area: 'Kitsap County', supply: 'Kitsap County relies heavily on groundwater, through water districts, city systems and thousands of private wells.' };
const pierce: Profile = { ...puyallup, measured: undefined, id: 'pierce', area: 'Pierce County', supply: 'Pierce County water comes from surface sources, groundwater and private wells. Tacoma Water draws mainly on the Green River; many other systems use groundwater or springs.' };

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
