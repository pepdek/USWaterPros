import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import LeadForm from '@/components/LeadForm';
import ReportCta from '@/components/ReportCta';
import StickyBottomCTA from '@/components/StickyBottomCTA';
import { CITIES, EWG_URL, UPDATED } from '@/lib/cities';
import { PHONE, PHONE_HREF } from '@/lib/constants';
import { LOCATIONS } from '@/lib/locations';

type Props = { params: { city: string } };
const find = (c: string) => CITIES.find((x) => x.slug === c);
const path = (slug: string) => `/services/whole-home-water-filtration-${slug}`;

export const generateStaticParams = () => CITIES.map((c) => ({ city: c.slug }));

export function generateMetadata({ params }: Props): Metadata {
  const c = find(params.city);
  if (!c) return {};
  const title = `Whole-Home Water Filtration Services in ${c.name}, WA`;
  const description = `Professional water filtration installation in ${c.name}, WA. Licensed technicians, same-day quotes. Get your free water quality report today.`;
  return { title, description, alternates: { canonical: path(c.slug) }, openGraph: { title, description } };
}

export default function CityPage({ params }: Props) {
  const c = find(params.city);
  if (!c) notFound();
  const county = LOCATIONS.find((l) => l.slug === c.county)!;
  const h1 = `Whole-Home Water Filtration Services in ${c.name}, WA`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'LocalBusiness', name: `US Water Pros - Water Filtration Services in ${c.name}, WA`, description: `Professional whole-home water filtration services in ${c.name}, WA`,
        telephone: '+1-253-777-0901', url: `https://uswaterpros.com${path(c.slug)}`, priceRange: '$$',
        areaServed: { '@type': 'City', name: `${c.name}, WA` } },
      { '@type': 'FAQPage', mainEntity: c.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      { '@type': 'BreadcrumbList', itemListElement: [['Home', '/'], ['Services', '/#services'], ['Whole-Home Filtration', '/services/whole-home-filtration'], [c.name, path(c.slug)]]
        .map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `https://uswaterpros.com${item}` })) },
    ],
  };
  return (
    <main>
      <section className="bg-surge">
        <div id="quote" className="mx-auto max-w-6xl px-4 py-10 md:py-16 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-navy font-semibold mb-2">
              <Link href="/">Home</Link> › <Link href="/#services">Services</Link> › <Link href="/services/whole-home-filtration">Whole-Home Filtration</Link> › {c.name}
            </nav>
            <h1 className="!text-white">{h1}</h1>
            <p className="mt-4 text-white md:text-lg">{c.headline}</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#report" className="btn btn-aqua">Get My Free Water Report</a>
              <a href="#quote-form" className="btn btn-navy">Schedule Consultation</a>
            </div>
            <p className="mt-4 text-navy text-sm font-semibold">✓ Licensed technicians | ✓ Same-day quotes | ✓ Local since 2009</p>
          </div>
          <div id="quote-form"><LeadForm service="whole-home-filtration" /></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="card p-6 grid gap-4 md:grid-cols-3 !transform-none">
          <div>
            <h2 className="text-xl">{c.name} water at a glance</h2>
            <p className="mt-1 text-sm">Common issues we see:</p>
          </div>
          <ul className="flex flex-wrap gap-2 md:col-span-1 items-start">{c.issues.map((i) => <li key={i} className="lowercase bg-ice rounded-full px-3 py-2 text-sm font-semibold text-navy">{i}</li>)}</ul>
          <div className="flex flex-col gap-1 text-sm font-semibold underline text-navy">
            <a href={EWG_URL} target="_blank" rel="noopener noreferrer">EWG Tap Water Database (look up your ZIP) ↗</a>
            <a href={c.authority[1]} target="_blank" rel="noopener noreferrer">{c.authority[0]} ↗</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 grid gap-8 md:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-4">
          <h2>Why {c.name} Homeowners Choose Whole-Home Filtration</h2>
          {c.paras.map((p) => <p key={p}>{p}</p>)}
        </div>
        <div className="card p-6 self-start !transform-none">
          <h3 className="text-xl">What our system removes</h3>
          <ul className="mt-2 list-disc pl-5">{c.removes.map((r) => <li key={r}>{r}</li>)}</ul>
          <p className="text-xs mt-3">Results depend on your water. We test first.</p>
        </div>
      </section>

      <section className="bg-ice py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center">We Serve {c.name} and Surrounding Areas</h2>
          <iframe title={`Map of ${c.name}, WA`} loading="lazy" className="mt-6 w-full h-72 rounded-xl border-0"
            src={`https://www.google.com/maps?q=${encodeURIComponent(c.name + ', WA')}&output=embed`} />
          <p className="mt-4 text-center text-sm">Serving {c.neighborhoods.join(' · ')}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 grid gap-6 md:grid-cols-3 text-center">
        <div className="card p-6"><h3 className="text-xl">Local since 2009</h3><p className="mt-1">Same price since we started.</p></div>
        <div className="card p-6"><h3 className="text-xl">Licensed technicians</h3><p className="mt-1">Installed with care and tested.</p></div>
        <div className="card p-6"><h3 className="text-xl">Free consultation</h3><p className="mt-1">No obligation, no pressure.</p></div>
      </section>

      <div id="report"><ReportCta /></div>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2>Frequently Asked Questions in {c.name}</h2>
        {c.faqs.map(([q, a]) => (
          <details key={q} className="border-b border-black/10 py-3">
            <summary className="cursor-pointer min-h-12 flex items-center"><h3 className="text-lg !font-sans !tracking-normal">{q}</h3></summary>
            <p className="pb-2">{a}</p>
          </details>
        ))}
        <p className="mt-6 text-sm">More on <Link href={`/locations/${county.slug}`} className="underline font-semibold">water in {county.name}</Link> and our <Link href="/services/whole-home-filtration" className="underline font-semibold">whole-home filtration service</Link>.</p>
        <p className="mt-2 text-xs text-navy/70">Last updated: {new Date(UPDATED).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </section>

      <section className="bg-navy text-white py-12 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="!text-white">Ready to Fix Your Water?</h2>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#report" className="btn btn-aqua">Get Free Water Report</a>
            <a href={PHONE_HREF} className="btn bg-white text-navy">Call {PHONE}</a>
          </div>
          <p className="mt-4 text-sm text-white/80">Licensed technicians · Same-day quotes</p>
        </div>
      </section>
      <StickyBottomCTA />
    </main>
  );
}
