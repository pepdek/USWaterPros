import { PHONE_HREF } from './constants';
import type { SourceId } from './sources';

type Problem = { icon: string; problem: string; solution: string; outcome: string };
type Treat = { icon: string; item: string; how: string };
type Stage = { title: string; what: string; removes: string };

export type Service = {
  slug: string; image: string; imageAlt: string; name: string; icon: string; blurb: string;
  h1: string; sub: string; summary: string;
  problems: Problem[]; treats: Treat[]; stages: Stage[];
  before: string; after: string;
  faqs: [string, string][]; related: string[];
  stat: string; cite: SourceId[];
};

// Company facts supplied by the owner: $2,700 fixed, ~4h install, 1-year warranty, since 2009.
export const PRICE = '$2,700';

export const SERVICES: Service[] = [
  {
    slug: 'whole-home-water-filtration', image: '/images/services/whole-home-water-filtration.webp', imageAlt: 'Whole-home water filtration system with carbon filter tank and brine tank', name: 'Whole-Home Water Filtration', icon: 'house',
    blurb: 'Clean, great-tasting water from every tap. Protect your pipes and appliances.',
    h1: 'Whole-Home Water Filtration to Remove Chlorine, Sediment & Odors',
    sub: 'Clean water from every tap. Fixed price: $2,700 installed by licensed technicians in about 4 hours.',
    summary: 'Whole-home water filtration at a fixed $2,700 installed. Removes chlorine taste, sediment and odors from every tap. Licensed technicians in Washington.',
    problems: [
      { icon: 'drop', problem: 'Chlorine taste and smell in your tap water', solution: 'Carbon filtration media reduces chlorine taste and odor', outcome: 'Fresh, clean water from every tap' },
      { icon: 'layers', problem: 'Sediment and particles clouding your water', solution: 'A 5-micron pre-filter catches particles before they enter your home', outcome: 'Clearer water and longer appliance life' },
      { icon: 'shield', problem: 'Concerns about tap water safety', solution: 'Multi-stage filtration reduces sediment, chlorine and other common contaminants', outcome: 'Peace of mind for your family' },
    ],
    treats: [
      { icon: 'drop', item: 'Chlorine', how: 'Activated carbon' },
      { icon: 'layers', item: 'Sediment & particles', how: '5-micron sediment filter' },
      { icon: 'flask', item: 'Odors', how: 'Activated carbon' },
      { icon: 'building', item: 'Rust & scale flakes', how: 'Sediment pre-filter' },
      { icon: 'glass', item: 'Many common chemicals', how: 'Carbon media' },
    ],
    stages: [
      { title: 'Sediment pre-filter', what: 'Catches particles first and protects the rest of the system', removes: 'Sediment, rust, grit' },
      { title: 'Carbon media tank', what: 'Water passes through activated carbon', removes: 'Chlorine, odor, many chemicals' },
      { title: 'Control head', what: 'Sets flow and backwash so the system maintains itself', removes: 'Keeps media working' },
      { title: 'Optional RO at the kitchen tap', what: 'A dedicated faucet for drinking and cooking water', removes: 'Dissolved contaminants' },
    ],
    before: 'Chlorine smell, cloudy water and particles in the glass. This is what untreated water can look and taste like.',
    after: 'Clear, fresh-tasting water at every faucet, shower and appliance.',
    faqs: [
      ['Is whole-home filtration right for city water or well water?', 'It works for both. City water is usually about chlorine taste. On a well we recommend a water test first, because wells often need iron or bacteria treatment too.'],
      ['How does whole-home filtration compare to a pitcher or faucet filter?', 'Pitchers and faucet filters treat one tap. Whole-home filtration treats every tap, shower and appliance, so you also get chlorine-free showers.'],
      ['Will this remove hard water minerals?', 'No. A filter does not soften water. If you also have scale, we pair it with a softener.'],
    ],
    related: ['reverse-osmosis-systems', 'water-softening-systems', 'carbon-filtration'],
    stat: 'Most US public water systems disinfect with chlorine or chloramine.', cite: ['epaDbp'],
  },
  {
    slug: 'water-softening-systems', image: '/images/services/water-softening-systems.webp', imageAlt: 'Water softener system with brine tank and reverse osmosis drinking water faucet', name: 'Water Softening Systems', icon: 'drop',
    blurb: 'Say goodbye to limescale, spotty dishes and dry skin. Softer water, lower bills.',
    h1: 'Water Softening Systems to Stop Hard Water Scale & Dry Skin',
    sub: 'Softer water, cleaner fixtures. Fixed price: $2,700 installed by licensed technicians in about 4 hours.',
    summary: 'Water softener installation at a fixed $2,700. Stops scale, spotty dishes and dry skin. Licensed technicians in Washington.',
    problems: [
      { icon: 'building', problem: 'White scale on faucets, showerheads and glass', solution: 'Ion exchange resin removes the calcium and magnesium that cause scale', outcome: 'Fixtures stay clean and cleaning gets easier' },
      { icon: 'glass', problem: 'Spotty dishes and cloudy glassware', solution: 'Softened water rinses clean without mineral spots', outcome: 'Dishes and glass come out clear' },
      { icon: 'house', problem: 'Dry skin and hair, and scale inside appliances', solution: 'Softer water lathers better and stops scale from building up inside heaters', outcome: 'Softer feeling skin and longer appliance life' },
    ],
    treats: [
      { icon: 'drop', item: 'Hard water minerals (calcium, magnesium)', how: 'Ion exchange resin' },
      { icon: 'building', item: 'Scale buildup', how: 'Prevented at the source' },
      { icon: 'glass', item: 'Soap scum and spotting', how: 'Softened water' },
      { icon: 'layers', item: 'Some iron (small amounts)', how: 'Resin bed' },
    ],
    stages: [
      { title: 'Optional sediment pre-filter', what: 'Protects the resin from particles', removes: 'Sediment' },
      { title: 'Resin tank', what: 'Hard minerals are swapped for softer ones as water flows through', removes: 'Calcium and magnesium' },
      { title: 'Brine tank', what: 'Recharges the resin automatically', removes: 'Keeps the resin working' },
      { title: 'Softened water to your home', what: 'Every tap, shower and appliance gets softened water', removes: 'Scale and spotting' },
    ],
    before: 'Scale crusted on a faucet and spots on glass. This is hard water at work.',
    after: 'Clean fixtures and clear glass, with far less scrubbing.',
    faqs: [
      ['Is a water softener right for city water or well water?', 'Both. Hardness comes from your source, not whether it is city or well. A quick test shows how hard your water is.'],
      ['Does a softener remove chlorine or make water safe to drink?', 'No. A softener treats hardness only. For chlorine taste we add carbon filtration, and for drinking water reverse osmosis.'],
      ['Will softened water taste salty?', 'No. Softened water does not taste salty, and the system is sized so it does not.'],
    ],
    related: ['whole-home-water-filtration', 'well-water-treatment', 'carbon-filtration'],
    stat: 'An estimated 85% of US homes have hard water.', cite: ['usgs', 'wqa'],
  },
  {
    slug: 'well-water-treatment', image: '/images/services/well-water-treatment.webp', imageAlt: 'Well water treatment system with softener tank, carbon tank and chemical feed', name: 'Well Water Treatment', icon: 'flask',
    blurb: 'Fix iron staining, sulfur smell and sediment. Safe, clean well water without boiling.',
    h1: 'Well Water Treatment to Fix Iron Staining, Sulfur Smell & Sediment',
    sub: 'Clean, safe well water. Fixed price: $2,700 installed by licensed technicians in about 4 hours.',
    summary: 'Well water treatment at a fixed $2,700 installed. Fixes iron staining, sulfur smell and sediment. Licensed technicians in Washington.',
    problems: [
      { icon: 'building', problem: 'Orange or brown iron staining on fixtures and laundry', solution: 'An iron filter removes iron and manganese before it reaches your plumbing', outcome: 'Fixtures and laundry stop staining' },
      { icon: 'flask', problem: 'A rotten-egg sulfur smell', solution: 'Oxidizing filter media treats the hydrogen sulfide that causes it', outcome: 'No more smell from taps and showers' },
      { icon: 'shield', problem: 'Concerns about bacteria in your well', solution: 'We test first, then add UV disinfection if your results call for it', outcome: 'Safer water without boiling' },
    ],
    treats: [
      { icon: 'building', item: 'Iron staining', how: 'Iron filter media' },
      { icon: 'drop', item: 'Manganese', how: 'Iron and manganese filter' },
      { icon: 'flask', item: 'Sulfur smell (hydrogen sulfide)', how: 'Oxidizing media' },
      { icon: 'layers', item: 'Sediment', how: 'Sediment filter' },
      { icon: 'shield', item: 'Bacteria', how: 'UV disinfection, when needed' },
    ],
    stages: [
      { title: 'Water test', what: 'We test your well first so the system matches your water', removes: 'Tells us what to treat' },
      { title: 'Sediment filter', what: 'Catches sand and grit common in wells', removes: 'Sediment' },
      { title: 'Iron and sulfur filter', what: 'Treats the minerals and smell that stain and stink', removes: 'Iron, manganese, sulfur' },
      { title: 'UV disinfection (if needed)', what: 'Treats bacteria without chemicals', removes: 'Bacteria' },
    ],
    before: 'Orange staining and discolored water from iron in the well.',
    after: 'Clear water and clean fixtures once the iron is filtered out.',
    faqs: [
      ['Is this treatment right for my well?', 'Almost certainly, but wells vary a lot, so we test first. Your results decide which stages we install.'],
      ['How often should I test my well?', 'Local health districts recommend testing for bacteria every year and nitrate every three years.'],
      ['Will this make my well water safe to drink?', 'It treats what your test finds, including iron, sulfur and bacteria. If your test shows other contaminants, we recommend an add-on such as reverse osmosis.'],
    ],
    related: ['whole-home-water-filtration', 'water-softening-systems', 'reverse-osmosis-systems'],
    stat: 'Private wells are not regulated by the EPA, so testing is up to the owner.', cite: ['epaWells'],
  },
  {
    slug: 'reverse-osmosis-systems', image: '/images/services/reverse-osmosis-systems.webp', imageAlt: 'Five-stage reverse osmosis drinking water system with storage tank', name: 'Reverse Osmosis Systems', icon: 'glass',
    blurb: 'Bottled-water quality from your kitchen faucet. Stop buying jugs.',
    h1: 'Reverse Osmosis Drinking Water Systems for Clean, Great-Tasting Water',
    sub: 'Premium drinking water on tap. Fixed price: $2,700 installed by licensed technicians in about 4 hours.',
    summary: 'Reverse osmosis drinking water system at a fixed $2,700 installed. Reduces lead, PFAS and chlorine taste. Licensed technicians in Washington.',
    problems: [
      { icon: 'glass', problem: 'Tap water that tastes off, or worries you for your kids', solution: 'A reverse osmosis membrane filters water down to a very fine level', outcome: 'Premium drinking water from the tap' },
      { icon: 'shield', problem: 'Concerns about lead, PFAS or nitrate', solution: 'RO reduces many dissolved contaminants that basic filters miss', outcome: 'Peace of mind for drinking and cooking' },
      { icon: 'document', problem: 'Buying bottled water every week', solution: 'A dedicated RO faucet at your kitchen sink', outcome: 'Less plastic and less cost over time' },
    ],
    treats: [
      { icon: 'shield', item: 'Lead', how: 'RO membrane' },
      { icon: 'flask', item: 'PFAS', how: 'RO membrane' },
      { icon: 'layers', item: 'Nitrate', how: 'RO membrane' },
      { icon: 'drop', item: 'Chlorine taste & odor', how: 'Carbon pre-filters' },
      { icon: 'glass', item: 'Dissolved solids (TDS)', how: 'RO membrane' },
    ],
    stages: [
      { title: 'Sediment pre-filter', what: 'Protects the membrane from particles', removes: 'Sediment' },
      { title: 'Carbon pre-filter', what: 'Removes chlorine that can damage the membrane', removes: 'Chlorine, odor' },
      { title: 'RO membrane', what: 'Water is pushed through a very fine membrane', removes: 'Dissolved contaminants' },
      { title: 'Storage tank and faucet', what: 'Premium water is stored and ready at a dedicated tap', removes: 'Final carbon polish' },
    ],
    before: 'Cloudy-tasting tap water and a pile of plastic bottles.',
    after: 'A glass of clean, great-tasting water straight from your kitchen tap.',
    faqs: [
      ['Is reverse osmosis right for city water or well water?', 'Both. It treats drinking and cooking water at one tap. On a well we recommend a water test first.'],
      ['How does RO compare to a pitcher filter?', 'Pitcher filters mainly reduce taste and odor. RO also reduces many dissolved contaminants that pitchers do not, such as lead and PFAS, depending on the filter.'],
      ['Will RO treat my whole house?', 'No, RO is for drinking and cooking water at the kitchen. For the whole house we pair it with whole-home filtration.'],
    ],
    related: ['whole-home-water-filtration', 'carbon-filtration', 'city-water-treatment'],
    stat: 'Health agencies list reverse osmosis among the home treatments for PFAS.', cite: ['mdhPfas'],
  },
  {
    slug: 'carbon-filtration', image: '/images/services/carbon-filtration.webp', imageAlt: 'Activated carbon filter tank cutaway', name: 'Carbon Filtration', icon: 'layers',
    blurb: 'Fresh-tasting water with no chlorine smell. A simple, affordable upgrade.',
    h1: 'Carbon Filtration to Remove Chlorine Taste & Odors',
    sub: 'Fresh taste, simple system. Fixed price: $2,700 installed by licensed technicians in about 4 hours.',
    summary: 'Carbon filtration at a fixed $2,700 installed. Removes chlorine taste and odors. Licensed technicians in Washington.',
    problems: [
      { icon: 'drop', problem: 'Chlorine taste and pool-like smell', solution: 'Activated carbon traps chlorine as water flows through', outcome: 'Fresh-tasting water' },
      { icon: 'flask', problem: 'Concerns about chemicals in your water', solution: 'Carbon captures many common chemicals and organic compounds', outcome: 'Cleaner water without a complicated system' },
      { icon: 'document', problem: 'Wanting a better-tasting glass without a big project', solution: 'A simple carbon system with easy filter changes', outcome: 'Low upkeep and a noticeable improvement' },
    ],
    treats: [
      { icon: 'drop', item: 'Chlorine taste & odor', how: 'Activated carbon' },
      { icon: 'flask', item: 'Musty and chemical odors', how: 'Activated carbon' },
      { icon: 'glass', item: 'Many common chemicals', how: 'Carbon media' },
      { icon: 'layers', item: 'Fine sediment', how: 'Pre-filter' },
    ],
    stages: [
      { title: 'Sediment pre-filter', what: 'Protects the carbon from particles', removes: 'Sediment' },
      { title: 'Activated carbon', what: 'Millions of tiny pores grab contaminants', removes: 'Chlorine, odor, chemicals' },
      { title: 'Control head', what: 'Sets flow so the media works as designed', removes: 'Keeps media working' },
      { title: 'Filtered water to your home', what: 'Fresh water reaches every tap', removes: 'Taste and smell' },
    ],
    before: 'A glass that smells and tastes like chlorine.',
    after: 'Fresh, neutral-tasting water.',
    faqs: [
      ['Is carbon filtration right for city water or well water?', 'It is best for city water, where chlorine is the main complaint. On a well we test first, because wells often need iron or bacteria treatment too.'],
      ['How does carbon compare to reverse osmosis?', 'Carbon removes chlorine taste and many chemicals and costs less. RO goes further and reduces many dissolved contaminants but treats one tap.'],
      ['Will carbon remove chloramine?', 'Standard carbon is less effective on chloramine. We use catalytic carbon when your supply uses it.'],
    ],
    related: ['whole-home-water-filtration', 'reverse-osmosis-systems', 'city-water-treatment'],
    stat: 'Most city water is disinfected with chlorine or chloramine.', cite: ['epaDbp'],
  },
  {
    slug: 'city-water-treatment', image: '/images/services/city-water-treatment.webp', imageAlt: 'City water treatment system with softener tank, carbon tank and brine tank', name: 'City Water Treatment', icon: 'building',
    blurb: 'Municipal water is safe to drink, not always good to drink. Upgrade it at home.',
    h1: 'City Water Treatment to Reduce Chlorine & Improve Taste',
    sub: 'Better tasting city water. Fixed price: $2,700 installed by licensed technicians in about 4 hours.',
    summary: 'City water treatment at a fixed $2,700 installed. Reduces chlorine and improves taste. Licensed technicians in Washington.',
    problems: [
      { icon: 'drop', problem: 'Chlorine taste and smell from municipal water', solution: 'Catalytic carbon reduces chlorine and chloramine taste and odor', outcome: 'Water that tastes like water' },
      { icon: 'shield', problem: 'Older pipes, and lead in older homes', solution: 'A point-of-use reverse osmosis tap reduces lead at the kitchen sink', outcome: 'Safer drinking and cooking water' },
      { icon: 'clipboard', problem: 'Not sure what is in your city water', solution: 'We review your utility’s water quality report with you at your consultation', outcome: 'A system matched to your water' },
    ],
    treats: [
      { icon: 'drop', item: 'Chlorine and chloramine taste', how: 'Catalytic carbon' },
      { icon: 'shield', item: 'Lead from older plumbing', how: 'RO at the kitchen tap' },
      { icon: 'layers', item: 'Sediment', how: 'Pre-filter' },
      { icon: 'building', item: 'Hardness (if present)', how: 'Optional softener' },
    ],
    stages: [
      { title: 'Sediment pre-filter', what: 'Catches particles from aging mains and pipes', removes: 'Sediment' },
      { title: 'Catalytic carbon', what: 'Reduces chlorine and chloramine taste and odor', removes: 'Chlorine, chloramine' },
      { title: 'Optional softener', what: 'Added only if your water is hard', removes: 'Hard water minerals' },
      { title: 'Optional RO at the kitchen tap', what: 'Premium drinking water at one faucet', removes: 'Lead and dissolved contaminants' },
    ],
    before: 'Chlorine smell and sediment in city tap water.',
    after: 'Fresh-tasting water at every tap.',
    faqs: [
      ['Is this right for my water type, city or well?', 'This system is built for city water. If you are on a well, see our well water treatment, and we will test first.'],
      ['Isn’t city water already treated?', 'Yes, it is treated and tested. Treatment at home addresses what is left, mainly taste, smell and anything picked up from older plumbing.'],
      ['Will this remove lead?', 'A carbon system alone does not. Reverse osmosis at the kitchen tap reduces lead, so we add it if you are in an older home.'],
    ],
    related: ['carbon-filtration', 'reverse-osmosis-systems', 'whole-home-water-filtration'],
    stat: 'Homes built before 1986 may have lead pipes, solder or fixtures.', cite: ['epaLead'],
  },
];

export const PILLS = [
  { label: 'Top Rated Services', href: '#services' },
  ...SERVICES.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
  { label: 'Emergency Repair', href: PHONE_HREF },
];

export const MAINTENANCE: [string, string][] = [
  ['How often do filters need replacing?', 'Typically annually for the sediment filter and every 3–5 years for carbon or resin media. We send reminders.'],
  ['What’s the annual maintenance cost?', 'About $150–300 a year for filter cartridges. No technician visits are needed for routine maintenance.'],
  ['How long does the system last?', 'Typically 8–10 years for whole-home systems. Some components, like resin, regenerate. Others are replaced.'],
  ['What if something breaks?', 'Your warranty covers manufacturing defects. We repair or replace at no cost within the first year.'],
  ['Can I service it myself?', 'Filter changes are simple, and we give you guidance. Major repairs are done by a licensed technician.'],
];
