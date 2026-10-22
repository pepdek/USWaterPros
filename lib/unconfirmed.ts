import { confirmDeadline } from './confirmBy';

export type PaidOrder = { id: string; name: string | null; phone: string | null; order_details: Record<string, unknown> | null };

const HOUR = 3600_000;
export const WARN_BEFORE = 6 * HOUR;

// Which alert, if any, a paid order needs right now. Each order is warned once (6h before the deadline) and flagged overdue once.
export function alertFor(o: PaidOrder, now: Date): 'warn' | 'overdue' | null {
  const d = o.order_details ?? {};
  if (d.confirmed_at) return null;
  const by = d.confirm_by ? new Date(String(d.confirm_by)) : d.paid_at ? confirmDeadline(new Date(String(d.paid_at))) : null;
  if (!by || Number.isNaN(by.getTime())) return null;
  if (now >= by && !d.overdue_alerted_at) return 'overdue';
  if (now >= new Date(by.getTime() - WARN_BEFORE) && now < by && !d.warned_at) return 'warn';
  return null;
}

type Admin = { from: (t: string) => any };
// Run hourly. Sends the alerts and records that it did, so nobody is alerted twice.
export async function checkUnconfirmed(admin: Admin, send: (subject: string, text: string) => Promise<void>, now = new Date()) {
  const { data, error } = await admin.from('leads').select('id,name,phone,order_details').eq('paid', true).is('order_details->>confirmed_at', null);
  if (error) throw error;
  let sent = 0;
  for (const o of (data ?? []) as PaidOrder[]) {
    const a = alertFor(o, now);
    if (!a) continue;
    const by = String(o.order_details?.confirm_by ?? '');
    const who = `${o.name ?? 'Customer'} ${o.phone ?? ''}`.trim();
    await send(a === 'overdue' ? 'OVERDUE: paid order not confirmed' : 'Paid order needs a confirmation text', `${who}. Promised by ${by}. Text them the install time, then mark it confirmed in the CRM.`);
    await admin.from('leads').update({ order_details: { ...(o.order_details ?? {}), [a === 'overdue' ? 'overdue_alerted_at' : 'warned_at']: now.toISOString() } }).eq('id', o.id);
    sent++;
  }
  return sent;
}
