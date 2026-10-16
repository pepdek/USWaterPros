import type { Metadata } from 'next';
import { Hero, LegalIdeal, PreEighty, HowItWorks, Includes, FaqSection, FooterCta, InternalLinks } from '@/components/cro/Sections';
import PriceStrip from '@/components/cro/PriceStrip';
import ProofSlot from '@/components/cro/ProofSlot';
import { CRO_FAQ } from '@/lib/croFaq';
import { SITE } from '@/lib/site';
import { localBusiness } from '@/lib/schema';

export const metadata: Metadata = {
  title: `Whole-Home Water Filtration in Tacoma, ${SITE.priceInstalled} Installed | US Water Pros`,
  description: `Whole-home water filtration for Tacoma homes. Softening, carbon filtration, and drinking-water RO for ${SITE.priceInstalled} installed. Fixed price, licensed plumber.`,
  alternates: { canonical: '/' },
};

export default function Home() {
  return (
    <main>
      <Hero
        eyebrow="Tacoma, WA · Whole-Home Water Filtration"
        h1={`Whole-Home Water Filtration for Tacoma Homes. ${SITE.priceInstalled} Installed.`}
        sub="One system softens your water, filters chlorine and sediment at every tap, and adds drinking-water reverse osmosis at the kitchen. We coordinate a licensed plumber, handle every detail, and stay with you until the system is tested."
      />
      <PriceStrip />
      <LegalIdeal />
      <PreEighty />
      <HowItWorks />
      <Includes />
      <ProofSlot />
      <FaqSection items={CRO_FAQ} />
      <FooterCta />
      <InternalLinks />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness()) }} />
    </main>
  );
}
