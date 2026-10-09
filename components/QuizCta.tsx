import Link from 'next/link';

// Service-specific headlines; no slug = the generic home-page copy.
const HEADLINES: Record<string, string> = {
  'whole-home-water-filtration': 'Join the families who filtered their whole home',
  'water-softening-systems': 'Join the families who ended hard water',
  'well-water-treatment': 'Join the families who improved their well water',
  'reverse-osmosis-systems': 'Join the families who upgraded their drinking water',
  'carbon-filtration': 'Join the families who cleared the chlorine taste',
  'city-water-treatment': 'Join the families who improved their city water',
};

// Quiz prompt for after a pain-point section. `compact` = card for use inside a column.
// `service` (slug) = service-page variant: tailored headline + indigo block (deliberately off-palette so it doesn't blend with adjacent blue blocks).
export default function QuizCta({ compact = false, service }: { compact?: boolean; service?: string }) {
  const dark = !!service;
  const body = (
    <>
      <h2 className={dark ? '!text-white' : ''}>{(service && HEADLINES[service]) || 'Join The Families Who Fixed Their Water'}</h2>
      <p className={`mt-2 ${dark ? 'text-white/90' : ''}`}>See if we can help you (2-min quiz)</p>
      <Link href="/quiz" className="btn btn-cta mt-6">Take the Quiz</Link>
    </>
  );
  const bg = dark ? 'bg-[#2e2a5c] text-white' : 'bg-ice';
  return compact
    ? <div data-track-source="inline_quiz_cta" className={`${bg} rounded-3xl p-8 md:p-10 text-center`}>{body}</div>
    : <section data-track-source="inline_quiz_cta" className={`${bg} py-16 md:py-20`}><div className="mx-auto max-w-3xl px-4 text-center">{body}</div></section>;
}
