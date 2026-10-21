import { NextRequest, NextResponse } from 'next/server';
import { tierById } from '@/lib/pricing';

// Starts a Stripe Checkout payment for one tier. The price comes from lib/pricing.ts, never from the browser.
// Without STRIPE_SECRET_KEY it answers { payment: 'pending' } and the wizard says we will text a secure payment link.
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  const tier = tierById(String(b.tier ?? ''));
  const leadId = String(b.leadId ?? '').slice(0, 40);
  if (!tier || !/^[0-9a-f-]{36}$/i.test(leadId)) return NextResponse.json({ ok: false }, { status: 400 });
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return NextResponse.json({ ok: true, payment: 'pending' });

  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const f = new URLSearchParams({
    mode: 'payment',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': String(tier.price * 100),
    'line_items[0][price_data][product_data][name]': `US Water Pros ${tier.name} whole-home water system, installed`,
    'metadata[lead_id]': leadId, 'metadata[tier]': tier.id,
    'payment_intent_data[metadata][lead_id]': leadId,
    success_url: `${origin}/thanks?paid=1`, cancel_url: `${origin}/pricing`,
  });
  const email = String(b.email ?? '').trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) f.set('customer_email', email);
  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: f });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.url) { console.error('stripe', j?.error?.message); return NextResponse.json({ ok: false }, { status: 502 }); }
  return NextResponse.json({ ok: true, payment: 'redirect', url: j.url });
}
