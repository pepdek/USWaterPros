'use client';
import { useState } from 'react';
import Icon from './Icon';

const BENEFITS: [string, string][] = [
  ['drop', 'Less chlorine taste & smell'], ['badge', 'One fixed, installed price'], ['shield', 'Licensed local plumbers'],
  ['clock', 'Installed in about 4 hours'], ['check', '100% refundable'], ['layers', 'Filters sediment & rust'],
];

// Two copies + translateX(-50%) = seamless loop. It scrolls on its own, so there is a Pause button (and it also stops on hover or focus).
export default function BenefitsScroll() {
  const [paused, setPaused] = useState(false);
  return (
    <section className="relative bg-white border-y border-black/[.06] text-ink py-5 overflow-hidden" aria-label="Whole-home filtration benefits">
      <div className="marquee-mask">
        <div className="marquee gap-4" style={paused ? { animationPlayState: 'paused' } : undefined}>
          {[...BENEFITS, ...BENEFITS].map(([icon, t], i) => (
            <span key={i} aria-hidden={i >= BENEFITS.length} className="flex items-center gap-2 mr-10 whitespace-nowrap font-medium text-[16px] tracking-[-0.01em]">
              <span className="text-navy"><Icon name={icon} size={28} /></span>{t}
            </span>
          ))}
        </div>
      </div>
      <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)} className="chip absolute right-3 top-1/2 -translate-y-1/2 !min-h-11 shadow-md !bg-white">
        {paused ? 'Play' : 'Pause'}<span className="sr-only"> the scrolling highlights</span>
      </button>
    </section>
  );
}
