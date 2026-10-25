import type { Metadata } from 'next';
import Link from 'next/link';
import ProductCards from '@/components/store/ProductCards';
import WizardButton from '@/components/store/WizardButton';
import { Band, FaqGroup } from '@/components/service';
import { PRICING, TIERS, TAX_NOTE, formatUSD } from '@/lib/pricing';
import { STORE } from '@/lib/store';
import { TEAL_ON_WHITE } from '@/lib/contrast';
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

const INCLUDED = [
  'Installation by a licensed local plumber',
  'About 4 hours on site',
  'The system you choose, installed and ready to use',
  'Whole-home carbon filtration',
  'A reverse osmosis drinking-water faucet at your kitchen sink',
  'Testing before the plumber leaves',
  'A walkthrough of how everything works',
  "A 1-year warranty, and tax is already in the price",
];

const EXCLUDED = [
  'Homes that need something different, such as long pipe runs, a crawlspace, or buried lines. We tell you before you commit.',
  `Yearly filter changes, about ${STORE.annualFilters} a year`,
  'A water softener, if you choose Essential (it comes with Complete and Iron-Free)',
  'The iron and manganese filter, unless you choose Iron-Free',
  `Private wells. We start those with a water test, from ${formatUSD(PRICING.wellTest.basic.displayPrice)}, credited toward an install`,
  'Service after the 1-year warranty ends',
  'Repairs to your existing plumbing, fixtures or appliances',
];

export default function Pricing() {
  const ld = breadcrumbsLd([['Home', 'https://uswaterpros.com/'], ['Pricing', 'https://uswaterpros.com/pricing']]);
  const offers = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: TIERS.map((t, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Product', name: `${t.name} whole-home water system`, offers: { '@type': 'Offer', price: t.price, priceCurrency: 'USD' } } })) };
  return (
    <main id="main">
      <section className="bg-surge">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h1 className="!text-white">Pricing</h1>
          <p className="!text-white mt-4 md:text-lg max-w-2xl">Three systems. One price for each, {TAX_NOTE}. Pick one, choose your install day, and pay up front. {STORE.refund}</p>
        </div>
      </section>

      <Band><ProductCards headingAs="h2" id="cards" caption="All-in starting price" showAvg /><p className="!py-0 -mt-10 text-center text-[14px] font-light text-[#3f4a4f]">Benefits depend on your home&apos;s water. We tell you what to expect before you pay.</p></Band>

      <Band tone="ice">
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 md:items-stretch">
          <section aria-labelledby="inc-h" className="rounded-3xl bg-white border border-black/[.08] p-7 md:p-9">
            <h2 id="inc-h" className="!text-[30px]">What&apos;s included</h2>
            <p className="!py-0 mt-1 font-light text-[#3f4a4f]">In every system, at the price you see.</p>
            <ul className="mt-6 flex flex-col gap-3.5">
              {INCLUDED.map((i) => <li key={i} className="flex gap-3"><span className="mt-0.5 shrink-0 font-bold" style={{ color: TEAL_ON_WHITE }} aria-hidden>✓</span><span className="font-light"><span className="sr-only">Included: </span>{i}</span></li>)}
            </ul>
          </section>
          <section aria-labelledby="exc-h" className="rounded-3xl bg-white border border-black/[.08] p-7 md:p-9">
            <h2 id="exc-h" className="!text-[30px]">What&apos;s not included</h2>
            <p className="!py-0 mt-1 font-light text-[#3f4a4f]">So there are no surprises after you pay.</p>
            <ul className="mt-6 flex flex-col gap-3.5">
              {EXCLUDED.map((i) => <li key={i} className="flex gap-3"><span className="mt-0.5 shrink-0 font-bold text-[#8a3b12]" aria-hidden>–</span><span className="font-light"><span className="sr-only">Not included: </span>{i}</span></li>)}
            </ul>
            {/* VERIFY: the last "not included" item (repairs to existing plumbing, fixtures or appliances) and the full list of what is outside the fixed price (permits, drain or electrical work, extra plumbing). */}
          </section>
        </div>
      </Band>

      <Band tone="ice">
        <div className="max-w-3xl">
          <h2>How and when you pay</h2>
          <ol className="mt-6 flex flex-col gap-4 list-decimal pl-6">
            <li>Enter your ZIP and pick a system.</li>
            <li>Choose your install day.</li>
            <li>Pay the full price by card on a secure Stripe page. We never see your card number.</li>
            <li>{STORE.confirm} A licensed local plumber installs it.</li>
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
