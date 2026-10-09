'use client';
import { useEffect, useState } from 'react';
import { PHONE, PHONE_HREF, SMS_HREF } from '@/lib/constants';

// Two buttons only. Mobile: Text Us (primary) + Call Us (secondary). Desktop: Schedule Consultation (primary) + phone number (secondary).
// In-page block (not fixed). Hidden once a lead is submitted.
export default function StickyBottomCTA() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const f = () => setDone(true);
    window.addEventListener('lead-submitted', f);
    return () => window.removeEventListener('lead-submitted', f);
  }, []);
  if (done) return null;
  return (
    <div data-track-source="cta_block" className="max-w-6xl mx-4 md:mx-auto my-8 md:my-12 bg-navy text-white p-6 md:p-8 rounded-xl text-center md:flex md:items-center md:justify-between md:gap-8 md:gap-10">
      <p className="text-lg font-semibold mb-4 md:mb-0">Your local water professional is standing by</p>
      <div className="flex flex-col items-center gap-2 md:items-end">
        <div className="flex gap-2 w-full md:hidden">
          <a href={SMS_HREF} className="btn btn-cta flex-1">Text Us</a>
          <a href={PHONE_HREF} className="btn btn-secondary flex-1">Call Us</a>
        </div>
        <div className="hidden md:flex gap-3">
          <a href="#quote" className="btn btn-cta">Schedule Consultation</a>
          <a href={PHONE_HREF} className="btn btn-secondary">{PHONE}</a>
        </div>
        <span className="text-xs opacity-80">🔒 Privacy Secured — no hoops, no obligation</span>
      </div>
    </div>
  );
}
