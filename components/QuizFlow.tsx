'use client';
import { useState } from 'react';
import { track } from '@/lib/analytics';

// ---- Types -------------------------------------------------------------------------------
type Urgency = 'HIGH' | 'MEDIUM' | 'LOW';
type SourceType = 'private_well' | 'municipal';
type Responses = {
  location: string; currentSituation: string; waterConcerns: string[]; waterSourceType?: SourceType; servicePathA?: string; servicePathB?: string;
  householdSize: string; budgetComfort: string; timeline: string; communicationPreference: string;
};
type Screen = 'intro' | 'q1' | 'q2' | 'i1' | 'q3' | 'i2' | 'qwell' | 'q4a' | 'q4b' | 'q5' | 'q6' | 'i3' | 'q7' | 'q8' | 'result' | 'thanks';
type Rec = { name: string; price: number; range?: string };
type Opt = [label: string, sub: string | undefined, icon: string];
type Q = { key: keyof Responses; title: string; options: Opt[]; cards?: boolean };

// ---- Content -----------------------------------------------------------------------------
const CONCERNS: Opt[] = [
  ['Hard water spots', undefined, '💧'], ['Chlorine taste', undefined, '👃'], ['Dry skin', undefined, '🧴'],
  ['Scale buildup', undefined, '⚙️'], ['Private well water', undefined, '🌊'], ['Multiple problems', undefined, '🔧'],
];
const BENEFIT: Record<string, string> = {
  'Hard water spots': 'No more hard water spots',
  'Chlorine taste': 'Clean, filtered water from every tap',
  'Dry skin': 'Softer water for skin and hair',
  'Scale buildup': 'Protects appliances from scale buildup',
  'Private well water': 'Professional testing and custom filtration',
};
const RECS: Record<'softness' | 'purity' | 'both' | 'drinking', Rec> = {
  softness: { name: 'Whole-Home Softener', price: 2700 },
  purity: { name: 'Reverse Osmosis Drinking Water System', price: 2700 },
  both: { name: 'Dual System: Softener + RO', price: 2700 },
  drinking: { name: 'RO Drinking Water System', price: 2700 },
};
// Private-well prospects get a custom analysis and a price range instead of a fixed price.
const WELL_REC: Rec = { name: 'Custom Well Water Analysis', price: 2999, range: '$2,999–$4,599' };
const QUESTIONS: Partial<Record<Screen, Q>> = {
  q1: { key: 'location', title: 'Where is your home?', options: [['Tacoma, WA', undefined, '💧'], ['Puyallup, WA', undefined, '💧'], ['Bremerton, WA', undefined, '💧'], ['Port Orchard, WA', undefined, '💧'], ['Other', undefined, '📍']] },
  q2: { key: 'currentSituation', title: 'Which sounds most like you right now?', cards: true, options: [
    ['Slightly Concerned', 'I’m curious about my water', '🤔'], ['Frustrated', 'My water problems are getting old', '😤'],
    ['Active Shopping', 'I’m comparing options right now', '🛒'], ['Recent Quote', 'I already have a quote', '📋'],
  ] },
  qwell: { key: 'waterSourceType', title: 'Is your water from a private well or a municipal supply?', options: [
    ['Private well', 'We’ll build a custom approach', '🏞️'], ['Municipal', 'City or utility water', '🏙️'],
  ] },
  q4a: { key: 'servicePathA', title: 'If you could fix ONE thing about your whole-home water, what matters most?', options: [
    ['Softness', 'Whole-Home Softener', '🧴'], ['Purity', 'Reverse Osmosis System', '💎'], ['Both', 'Dual System', '⚡'],
  ] },
  q4b: { key: 'servicePathB', title: 'Just to confirm: are you interested in drinking water purity only?', options: [
    ['Yes, drinking only', undefined, '🥤'], ['Actually, want whole-home too', undefined, '🏠'],
  ] },
  q5: { key: 'householdSize', title: 'How many people live in your home?', options: [['1-2', undefined, '👫'], ['3-4', undefined, '👨‍👩‍👧'], ['5-6', undefined, '👨‍👩‍👧‍👦'], ['7+', undefined, '🏡']] },
  q6: { key: 'budgetComfort', title: 'When it comes to home improvements like water systems, how do you usually decide?', cards: true, options: [
    ['Immediate', 'I solve it if it’s important', '⚡'], ['Shop Around', 'I compare options first', '🔍'], ['Finance', 'I like to spread payments', '💳'],
  ] },
  q7: { key: 'timeline', title: 'When do you want this installed?', options: [['ASAP', '1-2 weeks', '⏰'], ['Soon', '2-4 weeks', '📅'], ['Considering', 'Researching', '🔎'], ['Future', 'Later this year', '🗓️']] },
  q8: { key: 'communicationPreference', title: 'How should we reach you for your consultation?', options: [['Text/SMS', undefined, '📱'], ['Call', undefined, '☎️']] },
};
const INTERSTITIAL: Partial<Record<Screen, [icon: string, title: string, body: string]>> = {
  i1: ['📍', 'Here’s why we ask', 'Water is different from neighborhood to neighborhood. Knowing where you live helps us recommend what actually fits your water.'],
  i2: ['🤝', 'You’re not alone', 'These are common concerns, and they’re fixable. A few more questions and we’ll point you to the right system.'],
  i3: ['✅', 'Why people choose us', 'Licensed technicians. Installation in about 4 hours. A 1-year warranty. Serving Washington homeowners since 2009.'],
};

// ---- Logic -------------------------------------------------------------------------------
const route = (c: string[]): 'q4a' | 'q4b' => (c.length === 1 && c[0] === 'Chlorine taste' && !c.includes('Multiple problems') ? 'q4b' : 'q4a');

const hasWell = (r: Partial<Responses>) => (r.waterConcerns ?? []).includes('Private well water');
const isWellProspect = (r: Partial<Responses>) => hasWell(r) && r.waterSourceType === 'private_well';

// Ordered list of screens for the current answers.
// Q3 decides Q4a vs Q4b. Picking "Private well water" inserts the well question (qwell) before Q4; "Private well" skips Q4 entirely.
function flow(r: Partial<Responses>): Screen[] {
  const path: Screen[] = isWellProspect(r) ? [] : route(r.waterConcerns ?? []) === 'q4b' ? (r.servicePathB?.startsWith('Actually') ? ['q4b', 'q4a'] : ['q4b']) : ['q4a'];
  return ['intro', 'q1', 'q2', 'i1', 'q3', 'i2', ...(hasWell(r) ? (['qwell'] as Screen[]) : []), ...path, 'q5', 'q6', 'i3', 'q7', 'q8', 'result', 'thanks'];
}
function recommend(r: Partial<Responses>): Rec {
  if (isWellProspect(r)) return WELL_REC;
  if (flow(r).includes('q4a')) {
    return r.servicePathA === 'Purity' ? RECS.purity : r.servicePathA === 'Both' ? RECS.both : RECS.softness;
  }
  return RECS.drinking;
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

  const screens = flow(r);
  const idx = screens.indexOf(screen);
  const go = (d: number) => { const next = screens[idx + d]; if (next) { setScreen(next); window.scrollTo({ top: 0 }); } };
  const start = () => { track('quiz_start'); go(1); };

  const q = QUESTIONS[screen];
  const answered = q && (q.key === 'waterConcerns' ? (r.waterConcerns?.length ?? 0) > 0 : !!r[q.key]);
  const val = (label: string) => (q?.key === 'waterSourceType' ? (label === 'Private well' ? 'private_well' : 'municipal') : label);
  const pick = (label: string) => q && setR({ ...r, [q.key]: val(label) });
  const toggle = (v: string) => {
    const cur = r.waterConcerns ?? [];
    setR({ ...r, waterConcerns: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] });
  };

  const rec = recommend(r);
  const well = isWellProspect(r);
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
        ...r, waterSourceType: hasWell(r) ? r.waterSourceType ?? null : null, showedWellWaterBranch: hasWell(r),
        tags: isWellProspect(r) ? ['well-water-prospect'] : [],
        recommendedSystem: rec.name, recommendedPrice: rec.price, recommendedPriceRange: rec.range ?? '', urgencyPriority: urgency(r.timeline),
        ...contact, timestamp: new Date().toISOString(), page_source: '/quiz',
      }),
    }).then((x) => x.json() as Promise<{ success: boolean; leadId?: string; error?: string }>).catch(() => null);
    if (!res?.success) return setStatus('error');
    track('quiz_complete', { system: rec.name, urgency: urgency(r.timeline) });
    window.dispatchEvent(new Event('lead-submitted'));
    setStatus('idle'); setScreen('thanks');
  }

  const btnNext = 'btn bg-[var(--color-primary)] text-[var(--color-accent)] hover:opacity-90 disabled:opacity-40 flex-1';
  const btnBack = 'btn bg-white border border-black/10 text-[var(--color-accent)] hover:opacity-90';
  const qs = screens.filter(isQuestion);
  const num = qs.indexOf(screen) + 1;
  const total = qs.length;

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      {num > 0 && (
        <div className="mb-6" aria-label="Progress">
          <p className="text-sm font-semibold text-[var(--color-accent)]">{num} of {total}</p>
          <div className="mt-1 h-2 rounded bg-ice" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={num}>
            <div className="h-2 rounded bg-[var(--color-primary)] transition-all" style={{ width: `${(num / total) * 100}%` }} />
          </div>
        </div>
      )}

      {screen === 'intro' && (
        <div className="text-center flex flex-col gap-4">
          <h1>Before we find your perfect water solution…</h1>
          <p>Answer a few quick questions and we’ll recommend the right system for your home. It takes about a minute.</p>
          <button className={`${btnNext} w-full flex-none`} onClick={start}>Get Started</button>
        </div>
      )}

      {INTERSTITIAL[screen] && (
        <div className="card p-8 text-center flex flex-col gap-3 !transform-none">
          <span className="text-4xl" aria-hidden>{INTERSTITIAL[screen]![0]}</span>
          <h2>{INTERSTITIAL[screen]![1]}</h2>
          <p>{INTERSTITIAL[screen]![2]}</p>
          <div className="flex gap-3 mt-4"><button className={btnBack} onClick={() => go(-1)}>Previous</button><button className={btnNext} onClick={() => go(1)}>Continue</button></div>
        </div>
      )}

      {(q || screen === 'q3') && (
        <div className="flex flex-col gap-4">
          <h2>{screen === 'q3' ? 'What water problems do you notice? Select all that apply.' : q!.title}</h2>
          <div className={`grid gap-3 ${q?.cards ? 'sm:grid-cols-2' : ''}`}>
            {(screen === 'q3' ? CONCERNS : q!.options).map(([label, sub, icon]) => {
              const on = screen === 'q3' ? r.waterConcerns?.includes(label) : r[q!.key] === val(label);
              return (
                <button key={label} type="button" onClick={() => (screen === 'q3' ? toggle(label) : pick(label))} aria-pressed={on}
                  className={`relative min-h-[60px] rounded-lg shadow-md p-4 text-left text-[var(--color-accent)] border-2 flex flex-col sm:flex-row sm:items-center gap-2 ${on ? 'border-[var(--color-primary)] bg-ice' : 'border-transparent bg-white'}`}>
                  <span className="text-2xl leading-none shrink-0" aria-hidden>{icon}</span>
                  <span className="flex-1"><span className="font-semibold">{label}</span>{sub && <span className="block text-sm font-normal">{sub}</span>}</span>
                  {screen === 'q3' && <span aria-hidden className={`absolute top-3 right-3 sm:static shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center text-sm ${on ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white' : 'border-black/20'}`}>{on ? '✓' : ''}</span>}
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
          <h2>{headline(r.currentSituation)}</h2>
          <div className="card p-6 !transform-none border-t-4 border-[var(--color-primary)]">
            <p className="text-sm font-semibold uppercase tracking-wide">{well ? 'Your custom recommendation' : 'Your recommended system'}</p>
            <p className="text-2xl font-bold text-[var(--color-accent)] mt-1">{rec.name}</p>
            <p className="text-3xl font-bold text-[var(--color-accent)]">{rec.range ?? `$${rec.price.toLocaleString()}`} <span className="text-sm font-normal">{well ? 'depending on your well' : 'installed'}</span></p>
            <ul className="mt-3 flex flex-col gap-1">
              {well && <><li>✓ We’ll test your water for iron, sulfur, and hardness levels</li><li>✓ Inspector consultation included</li></>}
              {(benefits.length ? benefits : ['Better water at every tap']).map((b) => <li key={b}>✓ {b}</li>)}
              <li>✓ Installation in about 4 hours</li>
              {r.householdSize && <li>✓ Sized for a household of {r.householdSize}</li>}
            </ul>
          </div>
          {([['name', 'Name', 'text', 'name'], ['email', 'Email', 'email', 'email'], ['phone', 'Phone', 'tel', 'tel']] as const).map(([k, label, type, ac]) => (
            <label key={k} className="block">
              <span className="font-semibold text-navy text-sm">{label}</span>
              <input className="field" type={type} autoComplete={ac} value={contact[k]} onChange={(e) => setContact({ ...contact, [k]: e.target.value })} />
              {touched && errs[k] && <span className="text-coral text-xs">Enter a valid {label.toLowerCase()}</span>}
            </label>
          ))}
          {status === 'error' && <p className="text-coral font-semibold text-sm">Something went wrong. Please try again or call us.</p>}
          <div className="flex gap-3">
            <button type="button" className={btnBack} onClick={() => go(-1)}>Previous</button>
            <button className={btnNext} disabled={status === 'loading'}>{status === 'loading' ? 'Sending…' : 'Schedule My Consultation'}</button>
          </div>
          <p className="text-xs text-center">Free, no obligation. 🔒 Your information is private.</p>
        </form>
      )}

      {screen === 'thanks' && (
        <div className="card p-8 text-center flex flex-col gap-3 !transform-none">
          <div className="mx-auto w-14 h-14 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-3xl">✓</div>
          <h2>You’re all set, {contact.name.split(' ')[0]}!</h2>
          <p>We’ll {r.communicationPreference === 'Call' ? 'call' : 'text'} you within 1 hour during business hours to schedule your free consultation.</p>
        </div>
      )}
    </div>
  );
}
