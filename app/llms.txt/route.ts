import { SERVICES } from '@/lib/services';
import { CITIES } from '@/lib/cities';
import { LOCATIONS } from '@/lib/locations';
import { TIERS, formatUSD } from '@/lib/pricing';
import { PHONE } from '@/lib/constants';

const BASE = 'https://uswaterpros.com';

// llms.txt: a plain-text map of the site for AI assistants. Built from the same data as the pages, so prices never drift.
export function GET() {
  const body = `# US Water Pros

> Local whole-home water filtration company. Installs in Pierce County, WA (Tacoma, Puyallup, Gig Harbor and nearby); other areas join a waitlist. Phone or text: ${PHONE}.

${TIERS.map((x) => `${x.name} ${formatUSD(x.price)}`).join(', ')}, installed and tax included. Pay up front, 100% refundable. Get an instant price at ${BASE}/pricing. A licensed local plumber installs it. Pierce County, WA.

## Services
${SERVICES.map((s) => `- [${s.name}](${BASE}/services/${s.slug}): ${s.summary}`).join('\n')}

## Service areas
${LOCATIONS.map((l) => `- [${l.name}](${BASE}/locations/${l.slug}): ${l.blurb}`).join('\n')}
${CITIES.map((c) => `- [${c.name}, WA](${BASE}/services/whole-home-water-filtration-${c.slug}): ${c.headline}`).join('\n')}

## Tools and policies
- [Pricing](${BASE}/pricing)
- [Water tools: ZIP water report, cost calculator, savings check](${BASE}/tools)
- [Find your system quiz](${BASE}/quiz)
- [Privacy](${BASE}/privacy)
- [Terms](${BASE}/terms)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
