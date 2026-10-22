import { costAnswer } from '@/lib/pricing';
import { STORE } from '@/lib/store';

const COMMON: [string, string][] = [
  ['How much does whole-home filtration cost?', costAnswer()],
  ['How long does installation take?', 'About 4 hours on site. We tell you before you commit if your home needs something different.'],
  ['How often do filters need changing?', `Annual filter replacement, about ${STORE.annualFilters} a year.`],
  ['Will it lower my water pressure?', 'It depends on your home’s plumbing and the size of the system. We confirm the sizing for your home before you commit.'],
];
const UNCOMMON: [string, string][] = [
  ['Does it remove fluoride?', 'Standard carbon and sediment filters generally do not. Reverse osmosis at the kitchen tap is the right tool for that, and every system we install includes one.'],
  ['Can I install one if I rent?', 'You will need your landlord’s okay since it connects to the main line. Point-of-use options like reverse osmosis are easier for renters.'],
  ['Does it work with well water?', 'Yes, but well water usually needs testing first so the system targets what is actually in it.'],
];

function Col({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h3 className="text-2xl mb-3">{title}</h3>
      {items.map(([q, a]) => (
        <details key={q} className="border-b border-black/10 py-3 group">
          <summary className="cursor-pointer font-semibold text-ink min-h-12 flex items-center">{q}</summary>
          <p className="pb-2">{a}</p>
        </details>
      ))}
    </div>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="text-center mb-8">Frequently asked questions</h2>
      <div className="grid gap-10 md:grid-cols-2">
        <Col title="Common questions" items={COMMON} />
        <Col title="Less common questions" items={UNCOMMON} />
      </div>
    </section>
  );
}
