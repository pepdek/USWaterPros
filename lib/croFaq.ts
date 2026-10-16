import { SITE } from './site';

export type Faq = [question: string, answer: string];

// Shared by the home page, the whole-home page and the Tacoma page. Each page's FAQPage schema is built from the same list.
export const CRO_FAQ: Faq[] = [
  ['How much does whole-home filtration cost?', `${SITE.priceInstalled} installed, tax included, for softening, carbon filtration, and drinking-water RO. Your quote confirms your home's details.`],
  ['How long does installation take?', `About 4 hours on site, usually within a few days of your call.`],
  ['How often do filters need replacing?', `Annual filter replacement, about $${SITE.annualFilters} a year.`], // VERIFY: filter replacement cost and interval
  ['Will it lower my water pressure?', 'Pressure depends on your home’s plumbing and the size of the system. We confirm the sizing for your home on the call, before you decide.'], // VERIFY: pressure impact and sizing
  ['Does it remove fluoride?', 'No. Carbon media removes chlorine, taste, odor, and many chemicals, but not fluoride. If fluoride removal is your goal, the reverse osmosis drinking-water faucet in the system is the tool for that.'], // VERIFY: fluoride reduction rating of the installed RO membrane
  ['Will it help if my water tests high for PFAS?', 'Partly, and it depends on the compound. Carbon reduces some PFAS but not all of them. Health agencies list reverse osmosis among home treatments for PFAS. A lab test shows what is actually in your water, and we tell you plainly what a filter can and cannot do.'], // VERIFY: PFAS performance of installed media
];

export const AREA_FAQ: Faq = ['Do you serve my area?', `Yes. We serve ${SITE.serviceAreas.slice(0, -1).join(', ')} and ${SITE.serviceAreas.at(-1)}, plus nearby communities in Pierce, Kitsap and Thurston Counties.`];
