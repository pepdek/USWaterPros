import Image from 'next/image';
import HeroHeadline from './HeroHeadline';
import Seal from './Seal';
import StatStrip from './store/StatStrip';
import WizardButton from './store/WizardButton';
import { STORE } from '@/lib/store';

// One action: Get Instant Price. The brand line, a big headline, a quiet paragraph, the button, four numbers, and a real finished install
// with a round seal and a frosted price tag on it.
export default function HeroSection() {
  return (
    <section data-track-source="hero" className="orbs overflow-hidden">
      <div id="quote" className="scroll-mt-28 mx-auto max-w-6xl px-4 pt-8 pb-20 md:pt-14 md:pb-28 grid gap-14 lg:grid-cols-[1.18fr_.82fr] lg:items-center">
        <div>
          <p className="eyebrow !py-0">America&apos;s Water Professionals</p>
          <HeroHeadline />
          <p className="mt-6 max-w-xl text-[19px] md:text-[21px] leading-[1.5] text-[#46505e]">Whole-house water filtration with the price up front. Enter your ZIP, see the systems that fit your water, and book your install online. Handled by licensed local plumbers in Pierce County, WA.</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <WizardButton className="btn btn-cta !min-h-[58px] !px-9 !text-[19px]">Get Instant Price</WizardButton>
            <a href="#process" className="inline-flex min-h-11 items-center gap-1.5 text-[17px] font-semibold text-blue hover:underline">See how it works <span aria-hidden>›</span></a>
          </div>
          <StatStrip />
        </div>
        <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <div className="relative aspect-[4/5] max-h-[640px] w-full overflow-hidden rounded-[36px] shadow-[0_50px_90px_-40px_rgba(11,37,69,.6)] ring-4 ring-white">
            <Image src="/images/installs/softener-carbon-garage.jpg" alt="A finished whole-home water system: black filter tank with digital control head and a brine tank, installed in a garage" fill priority sizes="(min-width: 1024px) 44vw, 92vw" className="object-cover" />
          </div>
          <Seal className="absolute -top-8 -left-3 sm:-left-8 h-28 w-28 sm:h-32 sm:w-32 -rotate-[10deg] drop-shadow-[0_14px_20px_rgba(11,37,69,.35)]" />
          <div className="glass absolute -bottom-7 left-4 right-4 sm:left-auto sm:right-6 sm:w-[300px] !rounded-[24px] p-5">
            <p className="!p-0 font-mono text-[13px] font-semibold uppercase tracking-[.16em] text-[#5b6472]">Installed, tax included</p>
            <p className="!p-0 mt-1 font-mono text-[52px] font-bold leading-none text-ink">{STORE.from}<span className="font-sans text-[16px] font-medium tracking-normal text-[#5b6472]"> and up</span></p>
            <p className="!p-0 mt-2 text-[13px] text-[#5b6472]">By a licensed local plumber. 100% refundable.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
