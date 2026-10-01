import { PHONE_HREF } from './constants';

export type Service = {
  slug: string; adj: string; name: string; icon: string; tagline: string; blurb: string;
  what: string; how: string; benefits: string[]; price: string; stat: string;
};

export const SERVICES: Service[] = [
  { slug: 'whole-home-filtration', adj: 'Trusted', name: 'Whole-Home Filtration', icon: 'house', tagline: 'Remove sediment, chlorine, and odors.',
    blurb: 'Clean, great-tasting water from every tap. Protect your pipes and appliances.',
    what: 'A whole-home filter treats water where it enters your house, so every tap, shower and appliance gets clean water.',
    how: 'Water passes through sediment and carbon stages that catch particles, chlorine and odors before it reaches your plumbing.',
    benefits: ['No chlorine taste or smell', 'Softer-feeling skin and hair', 'Longer appliance life'], price: '$1,200 – $4,000 installed', stat: 'Over 70% of US homes have chlorine in their tap water.' },
  { slug: 'water-softening', adj: 'Accountable', name: 'Water Softening', icon: 'drop', tagline: 'Eliminate hard water scaling and dry skin.',
    blurb: 'Say goodbye to limescale, spotty dishes and dry skin. Softer water, lower bills.',
    what: 'A softener removes the minerals that cause scale, leaving water that lathers better and stops buildup.',
    how: 'Hard minerals are swapped out as water flows through the unit, which recharges itself automatically.',
    benefits: ['No more scale on fixtures', 'Less soap and detergent', 'Water heater lasts longer'], price: '$800 – $3,000 installed', stat: 'Over 85% of US homes have hard water.' },
  { slug: 'well-water-testing', adj: 'Dedicated', name: 'Well Water Testing', icon: 'flask', tagline: 'Know exactly what is in your well.',
    blurb: 'Find out what is really in your well water. Certified lab results, in plain English.',
    what: 'A certified test checks your well for bacteria, nitrates, metals and other contaminants.',
    how: 'Our team collects a sample, sends it to a certified lab, and walks you through the results.',
    benefits: ['Peace of mind for your family', 'Clear fix-it recommendations', 'Required by many lenders'], price: '$100 – $500', stat: 'Private wells are not regulated — testing is up to you.' },
  { slug: 'reverse-osmosis', adj: 'Trusted', name: 'Reverse Osmosis', icon: 'glass', tagline: 'Pure drinking water straight from the tap.',
    blurb: 'Bottled-water quality from your kitchen faucet. Stop buying jugs.',
    what: 'Reverse osmosis is the most thorough drinking-water filter for a home.',
    how: 'Water is pushed through an ultra-fine membrane that blocks up to 99% of dissolved contaminants.',
    benefits: ['Removes lead, PFAS and more', 'Better tasting coffee and ice', 'Cheaper than bottled water'], price: '$300 – $1,500 installed', stat: 'Americans spend billions a year on bottled water.' },
  { slug: 'carbon-filtration', adj: 'Accountable', name: 'Carbon Filtration', icon: 'layers', tagline: 'Clear, fresh water without the chemical taste.',
    blurb: 'Fresh-tasting water with no chlorine smell. A simple, affordable upgrade.',
    what: 'Activated carbon filters trap chlorine, chemicals and odors as water passes through.',
    how: 'Carbon has millions of tiny pores that grab contaminants, then you swap the cartridge on schedule.',
    benefits: ['Fresh taste and smell', 'Low upfront cost', 'Easy maintenance'], price: '$200 – $1,200 installed', stat: 'Most city water is disinfected with chlorine or chloramine.' },
  { slug: 'city-water-treatment', adj: 'Dedicated', name: 'City Water Treatment', icon: 'building', tagline: 'Fix what the city leaves behind.',
    blurb: 'Municipal water is safe to drink, not always good to drink. Upgrade it at home.',
    what: 'City water meets legal limits, but can still carry chlorine, hardness, lead from old pipes and more.',
    how: 'Our team checks your local report and recommends the right mix of filters and softening.',
    benefits: ['Tailored to your ZIP code', 'Protects against old-pipe lead', 'One-visit install'], price: '$500 – $3,500 installed', stat: 'Millions of US homes still have lead service lines.' },
];

export const PILLS = [
  { label: 'Top Rated Services', href: '#services' },
  ...SERVICES.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
  { label: 'Emergency Repair', href: PHONE_HREF },
];
