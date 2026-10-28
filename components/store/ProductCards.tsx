import TierIcon from './TierIcon';
import WizardButton from './WizardButton';
import { TIERS, TAX_NOTE, avgTotal, formatUSD } from '@/lib/pricing';

const price = (n: number) => (
  <span className="font-mono font-bold text-[68px] leading-[.9] text-ink">${n.toLocaleString('en-US')}</span>
);

// `teaser` (home): icon, name, one line, price, button. Everything else lives on /pricing (`full`, with the bullets).
export default function ProductCards({ id, variant = 'full', caption, showAvg = false, headingAs: H = 'h3' }: { id?: string; variant?: 'teaser' | 'full'; caption?: string; showAvg?: boolean; headingAs?: 'h2' | 'h3' }) {
  return (
    <ul id={id} className="grid gap-5 md:gap-6 md:grid-cols-3 items-stretch">
      {TIERS.map((t) => (
        <li key={t.id} data-rv className={`relative flex flex-col gap-5 rounded-[32px] bg-white p-7 md:p-8 shadow-[0_1px_0_#fff_inset,0_36px_70px_-40px_rgba(14,33,43,.4)] ${t.popular ? 'ring-2 ring-navy' : 'ring-1 ring-black/[.08]'}`}>
          {t.popular && <span className="absolute -top-3.5 left-7 rounded-full bg-navy px-3.5 py-1 font-mono text-[13px] font-bold uppercase tracking-[.16em] text-white"><span aria-hidden className="mr-1.5 text-[#ff8a96]">★</span>Most homes</span>}
          <span className="text-ink"><TierIcon id={t.id} /></span>
          <div>
            <H className="font-serif text-[30px] font-bold tracking-[-0.02em] leading-tight">{t.name}</H>
            <p className="!py-0 mt-1.5 text-[#5b6472] text-[16px] leading-snug">{variant === 'teaser' ? t.fit : t.subhead}</p>
          </div>
          <div>
            {price(t.price)}
            <p className="!py-0 mt-2 font-mono text-[14px] font-semibold uppercase tracking-[.14em] text-[#5b6472]">{caption ?? `Installed, ${TAX_NOTE.replace('installed, ', '')}`}</p>
          </div>
          {variant === 'full' && (
            <ul className="flex flex-col gap-2.5 border-t border-black/[.08] pt-5">
              {t.bullets.map((b) => <li key={b} className="flex gap-2.5 text-[15px] text-[#2c3646]"><span className="text-cta" aria-hidden>★</span><span>{b}</span></li>)}
            </ul>
          )}
          <div className="mt-auto flex flex-col gap-3">
            <WizardButton tier={t.id} className="btn btn-cta w-full !font-semibold">Get Instant Price →<span className="sr-only"> for {t.name}</span></WizardButton>
            {showAvg && <p className="!py-0 text-center text-[14px] italic text-[#5b6472]">Avg total price in 2026 is {formatUSD(avgTotal(t.id))}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
