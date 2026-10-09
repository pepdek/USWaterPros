import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONVERSION_EVENTS, EVENTS, STORED_EVENTS } from './config';
import { citySlug, classifyTouch, deviceType, formTypeFor, leadSourceLabel, trackEvent } from './track';

describe('traffic classification', () => {
  it('google referrer is organic', () => {
    expect(classifyTouch('https://uswaterpros.com/', 'https://www.google.com/')).toMatchObject({ traffic_source: 'organic', source: 'google.com', medium: 'organic' });
  });
  it('utm cpc and gclid are paid', () => {
    expect(classifyTouch('https://uswaterpros.com/?utm_source=google&utm_medium=cpc&utm_campaign=whole_home', '')).toMatchObject({ traffic_source: 'paid', source: 'google', medium: 'cpc', campaign: 'whole_home' });
    expect(classifyTouch('https://uswaterpros.com/?gclid=abc', 'https://www.google.com/').traffic_source).toBe('paid');
  });
  it('social, email, referral, direct', () => {
    expect(classifyTouch('https://uswaterpros.com/', 'https://l.facebook.com/').traffic_source).toBe('social');
    expect(classifyTouch('https://uswaterpros.com/?utm_source=news&utm_medium=email', '').traffic_source).toBe('email');
    expect(classifyTouch('https://uswaterpros.com/', 'https://someblog.com/post').traffic_source).toBe('referral');
    expect(classifyTouch('https://uswaterpros.com/', '').traffic_source).toBe('direct');
  });
  it('own site as referrer is direct', () => {
    expect(classifyTouch('https://uswaterpros.com/quiz', 'https://uswaterpros.com/').traffic_source).toBe('direct');
  });
  it('lead source label', () => {
    expect(leadSourceLabel({ source: 'google', medium: 'cpc', campaign: 'whole_home' })).toBe('google / cpc / whole_home');
    expect(leadSourceLabel({ source: 'direct', medium: 'none', campaign: '' })).toBe('direct');
  });
});

describe('helpers', () => {
  it('form types by page', () => {
    expect(formTypeFor('/')).toBe('hero_form');
    expect(formTypeFor('/services/well-water-treatment')).toBe('service_page_form');
    expect(formTypeFor('/services/whole-home-water-filtration-tacoma')).toBe('city_page_form');
    expect(formTypeFor('/locations/kitsap-county')).toBe('county_page_form');
    expect(formTypeFor('/quiz')).toBe('quiz_result');
  });
  it('city slug and device type', () => {
    expect(citySlug('Port Orchard, WA')).toBe('port_orchard');
    expect(citySlug('Other')).toBe('other');
    expect(citySlug(undefined)).toBe('unknown');
    expect([deviceType(375), deviceType(800), deviceType(1400)]).toEqual(['mobile', 'tablet', 'desktop']);
  });
  it('config is consistent', () => {
    for (const e of [...CONVERSION_EVENTS, ...STORED_EVENTS]) expect(EVENTS).toContain(e);
    expect(new Set(EVENTS).size).toBe(EVENTS.length);
  });
});

describe('trackEvent', () => {
  const store = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) }; };
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    fetchMock = vi.fn(() => Promise.resolve({}));
    vi.stubGlobal('window', { innerWidth: 390, dataLayer: [] as unknown[] });
    vi.stubGlobal('location', { pathname: '/quiz', href: 'https://uswaterpros.com/quiz?utm_source=google&utm_medium=cpc' });
    vi.stubGlobal('document', { referrer: '' });
    vi.stubGlobal('sessionStorage', store());
    vi.stubGlobal('localStorage', store());
    vi.stubGlobal('crypto', { randomUUID: () => '11111111-1111-4111-8111-111111111111' });
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('pushes to the dataLayer with device, source and page enrichment', () => {
    trackEvent('quiz_start', { quiz_type: 'whole_home' });
    const dl = (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer;
    expect(dl[0]).toMatchObject({ event: 'quiz_start', quiz_type: 'whole_home', device_type: 'mobile', page_path: '/quiz' });
  });
  it('never lets a page-location source overwrite attribution', () => {
    trackEvent('phone_click', { source: 'header' });
    const e = (window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer[0];
    expect(e.element_source).toBe('header');
    expect(e.source).not.toBe('header');
  });
  it('copies only the key events to Supabase', () => {
    trackEvent('phone_click', { source: 'footer' });
    trackEvent('scroll_depth', { percent: 50 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('/api/site-event');
    expect(JSON.parse((fetchMock.mock.calls[0][1] as { body: string }).body)).toMatchObject({ event: 'phone_click', source: 'footer', device_type: 'mobile' });
  });
});
