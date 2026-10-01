import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import LeadForm from '@/components/LeadForm';
import Sources from '@/components/Sources';
import ServiceCard from '@/components/ServiceCard';
import ReportCta from '@/components/ReportCta';
import StickyBottomCTA from '@/components/StickyBottomCTA';
import { CITIES } from '@/lib/cities';
import { LOCATIONS } from '@/lib/locations';
import { SERVICES } from '@/lib/services';

type Props = { params: { slug: string } };
const find = (slug: string) => LOCATIONS.find((l) => l.slug === slug);
const id = (s: string) => s.toLowerCase().replace(/\s+/g, '-');
const CORE = ['whole-home-filtration', 'water-softening', 'well-water-testing', 'reverse-osmosis'];

export const generateStaticParams = () => LOCATIONS.map((l) => ({ slug: l.slug }));

export function generateMetadata({ params }: Props): Metadata {
  const l = find(params.slug);
  if (!l) return {};
  const title = `Water Treatment in ${l.name}, ${l.state} | US Water Pros`;
  return { title, description: l.blurb, openGraph: { title, description: l.blurb } };
}

export default function LocationPage({ params }: Props) {
  const l = find(params.slug);
  if (!l) notFound();
  const schema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: l.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  return (
    <main>
      <section className="bg-surge">
        <div id="quote" className="mx-auto max-w-6xl px-4 py-10 md:py-16 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-navy font-semibold">{l.name}, {l.state}</p>
            <h1 className="!text-white mt-2">The {l.adj} Water Filtration &amp; Treatment Experts In {l.name}, {l.state}</h1>
            <p className="mt-4 text-white md:text-lg">{l.blurb}</p>
            <p className="mt-4 text-navy text-sm font-semibold">Serving {l.cities.map((c) => c[0]).join(', ')} and nearby.</p>
          </div>
          <LeadForm service="whole-home-filtration" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 flex flex-col gap-4">
        <h2>Water Challenges Unique to {l.name}</h2>
        {l.challenges.map((p) => <p key={p}>{p}</p>)}
        <h3 className="text-2xl mt-4">Testing and local guidance</h3>
        <p>{l.testing}</p>
        <Sources ids={l.cite} />
      </section>

      <div className="bg-ice py-12">
        <section className="mx-auto max-w-6xl px-4">
          <h2 className="text-center">Water Treatment Options for Your Home</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.filter((s) => CORE.includes(s.slug)).map((s) => <ServiceCard key={s.slug} s={s} />)}
          </div>
          <p className="mt-8 max-w-3xl mx-auto">{l.solutions}</p>
        </section>
      </div>

      <section className="mx-auto max-w-3xl px-4 py-12 flex flex-col gap-3">
        <h2>How Working With Us Works</h2>
        <ol className="list-decimal pl-5 flex flex-col gap-2">
          <li>Tell us about your home and water concerns. It takes about 30 seconds.</li>
          <li>We review your area’s water and recommend the right system.</li>
          <li>We explain your options clearly, with no pressure and no obligation.</li>
          <li>You choose, and we install it with care.</li>
        </ol>
      </section>

      <ReportCta />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2>Frequently Asked Questions in {l.name}</h2>
        {l.faqs.map(([q, a]) => (
          <details key={q} className="border-b border-black/10 py-3">
            <summary className="cursor-pointer min-h-12 flex items-center"><h3 className="text-lg !font-sans !tracking-normal">{q}</h3></summary>
            <p className="pb-2">{a}</p>
          </details>
        ))}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </section>

      <div className="bg-ice py-12">
        <section className="mx-auto max-w-6xl px-4">
          <h2 className="text-center">Cities &amp; Communities We Serve in {l.name}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {l.cities.map(([c, note]) => (
              <div key={c} id={id(c)} className="card p-6 scroll-mt-20">
                <h3 className="text-xl">{CITIES.some((x) => x.name === c) ? <a href={`/services/whole-home-water-filtration-${id(c)}`} className="underline">{c}, {l.state}</a> : <>{c}, {l.state}</>}</h3>
                <p className="mt-2">{note}</p>
                <a href="#quote" className="font-semibold text-navy underline min-h-12 inline-flex items-center">Get a free quote in {c} →</a>
              </div>
            ))}
          </div>
        </section>
      </div>
      <StickyBottomCTA />
    </main>
  );
}
