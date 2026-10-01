'use client';
import { useEffect, useState } from 'react';
import { PHONE_HREF, SMS_HREF } from '@/lib/constants';

// Mobile: fixed bar, hidden once a lead is submitted. Desktop: in-page block.
export default function StickyBottomCTA() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const f = () => setDone(true);
    window.addEventListener('lead-submitted', f);
    return () => window.removeEventListener('lead-submitted', f);
  }, []);
  if (done) return null;
  return (
    <>
      <div className="md:hidden h-28" />
      <div className="fixed bottom-0 inset-x-0 z-40 md:static md:max-w-6xl md:mx-auto md:my-12 bg-navy text-white p-3 md:p-8 md:rounded-xl text-center md:flex md:items-center md:justify-between md:gap-6">
        <p className="text-sm md:text-lg font-semibold mb-2 md:mb-0">Need immediate assistance? Call or text us directly.</p>
        <div className="flex flex-col items-center gap-1 md:items-end">
          <div className="flex gap-2 w-full md:w-auto">
            <a href={PHONE_HREF} className="btn btn-aqua flex-1">Call Now</a>
            <a href={SMS_HREF} className="btn btn-aqua flex-1">Text Us</a>
          </div>
          <span className="text-xs opacity-80">🔒 Privacy Secured — no hoops, no obligation</span>
        </div>
      </div>
    </>
  );
}
