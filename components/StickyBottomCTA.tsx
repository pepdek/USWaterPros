'use client';
import { useEffect, useState } from 'react';
import WizardButton from '@/components/store/WizardButton';
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
    <div data-track-source="cta_block" className="max-w-6xl mx-4 md:mx-auto my-8 md:my-12 bg-navy text-white p-7 md:p-9 rounded-[32px] text-center shadow-[0_40px_80px_-40px_rgba(14,33,43,.7)] md:flex md:items-center md:justify-between md:gap-8 md:gap-10">
      <p className="text-[22px] font-semibold tracking-[-0.025em] mb-4 md:mb-0">See your price in under a minute</p>
      <div className="flex flex-col items-center gap-2 md:items-end">
        <div className="flex gap-2 w-full md:hidden">
          <WizardButton className="btn btn-cta flex-1">Get Instant Price</WizardButton>
          <a href={SMS_HREF} className="btn btn-secondary flex-1">Text us</a>
        </div>
        <div className="hidden md:flex gap-3">
          <WizardButton className="btn btn-cta">Get Instant Price</WizardButton>
          <a href={SMS_HREF} className="btn btn-secondary">Text us</a>
        </div>
        <span className="text-xs opacity-80">Pay up front, 100% refundable</span>
      </div>
    </div>
  );
}
