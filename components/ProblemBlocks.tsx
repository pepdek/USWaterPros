import Image from 'next/image';
import Sources from './Sources';
import type { SourceId } from '@/lib/sources';

function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
      <Image src={src} alt={alt} fill sizes="(min-width: 768px) 45vw, 92vw" className="object-cover" />
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
    ids: ['ewgDb', 'ewgDbUpdate', 'ewgMethod'], img: ['/images/problems/corroded-pipe.jpg', 'Rust-colored water pipe with water pouring out and mineral deposits around the opening'],
  },
  {
    h: 'Our infrastructure is breaking down',
    body: [
      'Much of our drinking water infrastructure is decades old. The American Water Works Association estimates that restoring buried water pipes alone will cost at least $1 trillion over 25 years.',
      'Its 2026 update puts total drinking water infrastructure needs at $2.1 to $2.4 trillion over the next 25 years.',
    ],
    ids: ['awwaBuried', 'awwaBeyond'], img: ['/images/problems/aging-pipes.jpg', 'Two old, rusted pipe ends sticking out of cracked ground and rocks'], imgFirst: true,
  },
  {
    h: 'Our daily toxic cocktail',
    body: [
      'EWG estimates that more than 200 million Americans could have forever chemicals (PFAS) in their tap water.',
      'Potential health impacts of PFAS exposure include reduced fertility, a weakened immune response, and some cancers.',
    ],
    ids: ['acsPfas', 'ncbiFert', 'epaPfas', 'niehsPfas'], img: ['/images/problems/petri-dish.jpg', 'Gloved hands holding a petri dish with colonies growing on it, as in a lab water test'],
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
          <div className={b.imgFirst ? 'md:order-1' : ''}><Photo src={b.img[0]} alt={b.img[1]} /></div>
        </section>
      ))}
    </div>
  );
}
