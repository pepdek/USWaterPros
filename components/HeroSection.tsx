import LeadForm from './LeadForm';

export default function HeroSection() {
  return (
    <section className="bg-surge">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-20 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-navy font-semibold">Whole-Home Water Filtration</p>
          <h1 className="!text-white mt-2">The Dedicated Water Filtration &amp; Treatment Experts In Tacoma, WA</h1>
          <p className="mt-4 text-white md:text-lg">Get a free water quality report for your ZIP code in 30 seconds.</p>
        </div>
        <LeadForm service="whole-home-filtration" />
      </div>
    </section>
  );
}
