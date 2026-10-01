import Sources from './Sources';
import type { SourceId } from '@/lib/sources';

// Wording tracks what the cited sources support. Edit text and sources together.
const RISKS: [string, string, SourceId[]][] = [
  ['Cancer', 'EWG estimates that 22 carcinogens commonly found in US tap water could together contribute to over 100,000 lifetime cancer cases. Cancers linked to tap water contaminants include bladder, liver, kidney, colorectal and ovarian.', ['ewgRoundup', 'ewgMixtures']],
  ['Fertility Issues', 'EWG’s Tap Water Database identifies 38 contaminants found in US tap water that are linked to fertility problems. Exposure to some water contaminants has also been associated with adverse pregnancy outcomes.', ['ewgDb', 'ncbiFert']],
  ['Child Development', 'Tap water contaminants are especially harmful to children during developmental years. Even low levels of exposure to contaminants such as lead can affect the developing nervous system, including IQ and learning.', ['ewgKids', 'epaLead']],
  ['Hormone Disruption', 'Contaminants found in tap water, including pesticides, forever chemicals (PFAS) and pharmaceuticals, can disrupt hormone function. EWG’s database shows atrazine, a herbicide, in the tap water of nearly 30 million Americans.', ['niehs', 'ewgAtrazine']],
  ['Cosmetic Issues', 'Most US public water systems disinfect with chlorine or chloramine. Research links chlorine in water to a weaker skin barrier, dry skin and more eczema, and chlorinated water can leave hair dry and dull.', ['epaDbp', 'jaci']],
  ['Organ Complications', 'Many contaminants found in US tap water can harm vital organs, including the kidneys, liver, nervous system and cardiovascular system. Children are particularly vulnerable.', ['pmcOrgans', 'ewgDb']],
];

export default function Risks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="text-center">The Risks</h2>
      <p className="text-center mt-2">The effects of unfiltered tap water can include the following:</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {RISKS.map(([t, d, ids]) => (
          <div key={t} className="card p-6 border-t-4 border-coral flex flex-col gap-2">
            <h3 className="text-xl">{t}</h3>
            <p>{d}</p>
            <Sources ids={ids} className="mt-auto pt-2" />
          </div>
        ))}
      </div>
      <Sources ids={['ewgDbUpdate', 'ewgMethod', 'nrdc']} className="mt-6 text-center" />
    </section>
  );
}
