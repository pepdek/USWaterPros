import { costAnswer } from './pricing';
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
      ['How much does whole-home filtration cost in Tacoma?', costAnswer()],
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
      ['How much does whole-home filtration cost in Puyallup?', costAnswer()],
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
      ['How much does whole-home filtration cost in Bremerton?', costAnswer()],
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
      ['How much does whole-home filtration cost in Port Orchard?', costAnswer()],
      ['How long does installation take?', 'Usually about a day.'],
      ['Do you serve Horseshoe Lake, Burley and Olalla?', 'Yes. We serve Port Orchard and the surrounding South Kitsap area.'],
      ['Will filtration protect my appliances?', 'It can help. Reducing sediment and minerals is easier on fixtures, water heaters and dishwashers.'],
      ['How often should I test my well?', 'Kitsap Public Health District recommends bacteria yearly and nitrate every three years.'],
    ],
  },
  {
    slug: 'olympia', name: 'Olympia', county: 'thurston-county',
    headline: 'Olympia’s water comes from groundwater wells, so taste, minerals and pipe corrosion are what to check.',
    issues: ['Chlorine taste & odor', 'Naturally low-pH groundwater', 'Older plumbing'],
    paras: [
      'The City of Olympia’s main source is the McAllister Wellfield, supplemented by additional wells, so your water is groundwater. It is treated, disinfected and tested, and the city publishes an annual water quality report.',
      'The Washington Department of Health notes this groundwater has a naturally low pH, which the city treats to protect pipes from corrosion. Older homes with older plumbing are still worth testing for lead and copper, and disinfectant taste is the most common complaint.',
      'We start with a free consultation and a water test where needed, then recommend only what your water needs: carbon filtration for taste and odor, reverse osmosis for drinking water, or a whole-home system.',
    ],
    removes: ['Chlorine taste and odor', 'Sediment and rust particles', 'Many chemicals that carbon filtration captures'],
    neighborhoods: ['Downtown Olympia', 'West Olympia', 'Eastside', 'Capitol Neighborhood', 'Southeast Olympia'],
    authority: ['City of Olympia water system plan', 'https://www.codepublishing.com/WA/Olympia/wsp/OlympiaWSP01.html'],
    faqs: [
      ['Where does Olympia’s water come from?', 'The city’s primary source is the McAllister Wellfield, supplemented seasonally by additional wells. All of it is groundwater.'],
      ['How much does whole-home filtration cost in Olympia?', costAnswer()],
      ['How long does installation take?', 'Usually about a day. We confirm after a quick look at your plumbing.'],
      ['Do you serve my Olympia neighborhood?', 'Yes. We serve Olympia, including downtown, the Westside, the Eastside and surrounding areas.'],
      ['Can you fix the chlorine taste in my water?', 'Yes. Carbon filtration removes most chlorine taste and odor, for the whole house or at a single tap.'],
      ['Should I worry about lead in an older Olympia home?', 'Homes with older plumbing may have lead solder or fixtures. A water test shows whether lead is present, and a certified filter or reverse osmosis can reduce it at the tap.'],
    ],
  },
  {
    slug: 'lacey', name: 'Lacey', county: 'thurston-county',
    headline: 'Lacey’s water is all groundwater. Here is what that means for taste, minerals and your pipes.',
    issues: ['Chlorine taste & odor', 'Mineral content varies by well', 'Private wells outside city service'],
    paras: [
      'The City of Lacey reports that all of its drinking water comes from groundwater wells drawing on three aquifers, protected by a wellhead protection program the city has run since 1995.',
      'The city’s reports show its water meeting state and federal standards. What most people still notice is disinfectant taste and smell, and, depending on the neighborhood and plumbing, minerals that spot fixtures and glassware.',
      'Homes outside city service rely on private wells, where the owner is responsible for testing. Schedule a free consultation and we will review your water and your options.',
    ],
    removes: ['Chlorine taste and odor', 'Sediment', 'Many chemicals that carbon filtration captures'],
    neighborhoods: ['Hawks Prairie', 'Woodland District', 'Meadows', 'Downtown Lacey'],
    authority: ['City of Lacey water quality', 'https://cityoflacey.org/lacey-water-quality-continues-to-meet-state-and-federal-standards/'],
    faqs: [
      ['Where does Lacey’s water come from?', 'The City of Lacey says all of its drinking water comes from groundwater wells that draw on three aquifers.'],
      ['How much does whole-home filtration cost in Lacey?', costAnswer()],
      ['How long does installation take?', 'Usually about a day.'],
      ['Do you serve Hawks Prairie and the Woodland District?', 'Yes. We serve all of Lacey and the surrounding area.'],
      ['Can you fix the chlorine taste in my water?', 'Yes. Carbon filtration removes most chlorine taste and odor, for the whole house or at a single tap.'],
      ['Do I need a softener in Lacey?', 'It depends on your water. We test first, and only recommend a softener if hardness is actually causing scale or spotting.'],
    ],
  },
  {
    slug: 'lakewood', name: 'Lakewood', county: 'pierce-county',
    headline: 'Lakewood’s water is largely groundwater, so mineral content and taste are what to check.',
    issues: ['Chlorine taste & odor', 'Mineral content varies', 'Older plumbing (pre-1986 homes)'],
    paras: [
      'Much of Lakewood is served by the Lakewood Water District, which draws on groundwater wells. Your exact provider depends on your address, and a few areas are served by other systems or private wells.',
      'Groundwater in the South Sound can carry minerals such as iron and manganese, and disinfectant is what most people taste on public systems. Many Lakewood homes were built decades ago, and plumbing from before 1986 may include lead solder or fixtures.',
      'We start with a free consultation and a water test where needed, then recommend only what your water needs: carbon filtration for taste and odor, reverse osmosis for drinking water, or a whole-home system.',
    ],
    removes: ['Chlorine taste and odor', 'Sediment and rust particles', 'Iron and manganese staining'],
    neighborhoods: ['Tillicum', 'Lakeview', 'Oakbrook', 'Steilacoom Boulevard', 'Lake City'],
    authority: EPA_CCR,
    faqs: [
      ['What is the water quality like in Lakewood?', 'Public systems treat and test their water and publish annual reports. Common concerns are disinfectant taste, minerals in groundwater and older plumbing. A test tells you what is in yours.'],
      ['How much does whole-home filtration cost in Lakewood?', costAnswer()],
      ['How long does installation take?', 'Usually about a day. We confirm after a quick look at your plumbing.'],
      ['Do you serve Tillicum, Oakbrook and Lake City?', 'Yes. We serve all of Lakewood and the surrounding area.'],
      ['Can you fix rusty or stained water?', 'Usually, yes. A test shows whether it is iron, manganese or old pipes, and we match the fix to the cause.'],
      ['Should I worry about lead in an older home?', 'Homes built before 1986 may have lead solder or fixtures. A water test shows whether lead is present, and a certified filter or reverse osmosis can reduce it at the tap.'],
    ],
  },
  {
    slug: 'university-place', name: 'University Place', county: 'pierce-county',
    headline: 'University Place homes are mostly on city-treated water, so taste and older plumbing drive the calls.',
    issues: ['Chlorine taste & odor', 'Older plumbing (pre-1986 homes)', 'Sediment from aging pipes'],
    paras: [
      'Many University Place homes are served by Tacoma Water, whose supply comes mainly from the Green River watershed. Other areas are served by different local systems, so confirm your provider by address.',
      'City water is treated and tested, and the disinfectant is what most people taste. It can leave water smelling like a pool, which is the top reason neighbors ask about carbon filtration.',
      'Plumbing from before 1986 may include lead solder or fixtures, so a water test is a good first step. For drinking and cooking, many homeowners add reverse osmosis at the kitchen tap.',
    ],
    removes: ['Chlorine taste and odor', 'Sediment and rust particles', 'Many chemicals that carbon filtration captures'],
    neighborhoods: ['Chambers Creek', 'Narrows', 'Day Island', 'Cirque'],
    authority: ['Tacoma Public Utilities: water source', 'https://www.mytpu.org/about-tpu/services/water/water-source/100-years-clean-reliable-water/'],
    faqs: [
      ['What is the water quality like in University Place?', 'Public systems treat and test their water and publish annual reports. The most common complaints are chlorine taste and smell, and older plumbing in pre-1986 homes.'],
      ['How much does whole-home filtration cost in University Place?', costAnswer()],
      ['How long does installation take?', 'Usually about a day. We confirm after a quick look at your plumbing.'],
      ['Do you serve Chambers Creek and the Narrows?', 'Yes. We serve all of University Place and the surrounding area.'],
      ['Can you fix the chlorine taste in my water?', 'Yes. Carbon filtration removes most chlorine taste and odor, for the whole house or at a single tap.'],
      ['Should I worry about lead in an older home?', 'Homes built before 1986 may have lead solder or fixtures. A water test shows whether lead is present, and a certified filter or reverse osmosis can reduce it at the tap.'],
    ],
  },
  {
    slug: 'bonney-lake', name: 'Bonney Lake', county: 'pierce-county',
    headline: 'Bonney Lake’s water comes from springs and wells, with Tacoma Water as backup supply.',
    issues: ['Chlorine taste & odor', 'Mineral content varies', 'Private wells outside city service'],
    paras: [
      'The City of Bonney Lake reports that its water comes from groundwater: Victor Falls and Grainger Springs plus wells at Tacoma Point and Ball Park. The city also has an agreement to receive additional water from Tacoma Public Utilities if needed.',
      'City water is treated and tested, and the city publishes an annual water quality report. Disinfectant taste and smell are what most people notice, and minerals can show up as spotting on fixtures and glassware.',
      'Some homes around the plateau rely on private wells, where the owner is responsible for testing. Schedule a free consultation and we will review your water and your options.',
    ],
    removes: ['Chlorine taste and odor', 'Sediment', 'Iron and manganese staining on wells'],
    neighborhoods: ['Lake Tapps', 'Allisson Springs', 'Sky Island', 'Fennel Creek'],
    authority: ['City of Bonney Lake: water', 'https://www.bonneylake.gov/289/Water'],
    faqs: [
      ['Where does Bonney Lake’s water come from?', 'The city draws on Victor Falls and Grainger Springs and on wells at Tacoma Point and Ball Park, with an agreement to receive additional water from Tacoma Public Utilities if needed.'],
      ['How much does whole-home filtration cost in Bonney Lake?', costAnswer()],
      ['How long does installation take?', 'Usually about a day. We confirm after a quick look at your plumbing.'],
      ['Do you serve Lake Tapps and the plateau?', 'Yes. We serve all of Bonney Lake and the surrounding area.'],
      ['Can you fix the chlorine taste in my water?', 'Yes. Carbon filtration removes most chlorine taste and odor, for the whole house or at a single tap.'],
      ['How often should I test a private well?', 'The Tacoma-Pierce County Health Department recommends testing for bacteria once a year and nitrate every three years.'],
    ],
  },
  {
    slug: 'gig-harbor', name: 'Gig Harbor', county: 'pierce-county',
    headline: 'Gig Harbor’s water is all groundwater, and iron and manganese are the things to watch.',
    issues: ['Iron & manganese staining', 'Taste and discolored water', 'Private wells (testing)'],
    paras: [
      'The City of Gig Harbor says all of its water comes from underground aquifers, pumped from a series of wells. The city reports that its water meets state and federal standards, and it tests its wells on a regular schedule.',
      'The city also notes that iron and manganese are found at various levels in most water sources and can cause discolored water, fixture staining and sometimes taste problems. It flushes its water mains twice a year to reduce manganese, rust and sediment.',
      'Many peninsula homes outside city service rely on private wells, where the owner is responsible for testing. We start with a free consultation and a water test, then recommend only what your water needs.',
    ],
    removes: ['Iron and manganese staining', 'Sediment and rust particles', 'Chlorine taste and odor on city water'],
    neighborhoods: ['Downtown Waterfront', 'Harbor Hill', 'Rosedale', 'Artondale', 'Wollochet'],
    authority: ['City of Gig Harbor: water FAQ', 'https://gigharborwa.gov/m/faq?cat=20'],
    faqs: [
      ['Where does Gig Harbor’s water come from?', 'The city says all of its water comes from underground aquifers, pumped from a series of wells.'],
      ['How much does whole-home filtration cost in Gig Harbor?', costAnswer()],
      ['How long does installation take?', 'Usually about a day. We confirm after a quick look at your plumbing.'],
      ['Do you serve Rosedale, Artondale and Wollochet?', 'Yes. We serve all of Gig Harbor and the surrounding area.'],
      ['Why is my water discolored or leaving brown stains?', 'Iron and manganese are the usual cause in local groundwater. A test confirms the levels, and the right filter can stop the staining.'],
      ['How often should I test a private well?', 'The Tacoma-Pierce County Health Department recommends testing for bacteria once a year and nitrate every three years.'],
    ],
  },
];
