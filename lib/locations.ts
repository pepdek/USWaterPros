export type Location = {
  slug: string; name: string; state: string; blurb: string;
  challenges: string[]; testing: string; solutions: string;
  cities: [string, string][]; faqs: [string, string][];
};

// ponytail: general regional context, no measured figures. Verify against each utility's
// annual Consumer Confidence Report and the county health district before running ads.
export const LOCATIONS: Location[] = [
  {
    slug: 'kitsap-county', name: 'Kitsap County', state: 'WA',
    blurb: 'Most Kitsap homes rely on groundwater, from public wells or private ones. Find the right filtration for yours.',
    challenges: [
      'Kitsap County is a peninsula surrounded by Puget Sound and Hood Canal, and it has no large river or reservoir to supply it. Most drinking water here comes from groundwater pumped from aquifers laid down by glaciers. Water districts, city systems and thousands of private wells all draw from these underground layers, and Bremerton’s system also uses surface water from its own watershed.',
      'One of the most common complaints in this kind of groundwater is iron and manganese. As water travels through glacial soils it picks up these minerals, and they show up as orange or brown stains on sinks and tubs, dark spots on laundry, and a metallic taste. They are mostly a nuisance at typical levels, but they are worth testing for, and they can clog fixtures and shorten the life of appliances.',
      'Hardness varies by aquifer. Many Kitsap homes have softer water than other parts of the country, so heavy scale is less of a worry than staining, taste, and acidity. Soft, slightly acidic groundwater can be hard on copper plumbing over time, which is one reason a proper water test comes before any equipment purchase.',
      'Homes near the shoreline, especially on islands and low peninsulas, face an added question: in some coastal areas, heavy pumping can let saltwater move into freshwater aquifers. Homes with private wells and septic systems should also keep an eye on bacteria and nitrate. The right treatment depends on what your water actually contains, which is why we start with a report for your ZIP code.',
    ],
    testing: 'Kitsap Public Health District publishes guidance for private well owners. Public health agencies in Washington generally recommend testing a private well for coliform bacteria and nitrate on a regular schedule, and testing for other contaminants when you buy a home, notice a change in taste, smell or color, or add a new source of risk near the well. Check the district’s current recommendations, and if you are on a public system, read your utility’s annual water quality report.',
    solutions: 'In Kitsap County, the most common starting point is a whole-home filter paired with iron or sediment removal if your test shows staining minerals. Homes on private wells often add a UV or other disinfection step for bacteria, and a reverse osmosis system at the kitchen tap gives you the cleanest drinking and cooking water. If you are on city or district water and mostly want better taste and smell, a whole-home carbon filter is usually enough. Your local pro will confirm the right mix after reviewing your results, and you never pay for equipment you do not need.',
    cities: [
      ['Bremerton', 'Homes on city water often look for chlorine taste and odor reduction, and older neighborhoods may have aging plumbing worth filtering for.'],
      ['Silverdale', 'Served by a mix of water districts and private wells. Iron and manganese staining is a common thing to check for.'],
      ['Port Orchard', 'A mix of city water and private wells. Well testing is popular for homes outside city limits.'],
      ['Poulsbo', 'City water plus nearby neighborhoods on wells. Taste, staining and well safety are the usual concerns.'],
      ['Bainbridge Island', 'Island homes rely heavily on groundwater, and many have private wells. Mineral content and saltwater intrusion are worth testing for.'],
    ],
    faqs: [
      ['Do Kitsap County private wells require special filtration?', 'Not always, but they should be tested first. Private wells are not regulated like public systems, so the owner is responsible for testing. Results tell you whether you need iron removal, a softener, a UV system, or something else.'],
      ['Why is my water orange or leaving brown stains?', 'Iron and manganese are the usual cause in local groundwater. A water test confirms the levels, and a whole-home filter or iron-specific system can stop the staining.'],
      ['How often should I test my well water?', 'Most health agencies recommend testing for bacteria and nitrate at least once a year, plus testing after any change in taste, smell or color, or after flooding or well work.'],
      ['Why does my city water taste like chlorine?', 'Public systems add disinfectant to keep water safe as it travels through the pipes. A carbon filter removes most of the chlorine taste and smell at the tap or for the whole house.'],
      ['Can I add whole-home filtration to a well system?', 'Yes. A local pro will test your water, size the system to your home, and install it with a pre-filter for sediment if needed.'],
    ],
  },
  {
    slug: 'pierce-county', name: 'Pierce County', state: 'WA',
    blurb: 'From city water in Tacoma to private wells out in the county, compare local pros who know the area.',
    challenges: [
      'Pierce County water comes from two very different worlds. Tacoma Water draws mainly on the Green River, fed by Cascade rain and snowmelt, and supplements it with groundwater wellfields. Many other systems, including several water districts and smaller cities, rely on groundwater or springs, and rural homes across the county depend on private wells.',
      'Surface-sourced water is generally soft, but it is treated with disinfectant, and that is what most people taste. Chlorine taste and odor are among the most common reasons Pierce County homeowners call about filtration, and a carbon filter at the tap or for the whole house is usually the simple fix.',
      'Groundwater tells a different story. Glacial aquifers in the South Sound can carry iron and manganese, which stain fixtures and laundry, and hardness can vary from one well to the next. A neighbor’s results may not match yours, so test your own water rather than guessing.',
      'Older homes add another consideration. Houses built before the mid-1980s may have lead solder or fixtures in their plumbing, which can add lead to water that left the treatment plant clean. A certified filter or reverse osmosis system at the kitchen tap is a common way to cover drinking and cooking water.',
    ],
    testing: 'The Tacoma-Pierce County Health Department offers guidance for private well owners, and public systems such as Tacoma Water publish annual water quality reports. Testing for coliform bacteria and nitrate on a regular schedule is widely recommended for private wells, and testing for lead is a good idea in older homes. Check the health department’s current recommendations for details.',
    solutions: 'In Pierce County, homes on Tacoma Water or another public system usually want better taste and smell, so a whole-home carbon filter is the common choice, often with reverse osmosis at the kitchen tap for drinking water and lead concerns in older homes. Homes on wells or groundwater-fed systems more often need a softener or iron filter, plus regular testing for bacteria and nitrate. Because sources vary so much from one neighborhood to the next, the right system depends on your address. Your local pro will review your water, explain the options clearly, and recommend what fits your home and budget. Ask about filter replacement schedules and annual maintenance up front, so you know the true cost of owning the system over time.',
    cities: [
      ['Tacoma', 'Tacoma Water supplies much of the city. Chlorine taste and older plumbing are the most common reasons to filter.'],
      ['Puyallup', 'Served by local systems and private wells. Mineral content varies, so testing is worth doing.'],
      ['Lakewood', 'Largely served by groundwater wells. Iron, manganese and hardness are worth checking.'],
      ['Gig Harbor', 'Peninsula homes often rely on groundwater, and well testing matters for many properties.'],
      ['Bonney Lake', 'A growing community served by local systems and some private wells. Testing helps pick the right treatment.'],
      ['University Place', 'Mostly city-served homes. Taste, odor and older plumbing drive most requests.'],
    ],
    faqs: [
      ['Why does my Tacoma tap water taste like chlorine?', 'Public systems add disinfectant to keep water safe on its way to your home. A carbon filter removes most of the chlorine taste and smell.'],
      ['Is Pierce County water hard or soft?', 'It depends on your source. Surface-sourced water tends to be soft, while groundwater and well water can vary. Your ZIP code report and a water test will tell you if a softener makes sense.'],
      ['Should I worry about lead in an older home?', 'Homes built before the mid-1980s may have lead in solder or fixtures. A water test shows whether lead is present, and a certified filter or reverse osmosis system can reduce it at the tap.'],
      ['Do Pierce County private wells need testing?', 'Yes. Private wells are not regulated like public systems, so the owner is responsible. Test for bacteria and nitrate regularly, and for other contaminants when you buy a home or notice changes.'],
      ['Which system is right for my home?', 'It depends on your source and your goals. A local pro reviews your water, explains the options clearly, and recommends a system that fits your budget.'],
    ],
  },
];
