import { NextRequest, NextResponse } from 'next/server';
import { badOrigin, rateLimited } from '@/lib/guard';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { TIERS, formatUSD } from '@/lib/pricing';
import { isServedZip } from '@/lib/serviceArea';
import { validOrder } from '@/lib/order';

// Saves the install date, time window and address on the lead the wizard created at the price step.
export async function POST(req: NextRequest) {
  if (badOrigin(req)) return NextResponse.json({ ok: false }, { status: 403 });
  if (rateLimited(req, 'order', 20)) return NextResponse.json({ ok: false }, { status: 429 });
  const b = await req.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true, leadId: crypto.randomUUID() });
  const str = (k: string, n: number) => String(b[k] ?? '').trim().slice(0, n);
  const order = { tier: str('tier', 20), date: str('date', 10), window: str('window', 10), address: str('address', 200) };
  const zip = str('zip', 5);
  if (!validOrder(order as never) || !isServedZip(zip)) return NextResponse.json({ ok: false }, { status: 400 });
  const tier = TIERS.find((t) => t.id === order.tier)!;
  const details = { ...order, zip, price: tier.price, status: 'awaiting_payment' };
  const note = `ORDER: ${tier.name} ${formatUSD(tier.price)} | install ${order.date} ${order.window} | ${order.address}`;
  const leadId = str('leadId', 40);

  const admin = supabaseAdmin();
  if (admin && /^[0-9a-f-]{36}$/i.test(leadId)) {
    // The lead id is visible in the browser, so only an order that is still unpaid and unplaced may be changed through it.
    const { data: cur } = await admin.from('leads').select('paid,order_details').eq('id', leadId).maybeSingle();
    const st = (cur?.order_details as { status?: string } | null)?.status;
    if (!cur || cur.paid || (st && st !== 'awaiting_payment')) return NextResponse.json({ ok: false }, { status: 409 });
    const { error } = await admin.from('leads').update({ order_details: details, address: order.address, notes: note }).eq('id', leadId);
    if (error) { console.error(error); return NextResponse.json({ ok: false }, { status: 500 }); }
    return NextResponse.json({ ok: true, leadId });
  }
  // No service key: store the order as its own lead so nothing is lost.
  const id = crypto.randomUUID();
  const { error } = await supabase().from('leads').insert({
    id, name: str('name', 255) || 'Order', phone: str('phone', 20) || null, email: str('email', 255) || null, zip_code: zip, address: order.address,
    service_type: 'whole-home-water-filtration', page_source: '/pricing', order_details: details, notes: note,
  });
  if (error) { console.error(error); return NextResponse.json({ ok: false }, { status: 500 }); }
  return NextResponse.json({ ok: true, leadId: id });
}
