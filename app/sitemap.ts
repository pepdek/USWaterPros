import type { MetadataRoute } from 'next';
import { SERVICES } from '@/lib/services';
import { LOCATIONS } from '@/lib/locations';
import { CITIES, UPDATED } from '@/lib/cities';

const BASE = 'https://uswaterpros.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    '/quiz',
    '/tools',
    ...SERVICES.map((s) => `/services/${s.slug}`),
    ...LOCATIONS.map((l) => `/locations/${l.slug}`),
    ...CITIES.map((c) => `/services/whole-home-water-filtration-${c.slug}`),
  ];
  return paths.map((p) => ({ url: BASE + p, lastModified: UPDATED }));
}
