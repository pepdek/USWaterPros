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
    <h1 className="!font-bold !tracking-[-0.03em] !text-ink mt-5 !leading-[1.0] !text-[clamp(2.4rem,1.1rem+4.6vw,4.1rem)] [text-wrap:pretty]">
      {headline(pain)}<br /><span className="italic !font-semibold !text-cta">Done in a day.</span>
    </h1>
  );
}
