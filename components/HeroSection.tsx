import LeadForm from './LeadForm';

export default function HeroSection() {
  return (
    <section className="bg-surge">
      <div id="quote" className="mx-auto max-w-6xl px-4 py-10 md:py-20 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-navy font-semibold">Tacoma, WA Water Filtration &amp; Treatment</p>
          <h1 className="!text-white mt-2"><span style={{ fontFamily: 'var(--font-big)', color: '#0047CC' }}>Big Filter</span>'s Been Charging $8,000 Since 1936. We Started in '09 at $2,700 and Never Moved.</h1>
          <p className="mt-4 text-white md:text-lg">Book a free, no-obligation consultation. A local water specialist will call you within the hour.</p>
        </div>
        <LeadForm service="whole-home-water-filtration" />
      </div>
    </section>
  );
}
