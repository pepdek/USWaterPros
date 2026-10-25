'use client';
import { useMemo, useState } from 'react';
import { PHONE, PHONE_HREF, SMS_HREF } from '@/lib/constants';

export type SupportCard = { id: string; title: string; summary: string; steps: string[]; keywords: string };

export default function SupportCards({ cards }: { cards: SupportCard[] }) {
  const [q, setQ] = useState('');
  const shown = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return words.length ? cards.filter((c) => words.every((w) => `${c.title} ${c.summary} ${c.steps.join(' ')} ${c.keywords}`.toLowerCase().includes(w))) : cards;
  }, [q, cards]);

  return (
    <div>
      <label className="block max-w-xl">
        <span className="eyebrow mb-2">Search help</span>
        <input type="search" className="field !min-h-[56px] !text-[17px]" placeholder="Try: refund, reschedule, cloudy water, filter" value={q} onChange={(e) => setQ(e.target.value)} aria-describedby="support-count" />
      </label>
      <p id="support-count" role="status" className="!py-0 mt-3 text-[14px] text-[#4b5a60]">{shown.length === cards.length ? `${cards.length} topics` : `${shown.length} of ${cards.length} topics`}</p>

      {shown.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-black/[.08] bg-white p-8 max-w-xl">
          <h3 className="font-sans text-[22px] font-bold tracking-[-0.02em]">We don&apos;t see that one yet.</h3>
          <p className="!py-0 mt-2 font-light">Text us what&apos;s going on and we&apos;ll help.</p>
          <div className="mt-5 flex flex-wrap gap-3"><a href={SMS_HREF} className="btn btn-cta">Text us</a><a href={PHONE_HREF} className="btn btn-secondary">Call {PHONE}</a></div>
        </div>
      ) : (
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <li key={c.id} id={c.id} className="scroll-mt-24 flex flex-col rounded-3xl border border-black/[.08] bg-white p-7 shadow-[0_2px_14px_rgba(0,0,0,.05)]">
              <h2 className="!text-ink !text-[24px] !leading-tight">{c.title}</h2>
              <p className="!py-0 mt-2 font-light text-[#3f4a4f] text-[17px] leading-snug">{c.summary}</p>
              <ul className="mt-5 flex flex-col gap-2.5 border-t border-black/[.07] pt-5">
                {c.steps.map((s) => <li key={s} className="flex gap-2.5 text-[16px] font-light"><span aria-hidden className="text-[#007c94] font-bold">→</span><span>{s}</span></li>)}
              </ul>
              <a href={SMS_HREF} className="btn btn-sm btn-secondary mt-6 self-start">Text us about this</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
