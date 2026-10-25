import { TIERS, formatUSD } from '@/lib/pricing';
import { STORE } from '@/lib/store';
import Icon from '@/components/Icon';

// Same four ideas as the reference, rewritten to what we can stand behind.
// VERIFY: "background-checked" (how and by whom), and that installs can be booked as soon as 6 days out in every area.
const BENEFITS: [string, string, string][] = [
  ['tag', 'Instant online pricing', 'What you see online is the price you pay. No in-person estimates. If your home needs something different, we tell you before you commit.'],
  ['calendar', 'Easy online scheduling', 'Pick your install day online. A licensed local plumber installs it in about 4 hours, on the day you pick.'],
  ['wrench', 'Licensed, background-checked pros', 'Every install is done by a licensed local plumber from our vetted list.'],
  ['refund', '100% refundable checkout', `Pay up front with confidence. Every order is ${STORE.refund.toLowerCase()} Checkout is secured by Stripe.`],
];

// A stylised phone showing the booking flow: pick a day, see the price, check out.
function Phone() {
  const price = formatUSD(TIERS.find((t) => t.popular)!.price);
  return (
    <div aria-hidden className="relative mx-auto w-[290px] md:w-[320px] select-none [transform:perspective(1400px)_rotateY(-10deg)_rotateX(3deg)_rotateZ(2deg)]">
      <div className="rounded-[46px] bg-[#1d1d1f] p-[10px] shadow-[0_60px_90px_-40px_rgba(14,33,43,.7),0_0_0_1px_rgba(255,255,255,.12)_inset]">
        <div className="rounded-[37px] bg-[#f5f7f8] p-5 pb-6">
          <div className="mx-auto mb-5 h-[22px] w-24 rounded-full bg-[#1d1d1f]" />
          <p className="!py-0 text-center text-[12px] font-medium text-[#5b6472]">Step 2 of 4</p>
          <p className="!py-1 text-center font-sans text-[22px] font-semibold tracking-[-0.035em] text-ink">Pick your install day</p>
          <div className="mt-3 rounded-[22px] bg-white p-3 shadow-[0_1px_0_#fff_inset,0_14px_30px_-20px_rgba(14,33,43,.4)]">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className={`h-9 rounded-xl ${i === 6 ? 'bg-ink shadow-[0_8px_16px_-8px_rgba(0,0,0,.6)]' : 'bg-[#f2f2f4]'}`} />
              ))}
            </div>
          </div>
          <div className="mt-3 rounded-[22px] bg-white px-4 py-4 text-center shadow-[0_1px_0_#fff_inset,0_14px_30px_-20px_rgba(14,33,43,.4)]">
            <p className="!py-0 text-[12px] font-medium text-[#5b6472]">Your price, installed</p>
            <p className="!py-0 font-mono text-[52px] font-bold leading-none text-ink">{price}</p>
          </div>
          <div className="mt-4 rounded-full bg-cta py-3.5 text-center font-sans text-[16px] font-bold text-white shadow-[0_12px_24px_-12px_rgba(163,29,42,.8)]">Checkout</div>
        </div>
      </div>
    </div>
  );
}

export default function WhyUs() {
  return (
    <section id="why" aria-labelledby="why-h" className="bg-ice scroll-mt-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid gap-12 md:gap-16 md:grid-cols-[1fr_1.05fr] md:items-start">
        <div>
          <p className="eyebrow !py-0">Why US Water Pros</p>
          <h2 id="why-h" className="mt-5 !text-ink !leading-[1.06] !text-[clamp(2.2rem,1.3rem+3.2vw,3.6rem)] [text-wrap:balance]">
            The <span className="italic text-cta">smarter way</span> to cleaner water
          </h2>
          <div className="mt-12 hidden md:block"><Phone /></div>
        </div>
        <ul className="flex flex-col gap-5">
          {BENEFITS.map(([icon, title, body]) => (
            <li key={title} data-rv className="flex gap-5 rounded-[28px] bg-white p-6 md:p-7 shadow-[0_1px_0_#fff_inset,0_24px_50px_-32px_rgba(14,33,43,.4)] ring-1 ring-black/[.05]">
              <span className="shrink-0 w-14 h-14 rounded-2xl ico-dark bg-navy text-white flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(0,0,0,.6)]"><Icon name={icon} size={30} /></span>
              <div>
                <h3 className="font-sans text-[22px] font-semibold tracking-[-0.025em] leading-tight">{title}</h3>
                <p className="!py-0 mt-2 text-[#5b6472] text-[17px] leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
