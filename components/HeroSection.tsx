import Image from 'next/image';
import HeroHeadline from './HeroHeadline';
import StatStrip from './store/StatStrip';
import WizardButton from './store/WizardButton';

// One action: Get Instant Price. Headline, a short line, the button, four numbers, and a real finished install.
export default function HeroSection() {
  return (
    <section data-track-source="hero" className="bg-surge">
      <div id="quote" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-12 md:py-20 grid gap-10 md:gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="inline-block rounded-md bg-white/15 px-3 py-1.5 font-mono text-[12px] font-medium uppercase tracking-[.14em] !text-white !py-1.5">Pierce County, WA · Whole-home water filtration</p>
          <HeroHeadline />
          <p className="!text-white mt-5 md:text-lg font-light">Whole-house water filtration with the price up front. Enter your ZIP, see the systems that fit your water, and book your install online. Handled by licensed local plumbers.</p>
          <div className="mt-8"><WizardButton className="btn btn-cta">Get Instant Price →</WizardButton></div>
          <StatStrip />
        </div>
        <div className="relative aspect-[4/5] md:aspect-[3/4] max-h-[620px] w-full rounded-2xl overflow-hidden shadow-xl">
          <Image src="/images/installs/softener-carbon-garage.jpg" alt="A finished whole-home water system: black filter tank with digital control head and a brine tank, installed in a garage" fill priority sizes="(min-width: 768px) 45vw, 92vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
