-- Table for pending dossiers awaiting user confirmation
create table public.pending_dossiers (
  id text primary key default gen_random_uuid()::text,
  sender_phone text not null,
  sender_name text,
  analysis jsonb not null,
  document_url text,
  matched_dossier_id text references public.dossiers(id),
  matched_dossier_name text,
  created_at timestamptz not null default now()
);

alter table public.pending_dossiers enable row level security;
create policy "Allow all for POC" on public.pending_dossiers for all using (true) with check (true);
