import { trackEvent } from '@/lib/analytics/track';

export type WizardDetail = { zip?: string; tier?: string };
export const WIZARD_EVENT = 'open-wizard';

// Opens the instant-price wizard from anywhere. Also fires the existing CTA click event so reports keep working.
export function openWizard(detail: WizardDetail = {}, from?: Element | null) {
  const source = (from?.closest('[data-track-source]') as HTMLElement | null)?.dataset.trackSource ?? 'page';
  trackEvent('schedule_cta_click', { source, element: 'get_instant_price' });
  window.dispatchEvent(new CustomEvent(WIZARD_EVENT, { detail }));
}
