import Link from 'next/link';

// Quiz prompt for after a pain-point section. `compact` = card for use inside a column.
export default function QuizCta({ compact = false }: { compact?: boolean }) {
  const body = (
    <>
      <h2>Join The Families Who Fixed Their Water</h2>
      <p className="mt-2">See if we can help you (2-min quiz)</p>
      <Link href="/quiz" className="btn btn-aqua mt-6">Take the Quiz</Link>
    </>
  );
  return compact
    ? <div data-track-source="inline_quiz_cta" className="bg-ice rounded-xl p-6 text-center">{body}</div>
    : <section data-track-source="inline_quiz_cta" className="bg-ice py-12"><div className="mx-auto max-w-3xl px-4 text-center">{body}</div></section>;
}
