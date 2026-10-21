import Icon from '@/components/Icon';
import WizardButton from './WizardButton';
import { TIERS, TAX_NOTE, formatUSD } from '@/lib/pricing';

// Same three cards under the home hero and on /pricing. Each opens the wizard with its tier selected.
export default function ProductCards({ id }: { id?: string }) {
  return (
    <ul id={id} className="grid gap-6 md:gap-8 md:grid-cols-3 items-stretch">
      {TIERS.map((t) => (
        <li key={t.id} className={`card p-6 md:p-8 !transform-none flex flex-col gap-4 relative ${t.popular ? 'ring-2 ring-teal' : ''}`}>
          {t.popular && <span className="absolute -top-3 left-6 rounded-full bg-navy text-white text-sm font-semibold px-3 py-1">Most homes</span>}
          <span className="text-aqua"><Icon name={t.icon} size={36} /></span>
          <div>
            <h3 className="text-2xl">{t.name}</h3>
            <p className="!py-1">{t.subhead}</p>
          </div>
          <p className="!py-0"><span className="text-4xl font-bold text-ink">{formatUSD(t.price)}</span> <span className="text-base">{TAX_NOTE}</span></p>
          <ul className="flex flex-col gap-2">
            {t.bullets.map((b) => <li key={b} className="flex gap-2"><span className="text-aqua" aria-hidden>✓</span><span>{b}</span></li>)}
          </ul>
          <WizardButton tier={t.id} className="btn btn-cta w-full mt-auto">Get Instant Price</WizardButton>
        </li>
      ))}
    </ul>
  );
}
