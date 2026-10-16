'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SITE } from '@/lib/site';
import { CTA } from '@/lib/analytics';
import { formTypeFor, getAttribution, trackEvent } from '@/lib/analytics/track';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// `variant` switches on the direct-response form (name, mobile, ZIP, build year, best time; posts, then goes to /thanks).
// Without it this is the original consultation form used on the other pages.
export default function LeadForm({ service, variant }: { service: string; variant?: 'hero' | 'footer' }) {
  const router = useRouter();
  const path = usePathname();
  const [f, setF] = useState({ name: '', email: '', phone: '', zip: '', built: 'Not sure', best: 'Anytime' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const start = useRef(0);
  const focusAt = useRef<Record<string, number>>({});
  const submitted = useRef(false);

  useEffect(() => {
    const abandon = () => {
      if (start.current && !submitted.current) trackEvent('form_abandon', { service, form_type: formTypeFor(location.pathname), fields_touched: Object.keys(touched).join(',') });
    };
    window.addEventListener('pagehide', abandon);
    return () => window.removeEventListener('pagehide', abandon);
  });

  const err: Record<string, string> = {};
  if (f.name.trim().length < 2) err.name = 'Enter your name';
  if (!variant && !EMAIL.test(f.email)) err.email = 'Enter a valid email';
  if (!/^\d{5}$/.test(f.zip)) err.zip = 'Enter a 5-digit ZIP';
  if (variant ? f.phone.replace(/\D/g, '').length < 10 : f.phone && f.phone.replace(/\D/g, '').length < 10) err.phone = 'Enter a 10-digit mobile number';

  const bind = (k: keyof typeof f) => ({
    value: f[k] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: k === 'zip' ? e.target.value.replace(/\D/g, '') : e.target.value }),
    onFocus: () => { if (!start.current) { start.current = Date.now(); trackEvent('form_start', { service, form_type: formTypeFor(location.pathname) }); } focusAt.current[k] = Date.now(); },
    onBlur: () => { setTouched((t) => ({ ...t, [k]: true })); },
  });
  const show = (k: string) => touched[k] && err[k];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, zip: true, phone: true });
    if (Object.keys(err).length) return;
    setState('sending');
    const res = await fetch('/api/leads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: f.name, email: f.email, phone: f.phone, zip_code: f.zip, service_type: service, page_source: location.pathname, attribution: getAttribution(),
        ...(variant && { form_variant: variant, home_built: f.built, best_time: f.best }) }),
    }).catch(() => null);
    if (!res?.ok) return setState('error');
    submitted.current = true;
    if (variant) {
      // The conversion event fires once, on /thanks (so a redirect can never drop it).
      try { sessionStorage.setItem('lead_conversion', JSON.stringify({ service, form_type: formTypeFor(location.pathname), seconds_to_submit: Math.round((Date.now() - start.current) / 1000) })); } catch { /* storage blocked: skip the event */ }
      window.dispatchEvent(new Event('lead-submitted'));
      return router.push('/thanks');
    }
    trackEvent('lead_form_submission', { service, form_type: formTypeFor(location.pathname), seconds_to_submit: Math.round((Date.now() - start.current) / 1000), quiz_completed: false });
    window.dispatchEvent(new Event('lead-submitted'));
    setState('done');
  }

  if (state === 'done') {
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return (
      <div className="card p-8 md:p-10 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-aqua text-white flex items-center justify-center text-3xl">✓</div>
        <h2 className="mt-4">You're all set!</h2>
        <p className="mt-2">We'll call you within 10 minutes.</p>
        <p className="text-sm">It's {now}, we're calling now.</p>
      </div>
    );
  }

  if (variant) {
    return (
      <form onSubmit={submit} className="flex flex-col gap-3" noValidate aria-label="Get your fixed price">
        <input type="hidden" name="source" value={`${path} (${variant})`} />
        <Field label="Name" error={show('name')}><input className="field" autoComplete="name" {...bind('name')} /></Field>
        <Field label="Mobile" error={show('phone')}><input className="field" type="tel" inputMode="tel" autoComplete="tel" {...bind('phone')} /></Field>
        <Field label="ZIP code" error={show('zip')}><input className="field" inputMode="numeric" maxLength={5} autoComplete="postal-code" {...bind('zip')} /></Field>
        <Field label="Home built year"><select className="field" value={f.built} onChange={(e) => setF({ ...f, built: e.target.value })}>{['Before 1986', '1986 or later', 'Not sure'].map((o) => <option key={o}>{o}</option>)}</select></Field>
        <Field label="Best time to call"><select className="field" value={f.best} onChange={(e) => setF({ ...f, best: e.target.value })}>{['Morning', 'Afternoon', 'Evening', 'Anytime'].map((o) => <option key={o}>{o}</option>)}</select></Field>
        <button className="btn btn-cta w-full" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : SITE.cta}</button>
        {state === 'error' && <p role="alert" className="text-coral font-semibold text-sm">Something went wrong. Please try again or call {SITE.phoneDisplay}.</p>}
        <p className="text-sm text-center">We call back within {SITE.callbackWindow} during business hours. No obligation. We never sell your number.</p>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="card p-8 md:p-10 flex flex-col gap-3" noValidate>
      <div>
        <h2 className="text-2xl">Talk to a local water specialist</h2>
        <p className="text-sm mt-1">Free and no obligation. Takes about a minute.</p>
      </div>
      <Field label="Name" error={show('name')}><input className="field" autoComplete="name" {...bind('name')} /></Field>
      <Field label="Email" error={show('email')}><input className="field" type="email" autoComplete="email" {...bind('email')} /></Field>
      <Field label="Phone (for your callback)" error={show('phone')}><input className="field" type="tel" autoComplete="tel" {...bind('phone')} /></Field>
      <Field label="ZIP Code" error={show('zip')}><input className="field" inputMode="numeric" maxLength={5} autoComplete="postal-code" {...bind('zip')} /></Field>
      <input type="hidden" name="service_type" value={service} />
      <button className="btn btn-cta w-full" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : CTA}</button>
      {state === 'error' && <p className="text-coral font-semibold text-sm">Something went wrong. Please try again or call us.</p>}
      <p className="text-xs text-center">✓ We'll call you within 10 minutes during business hours</p>
      <p className="text-xs text-center">✓ No credit card required | ✓ Licensed plumbers</p>
      <p className="text-xs text-center text-ink/70">🔒 Your information is private. We never sell it, and there's no spam.</p>
    </form>
  );
}

function Field({ label, badge, error, children }: { label: string; badge?: string; error?: string | false; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-semibold text-ink text-sm">{label}{badge && <span className="ml-2 text-xs bg-ice rounded-full px-2 py-0.5 font-normal">{badge}</span>}</span>
      {children}
      {error && <span role="alert" className="text-coral text-xs">{error}</span>}
    </label>
  );
}
