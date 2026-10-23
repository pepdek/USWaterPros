import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { tierById, formatUSD } from '@/lib/pricing';
import { confirmDeadline } from '@/lib/confirmBy';
import { sendAlert } from '@/lib/alerts';
import { verifyStripeSignature } from '@/lib/stripeSig';

// Stripe tells us a payment finished. We verify the signature, then mark the lead paid and the job scheduled in the CRM.
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();
  if (!secret || !verifyStripeSignature(raw, req.headers.get('stripe-signature') ?? '', secret)) return NextResponse.json({ ok: false }, { status: 400 });
  const ev = JSON.parse(raw);
  if (ev.type !== 'checkout.session.completed') return NextResponse.json({ ok: true });
  const s = ev.data.object;
  const leadId = s.metadata?.lead_id, tier = tierById(s.metadata?.tier ?? '');
  const admin = supabaseAdmin();
  if (!admin || !leadId || !tier || !['paid', 'no_payment_required'].includes(s.payment_status)) { console.error('stripe webhook: cannot record', { leadId, hasAdmin: !!admin }); return NextResponse.json({ ok: true }); }
  const { data } = await admin.from('leads').select('order_details,notes').eq('id', leadId).single();
  const now = new Date().toISOString();
  const { error } = await admin.from('leads').update({
    paid: true, quote_amount: tier.price, final_amount: s.amount_total != null ? s.amount_total / 100 : tier.price, stage: 'job_scheduled', stage_changed_at: now,
    job_date: data?.order_details?.date ?? null, stripe_session_id: s.id, order_details: { ...(data?.order_details ?? {}), status: 'paid', paid_at: now, confirm_by: confirmDeadline(new Date(now)).toISOString() },
    notes: `PAID ${tier.name} via Stripe. ${data?.notes ?? ''}`.slice(0, 1000),
  }).eq('id', leadId);
  if (error) { console.error(error); return NextResponse.json({ ok: false }, { status: 500 }); }
  const charged = s.amount_total != null ? s.amount_total / 100 : tier.price; // what Stripe actually collected (a discount code can make it less than the list price)
  await sendAlert(`PAID: ${tier.name} ${formatUSD(charged)}${charged !== tier.price ? ` (list ${formatUSD(tier.price)})` : ''}`, `Install ${data?.order_details?.date ?? '?'}. Text the customer to confirm the time by ${confirmDeadline(new Date(now)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} Pacific, then mark it confirmed in the CRM.`).catch(console.error);
  return NextResponse.json({ ok: true });
}
