import Image from 'next/image';
import HeroHeadline from './HeroHeadline';
import StatStrip from './store/StatStrip';
import WizardButton from './store/WizardButton';
import { STORE } from '@/lib/store';

// One action: Get Instant Price. Big headline, a quiet line, the button, four numbers, and a real finished install with a glass price tag floating on it.
export default function HeroSection() {
  return (
    <section data-track-source="hero" className="orbs overflow-hidden">
      <div id="quote" className="scroll-mt-28 mx-auto max-w-6xl px-4 pt-8 pb-16 md:pt-14 md:pb-24 grid gap-12 lg:grid-cols-[1.22fr_.78fr] lg:items-center">
        <div>
          <p className="glass !rounded-full inline-flex items-center gap-2 !py-2 px-4 text-[13px] font-medium text-ink/80 !max-w-none"><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-cta" />Pierce County, WA · Whole-home water filtration</p>
          <HeroHeadline />
          <p className="mt-6 max-w-xl text-[19px] md:text-[21px] leading-[1.45] font-normal text-[#6e6e73]">Whole-house water filtration with the price up front. Enter your ZIP, see the systems that fit your water, and book your install online. Handled by licensed local plumbers.</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <WizardButton className="btn btn-cta !min-h-[56px] !px-8 !text-[18px]">Get Instant Price</WizardButton>
            <a href="#process" className="inline-flex min-h-11 items-center gap-1.5 text-[17px] font-medium text-blue hover:underline">See how it works <span aria-hidden>›</span></a>
          </div>
          <StatStrip />
        </div>
        <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <div className="relative aspect-[4/5] max-h-[640px] w-full overflow-hidden rounded-[36px] shadow-[0_50px_90px_-40px_rgba(14,33,43,.55)]">
            <Image src="/images/installs/softener-carbon-garage.jpg" alt="A finished whole-home water system: black filter tank with digital control head and a brine tank, installed in a garage" fill priority sizes="(min-width: 1024px) 44vw, 92vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0 rounded-[36px] ring-1 ring-inset ring-black/10" />
          </div>
          <div className="glass absolute -bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-[300px] !rounded-[24px] p-5">
            <p className="!p-0 text-[12px] font-medium tracking-[.02em] text-[#6e6e73]">Installed by a licensed local plumber</p>
            <p className="!p-0 mt-1 text-[34px] font-semibold tracking-[-0.04em] leading-none text-ink">{STORE.from}<span className="text-[18px] font-medium tracking-normal text-[#6e6e73]"> and up</span></p>
            <p className="!p-0 mt-2 text-[13px] text-[#6e6e73]">Tax included. 100% refundable.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
