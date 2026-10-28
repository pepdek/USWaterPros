'use client';
import { useEffect, useRef, useState } from 'react';
import WizardButton from '@/components/store/WizardButton';
import Link from 'next/link';
import Icon from './Icon';
import { PHONE, PHONE_HREF } from '@/lib/constants';
import { SERVICES } from '@/lib/services';
import { CITIES } from '@/lib/cities';

const SERVICE_LINKS = SERVICES.map((s) => [s.name, `/services/${s.slug}`]);
const AREA_LINKS = CITIES.map((c) => [`${c.name}, WA`, `/services/whole-home-water-filtration-${c.slug}`]);

// Disclosure dropdown: button + aria-expanded, Escape and click-away close it.
function Dropdown({ label, links }: { label: string; links: string[][] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [open]);
  return (
    <div ref={ref} className="relative" onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false); }}>
      <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)}
        className="min-h-11 inline-flex items-center gap-1 text-[14px] font-medium text-ink/75 hover:text-ink hdr-t transition-colors">{label} <svg aria-hidden width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="M2.5 4.5L6 8l3.5-3.5" /></svg></button>
      {open && (
        <div className="glass !rounded-2xl absolute left-0 top-full mt-3 min-w-[220px] w-max p-2 z-50">
          {links.map(([t, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-2.5 text-[14px] text-ink hover:bg-black/[.05] transition-colors">{t}</Link>)}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [menu, setMenu] = useState(false);
  const [solid, setSolid] = useState(false);
  // On dark-hero pages the header is light-on-dark only while the hero is under it.
  useEffect(() => {
    const f = () => { const h = document.querySelector('main > :first-child'); setSolid(!!h && h.getBoundingClientRect().bottom < 80); };
    f(); window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [menu]);
  const close = () => setMenu(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  // Mobile menu: focus moves in when it opens, Tab stays inside, and focus goes back to the button when it closes.
  useEffect(() => {
    if (!menu) return;
    const prev = document.activeElement as HTMLElement | null;
    const items = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []).filter((x) => x.getClientRects().length > 0);
    items()[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const l = items(); if (!l.length) return;
      if (e.shiftKey && document.activeElement === l[0]) { e.preventDefault(); l[l.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === l[l.length - 1]) { e.preventDefault(); l[0].focus(); }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); (menuBtn.current ?? prev)?.focus?.(); };
  }, [menu]);

  return (
    <header data-solid={solid ? '' : undefined} className="sticky top-0 z-50 px-3 pt-3">
      <div className="glass !rounded-[22px] mx-auto max-w-6xl">
      <div className={`px-4 md:px-5 flex items-center justify-between gap-3 transition-all duration-300 h-16`}>
        <Link href="/" className="hdr-t text-ink shrink-0 min-h-11 inline-flex flex-col justify-center leading-none"><span className="font-mono text-[26px] font-extrabold uppercase tracking-[.03em]"><span aria-hidden className="text-cta text-[18px] mr-1.5 align-[2px]">★</span>US Water Pros</span><span className="hdr-t hidden md:block font-mono text-[11px] font-semibold uppercase tracking-[.22em] text-ink/75 mt-1">America's Water Professionals</span></Link>

        <nav aria-label="Main" className="hidden md:flex items-center gap-7 text-sm">
          <Dropdown label="Services" links={SERVICE_LINKS} />
          <Dropdown label="Service Areas" links={AREA_LINKS} />
          <Link href="/pricing" className="min-h-11 inline-flex items-center text-[14px] font-medium text-ink/75 hover:text-ink hdr-t transition-colors">Pricing</Link>
          <Link href="/#process" className="min-h-11 inline-flex items-center text-[14px] font-medium text-ink/75 hover:text-ink hdr-t transition-colors">Process</Link>
          <Link href="/tools" className="min-h-11 inline-flex items-center text-[14px] font-medium text-ink/75 hover:text-ink hdr-t transition-colors">Tools</Link>
        </nav>

        <div className="flex items-center gap-2">
          <a href={PHONE_HREF} aria-label={`Call ${PHONE}`} className="btn btn-sm btn-secondary !px-0 w-11 2xl:!px-5 2xl:w-auto">
            <svg className="2xl:hidden" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" /></svg>
            <span className="hidden 2xl:inline">{PHONE}</span>
          </a>
          <WizardButton className="btn btn-sm btn-cta hidden md:inline-flex">Get Instant Price</WizardButton>
          <button ref={menuBtn} type="button" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}
            className="tap md:hidden inline-flex min-h-12 min-w-12 items-center justify-center rounded-full text-ink hdr-t">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
        </div>
      </div>
      <Link href="/quiz" className="md:hidden flex items-center justify-center min-h-10 border-t border-black/[.06] text-[13px] font-medium text-ink/70 hdr-t">Not sure which system? <span aria-hidden className="ml-1">→</span></Link>
      </div>

      {menu && (
        <div ref={menuRef} role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] bg-white/90 backdrop-blur-2xl overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
            <span className="text-2xl font-bold text-ink">Menu</span>
            <button type="button" aria-label="Close menu" onClick={close} className="tap min-h-12 min-w-12 rounded-full inline-flex items-center justify-center text-ink">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
            </button>
          </div>
          <div className="mx-auto max-w-6xl px-4 pb-10 flex flex-col gap-8 md:gap-10">
            <WizardButton className="btn btn-cta" onClick={close}>Get Instant Price →</WizardButton>
            {([['Services', SERVICE_LINKS], ['Service Areas', AREA_LINKS]] as [string, string[][]][]).map(([h, links]) => (
              <div key={h}>
                <p className="text-xl font-bold text-ink">{h}</p>
                {links.map(([t, href]) => <Link key={href} href={href} onClick={close} className="block min-h-12 py-3 text-ink hover:text-blue">{t}</Link>)}
              </div>
            ))}
            <Link href="/pricing" onClick={close} className="text-xl font-bold text-ink min-h-12">Pricing</Link>
            <Link href="/#process" onClick={close} className="text-xl font-bold text-ink min-h-12">Process</Link>
            <Link href="/tools" onClick={close} className="text-xl font-bold text-ink min-h-12">Tools</Link>
            <a href={PHONE_HREF} className="btn btn-secondary">{PHONE}</a>
          </div>
        </div>
      )}
    </header>
  );
}
