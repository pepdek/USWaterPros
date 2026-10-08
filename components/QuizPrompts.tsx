'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const seen = (k: string) => { try { return sessionStorage.getItem(k) === '1'; } catch { return false; } };
const mark = (k: string) => { try { sessionStorage.setItem(k, '1'); } catch { /* private mode */ } };

// Desktop corner banner + exit-intent modal. Both skip /quiz and stay quiet once a lead is submitted.
export default function QuizPrompts() {
  const path = usePathname();
  const [banner, setBanner] = useState(true);
  const [exit, setExit] = useState(false);
  const acted = useRef(false);
  const off = path === '/quiz';

  useEffect(() => {
    if (off) return;
    const born = Date.now();
    const quiet = () => (acted.current = true);
    const fire = () => { if (!acted.current && !seen('exit-quiz') && Date.now() - born > 8000) { mark('exit-quiz'); setExit(true); } };
    // Mouse leaves through the top of the window (desktop), or the footer scrolls into view without any form interaction.
    const out = (e: MouseEvent) => { if (e.clientY <= 0 && !e.relatedTarget) fire(); };
    const footer = document.querySelector('footer');
    const io = footer ? new IntersectionObserver(([en]) => en.isIntersecting && fire(), { threshold: 0.3 }) : null;
    if (footer) io!.observe(footer);
    document.addEventListener('mouseout', out);
    document.addEventListener('focusin', (e) => { if ((e.target as HTMLElement).closest('form')) quiet(); });
    window.addEventListener('lead-submitted', quiet);
    return () => { document.removeEventListener('mouseout', out); window.removeEventListener('lead-submitted', quiet); io?.disconnect(); };
  }, [off, path]);

  useEffect(() => {
    if (!exit) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setExit(false);
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [exit]);

  if (off) return null;
  return (
    <>
      {banner && (
        <aside className="hidden lg:block fixed right-4 bottom-4 z-30 w-60 card p-4 !transform-none" aria-label="Quiz">
          <button type="button" onClick={() => setBanner(false)} aria-label="Dismiss" className="absolute top-1 right-2 min-h-8 min-w-8 text-navy/60">✕</button>
          <p className="font-semibold text-navy">Not sure which system?</p>
          <Link href="/quiz" className="font-semibold text-navy underline min-h-12 inline-flex items-center">Take the quiz →</Link>
        </aside>
      )}
      {exit && (
        <div role="dialog" aria-modal="true" aria-labelledby="exit-h" className="fixed inset-0 z-[70] bg-navy/60 flex items-center justify-center p-4" onClick={() => setExit(false)}>
          <div className="card p-8 max-w-md text-center !transform-none relative" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setExit(false)} aria-label="Close" className="absolute top-2 right-3 min-h-10 min-w-10 text-navy/60">✕</button>
            <h2 id="exit-h">Wait — See Your Custom System First</h2>
            <p className="mt-2">2-min quiz. No phone number required yet.</p>
            <Link href="/quiz" onClick={() => setExit(false)} className="btn btn-aqua mt-6 w-full">Start the Quiz</Link>
          </div>
        </div>
      )}
    </>
  );
}
