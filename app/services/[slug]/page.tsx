import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Icon from '@/components/Icon';
import LeadForm from '@/components/LeadForm';
import StickyBottomCTA from '@/components/StickyBottomCTA';
import { SERVICES } from '@/lib/services';

type Props = { params: { slug: string } };
const find = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));

export function generateMetadata({ params }: Props): Metadata {
  const s = find(params.slug);
  if (!s) return {};
  const title = `${s.name} | US Water Pros`;
  return { title, description: s.blurb, openGraph: { title, description: s.blurb } };
}

export default function ServicePage({ params }: Props) {
  const s = find(params.slug);
  if (!s) notFound();
  return (
    <main>
      <div className="mx-auto max-w-6xl px-4 py-6 grid gap-8 md:grid-cols-[3fr_2fr]">
        <div>
          {/* ponytail: CSS/SVG hero instead of a photo: zero bytes of image to optimize */}
          <div className="relative rounded-xl overflow-hidden bg-navy h-[40vh] md:h-[420px] flex items-end">
            <div className="absolute inset-0 bg-aqua/30 flex items-center justify-center text-white/30"><Icon name={s.icon} size={200} /></div>
            <div className="relative p-6 text-white">
              <h1 className="!text-white md:!text-[40px]">The {s.adj} {s.name} Experts In Tacoma, WA</h1>
              <p className="md:text-lg">{s.tagline}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-6 max-w-2xl">
            <section><h2>What is {s.name.toLowerCase()}?</h2><p className="mt-2">{s.what}</p></section>
            <div className="text-aqua"><Icon name="drop" size={56} /></div>
            <section><h2>How does it work?</h2><p className="mt-2">{s.how}</p></section>
            <p className="bg-ice text-navy rounded-lg p-4 font-semibold border-l-4 border-coral">{s.stat}</p>
            <section>
              <h2>Benefits</h2>
              <ul className="mt-2 list-disc pl-5">{s.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
            </section>
            <div className="text-aqua"><Icon name={s.icon} size={56} /></div>
            <section><h2>Price range</h2><p className="mt-2">Typically {s.price}. Get a free quote to find your number.</p></section>
          </div>
        </div>

        <aside className="md:sticky md:top-4 self-start flex flex-col gap-6">
          <LeadForm service={s.slug} />
          <ul className="flex flex-col gap-3 text-navy font-semibold">
            <li className="flex gap-3 items-center"><Icon name="shield" size={24} />Licensed, certified technicians</li>
            <li className="flex gap-3 items-center"><Icon name="clock" size={24} />Callback within 1 hour</li>
            <li className="flex gap-3 items-center"><Icon name="badge" size={24} />Free quotes, no obligation</li>
          </ul>
          <div className="flex gap-2 text-xs font-semibold text-navy">
            <span className="lowercase bg-ice rounded-full px-3 py-2">Better Business Bureau</span>
            <span className="lowercase bg-ice rounded-full px-3 py-2">Certified Contractors</span>
          </div>
        </aside>
      </div>
      <StickyBottomCTA />
    </main>
  );
}
