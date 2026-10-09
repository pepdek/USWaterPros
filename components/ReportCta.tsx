'use client';
import { useState } from 'react';
import { getAttribution, trackEvent } from '@/lib/analytics/track';
import WaterReport from './WaterReport';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Email + ZIP capture; shows the ZIP's water report on success.
export default function ReportCta() {
  const [email, setEmail] = useState('');
  const [zip, setZip] = useState('');
  const [done, setDone] = useState('');
  const [err, setErr] = useState('');

  async function go(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL.test(email) || !/^\d{5}$/.test(zip)) return setErr('Enter a valid email and 5-digit ZIP.');
    setErr('');
    const res = await fetch('/api/leads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, zip_code: zip, service_type: 'water-report', page_source: location.pathname, attribution: getAttribution() }),
    }).catch(() => null);
    if (!res?.ok) return setErr('Something went wrong. Please try again.');
    trackEvent('water_report_submit', { form_type: 'water_report_block' });
    setDone(zip);
  }

  return (
    <section className="bg-surge">
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-20 text-center">
        <h2 className="!text-white">Get a free water quality report for your ZIP code in 30 seconds.</h2>
        {done ? (
          <div className="mt-6 text-left"><WaterReport zip={done} /></div>
        ) : (
          <form onSubmit={go} noValidate className="mt-6 flex flex-col sm:flex-row gap-3">
            <input className="field flex-1" type="email" placeholder="Email" aria-label="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="field sm:w-36" inputMode="numeric" maxLength={5} placeholder="ZIP code" aria-label="ZIP code" autoComplete="postal-code" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} />
            <button className="btn btn-cta">Go</button>
          </form>
        )}
        {err && <p className="mt-2 text-white font-semibold text-sm">{err}</p>}
        <p className="mt-3 text-white/90 text-xs">🔒 Private. No spam, no obligation.</p>
      </div>
    </section>
  );
}
