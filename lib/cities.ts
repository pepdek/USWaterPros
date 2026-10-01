export type City = {
  slug: string; name: string; county: string; // county = locations slug
  headline: string; issues: string[]; paras: string[]; removes: string[];
  neighborhoods: string[]; authority: [string, string]; faqs: [string, string][];
};

export const UPDATED = '2026-09-30';
export const EWG_URL = 'https://www.ewg.org/tapwater/';
const EPA_CCR: [string, string] = ['Find your utility’s annual water quality report (EPA)', 'https://www.epa.gov/ccr'];

// ponytail: qualitative city context, no invented percentages. Verify before ads; swap EPA_CCR for each utility's own report page.
export const CITIES: City[] = [
  {
    slug: 'tacoma', name: 'Tacoma', county: 'pierce-county',
    headline: 'Chlorine taste and older plumbing are the top reasons Tacoma homeowners call.',
    issues: ['Chlorine taste & odor', 'Older plumbing (pre-1986 homes)', 'Sediment from aging pipes'],
    paras: [
      'Most of Tacoma gets its water from Tacoma Water, which draws mainly on the Green River. It is treated and tested, but disinfectant is what most people taste, and it can leave water smelling like a pool.',
      'Many Tacoma homes, especially in older neighborhoods like Proctor, the North End and Hilltop, were built before 1986. Plumbing from that era may include lead solder or fixtures, and aging pipes can shed sediment.',
      'A whole-home system filters water where it enters your house, so every tap, shower and appliance gets better water. For drinking and cooking, many Tacoma homeowners add reverse osmosis at the kitchen tap.',
    ],
    removes: ['Chlorine taste and odor', 'Sediment and rust particles', 'Many chemicals that carbon filtration captures'],
    neighborhoods: ['Proctor District', 'North End', 'Hilltop', 'Stadium District', 'Old Town', 'South Tacoma'],
    authority: ['Tacoma Public Utilities water quality', 'https://www.mytpu.org/about-tpu/services/water/water-quality/'],
    faqs: [
      ['What is the water quality like in Tacoma?', 'Tacoma Water treats and tests its supply and publishes annual reports. The most common complaints are chlorine taste and smell, and older plumbing in pre-1986 homes.'],
      ['How much does whole-home filtration cost in Tacoma?', 'Most whole-home systems run $1,200 to $4,000 installed. Our typical price is $2,700, and we give you the number up front.'],
      ['How long does installation take?', 'Usually about a day. We confirm after a quick look at your plumbing.'],
      ['Do you serve my Tacoma neighborhood?', 'Yes. We serve all of Tacoma, including Proctor, the North End, Hilltop, the Stadium District, Old Town and South Tacoma.'],
      ['Can you fix the chlorine taste in my water?', 'Yes. Carbon filtration removes most chlorine taste and odor, for the whole house or at a single tap.'],
      ['Should I worry about lead in an older Tacoma home?', 'Homes built before 1986 may have lead solder or fixtures. A water test shows whether lead is present, and a certified filter or reverse osmosis can reduce it at the tap.'],
    ],
  },
  {
    slug: 'puyallup', name: 'Puyallup', county: 'pierce-county',
    headline: 'Valley farmland and glacial groundwater make testing worth it in Puyallup.',
    issues: ['Iron & manganese staining', 'Nitrate (private wells)', 'Mineral content varies by well'],
    paras: [
      'Puyallup homes are served by a mix of local water systems and private wells. Water quality can change from one neighborhood to the next, and from one well to the next.',
      'South Sound groundwater commonly carries iron and manganese, which leave orange or brown stains and a metallic taste. The Puyallup Valley’s farmland is also a reason for private well owners to test for nitrate.',
      'We start with a water test, then recommend only what your water needs: iron removal, a softener, whole-home filtration, or reverse osmosis for drinking water.',
    ],
    removes: ['Iron and manganese staining', 'Sediment', 'Chlorine taste and odor on city water'],
    neighborhoods: ['South Hill', 'Downtown Puyallup', 'Puyallup Valley', 'Meridian'],
    authority: EPA_CCR,
    faqs: [
      ['What is the water quality like in Puyallup?', 'It depends on your source. City-served homes and private wells differ, and groundwater here commonly carries iron and manganese. A test tells you for sure.'],
      ['How much does whole-home filtration cost in Puyallup?', 'Most whole-home systems run $1,200 to $4,000 installed. Our typical price is $2,700.'],
      ['How long does installation take?', 'Usually about a day.'],
      ['Do you serve South Hill and the Puyallup Valley?', 'Yes. We serve all of Puyallup and the surrounding area.'],
      ['My well water stains everything orange. Can you fix it?', 'Usually, yes. Iron and manganese respond to the right filter. We test first so the system matches your water.'],
      ['Should I test my well for nitrate?', 'The Tacoma-Pierce County Health Department recommends testing individual wells for bacteria yearly and nitrate every three years.'],
    ],
  },
  {
    slug: 'bremerton', name: 'Bremerton', county: 'kitsap-county',
    headline: 'Older homes and a mix of city water and wells make Bremerton water worth a closer look.',
    issues: ['Chlorine taste on city water', 'Older plumbing', 'Iron & manganese on wells'],
    paras: [
      'Bremerton has a lot of older housing, and older plumbing can mean sediment, staining and metallic taste. Homes on city water often just want the chlorine taste gone.',
      'Homes outside the city system rely on private wells, where Kitsap Public Health District recommends testing for bacteria yearly and nitrate every three years.',
      'We proudly serve Bremerton’s Navy and military community. Schedule a free consultation and we will review your water and your options.',
    ],
    removes: ['Chlorine taste and odor', 'Sediment and rust', 'Iron and manganese staining'],
    neighborhoods: ['Manette', 'West Bremerton', 'East Bremerton', 'Charleston', 'Navy Yard City'],
    authority: EPA_CCR,
    faqs: [
      ['What is the water quality like in Bremerton?', 'City water is treated and tested, and wells vary. Common issues are chlorine taste, older plumbing and, on wells, iron and manganese.'],
      ['How much does whole-home filtration cost in Bremerton?', 'Most whole-home systems run $1,200 to $4,000 installed. Our typical price is $2,700.'],
      ['How long does installation take?', 'Usually about a day.'],
      ['Do you serve Manette and Navy Yard City?', 'Yes. We serve all of Bremerton and nearby communities.'],
      ['Do you offer service for military families?', 'We serve Bremerton’s Navy and military community. Ask about scheduling around your needs.'],
      ['Can you fix rusty or stained water?', 'Usually, yes. A test shows whether it is iron, manganese or old pipes, and we match the fix to the cause.'],
    ],
  },
  {
    slug: 'port-orchard', name: 'Port Orchard', county: 'kitsap-county',
    headline: 'Protect your Port Orchard home from mineral buildup and staining.',
    issues: ['Mineral buildup & staining', 'Aging plumbing', 'Coastal wells (chloride)'],
    paras: [
      'Port Orchard homes draw on a mix of city water and private wells. Minerals can build up on fixtures and appliances over time, and staining is a common complaint.',
      'Near the shoreline, well owners should watch chloride levels, one of the five tests Kitsap Public Health District requires for new wells (iron, manganese, nitrate, chloride and conductivity).',
      'A properly sized whole-home system helps protect fixtures and appliances, and a reverse osmosis tap gives you the cleanest drinking water.',
    ],
    removes: ['Iron and manganese staining', 'Sediment', 'Chlorine taste and odor'],
    neighborhoods: ['Downtown Port Orchard', 'Horseshoe Lake', 'Burley', 'Olalla'],
    authority: EPA_CCR,
    faqs: [
      ['What is the water quality like in Port Orchard?', 'It depends on your source. City and well water differ, and staining minerals are a common issue. A test tells you what is in yours.'],
      ['How much does whole-home filtration cost in Port Orchard?', 'Most whole-home systems run $1,200 to $4,000 installed. Our typical price is $2,700.'],
      ['How long does installation take?', 'Usually about a day.'],
      ['Do you serve Horseshoe Lake, Burley and Olalla?', 'Yes. We serve Port Orchard and the surrounding South Kitsap area.'],
      ['Will filtration protect my appliances?', 'It can help. Reducing sediment and minerals is easier on fixtures, water heaters and dishwashers.'],
      ['How often should I test my well?', 'Kitsap Public Health District recommends bacteria yearly and nitrate every three years.'],
    ],
  },
];
