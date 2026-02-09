-- Create leads table
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  phone text not null,
  property_id uuid references public.properties(id),
  status text default 'new'
);

-- Enable RLS
alter table public.leads enable row level security;

-- Policy: Authenticated users (admin) can view all leads
create policy "Admins can view all leads"
  on public.leads for select
  to authenticated
  using (true);

-- Policy: Anyone (anon) can insert leads
create policy "Anyone can insert leads"
  on public.leads for insert
  to anon, authenticated
  with check (true);
