import Icon from './Icon';

const BENEFITS: [string, string][] = [
  ['drop', 'Less chlorine taste & smell'], ['badge', 'One fixed, installed price'], ['shield', 'Licensed local plumbers'],
  ['clock', 'Installed in about 4 hours'], ['check', '100% refundable'], ['layers', 'Filters sediment & rust'],
];

// Two copies + translateX(-50%) = seamless loop.
export default function BenefitsScroll() {
  return (
    <section className="bg-white border-y border-black/[.06] text-ink py-5 overflow-hidden marquee-mask" aria-label="Whole-home filtration benefits">
      <div className="marquee gap-4">
        {[...BENEFITS, ...BENEFITS].map(([icon, t], i) => (
          <span key={i} aria-hidden={i >= BENEFITS.length} className="flex items-center gap-2 mr-10 whitespace-nowrap font-medium text-[16px] tracking-[-0.01em]">
            <span className="text-navy"><Icon name={icon} size={28} /></span>{t}
          </span>
        ))}
      </div>
    </section>
  );
}
