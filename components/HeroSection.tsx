import Image from 'next/image';
import InstantPriceBox from './store/InstantPriceBox';
import HeroHeadline from './HeroHeadline';

// Price headline plus a ZIP box that opens the instant-price wizard.
export default function HeroSection() {
  return (
    <section data-track-source="hero" className="bg-surge">
      <div id="quote" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 md:py-20 grid gap-8 md:gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="!text-white font-semibold text-sm">Pierce County, WA · Whole-home water filtration</p>
          <HeroHeadline />
          <p className="!text-white mt-4 md:text-lg">Whole-house water filtration with the price up front. Enter your ZIP, see the systems that fit your water, and book your install online. Handled by licensed local plumbers.</p>
          <div className="mt-6 hidden md:block relative aspect-[16/10] rounded-xl overflow-hidden bg-white/10">
            <Image src="/images/services/whole-home-water-filtration.webp" alt="Whole-home water filtration system with carbon filter tank and brine tank" fill priority sizes="45vw" className="object-contain p-4" />
          </div>
        </div>
        <InstantPriceBox heading="Get your instant price" />
      </div>
    </section>
  );
}
