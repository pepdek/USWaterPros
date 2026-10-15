'use client';
import { useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import Sources from '@/components/Sources';
import { PHONE, PHONE_HREF } from '@/lib/constants';
import { MAINTENANCE as MAINT, UAQ_SHARED, type Service } from '@/lib/services';
import { ANNUAL_FILTERS, MARKET, PRICING, TAX_NOTE, flagshipPrice, formatRange, formatUSD, wellCredit } from '@/lib/pricing';
import type { SourceId } from '@/lib/sources';
import { CITIES } from '@/lib/cities';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';

const Check = ({ children }: { children: React.ReactNode }) => <li className="flex gap-2"><span className="text-aqua font-bold">✓</span>{children}</li>;

export function ServiceHero({ s }: { s: Service }) {
  return (
    <section data-track-source="hero" className="bg-surge">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid gap-10 md:gap-14 md:grid-cols-[3fr_2fr] md:items-center md:min-h-[40vh]">
        <div>
          <Breadcrumb items={[{ label: 'Services', href: '/#services' }, { label: s.name }]} />
          <h1 className="!text-white">{s.h1}</h1>
          <p className="mt-4 text-white font-semibold">{s.sub}</p>
          <a href="#quote" className="btn btn-cta mt-6 w-full md:w-auto">Schedule Consultation</a>
          <p className="mt-3 text-sm text-white font-semibold">No credit card | Licensed technician | 15 minutes | Fixed price quote</p>
        </div>
        <div className="relative rounded-3xl bg-white/80 backdrop-blur-xl h-56 md:h-auto md:aspect-[4/3]">
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
      <div className="mt-6 flex flex-col gap-4">
        {s.problems.map((p) => (
          <div key={p.problem} className="card p-6 md:p-8 flex gap-5">
            <span className="text-aqua shrink-0"><Icon name={p.icon} size={36} /></span>
            <dl className="grid gap-3 max-w-[65ch]">
              <div><dt className="text-sm font-semibold uppercase tracking-wide text-teal">You have</dt><dd className="font-semibold text-ink">{p.problem}</dd></div>
              <div><dt className="text-sm font-semibold uppercase tracking-wide text-teal">What we do</dt><dd>{p.solution}.</dd></div>
              <div><dt className="text-sm font-semibold uppercase tracking-wide text-teal">Result</dt><dd className="font-semibold text-ink">{p.outcome}</dd></div>
            </dl>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-ice rounded-2xl p-6 md:p-8 border-l-4 border-teal text-ink">
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
            <span><span className="font-semibold text-ink block">{t.item}</span><span className="text-sm">{t.how}</span></span>
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
    <div>
      <h2>How {s.name} Works: Step-by-Step</h2>
      <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((st, i) => (
          <li key={st.title} className="card p-6 md:p-8 flex flex-col gap-3 !transform-none [&>p]:!py-0">
            <span className="w-10 h-10 rounded-full bg-navy text-white font-bold flex items-center justify-center">{i + 1}</span>
            <p className="text-lg font-semibold text-ink">{st.title}</p>
            {st.what && <p>{st.what}</p>}
            {st.removes && <p className="text-ink">Removes or handles: <b>{st.removes}</b></p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

// Slider between two layers. Pass real photos via beforeSrc/afterSrc; falls back to an illustration.
export function BeforeAfterSlider({ s, beforeSrc, afterSrc }: { s: Service; beforeSrc?: string; afterSrc?: string }) {
  const [pct, setPct] = useState(50);
  const layer = (src: string | undefined, cls: string, label: string) =>
    src ? <img src={src} alt={label} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        : <div className={`absolute inset-0 flex items-center justify-center ${cls}`}><Icon name="drop" size={96} /></div>;
  return (
    <div>
      <h2>Before &amp; After</h2>
      <div className="mt-8 grid gap-8 md:gap-12 md:grid-cols-2 md:items-center">
        <div>
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden select-none">
            {layer(afterSrc, 'bg-ice text-aqua', 'After')}
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>{layer(beforeSrc, 'bg-[#d9c7a3] text-[#8a6d3b]', 'Before')}</div>
            <span className="absolute top-3 left-3 text-sm font-bold bg-navy text-white rounded px-2 py-1">Before</span>
            <span className="absolute top-3 right-3 text-sm font-bold bg-navy text-white rounded px-2 py-1">After</span>
            <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pct}%` }} />
            <input type="range" min={0} max={100} value={pct} onChange={(e) => setPct(+e.target.value)} aria-label="Before and after slider" className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
          </div>
          {!beforeSrc && <p className="mt-2 text-sm">Illustration.</p>}
        </div>
        <div className="flex flex-col gap-6">
          <p><b className="text-ink block text-lg">Before</b>{s.before}</p>
          <p><b className="text-ink block text-lg">After</b>{s.after}</p>
        </div>
      </div>
    </div>
  );
}

const FLAGSHIP_HREF = '/services/whole-home-water-filtration';
const Pill = ({ href, children }: { href: string; children: React.ReactNode }) => <Link href={href} className="btn btn-cta mt-4">{children}</Link>;

export function PricingTimeline({ s }: { s: Service }) {
  const days = [['Day 1', 'Free 15-minute consultation and fixed-price quote'], ['Day 2–3', 'Schedule your installation'], ['Install day', 'About 4 hours with a licensed technician'], ['Day after', 'System testing completed'], ['Ongoing', `Annual filter replacements, about ${formatUSD(ANNUAL_FILTERS.low)}–${ANNUAL_FILTERS.high} a year`]];
  const wellSteps = [['Step 1', 'Choose a basic test or the full panel'], ['Step 2', 'We collect the sample and send it to the lab'], ['Step 3', 'We explain your results in plain English'], ['Step 4', 'We recommend a system, and your test fee is credited if you purchase']];
  const addon = s.addon ? PRICING.addons[s.addon] : null;
  return (
    <div>
      <h2 id="pricing" className="scroll-mt-24">Pricing &amp; Installation</h2>
      <div className="mt-8 grid gap-10 md:gap-12 lg:grid-cols-[minmax(0,28rem)_1fr] lg:items-start">
        {s.kind === 'flagship' && (
          <div className="card p-8 md:p-10 !transform-none">
            <p className="text-sm font-semibold">{PRICING.flagship.label}</p>
            <p className="text-4xl font-bold text-ink">{flagshipPrice} <span className="text-base font-normal">{TAX_NOTE}</span></p>
            <p className="font-semibold text-ink">What’s included</p>
            <ul className="flex flex-col gap-1">{PRICING.flagship.includes.map((i) => <Check key={i}>{i}</Check>)}<Check>Testing after installation</Check><Check>1-year warranty</Check></ul>
            <p className="mt-2 text-sm">Add reverse osmosis drinking water for {formatUSD(PRICING.addons.ro.displayPrice)} or carbon filtration for {formatUSD(PRICING.addons.carbon.displayPrice)}, installed on the same visit.</p>
          </div>
        )}
        {addon && (
          <div className="card p-8 md:p-10 !transform-none">
            <p className="text-sm font-semibold">Add-on</p>
            <p className="text-4xl font-bold text-ink">{formatUSD(addon.displayPrice)} <span className="text-base font-normal">{TAX_NOTE}</span></p>
            <p>{addon.label}, installed on the same visit as your whole-home system.</p>
            <Pill href={FLAGSHIP_HREF}>See the whole-home system</Pill>
          </div>
        )}
        {(s.kind === 'component' || s.kind === 'city') && (
          <div className="card p-8 md:p-10 !transform-none">
            <p className="text-xl font-bold text-ink">Installed as part of our whole-home system</p>
            <p>{s.kind === 'city' ? <>This service is installed with the {PRICING.flagship.label}. We confirm exactly what your home needs at your free consultation.</> : <>Water softening is always included in our {formatUSD(PRICING.flagship.displayPrice)} whole-home system. Here’s why: softening works best with filtration. Hard water minerals vary around Pierce, Kitsap and Thurston Counties, and groundwater is more likely to be hard than surface-sourced supplies. Our whole-home approach treats hardness at the source while filtering the sediment and chlorine that can add to scale and wear.</>}</p>
            <Pill href={FLAGSHIP_HREF}>See the whole-home system</Pill>
          </div>
        )}
        {s.kind === 'well' && (
          <div className="card p-8 md:p-10 !transform-none">
            <p className="text-xl font-bold text-ink">Test first, then we recommend</p>
            <ul className="mt-2 flex flex-col gap-3">
              {Object.values(PRICING.wellTest).map((t) => <li key={t.id}><span className="font-bold text-ink">{formatUSD(t.displayPrice)}</span> {t.label}</li>)}
            </ul>
            <p>{wellCredit}</p>
          </div>
        )}
        <ol className="flex flex-col gap-6 border-l-2 border-teal/40 pl-6 max-w-2xl">
          {(s.kind === 'well' ? wellSteps : days).map(([d, t]) => <li key={d}><span className="block font-bold text-ink text-lg">{d}</span><span>{t}</span></li>)}
        </ol>
      </div>
    </div>
  );
}

export function ComparisonTable({ s }: { s: Service }) {
  const rows = [
    ['Upfront cost', `${flagshipPrice} ${TAX_NOTE}`, formatRange(MARKET.premium.low, MARKET.premium.high), formatUSD(MARKET.budget.price)],
    ['Installation', 'Licensed technician, about 4 hours', 'Sales rep plus install crew', 'DIY or discount installer'],
    ['Support', 'Included', 'Fee-based', 'Little or none'],
    ['Warranty', '1 year', 'Limited', '6 months'],
    ['Typical lifespan', '8–10 years', '10+ years', '2–3 years'],
  ];
  return (
    <div>
      <h2>How {s.name} Compares</h2>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[560px]">
          <thead><tr className="text-ink"><th className="p-3">Feature</th><th className="p-3 bg-aqua/20 rounded-t">US Water Pros</th><th className="p-3">Premium brand</th><th className="p-3">Budget option</th></tr></thead>
          <tbody>{rows.map(([f, a, b, c]) => <tr key={f} className="border-t border-black/10"><td className="p-3 font-semibold text-ink">{f}</td><td className="p-3 bg-aqua/20">{a}</td><td className="p-3">{b}</td><td className="p-3">{c}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="mt-3 text-sm">Typical ranges for the local market. Actual prices vary by brand and home.</p>
    </div>
  );
}


// FAQ cards: stacked, no rules between items. Native <details> keeps it keyboard and screen-reader friendly.
export function FaqGroup({ title, items, id }: { title: string; items: [string, string][]; id?: string }) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2>{title}</h2>
      <div className="mt-8 flex flex-col gap-3">
        {items.map(([q, a]) => (
          <details key={q} className="group rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,.06)]">
            <summary className="cursor-pointer list-none min-h-14 px-6 py-4 flex items-center justify-between gap-4">
              <h3 className="text-lg !font-sans !tracking-normal">{q}</h3>
              <span aria-hidden className="shrink-0 text-aqua text-2xl leading-none transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="px-6 pt-0 pb-5">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export const MaintenanceFAQ = () => <FaqGroup id="after-installation" title="What Happens After Installation?" items={MAINT} />;

export function ServiceAreaCallout() {
  return (
    <section className="bg-navy text-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="!text-white">Serving Pierce, Kitsap &amp; Thurston Counties</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {CITIES.map((c) => <Link key={c.slug} href={`/services/whole-home-water-filtration-${c.slug}`} className="min-h-12 inline-flex items-center rounded-full bg-white text-ink px-5 font-semibold">{c.name}</Link>)}
        </div>
        <p className="mt-4 text-sm text-white/80">{CITIES.flatMap((c) => c.neighborhoods.slice(0, 2)).join(' · ')} and surrounding areas</p>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section data-track-source="final_cta" className="bg-surge py-16 md:py-20 text-center">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="!text-white">Ready to Improve Your Water?</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a href="#quote" className="btn btn-cta">Schedule Consultation</a>
          <a href={PHONE_HREF} className="btn btn-secondary">{PHONE}</a>
        </div>
        <p className="mt-4 text-sm text-ink font-semibold">✓ Free consultation | ✓ Licensed technicians | ✓ Fixed price quote | ✓ No obligation</p>
      </div>
    </section>
  );
}

export function UnfaqSection({ s }: { s: Service }) {
  if (!s.uaq) return null;
  return (
    <div>
      <h2>Questions People Rarely Ask But Should</h2>
      <div className="mt-8 flex flex-col gap-3">
        {[s.uaq, ...UAQ_SHARED].map(([q, a]) => (
          <div key={q} className="rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,.06)] px-6 py-5">
            <h3 className="text-lg !font-sans !tracking-normal">{q}</h3>
            <p className="!pt-0 !pb-0 mt-2">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Lean pages (well, softening) point to the whole-home page instead of repeating its install/warranty/area blocks.
export function LeanLinks() {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/services/whole-home-water-filtration#after-installation" className="min-h-12 inline-flex items-center rounded-full bg-white px-5 font-semibold text-ink shadow-[0_2px_10px_rgba(0,0,0,.06)]">See maintenance &amp; warranty details in our full FAQ</Link>
      <Link href="/#areas" className="min-h-12 inline-flex items-center rounded-full bg-white px-5 font-semibold text-ink shadow-[0_2px_10px_rgba(0,0,0,.06)]">Service areas &amp; locations</Link>
    </div>
  );
}

// One consistent vertical rhythm for every full-width band on a service page.
export function Band({ tone = 'white', id, children }: { tone?: 'white' | 'ice'; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={tone === 'ice' ? 'bg-ice' : 'bg-white'}>
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20 flex flex-col gap-16 md:gap-20">{children}</div>
    </section>
  );
}

export function InstallGallery({ s }: { s: Service }) {
  if (!s.gallery) return null;
  return (
    <div>
      <h2>Recent Installs</h2>
      <div className="mt-8 flex flex-wrap gap-4">
        {s.gallery.map(([src, alt]) => (
          <div key={src} className="relative aspect-[3/4] basis-[calc(50%-0.5rem)] md:basis-64 grow-0 rounded-xl overflow-hidden">
            <Image src={src} alt={alt} fill sizes="(min-width: 768px) 256px, 45vw" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
