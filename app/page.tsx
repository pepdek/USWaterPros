import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import StickyBottomCTA from '@/components/StickyBottomCTA';
import BenefitsScroll from '@/components/BenefitsScroll';
import Risks from '@/components/Risks';
import ReportCta from '@/components/ReportCta';
import QuizCta from '@/components/QuizCta';
import Faq from '@/components/Faq';
import { LOCATIONS } from '@/lib/locations';
import Icon from '@/components/Icon';
import { PILLS, SERVICES } from '@/lib/services';
import Link from 'next/link';

const STEPS = [
  ['Water Quality Review', 'We discuss your home’s water source, concerns, and goals to better understand what type of filtration or treatment solution may be right for you.'],
  ['Clear Recommendations', 'Our team explains your options clearly, answers your questions, and recommends a system based on your water needs, home setup, and budget.'],
  ['Professional Installation', 'Once you choose the right solution, we install your system with care, test performance, and make sure you understand how everything works.'],
];

export default function Home() {
  return (
    <main>
      <HeroSection />
      <BenefitsScroll />
      <nav className="mx-auto max-w-6xl px-4 py-6 flex gap-2 overflow-x-auto md:flex-wrap md:justify-center" aria-label="Services">
        {PILLS.map((p, i) => (
          <Link key={p.label} href={p.href} className={`shrink-0 min-h-12 inline-flex items-center rounded-full px-5 font-semibold text-sm lowercase bg-white border border-black/10 shadow-[0_2px_6px_rgba(0,0,0,.08)] text-navy hover:bg-navy hover:text-white focus:bg-navy focus:text-white ${i === 0 ? '!bg-navy !text-white' : ''}`}>{p.label}</Link>
        ))}
      </nav>
      <Risks />
      <QuizCta />
      <div className="bg-ice py-10"><section id="services" className="mx-auto max-w-6xl px-4 grid gap-6 md:grid-cols-3">
        {SERVICES.map((s) => <ServiceCard key={s.slug} s={s} />)}
      </section></div>
      <section id="process" className="mx-auto max-w-6xl px-4 py-14 grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h2>A Simple, No-Pressure Water Treatment Experience</h2>
          <p className="mt-3">We make the process easy from start to finish. First, we review your water concerns, then recommend the right solution, and finally install your system with care so you can enjoy better water with confidence.</p>
          <ol className="mt-8 flex flex-col gap-6">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="shrink-0 w-10 h-10 rounded-full bg-aqua text-navy font-bold flex items-center justify-center">{i + 1}</span>
                <div><h3 className="text-xl">{t}</h3><p className="mt-1">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
        {/* placeholder: swap for a real image */}
        <div className="rounded-xl bg-ice min-h-[320px] md:min-h-[480px] flex items-center justify-center text-aqua" role="img" aria-label="Image placeholder"><Icon name="house" size={96} /></div>
      </section>
      <section id="areas" className="mx-auto max-w-6xl px-4 py-8 text-center">
        <h2>Serving Western Washington</h2>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {LOCATIONS.map((l) => <Link key={l.slug} href={`/locations/${l.slug}`} className="min-h-12 inline-flex items-center lowercase rounded-full bg-white border border-black/10 shadow-[0_2px_6px_rgba(0,0,0,.08)] px-5 font-semibold text-navy hover:bg-navy hover:text-white">{l.name}</Link>)}
        </div>
      </section>
      <ReportCta />
      <Faq />
      <StickyBottomCTA />
    </main>
  );
}
