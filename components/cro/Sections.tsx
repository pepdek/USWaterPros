import Link from 'next/link';
import LeadForm from '@/components/LeadForm';
import Sources from '@/components/Sources';
import { Band, FaqGroup } from '@/components/service';
import PhoneBar from './PhoneBar';
import { SITE } from '@/lib/site';
import type { Faq } from '@/lib/croFaq';

const SERVICE = 'whole-home-water-filtration';

// Hero: copy on the left, the form on the right (under the subhead on mobile). The form is always above the fold.
export function Hero({ eyebrow, h1, sub, children }: { eyebrow: string; h1: string; sub: string; children?: React.ReactNode }) {
  return (
    <section data-track-source="hero" className="bg-surge">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-20 grid gap-8 md:gap-12 md:grid-cols-2 md:items-start">
        <div>
          <p className="!text-white font-semibold">{eyebrow}</p>
          <h1 className="!text-white mt-2">{h1}</h1>
          <p className="!text-white mt-4 md:text-lg">{sub}</p>
          {children}
        </div>
        <div id="quote" className="scroll-mt-24 card p-6 md:p-8 !transform-none">
          <h2 className="text-2xl">Get your fixed price. We call back within {SITE.callbackWindow}.</h2>
          <div className="mt-4"><LeadForm service={SERVICE} variant="hero" /></div>
          <PhoneBar />
        </div>
      </div>
    </section>
  );
}

export function LegalIdeal() {
  return (
    <Band>
      <div className="max-w-3xl">
        <h2>Legal isn&apos;t the same as ideal.</h2>
        <p className="mt-4">Federal limits for many contaminants are set higher than health-based guidelines. EPA&apos;s legal limit for arsenic is 10 parts per billion. EWG&apos;s one-in-a-million cancer-risk guideline is 0.004 ppb, about 2,500 times lower.</p>
        <Sources ids={['ewgDb', 'ewgDbUpdate', 'ewgMethod']} className="mt-2" />
        <p className="mt-6">Most US public water systems disinfect with chlorine or chloramine. That&apos;s why tap water often smells like a pool, and why research links chlorine exposure to a weaker skin barrier.</p>
        <Sources ids={['epaDbp', 'jaci']} className="mt-2" />
      </div>
    </Band>
  );
}

export function PreEighty({ opener }: { opener?: string }) {
  return (
    <Band tone="ice">
      <div className="max-w-3xl">
        <h2>Built before 1986? Read this first.</h2>
        {opener && <p className="mt-4">{opener}</p>}
        <p className="mt-4">Homes built before 1986 can contain lead solder and older fixtures. Lead has no taste or smell, so you can&apos;t check by looking. The only way to know is a test.</p>
        <Sources ids={['epaLead']} className="mt-2" />
        <p className="mt-4">When you call, we&apos;ll ask your build year, your water source, and what you&apos;ve noticed. Then we&apos;ll tell you which options address your situation and which don&apos;t. Lead reduction depends on specific certified filter media. We&apos;ll show you exactly which one and its certification.</p>
        {/* VERIFY: NSF/ANSI 53 lead-reduction certification and NSF listing number for the specified carbon media. Do not publish a lead-reduction claim for the whole-home tank until confirmed. RO faucet lead claim requires NSF/ANSI 58 certificate listing lead. */}
      </div>
    </Band>
  );
}

export function HowItWorks() {
  const steps: [string, string][] = [
    ['Call or request a callback.', `We call back within ${SITE.callbackWindow} during business hours. A 15-minute conversation about your water, your home, and your options. You leave with a fixed price.`],
    ['We schedule a licensed plumber.', 'We confirm the install date with you.'],
    ['Installed and tested.', 'About 4 hours on site. The system is tested before the plumber leaves, and you get a walkthrough.'],
  ];
  return (
    <Band>
      <div id="process" className="scroll-mt-24 max-w-3xl">
        <h2>How it works. Three steps, no surprises.</h2>
        {/* VERIFY: typical days from quote to install */}
        <ol className="mt-8 flex flex-col gap-6">
          {steps.map(([t, d], i) => (
            <li key={t} className="flex gap-4">
              <span className="shrink-0 w-10 h-10 rounded-full bg-navy text-white font-bold flex items-center justify-center" aria-hidden>{i + 1}</span>
              <div><h3 className="text-xl">{t}</h3><p className="mt-1">{d}</p></div>
            </li>
          ))}
        </ol>
        <p className="mt-6 font-semibold text-ink">If your water doesn&apos;t need treatment, we&apos;ll tell you on the call.</p>
      </div>
    </Band>
  );
}

export function Includes() {
  const items = ['Water softening (resin and brine tank)', 'Carbon filtration for whole-home chlorine taste and odor', 'Reverse osmosis drinking-water faucet', 'Licensed plumbing installation', 'Post-install testing', `${SITE.warrantyYears}-year warranty`];
  return (
    <Band tone="ice">
      <div className="max-w-3xl">
        <h2>What {SITE.priceInstalled} includes.</h2>
        <ul className="mt-6 flex flex-col gap-3">
          {items.map((i) => <li key={i} className="flex gap-3"><span className="text-aqua" aria-hidden>✓</span><span>{i}</span></li>)}
        </ul>
        <p className="mt-6">Premium brands in this market commonly quote {SITE.premiumRange} installed. Budget options run around {SITE.budgetPrice} with shorter lifespans. Ranges vary by brand and home.</p>
        {/* VERIFY: source for local market price ranges. */}
      </div>
    </Band>
  );
}

export function FaqSection({ items }: { items: Faq[] }) {
  return (
    <Band>
      <FaqGroup title="Common questions, answered plainly." items={items} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }) }} />
    </Band>
  );
}

export function FooterCta() {
  return (
    <section className="bg-surge" data-track-source="final_cta">
      <div id="get-price" className="mx-auto max-w-xl px-4 py-16 md:py-20 scroll-mt-24">
        <h2 className="!text-white text-center">Get your fixed price before you decide.</h2>
        <div className="mt-8 card p-6 md:p-8 !transform-none">
          <LeadForm service={SERVICE} variant="footer" />
          <PhoneBar />
        </div>
      </div>
    </section>
  );
}

export function InternalLinks() {
  return (
    <p className="mx-auto max-w-6xl px-4 pb-16 text-center">
      <Link href="/services/whole-home-water-filtration" className="underline font-semibold text-ink">Whole-home water filtration</Link>
      {' · '}<Link href="/services/whole-home-water-filtration-tacoma" className="underline font-semibold text-ink">Tacoma water filtration</Link>
    </p>
  );
}
