'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Honeypot, { hp } from '@/components/Honeypot';
import Icon from '@/components/Icon';
import { WIZARD_EVENT, type WizardDetail } from './openWizard';
import { SERVED_AREA, isServedZip } from '@/lib/serviceArea';
import { TIERS, TAX_NOTE, formatUSD, tierById, type TierId } from '@/lib/pricing';
import { WINDOWS, bookableRange, isoDay, validOrder } from '@/lib/order';
import { STORE } from '@/lib/store';
import { SMS_HREF } from '@/lib/constants';
import { PAIN, painForZip } from '@/lib/pain';
import { getAttribution, trackEvent } from '@/lib/analytics/track';

// One question per screen, each short enough to fit without scrolling. The main button is pinned at the bottom so it is always in reach.
type Step = 'zip' | 'waitlist' | 'waitlist-done' | 'system' | 'contact' | 'schedule' | 'pay' | 'pending';
const STEP_NO: Record<Step, number> = { zip: 1, waitlist: 1, 'waitlist-done': 1, system: 2, contact: 3, schedule: 4, pay: 5, pending: 5 };
const FORM = 'wiz-form';

const post = (url: string, body: unknown) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...hp(), ...(body as object) }) }).then(async (r) => ({ ok: r.ok, json: await r.json().catch(() => ({})) })).catch(() => ({ ok: false, json: {} as Record<string, unknown> }));

const Bot = ({ children }: { children: React.ReactNode }) => (
  <div className="wiz-in flex items-start gap-3">
    <span aria-hidden className="shrink-0 w-9 h-9 rounded-full ico-dark bg-navy text-white flex items-center justify-center"><Icon name="drop" size={20} /></span>
    <div className="rounded-2xl rounded-tl-md bg-white border border-black/[.07] px-4 py-3 text-[16px] leading-snug">{children}</div>
  </div>
);
const Me = ({ children }: { children: React.ReactNode }) => (
  <div className="wiz-in wiz-trail flex justify-end"><div className="rounded-2xl rounded-tr-md bg-ice px-4 py-2.5">{children}</div></div>
);
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="wiz-in rounded-2xl bg-white border border-black/[.06] shadow-[0_1px_0_#fff_inset,0_24px_50px_-34px_rgba(14,33,43,.4)] p-5">{children}</div>
);
const Chip = ({ icon, children }: { icon: string; children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-ice border border-black/[.07] px-3 py-1.5 text-[13px] font-medium"><span className="text-navy"><Icon name={icon} size={16} /></span>{children}</span>
);
const Label = ({ children }: { children: React.ReactNode }) => <span className="block mb-1.5 text-[13px] font-medium text-[#5b6472]">{children}</span>;

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
      if (d.zip && /^\d{5}$/.test(d.zip)) { setZip(d.zip); setStep(isServedZip(d.zip) ? 'system' : 'waitlist'); } else if (!zip) setStep('zip');
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
      const f = Array.from(dialog.current.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea')).filter((x) => !x.hasAttribute('disabled') && !x.hasAttribute('data-hp') && x.tabIndex >= 0 && x.getClientRects().length > 0); // skip anything hidden at this screen size
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (!dialog.current.contains(document.activeElement)) { e.preventDefault(); first.focus(); return; } // focus somehow outside: pull it back in
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key);
    const t = setTimeout(() => dialog.current?.querySelector<HTMLElement>(`#${FORM} input:not([type=radio]):not([data-hp]), #${FORM} input[type=radio]:checked, [data-autofocus]`)?.focus(), 60);
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', key); clearTimeout(t); };
  }, [open, step, close]);

  if (!open) return null;
  const t = tierById(tier)!;
  const { min, max } = bookableRange();
  const digits = (s: string) => s.replace(/\D/g, '');
  const mail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (step === 'zip') {
      if (!/^\d{5}$/.test(zip)) return setErr('Enter a 5-digit ZIP code.');
      return setStep(isServedZip(zip) ? 'system' : 'waitlist');
    }
    if (step === 'system') return setStep('contact');
    if (step === 'waitlist') {
      if (digits(phone).length < 10 && !mail(email)) return setErr('Enter a mobile number or an email so we can reach you.');
      setBusy(true);
      const r = await post('/api/leads', { service_type: 'waitlist', name, phone, email, zip_code: zip, page_source: location.pathname, attribution: getAttribution() });
      setBusy(false);
      return r.ok ? setStep('waitlist-done') : setErr('Something went wrong. Please try again or text us.');
    }
    if (step === 'contact') {
      if (name.trim().length < 2) return setErr('Enter your name.');
      if (digits(phone).length < 10) return setErr('Enter a 10-digit mobile number.');
      if (email && !mail(email)) return setErr('That email does not look right.');
      setBusy(true);
      const r = await post('/api/leads', { service_type: 'instant-price', tier, name, phone, email, zip_code: zip, page_source: location.pathname, attribution: getAttribution() });
      setBusy(false);
      if (!r.ok) return setErr('Something went wrong. Please try again or text us.');
      setLeadId(String(r.json.leadId ?? ''));
      trackEvent('lead_form_submission', { service: 'instant-price', form_type: 'instant_price', quiz_completed: false });
      window.dispatchEvent(new Event('lead-submitted'));
      return setStep('schedule');
    }
    if (step === 'schedule') {
      if (!validOrder({ tier, date, window: win, address })) return setErr('Pick a day at least 6 days out (not Sunday) and enter your full street address.');
      setBusy(true);
      const r = await post('/api/order', { leadId, tier, date, window: win, address, zip, name, phone, email });
      setBusy(false);
      if (!r.ok) return setErr('Something went wrong. Please try again or text us.');
      setLeadId(String(r.json.leadId ?? leadId));
      return setStep('pay');
    }
  }

  async function pay() {
    setBusy(true); setErr('');
    const r = await post('/api/checkout', { leadId, tier, email });
    setBusy(false);
    if (!r.ok) return setErr('Payment could not start. Please try again or text us.');
    if (r.json.payment === 'redirect' && typeof r.json.url === 'string') { window.location.assign(r.json.url); return; }
    setStep('pending');
  }

  const Err = () => (err ? <p role="alert" className="mt-3 text-coral font-medium text-[13px]">{err}</p> : null);
  const input = 'field !min-h-[52px]';

  // The one main action for this screen, pinned at the bottom.
  const action: { label: string; submit?: boolean; onClick?: () => void; dim?: boolean } =
    step === 'zip' ? { label: 'Get my price →', submit: true, dim: zip.length !== 5 }
    : step === 'waitlist' ? { label: busy ? 'Sending…' : 'Join the waitlist', submit: true }
    : step === 'system' ? { label: 'Continue →', submit: true }
    : step === 'contact' ? { label: busy ? 'Saving…' : 'Continue →', submit: true }
    : step === 'schedule' ? { label: busy ? 'Saving…' : 'Continue to payment →', submit: true }
    : step === 'pay' ? { label: busy ? 'Opening payment…' : `Pay ${formatUSD(t.price)} securely →`, onClick: pay }
    : { label: 'Close', onClick: close };

  const said: string[] = [];
  if (STEP_NO[step] > 1 && zip) said.push(zip);
  if (STEP_NO[step] >= 3) said.push(`${t.name} · ${formatUSD(t.price)}`);
  if (STEP_NO[step] >= 5 && date) said.push(`${date} · ${win}`);

  return (
    <div className="fixed inset-0 z-[80] bg-[#0e212b]/45 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={close}>
      <div ref={dialog} role="dialog" aria-modal="true" aria-label="Get your instant price" className="wiz bg-[#f7f2e6]/95 backdrop-blur-2xl w-full sm:max-w-[600px] max-h-[100dvh] sm:max-h-[min(92dvh,760px)] rounded-t-[32px] sm:rounded-[32px] shadow-[0_60px_120px_-40px_rgba(0,0,0,.6)] ring-1 ring-white/60 flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-1 px-5 pt-3" role="progressbar" aria-valuemin={1} aria-valuemax={5} aria-valuenow={STEP_NO[step]} aria-label={`Step ${STEP_NO[step]} of 5`}>
          {[1, 2, 3, 4, 5].map((n) => <span key={n} className={`h-1 flex-1 rounded-full ${n <= STEP_NO[step] ? 'bg-ink' : 'bg-black/[.08]'}`} />)}
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-3">
          <span className="font-mono text-[22px] font-extrabold uppercase tracking-[.03em] text-ink whitespace-nowrap"><span aria-hidden className="text-cta text-[15px] mr-1 align-[1px]">★</span>US Water Pros</span>
          <span className="flex items-center gap-2">
            <button type="button" onClick={reset} className="tap inline-flex items-center gap-1.5 rounded-full bg-white border border-black/[.08] px-3 sm:px-4 min-h-11 text-[14px] font-medium whitespace-nowrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 12a9 9 0 11-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg>Start over
            </button>
            <button type="button" onClick={close} aria-label="Close" className="tap min-h-11 min-w-11 rounded-full bg-white border border-black/[.08] inline-flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </span>
        </div>

        {/* Designed to fit without scrolling. The scroll below only ever appears on very small screens, large text sizes or zoom. */}
        <form id={FORM} onSubmit={onSubmit} noValidate className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 pt-2 pb-4 flex flex-col gap-3">
<Honeypot />
          {said.map((s) => <Me key={s}>{s}</Me>)}

          {step === 'zip' && (<>
            <Bot>Hi, welcome to US Water Pros. About a minute, no call needed.</Bot>
            <Card>
              <div className="flex flex-wrap gap-2"><Chip icon="shield">Licensed local plumbers</Chip><Chip icon="check">Background-checked pros</Chip><Chip icon="check">100% refundable</Chip></div>
              <label className="mt-5 block"><Label>Enter your ZIP to see your price</Label>
                <input className={`${input} text-center !text-[22px] font-mono tracking-[.2em]`} inputMode="numeric" maxLength={5} autoComplete="postal-code" placeholder="ZIP code" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} />
              </label>
              <Err />
              <p className="mt-3 text-center text-[13px] text-[#5b6472]"><b className="font-semibold text-ink">Free to look.</b> No card, no charge until you confirm a booking.</p>
            </Card>
          </>)}

          {step === 'waitlist' && (<>
            <Bot>We&apos;re not installing in {zip} just yet. We are in {SERVED_AREA}, and we&apos;re growing.</Bot>
            <Card>
              <div className="flex flex-col gap-3">
                <label><Label>Name</Label><input className={input} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
                <label><Label>Mobile</Label><input className={input} type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
                <label><Label>Email (optional)</Label><input className={input} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              </div>
              <Err />
              <button type="button" className="mt-2 min-h-11 text-[14px] font-medium underline" onClick={() => setStep('zip')}>Try a different ZIP</button>
            </Card>
          </>)}

          {step === 'waitlist-done' && <Bot>You&apos;re on the list. We&apos;ll contact you when we start installing in {zip}.</Bot>}

          {step === 'system' && (<>
            <Bot>Great, we install in {zip}. Pick a system and I&apos;ll lock in your exact price.</Bot>
            <Card>
              <fieldset className="flex flex-col gap-2">
                <legend className="sr-only">Choose a system</legend>
                {TIERS.map((x) => (
                  <label key={x.id} className={`tile flex items-center gap-3 !rounded-2xl p-3.5 cursor-pointer min-h-14 ${tier === x.id ? 'tile-on' : ''}`}>
                    <input type="radio" name="tier" className="w-[18px] h-[18px] accent-[#1d1d1f]" checked={tier === x.id} onChange={() => setTier(x.id)} />
                    <span className="flex-1"><span className="font-medium">{x.name}</span>{x.popular && <span className="ml-2 text-[11px] font-semibold rounded-full bg-ink text-white px-2 py-0.5">Most homes</span>}<span className="wiz-short-hide block text-[14px] font-light text-[#5b6472]">{x.subhead}</span></span>
                    <span className="font-mono font-semibold">{formatUSD(x.price)}</span>
                  </label>
                ))}
              </fieldset>
              <p className="wiz-short-hide mt-3 text-[13px] text-[#5b6472]">{formatUSD(t.price)} {TAX_NOTE}. {STORE.refund}</p>
            </Card>
          </>)}

          {step === 'contact' && (<>
            <Bot>Where should we text your price and confirm your install?</Bot>
            <Card>
              <div className="flex flex-col gap-3">
                <label><Label>Name</Label><input className={input} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
                <label><Label>Mobile</Label><input className={input} type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
                <label><Label>Email (optional)</Label><input className={input} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              </div>
              <Err />
            </Card>
          </>)}

          {step === 'schedule' && (<>
            <Bot>Locked in at {formatUSD(t.price)}. When should the plumber come? It takes about 4 hours. {STORE.confirm}</Bot>
            <Card>
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <label><Label>Day</Label><input className={input} type="date" min={isoDay(min)} max={isoDay(max)} value={date} onChange={(e) => setDate(e.target.value)} /></label>
                  <label><Label>Time of day</Label><select className={input} value={win} onChange={(e) => setWin(e.target.value as (typeof WINDOWS)[number])}>{WINDOWS.map((w) => <option key={w}>{w}</option>)}</select></label>
                </div>
                <label><Label>Street address, city and ZIP</Label><input className={input} autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} /></label>
              </div>
              <Err />
            </Card>
          </>)}

          {step === 'pay' && (<>
            <Bot>Here&apos;s your order. Check it over, then pay to lock in your day.</Bot>
            <Card>
              <dl className="flex flex-col gap-2.5">
                <div className="flex justify-between gap-4"><dt className="text-[#5b6472]">System</dt><dd className="font-medium">{t.name}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[#5b6472]">Install</dt><dd className="font-medium">{date} · {win}</dd></div>
                <div className="flex justify-between gap-4 border-t border-black/[.08] pt-2.5"><dt className="text-[#5b6472]">Total</dt><dd className="font-mono font-semibold">{formatUSD(t.price)} <span className="font-sans font-normal text-[13px]">{TAX_NOTE}</span></dd></div>
              </dl>
              <p className="mt-3 text-[13px] text-[#5b6472]">{STORE.payment} {STORE.refund}{STORE.refundTerms ? ` ${STORE.refundTerms}` : ''}</p>
              <Err />
            </Card>
          </>)}

          {step === 'pending' && <Bot>We have your {t.name} order for {date}. We&apos;ll text you a secure payment link shortly. Nothing is charged until you pay it, and every order is {STORE.refund.toLowerCase()}</Bot>}
        </form>

        {/* Pinned: the main action is always visible, so nobody has to scroll to find it. */}
        <div className="border-t border-black/[.06] bg-white/80 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col gap-2.5">
          <button type={action.submit ? 'submit' : 'button'} form={action.submit ? FORM : undefined} onClick={action.onClick} disabled={busy} aria-disabled={action.dim || undefined} className={`btn btn-cta w-full ${action.dim ? 'opacity-45' : ''}`} data-autofocus={step === 'waitlist-done' || step === 'pending' ? true : undefined}>{action.label}</button>
          <a href={SMS_HREF} className="wiz-compose items-center gap-3 rounded-full bg-white border border-black/[.1] pl-4 pr-1.5 min-h-[48px] text-[#5b6472]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" /></svg>
            <span className="flex-1 text-[15px]">Questions? Text us. We reply fast.</span>
            <span aria-hidden className="w-9 h-9 rounded-full bg-navy/10 text-navy inline-flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg></span>
          </a>
          <p className="flex flex-wrap items-center justify-center gap-x-4 text-[12px] text-[#5b6472]">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 118 0v4" /></svg>Checkout secured by <b className="font-semibold text-navy">Stripe</b></span>
            <a href={SMS_HREF} className="wiz-textlink underline font-medium min-h-11 items-center whitespace-nowrap">Questions? Text us</a>
          </p>
        </div>
      </div>
    </div>
  );
}
