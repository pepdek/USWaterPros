import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { STORED_EVENTS } from '@/lib/analytics/config';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Stores key site interactions (calls, texts, CTA clicks...) for the CRM dashboard. Anonymous: no contact details accepted.
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (!(STORED_EVENTS as string[]).includes(b.event)) return NextResponse.json({ ok: false }, { status: 400 });
  const t = (v: unknown, n: number) => (typeof v === 'string' && v ? v.slice(0, n) : null);
  const p = (b.params ?? {}) as Record<string, unknown>;
  const params = Object.fromEntries(Object.entries(p).filter(([, v]) => ['string', 'number', 'boolean'].includes(typeof v)).slice(0, 12).map(([k, v]) => [k.slice(0, 30), typeof v === 'string' ? v.slice(0, 80) : v]));
  const { error } = await supabase().from('site_events').insert({
    event: b.event, page: t(b.page, 200), source: t(b.source, 60), device_type: t(b.device_type, 10), traffic_source: t(b.traffic_source, 20),
    lead_source: t(b.lead_source, 120), city: t(b.city, 30), session_id: UUID.test(String(b.sessionId)) ? b.sessionId : null, params,
  });
  if (error) { console.error(error); return NextResponse.json({ ok: false }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
