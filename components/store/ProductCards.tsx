import TierIcon from './TierIcon';
import WizardButton from './WizardButton';
import { TIERS, TAX_NOTE, avgTotal, formatUSD } from '@/lib/pricing';
import { TEAL_ON_WHITE } from '@/lib/contrast';

const price = (n: number) => (
  <span className="font-mono font-semibold tracking-[-0.045em] text-[52px] leading-none text-ink">${n.toLocaleString('en-US')}</span>
);

// `teaser` (home): icon, name, one line, price, button. Everything else lives on /pricing (`full`, with the bullets).
export default function ProductCards({ id, variant = 'full', caption, showAvg = false }: { id?: string; variant?: 'teaser' | 'full'; caption?: string; showAvg?: boolean }) {
  return (
    <ul id={id} className="grid gap-5 md:gap-6 md:grid-cols-3 items-stretch">
      {TIERS.map((t) => (
        <li key={t.id} className={`relative flex flex-col gap-5 rounded-[32px] bg-white p-7 md:p-8 shadow-[0_1px_0_#fff_inset,0_36px_70px_-40px_rgba(14,33,43,.4)] ${t.popular ? 'ring-2 ring-ink' : 'ring-1 ring-black/[.07]'}`}>
          {t.popular && <span className="absolute -top-3.5 left-7 rounded-full bg-ink px-3 py-1 text-[12px] font-semibold tracking-[.01em] text-white">Most homes</span>}
          <span className="text-ink"><TierIcon id={t.id} /></span>
          <div>
            <h3 className="font-sans text-[28px] font-semibold tracking-[-0.035em] leading-tight">{t.name}</h3>
            <p className="!py-0 mt-1.5 text-[#6e6e73] text-[16px] leading-snug">{variant === 'teaser' ? t.fit : t.subhead}</p>
          </div>
          <div>
            {price(t.price)}
            <p className="!py-0 mt-2 text-[13px] text-[#6e6e73]">{caption ?? `Installed, ${TAX_NOTE.replace('installed, ', '')}`}</p>
          </div>
          {variant === 'full' && (
            <ul className="flex flex-col gap-2.5 border-t border-black/[.08] pt-5">
              {t.bullets.map((b) => <li key={b} className="flex gap-2.5 text-[15px] text-[#3a3a3c]"><span style={{ color: TEAL_ON_WHITE }} aria-hidden>✓</span><span>{b}</span></li>)}
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
