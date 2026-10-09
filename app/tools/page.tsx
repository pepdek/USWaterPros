import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '@/components/Icon';
import LeadForm from '@/components/LeadForm';
import StickyBottomCTA from '@/components/StickyBottomCTA';
import CostCalculator from '@/components/tools/CostCalculator';
import SavingsDiagnostic from '@/components/tools/SavingsDiagnostic';
import WaterReportTool from '@/components/tools/WaterReportTool';

export const metadata: Metadata = {
  title: 'Water Tools & Resources | Know Your Water | US Water Pros',
  description: 'Four free tools: a local water quality report locator, a true cost calculator, a savings diagnostic and a quiz to find your system. Tacoma, Puyallup, Bremerton and Port Orchard.',
  alternates: { canonical: '/tools' },
};

/*
 * FUNNEL FLOW
 *
 *  TOOL 1  Water Quality Report Locator ........ highest intent
 *    ZIP -> area report card -> [Schedule Your Free Consultation (#quote form)]
 *                               + call/text link + flagship plan link
 *    events: tool_start, tool_result(area), schedule_cta_click(element_source=tool_report_result)
 *
 *  TOOL 2  True Cost Calculator ................ high intent buyers
 *    household inputs -> annual cost breakdown vs ours -> [See Your Custom Quote]
 *                               -> /services/whole-home-water-filtration#pricing (fixed price, no countdown)
 *    events: tool_start, tool_result(saves | no_savings, $ per year), schedule/quote clicks
 *
 *  TOOL 3  Am I Wasting Money? Diagnostic ...... nurture
 *    7 yes/no -> score + $ estimate -> email + SMS opt-in (lead saved to the CRM, service water-diagnostic)
 *                               -> [Schedule a Call to Discuss Your Savings Potential] or text us
 *    events: tool_start, tool_result(tier, $), lead_form_submission(diagnostic_capture)
 *
 *  TOOL 4  Water Quality Quiz .................. recommendation
 *    -> /quiz (8 questions) -> recommendation card -> contact form -> lead in the CRM
 *    events: quiz_cta_click(element_source=tool_quiz) then the quiz_* events
 *
 *  All four end at the same place: the free consultation form on this page (#quote), the phone, or a text.
 *  Source of every click is tagged with data-track-source, so GA4 and the CRM "Site activity" tab show which tool produced it.
 */

const TRUST = ['Licensed technicians', 'Better Business Bureau', 'Certified Contractors', 'Serving Washington since 2009', '100% satisfaction guarantee'];

export default function ToolsPage() {
  return (
    <main>
      <section data-track-source="hero" className="bg-surge">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24 text-center">
          <h1 className="!text-white">Know Your Water. Own Your Health.</h1>
          <p className="mt-4 text-white mx-auto">4 tools to reveal what’s actually in your tap and what you’re actually paying for it.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[['#report', 'Water report'], ['#calculator', 'Cost calculator'], ['#diagnostic', 'Savings check'], ['#quiz-tool', 'Find your system']].map(([h, l]) => (
              <a key={h} href={h} className="btn btn-secondary">{l}</a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy text-white" data-track-source="trust_strip">
        <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col gap-6 items-center text-center">
          <p className="!p-0 text-white font-semibold">Your family’s health starts with clean water.</p>
          <ul className="flex flex-wrap justify-center gap-3">{TRUST.map((t) => <li key={t} className="flex items-center gap-2 rounded-full border border-cyan/50 px-5 py-2 text-sm"><span className="text-cyan"><Icon name="check" size={16} /></span>{t}</li>)}</ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 md:py-16 flex flex-col gap-10 md:gap-14">
        <WaterReportTool />
        <CostCalculator />
        <SavingsDiagnostic />

        <div id="quiz-tool" data-track-source="tool_quiz" className="scroll-mt-24 rounded-[28px] bg-ice border border-cyan p-5 sm:p-8 md:p-10 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="shrink-0 w-14 h-14 rounded-2xl bg-white text-blue flex items-center justify-center shadow-sm"><Icon name="flask" size={30} /></span>
            <div><p className="text-sm font-semibold !p-0 text-navy">Tool 4 · Water Quality Quiz</p><h2>Find your ideal solution in 3 minutes.</h2></div>
          </div>
          <p>Not sure where to start? This quiz finds your perfect fit. Eight quick questions about your home, your water and your timeline, then a recommendation with a fixed price and a free consultation.</p>
          <Link href="/quiz" className="btn btn-cta self-start">Take the Quiz</Link>
        </div>
      </section>

      <section className="bg-ice">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20 grid gap-10 md:gap-14 md:grid-cols-3">
          {[
            ['shield', 'We know Tacoma water.', 'We’ve tested it. We’ve filtered it. Tacoma, Puyallup, Bremerton and Port Orchard each have their own supply, their own pipes and their own problems.'],
            ['drop', 'Go further than the legal minimum.', 'Your utility’s job is to meet legal limits. Ours is to protect your family’s health at the tap, with a system built for your exact water.'],
            ['badge', 'Stop overpaying for generic solutions.', 'One fixed price, installed by licensed technicians, tax included. No countdown timers, no hidden fees.'],
          ].map(([icon, h, t]) => (
            <div key={h} className="flex flex-col gap-3">
              <span className="w-12 h-12 rounded-2xl bg-white text-navy flex items-center justify-center shadow-sm"><Icon name={icon} size={26} /></span>
              <h3>{h}</h3><p className="!pt-0">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20 grid gap-10 md:gap-14 md:grid-cols-2 md:items-start">
        <div>
          <h2>Schedule Your Free Consultation</h2>
          <p>Whatever the tools showed you, the next step is a short, free call with a licensed technician. We’ll look at your water, answer your questions and give you a fixed price.</p>
        </div>
        <div id="quote" className="scroll-mt-24"><LeadForm service="whole-home-water-filtration" /></div>
      </section>
      <StickyBottomCTA />
    </main>
  );
}
