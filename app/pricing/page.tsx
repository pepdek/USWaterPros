import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCards from '@/components/store/ProductCards';
import WizardButton from '@/components/store/WizardButton';
import { Band, FaqGroup } from '@/components/service';
import { PRICING, TIERS, TAX_NOTE, formatUSD } from '@/lib/pricing';
import { STORE } from '@/lib/store';
import { SERVED_AREA } from '@/lib/serviceArea';
import { breadcrumbsLd } from '@/lib/ld';

export const metadata: Metadata = {
  title: `Pricing: ${STORE.from} to ${STORE.to} Installed | US Water Pros`,
  description: `Three whole-home water systems, ${STORE.from} to ${STORE.to}, installed and tax included. Pay up front, ${STORE.refund.toLowerCase()} Pierce County, WA.`,
  alternates: { canonical: '/pricing' },
};

const FAQ: [string, string][] = [
  ['Which system should I pick?', 'Complete fits most homes. Essential is for soft-water city homes that mainly want better taste and no chlorine. Iron-Free is for orange or brown staining and a metallic taste. Not sure? Choose Complete, and text us before you pay if you want a second opinion.'],
  ['When do I pay?', `${STORE.payment} You pick your install day first, then pay to lock it in.`],
  ['Can I get my money back?', `Yes. Every order is ${STORE.refund.toLowerCase()}${STORE.refundTerms ? ` ${STORE.refundTerms}` : ''}`],
  ['Who installs it?', 'A licensed local plumber. It takes about 4 hours on site, and the system is tested before the plumber leaves.'],
  ['Do I need to be home?', 'Someone should be there to let the plumber in and see the walkthrough at the end.'],
  ['Do you serve my area?', `We install in ${SERVED_AREA} for now. Enter your ZIP and we tell you right away. If we're not there yet, you join the waitlist.`],
];

export default function Pricing() {
  const ld = breadcrumbsLd([['Home', 'https://uswaterpros.com/'], ['Pricing', 'https://uswaterpros.com/pricing']]);
  const offers = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: TIERS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Product', name: `${t.name} whole-home water system`, offers: { '@type': 'Offer', price: t.price, priceCurrency: 'USD' } } })) };
  return (
    <main>
      <section className="bg-surge">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h1 className="!text-white">Pricing</h1>
          <p className="!text-white mt-4 md:text-lg max-w-2xl">Three systems. One installed price for each, {TAX_NOTE}. Pick one, choose your install day, and pay up front. {STORE.refund}</p>
        </div>
      </section>

      <Band><ProductCards id="cards" /></Band>

      <Band tone="ice">
        <div className="max-w-3xl">
          <h2>What&apos;s included in every system</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {['Installation by a licensed local plumber', 'About 4 hours on site', 'Testing before the plumber leaves', 'A walkthrough of how everything works', '1-year warranty'].map((i) => <li key={i} className="flex gap-3"><span className="text-aqua" aria-hidden>✓</span><span>{i}</span></li>)}
          </ul>
          <p className="mt-6">{formatUSD(PRICING.flagship.displayPrice)} Complete is the one most homes choose.</p>
        </div>
      </Band>

      <Band>
        <div className="max-w-3xl">
          <h2>What&apos;s not in the quote</h2>
          <ul className="mt-6 flex flex-col gap-3">
            <li className="flex gap-3"><span className="text-aqua" aria-hidden>•</span><span>Homes that need something different, such as long pipe runs, a crawlspace, or buried lines. We tell you before you commit.</span></li>
            <li className="flex gap-3"><span className="text-aqua" aria-hidden>•</span><span>Yearly filter changes, about {STORE.annualFilters} a year.</span></li>
            <li className="flex gap-3"><span className="text-aqua" aria-hidden>•</span><span>Private wells. We start those with a water test, from {formatUSD(PRICING.wellTest.basic.displayPrice)}, credited toward an install.</span></li>
          </ul>
          {/* VERIFY: complete list of what is outside the fixed price (permits, drain or electrical work, extra plumbing) */}
        </div>
      </Band>

      <Band tone="ice">
        <div className="max-w-3xl">
          <h2>How and when you pay</h2>
          <ol className="mt-6 flex flex-col gap-4 list-decimal pl-6">
            <li>Enter your ZIP and pick a system.</li>
            <li>Choose your install day.</li>
            <li>Pay the full price by card on a secure Stripe page. We never see your card number.</li>
            <li>We text you to confirm the time. A licensed local plumber installs it.</li>
          </ol>
          <h3 className="mt-8 text-xl">Our refund promise</h3>
          <p className="mt-2">Every order is {STORE.refund.toLowerCase()} {STORE.refundTerms}</p>
          <div className="mt-8"><WizardButton>Get Instant Price</WizardButton></div>
        </div>
      </Band>

      <Band><FaqGroup title="Pricing questions" items={FAQ} /></Band>
      <p className="mx-auto max-w-6xl px-4 pb-16 text-center"><Link href="/" className="underline font-semibold text-ink">Back to the home page</Link></p>
      {[ld, offers].map((j, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />)}
    </main>
  );
}
