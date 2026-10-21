'use client';
import { useState } from 'react';
import { openWizard } from './openWizard';
import { ZIP_EVENT } from '@/components/HeroHeadline';
import { STORE } from '@/lib/store';

// ZIP field plus the primary "Get Instant Price" button. `stacked` is the full-width version used in the mobile menu.
export default function HeaderZip({ stacked = false, onDone }: { stacked?: boolean; onDone?: () => void }) {
  const [zip, setZip] = useState('');
  return (
    <form
      className={stacked ? 'flex flex-col gap-3' : 'flex items-center gap-2'}
      onSubmit={(e) => { e.preventDefault(); onDone?.(); openWizard({ zip: zip.length === 5 ? zip : undefined }, e.currentTarget); }}
    >
      <input
        aria-label="ZIP code" placeholder="ZIP code" inputMode="numeric" maxLength={5} autoComplete="postal-code" value={zip}
        className={stacked ? 'field' : 'field !w-28 !min-h-12 hidden lg:block'}
        onChange={(e) => { const z = e.target.value.replace(/\D/g, ''); setZip(z); if (z.length === 5) window.dispatchEvent(new CustomEvent(ZIP_EVENT, { detail: z })); }}
      />
      <button className={stacked ? 'btn btn-cta' : 'btn btn-cta hidden md:inline-flex'}>{STORE.cta}</button>
    </form>
  );
}
