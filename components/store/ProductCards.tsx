import TierIcon from './TierIcon';
import WizardButton from './WizardButton';
import { TIERS, TAX_NOTE, avgTotal, formatUSD } from '@/lib/pricing';
import { TEAL_ON_WHITE } from '@/lib/contrast';

const price = (n: number) => (
  <span className="font-mono font-semibold tracking-tight text-[44px] leading-none">
    <span className="text-ink">$</span><span style={{ color: TEAL_ON_WHITE }}>{n.toLocaleString('en-US')}</span>
  </span>
);

// `teaser` (home): icon, name, one line, price, button. Everything else lives on /pricing (`full`, with the bullets).
export default function ProductCards({ id, variant = 'full', caption, showAvg = false }: { id?: string; variant?: 'teaser' | 'full'; caption?: string; showAvg?: boolean }) {
  return (
    <ul id={id} className="grid gap-5 md:gap-6 md:grid-cols-3 items-stretch">
      {TIERS.map((t) => (
        <li key={t.id} className={`relative flex flex-col gap-5 rounded-3xl bg-white p-7 md:p-8 border ${t.popular ? 'border-[#00a0bf] shadow-[0_18px_50px_rgba(27,73,101,.12)]' : 'border-black/[.08] shadow-[0_2px_14px_rgba(0,0,0,.04)]'}`}>
          {t.popular && <span className="absolute -top-3 left-7 rounded-md bg-[#1b4965] px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[.14em] text-white">Most homes</span>}
          <span className="text-ink"><TierIcon id={t.id} /></span>
          <div>
            <h3 className="font-sans text-[26px] font-bold tracking-[-0.03em] leading-tight">{t.name}</h3>
            <p className="!py-0 mt-1.5 font-light text-[#3f4a4f] text-[16px] leading-snug">{variant === 'teaser' ? t.fit : t.subhead}</p>
          </div>
          <div>
            {price(t.price)}
            <p className="!py-0 mt-2 font-mono text-[12px] uppercase tracking-[.1em] text-[#4b5a60]">{caption ?? `Installed · ${TAX_NOTE.replace('installed, ', '')}`}</p>
          </div>
          {variant === 'full' && (
            <ul className="flex flex-col gap-2.5 border-t border-black/[.07] pt-5">
              {t.bullets.map((b) => <li key={b} className="flex gap-2.5 text-[15px] font-light"><span style={{ color: TEAL_ON_WHITE }} aria-hidden>✓</span><span>{b}</span></li>)}
            </ul>
          )}
          <div className="mt-auto flex flex-col gap-3">
            <WizardButton tier={t.id} className="btn btn-cta w-full !font-semibold">Get Instant Price →</WizardButton>
            {showAvg && <p className="!py-0 text-center text-[14px] italic text-[#3f4a4f]">Avg total price in 2026 is {formatUSD(avgTotal(t.id))}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
