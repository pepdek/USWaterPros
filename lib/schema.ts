import { PRICING } from './pricing';
import { SITE } from './site';
import { SAME_AS } from './constants';

// No aggregateRating anywhere: ratings are only allowed once data/reviews.json has real entries.
export const localBusiness = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE.name,
  telephone: SITE.phoneTel,
  url: 'https://uswaterpros.com',
  priceRange: '$$',
  areaServed: SITE.serviceAreas.map((c) => ({ '@type': 'City', name: `${c}, WA` })),
  sameAs: SAME_AS,
});

export const flagshipService = (url: string, name: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  serviceType: 'Whole-home water filtration and softening',
  provider: { '@type': 'LocalBusiness', name: SITE.name, telephone: SITE.phoneTel },
  areaServed: SITE.serviceAreas.map((c) => ({ '@type': 'City', name: `${c}, WA` })),
  url,
  offers: { '@type': 'Offer', price: PRICING.flagship.displayPrice, priceCurrency: 'USD', description: `Installed, tax included. Includes ${PRICING.flagship.includes.join(', ')}.` },
});

export const breadcrumbs = (items: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
});
