'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { trackEvent } from '@/lib/analytics/track';
import { PHONE, PHONE_HREF, SMS_HREF } from '@/lib/constants';
import { TAX_NOTE, flagshipPrice } from '@/lib/pricing';
import { AREA_SHORTCUTS, ewgZipUrl, profileForZip, type Likelihood } from '@/lib/waterProfiles';

const PILL: Record<Likelihood, string> = {
  Common: 'bg-blue text-white', Possible: 'bg-cyan text-ink', 'Less likely': 'bg-ice text-ink border border-teal/40', 'Check yours': 'bg-white text-navy border border-teal',
};

export default function WaterReportTool() {
  const [zip, setZip] = useState('');
  const [shown, setShown] = useState('');
  const started = useRef(false);
  const start = () => { if (!started.current) { started.current = true; trackEvent('tool_start', { tool_name: 'water_report' }); } };
  const profile = shown ? profileForZip(shown) : null;

  function run(z: string) {
    if (!/^\d{5}$/.test(z)) return;
    start(); setShown(z);
    trackEvent('tool_result', { tool_name: 'water_report', result_bucket: profileForZip(z)?.id ?? 'out_of_area' });
  }

  return (
    <div id="report" data-track-source="tool_report" className="scroll-mt-24 rounded-[28px] bg-ice border border-cyan p-5 sm:p-8 md:p-10 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="shrink-0 w-14 h-14 rounded-2xl bg-white text-blue flex items-center justify-center shadow-sm"><Icon name="document" size={30} /></span>
        <div><p className="text-sm font-semibold !p-0 text-navy">Tool 1 · Water Quality Report Locator</p><h2>Your water quality isn’t generic. Neither is our solution.</h2></div>
      </div>
      <p>Enter your ZIP code to see what homeowners in your area should check, from hardness to chlorine to older plumbing. <b>Understand what you’re exposing your family to.</b></p>

      <form onSubmit={(e) => { e.preventDefault(); run(zip); }} className="flex flex-col sm:flex-row gap-3">
        <input className="field flex-1" inputMode="numeric" maxLength={5} placeholder="Your ZIP code" aria-label="ZIP code" list="area-zips" value={zip}
          onFocus={start} onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))} />
        <datalist id="area-zips">{AREA_SHORTCUTS.map(([a, z]) => <option key={z} value={z}>{a}</option>)}</datalist>
        <button className="btn btn-blue" disabled={zip.length !== 5}>Check my area</button>
      </form>
      <div className="flex flex-wrap gap-2 items-center text-sm">
        <span>We serve:</span>
        {AREA_SHORTCUTS.map(([a, z]) => <button key={z} type="button" onClick={() => { setZip(z); run(z); }} className="min-h-12 px-4 rounded-full bg-white border border-teal/40 text-navy font-semibold hover:bg-cyan transition-colors">{a}</button>)}
      </div>

      {shown && (
        <div className="card p-5 sm:p-8 md:p-10 flex flex-col gap-5" aria-live="polite">
          {profile ? (
            <>
              <div><p className="text-sm font-semibold !p-0 text-navy">Report card · {shown}</p><h3>{profile.area}</h3><p>{profile.supply}</p></div>
              <ul className="flex flex-col divide-y divide-teal/20">
                {profile.rows.map((r) => (
                  <li key={r.label} className="py-4 grid gap-2 sm:grid-cols-[200px_1fr] sm:gap-6">
                    <div className="flex items-center gap-3"><span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${PILL[r.level]}`}>{r.level}</span></div>
                    <div><p className="font-semibold !p-0">{r.label}</p><p className="!pt-1 !pb-0 text-sm">{r.note}</p></div>
                  </li>
                ))}
              </ul>
              {profile.measured && (
                <div className="rounded-3xl bg-ice border border-cyan p-5 sm:p-8 flex flex-col gap-3">
                  <p className="font-semibold !p-0 text-navy">What {profile.measured.source.split(' Water Quality')[0]} measured ({profile.measured.year})</p>
                  <p className="text-sm !p-0">Real results from the utility’s own annual report, next to the legal limit. Meeting the legal limit is the minimum. Many families still choose to filter chlorine, disinfection byproducts and PFAS at home.</p>
                  <div className="overflow-x-auto"><table className="w-full text-left text-sm min-w-[520px]"><thead><tr className="text-navy"><th className="py-2 pr-4">Substance</th><th className="py-2 pr-4">Result</th><th className="py-2">Legal limit</th></tr></thead>
                    <tbody>{profile.measured.rows.map((m) => (
                      <tr key={m.name} className="border-t border-teal/20 align-top"><td className="py-3 pr-4 font-semibold">{m.name}{m.note && <span className="block font-normal text-xs">{m.note}</span>}</td><td className="py-3 pr-4">{m.result}</td><td className="py-3">{m.limit}</td></tr>))}</tbody></table></div>
                  <p className="text-xs !p-0">Source: <a className="underline" href={profile.measured.url} target="_blank" rel="noopener noreferrer">{profile.measured.source}</a>. Applies to Tacoma Water customers. Check your own bill to confirm your utility.</p>
                </div>
              )}
              <p className="text-xs !p-0">This is a typical profile for your area, not a lab test of your tap. For exact numbers, read your utility’s annual report:{' '}
                {profile.links.map(([l, u], i) => <span key={u}>{i > 0 && ' · '}<a className="underline" href={u} target="_blank" rel="noopener noreferrer">{l}</a></span>)} · <a className="underline" href={ewgZipUrl(shown)} target="_blank" rel="noopener noreferrer">EWG Tap Water Database</a></p>
            </>
          ) : (
            <>
              <h3>We don’t have a profile for {shown} yet</h3>
              <p>We serve Tacoma, Puyallup, Bremerton and Port Orchard. For any ZIP, the <a className="underline font-semibold" href={ewgZipUrl(shown)} target="_blank" rel="noopener noreferrer">EWG Tap Water Database</a> and your utility’s annual report show what was measured. Or book a free consultation and we’ll go over your water with you.</p>
            </>
          )}
          <div className="rounded-3xl bg-navy text-white p-6 sm:p-8 flex flex-col gap-3" data-track-source="tool_report_result">
            <p className="!p-0 font-semibold text-white">Your family’s health starts with clean water. Let’s test yours.</p>
            <a href="#quote" className="btn btn-cta self-start !whitespace-normal !h-auto py-3 text-center">Schedule Your Free Consultation</a>
            <p className="!p-0 text-sm text-white/90">Call or text us directly. We’re local. <a className="underline font-semibold" href={PHONE_HREF}>{PHONE}</a> · <a className="underline font-semibold" href={SMS_HREF}>Text us</a></p>
            <Link href="/services/whole-home-water-filtration" className="text-sm text-cyan underline font-semibold">See our flagship filtration plans: from {flagshipPrice} {TAX_NOTE} →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
