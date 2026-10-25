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
    <h1 className="!font-bold !tracking-[-0.055em] !text-ink mt-6 !leading-[.98] !text-[clamp(2.5rem,1.1rem+5.2vw,4.25rem)] [text-wrap:balance]">
      {headline(pain)}<br /><span className="!font-bold !text-[#86868b]">Done in a day.</span>
    </h1>
  );
}
