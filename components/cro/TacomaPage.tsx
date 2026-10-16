import Link from 'next/link';
import { Hero, PreEighty, HowItWorks, Includes, FaqSection, FooterCta } from './Sections';
import PriceStrip from './PriceStrip';
import ProofSlot from './ProofSlot';
import Sources from '@/components/Sources';
import { Band } from '@/components/service';
import { CITIES } from '@/lib/cities';
import { CRO_FAQ, type Faq } from '@/lib/croFaq';
import { SITE } from '@/lib/site';
import { breadcrumbs, flagshipService, localBusiness } from '@/lib/schema';

const URL = 'https://uswaterpros.com/services/whole-home-water-filtration-tacoma';

const TACOMA_FAQ: Faq[] = [
  ['Should I worry about lead in an older Tacoma home?', 'Homes built before 1986 may have lead solder or fixtures. A water test shows whether lead is present, and certified filtration or reverse osmosis can reduce it at the tap. We’ll tell you on the call what your situation calls for.'],
  ['Do you serve my Tacoma neighborhood?', 'Yes. We serve all of Tacoma, including Proctor, the North End, Hilltop, the Stadium District, Old Town and South Tacoma.'],
];

export default function TacomaPage() {
  const c = CITIES.find((x) => x.slug === 'tacoma')!;
  const graph = [
    localBusiness(),
    flagshipService(URL, 'Whole-Home Water Filtration in Tacoma, WA'),
    breadcrumbs([['Home', 'https://uswaterpros.com/'], ['Whole-home water filtration', 'https://uswaterpros.com/services/whole-home-water-filtration'], ['Tacoma', URL]]),
  ];
  return (
    <main>
      <Hero
        eyebrow="Tacoma, WA"
        h1="Whole-Home Water Filtration in Tacoma, WA"
        sub={`Tacoma water is treated and meets federal standards. Most homeowners want it better to drink, softer on skin, and kinder to plumbing. ${SITE.priceInstalled} installed, tax included.`}
      />
      <PriceStrip />

      <Band>
        <div className="max-w-3xl">
          <h2>Tacoma&apos;s water, in plain language</h2>
          <p className="mt-4">Most of Tacoma&apos;s water comes from Tacoma Water, which draws mainly on the Green River. Disinfectant is what most people taste, and it can leave water smelling like a pool.</p>
          <Sources ids={['tpuSource']} className="mt-2" />
          <p className="mt-6">
            Tacoma Water publishes an annual Consumer Confidence Report with its chlorine residual, hardness and detected contaminants. See what it measured for your ZIP in our <Link href="/tools#report" className="underline font-semibold text-ink">water report tool</Link>, or read the <a href={c.authority[1]} className="underline font-semibold text-ink" target="_blank" rel="noopener noreferrer">utility&apos;s own page</a>. Figures come from the utility&apos;s annual report.
          </p>
          {/* VERIFY: insert Tacoma Water report figures (report year, chlorine residual, hardness, detected contaminants) inline, or confirm linking to the ZIP report tool is enough. */}
          <p className="mt-6">Neighborhoods we serve: {c.neighborhoods.join(', ')}.</p>
        </div>
      </Band>

      <PreEighty opener="Many homes in Proctor, the North End, and Hilltop were built before 1986. If yours is one of them, the first step is knowing what your water and plumbing contain." />
      <HowItWorks />
      <Includes />
      <ProofSlot />
      <FaqSection items={[...CRO_FAQ, ...TACOMA_FAQ]} />
      <FooterCta />
      <p className="mx-auto max-w-6xl px-4 pb-16 text-center">
        <Link href="/services/whole-home-water-filtration" className="underline font-semibold text-ink">whole-home water filtration</Link> details and pricing apply across Tacoma, Puyallup, Bremerton, Port Orchard, Olympia and Lacey.
      </p>
      {graph.map((g, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(g) }} />)}
    </main>
  );
}
