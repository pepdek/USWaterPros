'use client';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics/track';

// Fires the existing lead_form_submission conversion once, after a real form submit (the form leaves a note in sessionStorage).
export default function ThanksEvent() {
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('lead_conversion');
      if (!raw) return;
      sessionStorage.removeItem('lead_conversion');
      const p = JSON.parse(raw);
      trackEvent('lead_form_submission', { service: p.service, form_type: p.form_type, seconds_to_submit: p.seconds_to_submit, quiz_completed: false });
    } catch { /* storage blocked or bad value: no event */ }
  }, []);
  return null;
}
