'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { WIZARD_EVENT, type WizardDetail } from './openWizard';
import { SERVED_AREA, isServedZip } from '@/lib/serviceArea';
import { TIERS, TAX_NOTE, formatUSD, tierById, type TierId } from '@/lib/pricing';
import { WINDOWS, bookableRange, isoDay, validOrder } from '@/lib/order';
import { STORE } from '@/lib/store';
import { SMS_HREF } from '@/lib/constants';
import { getAttribution, trackEvent } from '@/lib/analytics/track';

type Step = 'zip' | 'waitlist' | 'waitlist-done' | 'price' | 'schedule' | 'pay' | 'pending';

const post = (url: string, body: unknown) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(async (r) => ({ ok: r.ok, json: await r.json().catch(() => ({})) })).catch(() => ({ ok: false, json: {} as Record<string, unknown> }));

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

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = ((e as CustomEvent).detail ?? {}) as WizardDetail;
      returnTo.current = document.activeElement;
      if (d.tier && tierById(d.tier)) setTier(d.tier as TierId);
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
    const t = setTimeout(() => dialog.current?.querySelector<HTMLElement>('input, button')?.focus(), 50);
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

  const n = { zip: 1, waitlist: 1, 'waitlist-done': 1, price: 2, schedule: 3, pay: 4, pending: 4 }[step];
  const Err = () => (err ? <p role="alert" className="text-coral font-semibold text-sm">{err}</p> : null);
  const field = 'block';

  return (
    <div className="fixed inset-0 z-[80] bg-navy/60 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={close}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="wiz-h" className="bg-white w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 md:p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={close} aria-label="Close" className="absolute top-3 right-4 min-h-11 min-w-11 text-2xl text-ink/60">✕</button>
        <p className="text-sm font-semibold text-teal !py-0">{step.startsWith('waitlist') ? 'Join the waitlist' : `Step ${n} of 4`}</p>

        {step === 'zip' && (
          <form onSubmit={submitZip} className="mt-2 flex flex-col gap-4">
            <h2 id="wiz-h" className="text-2xl">Where is your home?</h2>
            <label className={field}><span className="font-semibold text-ink">ZIP code</span><input className="field" inputMode="numeric" maxLength={5} autoComplete="postal-code" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} /></label>
            <Err /><button className="btn btn-cta w-full">Continue</button>
          </form>
        )}

        {step === 'waitlist' && (
          <form onSubmit={submitWaitlist} className="mt-2 flex flex-col gap-4">
            <h2 id="wiz-h" className="text-2xl">We&apos;re not in {zip} yet.</h2>
            <p>We install in {SERVED_AREA} for now. Leave your contact and we&apos;ll tell you the day we reach your area.</p>
            <label className={field}><span className="font-semibold text-ink">Name</span><input className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className={field}><span className="font-semibold text-ink">Mobile</span><input className="field" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
            <label className={field}><span className="font-semibold text-ink">Email (optional)</span><input className="field" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <Err /><button className="btn btn-cta w-full" disabled={busy}>{busy ? 'Sending…' : 'Join the waitlist'}</button>
            <button type="button" className="underline text-ink font-semibold min-h-11" onClick={() => setStep('zip')}>Try a different ZIP</button>
          </form>
        )}

        {step === 'waitlist-done' && (
          <div className="mt-2 flex flex-col gap-4">
            <h2 id="wiz-h" className="text-2xl">You&apos;re on the list.</h2>
            <p>We&apos;ll contact you when we start installing in {zip}.</p>
            <button className="btn btn-cta w-full" onClick={close}>Close</button>
          </div>
        )}

        {step === 'price' && (
          <form onSubmit={submitPrice} className="mt-2 flex flex-col gap-4">
            <h2 id="wiz-h" className="text-2xl">Your price</h2>
            <fieldset className="flex flex-col gap-2">
              <legend className="sr-only">Choose a system</legend>
              {TIERS.map((x) => (
                <label key={x.id} className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer min-h-14 ${tier === x.id ? 'border-teal bg-ice' : 'border-black/15'}`}>
                  <input type="radio" name="tier" className="mt-1 w-5 h-5 accent-[#00a0bf]" checked={tier === x.id} onChange={() => setTier(x.id)} />
                  <span className="flex-1"><b className="text-ink">{x.name}</b>{x.popular && <span className="ml-2 text-xs rounded-full bg-navy text-white px-2 py-0.5">Most homes</span>}<br /><span className="text-sm">{x.subhead}</span></span>
                  <b className="text-ink">{formatUSD(x.price)}</b>
                </label>
              ))}
            </fieldset>
            <p className="!py-0 text-sm">{formatUSD(t.price)} {TAX_NOTE}. {STORE.refund}</p>
            <label className={field}><span className="font-semibold text-ink">Name</span><input className="field" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className={field}><span className="font-semibold text-ink">Mobile (we text you this price)</span><input className="field" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
            <label className={field}><span className="font-semibold text-ink">Email (optional)</span><input className="field" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <Err /><button className="btn btn-cta w-full" disabled={busy}>{busy ? 'Saving…' : 'Continue'}</button>
          </form>
        )}

        {step === 'schedule' && (
          <form onSubmit={submitSchedule} className="mt-2 flex flex-col gap-4">
            <h2 id="wiz-h" className="text-2xl">Pick your install day</h2>
            <p>A licensed local plumber installs it in about 4 hours. We text you to confirm the exact time.</p>
            <label className={field}><span className="font-semibold text-ink">Day</span><input className="field" type="date" min={isoDay(min)} max={isoDay(max)} value={date} onChange={(e) => setDate(e.target.value)} /></label>
            <label className={field}><span className="font-semibold text-ink">Time of day</span><select className="field" value={win} onChange={(e) => setWin(e.target.value as (typeof WINDOWS)[number])}>{WINDOWS.map((w) => <option key={w}>{w}</option>)}</select></label>
            <label className={field}><span className="font-semibold text-ink">Street address, city and ZIP</span><input className="field" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} /></label>
            <Err /><button className="btn btn-cta w-full" disabled={busy}>{busy ? 'Saving…' : 'Continue to payment'}</button>
          </form>
        )}

        {step === 'pay' && (
          <div className="mt-2 flex flex-col gap-4">
            <h2 id="wiz-h" className="text-2xl">Confirm and pay</h2>
            <dl className="rounded-xl bg-ice p-4 flex flex-col gap-1">
              <div className="flex justify-between"><dt>System</dt><dd className="font-semibold text-ink">{t.name}</dd></div>
              <div className="flex justify-between"><dt>Install</dt><dd className="font-semibold text-ink">{date} · {win}</dd></div>
              <div className="flex justify-between"><dt>Total</dt><dd className="font-semibold text-ink">{formatUSD(t.price)} {TAX_NOTE}</dd></div>
            </dl>
            <p>{STORE.payment} {STORE.refund}{STORE.refundTerms ? ` ${STORE.refundTerms}` : ''}</p>
            <Err /><button className="btn btn-cta w-full" onClick={pay} disabled={busy}>{busy ? 'Opening payment…' : `Pay ${formatUSD(t.price)} securely`}</button>
          </div>
        )}

        {step === 'pending' && (
          <div className="mt-2 flex flex-col gap-4">
            <h2 id="wiz-h" className="text-2xl">We have your order.</h2>
            <p>We have your {t.name} order for {date}. We&apos;ll text you a secure payment link shortly. Nothing is charged until you pay it, and every order is {STORE.refund.toLowerCase()}</p>
            <a href={SMS_HREF} className="btn btn-secondary w-full">{STORE.secondary}</a>
            <button className="btn btn-cta w-full" onClick={close}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
