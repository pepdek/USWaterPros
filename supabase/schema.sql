create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name varchar(255) not null,
  email varchar(255) not null,
  phone varchar(20),
  zip_code varchar(10) not null,
  service_type varchar(255) not null,
  page_source varchar(255),
  ip_address inet,
  user_agent text,
  status varchar(50) default 'new' check (status in ('new','contacted','converted','lost')),
  notes text,
  contacted_at timestamptz,
  converted_at timestamptz
);
create index idx_leads_created_at on leads(created_at);
create index idx_leads_service_type on leads(service_type);
create index idx_leads_zip_code on leads(zip_code);
-- Inserts happen server-side with the service role (bypasses RLS). Admins = any authenticated user;
-- keep signups disabled in Supabase Auth and create admin users manually.
alter table leads enable row level security;
create policy "admin read" on leads for select to authenticated using (true);
create policy "admin update" on leads for update to authenticated using (true);
