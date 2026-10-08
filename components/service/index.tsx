'use client';
import { useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import Sources from '@/components/Sources';
import { PHONE, PHONE_HREF } from '@/lib/constants';
import { MAINTENANCE as MAINT, PRICE, type Service } from '@/lib/services';
import type { SourceId } from '@/lib/sources';
import { CITIES } from '@/lib/cities';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';

const Check = ({ children }: { children: React.ReactNode }) => <li className="flex gap-2"><span className="text-aqua font-bold">✓</span>{children}</li>;

export function ServiceHero({ s }: { s: Service }) {
  return (
    <section className="bg-surge">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 grid gap-8 md:grid-cols-[3fr_2fr] md:items-center md:min-h-[40vh]">
        <div>
          <Breadcrumb items={[{ label: 'Services', href: '/#services' }, { label: s.name }]} />
          <h1 className="!text-white">{s.h1}</h1>
          <p className="mt-4 text-navy text-lg md:text-xl font-semibold">{s.sub}</p>
          <a href="#quote" className="btn btn-navy mt-6 w-full md:w-auto">Schedule Consultation</a>
          <p className="mt-3 text-sm text-navy font-semibold">No credit card | Licensed technician | 15 minutes | Fixed price quote</p>
        </div>
        <div className="relative rounded-xl bg-white/90 h-56 md:h-auto md:aspect-[4/3]">
          <Image src={s.image} alt={s.imageAlt} fill priority sizes="(min-width: 768px) 40vw, 90vw" className="object-contain p-4" />
        </div>
      </div>
    </section>
  );
}

export function BuyerDecisionTree({ s }: { s: Service }) {
  return (
    <section>
      <h2>Is This the Right Solution for Your Water?</h2>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {s.problems.map((p) => (
          <div key={p.problem} className="card p-5 flex flex-col gap-2">
            <span className="text-aqua"><Icon name={p.icon} size={36} /></span>
            <p className="font-semibold text-navy">You have: {p.problem}</p>
            <p>{p.solution}.</p>
            <p className="font-semibold text-navy">Result: {p.outcome}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-ice rounded-lg p-4 border-l-4 border-coral text-navy">
        <p className="font-semibold">{s.stat}</p>
        <Sources ids={s.cite as SourceId[]} className="mt-1" />
      </div>
    </section>
  );
}

export function ContaminationChart({ s }: { s: Service }) {
  return (
    <section>
      <h2>What {s.name} Treats</h2>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {s.treats.map((t) => (
          <li key={t.item} className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-[0_2px_10px_rgba(0,0,0,.05)]">
            <span className="text-aqua shrink-0"><Icon name={t.icon} size={32} /></span>
            <span><span className="font-semibold text-navy block">{t.item}</span><span className="text-sm">{t.how}</span></span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs">Results depend on your water. We confirm during your consultation.</p>
    </section>
  );
}

export function SystemDiagram({ s }: { s: Service }) {
  const steps = [{ title: 'Water enters from your main line', what: '', removes: '' }, ...s.stages, { title: 'Treated water to your home', what: '', removes: '' }];
  return (
    <section>
      <h2>How {s.name} Works: Step-by-Step</h2>
      <ol className="mt-6 flex flex-col gap-0">
        {steps.map((st, i) => (
          <li key={st.title} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="w-9 h-9 shrink-0 rounded-full bg-navy text-white font-bold flex items-center justify-center">{i + 1}</span>
              {i < steps.length - 1 && <span className="w-0.5 flex-1 bg-aqua min-h-6" />}
            </div>
            <div className="pb-5">
              <p className="font-semibold text-navy">{st.title}</p>
              {st.what && <p className="text-sm">{st.what}</p>}
              {st.removes && <p className="text-sm text-navy">Removes or handles: <b>{st.removes}</b></p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// Slider between two layers. Pass real photos via beforeSrc/afterSrc; falls back to an illustration.
export function BeforeAfterSlider({ s, beforeSrc, afterSrc }: { s: Service; beforeSrc?: string; afterSrc?: string }) {
  const [pct, setPct] = useState(50);
  const layer = (src: string | undefined, cls: string, label: string) =>
    src ? <img src={src} alt={label} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        : <div className={`absolute inset-0 flex items-center justify-center ${cls}`}><Icon name="drop" size={96} /></div>;
  return (
    <section>
      <h2>Before &amp; After</h2>
      <div className="relative mt-6 h-56 rounded-xl overflow-hidden select-none">
        {layer(afterSrc, 'bg-ice text-aqua', 'After')}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>{layer(beforeSrc, 'bg-[#d9c7a3] text-[#8a6d3b]', 'Before')}</div>
        <span className="absolute top-2 left-2 text-xs font-bold bg-navy text-white rounded px-2 py-1">Before</span>
        <span className="absolute top-2 right-2 text-xs font-bold bg-navy text-white rounded px-2 py-1">After</span>
        <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pct}%` }} />
        <input type="range" min={0} max={100} value={pct} onChange={(e) => setPct(+e.target.value)} aria-label="Before and after slider" className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
      </div>
      {!beforeSrc && <p className="mt-1 text-xs">Illustration.</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <p><b className="text-navy">Before:</b> {s.before}</p>
        <p><b className="text-navy">After:</b> {s.after}</p>
      </div>
    </section>
  );
}

export function PricingTimeline({ s }: { s: Service }) {
  const days = [['Day 1', 'Free 15-minute consultation and fixed-price quote'], ['Day 2–3', 'Schedule your installation'], ['Install day', 'About 4 hours with a licensed technician'], ['Day after', 'System testing completed'], ['Ongoing', 'Annual filter replacements, about $150–300 a year']];
  return (
    <section>
      <h2>Pricing &amp; Installation</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="card p-6 !transform-none">
          <p className="text-4xl font-bold text-navy">{PRICE} <span className="text-base font-normal">installed</span></p>
          <p className="mt-1 text-sm">Fixed price for {s.name.toLowerCase()}.</p>
          <p className="mt-3 font-semibold text-navy">What’s included</p>
          <ul className="mt-1 flex flex-col gap-1">
            <Check>Professional assessment</Check><Check>System hardware for {s.name.toLowerCase()}</Check>
            <Check>About 4-hour installation</Check><Check>Testing after installation</Check><Check>1-year warranty</Check>
          </ul>
        </div>
        <ol className="flex flex-col gap-3">
          {days.map(([d, t]) => <li key={d} className="flex gap-3"><span className="shrink-0 w-24 font-bold text-navy">{d}</span><span>{t}</span></li>)}
        </ol>
      </div>
    </section>
  );
}

export function ComparisonTable({ s }: { s: Service }) {
  const rows = [
    ['Upfront cost', `${PRICE} fixed`, '$7,500–8,000', '$900'],
    ['Installation', 'Licensed technician, about 4 hours', 'Sales rep plus install crew', 'DIY or discount installer'],
    ['Support', 'Included', 'Fee-based', 'Little or none'],
    ['Warranty', '1 year', 'Limited', '6 months'],
    ['Typical lifespan', '8–10 years', '10+ years', '2–3 years'],
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2>How {s.name} Compares</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[560px]">
          <thead><tr className="text-navy"><th className="p-3">Feature</th><th className="p-3 bg-aqua/20 rounded-t">US Water Pros</th><th className="p-3">Premium brand</th><th className="p-3">Budget option</th></tr></thead>
          <tbody>{rows.map(([f, a, b, c]) => <tr key={f} className="border-t border-black/10"><td className="p-3 font-semibold text-navy">{f}</td><td className="p-3 bg-aqua/20">{a}</td><td className="p-3">{b}</td><td className="p-3">{c}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="mt-2 text-xs">Typical ranges for the local market. Actual prices vary by brand and home.</p>
    </section>
  );
}


export function MaintenanceFAQ() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h2>What Happens After Installation?</h2>
      <div className="mt-4">{MAINT.map(([q, a]) => (
        <details key={q} className="border-b border-black/10 py-3"><summary className="cursor-pointer font-semibold text-navy min-h-12 flex items-center">{q}</summary><p className="pb-2">{a}</p></details>
      ))}</div>
    </section>
  );
}

export function ServiceAreaCallout() {
  return (
    <section className="bg-navy text-white py-12">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="!text-white">Serving Tacoma, Puyallup, Bremerton &amp; Port Orchard</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CITIES.map((c) => <Link key={c.slug} href={`/services/whole-home-water-filtration-${c.slug}`} className="min-h-12 inline-flex items-center rounded-full bg-white text-navy px-5 font-semibold">{c.name}</Link>)}
        </div>
        <p className="mt-4 text-sm text-white/80">{CITIES.flatMap((c) => c.neighborhoods.slice(0, 2)).join(' · ')} and surrounding areas</p>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="bg-surge py-12 text-center">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="!text-white">Ready to Improve Your Water?</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a href="#quote" className="btn btn-navy">Schedule Consultation</a>
          <a href={PHONE_HREF} className="btn btn-secondary">{PHONE}</a>
        </div>
        <p className="mt-4 text-sm text-navy font-semibold">✓ Free consultation | ✓ Licensed technicians | ✓ Fixed price quote | ✓ No obligation</p>
      </div>
    </section>
  );
}
