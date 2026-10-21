'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import { WIZARD_EVENT, type WizardDetail } from './openWizard';
import { SERVED_AREA, isServedZip } from '@/lib/serviceArea';
import { TIERS, TAX_NOTE, formatUSD, tierById, type TierId } from '@/lib/pricing';
import { WINDOWS, bookableRange, isoDay, validOrder } from '@/lib/order';
import { STORE } from '@/lib/store';
import { SMS_HREF } from '@/lib/constants';
import { PAIN, painForZip } from '@/lib/pain';
import { getAttribution, trackEvent } from '@/lib/analytics/track';

type Step = 'zip' | 'waitlist' | 'waitlist-done' | 'price' | 'schedule' | 'pay' | 'pending';

const post = (url: string, body: unknown) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(async (r) => ({ ok: r.ok, json: await r.json().catch(() => ({})) })).catch(() => ({ ok: false, json: {} as Record<string, unknown> }));

// Small building blocks for the chat look: an assistant bubble, the customer's answer, and the card the current question lives in.
const Bot = ({ children }: { children: React.ReactNode }) => (
  <div className="wiz-in flex items-start gap-3">
    <span aria-hidden className="shrink-0 w-9 h-9 rounded-full bg-[#007c94] text-white flex items-center justify-center"><Icon name="drop" size={18} /></span>
    <div className="rounded-2xl rounded-tl-md bg-white border border-black/[.07] px-4 py-3 text-[16px] leading-snug">{children}</div>
  </div>
);
const Me = ({ children }: { children: React.ReactNode }) => (
  <div className="wiz-in flex justify-end"><div className="rounded-2xl rounded-tr-md bg-[#e1f4f7] px-4 py-2.5">{children}</div></div>
);
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="wiz-in rounded-2xl bg-white border border-[#00a0bf]/35 p-5 md:p-6">{children}</div>
);
const Chip = ({ icon, children }: { icon: string; children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f8f6] border border-black/[.07] px-3 py-1.5 text-[13px] font-medium"><span className="text-[#007c94]"><Icon name={icon} size={14} /></span>{children}</span>
);
const Label = ({ children }: { children: React.ReactNode }) => <span className="block mb-1.5 text-[13px] font-medium text-[#3f4a4f]">{children}</span>;

export default function Wizard() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('zip');
  const [zip, setZip] = useState('');
  const [tier, setTier] = useState<TierId>('complete');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [win, setWin] = useState<(typeof WINDOWS)[number]>('Morning');
  const [address, setAddress] = useState('');
  const [leadId, setLeadId] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const started = useRef(false);
  const dialog = useRef<HTMLDivElement>(null);
  const returnTo = useRef<Element | null>(null);

  const close = useCallback(() => { setOpen(false); (returnTo.current as HTMLElement | null)?.focus?.(); }, []);
  const reset = () => { setStep('zip'); setZip(''); setTier('complete'); setName(''); setPhone(''); setEmail(''); setDate(''); setWin('Morning'); setAddress(''); setLeadId(''); setErr(''); };

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = ((e as CustomEvent).detail ?? {}) as WizardDetail;
      returnTo.current = document.activeElement;
      const area = d.zip ? painForZip(d.zip) : null;
      if (d.tier && tierById(d.tier)) setTier(d.tier as TierId); else if (area) setTier(PAIN[area].tier);
      setErr('');
      if (d.zip && /^\d{5}$/.test(d.zip)) { setZip(d.zip); setStep(isServedZip(d.zip) ? 'price' : 'waitlist'); } else if (!zip) setStep('zip');
      setOpen(true);
      if (!started.current) { started.current = true; trackEvent('tool_start', { tool_name: 'instant_price_wizard' }); }
    };
    window.addEventListener(WIZARD_EVENT, onOpen);
    return () => window.removeEventListener(WIZARD_EVENT, onOpen);
  }, [zip]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab' || !dialog.current) return;
      const f = Array.from(dialog.current.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea')).filter((x) => !x.hasAttribute('disabled'));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key);
    const t = setTimeout(() => dialog.current?.querySelector<HTMLElement>('form input, form button, [data-autofocus]')?.focus(), 60);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', key); clearTimeout(t); };
  }, [open, step, close]);

  if (!open) return null;
  const t = tierById(tier)!;
  const { min, max } = bookableRange();
  const digits = (s: string) => s.replace(/\D/g, '');

  async function submitZip(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) return setErr('Enter a 5-digit ZIP code.');
    setErr(''); setStep(isServedZip(zip) ? 'price' : 'waitlist');
  }

  async function submitWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (digits(phone).length < 10 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr('Enter a mobile number or an email so we can reach you.');
    setBusy(true); setErr('');
    const r = await post('/api/leads', { service_type: 'waitlist', name, phone, email, zip_code: zip, page_source: location.pathname, attribution: getAttribution() });
    setBusy(false);
    if (!r.ok) return setErr('Something went wrong. Please try again or text us.');
    setStep('waitlist-done');
  }

  async function submitPrice(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setErr('Enter your name.');
    if (digits(phone).length < 10) return setErr('Enter a 10-digit mobile number.');
    setBusy(true); setErr('');
    const r = await post('/api/leads', { service_type: 'instant-price', tier, name, phone, email, zip_code: zip, page_source: location.pathname, attribution: getAttribution() });
    setBusy(false);
    if (!r.ok) return setErr('Something went wrong. Please try again or text us.');
    setLeadId(String(r.json.leadId ?? ''));
    trackEvent('lead_form_submission', { service: 'instant-price', form_type: 'instant_price', quiz_completed: false });
    window.dispatchEvent(new Event('lead-submitted'));
    setStep('schedule');
  }

  async function submitSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!validOrder({ tier, date, window: win, address })) return setErr('Pick a day at least 3 days out (not Sunday) and enter your full street address.');
    setBusy(true); setErr('');
    const r = await post('/api/order', { leadId, tier, date, window: win, address, zip, name, phone, email });
    setBusy(false);
    if (!r.ok) return setErr('Something went wrong. Please try again or text us.');
    setLeadId(String(r.json.leadId ?? leadId));
    setStep('pay');
  }

  async function pay() {
    setBusy(true); setErr('');
    const r = await post('/api/checkout', { leadId, tier, email });
    setBusy(false);
    if (!r.ok) return setErr('Payment could not start. Please try again or text us.');
    if (r.json.payment === 'redirect' && typeof r.json.url === 'string') { window.location.assign(r.json.url); return; }
    setStep('pending');
  }

  const stepNo = { zip: 1, waitlist: 1, 'waitlist-done': 1, price: 2, schedule: 3, pay: 4, pending: 4 }[step];
  const Err = () => (err ? <p role="alert" className="text-coral font-medium text-[13px]">{err}</p> : null);
  const input = 'field !min-h-[52px]';
  const cta = 'btn btn-cta w-full';

  // What the customer has already told us, shown as chat bubbles above the current question.
  const said: string[] = [];
  if (step !== 'zip' && zip) said.push(zip);
  if (['schedule', 'pay', 'pending'].includes(step)) said.push(`${t.name} · ${formatUSD(t.price)}`);
  if (['pay', 'pending'].includes(step) && date) said.push(`${date} · ${win}`);

  return (
    <div className="fixed inset-0 z-[80] bg-[#0b2530]/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={close}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-label="Get your instant price" className="wiz bg-[#f6faf8] w-full sm:max-w-[620px] h-[94vh] sm:h-auto sm:max-h-[92vh] rounded-t-[28px] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="h-[3px] bg-black/[.06]" aria-hidden><div className="h-full bg-[#00a0bf] transition-all duration-300" style={{ width: `${stepNo * 25}%` }} /></div>

        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-black/[.06] bg-white/60">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-black/[.07] px-2.5 sm:px-3 py-2 font-semibold text-[14px] sm:text-[15px] whitespace-nowrap"><span className="text-[#0066cc]"><Icon name="drop" size={16} /></span>US Water <span className="text-[#0066cc]">Pros</span></span>
          <span className="flex items-center gap-2">
            <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-black/[.08] px-3 sm:px-4 min-h-11 text-[13px] sm:text-[14px] font-medium whitespace-nowrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 12a9 9 0 11-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>Start over
            </button>
            <button type="button" onClick={close} aria-label="Close" className="min-h-11 min-w-11 rounded-full bg-white border border-black/[.08] inline-flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </span>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
          {said.map((s) => <Me key={s}>{s}</Me>)}

          {step === 'zip' && (<>
            <Bot>Hi, welcome to US Water Pros. Here&apos;s how fast this goes:</Bot>
            <Card>
              <h2>About a minute. No call needed.</h2>
              <ol className="mt-4 flex flex-col gap-3.5">
                {[['Your ZIP and phone', 'Takes seconds'], ['Pick your system', 'See your exact price'], ['Choose your day and pay', 'You pay the price you see']].map(([a, b], i) => (
                  <li key={a} className="flex items-start gap-3">
                    <span aria-hidden className="shrink-0 w-8 h-8 rounded-lg bg-[#e8f6f2] text-[#007c94] text-[13px] font-semibold flex items-center justify-center">{i + 1}</span>
                    <span><span className="block font-medium">{a}</span><span className="block text-[14px] text-[#4b5a60]">{b}</span></span>
                  </li>
                ))}
              </ol>
              <div className="mt-5 flex flex-wrap gap-2"><Chip icon="shield">Licensed local plumbers</Chip><Chip icon="check">Background-checked pros</Chip><Chip icon="check">100% refundable</Chip></div>
              <form onSubmit={submitZip} className="mt-6 flex flex-col gap-3">
                <label><Label>Enter your ZIP to get started</Label>
                  <input className={`${input} text-center !text-[20px] tracking-[.18em]`} inputMode="numeric" maxLength={5} autoComplete="postal-code" placeholder="ZIP code" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} />
                </label>
                <Err />
                <button aria-disabled={zip.length !== 5} className={`${cta} ${zip.length === 5 ? '' : 'opacity-45'}`}>Get my price →</button>
                <p className="text-center text-[13px] text-[#4b5a60]"><b className="font-semibold text-ink">Free to look.</b> No card, no charge until you confirm a booking.</p>
              </form>
            </Card>
          </>)}

          {step === 'waitlist' && (<>
            <Bot>We&apos;re not installing in {zip} just yet. We are in {SERVED_AREA}, and we&apos;re growing.</Bot>
            <Card>
              <h2>Join the waitlist</h2>
              <p className="mt-1 text-[#4b5a60]">Leave your contact and we&apos;ll tell you the day we reach your area.</p>
              <form onSubmit={submitWaitlist} className="mt-4 flex flex-col gap-3.5">
                <label><Label>Name</Label><input className={input} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
                <label><Label>Mobile</Label><input className={input} type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
                <label><Label>Email (optional)</Label><input className={input} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
                <Err /><button className={cta} disabled={busy}>{busy ? 'Sending…' : 'Join the waitlist'}</button>
                <button type="button" className="min-h-11 text-[14px] font-medium underline" onClick={() => setStep('zip')}>Try a different ZIP</button>
              </form>
            </Card>
          </>)}

          {step === 'waitlist-done' && (<>
            <Bot>You&apos;re on the list. We&apos;ll contact you when we start installing in {zip}.</Bot>
            <button className={cta} onClick={close} data-autofocus>Close</button>
          </>)}

          {step === 'price' && (<>
            <Bot>Great, we install in {zip}. Pick a system and I&apos;ll lock in your exact price.</Bot>
            <Card>
              <form onSubmit={submitPrice} className="flex flex-col gap-4">
                <fieldset className="flex flex-col gap-2">
                  <legend className="sr-only">Choose a system</legend>
                  {TIERS.map((x) => (
                    <label key={x.id} className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer min-h-14 ${tier === x.id ? 'border-[#00a0bf] bg-[#effef8]' : 'border-black/[.12] bg-white'}`}>
                      <input type="radio" name="tier" className="mt-1 w-[18px] h-[18px] accent-[#00a0bf]" checked={tier === x.id} onChange={() => setTier(x.id)} />
                      <span className="flex-1"><span className="font-medium">{x.name}</span>{x.popular && <span className="ml-2 text-[11px] rounded-full bg-[#1b4965] text-white px-2 py-0.5">Most homes</span>}<span className="block text-[14px] text-[#4b5a60]">{x.subhead}</span></span>
                      <span className="font-semibold">{formatUSD(x.price)}</span>
                    </label>
                  ))}
                </fieldset>
                <p className="text-[13px] text-[#4b5a60]">{formatUSD(t.price)} {TAX_NOTE}. {STORE.refund}</p>
                <label><Label>Name</Label><input className={input} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
                <label><Label>Mobile (we text you this price)</Label><input className={input} type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
                <label><Label>Email (optional)</Label><input className={input} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
                <Err /><button className={cta} disabled={busy}>{busy ? 'Saving…' : 'Continue →'}</button>
              </form>
            </Card>
          </>)}

          {step === 'schedule' && (<>
            <Bot>Locked in at {formatUSD(t.price)}. When should the plumber come? A licensed local plumber installs it in about 4 hours, and we text you to confirm the exact time.</Bot>
            <Card>
              <form onSubmit={submitSchedule} className="flex flex-col gap-3.5">
                <label><Label>Day</Label><input className={input} type="date" min={isoDay(min)} max={isoDay(max)} value={date} onChange={(e) => setDate(e.target.value)} /></label>
                <label><Label>Time of day</Label><select className={input} value={win} onChange={(e) => setWin(e.target.value as (typeof WINDOWS)[number])}>{WINDOWS.map((w) => <option key={w}>{w}</option>)}</select></label>
                <label><Label>Street address, city and ZIP</Label><input className={input} autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} /></label>
                <Err /><button className={cta} disabled={busy}>{busy ? 'Saving…' : 'Continue to payment →'}</button>
              </form>
            </Card>
          </>)}

          {step === 'pay' && (<>
            <Bot>Here&apos;s your order. Check it over, then pay to lock in your day.</Bot>
            <Card>
              <dl className="flex flex-col gap-2.5">
                <div className="flex justify-between gap-4"><dt className="text-[#4b5a60]">System</dt><dd className="font-medium">{t.name}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[#4b5a60]">Install</dt><dd className="font-medium">{date} · {win}</dd></div>
                <div className="flex justify-between gap-4 border-t border-black/[.08] pt-2.5"><dt className="text-[#4b5a60]">Total</dt><dd className="font-semibold">{formatUSD(t.price)} <span className="font-normal text-[13px]">{TAX_NOTE}</span></dd></div>
              </dl>
              <p className="mt-4 text-[14px] text-[#4b5a60]">{STORE.payment} {STORE.refund}{STORE.refundTerms ? ` ${STORE.refundTerms}` : ''}</p>
              <div className="mt-4 flex flex-col gap-3"><Err /><button className={cta} onClick={pay} disabled={busy}>{busy ? 'Opening payment…' : `Pay ${formatUSD(t.price)} securely →`}</button></div>
            </Card>
          </>)}

          {step === 'pending' && (<>
            <Bot>We have your {t.name} order for {date}. We&apos;ll text you a secure payment link shortly. Nothing is charged until you pay it, and every order is {STORE.refund.toLowerCase()}</Bot>
            <a href={SMS_HREF} className="btn btn-secondary w-full">{STORE.secondary}</a>
            <button className={cta} onClick={close}>Close</button>
          </>)}
        </div>

        <footer className="border-t border-black/[.06] bg-white/70 px-5 pt-3 pb-4 flex flex-col gap-2.5">
          <a href={SMS_HREF} className="flex items-center gap-3 rounded-full bg-white border border-black/[.1] pl-4 pr-1.5 min-h-[52px] text-[#3f4a4f]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" /></svg>
            <span className="flex-1 text-[15px]">Questions? Text us.<span className="hidden sm:inline"> We reply fast.</span></span>
            <span aria-hidden className="w-10 h-10 rounded-full bg-[#00a0bf]/15 text-[#007c94] inline-flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg></span>
          </a>
          <p className="flex items-center justify-center gap-1.5 text-[12px] text-[#4b5a60]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 118 0v4" /></svg>
            Checkout secured by <b className="font-semibold text-[#635bff]">Stripe</b>
          </p>
        </footer>
      </div>
    </div>
  );
}
