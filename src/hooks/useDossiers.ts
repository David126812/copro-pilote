import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Dossier } from "@/data/mockData";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function mapRow(row: any): Dossier {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    urgency: row.urgency,
    responsible: row.responsible ?? "",
    lastUpdate: formatDate(row.updated_at),
    createdAt: formatDate(row.created_at),
    nextStep: row.next_step ?? "",
    lastAction: row.last_action ?? "",
    timeline: row.timeline ?? [],
    documents: row.documents ?? [],
    prestataires: row.prestataires ?? [],
    syndicHistory: row.syndic_history ?? [],
    blocageReason: row.blocage_reason ?? undefined,
    syndicContact: row.syndic_contact ?? undefined,
    createdViaAgent: row.created_via_agent ?? false,
  };
}

export function useDossiers() {
  return useQuery({
    queryKey: ["dossiers"],
    queryFn: async (): Promise<Dossier[]> => {
      const { data, error } = await supabase
        .from("dossiers")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapRow);
    },
  });
}

export function useDossier(id: string | undefined) {
  return useQuery({
    queryKey: ["dossiers", id],
    queryFn: async (): Promise<Dossier | null> => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("dossiers")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return mapRow(data);
    },
    enabled: !!id,
  });
}
