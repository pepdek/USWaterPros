export const GA4_CONFIG = {
  measurementId: process.env.NEXT_PUBLIC_GA_ID || 'G-FN39ESKXNW',
  gtmContainerId: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-T5KRVDNT',
};

// Every GA4 event this site sends. Names are exact: they must match docs/gtm-container.json and the GA4 setup in docs/ANALYTICS.md.
export const EVENTS = [
  // Quiz
  'quiz_start', 'quiz_question_answered', 'quiz_completed', 'quiz_abandoned', 'recommendation_viewed', 'quiz_addon_toggled', 'quiz_cta_click',
  // Leads and forms
  'lead_form_submission', 'water_report_submit', 'form_start', 'form_abandon',
  // Calls, texts and CTAs
  'phone_click', 'sms_click', 'schedule_cta_click',
  // Engagement
  'service_page_viewed', 'city_page_viewed', 'location_page_viewed', 'scroll_depth', 'faq_open', 'outbound_click', 'exit_intent_shown',
] as const;
export type EventName = (typeof EVENTS)[number];

// Mark these as key events (conversions) in GA4.
export const CONVERSION_EVENTS: EventName[] = ['quiz_completed', 'lead_form_submission', 'water_report_submit'];

// Also copied to Supabase (site_events) so the CRM dashboard can report them next to GA4.
export const STORED_EVENTS: EventName[] = [
  'quiz_cta_click', 'water_report_submit', 'form_start', 'form_abandon', 'phone_click', 'sms_click', 'schedule_cta_click',
  'exit_intent_shown', 'faq_open', 'outbound_click',
];

export type EventParameter = {
  quiz_type?: string; urgency_flag?: string; recommended_path?: string; communication_pref?: string; city?: string;
  form_type?: string; source?: string; service?: string; question_number?: number; question_id?: string; answer_selected?: string;
  recommended_system?: string; recommended_price?: number; time_to_complete?: number; percent?: number; link_domain?: string;
  quiz_completed?: boolean; addon?: string; selected?: boolean; last_question?: string; element?: string;
  [key: string]: string | number | boolean | undefined;
};
