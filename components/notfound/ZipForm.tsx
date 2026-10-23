'use client';
import { useState } from 'react';
import { openWizard } from '@/components/store/openWizard';

// With JavaScript: opens the Get Instant Price modal with the ZIP filled in. Without it: a plain GET to /pricing.
export default function ZipForm({ label, button }: { label: string; button: string }) {
  const [zip, setZip] = useState('');
  return (
    <form action="/pricing" method="get" className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto"
      onSubmit={(e) => { e.preventDefault(); openWizard(/^\d{5}$/.test(zip) ? { zip } : {}, e.currentTarget); }}>
      <label className="flex-1"><span className="sr-only">{label}</span>
        <input name="zip" className="field !min-h-[52px] text-center !text-[20px] font-mono tracking-[.2em]" inputMode="numeric" maxLength={5} autoComplete="postal-code" placeholder="ZIP code" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} />
      </label>
      <button type="submit" className="btn btn-cta">{button}</button>
    </form>
  );
}
