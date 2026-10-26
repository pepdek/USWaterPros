import Link from 'next/link';

const HEADLINE = 'See what a system would look like in your home';

// Quiz prompt for after a pain-point section. `compact` = card for use inside a column.
// `service` (slug) = service-page variant: the same headline on the brand navy (star-field) block.
export default function QuizCta({ compact = false, service }: { compact?: boolean; service?: string }) {
  const dark = !!service;
  const body = (
    <>
      <h2 className={dark ? '!text-white' : ''}>{HEADLINE}</h2>
      <p className={`mt-2 ${dark ? 'text-white/90' : ''}`}>See if we can help you (2-min quiz)</p>
      <Link href="/quiz" className="btn btn-cta mt-6">Take the Quiz</Link>
    </>
  );
  const bg = dark ? 'bg-surge text-white' : 'bg-ice';
  return compact
    ? <div data-track-source="inline_quiz_cta" className={`${bg} rounded-3xl p-8 md:p-10 text-center`}>{body}</div>
    : <section data-track-source="inline_quiz_cta" className={`${bg} py-16 md:py-20`}><div className="mx-auto max-w-3xl px-4 text-center">{body}</div></section>;
}
