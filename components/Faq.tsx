import { costAnswer } from '@/lib/pricing';

const COMMON: [string, string][] = [
  ['How much does whole-home filtration cost?', costAnswer()],
  ['How long does installation take?', 'Typically about a day. Our team will confirm after a quick look at your plumbing.'],
  ['How often do filters need changing?', 'It depends on the system and your water. Many cartridges last several months to a few years, and our team will set a schedule.'],
  ['Will it lower my water pressure?', 'A properly sized system should not noticeably reduce pressure. Our team sizes it to your home.'],
];
const UNCOMMON: [string, string][] = [
  ['Does it remove fluoride?', 'Standard carbon and sediment filters generally do not. Reverse osmosis at the kitchen tap is the usual add-on for that.'],
  ['Can I install one if I rent?', 'You will need your landlord’s okay since it connects to the main line. Point-of-use options like reverse osmosis are easier for renters.'],
  ['Does it work with well water?', 'Yes, but well water usually needs testing first so the system targets what is actually in it.'],
  ['Will it help my home’s resale value?', 'Buyers like clean water and protected appliances. A documented, professionally installed system is a plus on a listing.'],
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
