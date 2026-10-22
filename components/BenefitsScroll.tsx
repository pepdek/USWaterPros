import Icon from './Icon';

const BENEFITS: [string, string][] = [
  ['drop', 'Less chlorine taste & smell'], ['badge', 'One fixed, installed price'], ['shield', 'Licensed local plumbers'],
  ['clock', 'Installed in about 4 hours'], ['check', '100% refundable'], ['layers', 'Filters sediment & rust'],
];

// Two copies + translateX(-50%) = seamless loop.
export default function BenefitsScroll() {
  return (
    <section className="bg-navy text-white py-5 overflow-hidden" aria-label="Whole-home filtration benefits">
      <div className="marquee gap-4">
        {[...BENEFITS, ...BENEFITS].map(([icon, t], i) => (
          <span key={i} aria-hidden={i >= BENEFITS.length} className="flex items-center gap-2 mr-10 whitespace-nowrap font-semibold">
            <span className="text-cyan"><Icon name={icon} size={24} /></span>{t}
          </span>
        ))}
      </div>
    </section>
  );
}
