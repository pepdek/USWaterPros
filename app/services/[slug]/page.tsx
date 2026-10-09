import { SAME_AS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import QuizCta from '@/components/QuizCta';
import FilterFinder from '@/components/FilterFinder';
import LeadForm from '@/components/LeadForm';
import {
  ServiceHero, BuyerDecisionTree, ContaminationChart, SystemDiagram, BeforeAfterSlider, PricingTimeline,
  ComparisonTable, MaintenanceFAQ, ServiceAreaCallout, CTASection, UnfaqSection, LeanLinks, InstallGallery,
} from '@/components/service';
import { MAINTENANCE, SERVICES, UAQ_SHARED } from '@/lib/services';
import { PRICING, TAX_NOTE, flagshipPrice } from '@/lib/pricing';

type Props = { params: { slug: string } };
const find = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));

export function generateMetadata({ params }: Props): Metadata {
  const s = find(params.slug);
  if (!s) return {};
  const title = s.kind === 'flagship' ? `${s.name} | from ${flagshipPrice} ${TAX_NOTE} | US Water Pros` : `${s.name} | US Water Pros`;
  return { title, description: s.summary, alternates: { canonical: `/services/${s.slug}` }, openGraph: { title, description: s.summary } };
}

export default function ServicePage({ params }: Props) {
  const s = find(params.slug);
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
    <main>
      <ServiceHero s={s} />
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-10 md:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-14">
          <BuyerDecisionTree s={s} />
          <QuizCta compact service={s.slug} />
          <ContaminationChart s={s} />
          <SystemDiagram s={s} />
          <BeforeAfterSlider s={s} />
          <PricingTimeline s={s} />
          <InstallGallery s={s} />
        </div>
        <aside id="quote" className="[@media(min-width:768px)_and_(min-height:900px)]:sticky top-24 self-start scroll-mt-24"><LeadForm service={s.slug} /></aside>
      </div>
      {s.kind === 'flagship' && <ComparisonTable s={s} />}
      {!s.lean && <MaintenanceFAQ />}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2>Frequently Asked Questions</h2>
        <div className="mt-6 md:grid md:grid-cols-2 md:items-start md:[&>details:nth-child(odd)]:pr-8 md:[&>details:nth-child(even)]:pl-8 md:[&>details:nth-child(even)]:border-l md:[&>details:nth-child(even)]:border-l-black/10">
        {(s.lean ? s.faqs : s.faqs.concat(faqs.slice(s.faqs.length, s.faqs.length + 4))).map(([q, a]) => (
          <details key={q} className="border-b border-black/10 py-3">
            <summary className="cursor-pointer min-h-12 flex items-center"><h3 className="text-lg !font-sans !tracking-normal">{q}</h3></summary>
            <p className="pb-2">{a}</p>
          </details>
        ))}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </section>
      <FilterFinder />
      <UnfaqSection s={s} />
      {s.lean ? <LeanLinks /> : <ServiceAreaCallout />}
      <CTASection />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl">Also interested in</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {s.related.map((r) => { const x = find(r)!; return <Link key={r} href={`/services/${r}`} className="lowercase min-h-12 inline-flex items-center rounded-full bg-white border border-black/10 shadow-[0_2px_6px_rgba(0,0,0,.08)] px-5 font-semibold text-ink hover:bg-navy hover:text-white">{x.name}</Link>; })}
          <Link href="/locations/pierce-county" className="min-h-12 inline-flex items-center rounded-full bg-ice px-5 font-semibold text-ink">Pierce County water guide</Link>
          <Link href="/locations/kitsap-county" className="min-h-12 inline-flex items-center rounded-full bg-ice px-5 font-semibold text-ink">Kitsap County water guide</Link>
        </div>
      </section>
    </main>
  );
}
