import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import StickyBottomCTA from '@/components/StickyBottomCTA';
import BenefitsScroll from '@/components/BenefitsScroll';
import ProblemBlocks from '@/components/ProblemBlocks';
import Risks from '@/components/Risks';
import ReportCta from '@/components/ReportCta';
import QuizCta from '@/components/QuizCta';
import FilterFinder from '@/components/FilterFinder';
import Faq from '@/components/Faq';
import { LOCATIONS } from '@/lib/locations';
import { PILLS, SERVICES } from '@/lib/services';
import type { Metadata } from 'next';
import ProductCards from '@/components/store/ProductCards';
import PlatformBanner from '@/components/store/PlatformBanner';
import { TIERS, formatUSD } from '@/lib/pricing';
import { STORE } from '@/lib/store';
import Link from 'next/link';
import Image from 'next/image';

const STEPS = [
  ['Water Quality Review', 'We discuss your home’s water source, concerns, and goals to better understand what type of filtration or treatment solution may be right for you.'],
  ['Clear Recommendations', 'Our team explains your options clearly, answers your questions, and recommends a system based on your water needs, home setup, and budget.'],
  ['Professional Installation', 'Once you choose the right solution, we install your system with care, test performance, and make sure you understand how everything works.'],
];

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
      <BenefitsScroll />
      <ProblemBlocks />
      <div className="bg-ice py-16 md:py-20"><section id="services" className="mx-auto max-w-6xl px-4 scroll-mt-24"><h2 className="text-center">Our Solution</h2><p className="text-center mt-2">We created US Water Pros.</p><div className="mt-8 grid gap-8 md:gap-10 md:grid-cols-3">
        {SERVICES.map((s) => <ServiceCard key={s.slug} s={s} />)}
      </div></section></div>
      <Risks />
      <QuizCta />
      <section id="process" className="mx-auto max-w-6xl px-4 py-10 grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h2>A Simple, No-Pressure Water Treatment Experience</h2>
          <p className="mt-3">We make the process easy from start to finish. First, we review your water concerns, then recommend the right solution, and finally install your system with care so you can enjoy better water with confidence.</p>
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
      <ReportCta />
      <nav className="mx-auto max-w-6xl px-4 py-6 flex gap-2 overflow-x-auto md:flex-wrap md:justify-center" aria-label="Services">
        {PILLS.map((p, i) => (
          <Link key={p.label} href={p.href} className={`shrink-0 min-h-12 inline-flex items-center rounded-[10px] px-5 font-semibold text-sm lowercase bg-white border border-black/10 shadow-[0_2px_6px_rgba(0,0,0,.08)] text-ink hover:bg-navy hover:text-white focus:bg-navy focus:text-white ${i === 0 ? '!bg-navy !text-white' : ''}`}>{p.label}</Link>
        ))}
      </nav>
      <Faq />
      <StickyBottomCTA />
    </main>
  );
}
