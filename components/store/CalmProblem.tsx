// Replaces the old contamination / infrastructure / risk blocks. No statistics, no health claims: just the three frustrations we remove.
const CARDS: [string, string][] = [
  ['Your water is a mystery', 'Have you ever read your water report? Most people haven’t. Your utility publishes one every year, and we show you what it says.'],
  ['Quotes show up after the visit', 'The price should come first. Here it does: pick a system and see the exact price before anyone comes to your door.'],
  ['One-size packages', 'Your home and your family aren’t average. Three systems, so you can match one to your water and your budget.'],
];

export default function CalmProblem() {
  return (
    <section aria-labelledby="calm-h" className="bg-[#fafbfa]">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="inline-block rounded-md bg-black/[.05] px-3 py-1.5 font-mono text-[12px] font-medium uppercase tracking-[.14em] text-[#3f4a4f]">The usual way</p>
        <h2 id="calm-h" className="mt-5 max-w-3xl !font-sans !font-bold !tracking-[-0.045em] !text-ink !leading-[1.08] !text-[clamp(2rem,1.2rem+2.8vw,3.2rem)] [text-wrap:balance]">
          You shouldn&apos;t need a salesperson to know what&apos;s in your water.
        </h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {CARDS.map(([t, b]) => (
            <li key={t} className="rounded-2xl border border-black/[.08] bg-white p-7 shadow-[0_2px_14px_rgba(0,0,0,.05)]">
              <h3 className="font-sans text-[22px] font-bold tracking-[-0.02em] leading-tight">{t}</h3>
              <p className="!py-0 mt-3 font-light text-[#3f4a4f] text-[17px] leading-relaxed">{b}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
