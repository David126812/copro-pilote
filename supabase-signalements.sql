-- Table signalements (inbox avant qualification)
create table public.signalements (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  urgency text not null default 'normal' check (urgency in ('normal', 'urgent', 'critique')),
  summary text,
  next_step text,
  sender_name text,
  sender_phone text,
  document_url text,
  status text not null default 'nouveau' check (status in ('nouveau', 'qualifie', 'rejete')),
  dossier_id text references public.dossiers(id),
  raw_analysis jsonb,
  created_at timestamptz not null default now()
);

alter table public.signalements enable row level security;
create policy "Allow all for POC" on public.signalements for all using (true) with check (true);
