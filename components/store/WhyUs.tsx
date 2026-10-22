import { TIERS, formatUSD } from '@/lib/pricing';
import { STORE } from '@/lib/store';
import { TEAL_ON_WHITE } from '@/lib/contrast';

const ICON = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const ICONS: Record<string, React.ReactNode> = {
  tag: <svg width="30" height="30" viewBox="0 0 24 24" {...ICON} aria-hidden><path d="M3 12V4a1 1 0 011-1h8l9 9-9 9-9-9z" /><circle cx="8" cy="8" r="1.4" /></svg>,
  calendar: <svg width="30" height="30" viewBox="0 0 24 24" {...ICON} aria-hidden><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4" /></svg>,
  pros: <svg width="30" height="30" viewBox="0 0 24 24" {...ICON} aria-hidden><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 11l2 2 4-4" /></svg>,
  refund: <svg width="30" height="30" viewBox="0 0 24 24" {...ICON} aria-hidden><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></svg>,
};

// Same four ideas as the reference, rewritten to what we can stand behind.
// VERIFY: "background-checked" (how and by whom), and that installs can be booked as soon as 6 days out in every area.
const BENEFITS: [keyof typeof ICONS, string, string][] = [
  ['tag', 'Instant online pricing', 'What you see online is the price you pay. No in-person estimates. If your home needs something different, we tell you before you commit.'],
  ['calendar', 'Easy online scheduling', 'Pick your install day online. A licensed local plumber installs it in about 4 hours, on the day you pick.'],
  ['pros', 'Licensed, background-checked pros', 'Every install is done by a licensed local plumber from our vetted list.'],
  ['refund', '100% refundable checkout', `Pay up front with confidence. Every order is ${STORE.refund.toLowerCase()} Checkout is secured by Stripe.`],
];

// A stylised phone showing the booking flow: pick a day, see the price, check out.
function Phone() {
  const price = formatUSD(TIERS.find((t) => t.popular)!.price);
  return (
    <div aria-hidden className="relative mx-auto w-[300px] md:w-[340px] select-none [transform:perspective(1200px)_rotateY(14deg)_rotateX(4deg)_rotateZ(-6deg)]">
      <div className="rounded-[44px] border-[3px] border-ink bg-white p-4 shadow-[14px_18px_0_rgba(26,26,26,.9)]">
        <div className="mx-auto mb-3 h-1.5 w-20 rounded-full bg-ink/80" />
        <p className="!py-0 text-center font-mono text-[11px] font-medium uppercase tracking-[.14em] text-ink/70">Date &amp; time</p>
        <p className="!py-1 text-center font-sans text-[22px] font-bold tracking-[-0.03em] text-ink">Select install day</p>
        <div className="mt-2 rounded-2xl border-2 border-ink bg-[#f6faf8] p-3">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className={`h-9 rounded-lg border-2 border-ink ${i === 6 ? 'bg-ink' : 'bg-white'}`} />
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-2xl border-2 border-ink bg-white px-4 py-3 text-center">
          <p className="!py-0 font-mono text-[11px] font-medium uppercase tracking-[.12em] text-ink/70">The price you see</p>
          <p className="!py-0 font-mono text-[34px] font-semibold tracking-tight leading-tight"><span className="text-ink">$</span><span style={{ color: TEAL_ON_WHITE }}>{price.slice(1)}</span></p>
        </div>
        <div className="mt-3 rounded-full border-2 border-ink bg-[#ff6b35] py-3 text-center font-sans text-[16px] font-bold text-ink shadow-[3px_4px_0_#1a1a1a]">Checkout</div>
      </div>
    </div>
  );
}

export default function WhyUs() {
  return (
    <section id="why" aria-labelledby="why-h" className="bg-white scroll-mt-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid gap-12 md:gap-16 md:grid-cols-[1fr_1.05fr] md:items-start">
        <div>
          <p className="inline-block rounded-md bg-[#e6f6f9] px-3 py-1.5 font-mono text-[12px] font-medium uppercase tracking-[.14em]" style={{ color: TEAL_ON_WHITE }}>Why US Water Pros</p>
          <h2 id="why-h" className="mt-5 !font-sans !font-bold !tracking-[-0.045em] !text-ink !leading-[1.06] !text-[clamp(2.2rem,1.3rem+3.2vw,3.6rem)] [text-wrap:balance]">
            The <span style={{ color: TEAL_ON_WHITE }}>smarter way</span> to cleaner water
          </h2>
          <div className="mt-12 hidden md:block"><Phone /></div>
        </div>
        <ul className="flex flex-col gap-5">
          {BENEFITS.map(([icon, title, body]) => (
            <li key={title} className="flex gap-5 rounded-2xl border border-black/[.08] bg-white p-6 md:p-7 shadow-[0_2px_14px_rgba(0,0,0,.05)]">
              <span className="shrink-0 w-16 h-16 rounded-xl bg-ink text-[#a8e9ef] flex items-center justify-center">{ICONS[icon]}</span>
              <div>
                <h3 className="font-sans text-[22px] font-bold tracking-[-0.02em] leading-tight">{title}</h3>
                <p className="!py-0 mt-2 font-light text-[#3f4a4f] text-[17px] leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
