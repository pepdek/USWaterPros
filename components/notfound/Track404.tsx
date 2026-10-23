'use client';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics/track';

// Path only: no query string, no hash, nothing about the visitor. Goes to analytics and to the server log (/api/404-log).
export default function Track404() {
  useEffect(() => {
    trackEvent('page_404'); // trackEvent adds page_path (pathname only)
    try { fetch('/api/404-log', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: location.pathname }), keepalive: true }).catch(() => {}); } catch { /* ignore */ }
  }, []);
  return null;
}
