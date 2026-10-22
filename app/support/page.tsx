import type { Metadata } from 'next';
import SupportCards, { type SupportCard } from '@/components/support/SupportCards';
import { PHONE, PHONE_HREF, SMS_HREF } from '@/lib/constants';
import { STORE } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Support | US Water Pros',
  description: 'Order status, rescheduling, refunds and first checks if something is not working. Fast answers, or text us.',
  alternates: { canonical: '/support' },
};

// VERIFY: the wording of each card against how you actually handle these requests (change and cancel rules, refund process, hardware-specific first checks).
const CARDS: SupportCard[] = [
  { id: 'order-status', title: 'Where is my confirmation?', summary: 'After you pay, we text you to confirm your install time.',
    steps: [STORE.confirm, 'Check your texts for a number you don’t recognize.', 'Nothing yet? Text us your name and ZIP and we’ll look up your order.'],
    keywords: 'order status paid payment receipt confirmation text confirm waiting' },
  { id: 'change-install', title: 'Change or cancel my install', summary: 'Plans change. Tell us as early as you can.',
    steps: ['Text us your name, your install day, and what you’d like to change.', 'We’ll confirm the new time by text.', 'Need to cancel? Say so in the same text.'],
    keywords: 'reschedule move date change cancel appointment time day' },
  { id: 'refunds', title: 'Refunds', summary: `Every order is ${STORE.refund.toLowerCase()}`,
    steps: ['Text or call and tell us the name on the order.', 'We’ll tell you the next step and when to expect your money back.', 'Refunds go back to the card you paid with.'],
    keywords: 'refund money back return charge cancel payment card' },
  { id: 'not-working', title: 'Something isn’t working', summary: 'A few quick checks, then we’ll help. Your system has a 1-year warranty.',
    steps: ['Find the bypass valve on the system and make sure it is set to “in service”.', 'Make sure the control head is plugged in and its display is on.', 'See a leak? Shut off the main water valve first, then text us right away.', 'Send a photo of the system and its display.'],
    keywords: 'broken not working leak leaking pressure no water problem warranty repair bypass display error' },
  { id: 'water-different', title: 'My water looks or tastes different', summary: 'Some changes in the first day are normal.',
    steps: ['Cloudy or sputtering water right after install is often trapped air. Run the cold taps for a few minutes.', 'A new carbon filter can release fine dark dust at first. Run the water until it clears.', 'Still off after a day? Text us a photo and tell us what you notice.'],
    keywords: 'cloudy air bubbles taste smell odor color dark black dust sputter chlorine new install' },
  { id: 'filters-upkeep', title: 'Filters and upkeep', summary: `Plan on a yearly filter change, about ${STORE.annualFilters} a year.`,
    steps: ['Text us when you’re ready and we’ll set up a filter change.', 'If your system includes a softener, keep its brine tank topped up with salt.', 'Not sure what your system needs? Send a photo and we’ll tell you.'],
    keywords: 'filter change replace cartridge maintenance salt softener brine tank yearly upkeep' },
];

export default function Support() {
  return (
    <main>
      <section className="bg-surge">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="inline-block rounded-md bg-white/15 px-3 py-1.5 font-mono text-[12px] font-medium uppercase tracking-[.14em] !text-white !py-1.5">Support</p>
          <h1 className="!font-sans !font-bold !tracking-[-0.045em] !text-white mt-4 !leading-[1.05] !text-[clamp(2.3rem,1.3rem+3.4vw,3.7rem)] [text-wrap:balance]">How can we help?</h1>
          <p className="!text-white mt-4 md:text-lg font-light max-w-2xl">Search the topics below, or text us. Texting is fastest.</p>
          <div className="mt-7 flex flex-wrap gap-3"><a href={SMS_HREF} className="btn btn-cta">Text us</a><a href={PHONE_HREF} className="btn btn-secondary">Call {PHONE}</a></div>
        </div>
      </section>

      <section className="bg-[#fafbfa]">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <SupportCards cards={CARDS} />

          <div className="mt-14 rounded-3xl border border-black/[.08] bg-white p-7 md:p-9 max-w-3xl">
            <h2 className="!font-sans !font-bold !tracking-[-0.03em] !text-ink !text-[24px]">Put this in your message and we can help faster</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {['Your name', 'Your address or ZIP', 'Your install day', 'A photo of the system or the problem', 'What you see or hear', 'When it started'].map((i) => <li key={i} className="flex gap-2.5 font-light"><span aria-hidden className="text-[#007c94] font-bold">✓</span><span>{i}</span></li>)}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
