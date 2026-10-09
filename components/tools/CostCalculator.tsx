'use client';
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import { trackEvent } from '@/lib/analytics/track';
import { DEFAULTS, estimateCosts, estimateGallons, type Assumptions, type Drinking } from '@/lib/costModel';
import { PRICING, TAX_NOTE, flagshipPrice, formatUSD } from '@/lib/pricing';

const DRINKING: [Drinking, string][] = [['tap', 'Plain tap water'], ['pitcher', 'Pitcher or faucet filter'], ['bottled', 'Bottled water'], ['cartridge_filter', 'Separate filter system with cartridges']];
const LABELS: [keyof Assumptions, string, number][] = [
  ['saltBagPrice', 'Salt, price per 40-lb bag ($)', 0.5], ['waterPricePerGallon', 'Water and sewer, price per gallon ($)', 0.001], ['softenerServicePerYear', 'Softener service and repairs per year ($)', 5],
  ['pitcherFiltersPerYear', 'Pitcher filters per year ($)', 5], ['bottledPricePerGallon', 'Bottled water, price per gallon ($)', 0.05], ['cartridgesPerYear', 'Filter cartridges per year ($)', 5],
];

export default function CostCalculator() {
  const [hasSoftener, setHasSoftener] = useState(true);
  const [family, setFamily] = useState(4);
  const [gallons, setGallons] = useState('');
  const [drinking, setDrinking] = useState<Drinking>('bottled');
  const [a, setA] = useState<Assumptions>(DEFAULTS);
  const [done, setDone] = useState(false);
  const started = useRef(false);
  const start = () => { if (!started.current) { started.current = true; trackEvent('tool_start', { tool_name: 'cost_calculator' }); } };

  const res = useMemo(() => estimateCosts({ hasSoftener, familySize: family, annualGallons: Number(gallons) || undefined, drinking }, a), [hasSoftener, family, gallons, drinking, a]);
  const saves = res.savingsPerYear > 0;

  return (
    <div id="calculator" data-track-source="tool_cost" className="scroll-mt-24 rounded-[28px] bg-ice border border-cyan p-5 sm:p-8 md:p-10 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="shrink-0 w-14 h-14 rounded-2xl bg-white text-blue flex items-center justify-center shadow-sm"><Icon name="calculator" size={30} /></span>
        <div><p className="text-sm font-semibold !p-0 text-navy">Tool 2 · True Cost Calculator</p><h2>You think you’re saving money. Check the real number.</h2></div>
      </div>
      <p>See what your current water setup costs you every year, in salt, wasted water, filters and bottled water. <b>A real number, from your own usage.</b></p>

      <form onSubmit={(e) => { e.preventDefault(); start(); setDone(true); trackEvent('tool_result', { tool_name: 'cost_calculator', result_bucket: saves ? 'saves' : 'no_savings', result_value: Math.round(res.savingsPerYear) }); }} className="grid gap-5 sm:grid-cols-2" onChange={start}>
        <fieldset className="flex flex-col gap-2"><legend className="font-semibold text-sm mb-1">Do you have a water softener?</legend>
          <div className="flex gap-2">{[true, false].map((v) => <button key={String(v)} type="button" aria-pressed={hasSoftener === v} onClick={() => { start(); setHasSoftener(v); }} className={`flex-1 btn ${hasSoftener === v ? 'btn-blue' : 'btn-secondary'}`}>{v ? 'Yes' : 'No'}</button>)}</div></fieldset>
        <label className="flex flex-col gap-2"><span className="font-semibold text-sm">People in your household</span>
          <select className="field" value={family} onChange={(e) => { start(); setFamily(Number(e.target.value)); }}>{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
        <label className="flex flex-col gap-2"><span className="font-semibold text-sm">Gallons used per year <span className="font-normal">(optional)</span></span>
          <input className="field" inputMode="numeric" placeholder={`Estimated: ${estimateGallons(family).toLocaleString('en-US')}`} value={gallons} onFocus={start} onChange={(e) => setGallons(e.target.value.replace(/\D/g, ''))} /></label>
        <label className="flex flex-col gap-2"><span className="font-semibold text-sm">How do you handle drinking water now?</span>
          <select className="field" value={drinking} onChange={(e) => { start(); setDrinking(e.target.value as Drinking); }}>{DRINKING.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 sm:items-center">
          <button className="btn btn-blue">Calculate my real cost</button>
          <details className="text-sm"><summary className="cursor-pointer font-semibold text-navy min-h-12 flex items-center">Adjust the assumptions</summary>
            <div className="grid gap-3 sm:grid-cols-2 mt-3">{LABELS.map(([k, l, step]) => (
              <label key={k} className="flex flex-col gap-1"><span>{l}</span><input className="field" type="number" min={0} step={step} value={a[k]} onChange={(e) => setA({ ...a, [k]: Number(e.target.value) || 0 })} /></label>))}</div>
            <p className="text-xs">All figures are typical costs. Change them to match your own bills.</p></details>
        </div>
      </form>

      {done && (
        <div className="card p-5 sm:p-8 md:p-10 flex flex-col gap-6" aria-live="polite">
          <div>
            <h3>Your current setup costs about {formatUSD(res.currentTotal)} a year</h3>
            <p>{saves
              ? `That is about ${formatUSD(res.savingsPerYear)} a year more than our system costs to run. Over ten years: ${formatUSD(res.currentTenYear)} for what you have now, against ${formatUSD(res.oursTenYear)} for ours, including the ${flagshipPrice} install. Payback in about ${res.paybackYears} years.`
              : `A whole-home system will not save you money on its own here, because your current costs are already low. What it changes is your water quality and your family’s drinking water.`}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {[['What you pay now', res.current, res.currentTotal], ['What our system costs to run', res.ours, res.oursTotal]].map(([title, lines, total]) => (
              <div key={title as string}><p className="font-semibold !p-0">{title as string}</p>
                <ul className="mt-2 divide-y divide-teal/20">{(lines as typeof res.current).map((l) => <li key={l.key} className="py-3 flex justify-between gap-4"><span>{l.label}<span className="block text-xs">{l.note}</span></span><b>{formatUSD(l.amount)}</b></li>)}
                  {!(lines as typeof res.current).length && <li className="py-3">Nothing on your list.</li>}</ul>
                <p className="flex justify-between font-bold !pb-0"><span>Per year</span><span>{formatUSD(total as number)}</span></p></div>))}
          </div>
          <p className="text-xs !p-0">Not priced: health costs. We won’t put a made-up dollar figure on them. Estimates use typical costs and the assumptions above, and your bills will differ.</p>
          <div className="rounded-3xl bg-navy text-white p-6 sm:p-8 flex flex-col gap-3" data-track-source="tool_cost_result">
            <p className="!p-0 text-white">Based on your usage, we recommend our flagship {PRICING.flagship.label}{drinking === 'bottled' || drinking === 'pitcher' ? ', with reverse osmosis if drinking water is your priority' : ''}. {PRICING.headline} No hidden fees.</p>
            <Link href="/services/whole-home-water-filtration#pricing" className="btn btn-cta self-start">See Your Custom Quote</Link>
            <p className="!p-0 text-sm text-white/90">Our price is fixed: {flagshipPrice} {TAX_NOTE}. What we quote is what you pay.</p>
          </div>
        </div>
      )}
    </div>
  );
}
