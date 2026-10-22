import { createClient } from '@supabase/supabase-js';
import { checkUnconfirmed } from '../../lib/unconfirmed';
import { sendAlert } from '../../lib/alerts';

// Hourly: alert if a paid order has not had its confirmation text logged and the deadline is near or past.
export default async () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) { console.warn('unconfirmed-orders skipped: SUPABASE_SERVICE_ROLE_KEY not set'); return; }
  const n = await checkUnconfirmed(createClient(url, key, { auth: { persistSession: false } }), sendAlert);
  console.log(`unconfirmed-orders: ${n} alert(s) sent`);
};

export const config = { schedule: '@hourly' };
