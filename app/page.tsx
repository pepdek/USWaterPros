import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import StickyBottomCTA from '@/components/StickyBottomCTA';
import BenefitsScroll from '@/components/BenefitsScroll';
import QuizCta from '@/components/QuizCta';
import FilterFinder from '@/components/FilterFinder';
import Faq from '@/components/Faq';
import { LOCATIONS } from '@/lib/locations';
import { PILLS, SERVICES } from '@/lib/services';
import type { Metadata } from 'next';
import ProductCards from '@/components/store/ProductCards';
import PlatformBanner from '@/components/store/PlatformBanner';
import WhyUs from '@/components/store/WhyUs';
import CalmProblem from '@/components/store/CalmProblem';
import { TIERS, formatUSD } from '@/lib/pricing';
import { STORE } from '@/lib/store';
import Link from 'next/link';
import Image from 'next/image';

const STEPS = [
  ['Pick your system', 'Enter your ZIP, see the exact price for your home, and choose the system that fits your water.'],
  ['Choose your day and pay', `Pick an install day and pay up front by card. Every order is ${STORE.refund.toLowerCase()} ${STORE.confirm}`],
  ['A licensed local plumber installs it', 'About 4 hours on site. The plumber tests it before they leave and walks you through how it works.'],
];

const MAIN = ['whole-home-water-filtration', 'reverse-osmosis-systems', 'carbon-filtration', 'city-water-treatment'];
const OTHER: [string, string][] = [['well-water-treatment', 'Private well? It starts with a water test.'], ['water-softening-systems', 'For homes where the water is hard.']];
const flagship = TIERS.find((t) => t.popular)!;
export const metadata: Metadata = {
  title: `Whole-Home Water System, ${formatUSD(flagship.price)} Installed | US Water Pros`,
  description: `Get your instant price for a whole-home water system installed by a licensed local plumber. Three systems, ${STORE.from} to ${STORE.to}, tax included. Pierce County, WA.`,
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PlatformBanner />
      <section id="pricing" className="bg-[#fafbfa] scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="inline-block rounded-md bg-black/[.05] px-3 py-1.5 font-mono text-[12px] font-medium uppercase tracking-[.14em] text-[#3f4a4f]">Pick your system</p>
          <h2 className="mt-4 max-w-2xl">Three systems. One installed price each.</h2>
          <p className="mt-3 mb-10 max-w-2xl font-light text-[#3f4a4f]">Installed by a licensed local plumber. {STORE.refund} <Link href="/pricing" className="underline font-medium text-ink">See what&apos;s included</Link></p>
          <ProductCards variant="teaser" />
        </div>
      </section>
      <WhyUs />
      <BenefitsScroll />
      <CalmProblem />
      <div className="bg-ice py-16 md:py-20"><section id="services" className="mx-auto max-w-6xl px-4 scroll-mt-24"><h2 className="text-center">Our Solution</h2><p className="text-center mt-2">We created US Water Pros.</p><div className="mt-8 grid gap-8 md:gap-10 md:grid-cols-2 xl:grid-cols-4">
        {MAIN.map((slug) => SERVICES.find((s) => s.slug === slug)!).map((s) => <ServiceCard key={s.slug} s={s} />)}
      </div>
      <div className="mt-12">
        <p className="font-mono text-[12px] font-medium uppercase tracking-[.14em] text-[#3f4a4f] !py-0">Other situations</p>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {OTHER.map(([slug, blurb]) => { const s = SERVICES.find((x) => x.slug === slug)!; return (
            <li key={slug}><Link href={`/services/${slug}`} className="flex items-center justify-between gap-4 rounded-2xl border border-black/[.08] bg-white p-5 hover:border-teal"><span><b className="text-ink">{s.name}</b><span className="block font-light text-[#3f4a4f] text-[15px]">{blurb}</span></span><span aria-hidden>→</span></Link></li>
          ); })}
        </ul>
      </div></section></div>
      <QuizCta />
      <section id="process" className="mx-auto max-w-6xl px-4 py-10 grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h2>How it works</h2>
          <p className="mt-3">Three steps. You see the price before anyone comes to your door.</p>
          <ol className="mt-8 flex flex-col gap-8 md:gap-10">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="shrink-0 w-10 h-10 rounded-full bg-aqua text-ink font-bold flex items-center justify-center">{i + 1}</span>
                <div><h3 className="text-xl">{t}</h3><p className="mt-1">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
        {/* placeholder: swap for a real image */}
        <div className="relative rounded-xl overflow-hidden aspect-[3/4] md:aspect-auto md:min-h-[480px] md:h-full"><Image src="/images/installs/softener-carbon-garage.jpg" alt="Black filter tank with digital control head and brine tank installed in a garage" fill sizes="(min-width: 768px) 45vw, 92vw" className="object-cover" /></div>
      </section>
      <FilterFinder />
      <section id="areas" className="mx-auto max-w-6xl px-4 py-10 text-center">
        <h2>Serving Western Washington</h2>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {LOCATIONS.map((l) => <Link key={l.slug} href={`/locations/${l.slug}`} className="min-h-12 inline-flex items-center rounded-[10px] bg-white border border-black/10 shadow-[0_2px_6px_rgba(0,0,0,.08)] px-5 font-semibold text-ink hover:bg-navy hover:text-white">{l.name}</Link>)}
        </div>
      </section>
      <nav className="mx-auto max-w-6xl px-4 py-6 flex gap-2 overflow-x-auto md:flex-wrap md:justify-center" aria-label="Services">
        {PILLS.map((p, i) => (
          <Link key={p.label} href={p.href} className={`shrink-0 min-h-12 inline-flex items-center rounded-[10px] px-5 font-semibold text-sm lowercase bg-white border border-black/10 shadow-[0_2px_6px_rgba(0,0,0,.08)] text-ink hover:bg-navy hover:text-white focus:bg-navy focus:text-white ${i === 0 ? '!bg-navy !text-white' : ''}`}>{p.label}</Link>
        ))}
      </nav>
      <Faq />
      <p className="mx-auto max-w-3xl px-4 pt-6 text-center font-sans text-[clamp(1.5rem,1rem+1.6vw,2.2rem)] font-bold tracking-[-0.03em] text-ink !py-0">Turn on the tap and stop thinking about it.</p>
      <p className="text-center text-[14px] font-light text-[#4b5a60] !pt-2">Or keep guessing and buying jugs.</p>
      <StickyBottomCTA />
    </main>
  );
}
