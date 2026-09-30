const RISKS = [
  ['Cancer', 'It is estimated that contaminants in drinking water will contribute to over 100,000 cancer cases for US residents over their lifetimes. Common cancers linked to tap water contaminants include bladder, liver, kidney, thyroid, colorectal, ovarian and testicular.'],
  ['Fertility Issues', 'The Environmental Working Group (EWG) has identified 38 contaminants present in US tap water linked to fertility problems. These can contribute to trouble conceiving, natal development issues, preterm births, decreased birth weight and other adverse outcomes.'],
  ['Child Development', 'Tap water contaminants are especially harmful to children during developmental years. Even low levels of exposure can contribute to nervous system damage, lower IQ, learning disabilities, hyperactivity, and impaired circulatory function.'],
  ['Hormone Disruption', 'Contaminants in tap water including forever chemicals, pharmaceuticals and pesticides disrupt hormone function. Atrazine, a dangerous pesticide, has been found in the tap water of more than 30 million Americans.'],
  ['Cosmetic Issues', 'Chlorine is the most common tap water disinfectant in the US, and nearly all tap water contains it. Along with dissolved metals, it can cause dry skin, acne, eczema, hair issues, scalp irritation, and dental discoloration.'],
  ['Organ Complications', 'Many contaminants commonly found in US tap water harm vital organs. They can damage the liver, kidneys, brain, heart, lungs and digestive system, and make other diseases that rely on these organs worse.'],
];

export default function Risks() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="text-center">The Risks</h2>
      <p className="text-center mt-2">The effects of unfiltered tap water can include the following:</p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {RISKS.map(([t, d]) => (
          <div key={t} className="card p-6 border-t-4 border-coral">
            <h3 className="text-xl">{t}</h3>
            <p className="mt-2">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
