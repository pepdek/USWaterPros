import { SITE } from '@/lib/site';

export default function PriceStrip() {
  return (
    <section aria-label="Price" className="bg-navy text-white">
      <p className="mx-auto max-w-6xl px-4 py-5 !text-white text-center font-semibold">
        {SITE.priceInstalled} {SITE.priceNote}. Softening, carbon filtration, and drinking-water RO. {SITE.warrantyYears}-year warranty. Installed in {SITE.installHours} hours by a licensed plumber.
      </p>
    </section>
  );
}
