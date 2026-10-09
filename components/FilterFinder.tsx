'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackEvent } from '@/lib/analytics/track';

// Full-width ZIP banner. Hands the ZIP to the Tools page report card (via sessionStorage, so it never lands in a URL).
export default function FilterFinder() {
  const router = useRouter();
  const [zip, setZip] = useState('');
  const ok = zip.length === 5;

  function go(e: React.FormEvent) {
    e.preventDefault();
    if (!ok) return;
    try { sessionStorage.setItem('wr_zip', zip); } catch { /* private mode: they just retype it on the tools page */ }
    trackEvent('tool_start', { tool_name: 'filter_finder' });
    router.push('/tools#report');
  }

  return (
    <section data-track-source="filter_finder" className="bg-navy py-12 md:py-16">
      <form onSubmit={go} className="mx-auto max-w-6xl px-4 grid gap-6 md:grid-cols-[1fr_auto_auto] md:items-end">
        <div>
          <h2 className="!text-white">What filter is right for you?</h2>
          <p className="mt-2 text-white/90">Enter your ZIP code to see what’s in your area’s water.</p>
        </div>
        <label className="block">
          <span className="block text-sm font-semibold text-white mb-1">ZIP code</span>
          <input className="field md:w-56" inputMode="numeric" maxLength={5} autoComplete="postal-code" placeholder="98402" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} />
        </label>
        <button className="btn btn-cta disabled:opacity-50 disabled:cursor-not-allowed" disabled={!ok}>See Results</button>
      </form>
    </section>
  );
}
