import { createClient } from '@supabase/supabase-js';

// Public site only inserts leads (RLS). The schema and CRM live in pepdek/CRMWater.
export const supabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
