import { SAME_AS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import QuizCta from '@/components/QuizCta';
import FilterFinder from '@/components/FilterFinder';
import LeadForm from '@/components/LeadForm';
import {
  ServiceHero, BuyerDecisionTree, ContaminationChart, SystemDiagram, BeforeAfterSlider, PricingTimeline,
  ComparisonTable, MaintenanceFAQ, ServiceAreaCallout, CTASection, UnfaqSection, LeanLinks, InstallGallery, FaqGroup, Band,
} from '@/components/service';
import { MAINTENANCE, SERVICES, UAQ_SHARED } from '@/lib/services';
import { PRICING, TAX_NOTE, flagshipPrice } from '@/lib/pricing';

type Props = { params: Promise<{ slug: string }> };
const find = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = find((await params).slug);
  if (!s) return {};
  const title = s.kind === 'flagship' ? `${s.name} from ${flagshipPrice} installed | US Water Pros` : `${s.name} | US Water Pros`;
  return { title, description: s.summary, alternates: { canonical: `/services/${s.slug}` }, openGraph: { title, description: s.summary } };
}

export default async function ServicePage({ params }: Props) {
  const s = find((await params).slug);
  if (!s) notFound();
  const faqs: [string, string][] = s.lean ? [...s.faqs, ...(s.uaq ? [s.uaq, ...UAQ_SHARED] : [])] : [
    ...s.faqs,
    ['What’s the installation process like?', 'Our technician arrives, shuts off your water for about 4 hours, installs the system, pressure tests it and makes sure everything flows correctly. You are back to normal water use that day.'],
    ['What warranty do you offer?', 'A 1-year warranty on all equipment, plus our satisfaction guarantee: if you are not happy, we will adjust or replace.'],
    ['Can you service my existing system?', 'Yes. We can maintain or upgrade any water system. We assess it during your free consultation.'],
    ['Do you serve my area?', 'Yes. We serve Tacoma, Puyallup, Bremerton, Port Orchard, Olympia, Lacey and surrounding areas.'],
    ...MAINTENANCE,
    ...(s.uaq ? [s.uaq, ...UAQ_SHARED] : []),
  ];
  const offer = (name: string, price: number, description: string) => ({ '@type': 'Offer', name, price, priceCurrency: 'USD', description, itemOffered: { '@type': 'Service', name } });
  const offers =
    s.kind === 'flagship' ? [
      offer(PRICING.flagship.label, PRICING.flagship.displayPrice, `Installed, tax included. Includes ${PRICING.flagship.includes.join(', ')}.`),
      ...Object.values(PRICING.addons).map((a) => offer(a.label, a.displayPrice, 'Add-on, installed on the same visit as the whole-home system. Tax included.')),
    ]
    : s.kind === 'addon' && s.addon ? [offer(PRICING.addons[s.addon].label, PRICING.addons[s.addon].displayPrice, 'Add-on, installed on the same visit as the whole-home system. Tax included.')]
    : s.kind === 'well' ? Object.values(PRICING.wellTest).map((t) => offer(t.label, t.displayPrice, 'Credited toward your install if you purchase.'))
    : [];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', name: s.name, description: s.summary,
        provider: { '@type': 'LocalBusiness', sameAs: SAME_AS, name: 'US Water Pros', telephone: '+1-253-777-0901', areaServed: ['Tacoma, WA', 'Puyallup, WA', 'Bremerton, WA', 'Port Orchard, WA', 'Olympia, WA', 'Lacey, WA'] },
        ...(offers.length && { offers }),
        availableChannel: { '@type': 'ServiceChannel', serviceUrl: `https://uswaterpros.com/services/${s.slug}` } },
      { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  };
  return (
    <main id="main">
      <ServiceHero s={s} />
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20 grid gap-12 md:gap-16 md:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-16 md:gap-20">
          <BuyerDecisionTree s={s} />
          <ContaminationChart s={s} />
        </div>
        <aside id="quote" className="[@media(min-width:768px)_and_(min-height:900px)]:sticky top-24 self-start scroll-mt-24"><LeadForm service={s.slug} /></aside>
      </div>
      <QuizCta service={s.slug} />
      <Band><SystemDiagram s={s} /></Band>
      <Band tone="ice"><BeforeAfterSlider s={s} /></Band>
      <Band><PricingTimeline s={s} />{s.gallery && <InstallGallery s={s} />}</Band>
      <FilterFinder />
      {s.kind === 'flagship' && <Band><ComparisonTable s={s} /></Band>}
      <Band tone="ice">
        {!s.lean && <MaintenanceFAQ />}
        <FaqGroup title="Frequently Asked Questions" items={s.lean ? s.faqs : s.faqs.concat(faqs.slice(s.faqs.length, s.faqs.length + 4))} />
        <UnfaqSection s={s} />
        {s.lean && <LeanLinks />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Band>
      {!s.lean && <ServiceAreaCallout />}
      <CTASection />
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl">Also interested in</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {s.related.map((r) => { const x = find(r)!; return <Link key={r} href={`/services/${r}`} className="lowercase chip hover:!bg-navy hover:!text-white">{x.name}</Link>; })}
          <Link href="/locations/pierce-county" className="chip hover:!bg-navy hover:!text-white">Pierce County water guide</Link>
          <Link href="/locations/kitsap-county" className="chip hover:!bg-navy hover:!text-white">Kitsap County water guide</Link>
        </div>
      </section>
    </main>
  );
}
