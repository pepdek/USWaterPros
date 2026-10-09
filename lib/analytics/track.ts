// Browser-side tracking. Events go to GTM's dataLayer (GTM forwards them to GA4); key ones are also copied to Supabase.
// Never pass names, emails, phone numbers or ZIP codes here: only anonymous answers and categories.
import { STORED_EVENTS, type EventName, type EventParameter } from './config';

export type Touch = { source: string; medium: string; campaign: string; traffic_source: string; landing_page: string; referrer: string; gclid?: string; ts: string };
export type Attribution = { first: Touch; last: Touch; lead_source: string };

const SEARCH = /(^|\.)(google|bing|yahoo|duckduckgo|ecosia|brave)\./i;
const SOCIAL = /(^|\.)(facebook|instagram|t\.co|twitter|x|linkedin|pinterest|tiktok|youtube|reddit|nextdoor)\./i;

export const deviceType = (width: number) => (width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop');

// Classify a visit from its URL and referrer: paid | organic | email | social | referral | direct.
export function classifyTouch(url: string, referrer: string, ownHost = 'uswaterpros.com'): Omit<Touch, 'ts'> {
  const u = new URL(url, 'https://' + ownHost);
  const q = u.searchParams;
  let refHost = '';
  try { refHost = referrer ? new URL(referrer).hostname : ''; } catch { /* bad referrer */ }
  if (refHost.endsWith(ownHost)) refHost = '';
  const utmSource = q.get('utm_source') || '', utmMedium = (q.get('utm_medium') || '').toLowerCase(), campaign = q.get('utm_campaign') || '';
  const gclid = q.get('gclid') || q.get('gbraid') || q.get('wbraid') || q.get('fbclid') || undefined;
  let traffic_source = 'direct', source = utmSource || refHost || 'direct', medium = utmMedium || (refHost ? 'referral' : 'none');
  if (gclid || /^(cpc|ppc|paid|paidsearch|paid_social|display)/.test(utmMedium)) { traffic_source = 'paid'; if (!utmMedium) medium = 'cpc'; if (!utmSource && refHost) source = refHost.replace(/^www\./, ''); }
  else if (utmMedium === 'email') traffic_source = 'email';
  else if (utmMedium.includes('social') || (!utmSource && SOCIAL.test(refHost))) traffic_source = 'social';
  else if (utmSource || utmMedium) traffic_source = utmMedium === 'organic' ? 'organic' : 'referral';
  else if (refHost && SEARCH.test(refHost)) { traffic_source = 'organic'; medium = 'organic'; }
  else if (refHost) traffic_source = 'referral';
  source = source.replace(/^www\./, '');
  return { source, medium, campaign, traffic_source, landing_page: u.pathname, referrer: refHost, gclid };
}

export const leadSourceLabel = (t: Pick<Touch, 'source' | 'medium' | 'campaign'>) =>
  [t.source, t.medium, t.campaign].filter((x) => x && x !== 'none').join(' / ').slice(0, 120) || 'direct';

export function formTypeFor(pathname: string): string {
  if (pathname === '/') return 'hero_form';
  if (pathname.startsWith('/quiz')) return 'quiz_result';
  if (pathname.startsWith('/locations/')) return 'county_page_form';
  if (/^\/(cities\/|services\/whole-home-water-filtration-)/.test(pathname)) return 'city_page_form';
  if (pathname.startsWith('/services/')) return 'service_page_form';
  return 'other_form';
}

export const citySlug = (location?: string) => {
  const c = (location || '').toLowerCase();
  return c.startsWith('tacoma') ? 'tacoma' : c.startsWith('puyallup') ? 'puyallup' : c.startsWith('bremerton') ? 'bremerton' : c.startsWith('port orchard') ? 'port_orchard' : c ? 'other' : 'unknown';
};

const safe = <T,>(fn: () => T, fallback: T): T => { try { return fn(); } catch { return fallback; } };

// First touch is kept for 90 days; last touch refreshes when a visit carries campaign data or a new session starts.
export function captureAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;
  const now = new Date().toISOString();
  const touch: Touch = { ...classifyTouch(location.href, document.referrer), ts: now };
  const first = safe(() => JSON.parse(localStorage.getItem('uswp_first') || 'null') as Touch | null, null);
  const fresh = !first || Date.now() - new Date(first.ts).getTime() > 90 * 86400000;
  if (fresh) safe(() => localStorage.setItem('uswp_first', JSON.stringify(touch)), undefined);
  const campaignVisit = touch.traffic_source !== 'direct' || !!touch.gclid;
  const sessionLast = safe(() => JSON.parse(sessionStorage.getItem('uswp_last') || 'null') as Touch | null, null);
  if (!sessionLast || campaignVisit) safe(() => sessionStorage.setItem('uswp_last', JSON.stringify(touch)), undefined);
  return getAttribution();
}

export function getAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null;
  const last = safe(() => JSON.parse(sessionStorage.getItem('uswp_last') || 'null') as Touch | null, null);
  const first = safe(() => JSON.parse(localStorage.getItem('uswp_first') || 'null') as Touch | null, null) || last;
  if (!first || !last) return null;
  // Credit the lead to the last campaign touch, else the first touch.
  return { first, last, lead_source: leadSourceLabel(last.traffic_source !== 'direct' ? last : first) };
}

export function sessionId(): string {
  return safe(() => {
    let id = sessionStorage.getItem('uswp_sid');
    if (!id) { id = crypto.randomUUID(); sessionStorage.setItem('uswp_sid', id); }
    return id;
  }, '');
}

// Fire one event. Safe to call anywhere; does nothing on the server.
export function trackEvent(name: EventName | string, params: EventParameter = {}) {
  if (typeof window === 'undefined') return;
  const a = getAttribution();
  const payload: Record<string, unknown> = {
    event: name,
    page_path: location.pathname,
    device_type: deviceType(window.innerWidth),
    traffic_source: a?.last.traffic_source ?? 'direct',
    source: a?.last.source ?? 'direct',
    medium: a?.last.medium ?? 'none',
    campaign: a?.last.campaign || undefined,
    lead_source: a?.lead_source ?? 'direct',
    city: safe(() => sessionStorage.getItem('uswp_city'), null) || undefined,
    ...params,
  };
  // `source` as a page location (header, footer...) must not overwrite attribution: rename it.
  if (params.source) { payload.element_source = params.source; payload.source = a?.last.source ?? 'direct'; }
  const w = window as unknown as { dataLayer?: unknown[]; posthog?: { capture: (e: string, p: unknown) => void } };
  (w.dataLayer = w.dataLayer || []).push(payload);
  w.posthog?.capture(String(name), payload);
  if (process.env.NODE_ENV !== 'production') console.debug('[track]', name, payload);
  if ((STORED_EVENTS as string[]).includes(name as string)) {
    const body = JSON.stringify({ event: name, page: location.pathname, source: params.source, device_type: payload.device_type, traffic_source: payload.traffic_source, lead_source: payload.lead_source, city: payload.city, sessionId: sessionId(), params });
    try { fetch('/api/site-event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {}); } catch { /* ignore */ }
  }
}
