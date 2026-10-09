import LeadForm from './LeadForm';

export default function HeroSection() {
  return (
    <section data-track-source="hero" className="bg-surge">
      <div id="quote" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-16 md:py-24 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-white font-semibold text-sm">Tacoma, WA Water Filtration &amp; Treatment</p>
          <h1 className="!text-white mt-2">Whole-Home Water Filtration Services for Washington Families</h1>
          <p className="mt-4 text-white md:text-lg">Remove chlorine, sediment, and hard water damage. Free water report, professional installation, 100% satisfaction guarantee.</p>
        </div>
        <LeadForm service="whole-home-water-filtration" />
      </div>
    </section>
  );
}
