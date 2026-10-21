'use client';
import { useState } from 'react';
import { openWizard } from './openWizard';
import { STORE } from '@/lib/store';
import { SMS_HREF } from '@/lib/constants';

// Replaces the old callback form: a ZIP field that opens the wizard. Text us is the secondary action.
export default function InstantPriceBox({ heading = 'Get your instant price' }: { heading?: string }) {
  const [zip, setZip] = useState('');
  return (
    <form className="card p-6 md:p-8 !transform-none flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); openWizard({ zip: zip.length === 5 ? zip : undefined }, e.currentTarget); }}>
      <h2 className="text-2xl">{heading}</h2>
      <p className="!py-0 text-sm">Enter your ZIP. See the price for your home in under a minute. No call needed.</p>
      <label className="block"><span className="font-semibold text-ink text-sm">ZIP code</span>
        <input className="field" inputMode="numeric" maxLength={5} autoComplete="postal-code" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} />
      </label>
      <button className="btn btn-cta w-full">{STORE.cta}</button>
      <a href={SMS_HREF} className="btn btn-secondary w-full">{STORE.secondary}</a>
    </form>
  );
}
