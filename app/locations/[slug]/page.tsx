import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import LeadForm from '@/components/LeadForm';
import ServiceCard from '@/components/ServiceCard';
import StickyBottomCTA from '@/components/StickyBottomCTA';
import { LOCATIONS } from '@/lib/locations';
import { SERVICES } from '@/lib/services';

type Props = { params: { slug: string } };
const find = (slug: string) => LOCATIONS.find((l) => l.slug === slug);

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
  return (
    <main>
      <section className="bg-surge">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-navy font-semibold">{l.name}, {l.state}</p>
            <h1 className="!text-white mt-2">Better water for {l.name} homes. Compare local pros.</h1>
            <p className="mt-4 text-white md:text-lg">{l.blurb}</p>
            <p className="mt-4 text-navy text-sm font-semibold">Serving {l.cities.join(', ')} and nearby.</p>
          </div>
          <LeadForm service="whole-home-filtration" />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2>Water in {l.name}</h2>
        <ul className="mt-4 list-disc pl-5 max-w-2xl flex flex-col gap-2">{l.facts.map((f) => <li key={f}>{f}</li>)}</ul>
        <p className="mt-4"><Link href="/" className="underline font-semibold text-navy">Get your free ZIP-code water report →</Link></p>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-8 grid gap-6 md:grid-cols-3">
        {SERVICES.map((s) => <ServiceCard key={s.slug} s={s} />)}
      </section>
      <StickyBottomCTA />
    </main>
  );
}
