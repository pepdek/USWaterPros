'use client';
import { useMemo, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import { getAttribution, trackEvent } from '@/lib/analytics/track';
import { DIAG_QUESTIONS, diagnose } from '@/lib/costModel';
import { SMS_HREF } from '@/lib/constants';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SavingsDiagnostic() {
  const [ans, setAns] = useState<Record<string, boolean>>({});
  const [scored, setScored] = useState(false);
  const [c, setC] = useState({ name: '', email: '', phone: '', sms: false });
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [touched, setTouched] = useState(false);
  const started = useRef(false);

  const answered = Object.keys(ans).length;
  const yes = DIAG_QUESTIONS.filter((q) => ans[q.id]).map((q) => q.id);
  const d = useMemo(() => diagnose(yes), [yes.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps
  const set = (id: string, v: boolean) => { if (!started.current) { started.current = true; trackEvent('tool_start', { tool_name: 'savings_diagnostic' }); } setAns({ ...ans, [id]: v }); };

  const errs = { name: c.name.trim().length < 2, email: !EMAIL.test(c.email), phone: c.sms && c.phone.replace(/\D/g, '').length < 10 };
  async function save(e: React.FormEvent) {
    e.preventDefault(); setTouched(true);
    if (errs.name || errs.email || errs.phone) return;
    setStatus('sending');
    const res = await fetch('/api/leads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: c.name, email: c.email, phone: c.phone, service_type: 'water-diagnostic', page_source: '/tools', attribution: getAttribution(),
        tool: { name: 'diagnostic', score: d.score, waste: d.waste, tier: d.tier, answers: yes, sms_opt_in: c.sms } }),
    }).then((x) => x.json() as Promise<{ success: boolean }>).catch(() => null);
    if (!res?.success) return setStatus('error');
    trackEvent('lead_form_submission', { form_type: 'diagnostic_capture', quiz_completed: false });
    setStatus('done');
  }

  return (
    <div id="diagnostic" data-track-source="tool_diagnostic" className="scroll-mt-24 rounded-[28px] bg-ice border border-cyan p-5 sm:p-8 md:p-10 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="shrink-0 w-14 h-14 rounded-2xl bg-white text-blue flex items-center justify-center shadow-sm"><Icon name="chart" size={30} /></span>
        <div><p className="text-sm font-semibold !p-0 text-navy">Tool 3 · Am I Wasting Money?</p><h2>Stop throwing money at a problem you don’t understand.</h2></div>
      </div>
      <p>Seven yes-or-no questions about your current setup. You get a score and a dollar estimate. <b>Reveal the hidden costs in what you have now.</b></p>

      <ol className="flex flex-col gap-3">
        {DIAG_QUESTIONS.map((q, i) => (
          <li key={q.id} className="card !transform-none p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <span><b className="text-blue mr-2">{i + 1}.</b>{q.text}</span>
            <span className="flex gap-2 shrink-0" role="group" aria-label={q.text}>
              {[true, false].map((v) => <button key={String(v)} type="button" aria-pressed={ans[q.id] === v} onClick={() => set(q.id, v)} className={`btn !min-w-20 ${ans[q.id] === v ? 'btn-blue' : 'btn-secondary'}`}>{v ? 'Yes' : 'No'}</button>)}
            </span>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-4">
        <button className="btn btn-blue" disabled={answered < DIAG_QUESTIONS.length} onClick={() => { setScored(true); trackEvent('tool_result', { tool_name: 'savings_diagnostic', result_bucket: d.tier, result_value: d.waste }); }}>See my score</button>
        <span className="text-sm">{answered} of {DIAG_QUESTIONS.length} answered</span>
      </div>

      {scored && (
        <div className="card p-5 sm:p-8 md:p-10 flex flex-col gap-6" aria-live="polite">
          <div>
            <p className="text-sm font-semibold !p-0 text-navy">Your score: {d.score} of {DIAG_QUESTIONS.length} warning signs</p>
            <div className="h-3 rounded-full bg-ice mt-2" aria-hidden><div className="h-3 rounded-full bg-blue" style={{ width: `${(d.score / DIAG_QUESTIONS.length) * 100}%` }} /></div>
            <h3 className="mt-4">{d.headline}</h3><p>{d.detail}</p>
            <p className="text-xs !p-0">Estimates use typical costs for a household of three. See what you could save with a system built for your exact water quality.</p>
          </div>

          {status === 'done' ? (
            <p className="rounded-3xl bg-ice border border-cyan p-6 !p-6 font-semibold text-navy">Thanks, {c.name.split(' ')[0]}. We saved your result, and a specialist will follow up with your savings breakdown.</p>
          ) : (
            <form onSubmit={save} noValidate className="grid gap-4 sm:grid-cols-2">
              <p className="sm:col-span-2 font-semibold !p-0">Get your savings breakdown by email or text</p>
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold">First name</span><input className="field" autoComplete="given-name" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} />{touched && errs.name && <span className="text-coral text-xs">Enter your name</span>}</label>
              <label className="flex flex-col gap-1"><span className="text-sm font-semibold">Email</span><input className="field" type="email" autoComplete="email" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} />{touched && errs.email && <span className="text-coral text-xs">Enter a valid email</span>}</label>
              <label className="flex flex-col gap-1 sm:col-span-2"><span className="text-sm font-semibold">Mobile number <span className="font-normal">(optional)</span></span><input className="field" type="tel" autoComplete="tel" value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} />{touched && errs.phone && <span className="text-coral text-xs">Enter a 10-digit number to get texts</span>}</label>
              <label className="sm:col-span-2 flex items-start gap-3 text-sm min-h-12"><input type="checkbox" className="w-5 h-5 mt-1 accent-[var(--blue)] shrink-0" checked={c.sms} onChange={(e) => setC({ ...c, sms: e.target.checked })} />
                <span>Yes, text me my result and follow-ups. By checking this box I agree to receive text messages from US Water Pros at the number above. Message and data rates may apply. Reply STOP to opt out. Consent is not a condition of any purchase.</span></label>
              {status === 'error' && <p className="sm:col-span-2 text-coral font-semibold text-sm">Something went wrong. Please try again or text us.</p>}
              <button className="btn btn-blue sm:col-span-2 self-start" disabled={status === 'sending'}>{status === 'sending' ? 'Saving…' : 'Send me my savings breakdown'}</button>
            </form>
          )}

          <div className="rounded-3xl bg-navy text-white p-6 sm:p-8 flex flex-col gap-3" data-track-source="tool_diagnostic_result">
            <a href="#quote" className="btn btn-cta self-start !whitespace-normal !h-auto py-3 text-center">Schedule a Call to Discuss Your Savings Potential</a>
            <p className="!p-0 text-sm text-white/90">Or text us directly with questions. We respond same day. <a className="underline font-semibold" href={SMS_HREF}>Text us</a></p>
          </div>
        </div>
      )}
    </div>
  );
}
