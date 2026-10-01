'use client';
import { useEffect, useRef, useState } from 'react';
import { CTA_VARIANTS, ctaVariant, track } from '@/lib/analytics';
import WaterReport from './WaterReport';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LeadForm({ service }: { service: string }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', zip: '', report: true });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [cta, setCta] = useState(CTA_VARIANTS[0]);
  const start = useRef(0);
  const focusAt = useRef<Record<string, number>>({});
  const submitted = useRef(false);

  useEffect(() => {
    setCta(ctaVariant());
    const abandon = () => {
      if (start.current && !submitted.current) track('form_abandon', { service, fields: Object.keys(touched) });
    };
    window.addEventListener('pagehide', abandon);
    return () => window.removeEventListener('pagehide', abandon);
  });

  const err: Record<string, string> = {};
  if (f.name.trim().length < 2) err.name = 'Enter your name';
  if (!EMAIL.test(f.email)) err.email = 'Enter a valid email';
  if (!/^\d{5}$/.test(f.zip)) err.zip = 'Enter a 5-digit ZIP';
  if (f.phone && f.phone.replace(/\D/g, '').length < 10) err.phone = 'Enter a 10-digit phone';

  const bind = (k: keyof typeof f) => ({
    value: f[k] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: k === 'zip' ? e.target.value.replace(/\D/g, '') : e.target.value }),
    onFocus: () => { if (!start.current) { start.current = Date.now(); track('form_start', { service }); } focusAt.current[k] = Date.now(); },
    onBlur: () => { setTouched((t) => ({ ...t, [k]: true })); track('field_focus_time', { field: k, ms: Date.now() - focusAt.current[k] }); },
  });
  const show = (k: string) => touched[k] && err[k];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, zip: true, phone: true });
    if (Object.keys(err).length) return;
    setState('sending');
    const res = await fetch('/api/leads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: f.name, email: f.email, phone: f.phone, zip_code: f.zip, service_type: service, page_source: location.pathname, report: f.report }),
    }).catch(() => null);
    if (!res?.ok) return setState('error');
    submitted.current = true;
    track('lead_submit', { service, variant: cta, seconds_to_submit: Math.round((Date.now() - start.current) / 1000) });
    window.dispatchEvent(new Event('lead-submitted'));
    setState('done');
  }

  if (state === 'done') {
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return (
      <div className="card p-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-aqua text-white flex items-center justify-center text-3xl">✓</div>
        <h2 className="mt-4">You're all set!</h2>
        <p className="mt-2">We'll call you within 1 hour.</p>
        <p className="text-sm">It's {now}, we're calling now.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 flex flex-col gap-3" noValidate>
      <h2 className="text-2xl">Get a free quote</h2>
      <Field label="Name" error={show('name')}><input className="field" autoComplete="name" {...bind('name')} /></Field>
      <Field label="Email" error={show('email')}><input className="field" type="email" autoComplete="email" {...bind('email')} /></Field>
      <Field label="Phone" badge="We'll call you once" error={show('phone')}><input className="field" type="tel" autoComplete="tel" {...bind('phone')} /></Field>
      <Field label="ZIP Code" error={show('zip')}><input className="field" inputMode="numeric" maxLength={5} autoComplete="postal-code" {...bind('zip')} /></Field>
      <WaterReport zip={f.zip} />
      <input type="hidden" name="service_type" value={service} />
      <label className="flex items-center gap-3 min-h-12"><input type="checkbox" className="w-5 h-5 accent-[var(--aqua)]" checked={f.report} onChange={(e) => setF({ ...f, report: e.target.checked })} />I'd like a free water quality report</label>
      <button className="btn btn-aqua w-full" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : cta}</button>
      {state === 'error' && <p className="text-coral font-semibold text-sm">Something went wrong. Please try again or call us.</p>}
      <p className="text-xs text-center">✓ No credit card required | ✓ Licensed technicians</p>
      <p className="text-xs text-center">Straight answers from our water experts — no obligation, 100% free.</p>
      <p className="text-xs text-center">We'll call you within 1 hour during business hours</p>
    </form>
  );
}

function Field({ label, badge, error, children }: { label: string; badge?: string; error?: string | false; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-semibold text-navy text-sm">{label}{badge && <span className="ml-2 text-xs bg-ice rounded-full px-2 py-0.5 font-normal">{badge}</span>}</span>
      {children}
      {error && <span className="text-coral text-xs">{error}</span>}
    </label>
  );
}
