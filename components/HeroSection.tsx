import Image from 'next/image';
import InstantPriceBox from './store/InstantPriceBox';
import { PRICING, TAX_NOTE } from '@/lib/pricing';
import { formatUSD } from '@/lib/pricing';

// Price headline plus a ZIP box that opens the instant-price wizard.
export default function HeroSection() {
  return (
    <section data-track-source="hero" className="bg-surge">
      <div id="quote" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-14 md:py-20 grid gap-8 md:gap-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="!text-white font-semibold text-sm">Pierce County, WA · Whole-home water filtration</p>
          <h1 className="!text-white mt-2">Whole-Home Water System. {formatUSD(PRICING.flagship.displayPrice)} Installed.</h1>
          <p className="!text-white mt-4 md:text-lg">See your price in under a minute. A licensed local plumber installs it in about 4 hours. {TAX_NOTE[0].toUpperCase() + TAX_NOTE.slice(1)}. 1-year warranty.</p>
          <div className="mt-6 hidden md:block relative aspect-[16/10] rounded-xl overflow-hidden bg-white/10">
            <Image src="/images/services/whole-home-water-filtration.webp" alt="Whole-home water filtration system with carbon filter tank and brine tank" fill priority sizes="45vw" className="object-contain p-4" />
          </div>
        </div>
        <InstantPriceBox heading="Get your instant price" />
      </div>
    </section>
  );
}
