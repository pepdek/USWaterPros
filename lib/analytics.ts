// Back-compat facade. New code should import from '@/lib/analytics/track'.
import { trackEvent } from './analytics/track';

export const track = trackEvent;
export const CTA = 'Schedule Consultation';
