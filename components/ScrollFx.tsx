'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Reveals anything marked data-rv as it scrolls into view. Nothing is hidden until this runs (the html.rv-on class), so without JavaScript, or with
// reduced motion, every element is simply there. A plain scroll check (not an IntersectionObserver) so an element can never get stuck hidden:
// anything at or above the fold line is revealed, including things scrolled past quickly. Re-scans on every page change.
export default function ScrollFx() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pending = new Set<HTMLElement>(Array.from(document.querySelectorAll<HTMLElement>('[data-rv]')));
    const check = () => {
      const line = innerHeight * 0.92;
      pending.forEach((e) => { if (e.getBoundingClientRect().top < line) { e.classList.add('in'); pending.delete(e); } });
    };
    check(); // already on screen: no flash
    document.documentElement.classList.add('rv-on');
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(check); };
    addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
    const late = setTimeout(check, 1200); // images and fonts can move things after the first paint
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); clearTimeout(late); };
  }, [path]);
  return null;
}
