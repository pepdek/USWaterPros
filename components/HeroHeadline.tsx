'use client';
import { useEffect, useState } from 'react';
import { DEFAULT_PAIN, headline, painForZip, type PainKey } from '@/lib/pain';

export const ZIP_EVENT = 'hero-zip';

// "{pain} gone. Done in a day." The word follows the visitor's IP area, then the ZIP they type. Server render is the default.
export default function HeroHeadline() {
  const [pain, setPain] = useState<PainKey>(DEFAULT_PAIN);
  useEffect(() => {
    let typed = false;
    fetch('/api/geo').then((r) => r.json()).then((j) => { if (!typed && j?.pain) setPain(j.pain); }).catch(() => {});
    const onZip = (e: Event) => { const k = painForZip(String((e as CustomEvent).detail ?? '')); if (k) { typed = true; setPain(k); } };
    window.addEventListener(ZIP_EVENT, onZip);
    return () => window.removeEventListener(ZIP_EVENT, onZip);
  }, []);
  return (
    <h1 className="!font-sans !font-bold !tracking-[-0.045em] !text-white mt-4 !leading-[1.04] !text-[clamp(2.3rem,1.3rem+3.4vw,3.7rem)] [text-wrap:balance]">
      {headline(pain)}<br /><span className="!font-mono !font-medium !tracking-[-0.02em] text-[#a8e9ef] text-[.8em]">Done in a day.</span>
    </h1>
  );
}
