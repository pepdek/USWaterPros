import LeadForm from './LeadForm';

export default function HeroSection() {
  return (
    <section className="bg-surge">
      <div id="quote" className="mx-auto max-w-6xl px-4 py-10 md:py-20 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-navy font-semibold">Tacoma, WA Water Filtration &amp; Treatment</p>
          <h1 className="!text-white mt-2">Whole-Home Water Filtration Services for Washington Families</h1>
          <p className="mt-4 text-white md:text-lg">Remove chlorine, sediment, and hard water damage. Free water report, professional installation, 100% satisfaction guarantee.</p>
        </div>
        <LeadForm service="whole-home-water-filtration" />
      </div>
    </section>
  );
}
