-- ============================================
-- CoPro Pilot - Schema + Seed Data
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create dossiers table
create table public.dossiers (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  status text not null default 'en_cours' check (status in ('en_cours', 'bloque', 'termine')),
  urgency text not null default 'normal' check (urgency in ('normal', 'urgent', 'critique')),
  responsible text not null default '',
  next_step text not null default '',
  last_action text not null default '',
  blocage_reason text,
  created_via_agent boolean not null default false,
  timeline jsonb not null default '[]',
  documents jsonb not null default '[]',
  prestataires jsonb not null default '[]',
  syndic_history jsonb not null default '[]',
  syndic_contact jsonb default '{"name": "Cabinet Durand & Associés", "phone": "+33 1 42 86 55 00", "email": "contact@durand-syndic.fr"}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Create published_updates table
create table public.published_updates (
  id text primary key default gen_random_uuid()::text,
  dossier_id text not null references public.dossiers(id) on delete cascade,
  status text not null,
  next_step text,
  push_sent boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. Enable RLS with permissive policies (POC)
alter table public.dossiers enable row level security;
create policy "Allow all for POC" on public.dossiers for all using (true) with check (true);

alter table public.published_updates enable row level security;
create policy "Allow all for POC" on public.published_updates for all using (true) with check (true);

-- 4. Auto-update updated_at on dossiers
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger dossiers_updated_at
  before update on public.dossiers
  for each row execute function public.update_updated_at();

-- ============================================
-- 5. Seed data
-- ============================================

INSERT INTO public.dossiers (id, name, status, urgency, responsible, next_step, last_action, blocage_reason, created_via_agent, timeline, documents, prestataires, syndic_history, created_at, updated_at)
VALUES

-- Infiltration toiture
('6', 'Infiltration toiture bâtiment A', 'en_cours', 'urgent', '', 'À assigner à un membre du CS', 'Signalement reçu', NULL, false,
 '[{"date": "11 fév.", "label": "Signalement copropriétaire", "done": true}]',
 '[]', '[]', '[]',
 '2026-02-11', '2026-02-11'),

-- Ascenseur cabine bloquée
('2', 'Ascenseur cabine bloquée', 'bloque', 'critique', 'Mme. Laurent (CS)', 'Attente pièce détachée', 'Diagnostic technicien effectué',
 'Pièce détachée indisponible chez le fournisseur (délai estimé 3 semaines). L''ascensoriste OTIS a confirmé que la pièce doit être commandée depuis l''usine en Allemagne. Aucune alternative compatible n''est disponible sur le marché français.',
 false,
 '[{"date": "2 fév.", "label": "Signalement gardien", "done": true}, {"date": "2 fév.", "label": "Syndic contacté en urgence", "done": true}, {"date": "2 fév.", "label": "Appel SAV ascensoriste", "done": true}, {"date": "4 fév.", "label": "Diagnostic technicien", "done": true}, {"date": "6 fév.", "label": "Commande pièce détachée", "done": false}, {"date": "—", "label": "Réparation", "done": false}]',
 '[{"name": "Rapport_diagnostic.pdf", "type": "Rapport"}, {"name": "Contrat_maintenance.pdf", "type": "Contrat"}]',
 '[{"name": "OTIS Ascenseurs", "devisStatus": "recu", "montant": "8 500 €"}]',
 '[]',
 '2026-02-02', '2026-02-06'),

-- Ascenseur bâtiment C
('8', 'Ascenseur bâtiment C', 'en_cours', 'critique', 'Mme. Laurent (CS)', 'Relancer syndic + assurance', 'Dernière panne signalée le 5 fév.',
 'Pannes répétées depuis décembre 2025. Le syndic n''a pas donné suite aux 3 relances. Assurance non contactée.',
 true,
 '[{"date": "10 déc.", "label": "1ère panne signalée", "done": true}, {"date": "22 déc.", "label": "Réparation temporaire effectuée", "done": true}, {"date": "28 jan.", "label": "3ème panne — ascenseur bloqué 4h", "done": true}, {"date": "5 fév.", "label": "Signalement via agent vocal", "done": true}, {"date": "10 mars", "label": "Notification push envoyée aux copropriétaires", "done": true}, {"date": "—", "label": "Relance syndic + assurance", "done": false}]',
 '[{"name": "Photos_panne_batC.jpg", "type": "Photos"}, {"name": "Historique_pannes_batC.pdf", "type": "Rapport"}, {"name": "Email_syndic_relance.eml", "type": "Email"}]',
 '[{"name": "OTIS Ascenseurs", "devisStatus": "en_attente"}, {"name": "Schindler", "devisStatus": "pas_de_reponse"}]',
 '[{"syndicName": "Cabinet Durand & Associés", "period": "2023 – présent"}]',
 '2025-12-10', '2026-02-05'),

-- Ravalement façade
('3', 'Ravalement façade', 'en_cours', 'normal', 'M. Bernard (CS)', 'Vote AG — 3 devis à comparer', '3ème devis reçu',
 NULL, false,
 '[{"date": "10 déc.", "label": "Étude préalable lancée", "done": true}, {"date": "20 déc.", "label": "3 entreprises sollicitées", "done": true}, {"date": "15 jan.", "label": "1er devis reçu (BTP Rénov)", "done": true}, {"date": "28 jan.", "label": "2ème devis reçu (Façade Pro)", "done": true}, {"date": "4 fév.", "label": "3ème devis reçu (Bâti France)", "done": true}, {"date": "26 fév.", "label": "Présentation AG", "done": false}, {"date": "—", "label": "Début travaux", "done": false}]',
 '[{"name": "Devis_Entreprise_A.pdf", "type": "Devis"}, {"name": "Devis_Entreprise_B.pdf", "type": "Devis"}, {"name": "Devis_Entreprise_C.pdf", "type": "Devis"}, {"name": "Photos_facade.jpg", "type": "Photos"}]',
 '[{"name": "BTP Rénov", "devisStatus": "recu", "montant": "45 000 €"}, {"name": "Façade Pro", "devisStatus": "recu", "montant": "52 000 €"}, {"name": "Bâti France", "devisStatus": "recu", "montant": "48 500 €"}]',
 '[{"syndicName": "Cabinet Ancien & Fils", "period": "2018 – 2023"}, {"syndicName": "Cabinet Durand & Associés", "period": "2023 – présent"}]',
 '2025-12-10', '2026-02-04'),

-- Éclairage hall défectueux
('4', 'Éclairage hall défectueux', 'termine', 'normal', 'M. Dupont (Syndic)', '—', 'Intervention terminée',
 NULL, false,
 '[{"date": "20 jan.", "label": "Signalement copropriétaire", "done": true}, {"date": "21 jan.", "label": "Syndic contacté", "done": true}, {"date": "23 jan.", "label": "2 entreprises sollicitées", "done": true}, {"date": "25 jan.", "label": "1 devis reçu", "done": true}, {"date": "28 jan.", "label": "Intervention électricien", "done": true}, {"date": "1 fév.", "label": "Clôture dossier", "done": true}]',
 '[{"name": "Facture_electricien.pdf", "type": "Facture"}]',
 '[{"name": "Elec Express", "devisStatus": "recu", "montant": "320 €"}, {"name": "Lumière & Co", "devisStatus": "pas_de_reponse"}]',
 '[]',
 '2026-01-20', '2026-02-01'),

-- Nettoyage insatisfaisant
('5', 'Nettoyage insatisfaisant', 'en_cours', 'normal', 'Mme. Petit (CS)', 'Rendez-vous prestataire', 'Courrier de mise en demeure envoyé',
 NULL, false,
 '[{"date": "25 jan.", "label": "Plaintes copropriétaires (x5)", "done": true}, {"date": "27 jan.", "label": "Constat photos par le CS", "done": true}, {"date": "30 jan.", "label": "Syndic contacté", "done": true}, {"date": "3 fév.", "label": "Courrier mise en demeure envoyé", "done": true}, {"date": "12 fév.", "label": "Rendez-vous de recadrage", "done": false}]',
 '[{"name": "Photos_parties_communes.jpg", "type": "Photos"}, {"name": "Courrier_mise_en_demeure.pdf", "type": "Courrier"}, {"name": "Contrat_nettoyage.pdf", "type": "Contrat"}]',
 '[{"name": "Clean & Net", "devisStatus": "en_attente"}]',
 '[{"syndicName": "Cabinet Durand & Associés", "period": "2023 – présent"}]',
 '2026-01-25', '2026-02-07');
