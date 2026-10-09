'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { captureAttribution, trackEvent } from '@/lib/analytics/track';

// Where on the page a click happened: an explicit data-track-source wins, else header/footer/dialog, else "page".
const where = (el: Element) =>
  el.closest('[data-track-source]')?.getAttribute('data-track-source') ||
  (el.closest('header') ? 'header' : el.closest('footer') ? 'footer' : el.closest('[role=dialog]') ? 'dialog' : 'page');

// Site-wide listeners: attribution capture, page-type views, scroll depth, calls/texts/CTA clicks, FAQ opens, outbound links.
export default function AnalyticsEvents() {
  const path = usePathname();
  const seen = useRef(new Set<number>());

  useEffect(() => { captureAttribution(); }, []);

  useEffect(() => {
    seen.current = new Set();
    const slug = path.split('/').pop() || '';
    if (/^\/services\/whole-home-water-filtration-/.test(path)) trackEvent('city_page_viewed', { city: slug.replace('whole-home-water-filtration-', '').replace('-', '_') });
    else if (path.startsWith('/services/')) trackEvent('service_page_viewed', { service: slug });
    else if (path.startsWith('/locations/')) trackEvent('location_page_viewed', { service: slug });
  }, [path]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      if (h <= 0) return;
      const pct = (scrollY / h) * 100;
      for (const t of [25, 50, 75, 90]) if (pct >= t && !seen.current.has(t)) { seen.current.add(t); trackEvent('scroll_depth', { percent: t }); }
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      const source = where(a);
      const text = (a.textContent || '').trim().slice(0, 40);
      if (href.startsWith('tel:')) trackEvent('phone_click', { source });
      else if (href.startsWith('sms:')) trackEvent('sms_click', { source });
      else if (href === '#quote') trackEvent('schedule_cta_click', { source, element: text });
      else if (href === '/quiz') trackEvent('quiz_cta_click', { source, element: text });
      else if (/^https?:\/\//.test(href) && !href.includes(location.hostname)) trackEvent('outbound_click', { source, link_domain: new URL(href).hostname });
    };
    const onToggle = (e: Event) => {
      const d = e.target as HTMLDetailsElement;
      if (d?.tagName === 'DETAILS' && d.open) trackEvent('faq_open', { question: (d.querySelector('summary')?.textContent || '').trim().slice(0, 80) });
    };
    addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('click', onClick, true);
    document.addEventListener('toggle', onToggle, true);
    return () => { removeEventListener('scroll', onScroll); document.removeEventListener('click', onClick, true); document.removeEventListener('toggle', onToggle, true); };
  }, []);

  return null;
}
