'use client';
import { useEffect, useRef, useState } from 'react';
import Honeypot, { hp } from '@/components/Honeypot';
import Icon from '@/components/Icon';
import { citySlug, getAttribution, trackEvent } from '@/lib/analytics/track';
import { PRICING, TAX_NOTE, formatUSD, wellCredit } from '@/lib/pricing';
import { addonsTotal, hasWell, isWellProspect, quoteTotal, routeQuiz, type AddonId, type WellTestId } from '@/lib/quizRouting';

// ---- Types -------------------------------------------------------------------------------
type Urgency = 'HIGH' | 'MEDIUM' | 'LOW';
type SourceType = 'private_well' | 'municipal';
type Responses = {
  location: string; currentSituation: string; waterConcerns: string[]; waterSourceType?: SourceType; servicePathA?: string;
  householdSize: string; budgetComfort: string; timeline: string; communicationPreference: string;
};
type Screen = 'intro' | 'q1' | 'q2' | 'i1' | 'q3' | 'i2' | 'qwell' | 'q4a' | 'q5' | 'q6' | 'i3' | 'q7' | 'q8' | 'result' | 'thanks';
type Opt = [label: string, sub: string | undefined, icon: string];
type Q = { key: keyof Responses; title: string; options: Opt[]; cards?: boolean };

// ---- Content -----------------------------------------------------------------------------
const CONCERNS: Opt[] = [
  ['Hard water spots', undefined, 'drop'], ['Chlorine taste', undefined, 'glass'],
  ['Scale buildup', undefined, 'gear'], ['Private well water', undefined, 'wave'], ['Multiple problems', undefined, 'wrench'],
];
const BENEFIT: Record<string, string> = {
  'Hard water spots': 'No more hard water spots',
  'Chlorine taste': 'Clean, filtered water from every tap',
  'Scale buildup': 'Protects appliances from scale buildup',
  'Private well water': 'Professional testing and custom filtration',
};
const QUESTIONS: Partial<Record<Screen, Q>> = {
  q1: { key: 'location', title: 'Where is your home?', options: [['Tacoma, WA', undefined, 'pin'], ['Puyallup, WA', undefined, 'pin'], ['Bremerton, WA', undefined, 'pin'], ['Port Orchard, WA', undefined, 'pin'], ['Other', undefined, 'pin']] },
  q2: { key: 'currentSituation', title: 'Which sounds most like you right now?', cards: true, options: [
    ['Slightly Concerned', 'I’m curious about my water', 'search'], ['Frustrated', 'My water problems are getting old', 'bolt'],
    ['Active Shopping', 'I’m comparing options right now', 'tag'], ['Recent Quote', 'I already have a quote', 'clipboard'],
  ] },
  qwell: { key: 'waterSourceType', title: 'Is your water from a private well or a municipal supply?', options: [
    ['Private well', 'We’ll build a custom approach', 'wave'], ['Municipal', 'City or utility water', 'building'],
  ] },
  q4a: { key: 'servicePathA', title: 'If you could fix ONE thing about your whole-home water, what matters most?', options: [
    ['Softness', 'Scale and water spots', 'drop'], ['Purity', 'Taste and drinking water', 'glass'], ['Both', 'Softer and cleaner', 'layers'],
  ] },
  q5: { key: 'householdSize', title: 'How many people live in your home?', options: [['1-2', undefined, 'user'], ['3-4', undefined, 'people'], ['5-6', undefined, 'people'], ['7+', undefined, 'house']] },
  q6: { key: 'budgetComfort', title: 'When it comes to home improvements like water systems, how do you usually decide?', cards: true, options: [
    ['Immediate', 'I solve it if it’s important', 'bolt'], ['Shop Around', 'I compare options first', 'search'], ['Finance', 'I like to spread payments', 'card'],
  ] },
  q7: { key: 'timeline', title: 'When do you want this installed?', options: [['ASAP', '1-2 weeks', 'clock'], ['Soon', '2-4 weeks', 'calendar'], ['Considering', 'Researching', 'search'], ['Future', 'Later this year', 'calendar']] },
  q8: { key: 'communicationPreference', title: 'How should we reach you?', options: [['Text/SMS', undefined, 'chat'], ['Call', undefined, 'phone']] },
};
const INTERSTITIAL: Partial<Record<Screen, [icon: string, title: string, body: string]>> = {
  i1: ['pin', 'Here’s why we ask', 'Water is different from neighborhood to neighborhood. Knowing where you live helps us recommend what actually fits your water.'],
  i2: ['handshake', 'You’re not alone', 'These are common concerns, and they’re fixable. A few more questions and we’ll point you to the right system.'],
  i3: ['badge', 'Why people choose us', 'Licensed local plumbers. Installation in about 4 hours. A 1-year warranty. Locally owned in Tacoma.'],
};

// ---- Logic -------------------------------------------------------------------------------
// Ordered list of screens. Picking "Private well water" inserts the well question (qwell) before Q4; a private-well answer skips Q4 entirely.
function flow(r: Partial<Responses>): Screen[] {
  const path: Screen[] = isWellProspect(r as Responses) ? [] : ['q4a'];
  return ['intro', 'q1', 'q2', 'i1', 'q3', 'i2', ...(hasWell(r as Responses) ? (['qwell'] as Screen[]) : []), ...path, 'q5', 'q6', 'i3', 'q7', 'q8', 'result', 'thanks'];
}
const urgency = (t?: string): Urgency => (t === 'ASAP' ? 'HIGH' : t === 'Future' ? 'LOW' : 'MEDIUM');
const isQuestion = (s: Screen) => !!QUESTIONS[s] || s === 'q3';

const headline = (situation?: string) =>
  situation === 'Recent Quote' ? 'Already have a quote? Here’s ours: one fixed price.'
  : situation === 'Frustrated' ? 'Let’s fix this for good.'
  : situation === 'Active Shopping' ? 'Here’s what we’d recommend for your home.'
  : 'Here’s the right system for your water.';

// ---- Component ---------------------------------------------------------------------------
export default function QuizFlow() {
  const [r, setR] = useState<Partial<Responses>>({ waterConcerns: [] });
  const [screen, setScreen] = useState<Screen>('intro');
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [addons, setAddons] = useState<AddonId[]>([]);
  const [wellTest, setWellTest] = useState<WellTestId>('basic');

  // Anonymous step-by-step capture (answers only, never contact details) so the CRM can see abandoned quizzes too.
  const sessionId = useRef('');
  const send = (screenName: string, extra: Record<string, unknown> = {}) => {
    if (!sessionId.current) return;
    fetch('/api/quiz-event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
      body: JSON.stringify({ sessionId: sessionId.current, screen: screenName, answers: r, attribution: getAttribution(), ...extra }) }).catch(() => {});
  };
  useEffect(() => {
    try { sessionId.current = sessionStorage.getItem('quiz-session') || ''; if (!sessionId.current) { sessionId.current = crypto.randomUUID(); sessionStorage.setItem('quiz-session', sessionId.current); } }
    catch { sessionId.current = crypto.randomUUID(); }
  }, []);
  useEffect(() => {
    if (screen === 'intro' || screen === 'thanks') return;
    send(screen, screen === 'result' ? { recommendation: { path: routeQuiz(r as Responses).path, label: routeQuiz(r as Responses).path === 'whole-home' ? PRICING.flagship.label : 'Well Water Test' } } : {});
    if (screen === 'result') {
      const rr = routeQuiz(r as Responses);
      const wellPath = rr.path === 'well-test';
      finished.current = true;
      trackEvent('quiz_completed', {
        quiz_type: wellPath ? 'well_water' : 'whole_home', urgency_flag: (r.timeline || 'considering').toLowerCase(),
        recommended_path: wellPath ? 'well_test' : 'whole_home', communication_pref: r.communicationPreference === 'Call' ? 'phone' : 'sms',
        city: citySlug(r.location), time_to_complete: t0.current ? Math.round((Date.now() - t0.current) / 1000) : undefined,
      });
      trackEvent('recommendation_viewed', {
        recommended_system: rr.path === 'whole-home' ? PRICING.flagship.label : 'Well Water Test',
        recommended_price: rr.path === 'whole-home' ? PRICING.flagship.displayPrice : PRICING.wellTest.basic.displayPrice,
        recommended_path: wellPath ? 'well_test' : 'whole_home',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  const screens = flow(r);
  const idx = screens.indexOf(screen);
  const t0 = useRef(0);
  const finished = useRef(false);
  const go = (d: number) => {
    const next = screens[idx + d];
    if (!next) return;
    // GA4: one event per answered question (moving forward only). Answers are option labels, never contact details.
    const qq = QUESTIONS[screen];
    if (d > 0 && (qq || screen === 'q3')) {
      const key = screen === 'q3' ? 'waterConcerns' : qq!.key;
      const val = r[key];
      if (screen === 'q1') { try { sessionStorage.setItem('uswp_city', citySlug(r.location)); } catch { /* private mode */ } }
      trackEvent('quiz_question_answered', { question_number: num, question_id: screen, answer_selected: Array.isArray(val) ? val.join('|') : String(val ?? '') });
    }
    setScreen(next); window.scrollTo({ top: 0 });
  };
  const start = () => { t0.current = Date.now(); trackEvent('quiz_start', { quiz_type: 'whole_home' }); go(1); };

  // Drop-off: leaving mid-quiz (before the result screen) fires quiz_abandoned once.
  useEffect(() => {
    const leave = () => {
      if (t0.current && !finished.current && screen !== 'intro' && screen !== 'result' && screen !== 'thanks') {
        finished.current = true;
        trackEvent('quiz_abandoned', { last_question: screen, question_number: qsRef.current.indexOf(screen) + 1 });
      }
    };
    window.addEventListener('pagehide', leave);
    return () => window.removeEventListener('pagehide', leave);
  }, [screen]);

  const q = QUESTIONS[screen];
  const answered = q && (q.key === 'waterConcerns' ? (r.waterConcerns?.length ?? 0) > 0 : !!r[q.key]);
  const val = (label: string) => (q?.key === 'waterSourceType' ? (label === 'Private well' ? 'private_well' : 'municipal') : label);
  const pick = (label: string) => q && setR({ ...r, [q.key]: val(label) });
  const toggle = (v: string) => {
    const cur = r.waterConcerns ?? [];
    setR({ ...r, waterConcerns: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] });
  };

  const rec = routeQuiz(r as Responses);
  const well = rec.path === 'well-test';
  const toggleAddon = (id: AddonId) => {
    trackEvent('quiz_addon_toggled', { addon: id, selected: !addons.includes(id) });
    setAddons((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  };
  const selected = addons.filter((a) => a in PRICING.addons);
  const quote = quoteTotal(rec, selected);
  const systemName = rec.path === 'whole-home' ? rec.label : PRICING.wellTest[wellTest].label;
  const systemPrice = rec.path === 'whole-home' ? quote : PRICING.wellTest[wellTest].displayPrice;
  const benefits = [...new Set((r.waterConcerns ?? []).map((c) => BENEFIT[c]).filter(Boolean))];
  const errs = {
    name: contact.name.trim().length < 2, email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email),
    phone: contact.phone.replace(/\D/g, '').length < 10,
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setTouched(true);
    if (errs.name || errs.email || errs.phone) return;
    setStatus('loading');
    const res = await fetch('/api/leads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...hp(), ...r, waterSourceType: hasWell(r as Responses) ? r.waterSourceType ?? null : null, showedWellWaterBranch: hasWell(r as Responses),
        tags: rec.path === 'well-test' ? [rec.tag] : [],
        recommendedSystem: systemName, recommendedPrice: systemPrice, urgencyPriority: urgency(r.timeline),
        addons: rec.path === 'whole-home' ? selected : [], wellTest: rec.path === 'well-test' ? PRICING.wellTest[wellTest].id : null,
        ...contact, sessionId: sessionId.current, attribution: getAttribution(), timestamp: new Date().toISOString(), page_source: '/quiz',
      }),
    }).then((x) => x.json() as Promise<{ success: boolean; leadId?: string; error?: string }>).catch(() => null);
    if (!res?.success) return setStatus('error');
    send('submitted');
    trackEvent('lead_form_submission', { form_type: 'quiz_result', quiz_completed: true, recommended_path: rec.path === 'well-test' ? 'well_test' : 'whole_home', urgency_flag: (r.timeline || 'considering').toLowerCase() });
    window.dispatchEvent(new Event('lead-submitted'));
    setStatus('idle'); setScreen('thanks');
  }

  const btnNext = 'btn btn-cta disabled:opacity-40 disabled:pointer-events-none flex-1';
  const btnCta = 'btn btn-cta disabled:opacity-40 disabled:pointer-events-none flex-1';
  const btnBack = 'btn btn-secondary';
  const qs = screens.filter(isQuestion);
  const num = qs.indexOf(screen) + 1;
  const qsRef = useRef<Screen[]>([]); qsRef.current = qs;
  const total = qs.length;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      {num > 0 && (
        <div className="mb-6" aria-label="Progress">
          <p className="eyebrow !py-0">Question {num} of {total}</p>
          <div className="mt-2 h-2 rounded-full bg-black/[.08]" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={num}>
            <div className="h-2 rounded-full bg-navy transition-all duration-500" style={{ width: `${(num / total) * 100}%` }} />
          </div>
        </div>
      )}

      {screen === 'intro' && (
        <div className="text-center flex flex-col gap-4">
          <h1>Before we find your perfect water solution…</h1>
          <p>Answer a few quick questions and we’ll recommend the right system for your home. It takes about a minute.</p>
          <button className={`${btnCta} w-full flex-none`} onClick={start}>Get Started</button>
        </div>
      )}

      {INTERSTITIAL[screen] && (
        <div className="card p-8 md:p-10 text-center flex flex-col gap-3 !transform-none">
          <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-navy shadow-[0_14px_30px_-18px_rgba(11,37,69,.5)] ring-1 ring-black/[.06]"><Icon name={INTERSTITIAL[screen]![0]} size={36} /></span>
          <h1 className="!text-[var(--fs-h2)] !leading-[1.08]">{INTERSTITIAL[screen]![1]}</h1>
          <p>{INTERSTITIAL[screen]![2]}</p>
          <div className="flex gap-3 mt-4"><button className={btnBack} onClick={() => go(-1)}>Previous</button><button className={btnNext} onClick={() => go(1)}>Continue</button></div>
        </div>
      )}

      {(q || screen === 'q3') && (
        <div className="flex flex-col gap-4">
          <h1 className="!text-[var(--fs-h2)] !leading-[1.08]">{screen === 'q3' ? 'What water problems do you notice? Select all that apply.' : q!.title}</h1>
          <div className={`grid gap-3 ${q?.cards ? 'sm:grid-cols-2' : ''}`}>
            {(screen === 'q3' ? CONCERNS : q!.options).map(([label, sub, icon]) => {
              const on = screen === 'q3' ? r.waterConcerns?.includes(label) : r[q!.key] === val(label);
              return (
                <button key={label} type="button" onClick={() => (screen === 'q3' ? toggle(label) : pick(label))} aria-pressed={on}
                  className={`tile relative min-h-[64px] p-5 text-left flex flex-col sm:flex-row sm:items-center gap-3 ${on ? 'tile-on' : ''}`}>
                  <span className="shrink-0 text-navy" aria-hidden><Icon name={icon} size={32} /></span>
                  <span className="flex-1"><span className="font-semibold">{label}</span>{sub && <span className="block text-sm font-normal">{sub}</span>}</span>
                  {screen === 'q3' && <span aria-hidden className={`absolute top-3 right-3 sm:static shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center text-[13px] transition-colors ${on ? 'bg-navy border-navy text-white' : 'border-black/25'}`}>{on ? '★' : ''}</span>}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 mt-2">
            <button className={btnBack} onClick={() => go(-1)}>Previous</button>
            <button className={btnNext} disabled={screen === 'q3' ? !(r.waterConcerns?.length) : !answered} onClick={() => go(1)}>Next</button>
          </div>
        </div>
      )}

      {screen === 'result' && (
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
<Honeypot />
          <h1 className="!text-[var(--fs-h2)] !leading-[1.08]">{headline(r.currentSituation)}</h1>
          <div className="card p-8 md:p-10 !transform-none border-t-4 !border-t-[var(--cta)]">
            {rec.path === 'whole-home' ? (
              <>
                <p className="eyebrow !py-0">Your recommended system</p>
                <p className="font-serif text-[30px] font-bold leading-tight text-ink mt-2">{rec.label}</p>
                <p className="font-mono text-[56px] font-bold leading-none text-ink mt-1">{formatUSD(quote)} <span className="font-sans text-[15px] font-medium text-[#5b6472]">{TAX_NOTE}</span></p>
                <ul className="mt-3 flex flex-col gap-1">
                  {rec.includes.map((i) => <li key={i}><span className="text-cta mr-2" aria-hidden>★</span>{i}</li>)}
                  {(benefits.length ? benefits : ['Better water at every tap']).map((b) => <li key={b}><span className="text-cta mr-2" aria-hidden>★</span>{b}</li>)}
                  <li><span className="text-cta mr-2" aria-hidden>★</span>Installation in about 4 hours</li>
                  {r.householdSize && <li><span className="text-cta mr-2" aria-hidden>★</span>Sized for a household of {r.householdSize}</li>}
                </ul>
                <p className="mt-4 font-semibold text-sm text-[var(--color-accent)]">Optional add-ons, installed on the same visit</p>
                {(Object.keys(PRICING.addons) as AddonId[]).map((id) => (
                  <label key={id} className="tile flex items-center gap-3 min-h-[60px] px-4 mt-2 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 accent-[var(--blue)]" checked={selected.includes(id)} onChange={() => toggleAddon(id)} />
                    <span className="flex-1"><span className="font-semibold">{PRICING.addons[id].label}</span>{rec.suggestedAddons.includes(id) && <span className="ml-2 text-xs bg-ice rounded-full px-2.5 py-1 font-semibold text-navy">Suggested for you</span>}</span>
                    <span className="font-bold">+{formatUSD(PRICING.addons[id].displayPrice)}</span>
                  </label>
                ))}
              </>
            ) : (
              <>
                <p className="eyebrow !py-0">Your recommended next step</p>
                <p className="font-serif text-[30px] font-bold leading-tight text-ink mt-2">Well Water Test</p>
                <p className="mt-1">We test your water for iron, sulfur and hardness, then recommend the right system. No fixed install price until your results are in.</p>
                {(Object.keys(PRICING.wellTest) as WellTestId[]).map((id) => (
                  <label key={id} className="tile flex items-center gap-3 min-h-[60px] px-4 mt-2 cursor-pointer">
                    <input type="radio" name="welltest" className="w-5 h-5 accent-[var(--blue)]" checked={wellTest === id} onChange={() => setWellTest(id)} />
                    <span className="flex-1 font-semibold">{PRICING.wellTest[id].label}</span>
                    <span className="font-bold">{formatUSD(PRICING.wellTest[id].displayPrice)}</span>
                  </label>
                ))}
                <p className="mt-2 text-sm">{wellCredit}</p>
              </>
            )}
          </div>
          {([['name', 'Name', 'text', 'name'], ['email', 'Email', 'email', 'email'], ['phone', 'Phone', 'tel', 'tel']] as const).map(([k, label, type, ac]) => (
            <label key={k} className="block">
              <span className="font-semibold text-ink text-[15px]">{label}</span>
              <input className="field" type={type} autoComplete={ac} value={contact[k]} onChange={(e) => setContact({ ...contact, [k]: e.target.value })} />
              {touched && errs[k] && <span role="alert" className="text-coral text-[13px] font-medium">Enter a valid {label.toLowerCase()}</span>}
            </label>
          ))}
          {status === 'error' && <p role="alert" className="text-coral font-semibold text-sm">Something went wrong. Please try again or call us.</p>}
          <div className="flex gap-3">
            <button type="button" className={btnBack} onClick={() => go(-1)}>Previous</button>
            <button className={btnCta} disabled={status === 'loading'}>{status === 'loading' ? 'Sending…' : 'Get My Price'}</button>
          </div>
          <p className="text-[13px] text-center text-[#5b6472]">Free, no obligation. Your information is private.</p>
        </form>
      )}

      {screen === 'thanks' && (
        <div className="card p-8 md:p-10 text-center flex flex-col gap-3 !transform-none">
          <div className="mx-auto w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center text-3xl shadow-[0_14px_30px_-14px_rgba(11,37,69,.7)]" aria-hidden>★</div>
          <h1 className="!text-[var(--fs-h2)] !leading-[1.08]">You’re all set, {contact.name.split(' ')[0]}!</h1>
          <p>We’ll {r.communicationPreference === 'Call' ? 'call' : 'text'} you soon with your price and your install options.</p>
        </div>
      )}
    </div>
  );
}
