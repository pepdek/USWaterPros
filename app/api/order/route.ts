import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { TIERS, formatUSD } from '@/lib/pricing';
import { isServedZip } from '@/lib/serviceArea';
import { validOrder } from '@/lib/order';

// Saves the install date, time window and address on the lead the wizard created at the price step.
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
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
