import { createClient } from '@supabase/supabase-js';

// Server-only client for the two things the public key cannot do: attach an order to an existing lead and mark it paid.
// Returns null when SUPABASE_SERVICE_ROLE_KEY is not set, and callers fall back to anon inserts.
export const supabaseAdmin = () => {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return key ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, { auth: { persistSession: false } }) : null;
};
