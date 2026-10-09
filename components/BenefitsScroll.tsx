import Icon from './Icon';

const BENEFITS: [string, string][] = [
  ['drop', 'No chlorine taste or smell'], ['shield', 'Protects pipes & appliances'], ['layers', 'Filters sediment & rust'],
  ['house', 'Clean water at every tap'], ['badge', 'Softer skin & hair'], ['check', 'Less spotting & buildup'],
  ['clock', 'Install in about a day'], ['flask', 'Peace of mind for your family'],
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
