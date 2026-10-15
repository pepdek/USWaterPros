import { SERVICES } from '@/lib/services';
import { CITIES } from '@/lib/cities';
import { LOCATIONS } from '@/lib/locations';
import { PRICING, formatUSD } from '@/lib/pricing';
import { PHONE } from '@/lib/constants';

const BASE = 'https://uswaterpros.com';

// llms.txt: a plain-text map of the site for AI assistants. Built from the same data as the pages, so prices never drift.
export function GET() {
  const body = `# US Water Pros

> Local water filtration and treatment company serving Pierce, Kitsap and Thurston Counties, WA (Tacoma, Puyallup, Bremerton, Port Orchard, Olympia, Lacey, Gig Harbor and nearby). In business since 2009. Licensed technicians. Phone or text: ${PHONE}.

${PRICING.headline} Includes ${PRICING.flagship.includes.join(', ').toLowerCase()}. Reverse osmosis drinking water add-on ${formatUSD(PRICING.addons.ro.displayPrice)}, carbon filtration add-on ${formatUSD(PRICING.addons.carbon.displayPrice)}. Well water tests ${formatUSD(PRICING.wellTest.basic.displayPrice)} (basic) and ${formatUSD(PRICING.wellTest.full.displayPrice)} (full panel), credited toward an install. A free consultation comes first.

## Services
${SERVICES.map((s) => `- [${s.name}](${BASE}/services/${s.slug}): ${s.summary}`).join('\n')}

## Service areas
${LOCATIONS.map((l) => `- [${l.name}](${BASE}/locations/${l.slug}): ${l.blurb}`).join('\n')}
${CITIES.map((c) => `- [${c.name}, WA](${BASE}/services/whole-home-water-filtration-${c.slug}): ${c.headline}`).join('\n')}

## Tools and policies
- [Water tools: ZIP water report, cost calculator, savings check](${BASE}/tools)
- [Find your system quiz](${BASE}/quiz)
- [Privacy](${BASE}/privacy)
- [Terms](${BASE}/terms)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
