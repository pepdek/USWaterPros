'use client';
import { useState } from 'react';

// Original art: a sad water drop holding a wrench. Click it once and it drips (CSS only; off when the visitor prefers reduced motion).
export default function SadDrop() {
  const [drip, setDrip] = useState(false);
  return (
    <button type="button" onClick={() => setDrip(true)} aria-label="A sad water drop" className="nf-drop block mx-auto rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
      <svg viewBox="0 0 200 220" width="190" height="209" role="img" aria-hidden="true" className="max-w-full h-auto">
        <path d="M100 14C100 14 38 90 38 138a62 62 0 00124 0c0-48-62-124-62-124z" fill="var(--nf-drop)" stroke="var(--nf-line)" strokeWidth="5" strokeLinejoin="round" />
        <path d="M70 120c0-12 6-24 14-34" fill="none" stroke="var(--nf-shine)" strokeWidth="7" strokeLinecap="round" />
        <circle cx="80" cy="140" r="6" fill="var(--nf-line)" /><circle cx="120" cy="140" r="6" fill="var(--nf-line)" />
        <path d="M66 126l20 6M134 126l-20 6" stroke="var(--nf-line)" strokeWidth="4" strokeLinecap="round" />
        <path d="M82 170c10-9 26-9 36 0" fill="none" stroke="var(--nf-line)" strokeWidth="5" strokeLinecap="round" />
        <path d="M146 150l26 26" stroke="var(--nf-line)" strokeWidth="9" strokeLinecap="round" />
        <path d="M166 160a14 14 0 1019 19l-8 3-6-6 3-8z" fill="var(--nf-wrench)" stroke="var(--nf-line)" strokeWidth="4" strokeLinejoin="round" />
        <ellipse className={drip ? 'nf-dripping' : ''} cx="100" cy="196" rx="6" ry="9" fill="var(--nf-drop)" stroke="var(--nf-line)" strokeWidth="3" opacity={drip ? 1 : 0} />
      </svg>
    </button>
  );
}
