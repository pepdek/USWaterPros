import { Hero, PreEighty, HowItWorks, Includes, FaqSection, FooterCta } from './Sections';
import PriceStrip from './PriceStrip';
import ProofSlot from './ProofSlot';
import { Band, ComparisonTable, UnfaqSection } from '@/components/service';
import { SERVICES } from '@/lib/services';
import { CRO_FAQ, AREA_FAQ } from '@/lib/croFaq';
import { SITE } from '@/lib/site';
import { breadcrumbs, flagshipService } from '@/lib/schema';

const TREATS: [string, string, string][] = [
  ['Chlorine taste and odor', 'Carbon media', 'Reduces chlorine taste and odor at every tap'],
  ['Sediment and rust', '5-micron pre-filter', 'Catches particles before they reach the home'],
  ['Hard water', 'Resin softener', 'Reduces scale on fixtures, dishes, and water heaters'],
  ['Drinking water', 'RO faucet', 'Reduces dissolved contaminants at the drinking-water tap'],
];

const DECISIONS: [string, string, string][] = [
  ['Chlorine taste and smell', 'Whole-home carbon + RO faucet', 'Fresh water at every tap'],
  ['Scale on dishes, fixtures, and water heater', 'Resin softener', 'Less spotting, longer appliance life'],
  ['Not sure what’s in your water', 'Find out on the call', 'A fixed price and a clear answer'],
];

export default function WholeHomePage() {
  const s = SERVICES.find((x) => x.slug === 'whole-home-water-filtration')!;
  const graph = [
    flagshipService('https://uswaterpros.com/services/whole-home-water-filtration', s.name),
    breadcrumbs([['Home', 'https://uswaterpros.com/'], ['Services', 'https://uswaterpros.com/#services'], [s.name, 'https://uswaterpros.com/services/whole-home-water-filtration']]),
  ];
  return (
    <main>
      <Hero
        eyebrow="Whole-Home Water Filtration"
        h1={`Whole-Home Water Filtration: ${SITE.priceInstalled} Installed, Tax Included`}
        sub={`Softening, carbon filtration, and drinking-water RO in one system. A licensed plumber installs it in ${SITE.installHours} hours. Fixed price, ${SITE.warrantyYears}-year warranty.`}
      />
      <PriceStrip />

      <Band>
        <div>
          <h2>What it treats</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-left min-w-[560px]">
              <caption className="sr-only">What the whole-home system treats</caption>
              <thead><tr className="text-ink"><th scope="col" className="p-3">Problem</th><th scope="col" className="p-3">What handles it</th><th scope="col" className="p-3">What it does</th></tr></thead>
              <tbody>{TREATS.map(([a, b, c]) => <tr key={a} className="border-t border-black/10"><th scope="row" className="p-3 font-semibold text-ink">{a}</th><td className="p-3">{b}</td><td className="p-3">{c}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="mt-4 max-w-3xl">We don&apos;t treat everything. We test what matters for your water and tell you what your system does and doesn&apos;t address.</p>
        </div>
        <div>
          <h2>Is this the right fit for your water?</h2>
          <ul className="mt-8 flex flex-col gap-4">
            {DECISIONS.map(([have, rec, result]) => (
              <li key={have} className="card p-6 md:p-8 !transform-none grid gap-4 md:grid-cols-3">
                <div><p className="!py-0 text-sm font-semibold uppercase tracking-wide text-teal">You have</p><p className="!py-0 font-semibold text-ink">{have}</p></div>
                <div><p className="!py-0 text-sm font-semibold uppercase tracking-wide text-teal">We recommend</p><p className="!py-0">{rec}</p></div>
                <div><p className="!py-0 text-sm font-semibold uppercase tracking-wide text-teal">Result</p><p className="!py-0 font-semibold text-ink">{result}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </Band>

      <PreEighty />
      <HowItWorks />
      <Includes />

      <Band>
        {/* VERIFY: Support and Typical lifespan rows of the comparison table */}
        <ComparisonTable s={s} />
      </Band>

      <ProofSlot />

      <Band tone="ice"><UnfaqSection s={s} /></Band>
      <FaqSection items={[...CRO_FAQ, AREA_FAQ]} />
      <FooterCta />
      {graph.map((g) => <script key={g['@type']} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(g) }} />)}
    </main>
  );
}
