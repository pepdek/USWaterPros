import Icon from './Icon';
import Sources from './Sources';
import type { SourceId } from '@/lib/sources';

// Swap the placeholder for a real <Image> when photos exist (corroded pipes, aging mains, petri dish).
function Placeholder({ label, icon }: { label: string; icon: string }) {
  return (
    <div role="img" aria-label={label} className="rounded-xl bg-ice min-h-[260px] md:min-h-[340px] flex items-center justify-center text-aqua">
      <Icon name={icon} size={96} />
    </div>
  );
}

const BLOCKS: { h: string; body: string[]; ids: SourceId[]; img: [string, string]; imgFirst?: boolean }[] = [
  {
    h: 'Our tap water is contaminated',
    body: [
      'EWG’s analysis found that the tap water of most US utilities contains at least one contaminant above health-based guidelines.',
      'Legal limits are often far weaker than those guidelines. The EPA’s legal limit for arsenic is 10 parts per billion, while EWG’s one-in-a-million cancer-risk guideline is 0.004, which is 2,500 times lower.',
    ],
    ids: ['ewgDb', 'ewgDbUpdate', 'ewgMethod'], img: ['Corroded water pipe', 'building'],
  },
  {
    h: 'Our infrastructure is breaking down',
    body: [
      'Much of our drinking water infrastructure is decades old. The American Water Works Association estimates that restoring buried water pipes alone will cost at least $1 trillion over 25 years.',
      'Its 2026 update puts total drinking water infrastructure needs at $2.1 to $2.4 trillion over the next 25 years.',
    ],
    ids: ['awwaBuried', 'awwaBeyond'], img: ['Aging underground water main', 'layers'], imgFirst: true,
  },
  {
    h: 'Our daily toxic cocktail',
    body: [
      'EWG estimates that more than 200 million Americans could have forever chemicals (PFAS) in their tap water.',
      'Potential health impacts of PFAS exposure include reduced fertility, a weakened immune response, and some cancers.',
    ],
    ids: ['acsPfas', 'ncbiFert', 'epaPfas', 'niehsPfas'], img: ['Petri dish with contaminated water sample', 'flask'],
  },
];

export default function ProblemBlocks() {
  return (
    <div>
      {BLOCKS.map((b) => (
        <section key={b.h} className="mx-auto max-w-6xl px-4 py-10 md:py-10 grid gap-8 md:grid-cols-2 md:items-center">
          <div className={`prose-breaks ${b.imgFirst ? 'md:order-2' : ''}`}>
            <h2>{b.h}</h2>
            {b.body.map((p) => <p key={p} className="mt-3">{p}</p>)}
            <Sources ids={b.ids} className="mt-3" />
          </div>
          <div className={b.imgFirst ? 'md:order-1' : ''}><Placeholder label={b.img[0]} icon={b.img[1]} /></div>
        </section>
      ))}
    </div>
  );
}
