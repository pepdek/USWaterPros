import reviews from '@/data/reviews.json';

type Review = { name: string; text: string; rating?: number; source?: string };

// Renders only when data/reviews.json has real entries. Ship [] until the owner supplies verified reviews.
export default function ProofSlot() {
  const list = reviews as Review[];
  if (!list.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <h2>What customers say</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {list.map((r) => (
          <figure key={r.name + r.text} className="card p-6 md:p-8 !transform-none">
            <blockquote>{r.text}</blockquote>
            <figcaption className="mt-3 font-semibold text-ink">{r.name}{r.source ? `, ${r.source}` : ''}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
