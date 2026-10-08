import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import QuizCta from '@/components/QuizCta';
import LeadForm from '@/components/LeadForm';
import {
  ServiceHero, BuyerDecisionTree, ContaminationChart, SystemDiagram, BeforeAfterSlider, PricingTimeline,
  ComparisonTable, MaintenanceFAQ, ServiceAreaCallout, CTASection,
} from '@/components/service';
import { MAINTENANCE, PRICE, SERVICES } from '@/lib/services';

type Props = { params: { slug: string } };
const find = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));

export function generateMetadata({ params }: Props): Metadata {
  const s = find(params.slug);
  if (!s) return {};
  const title = `${s.name} | Fixed $2,700 | US Water Pros`;
  return { title, description: s.summary, alternates: { canonical: `/services/${s.slug}` }, openGraph: { title, description: s.summary } };
}

export default function ServicePage({ params }: Props) {
  const s = find(params.slug);
  if (!s) notFound();
  const faqs: [string, string][] = [
    ...s.faqs,
    ['What’s the installation process like?', 'Our technician arrives, shuts off your water for about 4 hours, installs the system, pressure tests it and makes sure everything flows correctly. You are back to normal water use that day.'],
    ['What warranty do you offer?', 'A 1-year warranty on all equipment, plus our satisfaction guarantee: if you are not happy, we will adjust or replace.'],
    ['Can you service my existing system?', 'Yes. We can maintain or upgrade any water system. We assess it during your free consultation.'],
    ['Do you serve my area?', 'Yes. We serve Tacoma, Puyallup, Bremerton, Port Orchard and surrounding areas.'],
    ...MAINTENANCE,
  ];
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', name: s.name, description: s.summary,
        provider: { '@type': 'LocalBusiness', name: 'US Water Pros', telephone: '+1-253-777-0901', areaServed: ['Tacoma, WA', 'Puyallup, WA', 'Bremerton, WA', 'Port Orchard, WA'] },
        offers: { '@type': 'Offer', price: PRICE.replace(/[^0-9]/g, ''), priceCurrency: 'USD' },
        availableChannel: { '@type': 'ServiceChannel', serviceUrl: `https://uswaterpros.com/services/${s.slug}` } },
      { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    ],
  };
  return (
    <main>
      <ServiceHero s={s} />
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-14">
          <BuyerDecisionTree s={s} />
          <QuizCta compact />
          <ContaminationChart s={s} />
          <SystemDiagram s={s} />
          <BeforeAfterSlider s={s} />
          <PricingTimeline s={s} />
        </div>
        <aside id="quote" className="md:sticky md:top-4 self-start scroll-mt-4"><LeadForm service={s.slug} /></aside>
      </div>
      <ComparisonTable s={s} />
      <MaintenanceFAQ />
      <section className="mx-auto max-w-3xl px-4 pb-12">
        <h2>Frequently Asked Questions</h2>
        {s.faqs.concat(faqs.slice(s.faqs.length, s.faqs.length + 4)).map(([q, a]) => (
          <details key={q} className="border-b border-black/10 py-3">
            <summary className="cursor-pointer min-h-12 flex items-center"><h3 className="text-lg !font-sans !tracking-normal">{q}</h3></summary>
            <p className="pb-2">{a}</p>
          </details>
        ))}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </section>
      <ServiceAreaCallout />
      <CTASection />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl">Also interested in</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {s.related.map((r) => { const x = find(r)!; return <Link key={r} href={`/services/${r}`} className="lowercase min-h-12 inline-flex items-center rounded-full bg-white border border-black/10 shadow-[0_2px_6px_rgba(0,0,0,.08)] px-5 font-semibold text-navy hover:bg-navy hover:text-white">{x.name}</Link>; })}
          <Link href="/locations/pierce-county" className="lowercase min-h-12 inline-flex items-center rounded-full bg-ice px-5 font-semibold text-navy">Pierce County water guide</Link>
          <Link href="/locations/kitsap-county" className="lowercase min-h-12 inline-flex items-center rounded-full bg-ice px-5 font-semibold text-navy">Kitsap County water guide</Link>
        </div>
      </section>
    </main>
  );
}
