// Replaces the old contamination / infrastructure / risk blocks. No statistics, no health claims: just the three frustrations we remove.
const CARDS: [string, string][] = [
  ['Your water is a mystery', 'Have you ever read your water report? Most people haven’t. Your utility publishes one every year, and we show you what it says.'],
  ['Quotes show up after the visit', 'The price should come first. Here it does: pick a system and see the exact price before anyone comes to your door.'],
  ['One-size packages', 'Your home and your family aren’t average. Three systems, so you can match one to your water and your budget.'],
];

export default function CalmProblem() {
  return (
    <section aria-labelledby="calm-h" className="bg-ice">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <p className="eyebrow !py-0">The usual way</p>
        <h2 id="calm-h" className="mt-5 max-w-3xl !text-ink !leading-[1.08] !text-[clamp(2rem,1.2rem+2.8vw,3.2rem)]">
          You shouldn&apos;t need a salesperson to know what&apos;s in your water.
        </h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {CARDS.map(([t, b]) => (
            <li key={t} data-rv className="rounded-[28px] bg-white p-8 shadow-[0_1px_0_#fff_inset,0_24px_50px_-32px_rgba(14,33,43,.35)]">
              <h3 className="font-sans text-[22px] font-semibold tracking-[-0.025em] leading-tight">{t}</h3>
              <p className="!py-0 mt-3 text-[#5b6472] text-[17px] leading-relaxed">{b}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
